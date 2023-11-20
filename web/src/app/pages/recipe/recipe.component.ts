import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent {
  ingredientInputs: string[] = [''];
  preparationInputs: string[] = [''];

  addIngredientInput() {
    this.ingredientInputs.push('');
  }

  addPreparationInput() {
    this.preparationInputs.push('');
  }

  removeIngredientInput(index: number) {
    this.ingredientInputs.splice(index, 1);
  }

  removePreparationInput(index: number) {
    this.preparationInputs.splice(index, 1);
  }

  recipe: any = {
    foodName: '',
    foodDetails: '',
    foodImg: '',
    ingredientInputs: [''],
    preparationInputs: [''],
  }; // Objeto que vai conter os dados do formulário

  constructor(private http: HttpClient) { }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  cadastrarReceita() {
    // Verifica se algum dos campos de entrada está em branco
    const isAnyInputEmpty = this.ingredientInputs.some(input => input.trim() === '') ||
      this.preparationInputs.some(input => input.trim() === '') ||
      this.recipe.foodName.trim() === '' ||
      this.recipe.foodDetails.trim() === '';

    if (!isAnyInputEmpty) {
      // Define os ingredientes e preparos do objeto 'recipe' com base nos arrays de entrada
      this.recipe.ingredientInputs = this.ingredientInputs;
      this.recipe.preparationInputs = this.preparationInputs;

      console.log('Objeto de Receita:', this.recipe);

      // Envia os dados da receita para o servidor
      this.http.post('http://localhost:3000/api/recipe', this.recipe)
        .subscribe((response) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Receita criada com sucesso!',
            showConfirmButton: false,
            timer: 1500
          }).then((result) => {
            setTimeout(() => {
              window.location.reload();
            });
          });
          console.log('Receita cadastrada com sucesso!', response);
        }, (error) => {
          console.error('Erro ao cadastrar receita', error);
        });

      console.log('Food Name:', this.recipe.foodName);

    } else {
      // Pelo menos um campo está em branco, exibir uma mensagem de erro
      console.log('Preencha todos os campos antes de seguir.');

      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Preencha todos os campos antes de seguir',
        showConfirmButton: false,
        timer: 1700
      });
    }
  }
}