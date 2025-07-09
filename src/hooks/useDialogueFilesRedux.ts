import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchFiles,
  fetchDialogues,
  updateDialogue,
  deleteDialogue,
  createDialogue,
  setSearchQuery,
  setCurrentPage,
  setCurrentFile,
  clearError,
} from "@/store/slices/dialogueSlice";
import { DialogueEntry } from "@/types/dialogue";

export const useDialogueFilesRedux = () => {
  const dispatch = useAppDispatch();
  const {
    files,
    currentFile,
    dialogues,
    pagination,
    searchQuery,
    loading,
    error,
    filesLoading,
    filesError,
  } = useAppSelector((state) => state.dialogue);

  // Загрузка файлов при монтировании компонента
  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

  // Загрузка диалогов при изменении текущего файла или параметров
  useEffect(() => {
    if (currentFile) {
      dispatch(
        fetchDialogues({
          fileId: currentFile.id,
          page: pagination.page,
          limit: pagination.limit,
          search: searchQuery,
        })
      );
    }
  }, [dispatch, currentFile, pagination.page, pagination.limit, searchQuery]);

  const handleFileSelect = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    dispatch(setCurrentFile(file || null));
  };

  const handleUpdateDialogue = async (
    fileId: string,
    dialogueIndex: number,
    updatedDialogue: DialogueEntry
  ) => {
    try {
      await dispatch(
        updateDialogue({ fileId, dialogueIndex, updatedDialogue })
      ).unwrap();
      // Обновляем данные после успешного обновления
      if (currentFile?.id === fileId) {
        dispatch(
          fetchDialogues({
            fileId,
            page: pagination.page,
            limit: pagination.limit,
            search: searchQuery,
          })
        );
      }
    } catch (error) {
      console.error("Failed to update dialogue:", error);
    }
  };

  const handleDeleteDialogue = async (
    fileId: string,
    dialogueIndex: number
  ) => {
    try {
      await dispatch(deleteDialogue({ fileId, dialogueIndex })).unwrap();
      // Обновляем данные после успешного удаления
      if (currentFile?.id === fileId) {
        dispatch(
          fetchDialogues({
            fileId,
            page: pagination.page,
            limit: pagination.limit,
            search: searchQuery,
          })
        );
      }
    } catch (error) {
      console.error("Failed to delete dialogue:", error);
    }
  };

  const handleCreateDialogue = async (
    fileId: string,
    dialogue: DialogueEntry
  ) => {
    try {
      await dispatch(createDialogue({ fileId, dialogue })).unwrap();
      // Обновляем данные после успешного создания
      if (currentFile?.id === fileId) {
        dispatch(
          fetchDialogues({
            fileId,
            page: pagination.page,
            limit: pagination.limit,
            search: searchQuery,
          })
        );
      }
    } catch (error) {
      console.error("Failed to create dialogue:", error);
    }
  };

  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
    dispatch(setCurrentPage(1)); // Сброс на первую страницу при поиске
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleErrorClear = () => {
    dispatch(clearError());
  };

  return {
    // Данные
    files,
    currentFile,
    dialogues,
    pagination,
    searchQuery,

    // Состояние загрузки
    loading,
    error,
    filesLoading,
    filesError,

    // Действия
    handleFileSelect,
    handleUpdateDialogue,
    handleDeleteDialogue,
    handleCreateDialogue,
    handleSearchChange,
    handlePageChange,
    handleErrorClear,

    // Утилиты для совместимости со старым API
    updateDialogue: handleUpdateDialogue,
    deleteDialogue: handleDeleteDialogue,
  };
};
