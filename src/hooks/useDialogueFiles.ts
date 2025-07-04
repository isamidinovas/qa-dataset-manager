import { useState, useEffect } from "react";
import { DialogueFile, DialogueEntry } from "@/types/dialogue";

// Моковые данные для демонстрации
const mockDialogueFiles: DialogueFile[] = [
  {
    id: "1",
    name: "Диалог о программировании",
    dialogues: [
      {
        user: "Что такое React?",
        assistant:
          "React — это JavaScript библиотека для создания пользовательских интерфейсов.React — это JavaScript библиотека для создания пользовательских интерфейсов.React — это JavaScript библиотека для создания пользовательских интерфейсов.React — это JavaScript библиотека для создания пользовательских интерфейсов.React — это JavaScript библиотека для создания пользовательских интерфейсов.React — это JavaScript библиотека для создания пользовательских интерфейсов.",
      },
      {
        user: "Как работают хуки в React?",
        assistant:
          "Хуки позволяют использовать состояние и другие возможности React в функциональных компонентах.",
      },
      {
        user: "Что такое TypeScript?",
        assistant:
          "TypeScript — это типизированная надстройка над JavaScript, которая компилируется в чистый JavaScript.",
      },
      {
        user: "Что такое React?",
        assistant:
          "React — это JavaScript библиотека для создания пользовательских интерфейсов.React — это JavaScript библиотека для создания пользовательских интерфейсов.React — это JavaScript библиотека для создания пользовательских интерфейсов.React — это JavaScript библиотека для создания пользовательских интерфейсов.React — это JavaScript библиотека для создания пользовательских интерфейсов.React — это JavaScript библиотека для создания пользовательских интерфейсов.",
      },
      {
        user: "Как работают хуки в React?",
        assistant:
          "Хуки позволяют использовать состояние и другие возможности React в функциональных компонентах.",
      },
      {
        user: "Что такое TypeScript?",
        assistant:
          "TypeScript — это типизированная надстройка над JavaScript, которая компилируется в чистый JavaScript.",
      },
      {
        user: "Что такое React?",
        assistant:
          "React — это JavaScript библиотека для создания пользовательских интерфейсов.React — это JavaScript библиотека для создания пользовательских интерфейсов.React — это JavaScript библиотека для создания пользовательских интерфейсов.React — это JavaScript библиотека для создания пользовательских интерфейсов.React — это JavaScript библиотека для создания пользовательских интерфейсов.React — это JavaScript библиотека для создания пользовательских интерфейсов.",
      },
      {
        user: "Как работают хуки в React?",
        assistant:
          "Хуки позволяют использовать состояние и другие возможности React в функциональных компонентах.",
      },
      {
        user: "Что такое TypeScript?",
        assistant:
          "TypeScript — это типизированная надстройка над JavaScript, которая компилируется в чистый JavaScript.",
      },
      {
        user: "Как работают хуки в React?",
        assistant:
          "Хуки позволяют использовать состояние и другие возможности React в функциональных компонентах.",
      },
      {
        user: "Что такое TypeScript?",
        assistant:
          "TypeScript — это типизированная надстройка над JavaScript, которая компилируется в чистый JavaScript.",
      },
      {
        user: "Как работают хуки в React?",
        assistant:
          "Хуки позволяют использовать состояние и другие возможности React в функциональных компонентах.",
      },
      {
        user: "Что такое TypeScript?",
        assistant:
          "TypeScript — это типизированная надстройка над JavaScript, которая компилируется в чистый JavaScript.",
      },
    ],
  },
  {
    id: "2",
    name: "Диалог о веб-разработке",
    dialogues: [
      {
        user: "Что такое CSS?",
        assistant:
          "CSS (Cascading Style Sheets) — это язык стилей, используемый для описания внешнего вида документа.",
      },
      {
        user: "Как работает Flexbox?",
        assistant:
          "Flexbox — это CSS модуль, который обеспечивает эффективный способ расположения элементов в контейнере.",
      },
    ],
  },
  {
    id: "3",
    name: "Диалог об искусственном интеллекте",
    dialogues: [
      {
        user: "Что такое машинное обучение?",
        assistant:
          "Машинное обучение — это раздел искусственного интеллекта, который позволяет компьютерам учиться без явного программирования.",
      },
      {
        user: "Чем отличается ИИ от машинного обучения?",
        assistant:
          "ИИ — это широкая область, а машинное обучение — это подмножество ИИ, сфокусированное на алгоритмах обучения.",
      },
      {
        user: "Что такое нейронные сети?",
        assistant:
          "Нейронные сети — это вычислительные модели, вдохновленные биологическими нейронными сетями.",
      },
    ],
  },
];

export const useDialogueFiles = () => {
  const [files, setFiles] = useState<DialogueFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки данных
    const loadFiles = async () => {
      setLoading(true);
      // Симулируем задержку сети
      await new Promise((resolve) => setTimeout(resolve, 500));
      setFiles(mockDialogueFiles);
      setLoading(false);
    };

    loadFiles();
  }, []);

  const updateDialogue = (
    fileId: string,
    dialogueIndex: number,
    updatedDialogue: DialogueEntry
  ) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === fileId
          ? {
              ...file,
              dialogues: file.dialogues.map((dialogue, index) =>
                index === dialogueIndex ? updatedDialogue : dialogue
              ),
            }
          : file
      )
    );
  };

  const deleteDialogue = (fileId: string, dialogueIndex: number) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === fileId
          ? {
              ...file,
              dialogues: file.dialogues.filter(
                (_, index) => index !== dialogueIndex
              ),
            }
          : file
      )
    );
  };

  return { files, loading, updateDialogue, deleteDialogue };
};
