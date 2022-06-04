import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserDataService} from "../../shared/services/UserDataService";
import {UserData} from "../../shared/datamodels/User/model/UserData";

@Component({
  selector: 'app-share-component',
  templateUrl: './share-component.component.html',
  styleUrls: ['./share-component.component.css']
})
export class ShareComponentComponent implements OnChanges {

  @Input()
  userData!: UserData;

  //QR RELATED
  qrLink       = "";
  elementType  = 'url';

  userDataToken = ""
  endpoint = `localhost:4200/permalink`;

  constructor(private userDataService: UserDataService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.userDataToken = (this.userData != null && this.userData.token != null) ? this.userData.token : "";
    this.qrLink = `${this.endpoint}/${this.userDataToken}`;
  }

  copyPermalinkToClipboard() {
    navigator.clipboard.writeText(this.qrLink)
      .then(
        //TODO Toastr
      );
  }

  generateQRCode() {
    this.userDataService.sendQRGenerateRequest(this.userData.id).then(
      //TODO replace userData
    );
  }
}
