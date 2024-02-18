import { Injectable } from '@angular/core';
import { Firestore, collection, query, orderBy, collectionData, doc, setDoc, deleteDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  
  constructor(private firestore: Firestore) { }

  async addRecipe(recipe: any) {
    const recipeCollection = collection(this.firestore, 'recipes');
    const recipeDoc = doc(recipeCollection, recipe.id);
    await setDoc(recipeDoc, recipe);
  }

  getRecipes() {
    const recipeCollection = collection(this.firestore, 'recipes');
    const recipesSorted = query(recipeCollection, orderBy('name'));
    return collectionData(recipesSorted);
  }

  deleteRecipe(recipe: any) {
    const recipeCollection = collection(this.firestore, 'recipes');
    const recipeDoc = doc(recipeCollection, recipe.id);
    return deleteDoc(recipeDoc);
  }
}
