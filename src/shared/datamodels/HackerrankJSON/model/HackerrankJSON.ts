import {Submission} from "../../Submission/model/Submission";

/**
 * commented out fields can be added in later versions
 */
export interface HackerrankJSON {
  username: string;
  email: string;
  //challenges_created: any[];
  submissions: Submission[];
  //contest_participations: any[];
  //forum_comments: any[];
  //all_ratings: any[];
  //contest_medals: any[];
  //skills_test: any[];
}
