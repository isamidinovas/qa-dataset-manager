import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchConversationsByDataset,
  updateConversation,
  deleteConversation,
} from "@/store/slices/conversationsSlice";
import { Conversation } from "@/types/dialogue";
import { useCallback, useEffect, useState } from "react";

export const useConversationsRedux = () => {
  const dispatch = useAppDispatch();
  const {
    items: conversations,
    loading,
    error,
  } = useAppSelector((state) => state.conversations);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms задержка

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchConversations = useCallback(
    (datasetId: number, search?: string) => {
      dispatch(fetchConversationsByDataset({ datasetId, search }));
    },
    [dispatch]
  );

  const updateConversationHandler = useCallback(
    (id: number, updatedConversation: Partial<Conversation>) => {
      if (updatedConversation.user && updatedConversation.assistant) {
        dispatch(
          updateConversation({
            id,
            user: updatedConversation.user,
            assistant: updatedConversation.assistant,
          })
        );
      }
    },
    [dispatch]
  );

  const deleteConversationHandler = useCallback(
    (id: number) => {
      dispatch(deleteConversation({ id }));
    },
    [dispatch]
  );

  return {
    conversations,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    fetchConversations,
    updateConversation: updateConversationHandler,
    deleteConversation: deleteConversationHandler,
  };
};
