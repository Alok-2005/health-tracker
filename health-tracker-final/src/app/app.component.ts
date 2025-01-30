import { Component } from '@angular/core';
import { WorkoutListComponent } from './components/workout-list/workout-list.component';
import { WorkoutFormComponent } from './components/workout-form/workout-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WorkoutListComponent, WorkoutFormComponent],
  template: `
    <div class="app-container">
      <h1 class="text-center text-3xl font-bold my-6">Health Challenge Tracker</h1>
      <app-workout-form></app-workout-form>
      <app-workout-list></app-workout-list>
    </div>
  `,
  styles: [`

   .app-container {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f3f4f6;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease-in-out forwards;
}

h1 {
  color: #4A90E2; /* Bright Blue for header */
  margin-bottom: 20px;
  font-size: 2rem;
  text-align: center;
  letter-spacing: 1px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

  `]
})
export class AppComponent {}