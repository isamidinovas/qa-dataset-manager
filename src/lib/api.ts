import axios from "axios";
import { DialogueEntry, DialogueFile, Conversation } from "@/types/dialogue";

// API Configuration
const API_BASE_URL = "";

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging and error handling
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("API Response Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Service functions
export const apiService = {
  // Files
  getFiles: async () => {
    const response = await apiClient.get<ApiResponse<DialogueFile[]>>("/files");
    return response.data;
  },

  // Dialogues
  getDialogues: async (
    fileId: string,
    params: {
      page?: number;
      limit?: number;
      search?: string;
    } = {}
  ) => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<DialogueEntry>>
    >(`/files/${fileId}/dialogues`, { params });
    return response.data;
  },

  createDialogue: async (fileId: string, dialogue: DialogueEntry) => {
    const response = await apiClient.post<ApiResponse<DialogueEntry>>(
      `/files/${fileId}/dialogues`,
      dialogue
    );
    return response.data;
  },

  updateDialogue: async (
    fileId: string,
    dialogueIndex: number,
    dialogue: DialogueEntry
  ) => {
    const response = await apiClient.put<ApiResponse<DialogueEntry>>(
      `/files/${fileId}/dialogues/${dialogueIndex}`,
      dialogue
    );
    return response.data;
  },

  deleteDialogue: async (fileId: string, dialogueIndex: number) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/files/${fileId}/dialogues/${dialogueIndex}`
    );
    return response.data;
  },

  // Conversations
  getConversationsByDataset: async (
    datasetId: string,
    params: {
      page?: number;
      limit?: number;
      search?: string;
    } = {}
  ) => {
    const response = await apiClient.get<Conversation[]>(`/conversations`, {
      params: {
        ...params,
        dataset_id: datasetId,
      },
    });
    console.log("API Response:", response.data);
    return response.data;
  },
};

export default apiService;
