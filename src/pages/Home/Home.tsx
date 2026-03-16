import { FC, useCallback, useEffect, useState } from "react";
import classNames from "classnames/bind";

import { Loader } from "@/ui/Loader";
import { Header } from "@/modules/Header";
import { CardsInfiniteScroll } from "@/modules/CardsInfiniteScroll";
import { useLazyGetCardsQuery } from "@/store/api/CardsApi";
import { IGetCards } from "@/models/IGetCards";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

const Home: FC = () => {
  const [page, setPage] = useState<number>(1);
  const [getCards, { isLoading }] = useLazyGetCardsQuery();
  const [cards, setCards] = useState<IGetCards[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await getCards({ page }).unwrap();
        setCards([...response.results]);
        setTotalCount(response.count);
      } catch (e) {
        console.log(e);
      }
    };

    fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMoreCards = useCallback(async () => {
    if (cards.length === totalCount) return;

    const nextPage = page + 1;
    const response = await getCards({ page: nextPage }).unwrap();
    setCards((prev) => [...prev, ...response.results]);
    setPage(nextPage);
  }, [cards.length, totalCount, page, getCards]);

  const content =
    cards.length === 0 ? (
      <div className={styles.errorContainer}>
        <div className={cx("home__not-found")}>Карточки не найдены!</div>
      </div>
    ) : (
      <div className={cx("container", "home-container")}>
        <div className={cx("home__cards-list")}>
          <CardsInfiniteScroll
            cards={cards}
            fetchMore={fetchMoreCards}
            totalCount={totalCount}
          />
        </div>
      </div>
    );

  return (
    <main className={cx("home")}>
      <Header />
      {isLoading ? <Loader /> : content}
    </main>
  );
};

export default Home;
