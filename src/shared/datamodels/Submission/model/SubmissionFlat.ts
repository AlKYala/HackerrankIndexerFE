import {BaseEntity} from "../../Base/model/BaseEntity";
import {UserData} from "../../User/model/UserData";
import {Contest} from "../../Contest/model/Contest";
import {Challenge} from "../../Challenge/model/Challenge";
import {Planguage} from "../../PLanguage/model/PLanguage";

/**
 * The same as Submission but code property is left out
 */
export interface SubmissionFlat extends BaseEntity {
  userData: UserData;
  contest: Contest;
  challenge: Challenge;
  score: number;
  language: Planguage;
}
