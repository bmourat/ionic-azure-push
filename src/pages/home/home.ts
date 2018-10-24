import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { PushObject, PushOptions, Push } from '@ionic-native/push';

declare var WindowsAzure: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  client: any;
  constructor(platform: Platform, public navCtrl: NavController, public push: Push) {
    platform.ready().then(() => {
      this.initPushNotification();
    });
  }

  initPushNotification() {
    this.client = new WindowsAzure.MobileServiceClient('http://bmourat.azurewebsites.net');
    const options: PushOptions = {
      android: {
        senderID: '1031320738669'
      },
      ios: {
        alert: 'true',
        badge: false,
        sound: 'true'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      console.log('device token -> ' + data.registrationId);
      //TODO - send device token to server
      this.client.push.register('gcm', data.registrationId, {
        mytemplate: { body: { data: { message: "{$(messageParam)}" } } }
      }, null, function(error, response) {
        if (error) {
          console.error('Error registering for pushes: ' + error);
        } else {
          console.log('Registering for pushes response: ' + response.statusText);
        }
      });
    });

    pushObject.on('notification').subscribe((data: any) => {
      console.log('message -> ' + data.message);
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
  }

}
