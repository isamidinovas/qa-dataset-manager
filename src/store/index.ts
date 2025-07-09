import { configureStore } from "@reduxjs/toolkit";
import dialogueReducer from "./slices/dialogueSlice";
import conversationsReducer from "./slices/conversationsSlice";

export const store = configureStore({
  reducer: {
    dialogue: dialogueReducer,
    conversations: conversationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "dialogue/fetchDialogues/pending",
          "dialogue/fetchDialogues/fulfilled",
          "dialogue/fetchDialogues/rejected",
          "conversations/fetchByDataset/pending",
          "conversations/fetchByDataset/fulfilled",
          "conversations/fetchByDataset/rejected",
          "conversations/update/pending",
          "conversations/update/fulfilled",
          "conversations/update/rejected",
          "conversations/delete/pending",
          "conversations/delete/fulfilled",
          "conversations/delete/rejected",
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
