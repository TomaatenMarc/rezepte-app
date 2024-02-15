import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss'],
})
export class StepComponent  implements OnInit {
  recipe: any;
  step: any;

  constructor(private route: ActivatedRoute, private navCtrl: NavController) { }

  ngOnInit() {
    this.recipe = history.state.recipe;
    this.step = history.state.step;
  }

  showNextStep(){
    this.step++;
  }

  showPreviousStep(){
    this.step--;
  }
  
  return(){
    this.navCtrl.back();
  }
}
