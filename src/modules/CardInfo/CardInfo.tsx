import { FC, useContext, useMemo, useState } from "react";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

import { ThemeContext } from "@/context";
import { Button } from "@/ui/Button";
import { ReactComponent as Like } from "@/assets/likes-filled.svg";
import { ReactComponent as EmptyLike } from "@/assets/empty-like.svg";
import { useGetUserQuery } from "@/store/api/UsersApi";
import {
  useSaveCardMutation,
  useSetLikeToCardMutation,
} from "@/store/api/CardsApi";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

interface CardInfoProps {
  img: string;
  title: string;
  description: string;
  likes: number;
  is_liked: boolean;
  id: string;
  author_id: string;
  author_name: string;
  isSave: boolean;
}

const CardInfo: FC<CardInfoProps> = ({
  img,
  description,
  title,
  likes,
  is_liked,
  id,
  author_name,
  author_id,
  isSave,
}) => {
  const { theme } = useContext(ThemeContext);
  const { data: user } = useGetUserQuery({ id: author_id });
  const [setLike] = useSetLikeToCardMutation();
  const [saveCard] = useSaveCardMutation();
  const [hasSave, setHasSave] = useState<boolean>(isSave);
  const [hasLike, setHasLike] = useState<boolean>(is_liked);
  const [quantityLikes, setQuantityLikes] = useState<number>(likes);

  const linkToUserPage = useMemo(() => {
    const isUsersCard = user?.userMeInfo?.id === author_id;
    return isUsersCard ? "/profile/me" : `/profile/${author_id}`;
  }, [author_id, user]);

  const handleIsLiked = async () => {
    try {
      const response = await setLike({ id }).unwrap();
      setHasLike(response.is_liked);
      setQuantityLikes(response.count);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSave = async () => {
    try {
      const response = await saveCard({ id }).unwrap();
      setHasSave(response.is_saved);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={cx("card-info", `card-info-${theme}`)}>
      <div
        className={cx("card-info__container", `card-info__container-${theme}`)}
      >
        <div className={cx("card-info__photo")}>
          <img src={img} alt="" />
        </div>
        <div
          className={cx(
            "card-info__content",
            "card-content",
            `card-info__content-${theme}`
          )}
        >
          <div
            className={cx(
              "card-content__about",
              "card-about",
              `card-about-${theme}`
            )}
          >
            <Link to={linkToUserPage}>
              <div className={cx("card_author")}>{author_name}</div>
            </Link>
            <h2 className={cx("card-about__title")}>{title}</h2>
            <p className={cx("card-about__description")}>{description}</p>
          </div>
          <div className={cx("card-content__save", "card-save")}>
            <div className={cx("card-save__button")}>
              <Button
                theme={theme}
                text={hasSave ? "Сохранить" : "Сохранено"}
                color={hasSave ? "orange" : "gray"}
                size="medium"
                onClick={handleSave}
              />
            </div>
            <div className={cx("card-save__likes", "card-likes")}>
              <div onClick={handleIsLiked} className={cx("card-likes__img")}>
                {hasLike ? <Like /> : <EmptyLike />}
              </div>
              {quantityLikes}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
