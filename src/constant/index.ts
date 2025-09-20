import {
    MutationCache,
    QueryCache,
    QueryClientConfig,
} from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
export const IS_DEV_MODE = process.env['NODE_ENV'] === 'development';

export const QUERY_CONFIG: QueryClientConfig = {
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 1 * 60 * 1000,
            retry: false
        },
    },
    queryCache: new QueryCache({
        onError: (error: any) => {
            console.log('error', error);
            const errorMessage = Array.isArray(error?.response?.data?.message)
                ? error?.response?.data?.message[0]
                : error?.response?.data?.error;
            toast.error(errorMessage);
        },
    }),
    mutationCache: new MutationCache({
        onError: (error: any) => {
            console.log('error', error);
            const errorMessage = Array.isArray(error?.response?.data?.message)
                ? error?.response?.data?.message[0]
                : error?.response?.data?.error;
            toast.error(errorMessage);
        },
    }),
};

export const roomImageFields = [
    "interiorCeiling",
    "interiorFrontWall",
    "interiorRightWall",
    "interiorBackWall",
    "interiorLeftWall",
    "interiorFloor",
    "exteriorFrontWall",
    "exteriorRightWall",
    "exteriorLeftWall",
    "exteriorBackWall",
    "roof",
]