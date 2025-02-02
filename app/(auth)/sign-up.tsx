import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Image, Alert } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";

import { images } from "../../constants";
import { FormField, CustomButton } from "../../components";
import { createUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

export default function SignUp() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const { setUser, setIsLoggedIn } = useGlobalContext();

    const handleSubmit = async () => {
        if (!form.username || !form.email || !form.password) {
            Alert.alert("Error", "Please fill in all the fields");
        }

        setIsSubmitting(true);

        try {
            const result = await createUser(
                form.email,
                form.password,
                form.username
            );

            setUser(result);
            setIsLoggedIn(true);

            router.replace("/home");
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert("Error", err.message);
            } else {
                Alert.alert("Error", "An unknown error occurred.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View className="w-full justify-center min-h-[85vh] px-4 my-6">
                    <Image
                        source={images.logo}
                        resizeMode="contain"
                        className="w-[115px] h-[35px]"
                    />

                    <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
                        Sign up to Aora
                    </Text>

                    <FormField
                        title="Username"
                        placeholder="Username"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e })}
                        otherStyles="mt-10"
                    />

                    <FormField
                        title="Email"
                        placeholder="Emaill address"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                    />

                    <FormField
                        title="Password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e })}
                        otherStyles="mt-7"
                    />

                    <CustomButton
                        title="Sign Up"
                        handlePress={handleSubmit}
                        containerStyles="mt-7"
                        isLoading={isSubmitting}
                    />

                    <View className="justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Have an account already?
                        </Text>

                        <Link
                            href="/sign-in"
                            className="text-lg text-secondary font-psemibold"
                        >
                            Sign In
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
