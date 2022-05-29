import {Submission} from "../../Submission/model/Submission";
import {User} from "./User";
import {Planguage} from "../../PLanguage/model/PLanguage";
import {GeneralPercentage} from "../../Analytics/models/GeneralPercentage";
import {PassPercentage} from "../../Analytics/models/PassPercentage";
import {UsagePercentage} from "../../Analytics/models/UsagePercentage";

export interface UserData {
  submissionList: Submission[];
  user: User;
  usedPLanguages: Planguage[];
  generalPercentage: GeneralPercentage;
  passPercentages: PassPercentage[];
  usagePercentages: UsagePercentage[];
  token: string;
}
