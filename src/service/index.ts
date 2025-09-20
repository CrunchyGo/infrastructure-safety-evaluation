import { AxiosResponse } from "axios";
import { useMutation } from "@tanstack/react-query";
import * as API from "./api";
import { MutationOptionsType } from "@/types/react-query";

export const useLogin = (options?: MutationOptionsType) =>
  useMutation<AxiosResponse, Error, any>({
    mutationFn: API.Login,
    ...options,
  });

export const useSubmitInspection = (options?: MutationOptionsType) =>
  useMutation<AxiosResponse, Error, any>({
    mutationFn: API.submitInspection,
    ...options,
  });

export const useRegisterUser = (options?: MutationOptionsType) =>
  useMutation<AxiosResponse, Error, any>({
    mutationFn: API.registerUser,
    ...options,
  });
