import axios from 'axios';

import api from '../axios/AxiosInstance';

import type { AuthResponse } from '../../types/auth/AuthResponse';
import type { AuthApiResponse } from '../../types/auth/AuthApiResponse';
import type { LoginRequest } from '../../types/auth/LoginRequest';
import type { RegisterRequest } from '../../types/auth/RegisterRequest';
import type { IAuthApiService } from './IAuthApiService';

function errorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
}

export const authApi: IAuthApiService = {
  async login(data: LoginRequest): Promise<AuthApiResponse> {
    try {
      const response = await api.post<AuthResponse>(
        '/auth/login',
        data
      );

      return {
        success: true,
        message: 'Uspešna prijava.',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: errorMessage(
          error,
          'Pogrešan email ili lozinka.'
        ),
      };
    }
  },

  async register(data: RegisterRequest): Promise<AuthApiResponse> {
    try {
      const response = await api.post<AuthResponse>(
        '/auth/register',
        data
      );

      return {
        success: true,
        message: 'Uspešna registracija.',
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: errorMessage(
          error,
          'Greška pri registraciji.'
        ),
      };
    }
  },
};