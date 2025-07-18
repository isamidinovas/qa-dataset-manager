import { useState } from "react";
import { DialogueFile } from "@/types/dialogue";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ChevronLeft, ChevronRight, Database } from "lucide-react";

interface DataSidebarProps {
  files: DialogueFile[];
  onFileSelect: (file: DialogueFile) => void;
  selectedFileId?: number;
  viewMode?: "dialogues" | "conversations";
}

const DataSidebar = ({
  files,
  onFileSelect,
  selectedFileId,
  viewMode = "conversations",
}: DataSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getTitle = () => {
    return viewMode === "conversations" ? "Словарь" : "Диалоги";
  };

  const getIcon = () => {
    return viewMode === "conversations" ? Database : FileText;
  };

  const IconComponent = getIcon();

  return (
    <div
      className={`transition-all duration-300 ${
        isCollapsed ? "w-12" : "w-80 md:w-80 w-72"
      } bg-white border-r h-full`}
    >
      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-base md:text-lg font-semibold text-gray-800">
            {getTitle()}
          </h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="ml-auto hidden md:flex"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="p-3 md:p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-80px)]">
          {files.map((file) => (
            <Card
              key={file.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-sm ${
                selectedFileId === Number(file.id)
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => onFileSelect(file)}
            >
              <CardContent className="p-2 md:p-3">
                <div className="flex items-center space-x-2">
                  <IconComponent className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="text-xs md:text-sm font-medium text-gray-800 truncate">
                    {file.name}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataSidebar;
