import { FC, useContext } from "react";
import classNames from "classnames/bind";

import { ThemeContext } from "@/context";

import { CreationCardForm } from "@/modules/CreationCardForm";
import { Header } from "@/modules/Header";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

const CreationCard: FC = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <main className={cx("creation")}>
      <Header />
      <div className={cx("container")}>
        <div className={cx("creation__content", "creation-content")}>
          <h1
            className={cx(
              "creation-content__title",
              `creation-content__title-${theme}`
            )}
          >
            Создание новой карточки
          </h1>
          <CreationCardForm />
        </div>
      </div>
    </main>
  );
};

export default CreationCard;
