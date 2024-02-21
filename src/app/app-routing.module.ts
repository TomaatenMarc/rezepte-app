import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RecipeComponent } from './recipe/recipe.component';
import { StepComponent } from './recipe/step/step.component';
import { CategoryComponent } from './category/category.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'recipe',
    component: RecipeComponent
  },
  {
    path: 'recipe/step',
    component: StepComponent
  },
  {
    path: 'category',
    component: CategoryComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
