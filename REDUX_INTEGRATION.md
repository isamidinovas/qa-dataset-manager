# Redux Toolkit Integration с Backend

## Обзор

Этот проект использует Redux Toolkit для управления состоянием и интеграции с backend API. Все асинхронные операции (загрузка данных, CRUD операции) реализованы через thunk.

## Структура

```
src/
├── store/
│   ├── index.ts              # Конфигурация store
│   ├── hooks.ts              # Типизированные хуки
│   └── slices/
│       └── dialogueSlice.ts  # Slice для диалогов
├── hooks/
│   └── useDialogueFilesRedux.ts  # Хук для работы с Redux
└── components/
    └── DialogueTableRedux.tsx    # Пример компонента с Redux
```

## Основные Thunk

### 1. Загрузка файлов

```typescript
export const fetchFiles = createAsyncThunk(
  "dialogue/fetchFiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/files`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### 2. Загрузка диалогов с пагинацией и поиском

```typescript
export const fetchDialogues = createAsyncThunk(
  "dialogue/fetchDialogues",
  async (
    { fileId, page = 1, limit = 10, search = "" },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await fetch(
        `${API_BASE_URL}/files/${fileId}/dialogues?${params}`
      );
      const data = await response.json();
      return {
        dialogues: data.data.data,
        pagination: data.data,
        fileId,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### 3. CRUD операции

```typescript
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Обновление диалога
export const updateDialogue = createAsyncThunk(
  "dialogue/updateDialogue",
  async ({ fileId, dialogueIndex, updatedDialogue }, { rejectWithValue }) => {
    const response = await fetch(
      `${API_BASE_URL}/files/${fileId}/dialogues/${dialogueIndex}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDialogue),
      }
    );
    // ...
  }
);

// Удаление диалога
export const deleteDialogue = createAsyncThunk(
  "dialogue/deleteDialogue",
  async ({ fileId, dialogueIndex }, { rejectWithValue }) => {
    const response = await fetch(
      `${API_BASE_URL}/files/${fileId}/dialogues/${dialogueIndex}`,
      {
        method: "DELETE",
      }
    );
    // ...
  }
);

// Создание диалога
export const createDialogue = createAsyncThunk(
  "dialogue/createDialogue",
  async ({ fileId, dialogue }, { rejectWithValue }) => {
    const response = await fetch(`${API_BASE_URL}/files/${fileId}/dialogues`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dialogue),
    });
    // ...
  }
);
```

## Использование в компонентах

### Хук useDialogueFilesRedux

```typescript
import { useDialogueFilesRedux } from "@/hooks/useDialogueFilesRedux";

const MyComponent = () => {
  const {
    files,
    currentFile,
    dialogues,
    pagination,
    loading,
    error,
    handleFileSelect,
    handleUpdateDialogue,
    handleDeleteDialogue,
    handleSearchChange,
    handlePageChange,
  } = useDialogueFilesRedux();

  // Автоматически загружает файлы при монтировании
  // Автоматически загружает диалоги при выборе файла
  // Автоматически обновляет данные при изменении поиска или страницы

  return (
    <div>
      {loading && <div>Загрузка...</div>}
      {error && <div>Ошибка: {error}</div>}
      {/* Ваш UI */}
    </div>
  );
};
```

### Прямое использование dispatch

```typescript
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFiles, updateDialogue } from "@/store/slices/dialogueSlice";

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const { files, loading } = useAppSelector((state) => state.dialogue);

  const handleLoadFiles = () => {
    dispatch(fetchFiles());
  };

  const handleUpdate = async (
    fileId: string,
    index: number,
    data: DialogueEntry
  ) => {
    try {
      await dispatch(
        updateDialogue({ fileId, dialogueIndex: index, updatedDialogue: data })
      ).unwrap();
      console.log("Успешно обновлено");
    } catch (error) {
      console.error("Ошибка обновления:", error);
    }
  };

  return (
    <div>
      <button onClick={handleLoadFiles}>Загрузить файлы</button>
      {loading && <div>Загрузка...</div>}
      {/* Ваш UI */}
    </div>
  );
};
```

## API Endpoints

Ожидаемые endpoints на backend:

```
GET    /api/files                    # Список файлов
GET    /api/files/:id/dialogues      # Диалоги с пагинацией и поиском
POST   /api/files/:id/dialogues      # Создание диалога
PUT    /api/files/:id/dialogues/:index # Обновление диалога
DELETE /api/files/:id/dialogues/:index # Удаление диалога
```

### Query параметры для GET /api/files/:id/dialogues:

- `page` - номер страницы (по умолчанию 1)
- `limit` - количество записей на странице (по умолчанию 10)
- `search` - поисковый запрос (опционально)

### Response формат:

```typescript
{
  data: {
    data: DialogueEntry[],    // Массив диалогов
    total: number,           // Общее количество
    page: number,           // Текущая страница
    limit: number,          // Лимит на страницу
    totalPages: number      // Общее количество страниц
  },
  success: boolean,
  message?: string
}
```

## Обработка ошибок

Все thunk возвращают ошибки через `rejectWithValue`:

```typescript
// В компоненте
const handleUpdate = async () => {
  try {
    await dispatch(updateDialogue(payload)).unwrap();
    // Успех
  } catch (error) {
    // Ошибка - error будет строкой с сообщением
    console.error("Ошибка:", error);
  }
};
```

## Состояние в Redux

```typescript
interface DialogueState {
  files: DialogueFile[]; // Список файлов
  currentFile: DialogueFile | null; // Текущий выбранный файл
  dialogues: DialogueEntry[]; // Текущие диалоги
  pagination: {
    // Информация о пагинации
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  searchQuery: string; // Текущий поисковый запрос
  loading: boolean; // Загрузка диалогов
  error: string | null; // Ошибка диалогов
  filesLoading: boolean; // Загрузка файлов
  filesError: string | null; // Ошибка файлов
}
```

## Миграция с локального состояния

Для миграции с текущего `useDialogueFiles` на Redux:

1. Замените импорт:

```typescript
// Было
import { useDialogueFiles } from "@/hooks/useDialogueFiles";

// Стало
import { useDialogueFilesRedux } from "@/hooks/useDialogueFilesRedux";
```

2. Обновите использование:

```typescript
// Было
const { files, loading, updateDialogue, deleteDialogue } = useDialogueFiles();

// Стало
const {
  files,
  loading,
  handleUpdateDialogue: updateDialogue,
  handleDeleteDialogue: deleteDialogue,
} = useDialogueFilesRedux();
```

API совместим, поэтому миграция должна быть простой!
