import {Planguage} from "../../PLanguage/model/PLanguage";

export interface UsagePercentage {
  id: number;
  percentage: number;
  total: number;
  pLanguage: Planguage;
}
