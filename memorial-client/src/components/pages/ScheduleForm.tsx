import { memo, useEffect, useState, VFC } from 'react'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { Flex, Stack, Input, Select, Textarea } from '@chakra-ui/react'
import { useHistory, useLocation } from 'react-router'
import { useForm } from "react-hook-form";
import { Form } from 'react-bootstrap'
import { useDisclosure } from '@chakra-ui/hooks'

import { CalendarIcon } from '@chakra-ui/icons'
import { ScheduleCircleButton } from '../atoms/button/ScheduleCircleButton'
import { RightButtonBox } from '../atoms/box/RightButtonBox'
import { PrimaryButton } from '../atoms/button/PrimaryButton'
import { CenterButtonBox } from '../atoms/box/CenterButtonBox'
import { Schedule } from '../../types/api/schedule'
import { useUtilsSchedule } from '../../hooks/useUtilsSchedules';
import { NftimingModal } from '../organisms/schedule/NftimingModal';
import { MemoModal } from '../organisms/schedule/MemoModal';
import { useCreateSchedule } from '../../hooks/api/useCreateSchedule';
import { SchedulePost } from '../../types/api/schedulePost';
import { usePutSchedule } from '../../hooks/api/usePutSchedule';
import { useTargetDate } from '../../hooks/useTargetDate';
import { useUserInfo } from '../../hooks/useUserInfo';


export const ScheduleForm: VFC = memo(() => {
  const history = useHistory();
  const location = useLocation<Schedule>();
  const { clickedDate } = useTargetDate();
  const { register, formState: { errors }, handleSubmit } = useForm();
  const [ schedule, setSchedule ] = useState<Schedule>(location.state);
  const id = location.state !== undefined ? location.state.id : "";
  const title = location.state !== undefined ? location.state.title : "";
  const nfdate = location.state !== undefined ? location.state.notification_date : clickedDate;
  const nftiming = location.state !== undefined ? location.state.notification_timing : [];
  const nftime = location.state !== undefined ? location.state.notification_time : "";
  const memo = location.state !== undefined ? location.state.memo : "";
  
  const { isOpen: isOpenNftimingModal,
          onOpen: onOpenNftimingModal, 
          onClose: onCloseNftimingModal } = useDisclosure();
  const { isOpen: isOpenMemoModal,
          onOpen: onOpenMemoModal, 
          onClose: onCloseMemoModal } = useDisclosure();
  const [ memoVal, setMemoVal ] = useState<string | undefined>();
  const [ nfTiming, setNfTiming ] = useState<Array<string>>([]);

  const { createSchedule } = useCreateSchedule();
  const { userid } = useUserInfo();
  const { putSchedule } = usePutSchedule();
  const { getStrNftimings } = useUtilsSchedule()
  const timings = getStrNftimings(nfTiming)
	const { getTimeFormat } = useUtilsSchedule()
	const times = getTimeFormat();
  
  useEffect(()  => {
    setSchedule(schedule)
    setNfTiming(nftiming)
    setMemoVal(memo)
  },[])

  const onSubmit = (data: SchedulePost) => {
    data.notification_timing = nfTiming;
    data.Line_id = userid
    if ( location.state !== undefined ) {
      console.log(id)
      putSchedule(data, id)
    } else {
      createSchedule(data)
    }
  }

  return (
    <>
      <Flex fontWeight="bold" fontSize="lg" justify="center" mt={2} as="h1">記念日作成</Flex>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Stack mx={3} mt={2} spacing={4}>
            <FormControl id="title">
              <FormLabel fontSize="sm">タイトル&nbsp;&nbsp;
                <span style={{color: "red"}}>*</span>
                </FormLabel>
                  <Input
                  {...register("title", { required: true, pattern: /([^\x01-\x7E]|\w)+$/i})}
                  type="text"
                  defaultValue={title}
                  />
                  <Flex as="span" color="red" fontSize="sm"> {errors.title && "タイトルは必須入力です。"}</Flex>
              </FormControl>
              <FormControl id="notification_date">
                <FormLabel fontSize="sm">予定日&nbsp;&nbsp;
                  <span style={{color: "red"}}>*</span>
                  </FormLabel>
                    <Input
                    {...register("notification_date", { required: true })}
                    type="date"
                    defaultValue={nfdate}
                    />
                  <Flex as="span" color="red" fontSize="sm"> {errors.notification_date && "予定日は必須入力です。"}</Flex>
              </FormControl>
              <FormControl id="notification_timing">
              <FormLabel fontSize="sm">通知設定日&nbsp;&nbsp;
                <span style={{color: "red"}}>*</span>
              </FormLabel>
                <Input
                  isReadOnly
                  type="text"
                  defaultValue={timings}
                  {...register("nftiming", { required: true })}
                  onClick={() => onOpenNftimingModal()}
                />
                <Flex as="span" color="red" fontSize="sm"> {errors.nftiming && timings === '' && "通知設定日は必須入力です。"}</Flex>
              </FormControl>
              <NftimingModal
                isOpen={isOpenNftimingModal}
                onClose={onCloseNftimingModal}
                nfTiming={nfTiming}
                setNfTiming={setNfTiming} />
              <FormControl id="notification_time">
                <FormLabel fontSize="sm">通知時間&nbsp;&nbsp;
                  <span style={{color: "red"}}>*</span>
                </FormLabel>
                  <Select
                    _focus={{ boxShadow: "none"}}
                    {...register("notification_time", { required: true })}
                    placeholder="--------"
                    defaultValue={nftime}
                  >
                    {times.map((time, index)  => (
                      <option key={index} value={index}>{time}</option>
                    ))}
                  </Select>
                <Flex as="span" color="red" fontSize="sm"> {errors.notification_time && "通知時間は必須入力です。"}</Flex>
              </FormControl>
              <FormControl id="memo">                
                <FormLabel fontSize="sm">メモ</FormLabel>
                  <Textarea
                  isReadOnly
                  defaultValue={memoVal}
                  _focus={{ boxShadow: "none"}}
                  {...register("memo", { pattern: /([^\x01-\x7E]|\w)+$/i})}
                  onClick={() => onOpenMemoModal()}
                  />
                  <Flex as="span" color="red" fontSize="sm"> {errors.memo && "使用できない文字列が含まれています。"}</Flex>
              </FormControl>
              <MemoModal isOpen={isOpenMemoModal} onClose={onCloseMemoModal} memoVal={memoVal} setMemoVal={setMemoVal} />              
            </Stack>
          <CenterButtonBox>
            <PrimaryButton type="submit">登録</PrimaryButton>
          </CenterButtonBox>
        </Form>
    <RightButtonBox>
      <ScheduleCircleButton onClick={() => history.push("/")}>
        <CalendarIcon />
      </ScheduleCircleButton>
    </RightButtonBox>
    </>
  )
})