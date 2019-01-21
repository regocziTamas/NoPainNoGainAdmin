import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.css']
})
export class WorkoutsComponent implements OnInit {

  http: HttpClient;
  entries: TitleEntry[];
  router: Router;

  constructor(http: HttpClient, router: Router) {
    this.http = http;
    this.router = router;
  }

  ngOnInit() {
    this.requestWorkoutTitles();
  }

  requestWorkoutTitles() {
    this.http.get<TitleEntry[]>(environment.baseurl + '/workouts/names').subscribe(resp => {
      this.entries = resp;
      console.log(this.entries);
    });

  }

  navigateToWorkout(id: number) {
    this.router.navigate(['/workout', {id: id}]);
  }

  addNewWorkout() {
    this.http.get<{id: number}>(environment.baseurl + '/workouts/add-new').subscribe(resp => {
      console.log(resp.id);
      this.router.navigate(['/workout', {id: resp.id}]);
    });
  }


}

export interface TitleEntry {
  id: number;
  name: String;
}
