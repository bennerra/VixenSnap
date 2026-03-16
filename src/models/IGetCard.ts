import { IAttachment } from "@/models/IAttachment";

export type IGetCard = {
  id: string;
  name: string;
  owner_id: string;
  short_url: string;
  description: string;
  likes_count: number;
  is_liked: boolean;
  attachments: IAttachment[];
};

export type GetCardDetailResponse = {
  id: string;
  name: string;
  owner_id: string;
  short_url: string;
  description: string;
  likes_count: number;
  is_liked: boolean;
  author_name: string;
  author_id: string;
};
