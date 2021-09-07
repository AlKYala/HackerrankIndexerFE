import {Planguage} from "../../PLanguage/model/PLanguage";
import {PLanguageService} from "../../PLanguage/service/PLanguageService";

export interface UsagePercentages {
  pLanguages: Planguage[];
  percentages: number[];
}
