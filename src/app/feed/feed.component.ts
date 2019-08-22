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