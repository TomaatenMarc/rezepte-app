import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  openNewRecipe = false;

  recipes: any[] = [];

  recipeName: string = '';
  numberOfPersons: number = 1;
  ingredients: string = '';
  steps: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private navCtrl: NavController
    ) {}
  ngOnInit(){
    this.getRecipes();
  }

  newRecipe(){
    this.openNewRecipe = true;
  }

  onWillDismiss(event:any){
    this.openNewRecipe = false;
  }

  cancel(){
    this.openNewRecipe = false;
  }

  getRecipes(){
    this.firebaseService.getRecipes().subscribe((recipes: any[]) => {
      this.recipes = recipes;
    });
  }

  openRecipe(recipe: any){
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
