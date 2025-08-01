// features/conversations/conversationsSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Conversation } from "@/types/dialogue";
import { apiService } from "@/lib/api";
import axios from "axios";

interface ConversationsState {
  items: Conversation[];
  filteredItems: Conversation[];
  loading: boolean;
  error: string | null;
}

const initialState: ConversationsState = {
  items: [],
  filteredItems: [],
  loading: false,
  error: null,
};

export const fetchConversationsByDataset = createAsyncThunk<
  Conversation[],
  { datasetId: number; search?: string }
>("conversations/fetchByDataset", async ({ datasetId, search }, thunkAPI) => {
  try {
    const response = await apiService.getConversationsByDataset(
      datasetId.toString(),
      {
        search,
      }
    );
    return response;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error loading conversations";
    return thunkAPI.rejectWithValue(errorMessage);
  }
});
// без search
// export const fetchFilteredConversationsByDataset = createAsyncThunk(
//   "conversations/fetchFilteredByDataset",
//   async (dataset_id: number) => {
//     const response = await axios.get(
//       `http://localhost:5005/export-conversations-with-russian/?dataset_id=${dataset_id}`
//     );
//     return response.data.conversations; // возвращаем массив conversations
//   }
// );
export const fetchFilteredConversationsByDataset = createAsyncThunk(
  "conversations/fetchFilteredByDataset",
  async ({ dataset_id, search }: { dataset_id: number; search?: string }) => {
    const params = new URLSearchParams({ dataset_id: String(dataset_id) });
    if (search) params.append("search", search);

    const response = await axios.get(
      `http://localhost:5005/export-conversations-with-russian/?${params.toString()}`
    );
    return response.data.conversations;
  }
);
export const updateConversation = createAsyncThunk<
  Conversation,
  { id: number; user: string; assistant: string }
>("conversations/update", async ({ id, user, assistant }, thunkAPI) => {
  try {
    const response = await apiService.updateConversation(id, {
      user,
      assistant,
    });
    return response;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error updating conversation";
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const deleteConversation = createAsyncThunk<number, { id: number }>(
  "conversations/delete",
  async ({ id }, thunkAPI) => {
    try {
      await apiService.deleteConversation(id);
      return id;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error deleting conversation";
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversationsByDataset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationsByDataset.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        console.log("Redux: conversations loaded:", action.payload);
      })
      .addCase(fetchConversationsByDataset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Ошибка загрузки";
      })

      .addCase(fetchFilteredConversationsByDataset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFilteredConversationsByDataset.fulfilled,
        (state, action) => {
          state.filteredItems = action.payload; // ✅ сохраняем фильтрованные данные
          state.loading = false;
        }
      )
      .addCase(
        fetchFilteredConversationsByDataset.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.error.message || "Ошибка при загрузке фильтрованных данных";
        }
      )
      .addCase(updateConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateConversation.fulfilled, (state, action) => {
        state.loading = false;
        // Обновляем conversation в списке
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        console.log("Redux: conversation updated:", action.payload);
      })
      .addCase(updateConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Ошибка обновления";
      })
      .addCase(deleteConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.loading = false;
        // Удаляем conversation из списка
        state.items = state.items.filter((item) => item.id !== action.payload);
        console.log("Redux: conversation deleted:", action.payload);
      })
      .addCase(deleteConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Ошибка удаления";
      });
  },
});

export default conversationsSlice.reducer;
