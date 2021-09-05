import { NoteActions, UiActions } from '../../store/actions/actions.enum';

export interface Action {
  type: UiActions | NoteActions;
  payload?: any;
  error?: any;
}