import axios from "axios";
import { useCallback, useState } from "react";
import { useMessage } from "../useMessages";
import { useHistory } from "react-router";
import { SchedulePost } from "../../types/api/schedulePost";
import { BaseUrl } from "../useBaseUrl";

export const useCreateSchedule = () => {
  const history = useHistory();
  const { showMessage } = useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const createSchedule = useCallback((params: SchedulePost) => {
    setLoading(true);
    axios
      .post<SchedulePost>(`${BaseUrl}/api/schedules/`, params)
      .then((res) => {
        showMessage({ title: "作成しました。", status: "info" });
        history.push("/")
      })
      .catch((error) => {
        console.log(error)
        showMessage({ title: "スケジュールの作成に失敗しました！", status: "error" });
        history.push({pathname: "/schedule/error", state: String(error)})
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return { createSchedule, loading };
};
