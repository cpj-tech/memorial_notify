import { Stack } from '@chakra-ui/layout'
import { memo, VFC } from 'react'
import { useLocation } from 'react-router'

export const Page404: VFC = memo(() => {
  const location = useLocation<string>()
  const error = location.state
  return (
    <>
    <Stack textAlign="center">
      <p>エラーページ</p>
      <p>{error}</p><br/>
      <p>Lineのリッチメニューから管理者に<br/>お問い合わせください！</p>
      <img src={`${process.env.PUBLIC_URL}/guide_error.png`} alt="Lineメッセージ画面" />
    </Stack>
    </>
  )
})