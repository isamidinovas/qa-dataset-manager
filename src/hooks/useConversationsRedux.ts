import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchConversationsByDataset } from "@/store/slices/conversationsSlice";
import { Conversation } from "@/types/dialogue";

export const useConversationsRedux = () => {
  const dispatch = useAppDispatch();
  const {
    items: conversations,
    loading,
    error,
  } = useAppSelector((state) => state.conversations);

  const fetchConversations = (datasetId: number, search?: string) => {
    dispatch(fetchConversationsByDataset({ datasetId, search }));
  };

  const updateConversation = (
    id: number,
    updatedConversation: Partial<Conversation>
  ) => {
    // Здесь можно добавить логику обновления через Redux thunk
    console.log("Update conversation:", id, updatedConversation);
  };

  const deleteConversation = (id: number) => {
    // Здесь можно добавить логику удаления через Redux thunk
    console.log("Delete conversation:", id);
  };

  return {
    conversations,
    loading,
    error,
    fetchConversations,
    updateConversation,
    deleteConversation,
  };
};
