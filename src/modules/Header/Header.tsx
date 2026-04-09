import React, {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from "react";
import classNames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";

import { ThemeContext } from "@/context";
import { ReactComponent as Burger } from "@/assets/burger.svg";
import { ModalMenuLayout } from "@/layouts/ModalMenuLayout";
import { ModalContent } from "@/modules/Header/Components/ModalContent";
import { LocalStorageNames } from "@/constants/localeStorage";
import { HeaderProfilePreview } from "@/modules/Header/Components/HeaderProfilePreview/HeaderProfilePreview";
import { IsAuthModalContent } from "@/modules/Header/Components/IsAuthModalContent";
import { ReactComponent as Notifications } from "@/assets/notifications.svg";
import { ReactComponent as SearchButton } from "@/assets/search-button.svg";
import { HeaderButtonsList } from "./Components/HeaderButtonsList";
import { HeaderLogo } from "./Components/HeaderLogo";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

type Props = {
  searchValue?: string;
  setSearchValue?: Dispatch<SetStateAction<string>>;
  isSearch?: boolean;
};

const Header: FC<Props> = (props) => {
  const { searchValue, setSearchValue, isSearch } = props;
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const isAuth = !!localStorage.getItem(LocalStorageNames.AUTH);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleOpenMenu = () => {
    setIsOpenMenu(true);
  };

  return (
    <div className={cx("header", `header-${theme}`)}>
      <div
        className={cx(
          "header__container",
          "container",
          `header__container-${theme}`
        )}
      >
        <div onClick={() => navigate(0)}>
          <Link to="/">
            <HeaderLogo />
          </Link>
        </div>
        {isSearch && (
          <div className={cx("header__search", "header-search")}>
            <input
              value={searchValue}
              onChange={(e) =>
                setSearchValue ? setSearchValue(e.target.value) : null
              }
              className={cx(
                "header-search__input",
                `header-search__input-${theme}`
              )}
              placeholder="Поиск..."
            />
            <div className={cx("header-search__button")}>
              <SearchButton />
            </div>
          </div>
        )}
        <div className={cx("header__right")}>
          <div className={cx("header__buttons")}>
            <HeaderButtonsList />
          </div>
          {isAuth ? (
            <div className={cx("header__information", "header-information")}>
              <div className={cx("header-information__notifications")}>
                <Notifications />
              </div>
              <div
                className={cx("header-information__burger", "header-burger")}
              >
                <div
                  onClick={handleOpenMenu}
                  className={cx("header-burger__open")}
                >
                  <Burger />
                </div>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className={cx("header-burger__menu", {
                    open: isOpenMenu,
                  })}
                >
                  <ModalMenuLayout
                    isOpenMenu={isOpenMenu}
                    setIsOpenMenu={setIsOpenMenu}
                  >
                    <IsAuthModalContent setIsOpenMenu={setIsOpenMenu} />
                  </ModalMenuLayout>
                </div>
              </div>
              <HeaderProfilePreview />
            </div>
          ) : (
            <div className={cx("header-information__burger", "header-burger")}>
              <div
                onClick={handleOpenMenu}
                className={cx("header-burger__open")}
              >
                <Burger />
              </div>
              <div
                onClick={(e) => e.stopPropagation()}
                className={cx("header-burger__menu", {
                  open: isOpenMenu,
                })}
              >
                <ModalMenuLayout
                  isOpenMenu={isOpenMenu}
                  setIsOpenMenu={setIsOpenMenu}
                >
                  <ModalContent setIsOpenMenu={setIsOpenMenu} />
                </ModalMenuLayout>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
