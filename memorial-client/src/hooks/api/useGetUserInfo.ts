import axios from "axios";
import { useCallback } from "react";
import { useMessage } from "../useMessages";
import { userInfo } from "../../types/api/userInfo";
import { useUserInfo } from "../useUserInfo"
import { useHistory } from "react-router";
import { BaseUrl } from "../useBaseUrl";

export const useGetUserInfo = () => {
  const history = useHistory();
  const { setUserid } = useUserInfo();
  const { showMessage } = useMessage();
  const getUserInfo = useCallback((params) => {
    axios
      .post<userInfo>(`${BaseUrl}/api/get/token/`, params)
      .then((res) => {
        axios.defaults.headers!.Authorization = `JWT ${res.data.token_api}`
        setUserid(res.data.userid)
      })
      .catch((error) => {
        console.log(error)
        showMessage({ title: "ユーザ情報の取得に失敗しました！", status: "error" });
        history.push({pathname: "/schedule/error", state: String(error)})
      })
  }, []);
  return { getUserInfo };
};
