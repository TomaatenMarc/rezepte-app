import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, orderBy, collectionData, doc, updateDoc, arrayUnion, getDoc } from '@angular/fire/firestore';
import { ref, getStorage, uploadString } from 'firebase/storage';

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  
  constructor(private firestore: Firestore) { }

  async addRecipe(recipe: any) {
    const recipeCollection = collection(this.firestore, 'recipes');
    const recipeRef = await addDoc(recipeCollection, recipe);
    return recipeRef.id;
  }

  async assignImageToRecipe(recipeId: string, image: LocalFile) {
    const storageRef = ref(getStorage(), 'rezeptbilder/' + recipeId + '/' + image.name);
    await uploadString(storageRef, image.data, 'data_url');

    const recipeDocRef = doc(this.firestore, 'recipes', recipeId);
    await updateDoc(recipeDocRef, { images: arrayUnion(image.name) });
  }

  async getRecipeById(recipeId: string) {
    const recipeDocRef = doc(this.firestore, 'recipes', recipeId);
    const recipeSnapshot = await getDoc(recipeDocRef);
    return recipeSnapshot.data();
  }

  getRecipes() {
    const recipeCollection = collection(this.firestore, 'recipes');
    const recipesSorted = query(recipeCollection, orderBy('name'));
    return collectionData(recipesSorted);
  }
}
