import { POST } from "@/lib/AxiosClient";

export const Login = (data: any) =>
    POST({
        url: `api/login`,
        data,
    });

export const submitInspection = (data: any) =>
    POST({
        url: `api/school/inspection`,
        data
    });

export const registerUser = (data: any) =>
    POST({
        url: `api/register`,
        data,
    });