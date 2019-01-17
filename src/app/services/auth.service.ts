import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  performLogin(username: String, password: String) {
    return this.http.post(environment.baseurl + 'login',
      {'username': username, 'password': password},
      {'headers': new HttpHeaders({'Content-Type': 'application/json'}), 'responseType': 'text', observe: 'response'});

  }

  logout() {
    localStorage.removeItem('token');
  }

  loggedIn() {

    let loginstatus = false;
    if (localStorage.getItem('token')) {
      loginstatus = true;
    }

    return loginstatus;
  }
}
