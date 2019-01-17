import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  authService: AuthService;
  router: Router;

  constructor(authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
  }

  ngOnInit() {
  }

  login(usr: String, pwd: String) {
    this.authService.performLogin(usr, pwd).subscribe((res: any) => {
        const token = res.headers.get('Authorization');
        localStorage.setItem('token', token);
        console.log('successful login');
        this.router.navigate([""]);
      },
      error => {
        console.log(error);
        console.log('not successful login');
      });

  }

}
