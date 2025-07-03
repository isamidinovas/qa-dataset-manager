
import { DialogueFile } from '@/types/dialogue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare } from 'lucide-react';

interface FileListProps {
  files: DialogueFile[];
  onFileSelect: (file: DialogueFile) => void;
  selectedFileId?: string;
}

const FileList = ({ files, onFileSelect, selectedFileId }: FileListProps) => {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Доступные диалоги</h2>
      {files.map((file) => (
        <Card 
          key={file.id} 
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedFileId === file.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => onFileSelect(file)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">{file.name}</CardTitle>
            </div>
            <CardDescription className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{file.dialogues.length} сообщений</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              variant={selectedFileId === file.id ? "default" : "outline"} 
              size="sm"
              className="w-full"
            >
              {selectedFileId === file.id ? 'Выбрано' : 'Просмотреть'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FileList;
