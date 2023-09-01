import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../../servicios/usuario/user.service';
import { StatusBar } from '@capacitor/status-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],

})
export class LoginPage implements OnInit {
  correo: FormControl = new FormControl('', [Validators.required, Validators.email]);

  password: FormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  showPassword: boolean = false;
  valor: number = 1;
  showSpinner: boolean = false;

  constructor(
    private userService: UserService) { }

  ngOnInit() {
    StatusBar.hide();
  }

  Login() {
    const correoL = this.correo.value?.toString()
    const passL = this.password.value?.toString()
    this.showSpinner = true;
    setTimeout(() => {
      this.userService.login(correoL, passL);
    }, 1000);
  }

  onRangeChange() {
    let correo;
    let password;
    if (this.valor === 0) {
      correo = "admin@admin.com";
      password = "111111";
    } else if (this.valor === 1) {
      correo = "usuario@usuario.com";
      password = "333333";
    } else if (this.valor === 2) {
      correo = "invitado@invitado.com";
      password = "222222";
    }
    this.correo.setValue(correo);
    this.password.setValue(password);
  }


  ionViewWillLeave() {
    this.correo.reset();
    this.password.reset();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.password.markAsTouched();
  }

}


