import axios from "axios";
import { useCallback } from "react";
import { useMessage } from "../useMessages";
import { useHistory } from "react-router";
import { BaseUrl } from "../useBaseUrl";

export const usePostContact = () => {
  const { showMessage } = useMessage();
  const history = useHistory();
  const postContact = useCallback((params) => {
    axios
      .post(`${BaseUrl}/api/contact/`, params)
      .then((res) => {
        console.log(res.data)
        showMessage({ title: "送信しました。", status: "info" });
        history.push("/thanks")
      })
      .catch((error) => {
        console.log(error)
        showMessage({ title: "お問い合わせの送信に失敗しました！", status: "error" });
        history.push({pathname: "/schedule/error", state: String(error)})
      })
  }, []);
  return { postContact };
};
