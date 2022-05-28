import {GeneralPercentage} from "../../Analytics/models/GeneralPercentage";
import {PassPercentage} from "../../Analytics/models/PassPercentage";
import {UserData} from "./UserData";

export interface User {
  id: number;
  userData: UserData[];
  email: string;
  "userDataToken": string,
  "verified": boolean
}
