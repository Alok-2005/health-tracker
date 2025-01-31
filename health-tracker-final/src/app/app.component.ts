import { Component } from '@angular/core';
import { WorkoutListComponent } from './components/workout-list/workout-list.component';
import { WorkoutFormComponent } from './components/workout-form/workout-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WorkoutListComponent, WorkoutFormComponent],
  template: `
    <div class="app-container">
      <header class="header">
        <h1 class="title">Health Challenge Tracker</h1>
        <div class="wave"></div>
      </header>
      <main class="main-content">
        <app-workout-form class="hover-scale"></app-workout-form>
        <app-workout-list class="hover-scale"></app-workout-list>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
      position: relative;
      overflow: hidden;
      border-radius: 15px;
      padding: 2rem 0;
      background: linear-gradient(135deg, #4A90E2 0%, #6C5CE7 100%);
      color: white;
    }

    .title {
      font-size: 2.5rem;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 30px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
      
    }

    .wave {
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 100%;
      height: 100px;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg"><path fill="%23ffffff" fill-opacity="1" d="M0,160L48,181.3C96,203,192,245,288,250.7C384,256,480,224,576,197.3C672,171,768,149,864,160C960,171,1056,213,1152,208C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>');
    }

    .main-content {
      display: grid;
      gap: 2rem;
      grid-template-columns: 1fr 2fr;
      @media (max-width: 1200px) {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AppComponent {}