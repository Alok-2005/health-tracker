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
    WorkoutChartComponent
  ],
  template: `
    <div class="workout-dashboard p-6">
      <div class="search-filters mb-6">
        <mat-card class="mb-4">
          <mat-card-content>
            <div class="filter-container flex gap-4 items-center flex-wrap">
              <mat-form-field class="flex-1 min-w-[200px]">
                <mat-label>Search Users</mat-label>
                <input matInput [(ngModel)]="searchTerm" (input)="applyFilter()" placeholder="Enter name...">
              </mat-form-field>

              <mat-form-field  class="flex-1 min-w-[200px]">
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

     <div class="content-container grid grid-cols-2 gap-6">
        <div class="table-container">
          <mat-card class="bg-white p-4 rounded-lg shadow-md">
            <mat-card-content>
              <table mat-table [dataSource]="dataSource" class="w-full">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let element">{{element.name}}</td>
                </ng-container>

                <ng-container matColumnDef="workouts">
                  <th mat-header-cell *matHeaderCellDef>Workouts</th>
                  <td mat-cell *matCellDef="let element">
                    <div *ngFor="let workout of element.workouts; let i = index" class="flex items-center justify-between">
                      <span>{{workout.type}} ({{workout.minutes}} mins)</span>
                      <button mat-icon-button color="warn" (click)="deleteWorkout(element.id, i, $event)" class="cursor-pointer">
                        <mat-icon>🗑️</mat-icon>
                      </button>
                    </div>
                  </td>
                </ng-container>

                <ng-container matColumnDef="workoutCount">
                  <th mat-header-cell *matHeaderCellDef>Workout Count</th>
                  <td mat-cell *matCellDef="let element">{{element.workouts.length}}</td>
                </ng-container>

                <ng-container matColumnDef="totalMinutes">
                  <th mat-header-cell *matHeaderCellDef>Total Minutes</th>
                  <td mat-cell *matCellDef="let element">{{getTotalMinutes(element.workouts)}}</td>
                </ng-container>

                <ng-container matColumnDef="actions">
  <th mat-header-cell *matHeaderCellDef>Actions</th>
  <td mat-cell *matCellDef="let element">
    <div class="flex items-center space-x-2">
      <!-- Add Workout Button -->
      <button mat-icon-button matTooltip="Add Workout" (click)="addWorkout(element)" class="cursor-pointer">
        <mat-icon>+</mat-icon>
      </button>

      <!-- Delete User Button -->
      <button mat-icon-button color="warn" matTooltip="Delete User" (click)="deleteUser(element.id, $event)" class="cursor-pointer">
        <mat-icon>🗑️</mat-icon>
      </button>
    </div>
  </td>
</ng-container>


                <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;" (click)="selectUser(row)" [class.selected-row]="selectedUser?.id === row.id"></tr>
              </table>

              <mat-paginator #paginator [pageSize]="5" [pageSizeOptions]="[5, 10, 20]" [length]="dataSource.data.length" [showFirstLastButtons]="true" aria-label="Select page"></mat-paginator>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="chart-container" *ngIf="selectedUser">
          <mat-card class="bg-white p-4 rounded-lg shadow-md">
            <mat-card-header>
              <mat-card-title>
                {{selectedUser.name}}'s Workout Progress
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <app-workout-chart [user]="selectedUser"></app-workout-chart>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .workout-dashboard {
  background-color: #f7fafc; /* Light grayish blue background */
  min-height: 100vh;
  padding: 30px;
}

.search-filters {
  margin-bottom: 24px;
}

.filter-container {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.content-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  cursor: pointer;
}

@media (max-width: 1200px) {
  .content-container {
    grid-template-columns: 1fr;
  }
}

mat-card {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.table-container {
  overflow: auto;
}

.table-container table {
  width: 100%;
}

.selected-row {
  background-color: #e3f2fd; /* Light Blue for selected row */
}

.mat-column-actions {
  text-align: center;
}

button.mat-icon-button {
  color: #4A90E2; /* Blue color for actions */
}

button.mat-icon-button:hover {
  background-color: #e8f0fe; /* Light Blue hover effect */
}

mat-card-title {
  color: #333;
  font-size: 1.2rem;
  font-weight: 500;
}

.mat-paginator {
  margin-top: 16px;
}

.success-snackbar {
  background-color: #4caf50; /* Success Green */
  color: white;
}

.success-snackbar .mat-simple-snackbar-action {
  color: white;
}
  `
  ]
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