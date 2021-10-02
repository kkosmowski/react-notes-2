import { getMockedCategory } from './utils/get-mocked-category.util';
import CategoryActions from './store/actionCreators/category.action-creators';
import store from './store/store';
import { AnyAction } from 'redux';
import { getMockedNote } from './utils/get-mocked-note.util';
import NoteActions from './store/actionCreators/note.action-creators';
import { ProvidedApp } from './App';
import { render, screen, waitFor } from '@testing-library/react';
import { noteTestId } from './domain/consts/test-ids.consts';

describe('Category', () => {
  it('selecting a category filters notes assigned to this category', () => {
    const mockedCategory = getMockedCategory();
    const noteNotInAnyCategory = getMockedNote();
    const noteInMockedCategory = {
      ...getMockedNote(),
      categories: [mockedCategory.id]
    };

    render(<ProvidedApp />);

    return store
      .dispatch(CategoryActions._getSuccess([mockedCategory]) as unknown as AnyAction)
      .then(() => {
        return store
          .dispatch(NoteActions._getSuccess([noteNotInAnyCategory, noteInMockedCategory]) as unknown as AnyAction)
          .then(() => {
            return store
              .dispatch(CategoryActions.select(mockedCategory) as unknown as AnyAction)
              .then(async () => {
                await waitFor(() => {
                  expect(screen.queryAllByTestId(noteTestId)).toHaveLength(1);
                });
              })
              .catch();
          })
          .catch();
      })
      .catch();
  });
});