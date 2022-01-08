import { Box } from '@chakra-ui/react';
import { ReactNode, VFC } from 'react'

type Props = {
    children: ReactNode;
}

export const CenterButtonBox: VFC<Props> = (props) => {
    const { children } = props;
    return (
        <Box
        textAlign="center"
        >
        {children}
        </Box>
    )
}