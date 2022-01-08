import { memo, useEffect, useState, VFC } from 'react'

import { Grid, Center, Spinner } from '@chakra-ui/react'
import { CalendarBody } from '../organisms/calendar/CalendarBody'
import { CalendarHeader } from '../organisms/calendar/CalendarHeader'
import { ScheduleCircleButton } from '../atoms/button/ScheduleCircleButton'
import { RightButtonBox } from '../atoms/box/RightButtonBox'
import { useHistory, useLocation } from 'react-router'
import { AddIcon } from '@chakra-ui/icons'
import { useGetSchedules } from '../../hooks/api/useGetSchedules'
import { SchedulesDrawer } from '../molecules/SchedulesDrawer'
import { useShowDrawer } from '../../hooks/useShowDrawer'
import { useGetUserInfo } from '../../hooks/api/useGetUserInfo'
import { useUtilsCalendar } from '../../hooks/useUtilsCalendar'
import { useTargetDate } from '../../hooks/useTargetDate'
import { useUpdateScheduleYear } from '../../hooks/api/useUpdateScheduleYear'
import { useUserInfo } from "../../hooks/useUserInfo";


export const Calendar: VFC = memo(() => {

  const history = useHistory();
  const search = useLocation().search;
  const [ isAuthenticate, setIsAuthenticate ] = useState(false)
  const [loading, setLoading] = useState(false);
  const { getTargetDateInfo } = useUtilsCalendar();
  const { targetDate } = useTargetDate();
  const { showDrawer, setShowDrawer } = useShowDrawer();
  const { getUserInfo } = useGetUserInfo();
  const { userid } = useUserInfo();
  const { updateScheduleYear } = useUpdateScheduleYear();
  const { getSchedules } = useGetSchedules();


  const onClickToScheduleForm = () => {
    history.push("/schedule/form")
  }
  
  useEffect(() => {
    setLoading(true)
    // クエリ文字列から認証コードを取得
    const query = new URLSearchParams(search);
    const data = {
      code: query.get('code'),
      isCalendar: true
    }
    // 月初と月末を取得
    const {startMontth, endMonth, displayYear, displayMonth} = getTargetDateInfo(targetDate);
    // ユーザ情報を取得
    if (data.code !== null && !isAuthenticate) {
      getUserInfo(data)
      setIsAuthenticate(true)
    }
    // １か月のスケジュールを取得
    if (userid !== undefined) {
      const fetch = updateScheduleYear(displayYear, displayMonth, userid)
      fetch.then(() => {
        getSchedules(startMontth, endMonth);
      })
    }
    setLoading(false)
    setShowDrawer(false)
  }, [targetDate, userid])

  return (
    <>
    { loading ? (
      <Center height="100vh">
        <Spinner />
      </Center>
    ) : (
      <>
      <Grid
      h="100vh"
      templateRows="repeat(100, 1fr)"
      templateColumns="repeat(7, 1fr)"
      >
        <CalendarHeader />
        <CalendarBody />
      </Grid>
      <RightButtonBox>
        <ScheduleCircleButton onClick={onClickToScheduleForm}>
          <AddIcon />
        </ScheduleCircleButton>
      </RightButtonBox>
      { showDrawer && <SchedulesDrawer />}
      </>
    )}
    </>
  )
})