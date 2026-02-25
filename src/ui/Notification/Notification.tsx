import { createPortal } from "react-dom";
import { FC, useContext } from "react";
import { ReactComponent as CloseIcon } from "@/assets/close.svg";
import { ThemeContext } from "@/context";
import classNames from "classnames/bind";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

type Props = {
  text: string;
  onClose: () => void;
};

export const Notification: FC<Props> = (props) => {
  const { text, onClose } = props;
  const { theme } = useContext(ThemeContext);

  return createPortal(
    <div className={cx("notification", theme)}>
      <div className={styles.notification_container}>
        <div className={styles.close} onClick={onClose}>
          <CloseIcon />
        </div>
        {text}
      </div>
    </div>,
    document.body
  );
};
