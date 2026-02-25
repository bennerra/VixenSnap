import { FC } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { v4 as uuid4 } from "uuid";
import Masonry from "react-responsive-masonry";

import { IGetCards } from "@/models/IGetCards";
import { setColumns } from "@/utils/setColumns";

import { ImageCard } from "@/modules/ImageCard";
import { Loader } from "@/ui/Loader";
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
      loader={<Loader />}
      dataLength={cards.length}
    >
      <Masonry columnsCount={setColumns(width)} gutter="10px">
        {cards.map((card: IGetCards) => (
          <ImageCard
            key={uuid4()}
            img={card.short_url}
            title={card.name}
            likes={card.likes}
            id={card.id}
            is_liked={card.is_liked}
          />
        ))}
      </Masonry>
    </InfiniteScroll>
  );
};

export default CardsInfiniteScroll;
