import {Planguage} from "../../PLanguage/model/PLanguage";

export interface PassPercentage {
  id: number;
  total: number;
  passed: number;
  created: boolean;
  planguage: Planguage;
}
