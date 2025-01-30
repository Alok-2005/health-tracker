import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutListComponent } from './workout-list.component';
import { WorkoutService } from '../../services/workout.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { User } from '../../models/user.model';

describe('WorkoutListComponent', () => {
  let component: WorkoutListComponent;
  let fixture: ComponentFixture<WorkoutListComponent>;
  let workoutService: jasmine.SpyObj<WorkoutService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      workouts: [
        { type: 'Running', minutes: 30, date: new Date() },
        { type: 'Cycling', minutes: 45, date: new Date() }
      ]
    }
  ];

  beforeEach(async () => {
    const workoutServiceSpy = jasmine.createSpyObj('WorkoutService', ['getUsers', 'getWorkoutTypes', 'addWorkoutToExistingUser']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    workoutServiceSpy.getUsers.and.returnValue(of(mockUsers));
    workoutServiceSpy.getWorkoutTypes.and.returnValue(['Running', 'Cycling']);

    await TestBed.configureTestingModule({
      imports: [WorkoutListComponent, NoopAnimationsModule],
      providers: [
        { provide: WorkoutService, useValue: workoutServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    workoutService = TestBed.inject(WorkoutService) as jasmine.SpyObj<WorkoutService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(workoutService.getUsers).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockUsers);
  });

  it('should filter users by search term', () => {
    component.searchTerm = 'John';
    component.applyFilter();
    expect(component.dataSource.filteredData.length).toBe(1);

    component.searchTerm = 'xyz';
    component.applyFilter();
    expect(component.dataSource.filteredData.length).toBe(0);
  });

  it('should filter users by workout type', () => {
    component.workoutTypeFilter = 'Running';
    component.applyFilter();
    expect(component.dataSource.filteredData.length).toBe(1);

    component.workoutTypeFilter = 'Swimming';
    component.applyFilter();
    expect(component.dataSource.filteredData.length).toBe(0);
  });

  it('should calculate total minutes correctly', () => {
    const total = component.getTotalMinutes(mockUsers[0].workouts);
    expect(total).toBe(75);
  });

  it('should get workout summary correctly', () => {
    const summary = component.getWorkoutSummary(mockUsers[0].workouts);
    expect(summary).toBe('Running, Cycling');
  });

  it('should show chart when clicking show chart button', () => {
    component.showChart(mockUsers[0]);
    expect(component.selectedUser).toBe(mockUsers[0]);
  });

  it('should open dialog when adding workout', () => {
    dialog.open.and.returnValue({
      afterClosed: () => of({ type: 'Running', minutes: 30 })
    } as any);

    component.addWorkout(mockUsers[0]);
    expect(dialog.open).toHaveBeenCalled();
    expect(workoutService.addWorkoutToExistingUser).toHaveBeenCalled();
  });
});