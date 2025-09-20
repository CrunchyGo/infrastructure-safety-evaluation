import { AxiosResponse } from 'axios';
import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

export type MutationOptionsType = Omit<
  UseMutationOptions<AxiosResponse<any, any>, unknown, any>,
  'mutationFn'
>;

export type QueryOptionsType = Omit<
  UseQueryOptions<AxiosResponse<any, any>, unknown, AxiosResponse<any, any>>,
  'initialData'
>;

export type QueryOptionsGenricType<T, E> = UseQueryOptions<T, E>;
export type MuatationOptionsGenricType<T, E> = UseMutationOptions<T, E>;