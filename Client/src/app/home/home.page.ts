import { AfterViewInit, Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as leaf from 'leaflet';
import { ParkingService } from "../services/parking.service";
import { Geolocation } from '@capacitor/geolocation';
import { LoadingController, Platform } from "@ionic/angular";
import { AuthService } from "../services/auth.service";
import { regionsData } from "../data/regions.data";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('map') mapRef!: ElementRef<HTMLElement>;
  private initialMapCreated = false;
  private currentMapPremiumState = false;
  private loadingElement!: HTMLIonLoadingElement;
  private map!: leaf.Map;
  private defaultZoom = 17;
  private parkingMarkers: Record<string, leaf.Marker> = {};
  private intervalId?: number;
  private allowedIdsDemo: string[] = ["id1", "id3"];

  constructor(private parkingService: ParkingService,
              private afs: AngularFirestore,
              private platform: Platform,
              private router: Router,
              private loadingController: LoadingController,
              private authService: AuthService) {}

  async ngOnInit() {
    // this.loadingElement = await this.loadingController.create({
    //   message: "Зарежда",
    //   spinner: "crescent"
    // });
    // await this.loadingElement.present();

    this.authService.getUserId().then(userId => {
      this.afs.doc(`users/${userId}`).get().toPromise()
        .then((docSnapshot: any) => {
          const userData = docSnapshot.data();
          console.log('fetched next', userData && userData.premium)
          this.authService.premiumState.next(userData && userData.premium)
        })
        .catch(error => {
          console.error('Error fetching user data: ', error);
        });
    });

    this.authService.premiumState.subscribe(async (isPremium) => {
      console.log('Premium state changed:', isPremium);
      if (this.currentMapPremiumState !== isPremium) {
        this.currentMapPremiumState = isPremium;
        await this.refreshMapData();
      }
    });
  }

  async ngAfterViewInit() {
    if (this.platform.is('capacitor')) {
      await Geolocation.requestPermissions();
    }
    await this.createMap();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private async createMap() {
    const {coords} = await Geolocation.getCurrentPosition();
    this.map = leaf.map('map', {zoomControl: false}).setView([coords.latitude, coords.longitude], this.defaultZoom);
    leaf.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 24,
    }).addTo(this.map);

    console.log('here', this.loadingElement)
    if (this.loadingElement) {
      await this.loadingElement.dismiss();
    }

    await this.refreshMapData();

    // Set interval for refreshing map data
    this.intervalId = setInterval(async () => {
      await this.refreshMapData();
    }, 5000); // Refresh every 5 seconds
  }

  private async refreshMapData() {
    let i = 0;
    if (!regionsData) return;
    for (const region of regionsData.regions) {
      this.parkingService.fetchParkingById(region.parkingId).subscribe((res: any) => {
        i++;
        this.addParkingMarker(region, res['parkingData'], (!this.currentMapPremiumState && !this.allowedIdsDemo.includes(region.parkingId)));
      });
    }
  }

  private addParkingMarker(region: { parkingId: string, coordinates: number[][] }, parkingData: any, lock?: boolean) {
    //@ts-ignore
    let polygon = leaf.polygon(region.coordinates, {
      color: 'blue',
      fillColor: 'lightblue',
      fillOpacity: 0.5,
    }).addTo(this.map);
    let center = polygon.getBounds().getCenter();
    let availableSpaces = parkingData.reduce((acc: number, {status}: {status: string}) => acc + (status === 'available' ? 1 : 0), 0);
    const premiumLabel = `<ion-icon name="diamond-outline" class="ion-margin-end"></ion-icon> Абонамент`;
    const labelHtml = lock ? premiumLabel : `${availableSpaces}/${parkingData.length} свободни`;
    if (this.parkingMarkers[region.parkingId]) {
      // Update the existing marker's label
      this.parkingMarkers[region.parkingId].setLatLng(center).setIcon(leaf.divIcon({
        className: lock ? 'map-label-subscribe' : 'map-label',
        html: labelHtml,
        iconSize: [140, 48],
      }));
    } else {
      // Create a new marker and store its reference
      this.parkingMarkers[region.parkingId] = leaf.marker(center, {
        icon: leaf.divIcon({
          className: lock ? 'map-label-subscribe' : 'map-label',
          html: labelHtml,
          iconSize: [140, 48],
        })
      }).addTo(this.map);
    }
  }

  async onSearchLocation(query: string) {
    // Method implementation remains the same
  }

  async refreshMap() {
    // This method could be adapted to refresh the map's view based on the user's current location or another trigger
    const {coords} = await Geolocation.getCurrentPosition();
    this.map.setView([coords.latitude, coords.longitude], this.defaultZoom);
  }
}
