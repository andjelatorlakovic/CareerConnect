import api from './axios';
import type{ AuthUser } from '../types/AuthUser';
import type{ LoginRequest } from '../types/LoginRequest';
import type{ RegisterRequest } from '../types/RegisterRequest';

export const login = async (
  data: LoginRequest
): Promise<AuthUser> => {
  const response = await api.post<AuthUser>(
    '/auth/login',
    data
  );

  return response.data;
};

export const register = async (
  data: RegisterRequest
): Promise<void> => {
  await api.post(
    '/auth/register',
    data
  );
};