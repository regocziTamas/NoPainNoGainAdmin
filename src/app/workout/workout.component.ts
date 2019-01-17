import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, switchMap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.css']
})
export class WorkoutComponent implements OnInit {

  workout: Workout;
  blocks: any[];

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {
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
  }

  requestWorkout(id: String) {
    this.http.get<Workout>(environment.baseurl + `/workouts/${id}`).subscribe(resp => {
      this.workout = resp;
      console.log(this.workout);
    });
  }



}

interface Workout {
  title: String;
  id: number;
  empty: boolean;
  blocks: Block[];

}

interface Block {
  components: any[];
  order: number;
}

interface Comp {
  order: number;
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
