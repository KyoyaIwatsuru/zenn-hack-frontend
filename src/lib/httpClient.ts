import { ErrorHandler, AppError } from "./errorHandler";

// 判別可能なUnion型によるAPIレスポンス
export type ApiResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: AppError };

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

export class HttpClient {
  private baseUrl: string;
  private defaultTimeout: number;
  private defaultRetries: number;
  private defaultRetryDelay: number;

  constructor(
    baseUrl: string = "",
    timeout: number = 10000,
    retries: number = 2,
    retryDelay: number = 1000
  ) {
    this.baseUrl = baseUrl;
    this.defaultTimeout = timeout;
    this.defaultRetries = retries;
    this.defaultRetryDelay = retryDelay;
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      retryDelay = this.defaultRetryDelay,
      headers = {},
    } = config;

    const fullUrl = this.baseUrl + url;
    let lastError: AppError;

    for (let attempt = 0; attempt <= retries; attempt++) {
      // 各リトライで新しいAbortControllerを作成
      const controller = new AbortController();
      let timeoutId: NodeJS.Timeout | null = null;

      try {
        // タイムアウト設定
        timeoutId = setTimeout(() => controller.abort(), timeout);

        const requestOptions: RequestInit = {
          ...options,
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            ...headers,
            ...options.headers,
          },
        };

        const response = await fetch(fullUrl, requestOptions);

        // 成功時はタイムアウトをクリア
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        if (!response.ok) {
          const errorText = await response.text();
          const error = ErrorHandler.fromHttpError(
            new Error(errorText || response.statusText),
            response.status
          );

          if (!ErrorHandler.shouldRetry(error) || attempt === retries) {
            ErrorHandler.logError(error);
            return { success: false, error };
          }

          lastError = error;
        } else {
          const data = await response.json();
          return { success: true, data };
        }
      } catch (err) {
        // エラー時もタイムアウトをクリア
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        const error = ErrorHandler.fromFetchError(err);

        if (!ErrorHandler.shouldRetry(error) || attempt === retries) {
          ErrorHandler.logError(error);
          return { success: false, error };
        }

        lastError = error;
      }

      if (attempt < retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * (attempt + 1))
        );
      }
    }

    ErrorHandler.logError(lastError!);
    return { success: false, error: lastError! };
  }

  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: "GET" }, config);
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      url,
      {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      },
      config
    );
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      url,
      {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      },
      config
    );
  }
}

export const httpClient = new HttpClient();

// Backend API client for server-side API routes
export const backendClient = new HttpClient(
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
);
