import { skipToken } from "@reduxjs/toolkit/query";
import { FC } from "react";
import classNames from "classnames/bind";
import { useParams } from "react-router-dom";

import { CardInfo } from "@/modules/CardInfo";
import { Header } from "@/modules/Header";
import { CardSkeleton } from "@/modules/CardSkeleton";
import { useGetCardQuery } from "@/store/api/CardsApi";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

const Card: FC = () => {
  const { id } = useParams();
  const { data: card, isLoading } = useGetCardQuery(id ? { id } : skipToken);

  return (
    <div className={cx("card")}>
      <Header />
      <div className={cx("container", "card-container")}>
        <div className={cx("card__content")}>
          {isLoading || !card?.id ? (
            <CardSkeleton />
          ) : (
            <CardInfo
              img={card.short_url}
              title={card.name}
              description={card.description}
              likes={card.likes_count}
              is_liked={card.is_liked}
              id={card.id}
              author_name={card.author_name}
              isSave={card.is_save}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
