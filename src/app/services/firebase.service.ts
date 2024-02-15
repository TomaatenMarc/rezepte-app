import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  
  constructor(private firestore: Firestore) { }

  async addRecipe(recipe: any) {
    const recipeCollection = collection(this.firestore, 'recipes');
    await addDoc(recipeCollection, recipe);
  }

  getRecipes() {
    const recipeCollection = collection(this.firestore, 'recipes');
    const recipesSorted = query(recipeCollection, orderBy('name'));
    return collectionData(recipesSorted);
  }
}
