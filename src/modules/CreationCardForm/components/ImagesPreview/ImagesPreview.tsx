import { FC } from "react";
import classNames from "classnames/bind";

import { ReactComponent as Delete } from "@/assets/cross.svg";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

interface ImagesPreviewProps {
  files: File[];
  onDeleteFile: (file: string) => void;
}

const ImagesPreview: FC<ImagesPreviewProps> = ({ files, onDeleteFile }) => {
  return (
    <div className={cx("creation-card__images", "images")}>
      {files.map((file) => {
        const src = URL.createObjectURL(file);
        return (
          <div key={file.name} className={cx("images__item", "images-item")}>
            <img className={cx("images-item__picture")} src={src} alt="" />
            <div
              onClick={() => onDeleteFile(file.name)}
              className={cx("images-item__close")}
            >
              <Delete />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImagesPreview;
