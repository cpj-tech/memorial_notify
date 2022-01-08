import { memo, useEffect, useState, VFC } from 'react'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Heading, Stack, Input, Select, Textarea, Box, Flex } from '@chakra-ui/react'
import { useForm } from "react-hook-form";
import { Form } from 'react-bootstrap'
import { CenterButtonBox } from '../atoms/box/CenterButtonBox';
import { PrimaryButton } from '../atoms/button/PrimaryButton';
import { usePostContact } from '../../hooks/api/usePostContact';
import { useUserInfo } from '../../hooks/useUserInfo';
import { useGetUserInfo } from '../../hooks/api/useGetUserInfo';
import { useLocation } from 'react-router';


export const Contact: VFC = memo(() => {
  const search = useLocation().search;
  const { register, formState: { errors }, handleSubmit } = useForm();
  const { postContact } = usePostContact();
  const { getUserInfo } = useGetUserInfo();
  const { userid } = useUserInfo();

  useEffect(() => {
    // クエリ文字列から認証コードを取得
    const query = new URLSearchParams(search);
    const authParam = {
      code: query.get('code'),
      isCalendar: false
    } 
    // ユーザ情報を取得
    if (authParam.code !== null) {
      getUserInfo(authParam);
    }
  }, [])

  const onSubmit = (data: any) => {
    data.userid = userid;
    postContact(data)
  }
  return (
    <Box height="100vh" textAlign="center">
      <Heading as="h1" size="md" my={5}>メールで問い合わせ</Heading>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Stack mx={3} mt={3} spacing={3}>
            <FormControl id="email">
              <FormLabel fontSize="sm">メールアドレス&nbsp;&nbsp;
                <span style={{color: "red"}}>*</span>
              </FormLabel>
                  <Input
                  _focus={{ boxShadow: "none"}}
                  {...register("email", {required: true})}
                  type="email"
                  />
                  <Flex as="span" color="red" fontSize="sm"> {errors.email && "メールアドレスは必須入力です。"}</Flex>
            </FormControl>
            <FormControl id="category">
              <FormLabel fontSize="sm">カテゴリ&nbsp;&nbsp;
                <span style={{color: "red"}}>*</span>
              </FormLabel>
              <Select
                  _focus={{ boxShadow: "none"}}
                  placeholder="--------"
                  {...register("category", {required: true})}
                >
                  <option value="0">アプリの不具合</option>
                  <option value="1">アイデア・機能のご提案</option>
                  <option value="2">その他</option>
                </Select>
                <Flex as="span" color="red" fontSize="sm"> {errors.category && "カテゴリは必須入力です。"}</Flex>
            </FormControl>
            <FormControl id="content">
            <FormLabel fontSize="sm">内容&nbsp;&nbsp;
              <span style={{color: "red"}}>*</span>
            </FormLabel>
                       
              <Textarea
                rows={5}
                {...register("message", {required: true, pattern: /([^\x01-\x7E]|\w)+$/i})}
                />
              <Flex as="span" color="red" fontSize="sm"> {errors.message && "内容は必須入力です。"}</Flex>
            </FormControl>
          </Stack>
          <CenterButtonBox>
              <PrimaryButton type="submit">送信</PrimaryButton>
          </CenterButtonBox>
        </Form>
    </Box>
    
  )
})