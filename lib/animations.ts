import { CustomAnimation } from "react-native-animatable";

export const zoomIn: CustomAnimation = {
    0: {
        transform: [{ scale: 0.9 }],
    },
    1: {
        transform: [{ scale: 1.1 }],
    },
};

export const zoomOut: CustomAnimation = {
    0: {
        transform: [{ scale: 1.1 }],
    },
    1: {
        transform: [{ scale: 0.9 }],
    },
};
