import { useEffect, useState, useCallback } from "react";
import debounce from "lodash/debounce";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchUniqueWords,
  setSearchQuery,
} from "@/store/slices/dictionarySlice";
import { Search, Loader2, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import DataSidebar from "@/components/DialogueSidebar";
import { Button } from "@/components/ui/button";

const DICT_FILES = [
  { id: 1, name: "Орусча → Кыргызча", key: "oruscha" },
  { id: 2, name: "Кыргызча → Орусча", key: "kyrgyzcha" },
];
const PAGE_SIZE = 50;

export default function DictionaryPage() {
  const dispatch = useAppDispatch();
  const {
    oruscha,
    kyrgyzcha,
    loading,
    error,
    searchQuery,
    oruscha_total,
    kyrgyzcha_total,
  } = useAppSelector((state) => state.dictionary);
  const [selectedFile, setSelectedFile] = useState(DICT_FILES[0]);
  const [page, setPage] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const debouncedSetSearchQuery = useCallback(
    debounce((value) => {
      dispatch(setSearchQuery(value));
    }, 400),
    [dispatch]
  );

  const handleInputChange = (e) => {
    setLocalSearch(e.target.value);
    debouncedSetSearchQuery(e.target.value);
  };

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const total =
    selectedFile.key === "oruscha" ? oruscha_total : kyrgyzcha_total;
  const words = selectedFile.key === "oruscha" ? oruscha : kyrgyzcha;
  const title = selectedFile.name;

  useEffect(() => {
    setPage(1);
  }, [selectedFile, searchQuery]);

  useEffect(() => {
    const offset = (page - 1) * PAGE_SIZE;
    dispatch(
      fetchUniqueWords({ search: searchQuery, limit: PAGE_SIZE, offset })
    );
  }, [dispatch, searchQuery, page, selectedFile]);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setIsMobileSidebarOpen(false); // Закрыть сайдбар на мобилке при выборе
  };

  const totalPages = Math.ceil((total || 0) / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Мобильный хедер с кнопкой-меню */}
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
          <h1 className="text-lg font-bold text-gray-800">Юдахиндин сөздүгү</h1>
          <div className="w-8"></div>
        </div>
        <div className="relative w-full mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Поиск в словаре..."
            value={localSearch}
            onChange={handleInputChange}
            className="pl-10 pr-3 py-2 text-base h-10 rounded-xl bg-white border border-transparent shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-blue-50 placeholder-gray-400 transition-all duration-200"
          />
        </div>
      </div>

      {/* Десктопный хедер */}
      <div className="hidden md:flex items-center justify-between py-6 px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-0 mr-auto ml-auto">
          Юдахиндин сөздүгү
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative w-80 hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Поиск в словаре..."
              value={localSearch}
              onChange={handleInputChange}
              className="pl-10 pr-3 py-2 text-base h-10 rounded-xl bg-white border border-transparent shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-blue-50 placeholder-gray-400 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Layout: Sidebar + Content */}
      <div className="flex">
        {/* Sidebar для десктопа */}
        <div className="hidden md:block h-[calc(100vh-40px)] md:h-[calc(100vh-80px)]">
          <DataSidebar
            files={DICT_FILES}
            onFileSelect={handleFileSelect}
            selectedFileId={selectedFile.id}
            viewMode="conversations"
          />
        </div>
        {/* Мобильный сайдбар */}
        {isMobileSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 shadow-lg md:hidden">
              <DataSidebar
                files={DICT_FILES}
                onFileSelect={handleFileSelect}
                selectedFileId={selectedFile.id}
                viewMode="conversations"
              />
            </div>
          </>
        )}
        {/* Content */}
        <div className="flex-1 pl-0 md:pl-4 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : error ? (
            <Card>
              <CardContent className="text-red-500">{error}</CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <h2 className="text-lg font-bold mb-2">
                  {title} ({total || 0})
                </h2>
                {words.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Нет данных для отображения
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {words.map((w) => (
                      <li key={w.word} className="p-2 bg-blue-50 rounded">
                        <p className="font-medium">{w.word}</p>
                        {selectedFile.key === "kyrgyzcha" ? (
                          <>
                            <span className="font-bold text-xs">
                              Аныктама:{" "}
                            </span>
                            <span className="text-sm text-gray-700">
                              {w.definition}
                            </span>
                            {w.examples && (
                              <div className="mt-1">
                                <span className="font-bold text-xs">
                                  Мисал:{" "}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {w.examples}
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="font-bold text-xs">
                              Определение:{" "}
                            </span>
                            <span className="text-sm text-gray-700">
                              {w.definition}
                            </span>
                            {w.examples && (
                              <div className="mt-1">
                                <span className="font-bold text-xs">
                                  Пример:{" "}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {w.examples}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {/* Пагинация */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center mt-6 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      className="px-2"
                    >
                      ⏮
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-2"
                    >
                      ←
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      if (pageNum < 1 || pageNum > totalPages) return null;
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="px-2"
                    >
                      →
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(totalPages)}
                      disabled={page === totalPages}
                      className="px-2"
                    >
                      ⏭
                    </Button>
                    <span className="ml-4 text-sm text-gray-600">
                      Страница {page} из {totalPages}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
