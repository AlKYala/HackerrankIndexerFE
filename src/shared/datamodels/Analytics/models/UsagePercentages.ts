import {Planguage} from "../../PLanguage/model/PLanguage";
import {PLanguageService} from "../../PLanguage/service/PLanguageService";

export interface UsagePercentages {
  planguages: Planguage[];
  numberSubmissions: number[];
}
