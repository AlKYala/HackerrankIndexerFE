import {Planguage} from "../../PLanguage/model/PLanguage";
import {PLanguageService} from "../../PLanguage/service/PLanguageService";

export interface UsageStatistics {
  planguages: Planguage[];
  numberSubmissions: number[];
}
