import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WordRecord {
  word: string;
  source: string;
  definition: string;
  examples: string;
}

export interface DictionaryState {
  oruscha: WordRecord[];
  kyrgyzcha: WordRecord[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  oruscha_total?: number;
  kyrgyzcha_total?: number;
}

const initialState: DictionaryState = {
  oruscha: [],
  kyrgyzcha: [],
  loading: false,
  error: null,
  searchQuery: "",
  oruscha_total: 0,
  kyrgyzcha_total: 0,
};

export const fetchUniqueWords = createAsyncThunk(
  "dictionary/fetchUniqueWords",
  async (params: { search?: string; limit?: number; offset?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.offset) query.append("offset", params.offset.toString());
    const url =
      "http://localhost:5005/unique-words" +
      (query.toString() ? `?${query.toString()}` : "");
    const res = await fetch(url, {
      method: "GET",
      headers: { "Cache-Control": "no-cache" },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Server error:", errorText);
      throw new Error("Ошибка загрузки словаря");
    }

    return await res.json();
  }
);

const dictionarySlice = createSlice({
  name: "dictionary",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUniqueWords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUniqueWords.fulfilled, (state, action) => {
        state.loading = false;
        state.oruscha = action.payload.oruscha_kyrgyzcha_only || [];
        state.kyrgyzcha = action.payload.kyrgyzcha_oruscha_only || [];
        state.oruscha_total = action.payload.oruscha_total || 0;
        state.kyrgyzcha_total = action.payload.kyrgyzcha_total || 0;
      })
      .addCase(fetchUniqueWords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки";
      });
  },
});

export const { setSearchQuery } = dictionarySlice.actions;
export default dictionarySlice.reducer;
