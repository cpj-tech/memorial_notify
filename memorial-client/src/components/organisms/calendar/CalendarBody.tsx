import React, { memo, useEffect, VFC } from 'react'
import { GridItem } from '@chakra-ui/react'

import { useTargetDate } from '../../../hooks/useTargetDate'
import { format } from 'date-fns'
import { useAllSchedules } from '../../../hooks/useAllSchedules'
import { useUtilsCalendar } from '../../../hooks/useUtilsCalendar'


export const CalendarBody: VFC = memo(() => {
  
  const { targetDate, setClickedDate } = useTargetDate();
  const { getCalendarArray,
          getCalendarRows,
          getDateColor,
          getCalendarDay,
          getFontColorDate,
          getScheduleTitles,
          openShowDrawer } = useUtilsCalendar();
  const { schedules } = useAllSchedules();
  const calendar = getCalendarArray(targetDate);
  const rowSpan = getCalendarRows(calendar)


  const onClickShowDrawer = (event: React.MouseEvent<HTMLElement>) => {
    openShowDrawer((event.target as Element).id, schedules)
    setClickedDate((event.target as Element).id)
  }

  useEffect(() => {
    setClickedDate("")
  }, [])

  return (
    <>
      {calendar.map((weekRow)  =>(
        weekRow.map((date, index) => {
          const bg_color = getDateColor(date)
          const font_color = getFontColorDate(index+1)
          const day = getCalendarDay(date)
          const display_date = format(date, 'y-MM-dd')
          const titles = getScheduleTitles(display_date, schedules)
          return(
            <GridItem
            key={display_date}
            id={display_date}
            rowSpan={rowSpan}
            colSpan={1}
            bg={bg_color}
            color={font_color}
            overflow="hidden"
            whiteSpace="nowrap"
            borderBottom="1px"
            borderColor="gray.200"
            onClick={onClickShowDrawer}
            _hover={{ color: "white", backgroundColor: "orange", opacity: "0.8" }}
            >
            {day}<br/>
            {titles.map((title) => (
              <>
              {title}<br />
              </>
            ))}
            </GridItem>
          )
        })
      ))}
    </>
    
  )
})