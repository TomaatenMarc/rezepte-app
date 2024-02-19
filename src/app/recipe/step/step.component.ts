import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss'],
})
export class StepComponent  implements OnInit {
  recipe: any;
  step: any;

  lastStepTime: number = 0;
  cooldown: number = 1000;

  constructor(private route: ActivatedRoute, private navCtrl: NavController) { }

  ngOnInit() {
    this.recipe = history.state.recipe;
    this.step = history.state.step;
  }

  @HostListener('window:devicemotion', ['$event'])
  onDeviceMotion(event: any) {
    const acceleration = event.accelerationIncludingGravity;
    const threshold = 15;

    const currentTime = Date.now();

    if ((currentTime - this.lastStepTime >= this.cooldown) && 
      (Math.abs(acceleration.x) > threshold || Math.abs(acceleration.y) > threshold || Math.abs(acceleration.z) > threshold) && 
      this.step < this.recipe.steps.length - 1) {
      this.showNextStep();
      this.lastStepTime = currentTime;
    }
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
