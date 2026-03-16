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
import {
  useLazyGetMyCardsQuery,
  useLazyGetUserCardsQuery,
} from "@/store/api/CardsApi";
import { IGetCards } from "@/models/IGetCards";
import styles from "./styles.module.scss";
import Loader from "../../ui/Loader/Loader";

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
  const { showNotification } = useContext(NotificationContext);
  const { theme } = useContext(ThemeContext);
  const { avatar, name, username } = user;
  const { width } = useResize();
  const { id } = useParams();
  const [tab, setTab] = useState(ProfileTabNames.MY_TABS);
  const [page, setPage] = useState<number>(1);
  const [getMyCards, { isLoading: isLoadingMyCards }] = useLazyGetMyCardsQuery(
    {}
  );
  const [getCards, { isLoading: isLoadingCards }] = useLazyGetUserCardsQuery(
    {}
  );
  const [cards, setCards] = useState<IGetCards[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const methodGetCards = id ? getCards : getMyCards;
  const isLoading = id ? isLoadingCards : isLoadingMyCards;

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const payload = {
          page,
          id: id || "",
        };
        const response = await methodGetCards(payload).unwrap();
        setCards([...response.results]);
        setTotalCount(response.count);
      } catch (e) {
        console.log(e);
      }
    };

    fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onFetchMore = async () => {
    if (cards.length === totalCount) return;

    const payload = {
      page,
      id: id || "",
    };
    const nextPage = page + 1;
    const response = await methodGetCards(payload).unwrap();
    setCards((prev) => [...prev, ...response.results]);
    setPage(nextPage);
  };

  const tabsContent = {
    [ProfileTabNames.MY_TABS]: (
      <div>
        {isLoading ? (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        ) : (
          <CardsInfiniteScroll
            cards={cards}
            totalCount={totalCount}
            fetchMore={onFetchMore}
          />
        )}
      </div>
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
