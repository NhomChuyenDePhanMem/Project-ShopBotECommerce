import { getErrorMessage } from './errors';

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

/** Đổi key → mọi client đăng nhập lại một lần (migration localStorage). */
export const USER_TOKEN_KEY = 'shopbot-auth-token';

const MAX_ERROR_SNIPPET_LENGTH = 280;

export class HttpApiError extends Error {
  readonly statusCode: number;
  readonly requestPath: string;

  constructor(message: string, statusCode: number, requestPath: string) {
    super(message);
    this.name = 'HttpApiError';
    this.statusCode = statusCode;
    this.requestPath = requestPath;
  }
}

function tryParseJsonObject(raw: string): Record<string, unknown> | null {
  try {
    const value = JSON.parse(raw) as unknown;
    return value !== null && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

function messageFromNestStyleBody(body: Record<string, unknown>): string | null {
  if (typeof body.message === 'string' && body.message.trim()) {
    return body.message.trim();
  }
  if (Array.isArray(body.message) && body.message.length > 0) {
    return body.message.map(String).filter(Boolean).join('; ');
  }
  if (typeof body.error === 'string' && body.error.trim()) {
    return body.error.trim();
  }
  return null;
}

async function readFailedResponseMessage(response: Response): Promise<string> {
  const raw = (await response.text()).trim();
  if (!raw) {
    return `Lỗi HTTP ${response.status}`;
  }

  const body = tryParseJsonObject(raw);
  if (body) {
    const fromFields = messageFromNestStyleBody(body);
    if (fromFields) return fromFields;
  }

  if (raw.length > MAX_ERROR_SNIPPET_LENGTH) {
    return `${raw.slice(0, MAX_ERROR_SNIPPET_LENGTH)}…`;
  }
  return raw;
}

export async function api<T>(
  path: string,
  init?: RequestInit,
  token?: string,
): Promise<T> {
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has('Content-Type') && init?.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  } catch (cause) {
    const message =
      cause instanceof TypeError
        ? 'Không kết nối được API. Hãy chạy backend và kiểm tra VITE_API_BASE_URL.'
        : getErrorMessage(cause);
    throw new Error(message, { cause: cause instanceof Error ? cause : undefined });
  }

  if (!response.ok) {
    const message = await readFailedResponseMessage(response);
    throw new HttpApiError(message, response.status, path);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new HttpApiError(
      'Phản hồi không phải JSON hợp lệ',
      response.status,
      path,
    );
  }
}
