import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Workout } from '../../models/user.model';

@Component({
  selector: 'app-add-workout-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatDialogModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container p-6">
      <div class="dialog-header mb-6">
        <h2 class="text-2xl font-bold text-gray-800 flex items-center">
          <mat-icon class="mr-2">fitness_center</mat-icon>
          Add Workout for {{data.userName}}
        </h2>
      </div>

      <form #workoutForm="ngForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="form-group">
          <mat-form-field  class="w-full">
            <mat-label>Workout Type</mat-label>
            <mat-select 
              [(ngModel)]="workout.type" 
              name="type" 
              required
              #typeControl="ngModel">
              <mat-option *ngFor="let type of workoutTypes" [value]="type">
                {{type}}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="typeControl.invalid && typeControl.touched">
              Please select a workout type
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-group">
          <mat-form-field  class="w-full">
            <mat-label>Duration (minutes)</mat-label>
            <input 
              matInput 
              type="number" 
              [(ngModel)]="workout.minutes" 
              name="minutes"
              required
              min="1"
              #minutesControl="ngModel">
            <mat-error *ngIf="minutesControl.invalid && minutesControl.touched">
              Please enter a valid duration
            </mat-error>
          </mat-form-field>
        </div>

        <div class="dialog-actions flex justify-end space-x-3">
          <button 
            mat-stroked-button 
            type="button"
            (click)="onCancel()"
            class="cancel-button">
            Cancel
          </button>
          <button 
            mat-raised-button 
            color="primary"
            type="submit"
            [disabled]="!workoutForm.form.valid"
            class="submit-button">
            Add Workout
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 400px;
    }

    .dialog-header {
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      padding-bottom: 1rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .cancel-button {
      border-color: rgba(0, 0, 0, 0.12);
    }

    .submit-button {
      min-width: 120px;
    }

    mat-form-field {
      width: 100%;
    }

    .dialog-actions {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(0, 0, 0, 0.12);
    }
  `]
})
export class AddWorkoutDialogComponent {
  workout: Partial<Workout> = {
    type: '',
    minutes: undefined
  };

  workoutTypes = [
    'Running',
    'Walking',
    'Cycling',
    'Swimming',
    'Weight Training',
    'Yoga',
    'HIIT',
    'Pilates',
    'Basketball',
    'Soccer'
  ];

  constructor(
    public dialogRef: MatDialogRef<AddWorkoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number; userName: string }
  ) {}

  onSubmit(): void {
    if (this.workout.type && this.workout.minutes && this.workout.minutes > 0) {
      this.dialogRef.close(this.workout);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}