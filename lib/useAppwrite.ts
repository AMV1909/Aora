import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Models } from "react-native-appwrite";

export const useAppwrite = <T extends Models.Document>(
    fn: () => Promise<T[]>
) => {
    const [data, setData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        await fn()
            .then((res) => setData(res))
            .catch((err) => Alert.alert("Error", err.message))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refetch = async () => await fetchData();

    return { data, isLoading, refetch };
};
