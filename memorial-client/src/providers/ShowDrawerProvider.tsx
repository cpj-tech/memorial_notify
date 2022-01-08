import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useState
} from "react";
import { Schedule } from "../types/api/schedule";
  
  
export type showDrawerContextType = {
    showDrawer: boolean;
    setShowDrawer: Dispatch<SetStateAction<boolean>>;
    selectedSchedules: Array<Schedule> | undefined;
    setSelectedSchedules: Dispatch<SetStateAction<Array<Schedule> | undefined>>;

};

export const showDrawerContext = createContext<showDrawerContextType>(
    {} as showDrawerContextType
);

type Props = {
    children: ReactNode;
};

export const ShowDrawerProvider = (props: Props) => {
const [showDrawer, setShowDrawer] = useState<boolean>(false);
const [selectedSchedules, setSelectedSchedules] = useState<Array<Schedule>>();

const { children } = props;
return (
    <showDrawerContext.Provider value={{ showDrawer, setShowDrawer, selectedSchedules, setSelectedSchedules }}>
    {children}
    </showDrawerContext.Provider>
  );
};
  