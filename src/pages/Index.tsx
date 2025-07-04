import { useState } from "react";
import { DialogueFile } from "@/types/dialogue";
import { useDialogueFiles } from "@/hooks/useDialogueFiles";
import DialogueSidebar from "@/components/DialogueSidebar";
import DialogueTable from "@/components/DialogueTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Index = () => {
  const { files, loading, updateDialogue, deleteDialogue } = useDialogueFiles();
  const [selectedFile, setSelectedFile] = useState<DialogueFile | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFileSelect = (file: DialogueFile) => {
    setSelectedFile(file);
    setIsMobileSidebarOpen(false);
  };

  // Обновляем выбранный файл при изменении данных
  const selectedFileData = selectedFile
    ? files.find((f) => f.id === selectedFile.id)
    : null;

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
      {/* Мобильный хедер */}
      <div className="md:hidden bg-white border-b px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            {isMobileSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          <h1 className="text-lg font-bold text-gray-800">Просмотр диалогов</h1>
          <div className="w-8"></div>
        </div>
        {/* Мобильный поиск */}
        <div className="relative w-full mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-3  py-2 text-base h-10 rounded-xl bg-white border border-transparent shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-blue-50 placeholder-gray-400 transition-all duration-200"
            style={{ minWidth: 0 }}
          />
        </div>
      </div>

      {/* Десктопный хедер */}
      <div className="hidden md:flex items-center justify-between py-6 px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-0 mr-auto ml-auto">
          Просмотр диалогов
        </h1>
        <div className="relative w-80 hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-3  py-2 text-base h-10 rounded-xl bg-white border border-transparent shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-blue-50 placeholder-gray-400 transition-all duration-200"
            style={{ minWidth: 0 }}
          />
        </div>
      </div>

      <div className="flex h-[calc(100vh-40px)] md:h-[calc(100vh-80px)]">
        {/* Мобильный оверлей для сайдбара */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Сайдбар */}
        <div
          className={`
          fixed md:relative z-50 md:z-auto
          ${
            isMobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
          transition-transform duration-300 ease-in-out
          h-full
        `}
        >
          <DialogueSidebar
            files={files}
            onFileSelect={handleFileSelect}
            selectedFileId={selectedFile?.id}
          />
        </div>

        {/* Основной контент */}
        <div className="flex-1 pl-0 md:pl-4 overflow-hidden">
          {selectedFileData ? (
            <DialogueTable
              file={selectedFileData}
              onUpdateDialogue={updateDialogue}
              onDeleteDialogue={deleteDialogue}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-12 md:h-16 w-12 md:w-16"
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
                <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">
                  Выберите диалог
                </h3>
                <p className="text-sm md:text-base text-gray-500 px-4">
                  <span className="md:hidden">
                    Нажмите на меню, чтобы выбрать файл
                  </span>
                  <span className="hidden md:inline">
                    Кликните на файл в сайдбаре, чтобы просмотреть диалоги в
                    таблице
                  </span>
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
