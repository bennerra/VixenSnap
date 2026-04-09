import { ImagesPreview } from "@/modules/CreationCardForm/components/ImagesPreview";
import React, { FC } from "react";
import classNames from "classnames/bind";

import { ReactComponent as Upload } from "@/assets/upload.svg";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

type Props = {
  register: any;
  onChange: (args?: any) => void;
  isFilesPreview: boolean;
  files: File[];
  onDeleteFile: (file: string) => void;
  accept: string;
  name: string;
  isMultiple?: boolean;
};

export const FileInput: FC<Props> = (props) => {
  const {
    register,
    onChange,
    isFilesPreview,
    files,
    onDeleteFile,
    accept,
    name,
    isMultiple = false,
  } = props;

  return (
    <div className={cx("creation-card__left")}>
      <div className={cx("creation-card__upload", "upload")}>
        <div className={cx("upload__icon")}>
          <Upload />
        </div>
        <div className={cx("upload__text")}>Загрузите файлы</div>
        <input
          {...register(name)}
          className={cx("upload__input")}
          type="file"
          multiple={isMultiple}
          onChange={onChange}
          accept={accept}
        />
      </div>
      {isFilesPreview && (
        <ImagesPreview files={files} onDeleteFile={onDeleteFile} />
      )}
    </div>
  );
};
