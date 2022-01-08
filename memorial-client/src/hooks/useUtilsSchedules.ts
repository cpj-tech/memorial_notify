import { useCallback } from 'react'
import format from 'date-fns/format'

export const useUtilsSchedule = () => {

    const exDate = useCallback((dateStr: string) => {
        const date = new Date(dateStr)
        var wDay = date.getDay();
        dateStr = format(date, 'y/MM/dd')
        const dayname = ['日','月','火','水','木','金','土'];
        
        return dateStr + '(' + dayname[wDay] + ')';    
    }, []); 

    const getTimeFormat = useCallback(() => {
        const times = []
        for (let i=0; i < 25; i++) {
            if (i < 10) {
                times.push(`0${i}:00`)
            } else {
                times.push(`${i}:00`)
            }
        }
        return times    
    }, []); 

    const getStrNftimings = useCallback((nftimings: Array<string>) => {
        const sortedNftimings = nftimings.sort()
        const strNftimings = []
        for (const timing of sortedNftimings) {
            if (timing === "0") {
                strNftimings.push("当日")
            } else if ( timing === "1") {
                strNftimings.push("1日前")
            } else if (timing === "2") {
                strNftimings.push("1週間前")
            } else if (timing === "3") {
                strNftimings.push("1か月前")
            }
        }
        return strNftimings.join("・")
    }, []);     

  return { exDate, getTimeFormat, getStrNftimings }
}