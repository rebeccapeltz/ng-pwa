// import { environment } from './app.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeedComponent } from './feed/feed.component';
import { CaptureComponent } from './capture/capture.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar'

import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { environment } from '../environments/environment';

const MatModules = [
  MatButtonModule,
  MatCardModule,
  MatSnackBarModule
];
export const cloudinaryLib = {
  Cloudinary: Cloudinary
};
// export const environment = {
//   production: false,
//   cloudName: 'picturecloud7',
//   uploadPreset: 'ng_pwa'
// };

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    CaptureComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatModules,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    CloudinaryModule.forRoot(cloudinaryLib, { cloud_name: environment.cloudName, secure: true }),

  ],
  providers: [],
  bootstrap: [AppComponent]
})



export class AppModule { }
