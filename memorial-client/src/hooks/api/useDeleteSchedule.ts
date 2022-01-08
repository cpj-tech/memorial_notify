import axios from "axios";
import { useCallback, useState } from "react";
import { useMessage } from "../useMessages";
import { Schedule } from "../../types/api/schedule";
import { useHistory } from "react-router";
import { BaseUrl } from "../useBaseUrl";

export const useDeleteSchedule = () => {
  const history = useHistory();
  const { showMessage } = useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const deleteSchedule = useCallback((id: number) => {
    setLoading(true);
    axios
      .delete<Schedule>(`${BaseUrl}/api/schedules/${id}/`)
      .then((res) => {
        showMessage({ title: "削除しました！", status: "info" });
        history.push("/")
      })
      .catch((error) => {
        console.log(error)
        showMessage({ title: "スケジュールの削除に失敗しました！", status: "error" });
        history.push({pathname: "/schedule/error", state: String(error)})
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return { deleteSchedule, loading };
};
