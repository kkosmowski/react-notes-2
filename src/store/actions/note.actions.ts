import { NoteActions } from './actions.enum';
import { ActionFunction } from '../../domain/types/action-function.type';
import { Dispatch } from 'redux';
import { HttpService } from '../../services/http.service';
import { Note } from '../../domain/interfaces/note.interface';

export function add(formValue: Note): ActionFunction<Promise<void>> {
  return function (dispatch: Dispatch): Promise<void> {
    dispatch({ type: NoteActions.ADD_NOTE });
    return HttpService
      .post<Note>('/notes', formValue)
      .then((x: any) => console.log(x))
  };
}
