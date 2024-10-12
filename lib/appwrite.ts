import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    ImageGravity,
    Query,
    Storage,
} from "react-native-appwrite";

import { CreateForm, LikedVideos, Post, User } from "../types";

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.axel.aora",
    projectId: "6671b7e00005017fe067",
    databaseId: "6671b8c2002d00c5ac80",
    userCollectionId: "6671b8d80015f3a7673b",
    videoCollectionId: "6671b8ed003be60faa2d",
    followersCollectionId: "668431aa0009ff608736",
    storageId: "6671ba340019fbba2237",
};

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Session

export const createUser = async (
    email: string,
    password: string,
    username: string
) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
            }
        );

        return newUser as User;
    } catch (err: any) {
        console.log(err);
        throw new Error(err);
    }
};

export const signIn = async (email: string, password: string) => {
    try {
        return await account.createEmailPasswordSession(email, password);
    } catch (err: any) {
        throw new Error(err);
    }
};

export const signOut = async () => {
    try {
        const session = await account.deleteSession("current");

        return session;
    } catch (err: any) {
        throw new Error(err);
    }
};

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0] as User;
    } catch (err: any) {
        console.log(err);
        throw new Error(err);
    }
};

// Post

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(10)]
        );

        return posts.documents as Post[];
    } catch (err: any) {
        throw new Error(err);
    }
};

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(3)]
        );

        return posts.documents as Post[];
    } catch (err: any) {
        throw new Error(err);
    }
};

export const searchPosts = async (query: string) => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.search("title", query)]
        );

        return posts.documents as Post[];
    } catch (err: any) {
        throw new Error(err);
    }
};

export const getUserPosts = async (userId: string) => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.equal("creator", userId)]
        );

        return posts.documents as Post[];
    } catch (err: any) {
        throw new Error(err);
    }
};

export const getLikedVideos = async (userId: string, search: string) => {
    try {
        const queries = [Query.contains("usersLike", userId)];

        if (search.trim() !== "") {
            queries.push(Query.search("title", search));
        }

        const videos = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            queries
        );

        return videos.documents as Post[];
    } catch (err: any) {
        throw new Error(err);
    }
};

export const getFilePreview = async (
    fileId: string,
    type: "image" | "video"
) => {
    let fileUrl;

    try {
        if (type === "image") {
            fileUrl = storage.getFilePreview(
                config.storageId,
                fileId,
                2000,
                2000,
                ImageGravity.Top,
                100
            );
        } else if (type === "video") {
            fileUrl = storage.getFileView(config.storageId, fileId);
        } else {
            throw new Error("Invalid file type");
        }

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (err: any) {
        throw new Error(err);
    }
};

export const uploadFile = async (
    file: CreateForm["thumbnail" | "video"],
    type: "image" | "video"
) => {
    if (!file || !file.fileName || !file.mimeType || !file.fileSize) return;

    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
    };

    try {
        const uploadedFile = await storage.createFile(
            config.storageId,
            ID.unique(),
            asset
        );

        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl;
    } catch (err: any) {
        throw new Error(err);
    }
};

export const createVideo = async (form: CreateForm, userId: string) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, "image"),
            uploadFile(form.video, "video"),
        ]);

        const newPost = await databases.createDocument(
            config.databaseId,
            config.videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: userId,
            }
        );

        return newPost;
    } catch (err: any) {
        throw new Error(err);
    }
};

// Followers

export const getFollowersCount = async (userId: string) => {
    try {
        const followersCount = await databases.listDocuments(
            config.databaseId,
            config.followersCollectionId,
            [Query.equal("userId", userId)]
        );

        return followersCount.total;
    } catch (err: any) {
        throw new Error(err);
    }
};

export const followUser = async (userId: string, userToFollowId: string) => {
    try {
        const newFollower = await databases.createDocument(
            config.databaseId,
            config.followersCollectionId,
            ID.unique(),
            {
                userId: userToFollowId,
                followerId: userId,
            }
        );

        return newFollower;
    } catch (err: any) {
        throw new Error(err);
    }
};

// Likes

export const toggleLikeVideo = async (videoId: string, userId: string) => {
    try {
        const video: Post = await databases.getDocument(
            config.databaseId,
            config.videoCollectionId,
            videoId
        );

        const likedVideo = await databases.updateDocument(
            config.databaseId,
            config.videoCollectionId,
            videoId,
            {
                usersLike: video.usersLike.includes(userId)
                    ? video.usersLike.filter((n) => n !== userId)
                    : [...video.usersLike, userId],
            }
        );

        return likedVideo;
    } catch (err: any) {
        throw new Error(err);
    }
};
