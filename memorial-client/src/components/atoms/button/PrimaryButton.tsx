import { Button } from '@chakra-ui/react';
import { ReactNode, VFC } from 'react'

type Props = {
    children: ReactNode;
    onClick?: () => void;
    type: "button" | "submit" | "reset" | undefined;
}

export const PrimaryButton: VFC<Props> = (props) => {
    const { children, onClick, type } = props;
    return (
        <Button
         onClick={onClick}
         type={type}
         _focus={{ boxShadow: "none", _focus: "none"}}
         _hover={{ opacity: "0.8" }}
         mt={4}
         isActive={false}
         size="md"
         bg="blue.500"
         color="white"
         >
        {children}
        </Button>
    )
}