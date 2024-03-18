import { Component } from '@angular/core';
import {VehicleService} from "./services/vehicle.service";
import {SettingsComponent} from "./modals/settings/settings.component";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public vehicleService: VehicleService,
              private modalController: ModalController) {}

  async onOpenSettings() {
    const modal = await this.modalController.create({
      component: SettingsComponent,
    });

    await modal.present();
  }
}
