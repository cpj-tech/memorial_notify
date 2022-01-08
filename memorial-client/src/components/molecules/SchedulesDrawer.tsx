import { TriangleDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  List,
  ListItem,
  Spacer,
  Flex,
  Box
} from "@chakra-ui/react";

import { memo, useState, VFC } from "react";
import { useHistory } from "react-router";
import { useShowDrawer } from "../../hooks/useShowDrawer";
import { useUtilsSchedule } from "../../hooks/useUtilsSchedules";
import classes from "./ScheduleDrawer.module.scss"


export const SchedulesDrawer: VFC = memo(() => {
  const history = useHistory();
  const { showDrawer, setShowDrawer,  selectedSchedules } = useShowDrawer();
  const initClassName = showDrawer ? classes.headline : classes.out;
  const [ className, setClassName ] = useState(initClassName)

  const scheduleDate = selectedSchedules![0].notification_date
  const { exDate } = useUtilsSchedule();
  const displayDate = exDate(scheduleDate);
  
  const onClickClose = () => {
    setClassName(classes.out)
    setTimeout(() => {
      setShowDrawer(false);
    }, 500)
  }


  const onClickSchedule = (event: React.MouseEvent<HTMLElement>) => {
    const clickedSchedule = selectedSchedules?.find((schedule) => schedule.id === Number((event.target as Element).id))
    console.log(clickedSchedule)
    history.push({pathname: "/schedule/detail",  state:  clickedSchedule })
  }
  

  return (
    <Box 
    className={className}
    height="200px"
    bg="gray.100">
      <Flex 
      className={classes.title}
      justifyContent="space-between"
      bg="gray.100">
        <Box>{displayDate}</Box>
        <Spacer />
        <Box onClick={onClickClose}><TriangleDownIcon /></Box>
      </Flex>
        <List>
          {selectedSchedules?.map((schedule) => (
            <ListItem
            key={schedule.id}
            id={schedule.id.toString()}
            className={classes.schedule}
            cursor="pointer"
            onClick={onClickSchedule}>
              <ChevronRightIcon bg="orange" border="solid 0.1px" borderRadius="full" />
              &nbsp;&nbsp;{schedule.title}
            </ListItem>
          ))}
        </List>
    </Box>
  );
});
