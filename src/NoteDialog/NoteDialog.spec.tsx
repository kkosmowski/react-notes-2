import { getMockedNote } from '../utils/get-mocked-note.util';
import store from '../store/store';
import NoteActions from '../store/actionCreators/note.action-creators';
import { AnyAction } from 'redux';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Router } from 'react-router-dom';
import {
  noteDialogContentInputTestId,
  noteDialogEditModeButtonTestId,
  noteDialogTestId, noteDialogTitleInputTestId,
  noteDialogTitleTestId
} from '../domain/consts/test-ids.consts';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { createMemoryHistory } from 'history';
import { Main } from '../Main/Main';
import userEvent from '@testing-library/user-event';

describe('NoteDialog', function() {
  const setup = () => {
    const note: NoteInterface = getMockedNote();
    const history = createMemoryHistory();

    store.dispatch(NoteActions._getSuccess([note]) as unknown as AnyAction);

    history.push(`/note/${ note.id }`);

    return {
      note,
      ...render(
        <Provider store={ store }>
          <MemoryRouter initialEntries={ [`/note/${ note.id }`] }>
            <Main />
          </MemoryRouter>
        </Provider>
      ),
    };
  };

  it('correctly displays existing Note', async () => {
    const { note, getByTestId } = setup();

    expect(getByTestId(noteDialogTestId)).toBeInTheDocument();
    expect(getByTestId(noteDialogTitleInputTestId)).toHaveValue(note.title);
    expect(getByTestId(noteDialogContentInputTestId)).toHaveValue(note.content);
  });

  it('changes to EditMode on edit button click', async () => {
    const { getByTestId } = setup();

    userEvent.click(getByTestId(noteDialogEditModeButtonTestId));

    expect(getByTestId(noteDialogTitleTestId)).toHaveTextContent('Edit note');
  });
});