import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useState
} from "react";
import { Schedule } from "../types/api/schedule";
  
  
export type SchedulesContextType = {
    schedules: Array<Schedule> | undefined;
    setSchedules: Dispatch<SetStateAction<Array<Schedule> | undefined>>;
};

export const schedulesContext = createContext<SchedulesContextType>(
    {} as SchedulesContextType
);

type Props = {
    children: ReactNode;
};

export const AllSchedulesProvider = (props: Props) => {
const [schedules, setSchedules] = useState<Array<Schedule>>();
const { children } = props;
return (
    <schedulesContext.Provider value={{ schedules, setSchedules }}>
    {children}
    </schedulesContext.Provider>
  );
};
  