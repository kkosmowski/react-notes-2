import { createAction } from '@reduxjs/toolkit';
import { NoteInterface } from '../../domain/interfaces/note.interface';
import { NoteSelectionMode } from '../../domain/enums/note-selection-mode.enum';

const noteActions = {
  getNotes: createAction<void>('GET_NOTES'),
  getNotesSuccess: createAction<NoteInterface[]>('GET_NOTES_SUCCESS'),
  getNotesFail: createAction<void>('GET_NOTES_FAIL'),

  createNote: createAction<void>('CREATE_NOTE'),
  createNoteSuccess: createAction<NoteInterface>('CREATE_NOTE_SUCCESS'),
  createNoteFail: createAction<void>('CREATE_NOTES_FAIL'),

  changeSelectionMode: createAction<NoteSelectionMode>('CHANGE_SELECTION_MODE'),

  setOpenedNote: createAction<NoteInterface | null>('SET_OPENED_NOTE'),

  updateNote: createAction<void>('UPDATE_NOTE'),
  updateNoteSuccess: createAction<NoteInterface>('UPDATE_NOTE_SUCCESS'),
  updateNoteFail: createAction<void>('UPDATE_NOTE_FAIL'),

  deleteNote: createAction<void>('DELETE_NOTE'),
  deleteNoteSuccess: createAction<NoteInterface>('DELETE_NOTE_SUCCESS'),
  deleteNoteFail: createAction<void>('DELETE_NOTE_FAIL'),

  restoreNote: createAction<void>('RESTORE_NOTE'),
  restoreNoteSuccess: createAction<NoteInterface>('RESTORE_NOTE_SUCCESS'),
  restoreNoteFail: createAction<void>('RESTORE_NOTE_FAIL'),
};

export default noteActions;