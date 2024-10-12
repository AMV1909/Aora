import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardTypeOptions,
} from "react-native";

import { icons } from "../constants";

interface Props {
    title?: string;
    value: string;
    placeholder: string;
    onChange: (e: string) => void;
    otherStyles?: string;
    search?: boolean;
    handleSubmit?: () => void;
    keyboardType?: KeyboardTypeOptions;
}

export function FormField({
    title,
    value,
    placeholder,
    onChange,
    otherStyles,
    search,
    handleSubmit,
    ...props
}: Props) {
    const [showPassword, setShowPassowrd] = useState(false);

    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className="text-base text-gray-100 font-pmedium">
                {title}
            </Text>

            <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
                <TextInput
                    className="flex-1 text-white font-psemibold text-base"
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#7b7b8b"
                    onChangeText={onChange}
                    secureTextEntry={title === "Password" && !showPassword}
                    onSubmitEditing={handleSubmit}
                    {...props}
                />

                {title === "Password" && (
                    <TouchableOpacity
                        onPress={() => setShowPassowrd(!showPassword)}
                    >
                        <Image
                            source={showPassword ? icons.eyeHide : icons.eye}
                            className="w-6 h-6"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                )}

                {search && (
                    <TouchableOpacity>
                        <Image
                            source={icons.search}
                            className="w-6 h-6"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
