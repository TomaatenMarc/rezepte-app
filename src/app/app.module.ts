import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, indexedDBLocalPersistence, initializeAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { Capacitor } from '@capacitor/core';
import { RecipeComponent } from './recipe/recipe.component';
import { StepComponent } from './recipe/step/step.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Tab1Page } from './tab1/tab1.page';
import { Tab2Page } from './tab2/tab2.page';
import { Tab3Page } from './tab3/tab3.page';
import { TabsPage } from './tabs/tabs.page';
import { CategoryComponent } from './category/category.component';

//https://www.youtube.com/watch?v=NVFVbah2aWU
export function HttpLoaderFactory(http:HttpClient){
  return new TranslateHttpLoader(http);
}

//import { AngularFirestoreModule } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent,
    RecipeComponent,
    StepComponent,
    CategoryComponent,
    Tab1Page,
    Tab2Page,
    Tab3Page,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    FormsModule,
    //https://www.youtube.com/watch?v=NVFVbah2aWU
    HttpClientModule,
    TranslateModule.forRoot({
      loader:{
        provide:TranslateLoader,
        useFactory:HttpLoaderFactory,
        deps:[HttpClient]
      }
    }),
    provideFirebaseApp(() => initializeApp({"projectId":"rezeptedatenbank","appId":"1:346579543687:web:c926a09156549c8c0d7a22","storageBucket":"rezeptedatenbank.appspot.com","apiKey":"AIzaSyCoTxb7WMf178og2bdakEKsaEkUcm3lk9M","authDomain":"rezeptedatenbank.firebaseapp.com","messagingSenderId":"346579543687","measurementId":"G-VBDNYFNB05"})),
    //provideAuth(() => getAuth()),
    provideAuth(() => {
      if (Capacitor.isNativePlatform()) {
        return initializeAuth(getApp(), {
          persistence: indexedDBLocalPersistence
        })
      } else {
        return getAuth()
      }
    }),
    provideFirestore(() => getFirestore()),

  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
