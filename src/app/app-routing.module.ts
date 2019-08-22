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
