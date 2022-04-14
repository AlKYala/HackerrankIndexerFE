import {Planguage} from "../../PLanguage/model/PLanguage";
import {PLanguageService} from "../../PLanguage/service/PLanguageService";

export interface UsageStatistics {
  id: number;
  planguage: Planguage;
  passedSubmissions: number;
  total: number;
}
