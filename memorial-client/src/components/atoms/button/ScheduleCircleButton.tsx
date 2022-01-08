import { Button } from '@chakra-ui/react';
import { ReactNode, VFC } from 'react'

type Props = {
    children: ReactNode;
    onClick: () => void;
}

export const ScheduleCircleButton: VFC<Props> = (props) => {
    const { children, onClick } = props;
    return (
        <Button
         onClick={onClick}
         _focus={{ boxShadow: "none", _focus: "none"}}
         _hover={{ opacity: "0.8" }}
         isActive={false}
         size="md"
         rounded="full"
         width="2.5rem"
         height="2.5rem"
         bg="gray.500"
         color="white"
         zIndex="2">
        {children}
        </Button>
    )
}