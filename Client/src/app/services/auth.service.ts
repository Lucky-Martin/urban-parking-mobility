import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {GoogleAuth} from "@codetrix-studio/capacitor-google-auth";
import {Platform} from "@ionic/angular";
import firebase from "firebase/compat/app";
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import {Router} from "@angular/router";
import capacitorConfig from "../../../capacitor.config";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userId!: string;

  constructor(private afAuth: AngularFireAuth,
              private platform: Platform,
              private router: Router) {
    this.platform.ready().then(this.initialise.bind(this));
  }

  initialise() {
    GoogleAuth.initialize({
      clientId: capacitorConfig.plugins?.GoogleAuth.clientId,
      grantOfflineAccess: true,
      scopes: ['profile', 'email']
    });
  }

  // Sign up
  async register(email: string, password: string) {
    try {
      const user = await this.afAuth.createUserWithEmailAndPassword(email, password);
      await this.router.navigateByUrl('home');
      return user.user;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  // Sign in
  async login(email: string, password: string) {
    try {
      const user = await this.afAuth.signInWithEmailAndPassword(email, password);
      await this.router.navigateByUrl('home');
      return user.user;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async googleSignIn() {
    if (this.platform.is('capacitor')) {
      // Use native Google SignIn
      await this.googleSignInMobile()
    } else {
      // Use web Google SignIn
      await this.googleSignInWeb();
    }

    await this.getUserId();
    await this.router.navigateByUrl('home');
  }

  private async googleSignInMobile() {
    const googleUser = await GoogleAuth.signIn();
    // Use the Google token to sign in with Firebase
    const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);
    return await this.afAuth.signInWithCredential(credential);
  }

  private async googleSignInWeb() {
    const provider = new GoogleAuthProvider();
    try {
      return await this.afAuth.signInWithPopup(provider);
    } catch (error) {
      // Handle errors here
      console.error(error);
      return error;
    }
  }

  // Sign out
  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigateByUrl('auth');
    })
  }

  getUserId() {
    return new Promise((resolve, reject) => {
      this.afAuth.user.subscribe(user => {
        if (user) {
          this.userId = user.uid;
          resolve(user?.uid);
        } else {
          reject(null);
        }
      })
    })
  }
}
