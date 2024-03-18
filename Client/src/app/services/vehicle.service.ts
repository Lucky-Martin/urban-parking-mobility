import { Injectable } from '@angular/core';
import {SMS} from "@awesome-cordova-plugins/sms";
import {ParkingService} from "./parking.service";
import {AlertController} from "@ionic/angular";
import {AuthService} from "./auth.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private parkingService: ParkingService,
              private alertController: AlertController,
              private authService: AuthService,
              private firestore: AngularFirestore) { }

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

    return this.firestore.collection('vehicles', ref => ref.where('userId', '==', this.authService.userId)).valueChanges();
  }

  async deleteVehicle(vehicleId: string) {
    return this.firestore.doc(`vehicles/${vehicleId}`).delete();
  }

  async listVehicles() {
    (await this.getUserVehicles())?.subscribe(async res => {
      let inputs: any = [];

      res?.forEach((vehicleData: any) => {
        inputs.push({
          label: vehicleData.registrationNumber,
          type: 'radio',
          value: vehicleData.registrationNumber
        })
      });

      const alert = await this.alertController.create({
        header: 'Избери автомобил',
        inputs,
        buttons: [
          {
            text: 'Затвори',
            role: 'dismiss'
          },
          {
            text: 'Избери',
            role: 'confirm'
          }
        ]
      });

      await alert.present();

      const {data, role} = await alert.onDidDismiss();
      if (role === 'confirm') {
        console.log(data)
        await this.sendSms(data.values);
      }
    })
  }

  async sendSms(registrationNumber: string) {
    const phoneNumber = '0000';

    try {
      await SMS.send(phoneNumber, registrationNumber);
    } catch (error) {
      console.error('Error opening SMS app:', error);
    }
  }
}
