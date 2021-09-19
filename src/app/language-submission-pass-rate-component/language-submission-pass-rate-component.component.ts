import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Planguage} from "../../shared/datamodels/PLanguage/model/PLanguage";
import {PLanguageService} from "../../shared/datamodels/PLanguage/service/PLanguageService";
import {Subscription} from "rxjs";
import {PassPercentages} from "../../shared/datamodels/Analytics/models/PassPercentages";
import {switchMap} from "rxjs/operators";
import {AnalyticsService} from "../../shared/services/AnalyticsService";

@Component({
  selector: 'app-language-submission-pass-rate-component',
  templateUrl: './language-submission-pass-rate-component.component.html',
  styleUrls: ['./language-submission-pass-rate-component.component.css']
})
export class LanguageSubmissionPassRateComponentComponent implements OnInit, AfterViewInit {

  pLanguages!: Planguage[];
  private subscriptions!: Subscription[];
  pLanguagePassPercentageMap = new Map<number, number>();

  constructor(private pLanguageService: PLanguageService,
              private analyticsService: AnalyticsService) { }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.subscriptions = [];
    this.initData();
  }

  private initData() {
    this.pLanguageService.findAll().pipe(switchMap((planguages: Planguage[]) => {
      this.pLanguages = planguages;
      return this.analyticsService.getPassPercentagesOfPLanguages();
    })).subscribe((data: PassPercentages) => {
      this.initPassPercentages(data);
      this.visualizeLanguagePercentage();
    })
  }

  private visualizeLanguagePercentage() {
    for(const language of this.pLanguages) {
      if(document.getElementById(`${language.language.concat('percentageId')}`) != null) {
        const percentage = this.pLanguagePassPercentageMap.get(language.id!);
        console.log(`${language.language} ${language.color}`);
        document.getElementById(`${language.language.concat('percentageId')}`)!.style.width = `${percentage!}%`;
        document.getElementById(`${language.language.concat('percentageId')}`)!.style.backgroundColor = `${language.color}`;
      }
    }
  }

  private initPassPercentages(percentages: PassPercentages): void {
    for(let i = 0; i < percentages.planguages.length; i++) {
      const languageId = percentages.planguages[i].id;
      const percentagePass = percentages.percentages[i];
      this.pLanguagePassPercentageMap.set(languageId!, Math.round(percentagePass * 100));
    }
  }

}
