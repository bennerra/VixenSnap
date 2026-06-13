import { FC, useContext, useEffect } from "react";
import classNames from "classnames/bind";

import { ThemeContext } from "@/context";
import { useOAuthUserMutation } from "@/store/api/AuthApi";
import { LocalStorageNames } from "@/constants/localeStorage";
import { NotificationContext } from "@/context/NotificationContext";
import { cookies, CookiesNames } from "@/constants/cookies";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

const OAuth: FC = () => {
  const { theme } = useContext(ThemeContext);
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const [oAuthUser] = useOAuthUserMutation();
  const { showNotification } = useContext(NotificationContext);

  const loginUser = async (userCode: string, deviceId: string | null) => {
    try {
      const response = await oAuthUser({
        code: userCode,
        device_id: deviceId || undefined,
        state: state || undefined,
      }).unwrap();
      localStorage.setItem(LocalStorageNames.AUTH, response.access);
      cookies.set(CookiesNames.AUTH, response.refresh);
      // Редирект на главную после успешного входа
      window.location.href = "/";
    } catch (e: any) {
      showNotification(String(e?.data?.error), "error");
    }
  };

  useEffect(() => {
    const isValidState = state === process.env.REACT_APP_STATE;

    if (!isValidState) {
      showNotification("Ошибка в запросе: неверный state параметр", "error");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    if (!code) {
      showNotification("Ошибка: не получен код авторизации", "error");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }

    const deviceId = searchParams.get("device_id");
    loginUser(code, deviceId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cx("oauth")}>
      <h1 className={cx("oauth__title", `oauth__title-${theme}`)}>
        Получаем данные о пользователе...
      </h1>
    </div>
  );
};

export default OAuth;
