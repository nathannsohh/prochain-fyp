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
  profile_banner_hash: string,
  about: string | null
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

interface EducationType {
  school_name: string,
  start: string,
  end: string | null,
  type: string,
  field: string | null,
  about: string | null
}

interface WorkExperienceType {
  company_name: string,
  start: string,
  end: string | null,
  title: string,
  about: string | null,
  type: string
}

interface WorkExperience {
  id: string,
  company_name: string,
  start: string,
  end: string,
  title: string,
  about: string | null,
  type: string,
  company_image_hash: string | null,
  status: "0" | "1" | "2",
  company_address: string,
  content_hash: string
}

interface Verification {
  id: string,
  start: string,
  end: string,
  title: string,
  about: string | null,
  type: string,
  user_image_hash: string | null,
  user_name: string | null,
  status: "0" | "1" | "2",
  user_address: string,
  content_hash: string
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
  about: string | null
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
  profile_banner_hash: string,
  about: string | null
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
  industry: string | null,
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

interface OrgDetails {
  company_name: string,
  industry: string,
  profileImageHash: string,
  address: string
}

interface JobType {
  job_title: string,
  location: string,
  employment_type: string,
  job_level: string,
  job_description: string
}