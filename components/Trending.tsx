import { useRef, useState } from "react";
import {
    FlatList,
    TouchableOpacity,
    ImageBackground,
    Image,
    ViewToken,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import * as Animatable from "react-native-animatable";

import { Post } from "../types";
import { zoomIn, zoomOut } from "../lib/animations";
import { icons } from "../constants";

interface TrendingItemProps {
    activeItem: Post;
    item: Post;
}

const TrendingItem = ({ activeItem, item }: TrendingItemProps) => {
    const [play, setPlay] = useState(false);

    return (
        <Animatable.View
            className="mr-5"
            animation={activeItem.$id === item.$id ? zoomIn : zoomOut}
            duration={500}
        >
            {play ? (
                <Video
                    source={{ uri: item.video }}
                    className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
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
                    className="relative justify-center items-center"
                    activeOpacity={0.7}
                    onPress={() => setPlay(true)}
                >
                    <ImageBackground
                        source={{ uri: item.thumbnail }}
                        className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
                        resizeMode="cover"
                    />

                    <Image
                        source={icons.play}
                        className="w-12 h-12 absolute"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            )}
        </Animatable.View>
    );
};

export function Trending({ posts }: { posts: Post[] }) {
    const [activeItem, setActiveItem] = useState(posts[0]);

    const viewableItemsChange = ({
        viewableItems,
    }: {
        viewableItems: Array<ViewToken>;
    }) => {
        if (viewableItems.length > 0) {
            setActiveItem(viewableItems[0].item);
        }
    };

    return (
        <FlatList
            data={posts}
            keyExtractor={(i) => i.$id.toString()}
            renderItem={({ item }) => (
                <TrendingItem activeItem={activeItem} item={item} />
            )}
            onViewableItemsChanged={viewableItemsChange}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 70,
            }}
            contentOffset={{ x: 170, y: 0 }}
            horizontal
        />
    );
}
