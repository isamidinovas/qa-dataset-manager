import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchConversationsByDataset } from "@/store/slices/conversationsSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const ConversationsTest = () => {
  const dispatch = useAppDispatch();
  const {
    items: conversations,
    loading,
    error,
  } = useAppSelector((state) => state.conversations);

  const handleFetchConversations = () => {
    dispatch(fetchConversationsByDataset(1)); // Тестовый dataset ID
  };

  useEffect(() => {
    // Автоматически загружаем conversations при монтировании
    handleFetchConversations();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Conversations Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleFetchConversations} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Загрузка...
            </>
          ) : (
            "Загрузить Conversations"
          )}
        </Button>

        {error && <div className="text-red-500 text-sm">Ошибка: {error}</div>}

        {conversations.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">
              Conversations ({conversations.length}):
            </h3>
            <div className="space-y-2">
              {conversations.slice(0, 3).map((conversation) => (
                <div
                  key={conversation.id}
                  className="p-2 bg-gray-50 rounded text-sm"
                >
                  <div className="font-medium">ID: {conversation.id}</div>
                  <div className="text-gray-600">
                    User: {conversation.user.substring(0, 50)}...
                  </div>
                  <div className="text-gray-600">
                    Assistant: {conversation.assistant.substring(0, 50)}...
                  </div>
                  <div className="text-gray-500 text-xs">
                    Dataset: {conversation.dataset_id}
                  </div>
                </div>
              ))}
              {conversations.length > 3 && (
                <div className="text-gray-500 text-sm">
                  ... и еще {conversations.length - 3} conversations
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversationsTest;
