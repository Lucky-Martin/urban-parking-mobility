import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  constructor(private http: HttpClient,
              private firestore: AngularFirestore,
              private authService: AuthService) {
  }

  fetchParkings() {
    return this.http.get((environment as any).API_URL + 'parking');
  }

  fetchParkingById(parkingId: string) {
    return this.http.get((environment as any).API_URL + 'parking/' + parkingId);
  }
}
