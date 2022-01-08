import { useContext } from "react";

import {
    schedulesContext,
    SchedulesContextType
} from "../providers/AllSchedulesProvider";

export const useAllSchedules = (): SchedulesContextType =>
  useContext(schedulesContext);
