import { IRefresh } from "@/models/ILoginForm";
import axios from "axios";

export const refresh = async (data: IRefresh) => {
  try {
    return await axios.post(
      "/api/v1/token/refresh/",
      {
        refresh: data.refresh,
      },
      {
        baseURL: process.env.REACT_APP_API_URL,
      }
    );
  } catch (e: any) {
    return e;
  }
};
