import { useCallback, useState } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";

import { EmptyState, FormField, PostCard } from "../../components";
import { useAppwrite } from "../../lib/useAppwrite";
import { getLikedVideos } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

export default function Bookmark() {
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");

    const { user } = useGlobalContext();
    const { data: posts, refetch } = useAppwrite(() =>
        getLikedVideos(user?.$id!!, search)
    );

    const onRefresh = async () => {
        setSearch("");
        setRefreshing(true);

        await refetch();

        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [])
    );

    console.log(refreshing);

    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={posts}
                keyExtractor={(i) => i.$id.toString()}
                renderItem={({ item }) => (
                    <PostCard post={item} fetch={refetch} />
                )}
                ListHeaderComponent={() => (
                    <View className="my-6 px-4 space-y-6">
                        <Text className="text-2xl text-white font-psemibold">
                            Liked Videos
                        </Text>

                        <FormField
                            value={search}
                            placeholder="Search your liked videos"
                            onChange={(e) => setSearch(e)}
                            search
                        />
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Videos Found"
                        subtitle="Go and like some videos"
                        hideButton
                    />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </SafeAreaView>
    );
}
