import {Component, ElementRef} from '@angular/core';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loggedIn: boolean;
  authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }
}
