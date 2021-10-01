import store from '../store/store';
import NoteActions from '../store/actionCreators/note.action-creators';
import { getMockedNote } from '../utils/get-mocked-note.util';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { AnyAction } from 'redux';
import { render, screen, waitFor } from '@testing-library/react';
import { NotesContainer } from '../NotesContainer/NotesContainer';
import { Provider } from 'react-redux';
import { noteSelectedTestId } from '../domain/consts/test-ids.consts';

describe('Note', () => {
  it('should be selected on action dispatch', () => {
    const note: NoteInterface = getMockedNote();
    return store
      .dispatch((NoteActions._getSuccess([note]) as unknown as AnyAction))
      .then(() => {
        return store
          .dispatch(NoteActions.selectNote(note.id) as unknown as AnyAction)
          .then(async () => {
            render(
              <Provider store={store}>
                <NotesContainer />
              </Provider>
            );

            await waitFor(() => {
              expect(screen.getByTestId(noteSelectedTestId)).toBeTruthy();
            });
          });
      });
  });
});