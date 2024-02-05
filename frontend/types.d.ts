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
  content_hash: string,
  profile_picture_hash: string,
  profile_banner_hash: string
}

interface OrganisationType {
  company_name: string,
  email: string,
  wallet_address: string,
  bio: string | null,
  location: string | null,
  industry: string,
  content_hash: string,
  profile_picture_hash: string,
  profile_banner_hash: string
}

interface ProfileState {
  first_name: string | null,
  last_name: string | null,
  pronouns: string | null,
  email: string | null,
  wallet_address: string | null,
  bio: string | null,
  location: string | null,
  connections: Number | null,
  content_hash: string | null,
  profile_picture_hash: string | null,
  profile_banner_hash: string | null,
  posts: Array<PostType> | null
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
  content_hash: string,
  profile_picture_hash: string,
  profile_banner_hash: string
}

interface OrganisationProfileState {
  company_name: string | null,
  industry: string | null,
  email: string | null,
  wallet_address: string | null,
  bio: string | null,
  location: string | null,
  followers: Number | null,
  content_hash: string | null,
  profile_picture_hash: string | null,
  profile_banner_hash: string | null,
  posts: Array<PostType> | null
}

interface OrganisationStateType {
  company_name: string | null,
  industry: null,
  email: string,
  wallet_address: string,
  bio: string | null,
  location: string | null,
  followers: Number,
  content_hash: string,
  profile_picture_hash: string,
  profile_banner_hash: string,
}

interface CommentType {
  id: string,
  commentContentHash: string,
  owner: string
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

interface FeedPostType extends PostType {
  name: string,
  bio: string,
  profileImageHash: string
  hasLiked: boolean,
  owner: string
}

interface FeedCommentType extends CommentType {
  name: string,
  bio: string,
  time_posted: string
  content: string,
  profileImageHash,
}

interface UserDetails {
  name: string,
  bio: string,
  profileImageHash: string,
  address: string
}