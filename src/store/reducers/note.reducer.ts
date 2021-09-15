import { NoteState } from '../interfaces/note-state.interface';
import { Action } from '../../domain/interfaces/action.interface';
import { NoteActions } from '../actions/actions.enum';
import { NoteInterface } from '../../domain/interfaces/note.interface';
import { NoteSelectionMode } from '../../domain/enums/note-selection-mode.enum';

const initialState: NoteState = {
  notes: [],
  notesLoading: false,
  noteSelectionMode: NoteSelectionMode.Single,
  openedNote: null,
  noteCreationInProgress: false,
  noteUpdateInProgress: false,
  noteDeletionInProgress: false,
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

    case NoteActions.CHANGE_SELECTION_MODE: {
      return {
        ...state,
        noteSelectionMode: action.payload,
      };
    }

    case NoteActions.SET_OPENED_NOTE: {
      return {
        ...state,
        openedNote: action.payload,
      };
    }

    case NoteActions.DELETE_NOTE: {
      return {
        ...state,
        noteDeletionInProgress: true,
      };
    }

    case NoteActions.DELETE_NOTE_SUCCESS: {
      return {
        ...state,
        noteDeletionInProgress: false,
        notes: state.notes.filter((note) => note.id !== action.payload)
      };
    }

    case NoteActions.DELETE_NOTE_FAIL: {
      return {
        ...state,
        noteDeletionInProgress: false,
      };
    }

    case NoteActions.UPDATE_NOTE: {
      return {
        ...state,
        noteUpdateInProgress: true,
      };
    }

    case NoteActions.UPDATE_NOTE_SUCCESS: {
      const updated: NoteInterface = action.payload;
      return {
        ...state,
        noteUpdateInProgress: false,
        notes: state.notes.map((note) => note.id === updated.id ? updated : note)
      };
    }

    case NoteActions.UPDATE_NOTE_FAIL: {
      return {
        ...state,
        noteUpdateInProgress: false,
      };
    }
  }
  return state;
}