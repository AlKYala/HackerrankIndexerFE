import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserDataService} from "../../shared/services/UserDataService";
import {UserData} from "../../shared/datamodels/User/model/UserData";
import {HttpClient} from "@angular/common/http";
import {User} from "../../shared/datamodels/User/model/User";
import {Observable} from "rxjs";
import {RequestService} from "../../shared/services/ServiceHandler/RequestService";
import {environment} from "../../environments/environment";
import {Submission} from "../../shared/datamodels/Submission/model/Submission";
import {GeneralPercentage} from "../../shared/datamodels/Analytics/models/GeneralPercentage";
import {PassPercentage} from "../../shared/datamodels/Analytics/models/PassPercentage";
import {Planguage} from "../../shared/datamodels/PLanguage/model/PLanguage";
import {SubmissionFlat} from "../../shared/datamodels/Submission/model/SubmissionFlat";

/**
 * Original idea: Feed data into analytics component
 * new idea:
 * Reuse analytics component
 * Give children components more options via import
 */

@Component({
  selector: 'app-permalink-component',
  templateUrl: './permalink-component.component.html',
  styleUrls: ['./permalink-component.component.css']
})
export class PermalinkComponentComponent implements OnInit {

  private userDataToken: string = "";

  wait: boolean = false;
  datafound: boolean = false;
  generalPercentage!: GeneralPercentage;
  passPercentages: PassPercentage[] = null!;
  submissions: SubmissionFlat[] = [];
  languages: Planguage[] = [];
  username: string = "";

  constructor(private route: ActivatedRoute,
              private httpClient: HttpClient,
              private requestService: RequestService) { }

  async ngOnInit() {
    this.callUserData();
  }

  private  callUserData() {
    const token = this.readUserDataToken();
    const link = `${environment.api}/userdata/${token}`;
    console.log(link);
    /*const userDataObservable = this.httpClient.get(link) as Observable<UserData>;
    userDataObservable.subscribe((userData: UserData) => {
      this.userData = userData;
      console.log(userData);
    });*/
    this.requestService.anyGetRequest(link).subscribe((userData: UserData) => {
      this.initUserData(userData);
    });
  }

  private readUserDataToken() {
    return this.route.snapshot.paramMap.get('token');
  }

  private initUserData(userData: UserData) {
    //this.username = userData.user.email;
    this.submissions = userData.submissionList;
    this.generalPercentage = userData.generalPercentage;
    this.passPercentages = userData.passPercentages;
    this.initLanguages(userData);
    this.datafound = true;
    this.wait = false;
  }

  private initLanguages(userData: UserData) {
    for(const passPercentage of userData.passPercentages) {
      this.languages.push(passPercentage.planguage);
    }
  }
}
