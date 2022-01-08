import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useState
} from "react";
  
  
export type UserInfoContextType = {
    userid: number | undefined;
    setUserid: Dispatch<SetStateAction<number | undefined>>;

};

export const UserInfoContext = createContext<UserInfoContextType>(
    {} as UserInfoContextType
);

type Props = {
    children: ReactNode;
};

export const UserInfoProvider = (props: Props) => {
const [ userid, setUserid] = useState<number>();
const { children } = props;
return (
    <UserInfoContext.Provider value={{ userid, setUserid }}>
    {children}
    </UserInfoContext.Provider>
  );
};
  