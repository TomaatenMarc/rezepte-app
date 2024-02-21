import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent  implements OnInit {
  recipes: any[] = [];
  category: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
    ) {}

  ngOnInit() {
    this.getRecipes();
  }

  return(){
    this.navCtrl.back();
  }

  getRecipes(){
    this.firebaseService.getRecipes().subscribe((recipes: any[]) => {
      this.recipes = recipes;
    });
    this.category = history.state.category;
  }

  openRecipe(recipe: any){
    this.modalCtrl.dismiss();
    this.navCtrl.navigateForward(['/recipe'], {state: {recipe: recipe}});
  }

  formatIngredients(ingredients: string[]){
    return ingredients.join(', ');
  }

}
