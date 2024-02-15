import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit{
  open_new_recipe = false;

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
    this.open_new_recipe = true;
  }

  onWillDismiss(event:any){
    console.log(event);
  }

  cancel(){
    this.open_new_recipe = false;
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
      steps: this.steps.split('\n')
    };

    this.firebaseService.addRecipe(recipeData)
    .then(() => {
      console.log('Rezept hinzugefügt');
    })
    .catch((error) => {
      console.error('Fehler beim Hinzufügen des Rezeptes: ', error);
    });
    this.open_new_recipe = false;
    this.recipeName = '';
    this.numberOfPersons = 1;
    this.ingredients = '';
    this.steps = '';
  }

  formatIngredients(ingredients: string[]){
    return ingredients.join(', ');
  }
}
