import { getMockedNote } from '../utils/get-mocked-note.util';
import store from '../store/store';
import NoteActions from '../store/actionCreators/note.action-creators';
import { AnyAction } from 'redux';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import {
  confirmationDialogTestId,
  noteDialogBackdropTestId,
  noteDialogCancelButtonTestId,
  noteDialogCloseButtonTestId,
  noteDialogContentInputTestId,
  noteDialogDeleteButtonTestId,
  noteDialogEditModeButtonTestId,
  noteDialogSaveAndNextButtonTestId,
  noteDialogTestId,
  noteDialogTitleInputTestId,
  noteDialogTitleTestId
} from '../domain/consts/test-ids.consts';
import { NoteInterface } from '../domain/interfaces/note.interface';
import { Main } from '../Main/Main';
import userEvent from '@testing-library/user-event';

describe('NoteDialog', function() {
  const setupEmpty = () => {
    return render(
      <Provider store={ store }>
        <MemoryRouter initialEntries={ ['/add-note'] }>
          <Main />
        </MemoryRouter>
      </Provider>
    );
  };

  const setupWithNote = () => {
    const note: NoteInterface = getMockedNote();

    store.dispatch(NoteActions._getSuccess([note]) as unknown as AnyAction);

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

  it('opens on specific route', async () => {
    const { getByTestId } = setupEmpty();

    expect(getByTestId(noteDialogTestId)).toBeInTheDocument();
  });

  it('displays correct buttons and inputs in a Add note dialog', () => {
    const { getByTestId } = setupEmpty();
    const cancelButton = getByTestId(noteDialogCancelButtonTestId);
    const saveAndNextButton = getByTestId(noteDialogSaveAndNextButtonTestId);
    const closeButton = getByTestId(noteDialogCloseButtonTestId);

    expect(cancelButton).toHaveTextContent('Cancel');
    expect(saveAndNextButton).toHaveTextContent('Save & next');
    expect(closeButton).toHaveTextContent('Save & close');

    expect(cancelButton.classList).toContain('--regular');
    expect(saveAndNextButton.classList).toContain('--primary');
    expect(saveAndNextButton.classList).toContain('--contained');
    expect(closeButton.classList).toContain('--primary');
    expect(closeButton.classList).toContain('--contained');

    expect(saveAndNextButton).toBeDisabled();
    expect(closeButton).toBeDisabled();

    userEvent.type(getByTestId(noteDialogTitleInputTestId), 'some title');
    userEvent.type(getByTestId(noteDialogContentInputTestId), 'some content');

    expect(saveAndNextButton).toBeEnabled();
    expect(closeButton).toBeEnabled();
  });

  it('correctly displays existing Note', async () => {
    const { note, getByTestId } = setupWithNote();

    expect(getByTestId(noteDialogTestId)).toBeInTheDocument();
    expect(getByTestId(noteDialogTitleInputTestId)).toHaveValue(note.title);
    expect(getByTestId(noteDialogContentInputTestId)).toHaveValue(note.content);
  });

  it('displays confirmation dialog when clicking backdrop after input', async () => {
    const { getByTestId } = setupEmpty();

    userEvent.type(getByTestId(noteDialogTitleInputTestId), 'some text');
    userEvent.click(getByTestId(noteDialogBackdropTestId));

    expect(getByTestId(confirmationDialogTestId)).toBeInTheDocument();
  });

  it('changes to EditMode on edit button click', async () => {
    const { getByTestId } = setupWithNote();

    userEvent.click(getByTestId(noteDialogEditModeButtonTestId));

    expect(getByTestId(noteDialogTitleTestId)).toHaveTextContent('Edit note');
  });

  it('displays correct buttons and inputs in a dialog with Note', () => {
    const { getByTestId } = setupWithNote();
    const cancelButton = getByTestId(noteDialogCancelButtonTestId);
    const deleteButton = getByTestId(noteDialogDeleteButtonTestId);
    const closeButton = getByTestId(noteDialogCloseButtonTestId);

    expect(getByTestId(noteDialogCancelButtonTestId)).toHaveTextContent('Cancel');
    expect(getByTestId(noteDialogDeleteButtonTestId)).toHaveTextContent('Delete');
    expect(getByTestId(noteDialogCloseButtonTestId)).toHaveTextContent('Close');

    expect(cancelButton.classList).toContain('--regular');
    expect(deleteButton.classList).toContain('--warn');
    expect(deleteButton.classList).toContain('--contained');
    expect(closeButton.classList).toContain('--primary');
    expect(closeButton.classList).toContain('--contained');

    userEvent.click(getByTestId(noteDialogEditModeButtonTestId));

    expect(getByTestId(noteDialogCloseButtonTestId)).toHaveTextContent('Save & close');
  });
});