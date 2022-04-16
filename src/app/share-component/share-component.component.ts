import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-share-component',
  templateUrl: './share-component.component.html',
  styleUrls: ['./share-component.component.css']
})
export class ShareComponentComponent implements OnChanges {

  @Input()
  userDataToken: string = "";

  //QR RELATED
  qrLink       = "";
  elementType  = 'url';

  endpoint = `${environment.api}/userdata`;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.qrLink = `${this.endpoint}/${this.userDataToken}`;
  }

  copyPermalinkToClipboard() {
    navigator.clipboard.writeText(this.qrLink)
      .then(
        //TODO Toastr
      );
  }
}
