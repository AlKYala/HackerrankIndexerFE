import {Submission} from "../../Submission/model/Submission";
import {User} from "./User";

export interface UserData {
  submissionList: Submission[];
  user: User;
}
