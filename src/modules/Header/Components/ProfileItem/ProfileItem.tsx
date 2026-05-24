import { FC, ReactComponentElement, useContext } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";

import { ThemeContext } from "@/context";

import { useGetUserMeQuery } from "@/store/api/UsersApi";
import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

interface ProfileItemProps {
  img?: ReactComponentElement<any>;
  text: string;
  onClick?: () => void;
}

const ProfileItem: FC<ProfileItemProps> = ({ img, text, onClick }) => {
  const { theme } = useContext(ThemeContext);
  const { data } = useGetUserMeQuery({});

  return (
    <li onClick={onClick}>
      {text === "Личный кабинет" ? (
        <Link to={`/profile/${data?.username || ""}`}>
          <span className={cx("profile-item", `profile-item-${theme}`)}>
            {img}
            {text}
          </span>
        </Link>
      ) : (
        <span className={cx("profile-item", `profile-item-${theme}`)}>
          {img}
          {text}
        </span>
      )}
    </li>
  );
};

export default ProfileItem;
