import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import {HttpClientModule} from "@angular/common/http";
import {SearchLocationComponent} from "./search-location/search-location.component";
import {ListVehiclesModalComponent} from "../modals/settings/list-vehicles-modal/list-vehicles-modal.component";
import {ResetMapButtonComponent} from "./reset-map-button/reset-map-button.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        HttpClientModule,
    ],
  declarations: [HomePage, SearchLocationComponent, ListVehiclesModalComponent, ResetMapButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}
