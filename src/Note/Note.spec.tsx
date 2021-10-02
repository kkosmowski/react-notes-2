import store from '../store/store';
import NoteActions from '../store/actionCreators/note.action-creators';
import { getMockedNote } from '../utils/get-mocked-note.util';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { AnyAction } from 'redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { NotesContainer } from '../NotesContainer/NotesContainer';
import { Provider } from 'react-redux';
import { noteDialogTestId, noteSelectedTestId, noteTestId } from '../domain/consts/test-ids.consts';
import { Main } from '../Main/Main';

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

  it('opens NoteDialog on double click', (done) => {
    store
      .dispatch((NoteActions._getSuccess([getMockedNote()]) as unknown as AnyAction))
      .then(async () => {
        render(
          <Provider store={ store }>
            <Main />
          </Provider>
        );
        fireEvent.dblClick(screen.getByTestId(noteTestId));
        expect(screen.queryByTestId(noteDialogTestId)).toBeTruthy();
        done();
      })
      .catch(() => {
        done();
      });
  });
});