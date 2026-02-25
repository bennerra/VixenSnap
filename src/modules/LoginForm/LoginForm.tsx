import { FC, useContext } from "react";
import classNames from "classnames/bind";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { loginUser } from "@/store/action-creators/auth";
import { ThemeContext } from "@/context";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { ILoginForm } from "@/models/ILoginForm";

import { Input } from "@/ui/Input";
import { AuthButtonsList } from "@/modules/AuthButtonsList";

import styles from "./styles.module.scss";

const cx = classNames.bind(styles);

const schema = yup
  .object()
  .shape({
    username: yup.string().required(),
    password: yup.string().required(),
  })
  .required();

const LoginForm: FC = () => {
  const { theme } = useContext(ThemeContext);
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ILoginForm>({
    resolver: yupResolver(schema) as any,
  });
  const { loginError } = useAppSelector((state) => state.error);

  const onSubmit: SubmitHandler<ILoginForm> = async (data) => {
    await dispatch(loginUser(data) as any);
  };

  return (
    <form className={cx("login-form")} onSubmit={handleSubmit(onSubmit)}>
      <div className={cx("login-form__input")}>
        <Input
          {...register("username")}
          theme={theme}
          cancelled={!!loginError}
          placeholder="Логин или e-mail"
          error={errors?.username?.message}
        />
        {errors?.username?.message && (
          <div className={cx("login-form__error")}>
            {errors?.username?.message}
          </div>
        )}
      </div>
      <div className={cx("login-form__input")}>
        <Input
          {...register("password")}
          theme={theme}
          cancelled={!!loginError}
          placeholder="Пароль"
          type="password"
          error={errors?.password?.message}
        />
        {errors?.password?.message && (
          <div className={cx("login-form__error")}>
            {errors?.password?.message}
          </div>
        )}
      </div>
      {loginError && (
        <div className={cx("login-form__error")}>Неверный логин или пароль</div>
      )}
      <AuthButtonsList text="Войти" />
    </form>
  );
};

export default LoginForm;
