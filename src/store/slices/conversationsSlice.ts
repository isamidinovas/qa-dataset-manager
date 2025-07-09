// features/conversations/conversationsSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Conversation } from "@/types/dialogue";
import { apiService } from "@/lib/api";
import axios from "axios";

interface ConversationsState {
  items: Conversation[];
  loading: boolean;
  error: string | null;
}

const initialState: ConversationsState = {
  items: [],
  loading: false,
  error: null,
};

// export const fetchConversationsByDataset = createAsyncThunk<
//   Conversation[],
//   { datasetId: string; search?: string }
// >(
//   "conversations/fetchConversationsByDataset",
//   async ({ datasetId, search }) => {
//     try {
//       const response = await apiService.getConversationsByDataset(datasetId, {
//         search,
//       });
//       return response.data.data; // Extract the conversations array from the nested response
//     } catch (error) {
//       throw new Error(error instanceof Error ? error.message : "Unknown error");
//     }
//   }
// );
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
      });
  },
});

export default conversationsSlice.reducer;
