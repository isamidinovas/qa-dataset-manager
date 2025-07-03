
export interface DialogueEntry {
  user: string;
  assistant: string;
}

export interface DialogueFile {
  id: string;
  name: string;
  dialogues: DialogueEntry[];
}
