import { FC, useContext, useMemo, useState } from "react";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";

import { ThemeContext } from "@/context";
import { Button } from "@/ui/Button";
import { ReactComponent as Like } from "@/assets/likes-filled.svg";
import { ReactComponent as EmptyLike } from "@/assets/empty-like.svg";
import {
  useAddCommentMutation,
  useGetCommentsQuery,
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
  isSave,
}) => {
  const { theme } = useContext(ThemeContext);
  const [setLike] = useSetLikeToCardMutation();
  const [addComment] = useAddCommentMutation();
  const [saveCard] = useSaveCardMutation();
  const [hasSave, setHasSave] = useState<boolean>(isSave);
  const [hasLike, setHasLike] = useState<boolean>(is_liked);
  const [quantityLikes, setQuantityLikes] = useState<number>(likes);
  const [commentText, setCommentText] = useState<string>("");
  const { data } = useGetCommentsQuery({ id });

  const linkToUserPage = useMemo(() => {
    return `/profile/${author_name}`;
  }, [author_name]);

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

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await addComment({
        post: id,
        text: commentText,
      });
      setCommentText("");
    } catch (e) {
      console.log(e);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const commentDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const diffTime = today.getTime() - commentDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 0) return "сегодня";
    if (diffDays === 1) return "вчера";
    if (diffDays < 7) return `${diffDays} дня(ей) назад`;
    return date.toLocaleDateString("ru-RU");
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
          <div className={cx("comments-section", `comments-section-${theme}`)}>
            <h3 className={cx("comments-section__title")}>
              Комментарии ({data?.count || 0})
            </h3>
            <div className={cx("comment-form", `comment-form-${theme}`)}>
              <textarea
                className={cx(
                  "comment-form__input",
                  `comment-form__input-${theme}`
                )}
                placeholder="Напишите комментарий..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
              />
              <Button
                theme={theme}
                text="Отправить"
                color="orange"
                size="medium"
                onClick={handleAddComment}
                disabled={!commentText.trim()}
              />
            </div>
            <div className={cx("comments-list", `comments-list-${theme}`)}>
              {!data?.count ? (
                <div
                  className={cx(
                    "comments-list__empty",
                    `comments-list__empty-${theme}`
                  )}
                >
                  Пока нет комментариев. Будьте первым!
                </div>
              ) : (
                data.results.map((comment) => (
                  <div
                    key={comment.id}
                    className={cx("comment-item", `comment-item-${theme}`)}
                  >
                    <div className={cx("comment-item__header")}>
                      <Link to={`/profile/${comment.author_id}`}>
                        <span
                          className={cx(
                            "comment-item__author",
                            `comment-item__author-${theme}`
                          )}
                        >
                          {comment.author_name}
                        </span>
                      </Link>
                      <span
                        className={cx(
                          "comment-item__date",
                          `comment-item__date-${theme}`
                        )}
                      >
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p
                      className={cx(
                        "comment-item__text",
                        `comment-item__text-${theme}`
                      )}
                    >
                      {comment.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
