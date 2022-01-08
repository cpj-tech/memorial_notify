import { Button } from '@chakra-ui/react';
import { ReactNode, VFC } from 'react'

type Props = {
    children: ReactNode;
    onClick: () => void;
}

export const EditButton: VFC<Props> = (props) => {
    const { children, onClick } = props;
    return (
        <Button
         onClick={onClick}
         _focus={{ boxShadow: "none", _focus: "none"}}
         _hover={{ opacity: "0.8" }}
         mx={3}
         size="md"
         bg="yellow.500"
         color="white"
         >
        {children}
        </Button>
    )
}