import { useContext } from "react";

import {
  TargetDateContext,
  TargetDateContextType
} from "../providers/TargetDateProvider";
export const useTargetDate = (): TargetDateContextType =>
  useContext(TargetDateContext);
