export type IProfileEdit = {
  avatar: File;
  username: string;
  name: string;
  birthdate: string;
  isEditPassword: boolean;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
