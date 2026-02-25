import { FC, useContext, useEffect, useState } from "react";
import classNames from "classnames/bind";

import { ThemeContext } from "@/context";
import { Button } from "@/ui/Button";
import { useResize } from "@/hooks/useResize";

import { useParams } from "react-router-dom";
import { IUser } from "@/models/IUser";
import { NotificationContext } from "@/context/NotificationContext";
import { ProfileTabNames, profileTabs } from "@/modules/ProfileInfo/constants";
import { CardsInfiniteScroll } from "@/modules/CardsInfiniteScroll";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getMyCards } from "@/store/action-creators/getCards";
import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

interface ProfileInfoProps {
  subscribers?: string;
  subscription?: string;
  user: IUser;
}

const ProfileInfo: FC<ProfileInfoProps> = ({
  subscribers = "0",
  subscription = "0",
  user,
}) => {
  const dispatch = useAppDispatch();
  const { showNotification } = useContext(NotificationContext);
  const { theme } = useContext(ThemeContext);
  const { avatar, name, username } = user;
  const { width } = useResize();
  const { id } = useParams();
  const [tab, setTab] = useState(ProfileTabNames.MY_TABS);
  const [page, setPage] = useState<number>(1);
  const { cards, totalCount } = useAppSelector((state) => state.myCards);

  useEffect(() => {
    dispatch(getMyCards(page));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFetchMore = () => {
    const nextPage = page + 1;
    getMyCards(nextPage);
    setPage(nextPage);
  };

  const tabsContent = {
    [ProfileTabNames.MY_TABS]: (
      <CardsInfiniteScroll
        cards={cards}
        totalCount={totalCount}
        fetchMore={onFetchMore}
      />
    ),
    [ProfileTabNames.SAVED]: <div>Сохраненные карточки</div>,
  };

  const onShareLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    showNotification("Профиль скопирован в буфер обмена");
  };

  return (
    <div className={cx("profile-info", `profile-info-${theme}`)}>
      <div className={cx("profile-info__img")}>
        {avatar ? <img src={avatar} alt="" /> : Array.from(name)[0]}
      </div>
      <div className={cx("profile-info__name")}>{name}</div>
      <div className={cx("profile-info__username")}>{username}</div>
      <div
        className={cx(
          "profile-info__description",
          `profile-info__description-${theme}`,
          "info-description"
        )}
      >
        <div className={cx("info-description__subscribers")}>
          {subscribers} подписчиков
        </div>
        <div className={cx("info-description__subscription")}>
          {subscription} подписок
        </div>
      </div>
      <div className={cx("profile-info__buttons")}>
        {!id && (
          <Button
            text="Изменить профиль"
            color="white"
            theme={theme}
            size={width < 992 ? "small" : "medium"}
          />
        )}
        <Button
          text="Поделиться"
          color="white"
          theme={theme}
          size={width < 992 ? "small" : "medium"}
          onClick={onShareLink}
        />
      </div>
      <div className={styles.tabs}>
        <div className={cx("tabsVariants", `tabsVariants-${theme}`)}>
          {Object.keys(profileTabs).map((item) => (
            <div
              key={item}
              className={cx("profileTab", { isActive: tab === item })}
              onClick={() => setTab(item as ProfileTabNames)}
            >
              {profileTabs[item as ProfileTabNames]}
            </div>
          ))}
        </div>
        <div className={styles.tabsContent}>{tabsContent[tab]}</div>
      </div>
    </div>
  );
};

export default ProfileInfo;
