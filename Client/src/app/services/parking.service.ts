import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  constructor(private http: HttpClient) {
  }

  fetchParkings() {
    return this.http.get((environment as any).API_URL + 'parking');
  }

  fetchParkingById(parkingId: string) {
    console.log('fetch parking', environment.API_URL + 'parking/' + parkingId);

    return this.http.get(environment.API_URL + 'parking/' + parkingId);
  }
}
