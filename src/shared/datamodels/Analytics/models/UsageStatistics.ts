import {Planguage} from "../../PLanguage/model/PLanguage";
import {PLanguageService} from "../../PLanguage/service/PLanguageService";

export interface UsageStatistics {
  planguage: Planguage;
  percentage: number;
  total: number;
}
