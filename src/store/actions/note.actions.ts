import { createAction } from '@reduxjs/toolkit';
import { NoteInterface } from '../../domain/interfaces/note.interface';
import { EntityUid } from '../../domain/types/entity-uid.type';
import { RemoveFromCategorySuccessPayload } from '../../domain/interfaces/remove-from-category-payload.interface';
import { RemoveMultipleNotesFromCategorySuccesPayload } from '../../domain/interfaces/remove-multiple-notes-from-category-payload.interface';
import { ArchiveOrDeleteOrRestoreMultipleNotesPayload } from '../../domain/interfaces/archive-or-delete-or-restore-multiple-notes-payload.interface';

const noteActions = {
  getNotes: createAction<void>('GET_NOTES'),
  getNotesSuccess: createAction<NoteInterface[]>('GET_NOTES_SUCCESS'),
  getNotesFail: createAction<void>('GET_NOTES_FAIL'),

  createNote: createAction<void>('CREATE_NOTE'),
  createNoteSuccess: createAction<NoteInterface>('CREATE_NOTE_SUCCESS'),
  createNoteFail: createAction<void>('CREATE_NOTES_FAIL'),

  toggleSelectionMode: createAction('TOGGLE_SELECTION_MODE'),
  selectNote: createAction<EntityUid>('SELECT_NOTE'),
  selectMultipleNotes: createAction<EntityUid[]>('SELECT_MULTIPLE_NOTES'),
  deselectNote: createAction<EntityUid>('DESELECT_NOTE'),
  clearSelection: createAction<void>('CLEAR_SELECTION'),

  setOpenedNote: createAction<NoteInterface>('SET_OPENED_NOTE'),
  clearOpenedNote: createAction<void>('CLEAR_OPENED_NOTE'),
  findOpenedNote: createAction<EntityUid>('FIND_OPENED_NOTE'),

  updateNote: createAction<void>('UPDATE_NOTE'),
  updateNoteSuccess: createAction<NoteInterface>('UPDATE_NOTE_SUCCESS'),
  updateNoteFail: createAction<void>('UPDATE_NOTE_FAIL'),

  revertNoteUpdate: createAction<void>('REVERT_NOTE_UPDATE'),
  revertNoteUpdateSuccess: createAction<NoteInterface>('REVERT_NOTE_UPDATE_SUCCESS'),
  revertNoteUpdateFail: createAction<void>('REVERT_NOTE_UPDATE_FAIL'),

  archiveNote: createAction<void>('ARCHIVE_NOTE'),
  archiveNoteSuccess: createAction<NoteInterface>('ARCHIVE_NOTE_SUCCESS'),
  archiveNoteFail: createAction<void>('ARCHIVE_NOTE_FAIL'),

  deleteNote: createAction<void>('DELETE_NOTE'),
  deleteNoteSuccess: createAction<NoteInterface>('DELETE_NOTE_SUCCESS'),
  deleteNoteFail: createAction<void>('DELETE_NOTE_FAIL'),

  restoreNote: createAction<void>('RESTORE_NOTE'),
  restoreNoteSuccess: createAction<NoteInterface>('RESTORE_NOTE_SUCCESS'),
  restoreNoteFail: createAction<void>('RESTORE_NOTE_FAIL'),

  deleteMultipleNotes: createAction<void>('DELETE_MULTIPLE_NOTES'),
  deleteMultipleNotesSuccess: createAction<ArchiveOrDeleteOrRestoreMultipleNotesPayload | EntityUid[]>('DELETE_MULTIPLE_NOTES_SUCCESS'),
  deleteMultipleNotesFail: createAction<void>('DELETE_MULTIPLE_NOTES_FAIL'),

  archiveMultipleNotes: createAction<void>('ARCHIVE_MULTIPLE_NOTES'),
  archiveMultipleNotesSuccess: createAction<ArchiveOrDeleteOrRestoreMultipleNotesPayload | EntityUid[]>('ARCHIVE_MULTIPLE_NOTES_SUCCESS'),
  archiveMultipleNotesFail: createAction<void>('ARCHIVE_MULTIPLE_NOTES_FAIL'),

  restoreMultipleNotes: createAction<void>('RESTORE_MULTIPLE_NOTES'),
  restoreMultipleNotesSuccess: createAction<ArchiveOrDeleteOrRestoreMultipleNotesPayload | EntityUid[]>('RESTORE_MULTIPLE_NOTES_SUCCESS'),
  restoreMultipleNotesFail: createAction<void>('RESTORE_MULTIPLE_NOTES_FAIL'),

  removeNoteFromCategory: createAction<void>('REMOVE_NOTE_FROM_CATEGORY'),
  removeNoteFromCategorySuccess: createAction<RemoveFromCategorySuccessPayload>('REMOVE_NOTE_FROM_CATEGORY_SUCCESS'),
  removeNoteFromCategoryFail: createAction<void>('REMOVE_NOTE_FROM_CATEGORY_FAIL'),

  restoreNoteToCategory: createAction<void>('RESTORE_NOTE_TO_CATEGORY'),
  restoreNoteToCategorySuccess: createAction<RemoveFromCategorySuccessPayload>('RESTORE_NOTE_TO_CATEGORY_SUCCESS'),
  restoreNoteToCategoryFail: createAction<void>('RESTORE_NOTE_TO_CATEGORY_FAIL'),

  removeMultipleNotesFromCategory: createAction<void>('REMOVE_MULTIPLE_NOTES_FROM_CATEGORY'),
  removeMultipleNotesFromCategorySuccess: createAction<RemoveMultipleNotesFromCategorySuccesPayload>('REMOVE_MULTIPLE_NOTES_FROM_CATEGORY_SUCCESS'),
  removeMultipleNotesFromCategoryFail: createAction<void>('REMOVE_MULTIPLE_NOTES_FROM_CATEGORY_FAIL'),

  restoreMultipleNotesToCategory: createAction<void>('RESTORE_MULTIPLE_NOTES_TO_CATEGORY'),
  restoreMultipleNotesToCategorySuccess: createAction<RemoveMultipleNotesFromCategorySuccesPayload>('RESTORE_MULTIPLE_NOTES_TO_CATEGORY_SUCCESS'),
  restoreMultipleNotesToCategoryFail: createAction<void>('RESTORE_MULTIPLE_NOTES_TO_CATEGORY_FAIL'),

  setShowArchived: createAction<boolean>('SET_SHOW_ARCHIVED'),
};

export default noteActions;