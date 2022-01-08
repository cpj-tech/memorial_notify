import { memo, VFC } from 'react'
import { useHistory, useLocation } from 'react-router';
import { CalendarIcon } from '@chakra-ui/icons';
import { Box, Flex } from '@chakra-ui/layout';

import { Schedule } from '../../types/api/schedule';
import { RightButtonBox } from '../../components/atoms/box/RightButtonBox'
import { ScheduleCircleButton } from '../atoms/button/ScheduleCircleButton';
import { Table, Tbody, Td, Th, Tr } from '@chakra-ui/table';
import { useUtilsSchedule } from '../../hooks/useUtilsSchedules';
import { DeleteButton } from '../atoms/button/DeleteButton';
import { EditButton } from '../atoms/button/EditButton';
import { DeleteConfirmModal } from '../organisms/schedule/DeleteConfirmModal';
import { useDisclosure } from '@chakra-ui/hooks';

export const ScheduleDetail: VFC = memo((props) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation<Schedule>();
  const history = useHistory();
  const { exDate, getTimeFormat, getStrNftimings } = useUtilsSchedule();
  const schedule = location.state;
  const dateStr = exDate(schedule.notification_date)
  const timeIndex = schedule.notification_time
  const time = getTimeFormat()[Number(timeIndex)];
  const timings = getStrNftimings(schedule.notification_timing)


  const onClickEdit = () => {
    console.log('Edit')
    history.push({pathname: "/schedule/form", state: schedule })
  }
  
  return (
    <>
      <Flex fontWeight="bold" fontSize="lg" justify="center" mt={3} as="h1">
        記念日詳細
      </Flex>
      <Table my={7} size="lg" variant="simple">
        <Tbody>
          <Tr>
            <Th whiteSpace="nowrap" textAlign="center">タイトル</Th>
            <Td textAlign="center" wordBreak="break-all">{schedule.title}</Td>
          </Tr>
          <Tr>
            <Th whiteSpace="nowrap" textAlign="center">予定日</Th>
            <Td textAlign="center">{dateStr}</Td>
          </Tr>
          <Tr>
            <Th whiteSpace="nowrap" textAlign="center">通知設定</Th>
            <Td textAlign="center" noWrap>{timings}</Td>
          </Tr>
          <Tr>
            <Th textAlign="center">時間</Th>
            <Td textAlign="center">{time}</Td>
          </Tr>
          <Tr>
            <Th textAlign="center">メモ</Th>
            <Td textAlign="center" wordBreak="break-all">{schedule.memo}</Td>
          </Tr>
        </Tbody>
      </Table>
      <Box textAlign="center">
        <EditButton onClick={onClickEdit}>編集</EditButton>
        <DeleteButton onClick={() => onOpen()}>削除</DeleteButton>
      </Box>
      <DeleteConfirmModal isOpen={isOpen} onClose={onClose} id={schedule.id} />    
      <RightButtonBox>
        <ScheduleCircleButton onClick={() => history.goBack()}>
          <CalendarIcon />
        </ScheduleCircleButton>
      </RightButtonBox>    
    </>
  )
})