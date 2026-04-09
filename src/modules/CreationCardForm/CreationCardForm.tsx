import React, { FC, useContext, useState } from "react";
import classNames from "classnames/bind";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { ThemeContext } from "@/context";
import { ICreationCard } from "@/models/ICreationCard";
import { Input } from "@/ui/Input";
import { Button } from "@/ui/Button";
import { useCreationCardMutation } from "@/store/api/CardsApi";
import { FileInput } from "@/ui/FileInput/FileInput";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

const schema = yup.object().shape({
  name: yup.string().required(),
});

const CreationCardForm: FC = () => {
  const { theme } = useContext(ThemeContext);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ICreationCard>({
    resolver: yupResolver(schema) as any,
  });
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();
  const [createCard] = useCreationCardMutation();

  const onSubmit: SubmitHandler<ICreationCard> = async (data) => {
    const sendData = new FormData();
    sendData.append("name", data.name);
    sendData.append("description", data.description);
    files.forEach((el: File) => {
      sendData.append("image", el);
    });
    await createCard(sendData).unwrap();
    navigate("/");
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArr: File[] = Array.from(e.target.files);
      const filterArr = fileArr.filter((file) => {
        return !files.find((item) => item.name === file.name);
      });
      if (filterArr.length + files.length <= 15) {
        setFiles((prev) => [...prev, ...filterArr]);
      }
    }
  };

  const onDeleteFile = (file: string) => {
    const filteredFiles = files.filter((item) => item.name !== file);
    setFiles(filteredFiles);
  };

  return (
    <div className={cx("creation-card")}>
      <FileInput
        register={register}
        name="image"
        isMultiple
        onChange={onImageChange}
        onDeleteFile={onDeleteFile}
        isFilesPreview
        files={files}
        accept=".png, .jpg, .gif, .jpeg, .bmp, .webp, .svg"
      />
      <div className={cx("creation-card__description", "description")}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={cx("description__form", "description-form")}
        >
          <div className={cx("description-form__item", "description-item")}>
            <h2
              className={cx(
                "description-item__title",
                `description-item__title-${theme}`
              )}
            >
              Название
            </h2>
            <Input
              {...register("name")}
              placeholder="Добавьте название"
              theme={theme}
              error={errors?.name?.message}
            />
            {errors?.name?.message && (
              <div className={cx("description-form__error")}>
                {errors?.name?.message}
              </div>
            )}
          </div>
          <div className={cx("description__item", "description-item")}>
            <h2
              className={cx(
                "description-item__title",
                `description-item__title-${theme}`
              )}
            >
              Описание
            </h2>
            <textarea
              {...register("description")}
              placeholder="Добавьте описание"
              className={cx(
                "description-item__textarea",
                `description-item__textarea-${theme}`
              )}
              cols={92}
              rows={10}
            />
          </div>
          <div className={cx("description__button")}>
            <Button
              type="submit"
              text="Создать"
              color="orange"
              size="medium"
              theme={theme}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreationCardForm;
