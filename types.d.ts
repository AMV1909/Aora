import { Models } from "react-native-appwrite";

export interface User extends Models.Document {
    email: string;
    username: string;
    avatar: string;
    accounId: string;
    followers: User[];
}

export interface Post extends Models.Document {
    title: string;
    thumbnail: string;
    prompt: string;
    video: string;
    creator: User;
    usersLike: string[]
}

export interface LikedVideos extends Models.Document {
    videoId: string;
    userId: string;
}

interface File {
    fileName?: string | null;
    mimeType?: string;
    fileSize?: number;
    uri: string;
}

export interface CreateForm {
    title: string;
    video: null | File;
    thumbnail: null | File;
    prompt: string;
}
