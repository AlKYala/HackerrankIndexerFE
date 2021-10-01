import {BaseEntity} from "../../Base/model/BaseEntity";
import {Challenge} from "../../Challenge/model/Challenge";
import {Planguage} from "../../PLanguage/model/PLanguage";
import {Contest} from "../../Contest/model/Contest";

/**
 * Used after data is processed in backend and loaded
 */
export interface Submission extends BaseEntity {
  contest: Contest;
  challenge: Challenge;
  code: string;
  score: number;
  language: Planguage;
}
