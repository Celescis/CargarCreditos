import { Component } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { FirestoreService } from '../../servicios/firestore/firestore.service';
import { UserService } from '../../servicios/usuario/user.service';
import { ToastService } from '../../servicios/toast/toast.service';
import { StatusBar } from '@capacitor/status-bar';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  emailRecuperado: string | any = this.userService.getEmailUser()?.split('@')[0];
  creditoAcumulado = 0;
  arrayDeUsuariosDisponibles: any = [];
  user: any;
  scanActive: boolean = false;
  showSpinner: boolean = false;

  constructor(private userService: UserService,
    private toastCtr: ToastService,
    private firestore: FirestoreService) { }

  async ngOnInit() {
    this.showSpinner = true;
    StatusBar.hide();
    this.arrayDeUsuariosDisponibles = await this.firestore.traerUsuarios();
    this.creditoAcumulado = this.buscarUser().cantCreditos;
    setTimeout(() => {
      this.showSpinner = false;
    }, 500);
  }


  cerrarSesion() {
    this.userService.logout();
  }

  buscarUser() {
    for (let i = 0; i < this.arrayDeUsuariosDisponibles.length; i++) {
      if (this.arrayDeUsuariosDisponibles[i].perfil == this.emailRecuperado) {
        this.creditoAcumulado = this.arrayDeUsuariosDisponibles[i].cantidadDeCreditos;
        return this.arrayDeUsuariosDisponibles[i];
      }
    }
  }

  acumularCredito(codigoDelQr: string, usuario: any) {

    switch (codigoDelQr) {
      //100
      case '2786f4877b9091dcad7f35751bfcf5d5ea712b2f':
        if (usuario.perfil != "admin" && usuario.cantQr100 == 0) {
          usuario.cantQr100 += 1;
          usuario.cantCreditos += 100;
          this.creditoAcumulado = usuario.cantCreditos;
          this.firestore.guardarCreditos(usuario.id, 100, 1, 0, 0);
        }
        else if (usuario.perfil == "admin" && usuario.cantQr100 < 2) {
          usuario.cantQr100 += 1;
          usuario.cantCreditos += 100;
          this.creditoAcumulado = usuario.cantCreditos;
          this.firestore.guardarCreditos(usuario.id, 100, 1, 0, 0);
        }
        else if (usuario.perfil == "admin" && usuario.cantQr100 == 2) {
          this.toastCtr.CrearToast("usuario: Admin. Ya escaneo las dos veces permitidas", "top", "danger");
          this.creditoAcumulado = this.buscarUser().cantCreditos;
        }
        else {
          this.toastCtr.CrearToast("usuario: " + usuario.perfil + ". Ya se escaneo este QR", "top", "danger");
          this.creditoAcumulado = this.buscarUser().cantCreditos;
        }
        break;

      //50
      case 'ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 ':
        if (usuario.perfil != "admin" && usuario.cantQr50 == 0) {
          usuario.cantQr50 += 1;
          usuario.cantCreditos += 50;
          this.creditoAcumulado = usuario.cantCreditos;
          this.firestore.guardarCreditos(usuario.id, 50, 0, 1, 0);
        }
        else if (usuario.perfil == "admin" && usuario.cantQr50 < 2) {
          usuario.cantQr50 += 1;
          usuario.cantCreditos += 50;
          this.creditoAcumulado = usuario.cantCreditos;
          this.firestore.guardarCreditos(usuario.id, 50, 0, 1, 0);
        }
        else if (usuario.perfil == "admin" && usuario.cantQr50 == 2) {
          this.toastCtr.CrearToast("usuario: Admin. Ya escaneo las dos veces permitidas", "top", "danger");
          this.creditoAcumulado = this.buscarUser().cantCreditos;
        }
        else {
          this.toastCtr.CrearToast("usuario: " + usuario.perfil + ". Ya se escaneo este QR", "top", "danger");
          this.creditoAcumulado = this.buscarUser().cantCreditos;
        }
        break;

      //10
      case '8c95def646b6127282ed50454b73240300dccabc':
        if (usuario.perfil != "admin" && usuario.cantQr10 == 0) {
          usuario.cantQr10 += 1;
          usuario.cantCreditos += 10;
          this.creditoAcumulado = usuario.cantCreditos;
          this.firestore.guardarCreditos(usuario.id, 10, 0, 0, 1);
        }
        else if (usuario.perfil == "admin" && usuario.cantQr10 < 2) {
          usuario.cantQr10 += 1;
          usuario.cantCreditos += 10;
          this.creditoAcumulado = usuario.cantCreditos;
          this.firestore.guardarCreditos(usuario.id, 10, 0, 0, 1);
        }
        else if (usuario.perfil == "admin" && usuario.cantQr10 == 2) {
          this.toastCtr.CrearToast("usuario: Admin. Ya escaneo las dos veces permitidas", "top", "danger");
          this.creditoAcumulado = this.buscarUser().cantCreditos;
        }
        else {
          this.toastCtr.CrearToast("usuario: " + usuario.perfil + ". Ya se escaneo este QR", "top", "danger");
          this.creditoAcumulado = this.buscarUser().cantCreditos;
        }
        break;
    }
  }

  resetCreditos() {

    this.user = this.buscarUser();
    this.user.cantQr100 = 0;
    this.user.cantQr50 = 0;
    this.user.cantQr10 = 0;
    this.user.cantCreditos = 0;
    this.creditoAcumulado = 0;
    this.firestore.limpiarCreditos(this.user.id);
  }


  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async startScanner() {
    const allowed = await this.checkPermission();

    this.scanActive = true;
    if (allowed) {
      BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.scanActive = false;
        this.user = this.buscarUser();
        this.acumularCredito(result.content, this.user);
      } else {
        alert('No se encontró');
      }
    } else {
      alert('No permitido');
    }
  }

  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  ionViewWillLeave() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

}
