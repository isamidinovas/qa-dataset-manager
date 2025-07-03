
import { useState } from 'react';
import { DialogueFile } from '@/types/dialogue';
import { useDialogueFiles } from '@/hooks/useDialogueFiles';
import DialogueSidebar from '@/components/DialogueSidebar';
import DialogueTable from '@/components/DialogueTable';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { files, loading, updateDialogue, deleteDialogue } = useDialogueFiles();
  const [selectedFile, setSelectedFile] = useState<DialogueFile | null>(null);

  const handleFileSelect = (file: DialogueFile) => {
    setSelectedFile(file);
  };

  // Обновляем выбранный файл при изменении данных
  const selectedFileData = selectedFile ? files.find(f => f.id === selectedFile.id) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="p-8">
          <CardContent className="flex items-center space-x-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="text-lg text-gray-700">Загрузка диалогов...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Просмотр диалогов</h1>
        <p className="text-gray-600">Выберите файл для просмотра диалогов в удобном формате</p>
      </div>
      
      <div className="flex h-[calc(100vh-120px)]">
        {/* Сайдбар */}
        <DialogueSidebar 
          files={files} 
          onFileSelect={handleFileSelect}
          selectedFileId={selectedFile?.id}
        />
        
        {/* Основной контент */}
        <div className="flex-1 p-6">
          {selectedFileData ? (
            <DialogueTable 
              file={selectedFileData} 
              onUpdateDialogue={updateDialogue}
              onDeleteDialogue={deleteDialogue}
            />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Выберите диалог</h3>
                <p className="text-gray-500">Кликните на файл в сайдбаре, чтобы просмотреть диалоги в таблице</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
