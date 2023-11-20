import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})

export class UserRegisterComponent {

  usuario: any = {
    // Inicialize com pelo menos um item vazio para campos obrigatórios
    username: '',
    email: '',
    password: '',
    nome_completo: '',
  }; 

  constructor(private http: HttpClient, private router: Router) {} 

  userRegister() {
    // Verifique se algum dos campos de entrada está em branco
    const isAnyInputEmpty = this.isEmpty(this.usuario.username) ||
      this.isEmpty(this.usuario.email) ||
      this.isEmpty(this.usuario.password) ||
      this.isEmpty(this.usuario.nome_completo);;

    if (!isAnyInputEmpty) {
      // Enviar os dados do usuário para o servidor
      this.http.post('http://localhost:3000/api/userRegister', this.usuario)
        .subscribe((response) => {
          // Lógica para lidar com a resposta do servidor, por exemplo, exibir uma mensagem de sucesso
          console.log('Usuário cadastrado com sucesso!', response);

          // Substitua o alert pelo SweetAlert2
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Usuário cadastrado com sucesso!'
          });

        }, (error) => {
          if (error.status === 409) {
            // O status 409 indica que o usuário já existe
            console.error('Usuário já existe', error);

            // Exiba uma mensagem de erro específica para usuário já existente
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
              }
            })

            Toast.fire({
              icon: 'warning',
              title: 'Erro: Usuário ' + this.usuario.username + ' já existe'
            })

          } else {
            // Outros erros
            console.error('Erro ao cadastrar usuário', error);

            // Substitua o alert pelo SweetAlert2
            Swal.fire({
              icon: 'error',
              title: 'Erro de Cadastro',
              text: 'Erro ao cadastrar usuário.'
            });
          }
        });

    } else {
      // Pelo menos um campo está em branco, exiba uma mensagem de erro
      console.log('Preencha todos os campos antes de seguir.');

      Swal.fire({
        icon: 'error',
        title: 'Preencha todos os campos antes de seguir',
        showConfirmButton: false,
        timer: 1700
      });
    }
  }

  isEmpty(value: string): boolean {
    return !value.trim(); // Retorna true se a string estiver vazia ou contiver apenas espaços em branco
  }

    // Função para redirecionar para a rota "/home"
    redirectToHome() {
      this.router.navigate(['/']);
    }
    
}

