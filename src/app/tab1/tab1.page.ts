import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  openNewRecipe = false;
  openSearch = false;

  recipes: any[] = [];

  recipeName: string = '';
  numberOfPersons: number = 1;
  ingredients: string = '';
  steps: string = '';

  searchString: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
    ) {}
  ngOnInit(){
    this.getRecipes();
  }

  newRecipe(){
    this.openNewRecipe = true;
  }

  onWillDismiss(event:any){
    this.openNewRecipe = false;
    this.openSearch = false;
  }

  cancel(){
    this.openNewRecipe = false;
    this.openSearch = false;
  }

  searchRecipe(){
    this.openSearch = true;
  }

  searchByIngredient(){
    this.recipes.forEach((recipe) => {
      recipe.hasString = false;
      recipe.ingredients.forEach((ingredient: string) => {
        if(ingredient.toLowerCase().includes(this.searchString.toLowerCase())){
          recipe.hasString = true;
        }
      });
    });
  }

  searchByName(){
    this.recipes.forEach((recipe) => {
      recipe.hasString = false;
      if(recipe.name.toLowerCase().includes(this.searchString.toLowerCase())){
        recipe.hasString = true;
      }
    });
  }

  getRecipes(){
    this.firebaseService.getRecipes().subscribe((recipes: any[]) => {
      this.recipes = recipes;
    });
    this.recipes.forEach((recipe) => {
      recipe.hasString = false;
    });
  }

  openRecipe(recipe: any){
    this.modalCtrl.dismiss();
    this.searchString = '';
    this.recipes.forEach((recipe) => {
      recipe.hasString = false;
    });
    this.navCtrl.navigateForward(['/recipe'], {state: {recipe: recipe}});
  }

  addRecipe(){
    const recipeData = {
      name: this.recipeName,
      numberOfPersons: this.numberOfPersons,
      ingredients: this.ingredients.split('\n'),
      steps: this.steps.split('\n'),
      id: this.recipeName + new Date().getTime().toString()
    };

    this.firebaseService.addRecipe(recipeData)
    .then(() => {
      console.log('Rezept hinzugefügt');
    })
    .catch((error) => {
      console.error('Fehler beim Hinzufügen des Rezeptes: ', error);
    });
    this.openNewRecipe = false;
    this.recipeName = '';
    this.numberOfPersons = 1;
    this.ingredients = '';
    this.steps = '';
  }

  formatIngredients(ingredients: string[]){
    return ingredients.join(', ');
  }
}
