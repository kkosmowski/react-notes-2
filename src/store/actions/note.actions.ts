import { createAction } from '@reduxjs/toolkit';
import { NoteInterface } from '../../domain/interfaces/note.interface';
import { EntityUid } from '../../domain/types/entity-uid.type';
import { RemoveMultipleNotesFromCategorySuccesPayload } from '../../domain/interfaces/remove-multiple-notes-from-category-payload.interface';
import { ArchiveOrDeleteOrRestoreMultipleNotesPayload } from '../../domain/interfaces/archive-or-delete-or-restore-multiple-notes-payload.interface';
import { NoteSelectionMode } from '../../domain/enums/note-selection-mode.enum';
import { UpdateMultipleNotesPayload } from '../../domain/interfaces/update-multiple-notes.payload';
import { AddNoteCategoriesPayload } from '../../domain/interfaces/add-note-categories-payload.interface';

const noteActions = {
  getNotes: createAction<void>('GET_NOTES'),
  getNotesSuccess: createAction<NoteInterface[]>('GET_NOTES_SUCCESS'),

  createNote: createAction<void>('CREATE_NOTE'),
  createNoteSuccess: createAction<NoteInterface>('CREATE_NOTE_SUCCESS'),

  toggleSelectionMode: createAction<void>('TOGGLE_SELECTION_MODE'),
  setSelectionMode: createAction<NoteSelectionMode>('SET_SELECTION_MODE'),

  selectNote: createAction<EntityUid>('SELECT_NOTE'),
  selectMultipleNotes: createAction<EntityUid[]>('SELECT_MULTIPLE_NOTES'),
  deselectNote: createAction<EntityUid>('DESELECT_NOTE'),
  clearSelection: createAction<void>('CLEAR_SELECTION'),

  setOpenedNote: createAction<NoteInterface>('SET_OPENED_NOTE'),
  clearOpenedNote: createAction<void>('CLEAR_OPENED_NOTE'),
  findOpenedNote: createAction<EntityUid>('FIND_OPENED_NOTE'),

  updateNote: createAction<void>('UPDATE_NOTE'),
  updateNoteSuccess: createAction<NoteInterface>('UPDATE_NOTE_SUCCESS'),

  updateMultipleNotes: createAction<void>('UPDATE_MULTIPLE_NOTES'),
  updateMultipleNotesSuccess: createAction<UpdateMultipleNotesPayload>('UPDATE_MULTIPLE_NOTES_SUCCESS'),

  revertNoteUpdate: createAction<void>('REVERT_NOTE_UPDATE'),
  revertNoteUpdateSuccess: createAction<NoteInterface>('REVERT_NOTE_UPDATE_SUCCESS'),

  archiveNote: createAction<void>('ARCHIVE_NOTE'),
  archiveNoteSuccess: createAction<NoteInterface>('ARCHIVE_NOTE_SUCCESS'),

  deleteNote: createAction<void>('DELETE_NOTE'),
  deleteNoteSuccess: createAction<NoteInterface>('DELETE_NOTE_SUCCESS'),

  restoreNote: createAction<void>('RESTORE_NOTE'),
  restoreNoteSuccess: createAction<NoteInterface>('RESTORE_NOTE_SUCCESS'),

  deleteMultipleNotes: createAction<void>('DELETE_MULTIPLE_NOTES'),
  deleteMultipleNotesSuccess: createAction<ArchiveOrDeleteOrRestoreMultipleNotesPayload | EntityUid[]>('DELETE_MULTIPLE_NOTES_SUCCESS'),

  archiveMultipleNotes: createAction<void>('ARCHIVE_MULTIPLE_NOTES'),
  archiveMultipleNotesSuccess: createAction<ArchiveOrDeleteOrRestoreMultipleNotesPayload | EntityUid[]>('ARCHIVE_MULTIPLE_NOTES_SUCCESS'),

  restoreMultipleNotes: createAction<void>('RESTORE_MULTIPLE_NOTES'),
  restoreMultipleNotesSuccess: createAction<ArchiveOrDeleteOrRestoreMultipleNotesPayload | EntityUid[]>('RESTORE_MULTIPLE_NOTES_SUCCESS'),

  removeNoteFromCategory: createAction<void>('REMOVE_NOTE_FROM_CATEGORY'),
  removeNoteFromCategorySuccess: createAction<NoteInterface>('REMOVE_NOTE_FROM_CATEGORY_SUCCESS'),

  restoreNoteToCategory: createAction<void>('RESTORE_NOTE_TO_CATEGORY'),
  restoreNoteToCategorySuccess: createAction<NoteInterface>('RESTORE_NOTE_TO_CATEGORY_SUCCESS'),

  removeMultipleNotesFromCategory: createAction<void>('REMOVE_MULTIPLE_NOTES_FROM_CATEGORY'),
  removeMultipleNotesFromCategorySuccess: createAction<RemoveMultipleNotesFromCategorySuccesPayload>('REMOVE_MULTIPLE_NOTES_FROM_CATEGORY_SUCCESS'),

  restoreMultipleNotesToCategory: createAction<void>('RESTORE_MULTIPLE_NOTES_TO_CATEGORY'),
  restoreMultipleNotesToCategorySuccess: createAction<RemoveMultipleNotesFromCategorySuccesPayload>('RESTORE_MULTIPLE_NOTES_TO_CATEGORY_SUCCESS'),

  fetchShowArchived: createAction<void>('FETCH_SHOW_ARCHIVED'),
  fetchShowArchivedSuccess: createAction<boolean>('FETCH_SHOW_ARCHIVED_SUCCESS'),

  setShowArchived: createAction<void>('SET_SHOW_ARCHIVED'),
  setShowArchivedSuccess: createAction<boolean>('SET_SHOW_ARCHIVED_SUCCESS'),

  addCategories: createAction<void>('ADD_CATEGORIES_TO_NOTE'),
  addCategoriesSuccess: createAction<AddNoteCategoriesPayload>('ADD_CATEGORIES_SUCCESS_TO_NOTE'),
};

export default noteActions;