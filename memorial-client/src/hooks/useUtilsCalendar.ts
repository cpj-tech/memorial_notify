import { useCallback } from 'react'

import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import endOfWeek from 'date-fns/endOfWeek'
import eachWeekOfInterval from 'date-fns/eachWeekOfInterval'
import startOfMonth from 'date-fns/startOfMonth'
import endOfMonth from 'date-fns/endOfMonth'
import { getDate } from 'date-fns'
import format from 'date-fns/format'
import { Schedule } from "../types/api/schedule";
import { useShowDrawer } from './useShowDrawer'


export const useUtilsCalendar = () => {

    // カレンダーの日付を配列で返却
    const getCalendarArray = useCallback((date) => {
        const sundays = eachWeekOfInterval({
          start: startOfMonth(date),
          end: endOfMonth(date)
        })
        return sundays.map(sunday =>
          eachDayOfInterval({start: sunday, end: endOfWeek(sunday)})
        )
    }, [])

    // カレンダーの行数に応じてグリッドrowSpanを決定
    let rowSpan: number;
    const getCalendarRows = useCallback((calendar) => {
      if (calendar.length === 6) {
        rowSpan = 15
      } else if (calendar.length === 5) {
        rowSpan = 18
      }
      return rowSpan
    }, [])

    // 今日の日付を強調表示
    const getDateColor = useCallback((date: Date) => {
        // 今日の年-月-日
        const now_date = format(new Date(), 'y-MM-dd')
        // カレンダーの月/日
        const calendar_date = format(date, 'y-MM-dd')
  
        return ( 
          now_date === calendar_date ? 'teal.100' : 'white'
         )
      }, [])
  
      // 日付のみを返却する
      const getCalendarDay = useCallback((date: Date) => (
        getDate(date)
      ),[])
  
      // 土曜、日曜の日付に色を付ける
      const getFontColorDate = useCallback((index: number) => {
        let color: string;
        if ( index % 7 === 1 ) {
          color = 'tomato'
        } else if ( index % 7 === 0 ) {
          color = 'blue.400'
        } else {
          color = 'gray.800'
        }
        return color
      }, [])

      // 選択日のスケジュールタイトルを配列で取得
      const getScheduleTitles = useCallback((dateStr: string, schedules: Array<Schedule> | undefined) => {
        const titles: Array<string> = [];
    
        if (schedules !== undefined) {
          for (const schedule of schedules) {
            if (schedule.notification_date === dateStr) {
                titles.push(schedule.title)
            }
          }
        }
    
        return titles
      }, []); 
      
      // 選択された日付からスケジュールを表示、格納
      const { setShowDrawer, setSelectedSchedules } = useShowDrawer();
      const openShowDrawer = useCallback((strDate: string, schedules: Array<Schedule> | undefined) => {
        const titles: Array<string> = [];
        if (schedules !== undefined) {
          for (const schedule of schedules) {
            if (schedule.notification_date === strDate) {
              titles.push(schedule.title)
            }
          }
          if (titles.length > 0) {
            setShowDrawer(titles.length > 0)
            const selectedSchedules = schedules.filter(schedule => schedule.notification_date === strDate)
            setSelectedSchedules(selectedSchedules)
          } else {
            setShowDrawer(titles.length > 0)
          }
        }
      }, [])

      // 土曜、日曜の日付に色を付ける
      const getTargetDateInfo = useCallback((targetDate: Date) => {
        // 表示付きの月初と月末を設定
        const startMontth = format(targetDate.setDate(1), 'y-MM-dd');
        targetDate.setMonth(targetDate.getMonth() + 1);
        const endMonth = format(targetDate.setDate(0), 'y-MM-dd');
        const displayYear = targetDate.getFullYear();
        const displayMonth = targetDate.getMonth() + 1;
        return { startMontth, endMonth, displayYear, displayMonth }
      }, [])      
          

  return { getCalendarArray, getCalendarRows, getFontColorDate, getCalendarDay, getDateColor, getScheduleTitles, openShowDrawer, getTargetDateInfo }
}