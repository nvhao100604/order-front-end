import { BASE_SERVER_URL, DEFAULT_TIMEOUT, RESPONSE_DELAY } from "@/config/constants";
import axios from "axios";

const api = axios.create({
    baseURL: BASE_SERVER_URL,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: DEFAULT_TIMEOUT
})

api.interceptors.request.use(config => {
    // const token = localStorage.getItem("access_token");
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    console.log(`API request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
},
    error => {
        console.error(`Request error: ${error}`)
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    async (response) => {
        await new Promise(resolve => setTimeout(resolve, response.config.responseDelay ?? RESPONSE_DELAY));
        console.log(`API response: ${response.status} ${response.config.url}`);
        return response;
    },
    error => {
        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
            console.log('Request timed out');
        }
        return Promise.reject(error);
    }
);



export default api