import { FC } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-responsive-masonry";

import { IGetCards } from "@/models/IGetCards";
import { setColumns } from "@/utils/setColumns";
import { ImageCard } from "@/modules/ImageCard";
import { useResize } from "@/hooks/useResize";

type Props = {
  cards: IGetCards[];
  fetchMore: () => void;
  totalCount: number;
};

const CardsInfiniteScroll: FC<Props> = (props) => {
  const { cards, fetchMore, totalCount } = props;
  const { width } = useResize();

  return (
    <InfiniteScroll
      next={fetchMore}
      hasMore={totalCount >= 25}
      loader={null}
      dataLength={cards.length}
    >
      <Masonry columnsCount={setColumns(width)} gutter="10px">
        {cards.map((card: IGetCards) => (
          <ImageCard
            key={card.id}
            img={card.short_url}
            title={card.name}
            likes={card.likes_count}
            id={card.id}
            isLiked={card.is_liked}
            isSave={card.is_saved}
          />
        ))}
      </Masonry>
    </InfiniteScroll>
  );
};

export default CardsInfiniteScroll;
