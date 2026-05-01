export interface Comment {
  id: number;
  text: string;
  created_at: string;
  author_name: string;
  author_id: string;
  author_avatar: string;
}

export interface CommentResponse {
  count: number;
  next: number | null;
  previous: number | null;
  results: Comment[];
}
