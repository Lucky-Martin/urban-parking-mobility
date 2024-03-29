import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {VehicleService} from "../../../services/vehicle.service";

@Component({
  selector: 'app-list-vehicles-modal',
  templateUrl: './list-vehicles-modal.component.html',
  styleUrls: ['./list-vehicles-modal.component.scss'],
})
export class ListVehiclesModalComponent {
  fetching = false;

  constructor(private modalController: ModalController,
              public vehicleService: VehicleService) { }

  async fetchVehicles() {
    this.fetching = true;
    await this.vehicleService.getUserVehicles();

    setTimeout(() => {
      this.fetching = false;
    }, 1000);
  }

  async close() {
    await this.modalController.dismiss();
  }

  async onDelete(registrationNumber: string) {
    console.log(registrationNumber, 'delete')
    await this.vehicleService.deleteVehicle(registrationNumber);
    await this.fetchVehicles();
  }
}
