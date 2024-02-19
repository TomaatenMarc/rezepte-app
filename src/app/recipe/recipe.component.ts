import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent  implements OnInit {
  recipe: any;
  editModal: boolean = false;
  deleteModal: boolean = false;

  recipeName: string = '';
  numberOfPersons: number = 1;
  ingredients: string = '';
  steps: string = '';

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private firebaseService: FirebaseService
    ) { }

  ngOnInit() {
    this.recipe = history.state.recipe;
    this.recipeName = this.recipe.name;
    this.numberOfPersons = this.recipe.numberOfPersons;
    this.ingredients = this.recipe.ingredients.join('\n');
    this.steps = this.recipe.steps.join('\n');
  }

  onWillDismiss(event:any){
    this.editModal = false;
    this.deleteModal = false;
  }

  async shareRecipe(){
    const ingredients = this.recipe.ingredients.join('\n');
    const steps = this.recipe.steps.join('\n');
    const shareData = {
      title: this.recipe.name,
      text: `Zutaten:\n${ingredients}\n\nSchritte:\n${steps}`,
    };
    try {
      await (navigator as any).share(shareData);
      console.log('Shared successfully');
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }

  copyIngredients(){
    const ingredients = this.recipe.ingredients.join('\n');
    navigator.clipboard.writeText(ingredients);
    console.log('Ingredients copied to clipboard');
  }

  openModal(){
    this.editModal = true;
  }

  editRecipe(){
    console.log('Recipe ID:', this.recipe.id);
    console.log('Recipe ID:', this.recipe.name);
    const editedRecipe = {
      name: this.recipeName,
      numberOfPersons: this.numberOfPersons,
      ingredients: this.ingredients.split('\n'),
      steps: this.steps.split('\n'),
      id: this.recipe.id
    };

    this.firebaseService.addRecipe(editedRecipe)
    .then(() => {
      console.log('Rezept bearbeitet');
      this.recipe = editedRecipe;
    })
    .catch((error) => {
      console.error('Fehler beim Bearbeiten des Rezeptes: ', error);
    });
    this.editModal = false;
  }

  areYouSure(){
    this.deleteModal = true;
  }

  deleteRecipe(){
    this.firebaseService.deleteRecipe(this.recipe)
    .then(() => {
      console.log('Rezept gelöscht');
      this.deleteModal = false;
      this.navCtrl.back();
    })
    .catch((error) => {
      console.error('Fehler beim Löschen des Rezeptes: ', error);
    });
  }

  cancel(){
    this.editModal = false;
    this.deleteModal = false;
  }
  
  return(){
    this.navCtrl.back();
  }

  showFirstStep(){
    this.navCtrl.navigateForward('recipe/step', {state: {recipe: this.recipe, step: 0}});
  }
}
