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
  categories: any[] = [];

  recipeName: string = '';
  numberOfPersons: number = 1;
  ingredients: string = '';
  steps: string = '';
  category: string = '';

  addedToast: boolean = false;
  notAddedToast: boolean = false;

  searchString: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
    ) {}
  ngOnInit(){
    this.getRecipes();
    this.getCategories();
  }

  setOpenAdded(isOpen: boolean) {
    this.addedToast = isOpen;
  }

  setOpenNotAdded(isOpen: boolean) {
    this.notAddedToast = isOpen;
  }

  getRecipeCount(category: string): number {
    if (this.recipes.length === 0) return 0;
    return this.recipes.filter(recipe => recipe.category.toLowerCase() === category.toLowerCase()).length;
  }

  async getCategories(){
    (await this.firebaseService.fillCategories()).subscribe((categories: any[]) => {
      this.categories = categories;
      this.categories.sort((a, b) => a.localeCompare(b));
    });
  }

  openCategory(category: string){
    this.navCtrl.navigateForward(['/category'], {state: {category: category}});
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
    const elementIng = document.getElementById('searchByIngredient');
    elementIng?.classList.remove('buttonActivated');
    const elementName = document.getElementById('searchByName');
    elementName?.classList.remove('buttonActivated');
  }

  searchRecipe(){
    this.openSearch = true;
  }

  searchByIngredient(){
    const elementName = document.getElementById('searchByName');
    elementName?.classList.remove('buttonActivated');
    const element = document.getElementById('searchByIngredient');
    element?.classList.add('buttonActivated');
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
    const elementIng = document.getElementById('searchByIngredient');
    elementIng?.classList.remove('buttonActivated');
    const element = document.getElementById('searchByName');
    element?.classList.add('buttonActivated');
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
    const elementIng = document.getElementById('searchByIngredient');
    elementIng?.classList.remove('buttonActivated');
    const elementName = document.getElementById('searchByName');
    elementName?.classList.remove('buttonActivated');
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
      category: this.category,
      numberOfPersons: this.numberOfPersons,
      ingredients: this.ingredients.split('\n'),
      steps: this.steps.split('\n'),
      id: this.recipeName + new Date().getTime().toString()
    };

    this.firebaseService.addRecipe(recipeData)
    .then(() => {
      this.setOpenAdded(true);
    })
    .catch((error) => {
      this.setOpenNotAdded(true);
    });
    this.openNewRecipe = false;
    this.recipeName = '';
    this.category = '';
    this.numberOfPersons = 1;
    this.ingredients = '';
    this.steps = '';
    this.getCategories();
  }

  formatIngredients(ingredients: string[]){
    return ingredients.join(', ');
  }
}
