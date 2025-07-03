
import { useState } from 'react';
import { DialogueFile, DialogueEntry } from '@/types/dialogue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageCircle, Bot, Edit, Trash2 } from 'lucide-react';

interface DialogueTableProps {
  file: DialogueFile;
  onUpdateDialogue: (fileId: string, dialogueIndex: number, updatedDialogue: DialogueEntry) => void;
  onDeleteDialogue: (fileId: string, dialogueIndex: number) => void;
}

const DialogueTable = ({ file, onUpdateDialogue, onDeleteDialogue }: DialogueTableProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editUser, setEditUser] = useState('');
  const [editAssistant, setEditAssistant] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (index: number, dialogue: DialogueEntry) => {
    setEditingIndex(index);
    setEditUser(dialogue.user);
    setEditAssistant(dialogue.assistant);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      onUpdateDialogue(file.id, editingIndex, {
        user: editUser,
        assistant: editAssistant
      });
      setIsDialogOpen(false);
      setEditingIndex(null);
      setEditUser('');
      setEditAssistant('');
    }
  };

  const handleDelete = (index: number) => {
    onDeleteDialogue(file.id, index);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-6 w-6 text-blue-600" />
          <span>{file.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
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
                      <p className="text-gray-800 leading-relaxed">{dialogue.user}</p>
                    </div>
                  </TableCell>
                  <TableCell className="align-top p-4 border-r">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-gray-800 leading-relaxed">{dialogue.assistant}</p>
                    </div>
                  </TableCell>
                  <TableCell className="align-top p-4">
                    <div className="flex space-x-2">
                      <Dialog open={isDialogOpen && editingIndex === index} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) {
                          setEditingIndex(null);
                          setEditUser('');
                          setEditAssistant('');
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(index, dialogue)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Редактировать диалог</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block">Вопрос</label>
                              <Input
                                value={editUser}
                                onChange={(e) => setEditUser(e.target.value)}
                                placeholder="Введите вопрос"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block">Ответ</label>
                              <Input
                                value={editAssistant}
                                onChange={(e) => setEditAssistant(e.target.value)}
                                placeholder="Введите ответ"
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Отмена
                              </Button>
                              <Button onClick={handleSave}>
                                Сохранить
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
      </CardContent>
    </Card>
  );
};

export default DialogueTable;
