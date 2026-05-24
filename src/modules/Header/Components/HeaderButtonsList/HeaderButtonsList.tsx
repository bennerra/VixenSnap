import { FC, useContext } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";

import { cookies, CookiesNames } from "@/constants/cookies";
import { ThemeContext } from "@/context";
import { useResize } from "@/hooks/useResize";
import { Button } from "@/ui/Button";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

const HeaderButtonsList: FC = () => {
  const isAuth = !!cookies.get(CookiesNames.AUTH);
  const { theme } = useContext(ThemeContext);
  const { width } = useResize();

  return isAuth ? (
    <Link to="/creation">
      <div className={cx("button")}>
        <Button
          text="Создать"
          color="orange"
          theme={theme}
          size={width < 992 ? "small" : "medium"}
        />
      </div>
    </Link>
  ) : (
    <Link to="/login">
      <div className={cx("button")}>
        <Button
          text="Войти"
          color="orange"
          theme={theme}
          size={width < 992 ? "small" : "medium"}
        />
      </div>
    </Link>
  );
};

export default HeaderButtonsList;
