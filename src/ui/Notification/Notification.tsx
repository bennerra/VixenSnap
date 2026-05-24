import { createPortal } from "react-dom";
import { FC, useContext, useEffect } from "react";
import { ReactComponent as CloseIcon } from "@/assets/close.svg";
import { ThemeContext } from "@/context";
import classNames from "classnames/bind";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

export type NotificationType = "success" | "info" | "error";

type Props = {
  text: string;
  type: NotificationType;
  onClose: () => void;
  duration?: number;
};

export const Notification: FC<Props> = (props) => {
  const { text, type, onClose, duration = 5000 } = props;
  const { theme } = useContext(ThemeContext);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return createPortal(
    <div className={cx("notification", theme, type)}>
      <div className={styles.notification_container}>
        <div className={styles.close} onClick={onClose}>
          <CloseIcon />
        </div>
        <div className={styles.notification__content}>
          <span className={styles.notification__text}>{text}</span>
        </div>
      </div>
    </div>,
    document.body
  );
};
