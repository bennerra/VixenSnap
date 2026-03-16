import { FC, useContext, useState } from "react";
import classNames from "classnames/bind";

import { ThemeContext } from "@/context";

import { ReactComponent as SearchButton } from "@/assets/search-button.svg";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

const HeaderSearch: FC = () => {
  const { theme } = useContext(ThemeContext);
  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <div className={cx("header__search", "header-search")}>
      <input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className={cx("header-search__input", `header-search__input-${theme}`)}
        placeholder="Поиск..."
      />
      <div className={cx("header-search__button")}>
        <SearchButton />
      </div>
    </div>
  );
};

export default HeaderSearch;
