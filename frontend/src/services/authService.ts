import { api } from '../lib/apiClient';

export type LoginResponse = { accessToken?: string; access_token?: string };

export function accessTokenFromLogin(res: LoginResponse): string | undefined {
  return res.accessToken ?? res.access_token;
}

export function requireLoginAccessToken(res: LoginResponse): string {
  const token = accessTokenFromLogin(res)?.trim();
  if (!token) {
    throw new Error('Phản hồi đăng nhập không chứa access token.');
  }
  return token;
}

export type User = {
  id: number;
  username: string;
  fullName: string;
  roleId?: number;
  role?: string;
  phone?: string | null;
};
export type Role = { id: number; name: string };

export function login(username: string, password: string) {
  return api<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function listUsers(token: string) {
  return api<User[]>('/users', undefined, token);
}

export function listRoles(token: string) {
  return api<Role[]>('/users/roles', undefined, token);
}

export function getMe(token: string) {
  return api<User>('/users/me', undefined, token);
}

export function createUser(
  token: string,
  payload: { username: string; password: string; fullName: string; roleId: number },
) {
  return api('/users', { method: 'POST', body: JSON.stringify(payload) }, token);
}

export function deleteUser(token: string, userId: number) {
  return api(`/users/${userId}`, { method: 'DELETE' }, token);
}
