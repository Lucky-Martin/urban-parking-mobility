import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {settings} from "ionicons/icons";

export enum Settings {
  Account,
  Vehicle,
  ListVehicles,
  PayParking,
  Premium
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent  implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  async onClose() {
    await this.modalController.dismiss();
  }

  protected readonly settings = settings;
  protected readonly Settings = Settings;
}
