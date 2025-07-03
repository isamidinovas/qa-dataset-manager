
import { useState } from 'react';
import { DialogueFile } from '@/types/dialogue';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';

interface DialogueSidebarProps {
  files: DialogueFile[];
  onFileSelect: (file: DialogueFile) => void;
  selectedFileId?: string;
}

const DialogueSidebar = ({ files, onFileSelect, selectedFileId }: DialogueSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'} bg-white border-r`}>
      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-800">Диалоги</h2>
        )}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={toggleSidebar}
          className="ml-auto"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      {!isCollapsed && (
        <div className="p-4 space-y-2">
          {files.map((file) => (
            <Card 
              key={file.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-sm ${
                selectedFileId === file.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => onFileSelect(file)}
            >
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-800 truncate">{file.name}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DialogueSidebar;
