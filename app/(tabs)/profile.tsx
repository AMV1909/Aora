import { useCallback, useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";

import { EmptyState, PostCard } from "../../components";
import { getFollowersCount, getUserPosts, signOut } from "../../lib/appwrite";
import { useAppwrite } from "../../lib/useAppwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Post } from "../../types";
import { icons } from "../../constants";
import { InfoBox } from "../../components/InfoBox";

export default function Profile() {
    const { user, setUser, setIsLoggedIn } = useGlobalContext();
    const { data: posts, refetch } = useAppwrite<Post>(() =>
        getUserPosts(user?.$id!!)
    );
    const [followersCount, setFollowersCount] = useState(0);

    const logout = async () => {
        await signOut();

        setUser(null);
        setIsLoggedIn(false);

        router.replace("/sign-in");
    };

    useEffect(() => {
        getFollowersCount(user?.$id!!)
            .then((count) => setFollowersCount(count))
            .catch(console.log);
    }, []);

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [])
    );

    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={posts}
                keyExtractor={(i) => i.$id.toString()}
                renderItem={({ item }) => (
                    <PostCard post={item} fetch={refetch} />
                )}
                ListHeaderComponent={() => (
                    <View className="w-full justify-center items-center mt-6 mb-12 px-4">
                        <View className="w-full items-end mb-10">
                            <TouchableOpacity onPress={logout}>
                                <Image
                                    source={icons.logout}
                                    resizeMode="contain"
                                    className="w-6 h-6"
                                />
                            </TouchableOpacity>
                        </View>

                        <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                            <Image
                                source={{ uri: user?.avatar }}
                                className="w-[90%] h-[90%] rounded-lg"
                                resizeMode="cover"
                            />
                        </View>

                        <InfoBox
                            title={user?.username!!}
                            containerStyles="mt-5"
                            titleStyles="text-lg"
                        />

                        <View className="mt-5 flex-row">
                            <InfoBox
                                title={posts.length.toString() || "0"}
                                subtitle="Posts"
                                containerStyles="mr-5"
                                titleStyles="text-xl"
                            />

                            <InfoBox
                                title={followersCount.toString()}
                                subtitle="Followers"
                                titleStyles="text-xl"
                            />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Videos Found"
                        subtitle="No videos found for this search query"
                    />
                )}
            />
        </SafeAreaView>
    );
}
