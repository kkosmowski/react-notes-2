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
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { App } from '../App';

describe('Note', () => {
  it('should be selected on action dispatch', () => {
    const note: NoteInterface = getMockedNote();
    return store
      .dispatch((NoteActions._getSuccess([note]) as unknown as AnyAction))
      .then(() => {
        return store
          .dispatch(NoteActions.selectNote(note.id) as unknown as AnyAction)
          .then(async () => {
            const history = createMemoryHistory();
            history.push('/');

            render(
              <Provider store={ store }>
                <Router history={ history }>
                  <NotesContainer />
                </Router>
              </Provider>
            );

            await waitFor(() => {
              expect(screen.getByTestId(noteSelectedTestId)).toBeTruthy();
            });
          });
      });
  });

  it('opens NoteDialog on double click', (done) => {
    const mockedNote = getMockedNote();
    store
      .dispatch((NoteActions._getSuccess([mockedNote]) as unknown as AnyAction))
      .then(async () => {
        const history = createMemoryHistory();
        history.push(`/note/${ mockedNote.id }`);

        render(
          <Provider store={ store }>
            <Router history={ history }>
              <App/>
            </Router>
          </Provider>
        );
      })
      .then(async () => {
        fireEvent.dblClick(await screen.findByTestId(noteTestId));

        expect(screen.getByTestId(noteDialogTestId)).toBeInTheDocument();
      })
      .catch();
  });

  it('open NoteDialog in edit mode on "Edit" context menu item click', () => {
    //
  });
});