import axios from "axios";
import { useCallback, useState } from "react";
import { useMessage } from "../useMessages";
import { useHistory } from "react-router";
import { SchedulePost } from "../../types/api/schedulePost";
import { BaseUrl } from "../useBaseUrl";

export const usePutSchedule = () => {
  const history = useHistory();
  const { showMessage } = useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const putSchedule = useCallback((params: SchedulePost, id: number | "") => {
    setLoading(true);
    axios
      .put<SchedulePost>(`${BaseUrl}/api/schedules/${id}/`, params)
      .then((res) => {
        showMessage({ title: "更新しました。", status: "info" });
        history.push("/")
      })
      .catch((error) => {
        console.log(error)
        showMessage({ title: "スケジュールの更新に失敗しました！", status: "error" });
        history.push({pathname: "/schedule/error", state: String(error)})
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return { putSchedule, loading };
};
