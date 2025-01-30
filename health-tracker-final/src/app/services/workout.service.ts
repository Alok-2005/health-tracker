import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, Workout } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private readonly STORAGE_KEY = 'workout_users';
  private users: User[] = [];
  private usersSubject = new BehaviorSubject<User[]>([]);
  private isBrowser: boolean;
  deleteUser(userId: number) {
    this.users = this.users.filter(user => user.id !== userId);
    this.saveToLocalStorage();
    this.usersSubject.next([...this.users]);
  }
  private defaultUsers: User[] = [
    {
     id: 1,
      name: 'John Doe',
      workouts: [
        { type: 'Running', minutes: 30, date: new Date('2024-01-30') },
        { type: 'Cycling', minutes: 45, date: new Date('2024-01-30') }
      ]
    },
    {
     id: 2,
      name: 'Jane Smith',
      workouts: [
        { type: 'Swimming', minutes: 60, date: new Date('2024-01-30') },
        { type: 'Running', minutes: 20, date: new Date('2024-01-30') }
      ]
    }
  ];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initializeDefaultUsers();
  }

  private initializeDefaultUsers() {
    if (this.isBrowser) {
      const storedUsers = localStorage.getItem(this.STORAGE_KEY);
      if (storedUsers) {
        try {
          this.users = JSON.parse(storedUsers);
        } catch (e) {
          console.error('Error parsing stored users:', e);
          this.users = this.defaultUsers;
        }
      } else {
        this.users = this.defaultUsers;
        this.saveToLocalStorage();
      }
    } else {
      // If not in browser, use default users
      this.users = this.defaultUsers;
    }
    this.usersSubject.next(this.users);
  }

  private saveToLocalStorage() {
    if (this.isBrowser) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.users));
      } catch (e) {
        console.error('Error saving to localStorage:', e);
      }
    }
  }

  getUsers() {
    return this.usersSubject.asObservable();
  }

  addUser(user: Partial<User>) {
    const lastId = this.users[this.users.length - 1]?.id || 0;
    const newUser: User = {
      id: lastId + 1,
      name: user.name || '',
      workouts: user.workouts || []
    };
    this.users.push(newUser);
    this.saveToLocalStorage();
    this.usersSubject.next([...this.users]);
  }

  addWorkoutToUser(userId: number, workout: Workout) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.workouts.push(workout);
      this.saveToLocalStorage();
      this.usersSubject.next([...this.users]); // Notify subscribers of the change
    }
  }

  getWorkoutTypes(): string[] {
    const types = new Set<string>();
    this.users.forEach(user => {
      user.workouts.forEach(workout => {
        types.add(workout.type);
      });
    });
    return Array.from(types);
  }

  addWorkoutToExistingUser(userId: number, workout: Omit<Workout, 'date'>) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.workouts.push({
        ...workout,
        date: new Date()
      });
      this.saveToLocalStorage();
      this.usersSubject.next([...this.users]); // Notify subscribers of the change
    }
  }

  getUserById(userId: number): User | undefined {
    return this.users.find(u => u.id === userId);
  }

  deleteWorkout(userId: number, workoutIndex: number) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.workouts.splice(workoutIndex, 1);
      this.saveToLocalStorage();
      this.usersSubject.next([...this.users]); // Notify subscribers of the change
    }
  }
}