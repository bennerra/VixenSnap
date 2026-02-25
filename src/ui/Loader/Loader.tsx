import { FC } from "react";

import loaderGif from "@/assets/loader.gif";

import styles from "./styles.module.scss";

const Loader: FC = () => (
  <div className={styles.loader}>
    <img className={styles.loaderMedia} src={loaderGif} alt="Загрузка..." />
  </div>
);

export default Loader;
