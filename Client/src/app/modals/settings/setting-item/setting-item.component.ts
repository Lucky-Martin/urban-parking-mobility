import {Component, Input, OnInit} from '@angular/core';
import {Settings} from "../settings.component";
import {AlertController, ModalController} from "@ionic/angular";
import {ListVehiclesModalComponent} from "../list-vehicles-modal/list-vehicles-modal.component";
import {VehicleService} from "../../../services/vehicle.service";

@Component({
  selector: 'app-setting-item',
  templateUrl: './setting-item.component.html',
  styleUrls: ['./setting-item.component.scss'],
})
export class SettingItemComponent  implements OnInit {
  @Input() settingId!: Settings;

  constructor(private alertController: AlertController,
              private modalController: ModalController,
              public vehicleService: VehicleService) { }

  ngOnInit() {}

  protected readonly Settings = Settings;

  async onAction() {
    switch (this.settingId) {
      case Settings.Vehicle:
        await this.onAddVehicle();
        break;
      case Settings.ListVehicles:
        await this.onListVehicles();
        break;
      case Settings.PayParking:
        console.log('here123')
        await this.vehicleService.listVehicles();
        break;
    }
  }

  async onAddVehicle() {
    const alert = await this.alertController.create({
      header: 'Въведи регистрация',
      message: 'Добави своя регистрационен номер и плащай синя зона бързо, лесно и без грешки',
      buttons: [
        {
          text: 'Затвори',
          role: 'dismiss'
        },
        {
          text: 'Добави',
          role: 'confirm'
        }
      ],
      inputs: [
        {
          placeholder: 'Регистрационен номер',
        }
      ]
    });

    await alert.present();

    const {data, role} = await alert.onDidDismiss();


    if (role === 'confirm') {
      const vehicleId = data.values[0];
      await this.vehicleService.addVehicle(vehicleId);
    } else if (role === 'dismiss') {

    }
  }

  async onListVehicles() {
    const modal = await this.modalController.create({
      component: ListVehiclesModalComponent
    });

    await modal.present();
  }
}
