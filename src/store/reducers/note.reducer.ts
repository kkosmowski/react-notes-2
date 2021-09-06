import { NoteState } from '../interfaces/note-state.interface';
import { Action } from '../../domain/interfaces/action.interface';
import { NoteActions } from '../actions/actions.enum';

const initialState: NoteState = {
  notes: [],
  openedNote: null,
  noteCreationInProgress: false
}

export function note(state: NoteState = initialState, action: Action): NoteState {
  switch (action.type) {
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
      }
    }

    case NoteActions.CREATE_NOTE_FAIL: {
      return {
        ...state,
        noteCreationInProgress: false,
      }
    }
  }
  return state;
}