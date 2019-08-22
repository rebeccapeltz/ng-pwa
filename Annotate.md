# Annotate code

## src


### environments
**environment.ts**
```JavaScript
export const environment = {
  production: false,
  cloudName: '',
  uploadPreset: '',
  firebase: {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  }
};
```

### app

**app-routing.module.ts**

```JavaScript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { CaptureComponent } from './capture/capture.component';

const routes: Routes = [
  { path: '', component: FeedComponent },
  { path: 'capture', component: CaptureComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


```
**app.component.html**
```HTML
<div class="navigation">
  <button mat-raised-button color="primary" routerLink="/">Feed</button>
  <button mat-raised-button color="primary" routerLink="/capture">Capture</button>
</div>
<div class="main-div">
  <router-outlet></router-outlet>
</div>
```

**app.component.ts**
```JavaScript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-pwa';
}
```
**app.module.ts**
```JavaScript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeedComponent } from './feed/feed.component';
import { CaptureComponent } from './capture/capture.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { environment } from '../environments/environment';

const MatModules = [
  MatButtonModule,
  MatCardModule,
  MatSnackBarModule
];

import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';

export const cloudinaryLib = {
  Cloudinary: Cloudinary
};

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    CaptureComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    HttpClientModule,
    ...MatModules,
    CloudinaryModule.forRoot(cloudinaryLib, { cloud_name: environment.cloudName, secure: true }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
### capture

**capture.component.html**
```HTML
<mat-card class="z-depth center" flex="50">
  <mat-card-header>
    <mat-card-title>Smile - and take a selfie 📱</mat-card-title>
    <mat-card-subtitle>The image will be deleted after the workshop</mat-card-subtitle>
  </mat-card-header>
  <video #video id="video" mat-card-image autoplay *ngIf="displayStream"></video>
  <canvas #canvas id="canvas" mat-card-image [width]="width" [height]="height" [hidden]="displayStream"></canvas>
  <mat-card-content>
    <p>
      Snap away!
    </p>
  </mat-card-content>
  <mat-card-actions *ngIf="actions">
    <button mat-raised-button color="primary" (click)="capture()" *ngIf="displayStream">Capture Photo</button>
    <button mat-raised-button color="warn" (click)="retakePhoto()" *ngIf="!displayStream">Retake Photo</button>
    <button mat-raised-button color="accent" (click)="usePhoto()" *ngIf="!displayStream">Use photo</button>
  </mat-card-actions>
</mat-card>
```
**capture.component.ts**
```JavaScript
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-capture',
  templateUrl: './capture.component.html',
  styleUrls: ['./capture.component.css']
})
export class CaptureComponent implements OnInit, OnDestroy {
  @ViewChild('video')
  video: ElementRef;
  @ViewChild('canvas')
  canvas: ElementRef;

  private constraints = {
    video: true,
  };
  displayStream: boolean;
  captureCollectionRef: AngularFirestoreCollection<any>;
  width: number;
  height: number;

  actions: boolean = false;

  constructor(
    private http: HttpClient,
    private db: AngularFirestore,
    private router: Router) {
      this.displayStream = true;
      this.captureCollectionRef = this.db.collection<any>('captures');
  }
  
  ngOnInit() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(stream => {
        this.video.nativeElement.srcObject = stream;
        this.video.nativeElement.play();
        this.video.nativeElement.addEventListener('playing', () => {
          const { offsetWidth, offsetHeight } = this.video.nativeElement;
          this.width = offsetWidth;
          this.height = offsetHeight;
          this.actions = true;
        });
      });
    }
  }

  public capture() {
    this.displayStream = false;
    this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0, this.width, this.height);
    this.video.nativeElement.srcObject.getVideoTracks().forEach(track => track.stop());
  }

  public retakePhoto() {
    this.displayStream = true;
    this.actions = false;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(stream => {
        this.video.nativeElement.srcObject = stream;
        this.video.nativeElement.play();
        this.video.nativeElement.addEventListener('playing', () => {
          const { offsetWidth, offsetHeight } = this.video.nativeElement;
          this.width = offsetWidth;
          this.height = offsetHeight;
          this.actions = true;
        });
      });
    }
  }

  public usePhoto() {
    const capture = this.canvas.nativeElement.toDataURL('image/jpeg');
    const timeTaken = new Date().getTime();
    this.http.post(`https://api.cloudinary.com/v1_1/${environment.cloudName}/image/upload`, {
      file: capture,
      upload_preset: environment.uploadPreset
    }).subscribe((response: any) => {
      if (response) {
        this.captureCollectionRef.add({
          public_id: response.public_id,
          uploaded: timeTaken
        }).then(() => {
          this.router.navigateByUrl('/');
        });
      }
    });
  }

  ngOnDestroy() {
    this.actions = false;
    if (this.video) {
      this.video.nativeElement.srcObject.getVideoTracks().forEach(track => track.stop());
    }
  }
}

```
### feed
**feed.component.html**
```HTML
<h1>Selfie feed <span>📱</span></h1>
<mat-card class="spaced z-depth center" flex="50" *ngFor="let capture of captures$ | async">
  <cl-image public-id="{{ capture.public_id }}" mat-card-image>
    <cl-transformation width="450" height="450" gravity="faces" radius="max" crop="thumb" border="4px_solid_rgb:000" effect="improve"></cl-transformation>
    <cl-transformation effect="sepia:90"></cl-transformation>
  </cl-image>
  <mat-card-content>
    <p>Uploaded at {{ capture.uploaded | date: 'full' }}</p>
  </mat-card-content>
  <mat-card-footer></mat-card-footer>
</mat-card>
```
**feed.component.ts**
```JavaScript
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent {
  captures$: Observable<any>;
  online: boolean;
  constructor(db: AngularFirestore) {
    const ref = db.collection('captures', ref => ref.orderBy('uploaded', 'desc'));
    this.captures$ = ref.valueChanges();
  }
}
```
