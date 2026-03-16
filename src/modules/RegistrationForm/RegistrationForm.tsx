import React, { FC, useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import classNames from "classnames/bind";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { IRegistrationForm } from "@/models/IRegistrationForm";
import { ThemeContext } from "@/context";
import { AuthButtonsList } from "@/modules/AuthButtonsList";
import { Input } from "@/ui/Input";
import { useLoginMutation, useRegistrationMutation } from "@/store/api/AuthApi";
import { LocalStorageNames } from "@/constants/localeStorage";
import { cookies, CookiesNames } from "@/constants/cookies";
import { AppRoutes } from "@/constants/paths";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

const schema = yup
  .object()
  .shape({
    username: yup
      .string()
      .required("Это обязательное поле!")
      .min(8, "Поле должно быть не меньше 8 символов"),
    password: yup.string().required("Это обязательное поле!").min(8),
    email: yup
      .string()
      .required("Это обязательное поле!")
      .email("Некорректный email"),
    name: yup.string().required("Это обязательное поле!"),
  })
  .required();

const RegistrationForm: FC = () => {
  const { theme } = useContext(ThemeContext);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IRegistrationForm>({
    resolver: yupResolver(schema),
  });
  const [registrationUser, { error: registrationErrors }] =
    useRegistrationMutation();
  const [loginUser] = useLoginMutation();
  const error = registrationErrors as any;

  const onSubmit: SubmitHandler<IRegistrationForm> = async (data) => {
    try {
      await registrationUser(data).unwrap();
      const loginResponse = await loginUser({
        username: data.username || data.email,
        password: data.password,
      }).unwrap();

      localStorage.setItem(LocalStorageNames.AUTH, loginResponse.access);
      cookies.set(CookiesNames.AUTH, loginResponse.refresh, {
        expires: new Date(Date.now() + 86400000),
      });
      window.location.href = AppRoutes.MAIN;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form className={cx("registration-form")} onSubmit={handleSubmit(onSubmit)}>
      <div className={cx("registration-form__input")}>
        <Input
          {...register("username")}
          cancelled={!!error?.data?.username?.length}
          theme={theme}
          placeholder="Имя пользователя *"
          error={errors?.username?.message}
        />
        {!!error?.data?.username?.length && (
          <div className={cx("registration-form__error")}>
            {error?.data?.username[0]}
          </div>
        )}
      </div>
      <div className={cx("registration-form__input")}>
        <Input
          {...register("password")}
          cancelled={!!error?.data?.password?.length}
          theme={theme}
          placeholder="Пароль *"
          type="password"
          error={errors?.password?.message}
        />
        {!!error?.data?.password?.length && (
          <div className={cx("registration-form__error")}>
            {error?.data?.password[0]}
          </div>
        )}
      </div>
      <div className={cx("registration-form__input")}>
        <Input
          {...register("email")}
          cancelled={!!error?.data?.email?.length}
          theme={theme}
          placeholder="E-mail *"
          type="email"
          error={errors?.email?.message}
        />
        {!!error?.data?.email?.length && (
          <div className={cx("registration-form__error")}>
            {error?.data?.email[0]}
          </div>
        )}
      </div>
      <div className={cx("registration-form__input")}>
        <Input
          {...register("name")}
          cancelled={!!error?.data?.name?.length}
          theme={theme}
          placeholder="Имя *"
          error={errors?.name?.message}
        />
        {!!error?.data?.name?.length && (
          <div className={cx("registration-form__error")}>
            {error?.data?.name[0]}
          </div>
        )}
      </div>
      {!!error?.data?.non_field_errors?.length &&
        !!error?.data?.non_field_errors.map((item: string) => (
          <div key={item} className={cx("registration-form__error")}>
            {item}
          </div>
        ))}
      <AuthButtonsList text="Зарегистрироваться" />
    </form>
  );
};

export default RegistrationForm;
