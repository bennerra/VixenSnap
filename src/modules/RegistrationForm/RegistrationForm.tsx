import React, { FC, useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import classNames from "classnames/bind";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { loginUser, registrationUser } from "@/store/action-creators/auth";
import { IRegistrationForm } from "@/models/IRegistrationForm";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { ThemeContext } from "@/context";
import { AuthButtonsList } from "@/modules/AuthButtonsList";

import { Input } from "@/ui/Input";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

const schema = yup
  .object()
  .shape({
    username: yup.string().required().min(8),
    password: yup.string().required().min(8),
    email: yup.string().required().email(),
    name: yup.string().required(),
  })
  .required();

const RegistrationForm: FC = () => {
  const { theme } = useContext(ThemeContext);
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IRegistrationForm>({
    resolver: yupResolver(schema) as any,
  });
  const { registrationError } = useAppSelector((state) => state.error);
  const requestErrors = Object.values(registrationError).flat();

  const onSubmit: SubmitHandler<IRegistrationForm> = async (data) => {
    try {
      const res = await dispatch(registrationUser(data));
      if (res?.status === 201) {
        await dispatch(
          loginUser({
            username: data.username || data.email,
            password: data.password,
          }) as any
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form className={cx("registration-form")} onSubmit={handleSubmit(onSubmit)}>
      <div className={cx("registration-form__input")}>
        <Input
          {...register("username")}
          cancelled={!!registrationError}
          theme={theme}
          placeholder="Имя пользователя *"
          error={errors?.username?.message}
        />
        {errors?.username?.message && (
          <div className={cx("registration-form__error")}>
            {errors?.username?.message}
          </div>
        )}
      </div>
      <div className={cx("registration-form__input")}>
        <Input
          {...register("password")}
          cancelled={!!registrationError}
          theme={theme}
          placeholder="Пароль *"
          type="password"
          error={errors?.password?.message}
        />
        {errors?.password?.message && (
          <div className={cx("registration-form__error")}>
            {errors?.password?.message}
          </div>
        )}
      </div>
      <div className={cx("registration-form__input")}>
        <Input
          {...register("email")}
          cancelled={!!registrationError}
          theme={theme}
          placeholder="E-mail *"
          type="email"
          error={errors?.email?.message}
        />
        {errors?.email?.message && (
          <div className={cx("registration-form__error")}>
            {errors?.email?.message}
          </div>
        )}
      </div>
      <div className={cx("registration-form__input")}>
        <Input
          {...register("name")}
          cancelled={!!registrationError}
          theme={theme}
          placeholder="Имя *"
          error={errors?.name?.message}
        />
        {errors?.name?.message && (
          <div className={cx("registration-form__error")}>
            {errors?.name?.message}
          </div>
        )}
      </div>
      {!!requestErrors.length &&
        requestErrors.map((item) => (
          <div key={item} className={cx("registration-form__error")}>
            {item}
          </div>
        ))}
      <AuthButtonsList text="Зарегистрироваться" />
    </form>
  );
};

export default RegistrationForm;
