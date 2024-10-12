import { View, TextInput, TouchableOpacity, Image } from "react-native";
import { router, usePathname } from "expo-router";
import { useState } from "react";

import { icons } from "../constants";

interface Props {
    initialQuery?: string;
}

export function SearchInput({ initialQuery }: Props) {
    const [query, setQuery] = useState(initialQuery || "");
    const pahtname = usePathname();

    const handleSubmit = () => {
        if (!query) return;

        if (pahtname.startsWith("/search")) router.setParams({ query });
        else router.push(`/search/${query}`);
    };

    return (
        <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
            <TextInput
                className="text-base mt-0.5 text-white flex-1 font-pregular"
                value={query}
                placeholder="Search for a video topic"
                placeholderTextColor="#cdcde0"
                onChangeText={(e) => setQuery(e)}
                onSubmitEditing={handleSubmit}
            />

            <TouchableOpacity onPress={handleSubmit}>
                <Image
                    source={icons.search}
                    className="w-5 h-5"
                    resizeMode="contain"
                />
            </TouchableOpacity>
        </View>
    );
}
