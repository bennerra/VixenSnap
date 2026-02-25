import React, { FC, useContext, useState } from "react";
import classNames from "classnames/bind";

import { ProfileDropDown } from "@/modules/Header/Components/ProfileDropDown";
import { OutsideClickHandler } from "@/modules/OutsideClickHandler";
import { ProfileImage } from "@/ui/ProfileImage";
import { useAppSelector } from "@/hooks/redux";
import { ThemeContext } from "@/context";

import styles from "@/modules/Header/styles.module.scss";

const cx = classNames.bind(styles);

export const HeaderProfilePreview: FC = () => {
  const { avatar, name } = useAppSelector((state) => state.user.userMeInfo);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const { theme } = useContext(ThemeContext);

  const toggleIsOpenProfile = () => {
    setIsOpenProfile(!isOpenProfile);
  };

  const closeIsOpenProfile = () => {
    setIsOpenProfile(false);
  };

  return (
    <OutsideClickHandler onOutsideClick={closeIsOpenProfile}>
      <div
        onClick={toggleIsOpenProfile}
        className={cx("header-information__profile", "header-profile")}
      >
        <ProfileImage theme={theme} name={name} img={avatar} />
        <div
          className={cx("header-profile__dropdown", {
            open: isOpenProfile,
          })}
        >
          <ProfileDropDown />
        </div>
      </div>
    </OutsideClickHandler>
  );
};
