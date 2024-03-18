import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  async onGoogleAuth() {
    const user = await this.authService.googleSignIn();
    console.log(user);
  }
}
