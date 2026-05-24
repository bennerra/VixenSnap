import Modal from "@/ui/Modal/Modal";
import { FC, useContext, useState } from "react";
import { useGetPremiumMutation } from "@/store/api/UsersApi";
import { NotificationContext } from "@/context/NotificationContext";

import styles from "./styles.module.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
};

export const GetPremiumModal: FC<Props> = ({ isOpen, onClose, theme }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<1 | 12>(1);
  const [getPremium, { isLoading }] = useGetPremiumMutation();
  const { showNotification } = useContext(NotificationContext);

  const monthPrice = 350;
  const yearPrice = 3500;
  const yearDiscount = Math.round((1 - yearPrice / (monthPrice * 12)) * 100);

  const handleSubscribe = async () => {
    try {
      await getPremium({ duration_months: selectedPeriod });
      showNotification("Подписка успешно оформлена", "success");
    } catch (e) {
      showNotification("Не удалось оформить подписку", "error");
    }
  };

  const isDark = theme === "dark";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      theme={theme}
      footerButtons={{
        primary: {
          text: isLoading ? "Оформление..." : "Оформить подписку",
          onClick: handleSubscribe,
        },
        secondary: { text: "Отмена", onClick: onClose },
      }}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <div
            className={`${styles.icon} ${
              isDark ? styles.iconDark : styles.iconLight
            }`}
          >
            💎
          </div>
          <h3
            className={`${styles.title} ${
              isDark ? styles.titleDark : styles.titleLight
            }`}
          >
            Премиум-подписка
          </h3>
          <p
            className={`${styles.subtitle} ${
              isDark ? styles.subtitleDark : styles.subtitleLight
            }`}
          >
            Наслаждайтесь просмотром ленты без рекламы
          </p>
        </div>

        <div className={styles.pricing}>
          {/* Месячная подписка */}
          <div
            className={`${styles.plan} ${
              selectedPeriod === 1 ? styles.selected : ""
            } ${isDark ? styles.planDark : styles.planLight}`}
            onClick={() => setSelectedPeriod(1)}
          >
            <div className={styles.planHeader}>
              <span className={styles.planName}>Месяц</span>
              {selectedPeriod === 1 && (
                <span className={styles.checkIcon}>✓</span>
              )}
            </div>
            <div className={styles.planPrice}>
              <span className={styles.price}>{monthPrice}</span>
              <span className={styles.currency}>₽</span>
              <span className={styles.period}>/мес</span>
            </div>
            <div className={styles.planDescription}>
              Оплата ежемесячно
              <br />
              Отмена в любой момент
            </div>
          </div>

          {/* Годовая подписка */}
          <div
            className={`${styles.plan} ${
              selectedPeriod === 12 ? styles.selected : ""
            } ${isDark ? styles.planDark : styles.planLight}`}
            onClick={() => setSelectedPeriod(12)}
          >
            <div className={styles.planHeader}>
              <span className={styles.planName}>Год</span>
              {selectedPeriod === 12 && (
                <span className={styles.checkIcon}>✓</span>
              )}
            </div>
            <div className={styles.planPrice}>
              <span className={styles.price}>{yearPrice}</span>
              <span className={styles.currency}>₽</span>
              <span className={styles.period}>/год</span>
              {yearDiscount > 0 && (
                <span className={styles.discount}>-{yearDiscount}%</span>
              )}
            </div>
            <div className={styles.planDescription}>
              Экономия {monthPrice * 12 - yearPrice} ₽ в год
              <br />
              Отмена в любой момент
            </div>
          </div>
        </div>

        <div
          className={`${styles.features} ${
            isDark ? styles.featuresDark : styles.featuresLight
          }`}
        >
          <div className={styles.featureTitle}>Что вы получите:</div>
          <ul className={styles.featureList}>
            <li>Просмотр ленты без рекламы</li>
            <li>Специальная рамка для аватара</li>
            <li>Приоритетная поддержка</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};
