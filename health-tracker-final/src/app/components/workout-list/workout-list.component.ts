import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AddWorkoutDialogComponent } from '../add-workout-dialog/add-workout-dialog.component';
import { WorkoutChartComponent } from '../workout-chart/workout-chart.component';
import { WorkoutService } from '../../services/workout.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-workout-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatButtonModule,
    WorkoutChartComponent
  ],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Workout Dashboard</h1>
        <p class="text-gray-600 mb-6">Track and manage user workouts</p>
      </header>

      <div class="search-filters">
        <mat-card class="filter-card">
          <mat-card-content>
            <div class="filter-container">
              <mat-form-field  class="search-field">
                <mat-label>Search Users</mat-label>
                <mat-icon matPrefix class="text-gray-400"></mat-icon>
                <input matInput [(ngModel)]="searchTerm" (input)="applyFilter()" placeholder="Enter name...">
              </mat-form-field>

              <mat-form-field  class="type-field">
                <mat-label>Workout Type</mat-label>
                <mat-select [(ngModel)]="workoutTypeFilter" (selectionChange)="applyFilter()">
                  <mat-option value="">All Types</mat-option>
                  <mat-option *ngFor="let type of workoutTypes" [value]="type">
                    {{type}}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="content-grid">
        <mat-card class="table-card">
          <mat-card-header>
            <mat-card-title class="text-lg font-semibold">User Workouts</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="table-responsive">
              <table mat-table [dataSource]="dataSource" class="workout-table">
                <!-- Name Column -->
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let element" class="font-medium">{{element.name}}</td>
                </ng-container>

                <!-- Workouts Column -->
               <ng-container matColumnDef="workouts">
  <th mat-header-cell *matHeaderCellDef>Workouts</th>
  <td mat-cell *matCellDef="let element">
    <div *ngFor="let workout of element.workouts; let i = index" class="workout-item">
      <span class="workout-type">{{workout.type}}</span>
      <span class="workout-duration">{{workout.minutes}} mins</span>
      <button mat-icon-button color="warn" 
              (click)="deleteWorkout(element.id, i, $event)"
              matTooltip="Delete workout"
              class="delete-btn">
        <mat-icon>🗑️</mat-icon>
      </button>
    </div>
  </td>
</ng-container>

                <!-- Workout Count Column -->
                <ng-container matColumnDef="workoutCount">
                  <th mat-header-cell *matHeaderCellDef>Total Workouts</th>
                  <td mat-cell *matCellDef="let element" class="text-center">
                    <span class="workout-count">{{element.workouts.length}}</span>
                  </td>
                </ng-container>

                <!-- Total Minutes Column -->
                <ng-container matColumnDef="totalMinutes">
                  <th mat-header-cell *matHeaderCellDef>Total Minutes</th>
                  <td mat-cell *matCellDef="let element" class="text-center">
                    <span class="total-minutes">{{getTotalMinutes(element.workouts)}}</span>
                  </td>
                </ng-container>

                <!-- Actions Column -->
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let element">
                    <div class="action-buttons">
                      <button mat-mini-fab color="primary" 
                              (click)="addWorkout(element)"
                              matTooltip="Add workout">
                        <mat-icon>+</mat-icon>
                      </button>
                      <button mat-mini-fab color="warn" 
                              (click)="deleteUser(element.id, $event)"
                              matTooltip="Delete user ">
                        <mat-icon>🗑️</mat-icon>
                      </button>
                    </div>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                    (click)="selectUser(row)" 
                    [class.selected-row]="selectedUser?.id === row.id"
                    class="table-row"></tr>
              </table>

              <mat-paginator #paginator 
                           [pageSize]="5" 
                           [pageSizeOptions]="[5, 10, 20]" 
                           [length]="dataSource.data.length" 
                           [showFirstLastButtons]="true" 
                           aria-label="Select page">
              </mat-paginator>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card" *ngIf="selectedUser">
          <mat-card-header>
            <mat-card-title class="text-lg font-semibold">
              {{selectedUser.name}}'s Progress
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <app-workout-chart [user]="selectedUser"></app-workout-chart>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      background-color: #f8fafc;
      min-height: 100vh;
      padding: 2rem;
    }
.workout-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px; /* Adjust padding as needed */
  border-bottom: 1px solid #ccc; /* Optional: adds a border for separation */
}

.workout-type, .workout-duration {
  margin-right: 16px; /* Adds space between text and button */
}

.delete-btn {
  padding: 0 8px; /* Adjust button padding */
}
    .dashboard-header {
      margin-bottom: 2rem;
    }

    .filter-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      margin-bottom: 2rem;
    }

    .filter-container {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .search-field, .type-field {
      flex: 1;
      min-width: 250px;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 2rem;
    }

    @media (max-width: 1200px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    .table-card, .chart-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .workout-table {
      width: 100%;
    }

    .workout-item {
      display: flex;
      align-items: center;
      padding: 0.5rem 0;
      gap: 1rem;
    }

    .workout-type {
      font-weight: 500;
      color: #4f46e5;
    }

    .workout-duration {
      color: #6b7280;
    }

    .workout-count, .total-minutes {
      font-weight: 500;
      color: #1f2937;
    }

    .action-buttons {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-start;
      align-items: center;
    }

    .table-row {
      transition: background-color 0.2s ease;
    }

    .table-row:hover {
      background-color: #f3f4f6;
      cursor: pointer;
    }

    .selected-row {
      background-color: #e0e7ff !important;
    }

    .delete-btn {
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }

    .delete-btn:hover {
      opacity: 1;
    }

    .mat-mdc-card-header {
      padding: 1rem 1rem 0 1rem;
    }

    .mat-mdc-card-content {
      padding: 1rem;
    }

    ::ng-deep .success-snackbar {
      background-color: #10b981;
      color: white;
    }

    ::ng-deep .success-snackbar .mat-simple-snackbar-action {
      color: white;
    }
  `]
})
export class WorkoutListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['name', 'workouts', 'workoutCount', 'totalMinutes', 'actions'];
  dataSource = new MatTableDataSource<User>();
  searchTerm = '';
  workoutTypeFilter = '';
  selectedUser: User | null = null;
  workoutTypes: string[] = [];

  constructor(
    private workoutService: WorkoutService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  selectUser(user: User) {
    this.selectedUser = user;
    this.showToast(`Selected ${user.name}'s workouts`);
  }

  ngOnInit() {
    this.workoutService.getUsers().subscribe(users => {
      this.dataSource.data = users;
      this.workoutTypes = this.workoutService.getWorkoutTypes();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.createFilter();
  }

  private createFilter(): (data: User, filter: string) => boolean {
    return (data: User, filter: string): boolean => {
      const filterValue = JSON.parse(filter);
      
      const nameMatch = data.name.toLowerCase().includes(filterValue.searchTerm);
      const typeMatch = !filterValue.workoutTypeFilter || 
        data.workouts.some(w => w.type.toLowerCase() === filterValue.workoutTypeFilter);
      
      return nameMatch && typeMatch;
    };
  }

  applyFilter() {
    this.dataSource.filter = JSON.stringify({
      searchTerm: this.searchTerm.trim().toLowerCase(),
      workoutTypeFilter: this.workoutTypeFilter.toLowerCase()
    });
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getWorkoutSummary(workouts: any[]): string {
    return workouts.map(w => `${w.type}`).join(', ');
  }

  getTotalMinutes(workouts: any[]): number {
    return workouts.reduce((total, w) => total + w.minutes, 0);
  }

  addWorkout(user: User) {
    const dialogRef = this.dialog.open(AddWorkoutDialogComponent, {
      width: '400px',
      data: { userId: user.id, userName: user.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.workoutService.addWorkoutToExistingUser(user.id, result);
        this.workoutService.getUsers().subscribe(users => {
          this.dataSource.data = users;
          this.showToast(`New workout added for ${user.name}`);
        });
      }
    });
  }
  deleteWorkout(userId: number, workoutIndex: number, event: Event) {
    event.stopPropagation(); // Prevent row selection when clicking delete
    this.workoutService.deleteWorkout(userId, workoutIndex);
    this.showToast('Workout deleted successfully');
  }

  deleteUser(userId: number, event: Event) {
    event.stopPropagation(); // Prevent row selection when clicking delete
    this.workoutService.deleteUser(userId);
    if (this.selectedUser?.id === userId) {
      this.selectedUser = null;
    }
    this.showToast('User deleted successfully');
  }

  private showToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

}