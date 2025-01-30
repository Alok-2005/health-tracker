import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, Workout } from '../../models/user.model';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-workout-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <div class="chart-wrapper">
        <canvas #workoutChart></canvas>
      </div>
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-title">Total Workout Time</div>
          <div class="stat-value">{{getTotalMinutes()}} minutes</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Most Common Workout</div>
          <div class="stat-value">{{getMostCommonWorkout()}}</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Average Session Length</div>
          <div class="stat-value">{{getAverageSessionLength()}} minutes</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .chart-wrapper {
      flex: 1;
      min-height: 0;
      position: relative;
    }

    canvas {
      width: 100% !important;
      height: 100% !important;
    }

    .stats-container {
      display: flex;
      gap: 20px;
      justify-content: space-between;
    }

    .stat-card {
      flex: 1;
      padding: 15px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .stat-title {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 5px;
    }

    .stat-value {
      font-size: 1.2rem;
      color: #333;
      font-weight: 500;
    }
  `]
})
export class WorkoutChartComponent implements OnChanges {
  @Input() user!: User;
  private chart: Chart | undefined;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      this.updateChart();
    }
  }

  private updateChart() {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const workoutData = this.processWorkoutData();
    
    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: workoutData.labels,
        datasets: [{
          label: 'Minutes per Workout Type',
          data: workoutData.data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Minutes'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    });
  }

  private processWorkoutData() {
    const workoutMap = new Map<string, number>();
    
    this.user.workouts.forEach(workout => {
      const current = workoutMap.get(workout.type) || 0;
      workoutMap.set(workout.type, current + workout.minutes);
    });

    return {
      labels: Array.from(workoutMap.keys()),
      data: Array.from(workoutMap.values())
    };
  }

  getTotalMinutes(): number {
    return this.user.workouts.reduce((total, workout) => total + workout.minutes, 0);
  }

  getMostCommonWorkout(): string {
    const workoutCount = new Map<string, number>();
    this.user.workouts.forEach(workout => {
      const count = workoutCount.get(workout.type) || 0;
      workoutCount.set(workout.type, count + 1);
    });

    let maxCount = 0;
    let mostCommon = '';
    workoutCount.forEach((count, type) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = type;
      }
    });

    return mostCommon || 'No workouts yet';
  }

  getAverageSessionLength(): number {
    if (this.user.workouts.length === 0) return 0;
    const total = this.getTotalMinutes();
    return Math.round(total / this.user.workouts.length);
  }
}