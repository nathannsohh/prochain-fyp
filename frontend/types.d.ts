type InjectedProviders = {
  isMetaMask?: true;
};
  
interface Window {
  ethereum: InjectedProviders & {
    on: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
    removeAllListeners: (...args: any[]) => void;
    request<T = any>(args: any): Promise<T>;
  };
}

interface UserType {
  first_name: string,
  last_name: string,
  pronouns: string | null,
  email: string,
  wallet_address: string,
  bio: string | null,
  location: string | null,
  content_hash: string
}

interface ProfileState {
  value: UserStateType | null
}

interface UserStateType  {
  first_name: string,
  last_name: string,
  pronouns: string | null,
  email: string,
  wallet_address: string,
  bio: string | null,
  location: string | null,
  connections: Number,
  content_hash: string
}

interface CommentType {
  id: string,
  commentContentHash: string
  content: string
}

interface PostType {
  id: string,
  postContentHash: string,
  postImageHash: string,
  likedBy: Array<string>,
  comments: Array<CommentType>,
  content: string,
  time_posted: string
}