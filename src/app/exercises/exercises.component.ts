import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css']
})
export class ExercisesComponent implements OnInit {

  http: HttpClient;
  exercises: Exercise[];
  targets: String[];
  snackBar: MatSnackBar;

  constructor(http: HttpClient, snackBar: MatSnackBar) {
    this.http = http;
    this.snackBar = snackBar;

  }

  ngOnInit() {
    this.requestExercises();
    this.requestTargets();
  }

  checkAuth() {
    this.http.get(environment.baseurl + '/admin').subscribe(resp => {
      console.log(resp);
    });
  }

  requestExercises() {
    this.http.get<Exercise[]>(environment.baseurl + '/exercises/all').subscribe(resp => {
      this.exercises = resp;
    });
  }

  requestTargets() {
    this.http.get<String[]>(environment.baseurl + '/targets/all').subscribe(resp => {
      this.targets = resp;
    });
  }

  registerNewName(value, id: number) {
    this.getExerciseById(id).name = value;
  }

  registerNewTarget(value, id: number) {
    this.getExerciseById(id).target = value;
  }

  registerNewDescription(value, id: number) {
    this.getExerciseById(id).description = value;
  }

  saveEx(id: number) {
    const ex = this.getExerciseById(id);

    this.http.post(environment.baseurl + '/exercises/save', ex).subscribe(resp => {
      this.snackBar.open('Changes saved successfully!', null, {duration: 2000});
    });
  }

  deleteEx(id: number) {
    this.http.delete(environment.baseurl + `/exercises/${id}`).subscribe(resp => {
      console.log(resp);
      this.snackBar.open('Exercise deleted successfully!', null, {duration: 2000});
      this.requestExercises();
    });
  }

  addExercise() {
    this.http.get(environment.baseurl + '/exercises/add').subscribe(resp => {
      console.log(resp);
      this.requestExercises();
    });
  }

  private getExerciseById(id: number) {
    for (let i = 0; i < this.exercises.length; i++) {
      if (this.exercises[i].id === id) {
        return this.exercises[i];
      }
    }
  }


}

interface Exercise {
  name: String;
  description: string;
  target: string;
  id: number;
}
