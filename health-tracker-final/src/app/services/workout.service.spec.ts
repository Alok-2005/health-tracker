import { TestBed } from '@angular/core/testing';
import { WorkoutService } from './workout.service';
import { User } from '../models/user.model';

describe('WorkoutService', () => {
  let service: WorkoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new user', () => {
    const newUser: User = {
      id: 4,
      name: 'New User',
      workouts: [
        { type: 'New Workout', minutes: 10 }
      ]
    };
    service.addUser(newUser);
    expect(service.getUsers().length).toBeGreaterThan(3);
  });
});