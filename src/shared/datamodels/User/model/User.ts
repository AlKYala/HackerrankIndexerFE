import {GeneralPercentage} from "../../Analytics/models/GeneralPercentage";
import {PassPercentage} from "../../Analytics/models/PassPercentage";

export interface User {
  id: number;
  generalPercentage: GeneralPercentage;
  usagePercentages: any; //TODO
  passPercentages: PassPercentage[];
  email: string;
}
