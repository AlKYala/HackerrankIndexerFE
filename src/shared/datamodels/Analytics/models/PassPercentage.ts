import {Planguage} from "../../PLanguage/model/PLanguage";
import {UserData} from "../../User/model/UserData";

export interface PassPercentage {
  id: number;
  total: number;
  passed: number;
  created: boolean;
  planguage: Planguage;
  userData: UserData;

}
