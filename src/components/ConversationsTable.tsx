import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, Trash2 } from "lucide-react";
import { Conversation } from "@/types/dialogue";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import MarkdownRenderer from "./MarkdownRenderer";

interface ConversationsTableProps {
  conversations: Conversation[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onUpdateConversation?: (
    id: number,
    updatedConversation: Partial<Conversation>
  ) => void;
  onDeleteConversation?: (id: number) => void;
}

const ConversationsTable = ({
  conversations = [],
  searchQuery,
  onSearchChange,
  onUpdateConversation,
  onDeleteConversation,
}: ConversationsTableProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editUser, setEditUser] = useState("");
  const [editAssistant, setEditAssistant] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] =
    useState<Conversation | null>(null);

  const totalPages = Math.ceil(conversations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentConversations = conversations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleEdit = (conv: Conversation) => {
    setEditingId(conv.id);
    setEditUser(conv.user);
    setEditAssistant(conv.assistant);
  };

  const handleSave = (id: number) => {
    onUpdateConversation?.(id, { user: editUser, assistant: editAssistant });
    setEditingId(null);
    setEditUser("");
    setEditAssistant("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditUser("");
    setEditAssistant("");
  };

  const handleDeleteClick = (conversation: Conversation) => {
    setConversationToDelete(conversation);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (conversationToDelete) {
      onDeleteConversation?.(conversationToDelete.id);
      setDeleteDialogOpen(false);
      setConversationToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setConversationToDelete(null);
  };
  console.log("conversations:", conversations);
  return (
    <Card className="w-full h-full flex flex-col">
      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full overflow-auto">
          {/* Десктопная версия */}
          <div className="hidden md:block">
            {currentConversations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Вопрос</TableHead>
                    <TableHead className="w-2/3">Ответ</TableHead>
                    <TableHead className="w-auto">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentConversations.map((conv) => (
                    <TableRow key={conv.id}>
                      <TableCell className="w-1/3">
                        {editingId === conv.id ? (
                          <Textarea
                            value={editUser}
                            onChange={(e) => setEditUser(e.target.value)}
                          />
                        ) : (
                          <div>
                            <MarkdownRenderer content={conv.user} />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="w-2/3">
                        {editingId === conv.id ? (
                          <Textarea
                            value={editAssistant}
                            onChange={(e) => setEditAssistant(e.target.value)}
                          />
                        ) : (
                          <div>
                            <MarkdownRenderer content={conv.assistant} />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === conv.id ? (
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => handleSave(conv.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Сохранить
                            </Button>
                            <Button
                              onClick={handleCancel}
                              size="sm"
                              variant="outline"
                              className="border-gray-300 hover:bg-gray-50"
                            >
                              Отмена
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => handleEdit(conv)}
                              size="sm"
                              variant="outline"
                              className="border-blue-300 hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteClick(conv)}
                              size="sm"
                              variant="outline"
                              className="border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? "Ничего не найдено" : "Нет записей"}
                </h3>
                <p className="text-gray-500 max-w-md">
                  {searchQuery
                    ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте изменить поисковый запрос.`
                    : "Пока нет добавленных записей. Добавьте первую запись, чтобы начать работу."}
                </p>
              </div>
            )}
          </div>

          {/* Мобильная версия */}
          <div className="md:hidden">
            {currentConversations.length > 0 ? (
              <div className="space-y-4 p-4">
                {currentConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="bg-white rounded-lg border p-4 space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">
                          Вопрос:
                        </span>
                        {editingId === conv.id ? (
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => handleSave(conv.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Сохранить
                            </Button>
                            <Button
                              onClick={handleCancel}
                              size="sm"
                              variant="outline"
                              className="border-gray-300 hover:bg-gray-50"
                            >
                              Отмена
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => handleEdit(conv)}
                              size="sm"
                              variant="outline"
                              className="border-blue-300 hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteClick(conv)}
                              size="sm"
                              variant="outline"
                              className="border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      {editingId === conv.id ? (
                        <Textarea
                          value={editUser}
                          onChange={(e) => setEditUser(e.target.value)}
                          className="w-full"
                          rows={3}
                        />
                      ) : (
                        <div className="text-gray-900 break-words">
                          <MarkdownRenderer content={conv.user} />
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-500 block mb-2">
                        Ответ:
                      </span>
                      {editingId === conv.id ? (
                        <Textarea
                          value={editAssistant}
                          onChange={(e) => setEditAssistant(e.target.value)}
                          className="w-full"
                          rows={3}
                        />
                      ) : (
                        <div className="text-gray-900 break-words">
                          <MarkdownRenderer content={conv.assistant} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-12 h-12 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-2">
                  {searchQuery ? "Ничего не найдено" : "Нет записей"}
                </h3>
                <p className="text-sm text-gray-500">
                  {searchQuery
                    ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте изменить поисковый запрос.`
                    : "Пока нет добавленных записей. Добавьте первую запись, чтобы начать работу."}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="border-t bg-gray-50 px-4 md:px-6 py-4">
          {/* Десктопная пагинация */}
          <div className="hidden md:flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Показано {startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, conversations.length)} из{" "}
              {conversations.length} записей
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1"
              >
                ← Назад
              </Button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1"
              >
                Вперед →
              </Button>
            </div>
          </div>

          {/* Мобильная пагинация */}
          <div className="md:hidden">
            <div className="flex flex-col space-y-3">
              {/* Информация о записях */}
              <div className="text-center text-sm text-gray-700">
                Показано {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, conversations.length)} из{" "}
                {conversations.length} записей
              </div>

              {/* Кнопки навигации */}
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex-1 max-w-[120px]"
                >
                  ← Назад
                </Button>

                <span className="text-sm text-gray-600 px-4">
                  {currentPage} из {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex-1 max-w-[120px]"
                >
                  Вперед →
                </Button>
              </div>

              {/* Номера страниц (только если страниц мало) */}
              {totalPages <= 7 && (
                <div className="flex items-center justify-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0 text-xs"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно подтверждения удаления */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение удаления</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить эту запись? Это действие нельзя
              отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ConversationsTable;
