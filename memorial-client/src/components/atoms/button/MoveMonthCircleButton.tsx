import { Button } from '@chakra-ui/react';
import { ReactNode, VFC } from 'react'

type Props = {
    children: ReactNode;
    onClick: () => void;
    zIndex?: number;

}

export const MoveMonthCircleButton: VFC<Props> = (props) => {
    const { children, onClick } = props;
    return (
        <Button
         onClick={onClick}
         _focus={{ boxShadow: "none", _focus: "none"}}
         _hover={{ opacity: "0.8"}}
         isActive={false}
         rounded="full"
         zIndex={1}>
        {children}
        </Button>
    )
}