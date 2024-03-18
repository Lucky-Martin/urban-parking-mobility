import { Injectable } from '@angular/core';
import {ToastController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private defaultTimeout = 3000;

  constructor(private toastController: ToastController) { }

  async displayError(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: this.defaultTimeout,
      cssClass: 'toast-danger'
    });

    await toast.present();
  }
}
