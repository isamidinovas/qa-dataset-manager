import { useState, useMemo } from "react";
import { DialogueFile, DialogueEntry } from "@/types/dialogue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { MessageCircle, Bot, Edit, Save, Trash2 } from "lucide-react";

interface DialogueTableProps {
  file: DialogueFile;
  onUpdateDialogue: (
    fileId: string,
    dialogueIndex: number,
    updatedDialogue: DialogueEntry
  ) => void;
  onDeleteDialogue: (fileId: string, dialogueIndex: number) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const DialogueTable = ({
  file,
  onUpdateDialogue,
  onDeleteDialogue,
  searchQuery,
}: DialogueTableProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editUser, setEditUser] = useState("");
  const [editAssistant, setEditAssistant] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Фильтрация диалогов по поисковому запросу
  const filteredDialogues = useMemo(() => {
    if (!searchQuery.trim()) {
      return file.dialogues;
    }
    const query = searchQuery.toLowerCase();
    return file.dialogues.filter(
      (dialogue) =>
        dialogue.user.toLowerCase().includes(query) ||
        dialogue.assistant.toLowerCase().includes(query)
    );
  }, [file.dialogues, searchQuery]);

  // Пагинация
  const totalPages = Math.ceil(filteredDialogues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDialogues = filteredDialogues.slice(startIndex, endIndex);

  // Сброс страницы при изменении поиска
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleEdit = (index: number, dialogue: DialogueEntry) => {
    setEditingIndex(index);
    setEditUser(dialogue.user);
    setEditAssistant(dialogue.assistant);
  };

  const handleSave = (index: number) => {
    // Находим оригинальный индекс в полном массиве
    const originalIndex = file.dialogues.indexOf(
      filteredDialogues[startIndex + index]
    );
    onUpdateDialogue(file.id, originalIndex, {
      user: editUser,
      assistant: editAssistant,
    });
    setEditingIndex(null);
    setEditUser("");
    setEditAssistant("");
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditUser("");
    setEditAssistant("");
  };

  const handleDelete = (index: number) => {
    // Находим оригинальный индекс в полном массиве
    const originalIndex = file.dialogues.indexOf(
      filteredDialogues[startIndex + index]
    );
    onDeleteDialogue(file.id, originalIndex);
  };

  return (
    <Card className="w-full h-full flex flex-col">
      {/* <CardHeader className="pb-2 md:pb-2 flex flex-row items-center justify-between space-y-0 space-x-2"> */}
      {/* Название файла (слева) */}
      {/* <div className="truncate font-semibold text-base md:text-lg text-gray-800">
          {file.name}
        </div> */}
      {/* </CardHeader> */}

      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full overflow-auto">
          {/* Мобильная версия - карточки */}
          <div className="md:hidden space-y-4 p-4">
            {currentDialogues.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchQuery
                  ? "По вашему запросу ничего не найдено"
                  : "Диалоги не найдены"}
              </div>
            ) : (
              currentDialogues.map((dialogue, index) => (
                <Card
                  key={startIndex + index}
                  className="border-l-4 border-l-blue-500"
                >
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
            {currentDialogues.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {searchQuery
                  ? "По вашему запросу ничего не найдено"
                  : "Диалоги не найдены"}
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
                  {currentDialogues.map((dialogue, index) => (
                    <TableRow
                      key={startIndex + index}
                      className="hover:bg-gray-50"
                    >
                      <TableCell className="align-top p-4 border-r w-[20%]">
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
      {totalPages > 1 && (
        <div className="border-t bg-gray-50 px-4 py-4 flex justify-center">
          <div className="inline-flex shadow-sm">
            {/* Кнопка "Назад" */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-l-md rounded-r-none border-r-0 min-w-[44px]"
            >
              &lt; Назад
            </Button>
            {/* Номера страниц */}
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
                  className={`rounded-none border-r-0 min-w-[36px] ${
                    currentPage === pageNum ? "bg-gray-300 text-gray-900" : ""
                  }`}
                  style={{ zIndex: 1 }}
                >
                  {pageNum}
                </Button>
              );
            })}
            {/* Кнопка "Вперед" */}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
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

export default DialogueTable;
