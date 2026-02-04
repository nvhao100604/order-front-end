const envCheck = (key: string, fallback_value: string): string => {
    const value = process.env[key]
    if (!value) {
        if (fallback_value) {
            console.warn(`⚠️ [ENV WARNING] Missing "${key}". Using: "${fallback_value}"`)
            return fallback_value
        } else {
            const message = `❌ [ENV ERROR] Missing required environment variable: "${key}"`;
            console.error(message);

            return "";
        }
    }
    return value
}

export const BASE_SERVER_URL = envCheck(
    "NEXT_PUBLIC_API_BASE_URL",
    "http://localhost:8080/api/v1/"
)

// Timeout: Cần chuyển từ string sang number
export const DEFAULT_TIMEOUT = Number(envCheck(
    "NEXT_PUBLIC_API_TIMEOUT",
    "8000"
))

// Delay giả lập
export const RESPONSE_DELAY = Number(envCheck(
    "NEXT_PUBLIC_RESPONSE_DELAY",
    "2000"
))

// Thời gian refresh token/data
export const REFRESH_INTERVAL = Number(envCheck(
    "NEXT_PUBLIC_REFRESH_INTERVAL",
    "60000"
))

// Query Keys (cho SWR hoặc React Query)
export const DISH_KEY = "dishes";
export const CATEGORY_KEY = "categories";