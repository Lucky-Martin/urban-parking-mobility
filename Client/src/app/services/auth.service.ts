import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {GoogleAuth} from "@codetrix-studio/capacitor-google-auth";
import {Platform} from "@ionic/angular";
import firebase from "firebase/compat/app";
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import {Router} from "@angular/router";
import capacitorConfig from "../../../capacitor.config";
import {Subject} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userId!: string;
  isAuth!: boolean;
  premiumState: Subject<boolean> = new Subject<boolean>();
  isPremium!: boolean;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private platform: Platform,
              private router: Router) {
    this.platform.ready().then(this.initialise.bind(this));
  }

  async initialise() {
    if (this.platform.is('capacitor')) {
      await GoogleAuth.initialize({
        clientId: capacitorConfig.plugins?.GoogleAuth.clientId,
        grantOfflineAccess: true,
        scopes: ['profile', 'email']
      });
    }

    this.afAuth.authState.subscribe(state => {
      this.isAuth = !!state;
    });

    this.premiumState.subscribe(state => {
      this.isPremium = state;
    });
  }

  // Sign up
  async register(email: string, password: string) {
    try {
      const user = await this.afAuth.createUserWithEmailAndPassword(email, password);
      await this.getUserId();
      await this.router.navigateByUrl('home', {replaceUrl: true});
      return user.user;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  // Sign in
  async login(email: string, password: string) {
    try {
      const user = await this.afAuth.signInWithEmailAndPassword(email, password);
      await this.getUserId();
      await this.router.navigateByUrl('home', {replaceUrl: true});
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
    await this.router.navigateByUrl('home', {replaceUrl: true});
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
  async logout() {
    await this.afAuth.signOut();
    await this.router.navigateByUrl('auth', {replaceUrl: true});
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
