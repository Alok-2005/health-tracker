import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { WorkoutService } from '../../services/workout.service';

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
     <mat-card class="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md transition-all duration-300 ease-in-out">
      <mat-card-header>
        <mat-card-title class="text-2xl font-bold mb-4 text-blue-600">Add New Workout</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="workoutForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="mb-4">
            <mat-form-field appearance="fill" class="w-full">
              <mat-label>User Name</mat-label>
              <input matInput formControlName="userName" placeholder="Enter name" class="border-2 border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500">
              <mat-error *ngIf="workoutForm.get('userName')?.hasError('required')" class="text-red-600">
                Name is required
              </mat-error>
            </mat-form-field>
          </div>

          <div class="mb-4">
            <mat-form-field appearance="fill" class="w-full">
              <mat-label>Workout Type</mat-label>
              <mat-select formControlName="workoutType" (selectionChange)="onWorkoutTypeChange($event)" class="border-2 border-gray-300 p-2 rounded-md">
                <mat-option *ngFor="let type of predefinedWorkoutTypes" [value]="type">{{type}}</mat-option>
                <mat-option value="Other">Other</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="mb-4" *ngIf="showCustomWorkoutField">
            <mat-form-field appearance="fill" class="w-full">
              <mat-label>Custom Workout Type</mat-label>
              <input matInput formControlName="customWorkoutType" placeholder="Enter workout type" class="border-2 border-gray-300 p-2 rounded-md">
            </mat-form-field>
          </div>

          <div class="mb-4">
            <mat-form-field appearance="fill" class="w-full">
              <mat-label>Duration (minutes)</mat-label>
              <input matInput type="number" formControlName="minutes" placeholder="Enter duration" class="border-2 border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500">
            </mat-form-field>
          </div>
          
          <button mat-raised-button color="primary" type="submit" class="w-full py-3 text-white">Save Workout</button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: []
})
export class WorkoutFormComponent implements OnInit {
  workoutForm: FormGroup;
  showCustomWorkoutField = false;
  predefinedWorkoutTypes = ['Running', 'Swimming', 'Yoga', 'Cycling', 'Weight Training', 'HIIT'];

  constructor(
    private fb: FormBuilder,
    private workoutService: WorkoutService,
    private snackBar: MatSnackBar
  ) {
    this.workoutForm = this.fb.group({
      userName: ['', Validators.required],
      workoutType: ['', Validators.required],
      customWorkoutType: [''],
      minutes: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {}

  onWorkoutTypeChange(event: any) {
    const value = event.value;
    this.showCustomWorkoutField = value === 'Other';
    
    if (this.showCustomWorkoutField) {
      this.workoutForm.get('customWorkoutType')?.setValidators(Validators.required);
    } else {
      this.workoutForm.get('customWorkoutType')?.clearValidators();
      this.workoutForm.get('customWorkoutType')?.setValue('');
    }
    this.workoutForm.get('customWorkoutType')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.workoutForm.valid) {
      const formValue = this.workoutForm.value;
      const workoutType = formValue.workoutType === 'Other' ? 
        formValue.customWorkoutType : formValue.workoutType;
  
      const existingUser = this.workoutService.getUserById(formValue.userId);
  
      if (existingUser) {
        this.workoutService.addWorkoutToExistingUser(formValue.userId, {
          type: workoutType,
          minutes: formValue.minutes
        });
        this.snackBar.open('Workout added successfully', 'Close', {
          duration: 3000,
        });
      } else {
        this.workoutService.addUser({
          name: formValue.userName,
          workouts: [{
            type: workoutType,
            minutes: formValue.minutes,
            date: new Date()
          }]
        });
        this.snackBar.open('New user and workout added successfully!', 'Close', {
          duration: 3000,
        });
      }
  
      this.resetForm();
    }
  }

  resetForm() {
    this.workoutForm.reset();
    this.showCustomWorkoutField = false;
    this.snackBar.open('Form has been reset', 'Close', {
      duration: 3000,
    });
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