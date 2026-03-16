import { FC, useState } from "react";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

import { ReactComponent as Like } from "@/assets/likes-filled.svg";
import { ReactComponent as EmptyLike } from "@/assets/empty-like.svg";
import { ReactComponent as Favourites } from "@/assets/favourites.svg";
import { useSetLikeToCardMutation } from "@/store/api/CardsApi";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

interface ImageCardProps {
  img: string;
  title: string;
  likes: number;
  id: string;
  isLiked: boolean;
}

const ImageCard: FC<ImageCardProps> = (props) => {
  const { img, title, likes, id, isLiked } = props;
  const [setLike] = useSetLikeToCardMutation();
  const [hasLike, setHasLike] = useState<boolean>(isLiked);
  const [quantityLikes, setQuantityLikes] = useState<number>(likes);

  const handleSetLike = async () => {
    try {
      const response = await setLike({ id }).unwrap();
      setHasLike(response.is_liked);
      setQuantityLikes(response.count);
    } catch (e) {
      console.log(e);
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
          <div className={cx("card-bottom__save", "card-save")}>
            Сохранить
            <div className={cx("card-save__favourites")}>
              <Favourites />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ImageCard;
