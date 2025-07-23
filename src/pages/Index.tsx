import { useEffect, useState } from "react";
import DataSidebar from "@/components/DialogueSidebar";
import ConversationsTable from "@/components/ConversationsTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Menu, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import { useConversationsRedux } from "@/hooks/useConversationsRedux";
import {
  fetchConversationsByDataset,
  fetchFilteredConversationsByDataset,
} from "@/store/slices/conversationsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { NavLink } from "react-router-dom";

export interface DialogueFile {
  id: number; //
  name: string;
}

const Index = () => {
  const {
    conversations,
    loading,
    error,

    searchQuery,
    setSearchQuery,
    fetchConversations,
    updateConversation,
    deleteConversation,
  } = useConversationsRedux();

  // Это список файлов (dataset), допустим ты получаешь их отдельно:
  const files: DialogueFile[] = [
    { id: 1, name: "Dataset 1" },
    { id: 2, name: "Dataset 2" },
    { id: 3, name: "Dataset 3" },
    { id: 4, name: "Dataset 4" },
    { id: 5, name: "Dataset 5" },
    { id: 6, name: "Dataset 6" },
    { id: 7, name: "Dataset 7" },
    { id: 101, name: "Filtered Dataset 1" },
    { id: 102, name: "Filtered Dataset 2" },
    { id: 103, name: "Filtered Dataset 3" },
    { id: 104, name: "Filtered Dataset 4" }, // 100+id — для уникальности
    { id: 105, name: "Filtered Dataset 5" },
    { id: 106, name: "Filtered Dataset 6" },
    { id: 107, name: "Filtered Dataset 7" },
  ];

  const [selectedFile, setSelectedFile] = useState<DialogueFile | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { items, filteredItems } = useAppSelector(
    (state) => state.conversations
  );
  const dispatch = useAppDispatch();

  const fetchDataForFile = (file: DialogueFile) => {
    if (file.name.startsWith("Filtered")) {
      dispatch(
        fetchFilteredConversationsByDataset({
          dataset_id: file.id - 100,
          search: searchQuery,
        })
      );
    } else {
      dispatch(
        fetchConversationsByDataset({ datasetId: file.id, search: searchQuery })
      );
    }
  };

  const handleFileSelect = (file: DialogueFile) => {
    setSelectedFile(file);
    setIsMobileSidebarOpen(false);
    fetchDataForFile(file);
  };

  useEffect(() => {
    if (selectedFile) {
      if (selectedFile.name.startsWith("Filtered")) {
        dispatch(
          fetchFilteredConversationsByDataset({
            dataset_id: selectedFile.id - 100,
            search: searchQuery,
          })
        );
      } else {
        fetchConversations(selectedFile.id, searchQuery);
      }
    }
  }, [selectedFile, searchQuery, fetchConversations, dispatch]);

  useEffect(() => {
    if (!selectedFile && files.length > 0) {
      setSelectedFile(files[0]);
      setIsMobileSidebarOpen(false);
    }
  }, [files, selectedFile]);

  const handleUpdateConversation = (
    id: number,
    updatedConversation: Partial<{ user: string; assistant: string }>
  ) => {
    updateConversation(id, updatedConversation);
  };

  const handleDeleteConversation = (id: number) => {
    deleteConversation(id);
  };

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
          <h1 className="text-lg font-bold text-gray-800">Просмотр данных</h1>
          <div className="w-8"></div>
        </div>
        <div className="relative w-full mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-3  py-2 text-base h-10 rounded-xl bg-white border border-transparent shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-blue-50 placeholder-gray-400 transition-all duration-200"
          />
        </div>
      </div>

      {/* Десктопный хедер */}
      <div className="hidden md:flex items-center justify-between py-6 px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-0 mr-auto ml-auto">
          Просмотр данных
        </h1>
        <div className="flex items-center gap-4">
          <a
            href="/dict"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline font-bold"
          >
            Юдахин
          </a>
          <div className="relative w-80 hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-3  py-2 text-base h-10 rounded-xl bg-white border border-transparent shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-blue-50 placeholder-gray-400 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-40px)] md:h-[calc(100vh-80px)]">
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        <div
          className={`fixed md:relative z-50 md:z-auto ${
            isMobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          } transition-transform duration-300 ease-in-out h-full`}
        >
          <DataSidebar
            files={files}
            onFileSelect={handleFileSelect}
            selectedFileId={selectedFile?.id}
            viewMode="conversations"
          />
        </div>

        <div className="flex-1 pl-0 md:pl-4 overflow-hidden">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center text-red-500">
                Ошибка загрузки: {error}
              </CardContent>
            </Card>
          ) : selectedFile ? (
            <ConversationsTable
              // conversations={conversations}
              conversations={
                selectedFile?.name.startsWith("Filtered")
                  ? filteredItems
                  : items
              }
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onUpdateConversation={handleUpdateConversation}
              onDeleteConversation={handleDeleteConversation}
              selectedFileId={selectedFile?.id}
              onRefresh={() =>
                selectedFile && fetchConversations(selectedFile.id, searchQuery)
              }
            />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">
                  Выберите файл
                </h3>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
