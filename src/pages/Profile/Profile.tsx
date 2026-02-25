import { FC, useEffect } from "react";
import classNames from "classnames/bind";

import { Header } from "@/modules/Header";
import { ProfileInfo } from "@/modules/ProfileInfo";

import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setUserCardInfo } from "@/store/action-creators/user";
import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

const Profile: FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const userMe = useAppSelector((state) => state.user.userMeInfo);
  const publicUser = useAppSelector((state) => state.user.userCardInfo);
  const user = id ? publicUser : userMe;

  useEffect(() => {
    if (!id) {
      return;
    }

    dispatch(setUserCardInfo(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  return (
    <main className={cx("profile")}>
      <Header />
      <div className={cx("container")}>
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
