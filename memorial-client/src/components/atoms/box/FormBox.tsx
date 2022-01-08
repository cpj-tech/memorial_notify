import { Box } from '@chakra-ui/react';
import { ReactNode, VFC } from 'react'

type Props = {
    children: ReactNode;
    width?: string;
}

export const FormBox: VFC<Props> = (props) => {
    const { children, width } = props;
    return (
        <Box
        textAlign="center"
        width={width}
        my={1}
        >
        {children}
        </Box>
    )
}