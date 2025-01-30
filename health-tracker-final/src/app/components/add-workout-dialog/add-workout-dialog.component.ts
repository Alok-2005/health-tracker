import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Workout } from '../../models/user.model';

@Component({
  selector: 'app-add-workout-dialog',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Add Workout for {{data.userName}}</h2>
    <mat-dialog-content>
      <form #workoutForm="ngForm">
        <mat-form-field appearance="fill">
          <mat-label>Workout Type</mat-label>
          <input matInput [(ngModel)]="workout.type" name="type" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Minutes</mat-label>
          <input matInput type="number" [(ngModel)]="workout.minutes" name="minutes" required min="1">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" 
              [disabled]="!workoutForm.valid" 
              (click)="onSubmit()">Add Workout</button>
    </mat-dialog-actions>
  `
})
export class AddWorkoutDialogComponent {
  workout: Partial<Workout> = {
    type: '',
    minutes: 0
  };

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