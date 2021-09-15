import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {AnalyticsService} from "../../shared/services/AnalyticsService";
import {UsageStatistics} from "../../shared/datamodels/Analytics/models/UsageStatistics";
import {SubscriptionService} from "../../shared/services/SubscriptionService";
import {Subscription} from "rxjs";
import {Planguage} from "../../shared/datamodels/PLanguage/model/PLanguage";
import {PLanguageService} from "../../shared/datamodels/PLanguage/service/PLanguageService";
import {switchMap} from "rxjs/operators";
import {PassPercentages} from "../../shared/datamodels/Analytics/models/PassPercentages";
import {LegendPosition} from "@swimlane/ngx-charts";

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit, OnDestroy {


  private subscriptions!: Subscription[];

  pLanguages!: Planguage[];



  loaded: boolean = false;

  langaugesLoaded: boolean = false;
  chartLoaded: boolean = false;
  visualsLoaded: boolean = false;


  constructor(private analyticsService: AnalyticsService,
              private subscriptionService: SubscriptionService) { }



  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptionService.unsubscribeParam(this.subscriptions);
  }

  /**
   * ONE DIMENSIONAL SUBSCRIPTIONS START
   *
   */


  /**
   * ONE DIMENSIONAL SUBSCRIPTIONS END
   */


  /*
  }*/

  /**
   * NO SUBSCRIPTIONS DOWN HERE
   */

}

export interface colorScheme {
  domain: string[];
}
