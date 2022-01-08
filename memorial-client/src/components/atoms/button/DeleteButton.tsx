import { Button } from '@chakra-ui/react';
import { ReactNode, VFC } from 'react'

type Props = {
    children: ReactNode;
    onClick: () => void;
}

export const DeleteButton: VFC<Props> = (props) => {
    const { children, onClick } = props;
    return (
        <Button
         onClick={onClick}
         _focus={{ boxShadow: "none", _focus: "none"}}
         _hover={{ opacity: "0.8" }}
         size="md"
         mx={3}
         bg="tomato"
         color="white"
         >
        {children}
        </Button>
    )
}