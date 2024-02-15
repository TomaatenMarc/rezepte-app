import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  recipes: any[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private navCtrl: NavController
    ) {}

  ngOnInit(): void {
    this.getRecipes();
  }

  getRecipes(){
    this.firebaseService.getRecipes().subscribe((recipes: any[]) => {
      this.recipes = recipes;
    });
  }

  randomRecipe(){
    if (this.recipes.length > 0) {
      const random = Math.floor(Math.random() * this.recipes.length);
      this.navCtrl.navigateForward(['/recipe'], { state: { recipe: this.recipes[random] } });
    } else {
      console.log('No recipes');
    }
  }

}
