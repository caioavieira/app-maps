import { Component } from '@angular/core';
import { Toast, ToastController } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { 
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private map: GoogleMap;

  constructor(private toastCtrl: ToastController, private geolocation: Geolocation) {}

  private ionViewDidLoad() {
    this.getLocation()
      .then(resp => {
        let mapOptions: GoogleMapOptions = {
          camera: {
            target: {
              lat: resp.coords.latitude,
              lng: resp.coords.longitude
            },
            zoom: 18,
            tilt: 30
          }
        };

        this.loadMap(mapOptions);
      })
      .catch(err => {
        console.log('An error occurred in geolocation', err.message);

        let toast: Toast = this.createToast('Error while localizating ' + err, 3000, 'bottom');
        toast.present();
      });
  }

  private createToast(msg: string, dur: number, pos: string) : Toast {
    return this.toastCtrl.create({
      message: msg,
      duration: dur,
      position: pos
    });
  }

  private getLocation() : Promise<Geoposition> {
    return this.geolocation.getCurrentPosition();
  }

  private loadMap(mapOptions: GoogleMapOptions) : void {
    this.map = GoogleMaps.create('map_canvas', mapOptions);

    this.map.one(GoogleMapsEvent.MAP_READY)
    .then(() => {
      console.log('Map is ready!');

      this.map.addMarker({
        title: 'Current position',
        icon: 'blue',
        animation: 'DROP',
        position: {
          lat: mapOptions.camera.target.lat,
          lng: mapOptions.camera.target.lng
        }
      })
      .then((marker: Marker) => {
        marker.on(GoogleMapsEvent.MARKER_CLICK)
        .subscribe(() => alert('You are here.'));
      });
    })
    .catch(err => {
      console.log('An error occurred in maps', err);

      let toast = this.createToast('Error initing map ' + err, 3000, 'bottom');
      toast.present();
    });
  }

}
