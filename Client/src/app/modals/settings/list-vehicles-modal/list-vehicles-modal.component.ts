import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {VehicleService} from "../../../services/vehicle.service";

@Component({
  selector: 'app-list-vehicles-modal',
  templateUrl: './list-vehicles-modal.component.html',
  styleUrls: ['./list-vehicles-modal.component.scss'],
})
export class ListVehiclesModalComponent implements OnInit {
  fetching = true;
  vehicles: any[] = [];

  constructor(private modalController: ModalController,
              private vehicleService: VehicleService) {
  }

  async ngOnInit() {
    await this.fetchVehicles();
  }

  async fetchVehicles() {
    this.fetching = true;
    (await this.vehicleService.getUserVehicles())?.subscribe(vehicles => {
      console.log(vehicles)
      this.vehicles = vehicles;
      this.fetching = false;
    })
  }

  async close() {
    await this.modalController.dismiss();
  }

  async onDelete(registrationNumber: string) {
    console.log(registrationNumber)
    await this.vehicleService.deleteVehicle(registrationNumber);
    await this.fetchVehicles();
  }
}
