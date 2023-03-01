import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAIN_MENU } from 'src/app/constants/app-routes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string;
  password: string;
  usernameControlForm = new FormGroup({
    username: new FormControl(null, Validators.required),
  });
  passwordControlForm = new FormGroup({
    password: new FormControl(null, Validators.required),
  });

  constructor(private router: Router) {
    this.username = "";
    this.password = "";
  }

  login() {
    console.log("login" + this.username + this.password);
    this.router.navigate(["/" + MAIN_MENU]);
  }
}
