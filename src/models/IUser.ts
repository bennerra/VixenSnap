export interface IUser {
  avatar?: string | null | undefined;
  email: string;
  id: string;
  name: string;
  registration_date: string;
  username: string;
  is_following: boolean;
  followers_count: number;
  following_count: number;
  is_premium: boolean;
}
