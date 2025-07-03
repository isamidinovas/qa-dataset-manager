
import { useState } from 'react';
import { DialogueFile, DialogueEntry } from '@/types/dialogue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Bot, Edit, Save, Trash2 } from 'lucide-react';

interface DialogueTableProps {
  file: DialogueFile;
  onUpdateDialogue: (fileId: string, dialogueIndex: number, updatedDialogue: DialogueEntry) => void;
  onDeleteDialogue: (fileId: string, dialogueIndex: number) => void;
}

const DialogueTable = ({ file, onUpdateDialogue, onDeleteDialogue }: DialogueTableProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editUser, setEditUser] = useState('');
  const [editAssistant, setEditAssistant] = useState('');

  const handleEdit = (index: number, dialogue: DialogueEntry) => {
    setEditingIndex(index);
    setEditUser(dialogue.user);
    setEditAssistant(dialogue.assistant);
  };

  const handleSave = (index: number) => {
    onUpdateDialogue(file.id, index, {
      user: editUser,
      assistant: editAssistant
    });
    setEditingIndex(null);
    setEditUser('');
    setEditAssistant('');
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditUser('');
    setEditAssistant('');
  };

  const handleDelete = (index: number) => {
    onDeleteDialogue(file.id, index);
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-3 md:pb-4">
        <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
          <MessageCircle className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
          <span className="truncate">{file.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full overflow-auto">
          {/* Мобильная версия - карточки */}
          <div className="md:hidden space-y-4 p-4">
            {file.dialogues.map((dialogue, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4 space-y-4">
                  {/* Вопрос */}
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm text-gray-700">Вопрос</span>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      {editingIndex === index ? (
                        <Textarea
                          value={editUser}
                          onChange={(e) => setEditUser(e.target.value)}
                          className="min-h-[60px] bg-white text-sm"
                          autoFocus
                        />
                      ) : (
                        <p className="text-gray-800 leading-relaxed text-sm">{dialogue.user}</p>
                      )}
                    </div>
                  </div>

                  {/* Ответ */}
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Bot className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-sm text-gray-700">Ответ</span>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      {editingIndex === index ? (
                        <Textarea
                          value={editAssistant}
                          onChange={(e) => setEditAssistant(e.target.value)}
                          className="min-h-[60px] bg-white text-sm"
                        />
                      ) : (
                        <p className="text-gray-800 leading-relaxed text-sm">{dialogue.assistant}</p>
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
            ))}
          </div>

          {/* Десктопная версия - таблица */}
          <div className="hidden md:block rounded-md border">
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
                {file.dialogues.map((dialogue, index) => (
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
                          <p className="text-gray-800 leading-relaxed">{dialogue.user}</p>
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
                          <p className="text-gray-800 leading-relaxed">{dialogue.assistant}</p>
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
                              <Save className="h-4 w-4" />
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(index, dialogue)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DialogueTable;
