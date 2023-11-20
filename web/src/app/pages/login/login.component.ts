import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    const credentials = { username: this.username, password: this.password };
  
    this.http.post('http://localhost:3000/api/login', credentials).subscribe({
      next: (response: any) => {
        if (response.message === 'Login bem-sucedido') {
          this.router.navigate(['/home']);
        } else {
          // Substitua o alert pelo SweetAlert2
          Swal.fire({
            icon: 'error',
            title: 'Erro de login',
            text: 'Usuário ou senha inválidos.'
          });
        }
      },
      error: (error) => {
        console.error(error);
        // Substitua o alert pelo SweetAlert2
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Usuário ou Senha Incorretos.'
        });
      }
    });
  }

  irParaCadastro() {
    this.router.navigate(['/user-register']); // 'cadastro' deve corresponder à rota definida em seu arquivo de roteamento
  }
}  

