import React, { FC, useContext, useState, useEffect } from "react";
import classNames from "classnames/bind";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Header } from "@/modules/Header";
import { FileInput } from "@/ui/FileInput/FileInput";
import { Input } from "@/ui/Input";
import { ThemeContext } from "@/context";
import { Button } from "@/ui/Button";

import { useGetUserMeQuery, useUpdateUserMutation } from "@/store/api/UsersApi";
import { AppRoutes } from "@/constants/paths";
import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

interface IProfileEdit {
  username: string;
  name: string;
  birthdate?: string | null;
  isEditPassword?: boolean;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// Функция для расчета возраста
const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age;
};

const baseSchema = {
  username: yup
    .string()
    .required("Имя пользователя обязательно")
    .min(3, "Имя пользователя должно содержать минимум 3 символа")
    .max(30, "Имя пользователя не должно превышать 30 символов")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Имя пользователя может содержать только латинские буквы, цифры и нижнее подчеркивание"
    ),
  name: yup
    .string()
    .required("Имя обязательно")
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(50, "Имя не должно превышать 50 символов")
    .matches(
      /^[a-zA-Zа-яА-ЯёЁ\s-]+$/,
      "Имя может содержать только буквы, пробелы и дефисы"
    ),
  birthdate: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .test("age", "Возраст должен быть не менее 13 лет", (value) => {
      if (!value) return true;
      const birthDate = new Date(value);
      const age = calculateAge(birthDate);
      return age >= 13;
    })
    .test("max-age", "Возраст не может быть более 120 лет", (value) => {
      if (!value) return true;
      const birthDate = new Date(value);
      const age = calculateAge(birthDate);
      return age <= 120;
    }),
  isEditPassword: yup.boolean(),
};

const passwordSchema = {
  oldPassword: yup.string().when("isEditPassword", {
    is: true,
    then: (schema) =>
      schema
        .required("Введите старый пароль")
        .min(6, "Пароль должен содержать минимум 6 символов")
        .max(50, "Пароль не должен превышать 50 символов"),
    otherwise: (schema) => schema.notRequired(),
  }),
  newPassword: yup.string().when("isEditPassword", {
    is: true,
    then: (schema) =>
      schema
        .required("Введите новый пароль")
        .min(6, "Пароль должен содержать минимум 6 символов")
        .max(50, "Пароль не должен превышать 50 символов")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          "Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру"
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
  confirmPassword: yup.string().when("isEditPassword", {
    is: true,
    then: (schema) =>
      schema
        .required("Подтвердите пароль")
        .oneOf([yup.ref("newPassword")], "Пароли не совпадают"),
    otherwise: (schema) => schema.notRequired(),
  }),
};

const validationSchema = yup.object().shape({
  ...baseSchema,
  ...passwordSchema,
});

// Функция для преобразования URL в File объект
const urlToFile = async (
  url: string,
  fileName: string
): Promise<File | null> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const extension = blob.type.split("/")[1] || "jpg";
    const file = new File([blob], `${fileName}.${extension}`, {
      type: blob.type,
    });
    return file;
  } catch (error) {
    console.error("Error converting URL to file:", error);
    return null;
  }
};

export const ProfileEdit: FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  // Получаем данные профиля
  const { data: profileData, isLoading } = useGetUserMeQuery({});

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IProfileEdit>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      username: "",
      name: "",
      birthdate: null,
      isEditPassword: false,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [updateProfile] = useUpdateUserMutation();
  const isEditPassword = watch("isEditPassword");

  // Загрузка текущего аватара как File
  useEffect(() => {
    const loadCurrentAvatar = async () => {
      if (profileData && profileData.avatar) {
        try {
          // Преобразуем URL аватара в File объект
          const avatarFile = await urlToFile(
            profileData.avatar,
            "current-avatar"
          );
          if (avatarFile) {
            setFiles([avatarFile]);
          }
        } catch (error) {
          console.error("Error loading current avatar:", error);
        }
      }
      setIsLoadingInitial(false);
    };

    if (profileData) {
      loadCurrentAvatar();
    }
  }, [profileData]);

  // Устанавливаем дефолтные значения из API
  useEffect(() => {
    if (profileData) {
      reset({
        username: profileData.username || "",
        name: profileData.name || "",
        birthdate: profileData.date_birth || null,
        isEditPassword: false,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [profileData, reset]);

  const onSubmit: SubmitHandler<IProfileEdit> = async (data) => {
    const sendData = new FormData();

    sendData.append("username", data.username);
    sendData.append("name", data.name);
    if (data.birthdate) {
      sendData.append("date_birth", data.birthdate);
    }

    // Отправляем файлы только если они были изменены
    files.forEach((file) => {
      // Проверяем, что это не старый аватар (если нужно отправить новый)
      if (!file.name.includes("current-avatar")) {
        sendData.append("avatar", file);
      }
    });

    if (data.isEditPassword) {
      sendData.append("oldPassword", data.oldPassword || "");
      sendData.append("newPassword", data.newPassword || "");
    }

    try {
      await updateProfile({ data: sendData }).unwrap();
      navigate(AppRoutes.PROFILE_ME);
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
    }
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArr = Array.from(e.target.files);
      const filtered = fileArr.filter(
        (file) => !files.find((f) => f.name === file.name)
      );
      if (filtered.length + files.length <= 1) {
        setFiles([...filtered]);
      }
    }
  };

  const onDeleteFile = (fileName: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  // Получаем максимальную дату (13 лет назад)
  const getMaxDate = (): string => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 13);
    return date.toISOString().split("T")[0];
  };

  // Получаем минимальную дату (120 лет назад)
  const getMinDate = (): string => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 120);
    return date.toISOString().split("T")[0];
  };

  if (isLoading || isLoadingInitial) {
    return (
      <main className={styles["profile-edit"]}>
        <Header />
        <div className={cx("loading", `loading-${theme}`)}>Загрузка...</div>
      </main>
    );
  }

  return (
    <main className={cx("profile-edit", `profile-edit-${theme}`)}>
      <Header />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cx("profile-edit__container", "container")}
      >
        <h2 className={cx("form-edit__title", `form-edit__title-${theme}`)}>
          Редактирование профиля
        </h2>
        <div className={styles["form-edit__content"]}>
          {/* Аватар */}
          <div className={cx("form-edit__group", `form-edit__group-${theme}`)}>
            <div
              className={cx(
                "form-edit__group-label",
                `form-edit__group-label-${theme}`
              )}
            >
              Фото профиля
            </div>
            <div className={styles["form-edit__field"]}>
              <FileInput
                register={register}
                name="avatar"
                onChange={onImageChange}
                onDeleteFile={onDeleteFile}
                isFilesPreview
                files={files}
                accept=".png, .jpg, .jpeg, .webp"
                isMultiple={false}
              />
            </div>
          </div>

          {/* Основная информация */}
          <div className={cx("form-edit__group", `form-edit__group-${theme}`)}>
            <div
              className={cx(
                "form-edit__group-label",
                `form-edit__group-label-${theme}`
              )}
            >
              Основная информация
            </div>

            <div className={styles["form-edit__field"]}>
              <div
                className={cx("form-edit__label", `form-edit__label-${theme}`)}
              >
                Имя пользователя
              </div>
              <Input
                {...register("username")}
                placeholder="Имя пользователя *"
                theme={theme}
                error={errors?.username?.message}
              />
              {errors?.username?.message && (
                <div
                  className={cx(
                    "form-edit__error",
                    `form-edit__error-${theme}`
                  )}
                >
                  {errors.username.message}
                </div>
              )}
            </div>

            <div className={styles["form-edit__field"]}>
              <div
                className={cx("form-edit__label", `form-edit__label-${theme}`)}
              >
                Имя
              </div>
              <Input
                {...register("name")}
                placeholder="Имя *"
                theme={theme}
                error={errors?.name?.message}
              />
              {errors?.name?.message && (
                <div
                  className={cx(
                    "form-edit__error",
                    `form-edit__error-${theme}`
                  )}
                >
                  {errors.name.message}
                </div>
              )}
            </div>

            <div className={styles["form-edit__field"]}>
              <div
                className={cx("form-edit__label", `form-edit__label-${theme}`)}
              >
                Дата рождения
              </div>
              <Input
                {...register("birthdate")}
                type="date"
                min={getMinDate()}
                max={getMaxDate()}
                placeholder="Дата рождения"
                theme={theme}
                error={errors?.birthdate?.message}
              />
              {errors?.birthdate?.message && (
                <div
                  className={cx(
                    "form-edit__error",
                    `form-edit__error-${theme}`
                  )}
                >
                  {errors.birthdate.message}
                </div>
              )}
            </div>
          </div>

          {/* Изменение пароля */}
          <div className={cx("form-edit__group", `form-edit__group-${theme}`)}>
            <div
              className={cx(
                "form-edit__group-label",
                `form-edit__group-label-${theme}`
              )}
            >
              Изменение пароля
            </div>

            <label
              htmlFor="isEditPassword"
              className={cx("checkbox", `checkbox-${theme}`)}
            >
              <input
                id="isEditPassword"
                type="checkbox"
                {...register("isEditPassword")}
              />
              <span className={styles.checkbox__custom} />
              <span
                className={cx("checkbox__label", `checkbox__label-${theme}`)}
              >
                Изменить пароль
              </span>
            </label>

            {isEditPassword && (
              <>
                <div className={styles["form-edit__field"]}>
                  <div
                    className={cx(
                      "form-edit__label",
                      `form-edit__label-${theme}`
                    )}
                  >
                    Старый пароль
                  </div>
                  <Input
                    {...register("oldPassword")}
                    type="password"
                    placeholder="Старый пароль"
                    theme={theme}
                    error={errors?.oldPassword?.message}
                  />
                  {errors?.oldPassword?.message && (
                    <div
                      className={cx(
                        "form-edit__error",
                        `form-edit__error-${theme}`
                      )}
                    >
                      {errors.oldPassword.message}
                    </div>
                  )}
                </div>

                <div className={styles["form-edit__field"]}>
                  <div
                    className={cx(
                      "form-edit__label",
                      `form-edit__label-${theme}`
                    )}
                  >
                    Новый пароль
                  </div>
                  <Input
                    {...register("newPassword")}
                    type="password"
                    placeholder="Новый пароль"
                    theme={theme}
                    error={errors?.newPassword?.message}
                  />
                  {errors?.newPassword?.message && (
                    <div
                      className={cx(
                        "form-edit__error",
                        `form-edit__error-${theme}`
                      )}
                    >
                      {errors.newPassword.message}
                    </div>
                  )}
                </div>

                <div className={styles["form-edit__field"]}>
                  <div
                    className={cx(
                      "form-edit__label",
                      `form-edit__label-${theme}`
                    )}
                  >
                    Подтвердите пароль
                  </div>
                  <Input
                    {...register("confirmPassword")}
                    type="password"
                    placeholder="Повторите пароль"
                    theme={theme}
                    error={errors?.confirmPassword?.message}
                  />
                  {errors?.confirmPassword?.message && (
                    <div
                      className={cx(
                        "form-edit__error",
                        `form-edit__error-${theme}`
                      )}
                    >
                      {errors.confirmPassword.message}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <Button
            theme={theme}
            type="submit"
            text="Сохранить"
            color="orange"
            size="medium"
            style={{ maxWidth: 300, alignSelf: "flex-end" }}
          />
        </div>
      </form>
    </main>
  );
};
