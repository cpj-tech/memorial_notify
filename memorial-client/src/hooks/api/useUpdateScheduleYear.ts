import axios from "axios";
import { useCallback } from "react";
import { useMessage } from "../useMessages";
import { UpdateDisplayYearType } from "../../types/api/updateDisplayYear";
import { useHistory } from "react-router";
import { BaseUrl } from "../useBaseUrl";

export const useUpdateScheduleYear = () => {
  const { showMessage } = useMessage();
  const history = useHistory();
  const updateScheduleYear = useCallback(async(displayYear: number, displayMonth: number, userid: number | undefined) => {
    const params = {
        Line_id: userid,
        displayYear: displayYear,
        displayMonth: displayMonth,
    }
    await axios
      .post<UpdateDisplayYearType>(`${BaseUrl}/api/update_nfdates/`, params)
      .then((res) => {
        console.log(res.data)
      })
      .catch((error) => {
        console.log(error)
        showMessage({ title: "スケジュールの登録日の更新に失敗しました！", status: "error" });
        history.push({pathname: "/schedule/error", state: String(error)})
      })
  }, []);
  return { updateScheduleYear };
};
