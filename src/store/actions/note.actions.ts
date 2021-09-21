import { createAction } from '@reduxjs/toolkit';

// @todo add generic types, e.g.: `createAction<NoteInterface>('note/createNote')`
const noteActions = {
  getNotes: createAction('note/getNotes'),
  getNotesSuccess: createAction('note/getNotesSuccess'),
  getNotesFail: createAction('note/getNotesFail'),

  createNote: createAction('note/createNote'),
  createNoteSuccess: createAction('note/createNoteSuccess'),
  createNoteFail: createAction('note/createNoteFail'),

  changeSelectionMode: createAction('note/changeSelectionMode'),

  setOpenedNote: createAction('note/setOpenedNote'),

  updateNote: createAction('note/updateNote'),
  updateNoteSuccess: createAction('note/updateNoteSuccess'),
  updateNoteFail: createAction('note/updateNoteFail'),

  deleteNote: createAction('note/deleteNote'),
  deleteNoteSuccess: createAction('note/deleteNoteSuccess'),
  deleteNoteFail: createAction('note/deleteNoteFail'),
};

export default noteActions;