import { useState } from "react";
import { DialogueEntry } from "@/types/dialogue";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import {
  MessageCircle,
  Bot,
  Edit,
  Save,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDialogueFilesRedux } from "@/hooks/useDialogueFilesRedux";

const DialogueTableRedux = () => {
  const {
    currentFile,
    dialogues,
    pagination,
    loading,
    error,
    handleUpdateDialogue,
    handleDeleteDialogue,
    handlePageChange,
  } = useDialogueFilesRedux();

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editUser, setEditUser] = useState("");
  const [editAssistant, setEditAssistant] = useState("");

  const handleEdit = (index: number, dialogue: DialogueEntry) => {
    setEditingIndex(index);
    setEditUser(dialogue.user);
    setEditAssistant(dialogue.assistant);
  };

  const handleSave = async (index: number) => {
    if (!currentFile) return;

    try {
      await handleUpdateDialogue(currentFile.id, index, {
        user: editUser,
        assistant: editAssistant,
      });
      setEditingIndex(null);
      setEditUser("");
      setEditAssistant("");
    } catch (error) {
      console.error("Failed to save dialogue:", error);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditUser("");
    setEditAssistant("");
  };

  const handleDelete = async (index: number) => {
    if (!currentFile) return;

    try {
      await handleDeleteDialogue(currentFile.id, index);
    } catch (error) {
      console.error("Failed to delete dialogue:", error);
    }
  };

  if (loading) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка диалогов...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <div className="text-red-600 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ошибка загрузки
          </h3>
          <p className="text-gray-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!currentFile) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Выберите файл
          </h3>
          <p className="text-gray-500">
            Кликните на файл в сайдбаре, чтобы просмотреть диалоги
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="truncate font-semibold text-base md:text-lg text-gray-800">
          {currentFile.name}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full overflow-auto">
          {/* Мобильная версия - карточки */}
          <div className="md:hidden space-y-4 p-4">
            {dialogues.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Диалоги не найдены
              </div>
            ) : (
              dialogues.map((dialogue, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4 space-y-4">
                    {/* Вопрос */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <MessageCircle className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm text-gray-700">
                          Вопрос
                        </span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        {editingIndex === index ? (
                          <Textarea
                            value={editUser}
                            onChange={(e) => setEditUser(e.target.value)}
                            className="min-h-[100px] bg-white text-sm"
                            autoFocus
                          />
                        ) : (
                          <p className="text-gray-800 leading-relaxed text-sm">
                            {dialogue.user}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Ответ */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-sm text-gray-700">
                          Ответ
                        </span>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        {editingIndex === index ? (
                          <Textarea
                            value={editAssistant}
                            onChange={(e) => setEditAssistant(e.target.value)}
                            className="min-h-[100px] bg-white text-sm"
                          />
                        ) : (
                          <p className="text-gray-800 leading-relaxed text-sm">
                            {dialogue.assistant}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Действия */}
                    <div className="flex space-x-2 pt-2">
                      {editingIndex === index ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSave(index)}
                            className="text-green-600 hover:text-green-700 flex-1"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Сохранить
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                            className="flex-1"
                          >
                            Отмена
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(index, dialogue)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Изменить
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Десктопная версия - таблица */}
          <div className="hidden md:block rounded-md border">
            {dialogues.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Диалоги не найдены
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>Вопрос</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4" />
                        <span>Ответ</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 w-32">
                      Действия
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dialogues.map((dialogue, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="align-top p-4 border-r">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          {editingIndex === index ? (
                            <Textarea
                              value={editUser}
                              onChange={(e) => setEditUser(e.target.value)}
                              className="min-h-[80px] bg-white"
                              autoFocus
                            />
                          ) : (
                            <p className="text-gray-800 leading-relaxed">
                              {dialogue.user}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="align-top p-4 border-r">
                        <div className="bg-green-50 p-3 rounded-lg">
                          {editingIndex === index ? (
                            <Textarea
                              value={editAssistant}
                              onChange={(e) => setEditAssistant(e.target.value)}
                              className="min-h-[80px] bg-white"
                            />
                          ) : (
                            <p className="text-gray-800 leading-relaxed">
                              {dialogue.assistant}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="align-top p-4">
                        <div className="flex space-x-2">
                          {editingIndex === index ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSave(index)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Save className="h-4 w-4 mr-1" />
                                Сохранить
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancel}
                              >
                                Отмена
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(index, dialogue)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Изменить
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </CardContent>

      {/* Пагинация */}
      {pagination.totalPages > 1 && (
        <div className="border-t bg-gray-50 px-4 py-4 flex justify-center">
          <div className="inline-flex shadow-sm">
            {/* Кнопка "Назад" */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
              disabled={pagination.page === 1}
              className="rounded-l-md rounded-r-none border-r-0 min-w-[44px]"
            >
              &lt; Назад
            </Button>
            {/* Номера страниц */}
            {Array.from(
              { length: Math.min(5, pagination.totalPages) },
              (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={
                      pagination.page === pageNum ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={`rounded-none border-r-0 min-w-[36px] ${
                      pagination.page === pageNum
                        ? "bg-gray-300 text-gray-900"
                        : ""
                    }`}
                    style={{ zIndex: 1 }}
                  >
                    {pageNum}
                  </Button>
                );
              }
            )}
            {/* Кнопка "Вперед" */}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handlePageChange(
                  Math.min(pagination.totalPages, pagination.page + 1)
                )
              }
              disabled={pagination.page === pagination.totalPages}
              className="rounded-r-md rounded-l-none min-w-[44px]"
            >
              Вперед &gt;
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DialogueTableRedux;
