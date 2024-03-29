import {Component, Input, OnInit} from '@angular/core';
import {Settings} from "../settings.component";
import {AlertController, LoadingController, ModalController} from "@ionic/angular";
import {ListVehiclesModalComponent} from "../list-vehicles-modal/list-vehicles-modal.component";
import {VehicleService} from "../../../services/vehicle.service";
import {AuthService} from "../../../services/auth.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-setting-item',
  templateUrl: './setting-item.component.html',
  styleUrls: ['./setting-item.component.scss'],
})
export class SettingItemComponent {
  @Input() settingId!: Settings;
  private readonly licensePlatePattern = /^(?:(?:[A-Za-zА-Яа-я]{1,2}[-\s]?[0-9]{3,4}[-\s]?[A-Za-zА-Яа-я]{1,2})|(?:[A-Za-zА-Яа-я]{1,3}[-\s]?[0-9]{3,4})|(?:[0-9]{2}[-\s]?[A-Za-zА-Яа-я]{2}[-\s]?[0-9]{4})|(?:[A-Za-zА-Яа-я]{2}[-\s]?[0-9]{4}[-\s]?[A-Za-zА-Яа-я]{2})|(?:[A-Za-zА-Яа-я0-9]{6,8}))$/;
  protected readonly Settings = Settings;

  constructor(private alertController: AlertController,
              private modalController: ModalController,
              private loadingController: LoadingController,
              private afs: AngularFirestore,
              public authService: AuthService,
              public vehicleService: VehicleService) {
  }


  async onAction() {
    switch (this.settingId) {
      case Settings.Vehicle:
        await this.onAddVehicle();
        break;
      case Settings.ListVehicles:
        await this.onListVehicles();
        break;
      case Settings.PayParking:
        await this.vehicleService.openVehicleList();
        break;
      case Settings.Account:
        await this.authService.logout();
        await this.modalController.dismiss();
        break;
    }
  }

  async onAddVehicle() {
    const alertElement = await this.alertController.create({
      header: 'Въведи регистрация',
      message: 'Добави своя регистрационен номер и плащай синя зона бързо, лесно и без грешки',
      buttons: [
        {
          text: 'Затвори',
          role: 'dismiss'
        },
        {
          text: 'Добави',
          role: 'confirm',
          handler: (data) => {
            if (this.licensePlatePattern.test(data[0].toUpperCase())) {
              // Handle valid input
              console.log('Valid license plate:', data[0]);
              return true;
            } else {
              console.error('Invalid license plate');
              alert('Невалиден формат на номера');
              return false
            }
          },
        }
      ],
      inputs: [
        {
          placeholder: 'Регистрационен номер',
        }
      ]
    });

    await alertElement.present();

    const {data, role} = await alertElement.onDidDismiss();


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

  async onChangeState() {
    const loadingElement = await this.loadingController.create({
      message: "Зарежда",
      spinner: "crescent"
    });
    await loadingElement.present();

    this.authService.premiumState.next(!this.authService.isPremium);

    this.authService.getUserId().then(userId => {
      if (!userId) return;

      const userDocRef = this.afs.doc(`users/${userId}`);

      // Fetch the document
      userDocRef.get().toPromise()
        .then(docSnapshot => {
          if ((docSnapshot as any).exists) {
            userDocRef.update({ premium: this.authService.isPremium })
              .then(() => {
                console.log('User updated successfully to premium')
                window.location.reload();
              })
              .catch(error => {
                console.error('Error updating user to premium: ', error)
                window.location.reload();
              });
          } else {
            userDocRef.set({ premium: this.authService.isPremium })
              .then(() => {
                console.log('User document created with premium status')
                window.location.reload();
              })
              .catch(error => {
                console.error('Error creating user document: ', error)
                window.location.reload();
              });
          }
        })
        .catch(error => {
          console.error('Error fetching user document: ', error);
        });
    });
  }
}
