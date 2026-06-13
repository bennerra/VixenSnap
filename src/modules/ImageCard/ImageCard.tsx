import { FC, useState, MouseEvent, useContext } from "react";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

import { ReactComponent as Like } from "@/assets/likes-filled.svg";
import { ReactComponent as EmptyLike } from "@/assets/empty-like.svg";
import { ReactComponent as Favourites } from "@/assets/favourites.svg";
import { ReactComponent as FavouritesFilled } from "@/assets/filled-save.svg";
import {
  useSaveCardMutation,
  useSetLikeToCardMutation,
} from "@/store/api/CardsApi";

import { NotificationContext } from "@/context/NotificationContext";
import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

interface ImageCardProps {
  img: string;
  title: string;
  likes: number;
  id: string;
  isLiked: boolean;
  isSave: boolean;
  fetchSavedCards?: () => void;
}

const ImageCard: FC<ImageCardProps> = (props) => {
  const { img, title, likes, id, isLiked, isSave, fetchSavedCards } = props;
  const [setLike] = useSetLikeToCardMutation();
  const [hasLike, setHasLike] = useState<boolean>(isLiked);
  const [quantityLikes, setQuantityLikes] = useState<number>(likes);
  const [saveCard] = useSaveCardMutation();
  const [hasSave, setHasSave] = useState<boolean>(isSave);
  const { showNotification } = useContext(NotificationContext);

  const handleSetLike = async () => {
    try {
      const response = await setLike({ id }).unwrap();
      setHasLike(response.is_liked);
      setQuantityLikes(response.count);
      if (response.is_liked) {
        showNotification("Вы поставили лайк на пост", "success");
      } else {
        showNotification("Вы убрали лайк с поста", "success");
      }
    } catch (e: any) {
      if (e?.status === 401) {
        showNotification("Необходима авторизация", "error");
      } else {
        showNotification("Не удалось поставить лайк", "error");
      }
    }
  };

  const handleSave = async (event: MouseEvent<HTMLDivElement>) => {
    try {
      event.preventDefault();
      const response = await saveCard({ id }).unwrap();
      setHasSave(response.is_saved);
      if (response.is_saved) {
        showNotification("Пост сохранен в избранное", "success");
      } else {
        showNotification("Пост удален из избранного", "success");
      }
      if (fetchSavedCards) fetchSavedCards();
    } catch (e: any) {
      if (e?.status === 401) {
        showNotification("Необходима авторизация", "error");
      } else {
        showNotification("Не удалось сохранить в избранное", "error");
      }
    }
  };

  return (
    <Link to={`/card/${id}`}>
      <div className={cx("card")}>
        <img alt="" src={img} className={cx("card__image")} />
        <div className={cx("card__bottom", "card-bottom")}>
          <div className={cx("card-bottom__description")}>
            <span className={cx("card-bottom__title")}>{title}</span>
            <div
              onClick={(e) => e.preventDefault()}
              className={cx("card-bottom__likes", "bottom-likes")}
            >
              <div
                onClick={handleSetLike}
                className={cx("bottom-likes__image")}
              >
                {hasLike ? <Like /> : <EmptyLike />}
              </div>
              {quantityLikes}
            </div>
          </div>
          <div
            onClick={(e) => handleSave(e)}
            className={cx("card-bottom__save", "card-save")}
          >
            Сохранить
            <div className={cx("card-save__favourites")}>
              {hasSave ? <FavouritesFilled /> : <Favourites />}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ImageCard;
