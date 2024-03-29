import { Injectable } from '@angular/core';
import {SMS} from "@awesome-cordova-plugins/sms";
import {AlertController, LoadingController} from "@ionic/angular";
import {AuthService} from "./auth.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  inputs: any[] = [];

  constructor(private loadingController: LoadingController,
              private alertController: AlertController,
              private authService: AuthService,
              private firestore: AngularFirestore) {
    this.getUserVehicles();
  }

  async addVehicle(registrationNumber: string) {
    let userId: string = this.authService.userId;
    if (!userId) {
      userId = await this.authService.getUserId() as string;
      if (!userId) return;
    }

    const id = this.firestore.createId();
    return this.firestore.doc(`vehicles/${id}`).set({
      id,
      userId,
      registrationNumber
    });
  }

  async getUserVehicles() {
    let userId: string = this.authService.userId;
    if (!userId) {
      userId = await this.authService.getUserId() as string;
      if (!userId) return;
    }

    this.firestore.collection('vehicles', ref => ref.where('userId', '==', this.authService.userId)).valueChanges().subscribe(res => {
      this.inputs = [];

      res?.forEach((vehicleData: any) => {
        this.inputs.push({
          label: vehicleData.registrationNumber,
          type: 'radio',
          value: vehicleData.registrationNumber,
          uid: vehicleData.id
        })
      });
    });
  }

  async deleteVehicle(vehicleId: string) {
    return this.firestore.doc(`vehicles/${vehicleId}`).delete();
  }

  async openVehicleList() {
    const alert = await this.alertController.create({
      header: 'Избери автомобил',
      inputs: this.inputs,
      buttons: [
        {
          text: 'Затвори',
          role: 'dismiss'
        },
        {
          text: 'Избери',
          role: 'confirm',
          handler: (data) => {
            if (!data) {
              return false;
            }
            if (typeof data !== 'string' && !data.values) {
              return false;
            }

            return true;
          }
        }
      ]
    });

    await alert.present();

    const {data, role} = await alert.onDidDismiss();
    if (role === 'confirm') {
      const loadingElement = await this.loadingController.create({
        message: "Зарежда",
        spinner: "crescent"
      })

      await loadingElement.present();
      await this.sendSms(data.values);
      await loadingElement.dismiss();
    }
  }

  async sendSms(registrationNumber: string) {
    const phoneNumber = '1352';

    try {
      await SMS.send(phoneNumber, registrationNumber);
    } catch (error) {
      console.error('Error opening SMS app:', error);
    }
  }
}
