import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent  implements OnInit {
  recipe: any;

  constructor(private route: ActivatedRoute, private navCtrl: NavController) { }

  ngOnInit() {
    this.recipe = history.state.recipe;
  }
  
  return(){
    this.navCtrl.back();
  }

  showFirstStep(){
    this.navCtrl.navigateForward('recipe/step', {state: {recipe: this.recipe, step: 0}});
  }
}
