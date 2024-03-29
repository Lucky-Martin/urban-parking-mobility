import { Component } from '@angular/core';
import {VehicleService} from "./services/vehicle.service";
import {SettingsComponent} from "./modals/settings/settings.component";
import {ModalController} from "@ionic/angular";
import {AuthService} from "./services/auth.service";
import {Geolocation} from "@capacitor/geolocation";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public vehicleService: VehicleService,
              public authService: AuthService,
              private modalController: ModalController) {
    this.initPermissions();
  }

  async onOpenSettings() {
    const modal = await this.modalController.create({
      component: SettingsComponent,
    });

    await modal.present();
  }

  async initPermissions() {
    await Geolocation.requestPermissions();
  }
}
