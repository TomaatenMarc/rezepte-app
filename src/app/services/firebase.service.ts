import { Injectable } from '@angular/core';
import { Firestore, collection, query, orderBy, collectionData, doc, setDoc, deleteDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, map } from 'rxjs';

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
  
  constructor(private firestore: Firestore) { }

  async addRecipe(recipe: any) {
    const recipeCollection = collection(this.firestore, this.collectionName);
    const recipeDoc = doc(recipeCollection, recipe.id);
    await setDoc(recipeDoc, recipe);
  }

  getRecipes() {
    const recipeCollection = collection(this.firestore, this.collectionName);
    const recipesSorted = query(recipeCollection, orderBy('name'));
    return collectionData(recipesSorted);
  }

  deleteRecipe(recipe: any) {
    const recipeCollection = collection(this.firestore, this.collectionName);
    const recipeDoc = doc(recipeCollection, recipe.id);
    return deleteDoc(recipeDoc);
  }

  setCollectionName(collectionName: string) {
    this.collectionName = collectionName;
  }
}
