import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { DialogueFile, DialogueEntry } from "@/types/dialogue";
import { apiService } from "@/lib/api";

// Типы для API ответов
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Thunk для загрузки списка файлов
export const fetchFiles = createAsyncThunk(
  "dialogue/fetchFiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getFiles();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

// Thunk для загрузки диалогов с пагинацией и поиском
export const fetchDialogues = createAsyncThunk(
  "dialogue/fetchDialogues",
  async (
    {
      fileId,
      page = 1,
      limit = 10,
      search = "",
    }: {
      fileId: string;
      page?: number;
      limit?: number;
      search?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.getDialogues(fileId, {
        page,
        limit,
        search,
      });
      return {
        dialogues: response.data.data,
        pagination: {
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
        },
        fileId,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

// Thunk для обновления диалога
export const updateDialogue = createAsyncThunk(
  "dialogue/updateDialogue",
  async (
    {
      fileId,
      dialogueIndex,
      updatedDialogue,
    }: {
      fileId: string;
      dialogueIndex: number;
      updatedDialogue: DialogueEntry;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.updateDialogue(
        fileId,
        dialogueIndex,
        updatedDialogue
      );
      return {
        fileId,
        dialogueIndex,
        dialogue: response.data,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

// Thunk для удаления диалога
export const deleteDialogue = createAsyncThunk(
  "dialogue/deleteDialogue",
  async (
    { fileId, dialogueIndex }: { fileId: string; dialogueIndex: number },
    { rejectWithValue }
  ) => {
    try {
      await apiService.deleteDialogue(fileId, dialogueIndex);
      return { fileId, dialogueIndex };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

// Thunk для создания нового диалога
export const createDialogue = createAsyncThunk(
  "dialogue/createDialogue",
  async (
    { fileId, dialogue }: { fileId: string; dialogue: DialogueEntry },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.createDialogue(fileId, dialogue);
      return {
        fileId,
        dialogue: response.data,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

// Интерфейс состояния
interface DialogueState {
  files: DialogueFile[];
  currentFile: DialogueFile | null;
  dialogues: DialogueEntry[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  searchQuery: string;
  loading: boolean;
  error: string | null;
  filesLoading: boolean;
  filesError: string | null;
}

// Начальное состояние
const initialState: DialogueState = {
  files: [],
  currentFile: null,
  dialogues: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  searchQuery: "",
  loading: false,
  error: null,
  filesLoading: false,
  filesError: null,
};

// Создание slice
const dialogueSlice = createSlice({
  name: "dialogue",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setCurrentFile: (state, action: PayloadAction<DialogueFile | null>) => {
      state.currentFile = action.payload;
      // Сброс диалогов при смене файла
      state.dialogues = [];
      state.pagination = {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
      state.searchQuery = "";
    },
    clearError: (state) => {
      state.error = null;
      state.filesError = null;
    },
  },
  extraReducers: (builder) => {
    // Обработка fetchFiles
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.filesLoading = true;
        state.filesError = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.filesLoading = false;
        state.files = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.filesLoading = false;
        state.filesError = action.payload as string;
      });

    // Обработка fetchDialogues
    builder
      .addCase(fetchDialogues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDialogues.fulfilled, (state, action) => {
        state.loading = false;
        state.dialogues = action.payload.dialogues;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDialogues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Обработка updateDialogue
    builder
      .addCase(updateDialogue.fulfilled, (state, action) => {
        const { fileId, dialogueIndex, dialogue } = action.payload;
        if (state.currentFile?.id.toString() === fileId) {
          state.dialogues[dialogueIndex] = dialogue;
        }
      })
      .addCase(updateDialogue.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Обработка deleteDialogue
    builder
      .addCase(deleteDialogue.fulfilled, (state, action) => {
        const { fileId, dialogueIndex } = action.payload;
        if (state.currentFile?.id.toString() === fileId) {
          state.dialogues.splice(dialogueIndex, 1);
          state.pagination.total -= 1;
          // Пересчитываем totalPages
          state.pagination.totalPages = Math.ceil(
            state.pagination.total / state.pagination.limit
          );
        }
      })
      .addCase(deleteDialogue.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Обработка createDialogue
    builder
      .addCase(createDialogue.fulfilled, (state, action) => {
        const { fileId, dialogue } = action.payload;
        if (state.currentFile?.id.toString() === fileId) {
          state.dialogues.push(dialogue);
          state.pagination.total += 1;
          // Пересчитываем totalPages
          state.pagination.totalPages = Math.ceil(
            state.pagination.total / state.pagination.limit
          );
        }
      })
      .addCase(createDialogue.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setSearchQuery, setCurrentPage, setCurrentFile, clearError } =
  dialogueSlice.actions;
export default dialogueSlice.reducer;
