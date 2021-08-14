import {BaseEntity} from "../../Base/model/BaseEntity";

/**
 * used BEFORE data is processed - when data is first loaded in upload
 */
export interface SubmissionJSON extends BaseEntity {
  contest: string;
  challenge: string;
  code: string;
  score: number;
  language: string;
}
