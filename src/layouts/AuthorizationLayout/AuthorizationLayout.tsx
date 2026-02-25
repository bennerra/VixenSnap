import { FC, ReactNode, useContext } from "react";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

import { ThemeContext } from "@/context";

import { ReactComponent as Logo } from "@/assets/logo-desktop.svg";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

interface AuthorizationLayoutProps {
  children: ReactNode;
}

const AuthorizationLayout: FC<AuthorizationLayoutProps> = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <main
      className={cx("authorization-layout", `authorization-layout-${theme}`)}
    >
      <div className={cx("authorization-layout__container")}>
        <div
          className={cx(
            "authorization-layout__top",
            "authorization-layout-top",
            `authorization-layout__top-${theme}`
          )}
        >
          <Link to="/">
            <div className={cx("authorization-layout-top__logo")}>
              <Logo />
            </div>
          </Link>
          <div
            className={cx(
              "authorization-layout-top__bg",
              `authorization-layout-top__bg-${theme}`
            )}
          />
        </div>
        {children}
      </div>
    </main>
  );
};

export default AuthorizationLayout;
