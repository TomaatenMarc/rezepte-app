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

//import { AngularFirestoreModule } from '@angular/fire/firestore';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
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
