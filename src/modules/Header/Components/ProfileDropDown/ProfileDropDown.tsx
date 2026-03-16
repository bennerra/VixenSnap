import { FC, useContext } from "react";
import classNames from "classnames/bind";

import { ThemeContext } from "@/context";

import { ReactComponent as Profile } from "@/assets/profile.svg";
import { ReactComponent as Theme } from "@/assets/theme.svg";
import { ReactComponent as Exit } from "@/assets/exit.svg";
import { ProfileItem } from "@/modules/Header/Components/ProfileItem";
import { useLogoutMutation } from "@/store/api/AuthApi";
import { cookies, CookiesNames } from "@/constants/cookies";
import { LocalStorageNames } from "@/constants/localeStorage";
import { AppRoutes } from "@/constants/paths";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

const ProfileDropDown: FC = () => {
  const { toggleTheme, theme } = useContext(ThemeContext);
  const [logoutUser] = useLogoutMutation();

  const deleteHandler = async () => {
    try {
      const refreshToken = cookies.get(CookiesNames.AUTH);
      await logoutUser({ refresh_token: refreshToken }).unwrap();
      localStorage.removeItem(LocalStorageNames.AUTH);
      cookies.remove(CookiesNames.AUTH);
      window.location.href = AppRoutes.AUTH;
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={cx("profile-dropdown", `profile-dropdown-${theme}`)}>
      <ul className={cx("profile-dropdown__menu")}>
        <ProfileItem text="Личный кабинет" img={<Profile />} />
        <ProfileItem
          text={
            theme === "light"
              ? "Сменить на тёмную тему"
              : "Сменить на светлую тему"
          }
          img={<Theme />}
          onClick={toggleTheme}
        />
        <ProfileItem
          onClick={() => deleteHandler()}
          text="Выйти"
          img={<Exit />}
        />
      </ul>
    </div>
  );
};

export default ProfileDropDown;
