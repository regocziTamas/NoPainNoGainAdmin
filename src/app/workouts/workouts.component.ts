import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';

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

  navigateToWorkout(id: number){
    this.router.navigate(['/workout', {id: id}] );
  }


}

export interface TitleEntry {
  id: number;
  name: String;
}
