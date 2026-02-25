import { FC, useEffect } from "react";
import classNames from "classnames/bind";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setUserMeInfo } from "@/store/action-creators/user";

import { Loader } from "@/ui/Loader";
import { Header } from "@/modules/Header";
import { CardsInfiniteScroll } from "@/modules/CardsInfiniteScroll";
import { setCards } from "@/store/action-creators/getCards";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

const Home: FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.cards.isLoading);
  const { cards, page, totalCount } = useAppSelector((state) => state.cards);
  // const searchValue = useAppSelector((state) => state.searchValue.searchValue);

  useEffect(() => {
    dispatch(setCards(page) as any);
  }, [dispatch, page]);

  const fetchMoreCards = () => {
    dispatch(setCards(page) as any);
  };

  useEffect(() => {
    dispatch(setUserMeInfo() as any);
  }, [dispatch]);

  return (
    <main className={cx("home")}>
      <Header />
      <div className={cx("container", "home-container")}>
        {isLoading ? (
          <Loader />
        ) : (
          <div className={cx("home__cards-list")}>
            <CardsInfiniteScroll
              cards={cards}
              fetchMore={fetchMoreCards}
              totalCount={totalCount}
            />
          </div>
        )}
        {cards.length === 0 && !isLoading && (
          <div className={styles.errorContainer}>
            <div className={cx("home__not-found")}>Карточки не найдены!</div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
