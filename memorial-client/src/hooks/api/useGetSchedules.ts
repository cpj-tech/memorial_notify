import axios from "axios";
import { useCallback } from "react";
import { useMessage } from "../useMessages";
import { useAllSchedules } from "../useAllSchedules";  
import { Schedule } from "../../types/api/schedule";
import { useHistory } from "react-router";
import { BaseUrl } from "../useBaseUrl";


export const useGetSchedules = () => {
  const history = useHistory();
  const { showMessage } = useMessage();
  const { setSchedules } = useAllSchedules();
  const getSchedules = useCallback((startMontth: string, endMonth: string) => {
    axios
      .get<Array<Schedule>>(`${BaseUrl}/api/schedules/?start_month=${startMontth}&end_month=${endMonth}`)
      .then((res) => {
        console.log(res.data)
        setSchedules(res.data);
      })
      .catch((error) => {
        console.log(error)
        showMessage({ title: "スケジュールの取得に失敗しました！", status: "error" });
        history.push({pathname: "/schedule/error", state: String(error)})
      })
  }, []);
  return { getSchedules };
};
