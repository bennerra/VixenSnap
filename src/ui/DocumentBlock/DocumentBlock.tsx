import { FC, ReactNode } from "react";
import classNames from "classnames/bind";
import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

type Props = {
  children: ReactNode;
  theme: string;
};

export const DocumentBlock: FC<Props> = ({ children, theme }) => {
  return (
    <div className={cx("document-block", `document-block__${theme}`)}>
      {children}
    </div>
  );
};
