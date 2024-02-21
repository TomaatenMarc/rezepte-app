import { Injectable } from '@angular/core';
import { Firestore, collection, query, orderBy, collectionData, doc, setDoc, deleteDoc } from '@angular/fire/firestore';
import { Storage, ref } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { getDownloadURL, uploadString, deleteObject } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  collectionName = '';

  private categoriesSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  categories$: Observable<any[]> = this.categoriesSubject.asObservable();
  
  async fillCategories() {
    this.categories$ = this.getRecipes().pipe(
      map((recipes: any[]) => {
        let categories: any[] = [];
        recipes.forEach((recipe) => {
          const category = recipe.category?.toLowerCase();
          if (!categories.some((c) => c.toLowerCase() === category) && category !== undefined && category !== '') {
            categories.push(recipe.category);
          }
        });
        return categories;
      })
    );

    this.categories$.subscribe((categories) => {
      this.categoriesSubject.next(categories);
    });
    return this.categories$;
  }
  
  constructor(
    private firestore: Firestore,
    private storage: Storage
    ) { }

  async addRecipe(recipe: any) {
    const recipeCollection = collection(this.firestore, this.collectionName);
    const recipeDoc = doc(recipeCollection, recipe.id);
    await setDoc(recipeDoc, recipe);
  }

  async addRecipeToDatabase(recipe: any, databaseName: string) {
    const recipeCollection = collection(this.firestore, databaseName);
    const recipeDoc = doc(recipeCollection, recipe.id);
    await setDoc(recipeDoc, recipe);
  }

  getRecipes() {
    const recipeCollection = collection(this.firestore, this.collectionName);
    const recipesSorted = query(recipeCollection, orderBy('name'));
    return collectionData(recipesSorted);
  }

  deleteRecipe(recipe: any) {
    this.deleteImage(recipe);
    const recipeCollection = collection(this.firestore, this.collectionName);
    const recipeDoc = doc(recipeCollection, recipe.id);
    return deleteDoc(recipeDoc);
  }

  setCollectionName(collectionName: string) {
    this.collectionName = collectionName;
  }

  async uploadImage(recipe: any, image: Photo){
    const path = `uploads/${recipe.id}/recipe.png`;
    const storageRef = ref(this.storage, path);
    
    if (image.base64String === undefined){
      return null;
    }

    try{
      await uploadString(storageRef, image.base64String, 'base64');
      const imageURL = await getDownloadURL(storageRef);

      recipe.image = imageURL;
      this.addRecipe(recipe);
      return true;
    } catch(e){
      return null;
    }
  }

  async deleteImage(recipe: any){
    const path = `uploads/${recipe.id}/recipe.png`;
    const storageRef = ref(this.storage, path);
    try{
      await deleteObject(storageRef);
      return true;
    } catch(e){
      return null;
    }
  }
}
