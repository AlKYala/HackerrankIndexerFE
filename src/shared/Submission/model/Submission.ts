import {BaseEntity} from "../../Base/model/BaseEntity";

export interface Submission extends BaseEntity {
  //content processed in backend
  contest: string;
  challenge: string;
  code: string;
  score: number;
  language: string;
}
