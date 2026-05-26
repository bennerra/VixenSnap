export const enum AppRoutes {
  MAIN = "/",
  AUTH = "/login",
  REGISTRATION = "/registration",
  VK_AUTH = "/vk_auth",
  CREATION = "/creation",
  PROFILE = "/profile/:id",
  CARD_DETAIL = "/card/:id",
  PROFILE_EDIT = "/profile/edit",
}

export const NotAuthPaths: AppRoutes[] = [
  AppRoutes.MAIN,
  AppRoutes.AUTH,
  AppRoutes.REGISTRATION,
  AppRoutes.VK_AUTH,
];

export const AuthRoutes: AppRoutes[] = [
  AppRoutes.CREATION,
  AppRoutes.PROFILE_EDIT,
];
