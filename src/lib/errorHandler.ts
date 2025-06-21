export enum ErrorType {
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  CONTENT_POLICY_ERROR = "CONTENT_POLICY_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
  NOT_FOUND_ERROR = "NOT_FOUND_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface AppError {
  type: ErrorType;
  message: string;
  statusCode?: number;
  originalError?: unknown;
  timestamp: string;
}

export class ErrorHandler {
  static createError(
    type: ErrorType,
    message: string,
    statusCode?: number,
    originalError?: unknown
  ): AppError {
    return {
      type,
      message,
      statusCode,
      originalError,
      timestamp: new Date().toISOString(),
    };
  }

  static fromHttpError(error: unknown, statusCode?: number): AppError {
    if (error instanceof Error) {
      // Google AIのコンテンツポリシー違反エラーを検出
      if (
        error.message.includes("violated Google's Responsible AI practices") ||
        error.message.includes("All images were filtered out") ||
        error.message.includes("Try rephrasing the prompt")
      ) {
        return this.createError(
          ErrorType.CONTENT_POLICY_ERROR,
          "生成しようとした内容がコンテンツポリシーに違反している可能性があります。プロンプトを見直してください。",
          statusCode,
          error
        );
      }

      const type = this.getErrorTypeFromStatus(statusCode);
      return this.createError(type, error.message, statusCode, error);
    }

    return this.createError(
      ErrorType.UNKNOWN_ERROR,
      "不明なエラーが発生しました",
      statusCode,
      error
    );
  }

  static fromFetchError(error: unknown): AppError {
    if (error instanceof Error) {
      // AbortErrorの処理
      if (error.name === "AbortError" || error.message.includes("aborted")) {
        return this.createError(
          ErrorType.TIMEOUT_ERROR,
          "リクエストがタイムアウトしました。しばらく待ってから再度お試しください。",
          undefined,
          error
        );
      }

      // TypeError（ネットワークエラー）の処理
      if (error instanceof TypeError && error.message.includes("fetch")) {
        return this.createError(
          ErrorType.NETWORK_ERROR,
          "ネットワークエラーが発生しました。インターネット接続を確認してください。",
          undefined,
          error
        );
      }
    }

    return this.fromHttpError(error);
  }

  static getErrorTypeFromStatus(statusCode?: number): ErrorType {
    if (!statusCode) return ErrorType.UNKNOWN_ERROR;

    if (statusCode >= 400 && statusCode < 500) {
      switch (statusCode) {
        case 400:
          return ErrorType.VALIDATION_ERROR;
        case 401:
          return ErrorType.AUTHENTICATION_ERROR;
        case 403:
          return ErrorType.AUTHORIZATION_ERROR;
        case 404:
          return ErrorType.NOT_FOUND_ERROR;
        default:
          return ErrorType.VALIDATION_ERROR;
      }
    }

    if (statusCode >= 500) {
      return ErrorType.SERVER_ERROR;
    }

    return ErrorType.UNKNOWN_ERROR;
  }

  static getUserFriendlyMessage(error: AppError): string {
    switch (error.type) {
      case ErrorType.NETWORK_ERROR:
        return "ネットワークエラーが発生しました。インターネット接続を確認してください。";
      case ErrorType.TIMEOUT_ERROR:
        return "処理に時間がかかっています。しばらく待ってから再度お試しください。";
      case ErrorType.CONTENT_POLICY_ERROR:
        return "画像生成が制限されました。プロンプトの内容を変更して、より適切な表現で再度お試しください。";
      case ErrorType.VALIDATION_ERROR:
        return error.message || "入力内容に誤りがあります。";
      case ErrorType.AUTHENTICATION_ERROR:
        return "認証に失敗しました。再度ログインしてください。";
      case ErrorType.AUTHORIZATION_ERROR:
        return "この操作を実行する権限がありません。";
      case ErrorType.NOT_FOUND_ERROR:
        return "要求されたリソースが見つかりません。";
      case ErrorType.SERVER_ERROR:
        return "サーバーエラーが発生しました。しばらく待ってから再度お試しください。";
      default:
        return "不明なエラーが発生しました。";
    }
  }

  static logError(error: AppError): void {
    console.error("Application Error:", {
      type: error.type,
      message: error.message,
      statusCode: error.statusCode,
      timestamp: error.timestamp,
      originalError: error.originalError,
    });
  }

  static shouldRetry(error: AppError): boolean {
    return (
      error.type === ErrorType.NETWORK_ERROR ||
      error.type === ErrorType.TIMEOUT_ERROR ||
      error.type === ErrorType.SERVER_ERROR
    );
    // CONTENT_POLICY_ERROR はリトライしない（同じプロンプトでは同じ結果になるため）
  }

  static isTemporaryError(error: AppError): boolean {
    return (
      error.type === ErrorType.NETWORK_ERROR ||
      error.type === ErrorType.TIMEOUT_ERROR ||
      (error.type === ErrorType.SERVER_ERROR &&
        (error.statusCode === 502 || error.statusCode === 503))
    );
  }
}
