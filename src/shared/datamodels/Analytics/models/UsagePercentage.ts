import {Planguage} from "../../PLanguage/model/PLanguage";

export interface UsagePercentage {
  pLanguage: Planguage;
  percentage: number;
  total: number;
}
