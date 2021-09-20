export enum NoteEditMode {
  None = 'None',
  Title = 'Title',
  Content = 'Content',
  Both = 'Both',
}

export const isEditMode = (mode: NoteEditMode): boolean => mode !== NoteEditMode.None;

export const isEditModeBoth = (mode: NoteEditMode): boolean => mode === NoteEditMode.Both;

export const toggleEditMode = (mode: NoteEditMode): NoteEditMode => (
  mode === NoteEditMode.None ? NoteEditMode.Both : NoteEditMode.None
);

export const isTitleEdited = (mode: NoteEditMode): boolean => (
  mode === NoteEditMode.Title || mode === NoteEditMode.Both
);

export const isContentEdited = (mode: NoteEditMode): boolean => (
  mode === NoteEditMode.Content || mode === NoteEditMode.Both
);
