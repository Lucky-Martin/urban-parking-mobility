import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import * as leaf from 'leaflet';
import {ParkingService} from "../services/parking.service";
import {Geolocation} from '@capacitor/geolocation';
import {Platform} from "@ionic/angular";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('map') mapRef!: ElementRef<HTMLElement>;
  regions = [{
    parkingId: "id1",
    coordinates: [
      [43.223899, 27.937917],
      [43.223888, 27.938350],
      [43.223795, 27.938350],
      [43.223802, 27.937912]
    ]
  }, {
    parkingId: "id2",
    coordinates: [
      [43.221660, 27.939140],
      [43.221622, 27.940797],
      [43.221271, 27.940783],
      [43.221391, 27.939084]
    ]
  }]
  polygonCoordinates = [
    [
      [43.223899, 27.937917],
      [43.223888, 27.938350],
      [43.223795, 27.938350],
      [43.223802, 27.937912]
    ],
    [
      [43.221660, 27.939140],
      [43.221622, 27.940797],
      [43.221271, 27.940783],
      [43.221391, 27.939084]
    ],
    [
      [43.076242, 27.863746],
      [43.076675, 27.864551],
      [43.075803, 27.865307],
      [43.075432, 27.864537]
    ],
    [
      [43.237361, 27.857417],
      [43.237358, 27.858111],
      [43.237024, 27.858087],
      [43.237059, 27.857329]
    ]
  ];
  private map!: leaf.Map;
  private defaultZoom = 17;

  constructor(private parkingService: ParkingService,
              private platform: Platform,
              private authService: AuthService) {
  }

  async ngAfterViewInit() {
    if (this.platform.is('capacitor')) {
      await Geolocation.requestPermissions();
    }

    await this.createMap();
  }

  toLeafletPath(coordinates: any) {
    return coordinates.map((coord: any) => [coord.lat, coord.lng]);
  }

  async createMap() {

    const {coords} = await Geolocation.getCurrentPosition();
    this.map = leaf.map('map', {zoomControl: false}).setView([coords.latitude, coords.longitude], this.defaultZoom);

    leaf.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 24,
    }).addTo(this.map);

    this.regions.forEach(async region => {
      this.parkingService.fetchParkingById(region.parkingId).subscribe((res: any) => {
        let leafletPath = this.toLeafletPath(region.coordinates);
        //@ts-ignore
        let polygon = leaf.polygon((region.coordinates), {
          color: 'blue',
          fillColor: 'lightblue',
          fillOpacity: 0.5,
        }).addTo(this.map);

        // Calculate the center of the polygon
        let center = polygon.getBounds().getCenter();

        let availableSpaces = 0;
        res.parkingData.forEach((parkingSpace: { status: string }) => {
          if (parkingSpace.status === 'available') {
            availableSpaces += 1;
          }
        });

        // Add text in the center
        leaf.marker(center, {
          icon: leaf.divIcon({
            className: availableSpaces > 0 ? 'map-label' : 'map-label-taken',
            html: availableSpaces > 0 ? `Места ${availableSpaces}` : `Няма места`,
            iconSize: [140, 48],
          })
        }).addTo(this.map);
      });
    })

    // this.polygonCoordinates.forEach((polygonCoord, index) => {
    //
    // });
  }

  async refreshMap() {
    const {coords} = await Geolocation.getCurrentPosition();
    this.map.setView([coords.latitude, coords.longitude], this.defaultZoom)
  }

  calculatePolygonCenter(vertices: any[]) {
    let latSum = 0, lngSum = 0;

    for (const vertex of vertices) {
      latSum += vertex.lat;
      lngSum += vertex.lng;
    }

    return {
      lat: latSum / vertices.length,
      lng: lngSum / vertices.length
    };
  }

  async onSearchLocation(query: string) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const {lat, lon} = data[0];
          this.map.setView([lat, lon], this.defaultZoom);
        } else {
          alert('Адресът не е намерен.');
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  onLogout() {
    this.authService.logout();
  }
}
