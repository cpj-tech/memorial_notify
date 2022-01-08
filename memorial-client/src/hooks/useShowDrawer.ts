import { useContext } from "react";

import {
  showDrawerContext,
  showDrawerContextType
} from "../providers/ShowDrawerProvider";

export const useShowDrawer = (): showDrawerContextType =>
  useContext(showDrawerContext);
