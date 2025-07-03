
import { DialogueFile } from '@/types/dialogue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MessageCircle, Bot } from 'lucide-react';

interface DialogueTableProps {
  file: DialogueFile;
}

const DialogueTable = ({ file }: DialogueTableProps) => {
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
                  <TableCell className="align-top p-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-gray-800 leading-relaxed">{dialogue.assistant}</p>
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
