import { FC } from "react";
import classNames from "classnames/bind";

import { Header } from "@/modules/Header";
import { ProfileInfo } from "@/modules/ProfileInfo";

import { useParams } from "react-router-dom";
import { useGetUserMeQuery, useGetUserQuery } from "@/store/api/UsersApi";
import { skipToken } from "@reduxjs/toolkit/query";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

const Profile: FC = () => {
  const { id } = useParams();
  const { data: userMeInfo } = useGetUserMeQuery({});
  const { data: userPublicInfo } = useGetUserQuery(id ? { id } : skipToken);
  const user = id ? userPublicInfo : userMeInfo;

  return (
    <main className={cx("profile")}>
      <Header />
      <div className={cx("container", "profile-container")}>
        {user ? (
          <ProfileInfo user={user} />
        ) : (
          <div className={cx("profile_not_found")}>Профиль не найден!</div>
        )}
      </div>
    </main>
  );
};

export default Profile;
