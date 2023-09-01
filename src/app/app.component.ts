import { Component } from '@angular/core';
import firebase from 'firebase/compat/app';
import { environment } from 'src/environments/environment';
import { NavController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private navCtrl: NavController, private platform: Platform) {
    this.initializeApp();
  }

  ngOnInit() {
    firebase.initializeApp(environment.firebase);
    // this.navCtrl.navigateRoot(['/splash']);
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(9999, async () => {
        await App.exitApp();
      });
    });
  }
}
