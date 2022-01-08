import { useContext } from "react";

import {
  UserInfoContext,
  UserInfoContextType
} from "../providers/UserInfoProvider";
export const useUserInfo = (): UserInfoContextType =>
  useContext(UserInfoContext);
