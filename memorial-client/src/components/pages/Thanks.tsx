import { Box, Text, Divider, Flex, Heading, Stack } from '@chakra-ui/layout'
import { memo, VFC } from 'react'

export const Thanks: VFC = memo(() => {
  return (
    <>
    <Flex align="center" justify="center" height="100vh">
      <Box bg="white" p={4} borderRadius="md" shadow="md">
        <Heading as="h1" size="lg" textAlign="center">
          お問い合わせ<br/>
          ありがとうございました。
        </Heading>
        <Divider my={4} />
        <Stack spacing={6} px={10} textAlign="center">
          <Text size="xs">
            内容を確認いたしまして、<br/>
            ご連絡させて頂きます。<br/>
            しばらくお待ち下さい。
          </Text>
        </Stack>
      </Box>
    </Flex>    
    </>

  )
})
