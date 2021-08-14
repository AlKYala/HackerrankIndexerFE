import {BaseEntity} from "../../Base/model/BaseEntity";

export interface User extends BaseEntity {
  username: string;
  email: string;
}
