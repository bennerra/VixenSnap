import { FC, PropsWithChildren, useContext } from "react";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

import { ThemeContext } from "@/context";

import { ReactComponent as VK } from "@/assets/vk.svg";
import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

interface AuthorizationProps {
  title: string;
  text: string;
  link: "Зарегистрироваться" | "Войти";
}

const oauthUrl = process.env.REACT_APP_OAUTH_URL;
const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;

const Authorization: FC<PropsWithChildren<AuthorizationProps>> = ({
  title,
  link,
  text,
  children,
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={cx("authorization", `authorization-${theme}`)}>
      <h1
        className={cx("authorization__title", `authorization__title-${theme}`)}
      >
        {title}
      </h1>
      <a
        href={`${oauthUrl}?client_id=${clientId}&scope=email&response_type=code&redirect_uri=${redirectUri}`}
      >
        <div
          className={cx(
            "authorization__vk",
            "authorization-vk",
            `authorization-vk-${theme}`
          )}
        >
          <div className={cx("authorization-vk__text")}>Войти с помощью</div>
          <div className={cx("authorization-vk__img")}>
            <VK />
          </div>
        </div>
      </a>
      <div className={cx("authorization__fields")}>{children}</div>
      <div
        className={cx("authorization__link", "form-link", `form-link-${theme}`)}
      >
        <div className={cx("form-link__title")}>{text}</div>
        <Link to={link === "Зарегистрироваться" ? "/registration" : "/login"}>
          <div className={cx("form-link__text", `form-link__text-${theme}`)}>
            {link}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Authorization;
