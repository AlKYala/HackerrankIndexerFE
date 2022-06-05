import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserDataService} from "../../shared/services/UserDataService";
import {UserData} from "../../shared/datamodels/User/model/UserData";
import {LocalStorageService} from "ngx-webstorage";

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

  showUserDataToken = this.userData != null && this.userData.token != null && this.userData.token.length > 0;
  userDataToken = (this.showUserDataToken) ? this.userData.token : "";
  endpoint = `localhost:4200/permalink`;

  constructor(private userDataService: UserDataService,
              private localStorageService: LocalStorageService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.userDataToken = (this.userData != null && this.userData.token != null) ? this.userData.token : "";
    if(this.userDataToken.length > 0)
      this.showUserDataToken = true;
    this.qrLink = `${this.endpoint}/${this.userDataToken}`;
  }

  copyPermalinkToClipboard() {
    navigator.clipboard.writeText(this.qrLink)
      .then(
        //TODO Toastr
      );
  }

  generateQRCode() {
    this.userDataService.sendQRGenerateRequest(this.userData.id)
      .then((userData: UserData) => {
        this.localStorageService.clear("userData");
        this.showUserDataToken = true;
        this.userDataToken = userData.token;
        this.localStorageService.store("userData", userData);
        console.log(this.localStorageService.retrieve("userData"));
      });
  }
}
