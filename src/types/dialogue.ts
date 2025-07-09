export interface DialogueEntry {
  user: string;
  assistant: string;
}

export interface Conversation {
  id: number;
  user: string;
  assistant: string;
  dataset_id: number;
}

export interface DatasetFile {
  id: number;
  name: string;
}

export interface DialogueFile extends DatasetFile {
  dialogues?: Conversation[];
}
