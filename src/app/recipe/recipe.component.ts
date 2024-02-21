import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { Share } from '@capacitor/share';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent  implements OnInit {
  recipe: any;
  editModal: boolean = false;
  deleteModal: boolean = false;
  shareDatabaseModal: boolean = false;
  databaseName: string = '';

  copiedToast: boolean = false;
  databaseToast: boolean = false;
  notDatabaseToast: boolean = false;

  recipeName: string = '';
  category: string = '';
  numberOfPersons: number = 1;
  ingredients: string = '';
  steps: string = '';
  image: string = '';

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private firebaseService: FirebaseService,
    private alertController: AlertController,
    private loadingController: LoadingController
    ) { }

  ngOnInit() {
    this.recipe = history.state.recipe;
    this.recipeName = this.recipe.name;
    this.category = this.recipe.category;
    this.numberOfPersons = this.recipe.numberOfPersons;
    this.ingredients = this.recipe.ingredients.join('\n');
    this.steps = this.recipe.steps.join('\n');
    this.image = this.recipe.image;
  }

  onWillDismiss(event:any){
    this.editModal = false;
    this.deleteModal = false;
    this.shareDatabaseModal = false;
  }

  setOpenCopy(isOpen: boolean) {
    this.copiedToast = isOpen;
  }
  setOpenDatabase(isOpen: boolean) {
    this.databaseToast = isOpen;
  }
  setOpenNotDatabase(isOpen: boolean) {
    this.notDatabaseToast = isOpen;
  }

  async changeImage(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });

    this.recipe.image = image;

    if (image){
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.firebaseService.uploadImage(this.recipe, image);
      loading.dismiss();

      if(!result){
        const alert = await this.alertController.create({
          header: 'Upload failed',
          message: 'There was a problem uploading your image.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }

  async shareRecipe(){
    const ingredients = this.recipe.ingredients.join('\n');
    const steps = this.recipe.steps.join('\n\n');

    await Share.share({
      text: `Rezept:\n${this.recipe.name}\n\nZutaten:\n${ingredients}\n\nSchritte:\n${steps}`,
      dialogTitle: 'Teilen'
    });
  }

  shareRecipeToDatabase() {
    if (this.databaseName !== '') {
      this.firebaseService.addRecipeToDatabase(this.recipe, this.databaseName).then(() => {
        this.setOpenDatabase(true);
      })
      .catch((error) => {
        this.setOpenNotDatabase(true);
      });
    }
    this.shareDatabaseModal = false;
    this.databaseName = '';
    this.databaseToast = true;
  }

  openShareDatabaseModal(){
    this.shareDatabaseModal = true;
  }

  copyIngredients(){
    const ingredients = this.recipe.ingredients.join('\n');
    navigator.clipboard.writeText(ingredients);
    this.setOpenCopy(true);
  }

  openModal(){
    this.editModal = true;
  }

  editRecipe(){
    console.log('Recipe ID:', this.recipe.id);
    console.log('Recipe ID:', this.recipe.name);
    const editedRecipe = {
      name: this.recipeName,
      category: this.category,
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
    this.shareDatabaseModal = false;
  }
  
  return(){
    this.navCtrl.back();
  }

  showFirstStep(){
    this.navCtrl.navigateForward('recipe/step', {state: {recipe: this.recipe, step: 0}});
  }
}
