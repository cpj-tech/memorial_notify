import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useState
} from "react";
  
  
export type TargetDateContextType = {
    targetDate: Date;
    setTargetDate: Dispatch<SetStateAction<Date>>;
    clickedDate: string;
    setClickedDate: Dispatch<SetStateAction<string>>;

};

export const TargetDateContext = createContext<TargetDateContextType>(
    {} as TargetDateContextType
);

type Props = {
    children: ReactNode;
};

export const TargetDateProvider = (props: Props) => {
const [clickedDate, setClickedDate] = useState<string>("");    
const [targetDate, setTargetDate] = useState<Date>(new Date());
const { children } = props;
return (
    <TargetDateContext.Provider value={{ targetDate, setTargetDate, clickedDate, setClickedDate }}>
    {children}
    </TargetDateContext.Provider>
  );
};
  