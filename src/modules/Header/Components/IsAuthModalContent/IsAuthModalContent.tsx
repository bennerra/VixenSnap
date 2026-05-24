import { Dispatch, FC, SetStateAction, useContext } from "react";
import classNames from "classnames/bind";
import { Link, useNavigate } from "react-router-dom";

import { ThemeContext } from "@/context";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

interface IsAuthModalProps {
  setIsOpenMenu: Dispatch<SetStateAction<boolean>>;
}

const IsAuthModalContent: FC<IsAuthModalProps> = ({ setIsOpenMenu }) => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleCloseMenu = () => {
    setIsOpenMenu(false);
  };

  return (
    <ul className={cx("menu-list", `menu-list-${theme}`)}>
      <div onClick={() => navigate(0)}>
        <Link to="/">
          <li onClick={handleCloseMenu} className={cx("menu-list__item")}>
            Главная
          </li>
        </Link>
      </div>
      <Link to="/creation">
        <li onClick={handleCloseMenu} className={cx("menu-list__item")}>
          Добавить
        </li>
      </Link>
    </ul>
  );
};

export default IsAuthModalContent;
