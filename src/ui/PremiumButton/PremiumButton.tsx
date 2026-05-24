import React, { FC, PropsWithChildren } from "react";
import classNames from "classnames/bind";
import styles from "./styles.module.scss";

interface PremiumButtonProps {
  onClick: () => void;
  size?: "small" | "medium";
  className?: string;
}

export const PremiumButton: FC<PropsWithChildren<PremiumButtonProps>> = ({
  onClick,
  size = "medium",
  className = "",
  children = "Премиум подписка",
}) => {
  const cx = classNames.bind(styles);

  return (
    <button
      type="button"
      className={cx("premium-button", `premium-button--${size}`, className)}
      onClick={onClick}
    >
      <span className={cx("premium-button__icon")}>💎</span>
      <span className={cx("premium-button__text")}>{children}</span>
      <span className={cx("premium-button__highlight")} />
    </button>
  );
};
