import { useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

import { EmptyState, SearchInput, PostCard } from "../../components";
import { searchPosts } from "../../lib/appwrite";
import { useAppwrite } from "../../lib/useAppwrite";
import { Post } from "../../types";

export default function Search() {
    const { query } = useLocalSearchParams();

    const { data: posts, refetch } = useAppwrite<Post>(() =>
        searchPosts(query as string)
    );

    useEffect(() => {
        refetch();
    }, [query]);

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
                        <Text className="font-pmedium text-sm text-gray-100">
                            Search results
                        </Text>

                        <Text className="text-2xl font-psemibold text-white">
                            {query}
                        </Text>

                        <View className="mt-6 mb-8">
                            <SearchInput initialQuery={query as string} />
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
