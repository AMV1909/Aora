import { Text, ScrollView, TouchableOpacity, Image, Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { CustomButton, FormField } from "../../components";
import { icons } from "../../constants";
import { CreateForm } from "../../types.d";
import { createVideo } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

export default function Create() {
    const { user } = useGlobalContext();
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState<CreateForm>({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
    });

    const openPicker = async (selecType: "video" | "image") => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:
                selecType === "image"
                    ? ImagePicker.MediaTypeOptions.Images
                    : ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            if (selecType === "image") {
                setForm({ ...form, thumbnail: result.assets[0] });
            }

            if (selecType === "video") {
                setForm({ ...form, video: result.assets[0] });
            }
        }
    };

    const submit = async () => {
        const { title, video, thumbnail, prompt } = form;

        if (!title || !video || !thumbnail || !prompt) {
            return Alert.alert("Pleas fill in all the fields");
        }

        setUploading(true);

        try {
            await createVideo(form, user?.$id!!);

            Alert.alert("Succes", "Post uploaded succesfully");

            router.push("/home");
        } catch (err: any) {
            Alert.alert("Error", err.message);
        }

        setUploading(false);
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView className="px-4 mt-6">
                <Text className="text-2xl text-white font-psemibold">
                    Upload Video
                </Text>

                <FormField
                    title="Video Title"
                    value={form.title}
                    placeholder="Give your video a catch title..."
                    onChange={(e) => setForm({ ...form, title: e })}
                    otherStyles="mt-10"
                />

                <View className="mt-7 space-y-2">
                    <Text className="text-base text-gray-100 font-pmedium">
                        Upload Video
                    </Text>

                    <TouchableOpacity onPress={() => openPicker("video")}>
                        {form.video ? (
                            <Video
                                source={{ uri: form.video.uri }}
                                className="w-full h-64 rounded-2xl"
                                resizeMode={ResizeMode.COVER}
                            />
                        ) : (
                            <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                                    <Image
                                        source={icons.upload}
                                        resizeMode="contain"
                                        className="w-1/2 h-1/2"
                                    />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="mt-7 space-y-2">
                    <Text className="text-base text-gray-100 font-pmedium">
                        Thumbnail Image
                    </Text>

                    <TouchableOpacity onPress={() => openPicker("image")}>
                        {form.thumbnail ? (
                            <Image
                                source={{ uri: form.thumbnail.uri }}
                                resizeMode="cover"
                                className="w-full h-64 rounded-2xl"
                            />
                        ) : (
                            <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                                <Image
                                    source={icons.upload}
                                    resizeMode="contain"
                                    className="w-5 h-5"
                                />

                                <Text className="text-sm text-gray-100 font-pmedium">
                                    Choose a file
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <FormField
                    title="AI Prompt"
                    value={form.prompt}
                    placeholder="The prompt you used to create this video"
                    onChange={(e) => setForm({ ...form, prompt: e })}
                    otherStyles="mt-7"
                />

                <CustomButton
                    title="Submit & Publish"
                    handlePress={submit}
                    containerStyles="my-7"
                    isLoading={uploading}
                />
            </ScrollView>
        </SafeAreaView>
    );
}
