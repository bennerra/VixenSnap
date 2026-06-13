import { FC, useContext, useEffect, useState } from "react";
import classNames from "classnames/bind";

import { ThemeContext } from "@/context";
import { Button } from "@/ui/Button";
import { useResize } from "@/hooks/useResize";

import { useNavigate, useParams } from "react-router-dom";
import { IUser } from "@/models/IUser";
import { NotificationContext } from "@/context/NotificationContext";
import { ProfileTabNames, profileTabs } from "@/modules/ProfileInfo/constants";
import { CardsInfiniteScroll } from "@/modules/CardsInfiniteScroll";
import {
  useLazyGetUserCardsQuery,
  useLazyGetUserSavedCardsQuery,
} from "@/store/api/CardsApi";
import { IGetCards } from "@/models/IGetCards";
import { AppRoutes } from "@/constants/paths";
import {
  useFollowMutation,
  useGetUserMeQuery,
  useUnfollowMutation,
} from "@/store/api/UsersApi";
import { PremiumButton } from "@/ui/PremiumButton/PremiumButton";
import { GetPremiumModal } from "@/modules/GetPremiumModal/GetPremiumModal";
import Loader from "../../ui/Loader/Loader";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

interface ProfileInfoProps {
  user: IUser;
}

const ProfileInfo: FC<ProfileInfoProps> = ({ user }) => {
  const { showNotification } = useContext(NotificationContext);
  const { theme } = useContext(ThemeContext);
  const {
    avatar,
    name,
    username,
    followers_count,
    following_count,
    is_following,
    is_premium,
  } = user;
  const { width } = useResize();
  const { id } = useParams();
  const [tab, setTab] = useState(ProfileTabNames.MY_TABS);
  const [page, setPage] = useState<number>(1);
  const [pageSavedCards, setPageSavedCards] = useState<number>(1);
  const [getCards, { isLoading: isLoadingCards }] = useLazyGetUserCardsQuery(
    {}
  );
  const [getSavedCards, { isLoading: isLoadingSavedCards }] =
    useLazyGetUserSavedCardsQuery({});
  const [follow] = useFollowMutation();
  const [unfollow] = useUnfollowMutation();
  const { data } = useGetUserMeQuery({});
  const [cards, setCards] = useState<IGetCards[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [savedCards, setSavedCards] = useState<IGetCards[]>([]);
  const [savedTotalCount, setSavedTotalCount] = useState<number>(0);
  const [isOpenPremiumModal, setIsOpenPremiumModal] = useState(false);
  const navigate = useNavigate();
  const isCurrentUser = id === data?.username;

  const handleOpenPremiumModal = () => {
    setIsOpenPremiumModal((prev) => !prev);
  };

  const navigateToProfileEdit = () => {
    navigate(AppRoutes.PROFILE_EDIT);
  };

  const fetchCards = async () => {
    try {
      const payload = {
        page,
        id: username,
      };
      const response = await getCards(payload).unwrap();
      setCards([...response.results]);
      setTotalCount(response.count);
    } catch (e) {
      showNotification("Не удалось получить список постов", "error");
    }
  };

  const fetchSavedCards = async () => {
    try {
      const payload = {
        page: pageSavedCards,
        id: username,
      };
      const response = await getSavedCards(payload).unwrap();
      setSavedCards([...response.results]);
      setSavedTotalCount(response.count);
    } catch (e) {
      showNotification(
        "Не удалось получить список сохраненных постов",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchCards();
    fetchSavedCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const onFetchMore = async () => {
    if (cards.length === totalCount) return;

    const payload = {
      page,
      id: username,
    };
    const nextPage = page + 1;
    const response = await getSavedCards(payload).unwrap();
    setCards((prev) => [...prev, ...response.results]);
    setPage(nextPage);
  };

  const onFetchMoreSavedCards = async () => {
    if (savedCards.length === savedTotalCount) return;

    const payload = {
      page: pageSavedCards,
      id: username,
    };
    const nextPage = pageSavedCards + 1;
    const response = await getSavedCards(payload).unwrap();
    setSavedCards((prev) => [...prev, ...response.results]);
    setPageSavedCards(nextPage);
  };

  const onFollow = async () => {
    try {
      if (isCurrentUser) return;

      await follow({ user_identifier: id || "" }).unwrap();
      showNotification("Вы подписались на пользователя", "success");
    } catch (e: any) {
      if (e?.status) {
        showNotification("Необходима авторизация", "error");
      } else {
        showNotification("Не удалось подписаться на пользователя", "error");
      }
    }
  };

  const onUnfollow = async () => {
    try {
      if (isCurrentUser) return;

      await unfollow({ user_identifier: id || "" }).unwrap();
      showNotification("Вы отписались от пользователя", "success");
    } catch (e: any) {
      if (e?.status) {
        showNotification("Необходима авторизация", "error");
      } else {
        showNotification("Не удалось отписаться от пользователя", "error");
      }
    }
  };

  const tabsContent = {
    [ProfileTabNames.MY_TABS]: (
      <div>
        {isLoadingCards ? (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        ) : (
          <div>
            {cards.length ? (
              <CardsInfiniteScroll
                cards={cards}
                totalCount={totalCount}
                fetchMore={onFetchMore}
              />
            ) : (
              <div className={styles.loaderContainer}>Посты не найдены</div>
            )}
          </div>
        )}
      </div>
    ),
    [ProfileTabNames.SAVED]: (
      <div>
        {isLoadingSavedCards ? (
          <div className={styles.loaderContainer}>
            <Loader />
          </div>
        ) : (
          <div>
            {savedCards.length ? (
              <CardsInfiniteScroll
                cards={savedCards}
                totalCount={savedTotalCount}
                fetchMore={onFetchMoreSavedCards}
                fetchSavedCards={fetchSavedCards}
              />
            ) : (
              <div className={styles.loaderContainer}>Посты не найдены</div>
            )}
          </div>
        )}
      </div>
    ),
  };

  const onShareLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    showNotification("Профиль скопирован в буфер обмена", "info");
  };

  return (
    <div className={cx("profile-info", `profile-info-${theme}`)}>
      <div className={cx("profile-info__img", { premium: is_premium })}>
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
          {followers_count} подписчиков
        </div>
        <div className={cx("info-description__subscription")}>
          {following_count} подписок
        </div>
      </div>
      <div className={cx("profile-info__buttons")}>
        {isCurrentUser && (
          <Button
            text="Изменить профиль"
            color="white"
            theme={theme}
            size={width < 992 ? "small" : "medium"}
            onClick={navigateToProfileEdit}
          />
        )}
        {!isCurrentUser && (
          <Button
            text={is_following ? "Отписаться" : "Подписаться"}
            color="white"
            theme={theme}
            size={width < 992 ? "small" : "medium"}
            onClick={is_following ? onUnfollow : onFollow}
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
      {!is_premium && isCurrentUser && (
        <>
          <div className={styles.premiumButton}>
            <PremiumButton
              onClick={handleOpenPremiumModal}
              size={width < 992 ? "small" : "medium"}
            >
              Премиум подписка
            </PremiumButton>
          </div>
          <GetPremiumModal
            isOpen={isOpenPremiumModal}
            onClose={handleOpenPremiumModal}
            theme={theme}
          />
        </>
      )}
    </div>
  );
};

export default ProfileInfo;
