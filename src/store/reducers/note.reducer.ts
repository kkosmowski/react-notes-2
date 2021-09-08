import { NoteState } from '../interfaces/note-state.interface';
import { Action } from '../../domain/interfaces/action.interface';
import { NoteActions } from '../actions/actions.enum';
import { NoteInterface } from '../../domain/interfaces/note.interface';

const initialState: NoteState = {
  notes: [],
  notesLoading: false,
  openedNote: null,
  noteCreationInProgress: false
};

export function note(state: NoteState = initialState, action: Action): NoteState {
  switch (action.type) {
    case NoteActions.GET_NOTES: {
      return {
        ...state,
        notesLoading: true,
      };
    }

    case NoteActions.GET_NOTES_SUCCESS: {
      return {
        ...state,
        notes: (action.payload as NoteInterface[]).reverse(),
        notesLoading: false,
      };
    }

    case NoteActions.GET_NOTES_FAIL: {
      return {
        ...state,
        notesLoading: false,
      };
    }

    case NoteActions.CREATE_NOTE: {
      return {
        ...state,
        noteCreationInProgress: true,
      };
    }

    case NoteActions.CREATE_NOTE_SUCCESS: {
      return {
        ...state,
        notes: [action.payload, ...state.notes],
        noteCreationInProgress: false,
      };
    }

    case NoteActions.CREATE_NOTE_FAIL: {
      return {
        ...state,
        noteCreationInProgress: false,
      };
    }
  }
  return state;
}