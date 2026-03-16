import { FC, useCallback, useContext, useEffect } from "react";
import classNames from "classnames/bind";
import { Navigate } from "react-router-dom";

import { useAppDispatch } from "@/hooks/redux";
import { getUserData } from "@/utils/getUserData";
import { ThemeContext } from "@/context";
import { IOAuthUser } from "@/models/IOAuthUser";
import { LocalStorageNames } from "@/constants/localeStorage";
import { useOAuthUserMutation } from "@/store/api/AuthApi";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

const OAuth: FC = () => {
  const dispatch = useAppDispatch();
  const { theme } = useContext(ThemeContext);
  const isAuth = !!localStorage.getItem(LocalStorageNames.AUTH);
  const [oAuthUser] = useOAuthUserMutation();

  const url = window.location.hash;
  const userData = getUserData(url);

  const setIsAuth = useCallback(
    async (user: IOAuthUser) => {
      await oAuthUser(user).unwrap();
    },
    [oAuthUser]
  );

  useEffect(() => {
    setIsAuth(userData);
  }, [dispatch, isAuth, setIsAuth, url, userData]);

  return (
    <div className={cx("oauth")}>
      <h1 className={cx("oauth__title", `oauth__title-${theme}`)}>
        Получаем данные о пользователе...
      </h1>
      {isAuth ? <Navigate to="/" /> : <Navigate to="/login" />}
    </div>
  );
};

export default OAuth;
