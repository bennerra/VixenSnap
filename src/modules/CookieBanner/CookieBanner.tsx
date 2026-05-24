import { FC, useState, useEffect, useContext } from "react";
import classNames from "classnames/bind";

import { ThemeContext } from "@/context";
import { Button } from "@/ui/Button";
import styles from "./styles.module.scss";

const COOKIE_CONSENT_KEY = "cookie-consent";
const cx = classNames.bind(styles);

export const CookieBanner: FC = () => {
  const { theme } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={cx("cookie-banner", `cookie-banner--${theme}`)}>
      <div className={cx("cookie-banner__container")}>
        <div className={cx("cookie-banner__icon")}>🍪</div>
        <p className={cx("cookie-banner__text")}>
          Мы используем файлы cookie для улучшения работы сервиса. Продолжая
          использование сайта, вы соглашаетесь с их использованием.
        </p>
        <Button
          theme={theme}
          text="Понятно"
          color="orange"
          size="medium"
          onClick={handleAccept}
        />
        <button
          type="button"
          className={cx("cookie-banner__close")}
          onClick={handleAccept}
          aria-label="Закрыть баннер о cookie"
        >
          ×
        </button>
      </div>
    </div>
  );
};
