import { memo, VFC } from 'react'
import format from 'date-fns/format'
import addMonths from 'date-fns/addMonths'
import subMonths from 'date-fns/subMonths'
import { GridItem } from '@chakra-ui/react'

import { useTargetDate } from '../../../hooks/useTargetDate'
import { MoveMonthCircleButton } from '../../atoms/button/MoveMonthCircleButton'


export const CalendarHeader: VFC = memo(() => {
  
  
  const weeks = ['日', '月', '火', '水', '木', '金', '土']
  const { targetDate, setTargetDate } = useTargetDate();
  const onClickAddMonth = () => {
    setTargetDate(current => addMonths(current, 1))
  }
  const onClickSubMonth = () => {
    setTargetDate(current => subMonths(current, 1))
  }

  return (
    <>
      <GridItem textAlign="center" rowSpan={5} colSpan={7} bg="gray.100">
        <MoveMonthCircleButton
        onClick={onClickSubMonth}>
           ＜
        </MoveMonthCircleButton>
           {format(targetDate, 'y年M月')}
        <MoveMonthCircleButton
        onClick={onClickAddMonth}>
          ＞
        </MoveMonthCircleButton>
      </GridItem>
        {weeks.map((week, index) =>(
          <GridItem 
            zIndex="1"
            textAlign="center"
            rowSpan={5}
            colSpan={1}
            bg="gray.100"
            key={index}
          >
            {week}
          </GridItem>
        ))}
  </>
  )
})