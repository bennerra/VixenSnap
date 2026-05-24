import { FC, ReactNode, useEffect } from "react";
import classNames from "classnames/bind";
import Button from "../Button/Button";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  theme: string;
  footerButtons?: {
    primary?: {
      text: string;
      onClick: () => void;
    };
    secondary?: {
      text: string;
      onClick: () => void;
    };
  };
  closeOnOverlayClick?: boolean;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  theme,
  footerButtons,
  closeOnOverlayClick = true,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={cx("modal-overlay", `modal-overlay--${theme}`)}
      onClick={handleOverlayClick}
    >
      <div
        className={cx("modal-content", `modal-content--${theme}`)}
        onClick={handleContentClick}
      >
        <div className={cx("modal-header", `modal-header--${theme}`)}>
          <h2 className={cx("modal-title", `modal-title--${theme}`)}>
            {title}
          </h2>
          <button
            type="button"
            className={cx("modal-close", `modal-close--${theme}`)}
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className={cx("modal-body", `modal-body--${theme}`)}>
          {children}
        </div>

        {footerButtons && (
          <div className={cx("modal-footer", `modal-footer--${theme}`)}>
            {footerButtons.secondary && (
              <Button
                text={footerButtons.secondary.text}
                theme={theme === "dark" ? "dark" : "light"}
                color="gray"
                size="medium"
                onClick={footerButtons.secondary.onClick}
              />
            )}
            {footerButtons.primary && (
              <Button
                text={footerButtons.primary.text}
                theme={theme === "dark" ? "dark" : "light"}
                color="orange"
                size="medium"
                onClick={footerButtons.primary.onClick}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
