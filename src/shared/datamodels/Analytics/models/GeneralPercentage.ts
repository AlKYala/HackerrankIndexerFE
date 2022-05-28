import {Planguage} from "../../PLanguage/model/PLanguage";
import {UserData} from "../../User/model/UserData";

export interface GeneralPercentage {
  userData: UserData;
  percentageChallengesSolved: number;
  percentageSubmissionsPassed: number;
  favouriteLanguage: Planguage;
}
