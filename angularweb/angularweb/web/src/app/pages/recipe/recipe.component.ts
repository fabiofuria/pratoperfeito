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
    ingredientInputs: [''], // Inicialize com pelo menos um item vazio
    preparationInputs: [''], // Inicialize com pelo menos um item vazio
  }; // Objeto que vai conter os dados do formulário

  constructor(private http: HttpClient) {}

  trackByIndex(index: number, item: any): number {
    return index;
}


  cadastrarReceita() {
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
        })
        // Lógica para lidar com a resposta do servidor, por exemplo, exibir uma mensagem de sucesso
        console.log('Receita cadastrada com sucesso!', response);
      }, (error) => {
        // Lógica para lidar com erros, por exemplo, exibir uma mensagem de erro
        console.error('Erro ao cadastrar receita', error);  
      });
  }
}
