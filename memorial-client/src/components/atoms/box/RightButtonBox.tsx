import { Box } from '@chakra-ui/react';
import { ReactNode, VFC } from 'react'

type Props = {
    children: ReactNode;
}

export const RightButtonBox: VFC<Props> = (props) => {
    const { children } = props;
    return (
        <Box
         position="fixed"
         right="1%"
         bottom="1%"
         zIndex="2">
        {children}
        </Box>
    )
}