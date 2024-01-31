import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {environment} from "../../environments/environment";
import {GoogleMap} from "@capacitor/google-maps";
import {ParkingService} from "../services/parking.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('map')
  mapRef!: ElementRef<HTMLElement>;
  newMap!: GoogleMap;
  polygonCoordinates = [
    [
      { lat: 43.223899, lng: 27.937917 },
      { lat: 43.223888, lng: 27.938350 },
      { lat: 43.223795, lng: 27.938350 },
      { lat: 43.223802, lng: 27.937912 }
    ],
    [
      { lat: 43.221660, lng: 27.939140 },
      { lat: 43.221622, lng: 27.940797 },
      { lat: 43.221271, lng: 27.940783 },
      { lat: 43.221391, lng: 27.939084 }
    ],
    // 43.076242, 27.863746
    // 43.076675, 27.864551
    // 43.075803, 27.865307
    // 43.075432, 27.864537
    [
      { lat: 43.076242, lng: 27.863746 },
      { lat: 43.076675, lng: 27.864551 },
      { lat: 43.075803, lng: 27.865307 },
      { lat: 43.075432, lng: 27.864537 }
    ]
  ]

  constructor(private parkingService: ParkingService) {
  }

  async ngAfterViewInit() {
    await this.createMap();
  }

  async createMap() {
    this.newMap = await GoogleMap.create({
      id: 'map',
      element: this.mapRef.nativeElement,
      apiKey: environment.MAPS_API_KEY,
      config: {
        center: {
          lat: 43.22379,
          lng: 27.93835,
        },
        zoom: 18,
      },
    });

    // Create the polygon
    const polygon = await this.newMap.addPolygons([
      {
        paths: this.polygonCoordinates,
        strokeColor: 'orange', // Red outline color
        strokeWeight: 2, // Outline width
        fillColor: '#0000FF', // Blue fill color
      }
    ]);

    await this.newMap.setOnMarkerClickListener(marker => {
      this.parkingService.fetchParkingById('id1').subscribe((res: any) => {
        if (res) {
          let taken = res.parkingData.filter((space: any) => {
            return space.status === "taken";
          });

          alert(`${taken.length}/${res.parkingData.length} места за паркиране`);
        }
      })
    });

    await this.newMap.setOnPolygonClickListener(polygon => {
      this.parkingService.fetchParkingById('id1').subscribe((res: any) => {
        if (res) {
          let taken = res.parkingData.filter((space: any) => {
            return space.status === "taken";
          });

          alert(`${taken.length}/${res.parkingData.length} места за паркиране`);
        }
      })
    })

    await this.newMap.enableCurrentLocation(true);
    await this.newMap.enableTrafficLayer(true);

    for (let i = 0; i < this.polygonCoordinates.length; i++) {
      // Calculate the center of the polygon
      const centerLat = (this.polygonCoordinates[i][0].lat + this.polygonCoordinates[i][1].lat + this.polygonCoordinates[i][2].lat) / 3;
      const centerLng = (this.polygonCoordinates[i][0].lng + this.polygonCoordinates[i][1].lng + this.polygonCoordinates[i][2].lng) / 3;

      // Add a text placeholder in the center of the polygon
      await this.newMap.addMarker({
        coordinate: {
          lat: centerLat + 0.0001,
          lng: centerLng - 0.00015,
        },
        iconSize: {
          width: 64,
          height: 64
        },
        iconUrl: "assets/icon/icon-parking.png"
      });
    }
  }
}
