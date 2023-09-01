import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    StatusBar.hide();
  }

  ionViewDidEnter() {
    SplashScreen.hide();
    setTimeout(() => {
      this.navCtrl.navigateRoot(['/login']);
    }, 3000);
  }

}