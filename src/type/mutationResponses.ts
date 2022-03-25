import { userType } from "./basicTypes";

export interface authMutaionResponse {
  code: number;
  success: boolean;
  message: string;
  user?: userType;
  accessToken?: string;
  [index: string]: any;
}

export interface userMutaionResponse {
    code: number;
    success: boolean;
    message: string;
    user?: userType;
    users?: userType[];
    [index: string]: any;
  }
