import { useState } from "react";
import {
    Modal,
    View,
    Text,
    Image,
    TouchableOpacity,
    Pressable,
} from "react-native";
import { ResizeMode, Video } from "expo-av";

import { Post } from "../types";
import { icons } from "../constants";
import { useGlobalContext } from "../context/GlobalProvider";
import { toggleLikeVideo } from "../lib/appwrite";

interface Props {
    post: Post;
    fetch: () => Promise<void>;
}

export function PostCard({ post, fetch }: Props) {
    const {
        title,
        thumbnail,
        video,
        creator: { username, avatar },
    } = post;

    const [play, setPlay] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const { user } = useGlobalContext();

    const showFollow = post.creator.$id !== user?.$id;
    const likedVideo = post.usersLike.find((n) => n === user?.$id)
        ? true
        : false;

    const toggleLike = async () => {
        setShowMenu(false);
        setLoading(true);

        await toggleLikeVideo(post.$id, user?.$id!!);
        await fetch();

        setLoading(false);
    };

    return (
        <View className="flex-col items-center px-4 mb-14">
            <View className="flex-row gap-3 items-start">
                <View className="justify-center items-center flex-row flex-1">
                    <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
                        <Image
                            source={{ uri: avatar }}
                            className="w-full h-full rounded-lg"
                            resizeMode="cover"
                        />
                    </View>

                    <View className="justify-center flex-1 ml-3 gap-y-1">
                        <Text
                            className="text-white font-psemibold text-sm"
                            numberOfLines={1}
                        >
                            {title}
                        </Text>

                        <Text
                            className="text-xs text-gray-100 font-pregular"
                            numberOfLines={1}
                        >
                            {username}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    className="pt-2"
                    onPress={() => setShowMenu(!showMenu)}
                >
                    <Image
                        source={icons.menu}
                        className="w-5 h-5"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            {showMenu && !loading && (
                <View
                    className={`absolute translate-x-20 bg-black-200 ${
                        showFollow && "-translate-y-10"
                    }`}
                >
                    {showFollow && (
                        <TouchableOpacity
                            className="py-2 px-2 border border-white rounded-t-lg flex-row items-center"
                            onPress={() => {}}
                        >
                            <Text className="text-white text-xl">Follow</Text>

                            <Image
                                source={icons.follow}
                                className="w-4 h-4 ml-2"
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={toggleLike}
                        className={`py-2 px-2 border border-white flex-row items-center ${
                            showFollow ? "rounded-b-lg" : "rounded-lg"
                        }`}
                    >
                        <Text className="text-white text-xl">
                            {likedVideo ? "Unlike video" : "Give a like"}
                        </Text>

                        <Image
                            source={likedVideo ? icons.unlike : icons.like}
                            className="w-6 h-6 ml-2"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
            )}

            {play ? (
                <Video
                    source={{ uri: video }}
                    className="w-full h-60 rounded-xl mt-3"
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay
                    onPlaybackStatusUpdate={(status) => {
                        if (status.isLoaded) {
                            setPlay(false);
                        }
                    }}
                    onError={(e) => console.log(e)}
                />
            ) : (
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setPlay(true)}
                    className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
                >
                    <Image
                        source={{ uri: thumbnail }}
                        className="w-full h-full rounded-3xl mt-3"
                        resizeMode="cover"
                    />

                    <Image
                        source={icons.play}
                        className="w-12 h-12 absolute"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}
