import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'PratoPerfeito';

  constructor(private router: Router) { }

  isLoginPage(): boolean {
    // Verifique se a rota atual é a rota de login
    return this.router.url === '/';
  }

  isRegisterPage(): boolean {
    // Verifique se a rota atual é a rota de cadastro de usuario
    return this.router.url === '/user-register';
  }
  
}