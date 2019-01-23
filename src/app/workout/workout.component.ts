import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, switchMap} from 'rxjs/operators';
import {Subscription, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.css'],
  providers: []
})
export class WorkoutComponent implements OnInit, OnDestroy {

  workout: Workout;
  dialog: MatDialog;
  exercises: Exercise[];
  allSaved = true;


  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, dialog: MatDialog) {
    this.dialog = dialog;
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return id;
      }),
      catchError(err => {
        this.router.navigate(['workouts']);
        return throwError(err.toString());
      })
    ).subscribe(id => {
      console.log(id);
      this.requestWorkout(id);
    });
    this.requestExercises();

  }

  registerNewName(value) {
    console.log(value);
    this.workout.title = value;
    this.allSaved = false;
  }

  requestWorkout(id: String) {
    this.http.get<Workout>(environment.baseurl + `/workouts/${id}`).subscribe(resp => {
      if (resp === null) {
        this.router.navigate(['/workouts']);
      }
      this.workout = resp;
    });
  }

  drop(event: CdkDragDrop<string[]>, id: number) {
    moveItemInArray(this.workout.blocks[id].components, event.previousIndex, event.currentIndex);
    this.reorderBlock(id);
    this.allSaved = false;
  }

  private reorderBlock(order: number) {
    for (let i = 0; i < this.workout.blocks[order].components.length; i++) {
      this.workout.blocks[order].components[i].order = i;
    }
  }

  private reorderWorkoutBlocks() {
    for (let i = 0; i < this.workout.blocks.length; i++) {
      this.workout.blocks[i].order = i;
    }
  }

  requestExercises() {
    this.http.get<Exercise[]>(environment.baseurl + '/exercises/all').subscribe(resp => {
      this.exercises = resp;
    });
  }

  private findExerciseById(id: number) {
    for (let i = 0; i < this.exercises.length; i++) {
      if (this.exercises[i].id === id) {
        return this.exercises[i];
      }
    }
  }

  WExerciseEdit(blockOrder: number, componentOrder: number) {

    let wex: WExercise;
    wex = this.workout.blocks[blockOrder].components[componentOrder] as WExercise;
    console.log(wex);

    const dialogRef = this.dialog.open(EditExerciesDialogComponent, {
      width: '400px',
      data: {'exerciseName': wex.exercise.name, 'exerciseId': wex.exercise.id, 'reps': wex.reps, 'all': this.exercises}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        console.log('no changes');
        return;
      }

      const exer: WExercise = {
        reps: result.reps,
        exercise: this.findExerciseById(result.exerciseId),
        order: componentOrder,
        type: 'WorkoutExercise'
      };
      this.workout.blocks[blockOrder].components[componentOrder] = exer;
      this.allSaved = false;

    });
  }

  WRestEdit(blockOrder: number, componentOrder: number) {
    let rest: Rest;
    rest = this.workout.blocks[blockOrder].components[componentOrder] as Rest;
    const dialogRef = this.dialog.open(EditRestDialogComponent, {
      width: '250px',
      data: {'duration': rest.durationInMilis / 1000}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        console.log('no changes');
        return;
      }
      const newRest: Rest = {type: 'Rest', order: componentOrder, durationInMilis: result.duration * 1000};
      this.workout.blocks[blockOrder].components[componentOrder] = newRest;
      this.allSaved = false;

    });
  }

  addNewExercise(blockId: number) {
    const newOrder = this.workout.blocks[blockId].components.length;
    const ex: WExercise = {reps: 10, exercise: this.findExerciseById(1), type: 'WorkoutExercise', order: newOrder};
    this.workout.blocks[blockId].components.push(ex);
    this.allSaved = false;
    this.WExerciseEdit(blockId, newOrder);

  }

  addNewRest(blockOrder: number) {
    const newOrder = this.workout.blocks[blockOrder].components.length;
    const rest: Rest = {type: 'Rest', durationInMilis: 5000, order: newOrder};
    this.workout.blocks[blockOrder].components.push(rest);
    this.allSaved = false;
    this.WRestEdit(blockOrder, newOrder);
  }

  addBlock() {
    const newOrder = this.workout.blocks.length;
    let compList: Comp[] = [];
    const block: Block = {order: newOrder, components: compList};
    this.allSaved = false;
    this.workout.blocks.push(block);
  }

  deleteBlock(blockOrder: number) {
    this.workout.blocks.splice(blockOrder, 1);
    this.allSaved = false;
    this.reorderWorkoutBlocks();
  }

  deleteComponent(blockOrder: number, compOrder: number) {
    this.workout.blocks[blockOrder].components.splice(compOrder, 1);
    this.allSaved = false;
    this.reorderBlock(blockOrder);
  }

  moveBlockUp(order: number) {
    if (order > 0) {
      const temp = this.workout.blocks[order];
      this.workout.blocks[order] = this.workout.blocks[order - 1];
      this.workout.blocks[order - 1] = temp;
      this.reorderWorkoutBlocks();
      this.allSaved = false;
    }
  }

  moveBlockDown(order: number) {
    if (order < this.workout.blocks.length - 1) {
      const temp = this.workout.blocks[order];
      this.workout.blocks[order] = this.workout.blocks[order + 1];
      this.workout.blocks[order + 1] = temp;
      this.reorderWorkoutBlocks();
      this.allSaved = false;
    }
  }

  saveChanges() {
    if (!this.allSaved) {
      console.log('save called');
      this.http.post(environment.baseurl + `/workouts/${this.workout.id}`, this.workout).subscribe(resp => {
        console.log(resp);
        this.allSaved = true;
      });
    }
  }

  ngOnDestroy() {
    if (!this.allSaved) {
      this.saveChanges();
    }
  }

  deleteWorkout() {
    this.http.delete(environment.baseurl + `/workouts/${this.workout.id}`).subscribe(resp => {
      this.router.navigate(['/workouts']);
    });
  }


}

@Component({
  selector: 'app-edit-exercise-dialog',
  templateUrl: 'edit-exercise-dialog.html',
})
export class EditExerciesDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EditExerciesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { exerciseName: String, exerciseId: number, reps: number, all: Exercise[] }) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-edit-rest-dialog',
  templateUrl: 'edit-rest-dialog.html',
})
export class EditRestDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EditRestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { duration: number }) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

interface Workout {
  title: String;
  id: number;
  empty: boolean;
  blocks: Block[];

}

interface Block {
  components: Comp[];
  orderId: number;
  id: number;
}

interface Comp {
  orderId: number;
  id: number;
}

interface WExercise extends Comp {
  type: String;
  reps: number;
  exercise: Exercise;
}

interface Rest extends Comp {
  type: String;
  durationInMilis: number;
}

interface Exercise {
  name: String;
  description: string;
  target: string;
  id: number;
}
