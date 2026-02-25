import React, { FC, useContext } from "react";
import classNames from "classnames/bind";

import { ThemeContext } from "@/context";

import { ReactComponent as LogoDesktop } from "@/assets/logo-desktop-new.svg";
import { ReactComponent as Logo } from "@/assets/logo-new.svg";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

const HeaderLogo: FC = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={cx("header__logo", "header-logo", `header-logo-${theme}`)}>
      <div className={cx("header-logo__desktop")}>
        <LogoDesktop />
      </div>
      <div className={cx("header-logo__mobile")}>
        <Logo />
      </div>
    </div>
  );
};

export default HeaderLogo;
