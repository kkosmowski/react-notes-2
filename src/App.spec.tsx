import { getMockedCategory } from './utils/get-mocked-category.util';
import CategoryActions from './store/actionCreators/category.action-creators';
import store from './store/store';
import { AnyAction } from 'redux';
import { getMockedNote } from './utils/get-mocked-note.util';
import NoteActions from './store/actionCreators/note.action-creators';
import { App, ProvidedApp } from './App';
import { render, screen, waitFor } from '@testing-library/react';
import { categoryTitleTestId, noteTestId } from './domain/consts/test-ids.consts';
import { MemoryRouter, Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Main } from './Main/Main';
import { mockStore } from './utils/mock.store';
import { initialRootState } from './utils/initial-root-state';
import { initialCategoryState } from './store/reducers/category.reducer';
import { createMemoryHistory } from 'history';
import { MockStoreEnhanced } from 'redux-mock-store';
import { RootState } from './store/interfaces/root-state.interface';

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
              .dispatch(CategoryActions.change(mockedCategory.id) as unknown as AnyAction)
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

  it('is correctly selected when entering a specific URL', async () => {
    const mockedCategory = getMockedCategory({ name: 'Different name' });
    const categoryRoute = `/category/${ mockedCategory.id }`;

    render(
      <MemoryRouter initialEntries={ [categoryRoute] }>
        <Provider store={ store }>
          <Main />
        </Provider>
      </MemoryRouter>
    );

    return store
      .dispatch(CategoryActions._getSuccess([mockedCategory]) as unknown as AnyAction)
      .then(async () => {
        await waitFor(() => {
          expect(screen.queryByTestId(categoryTitleTestId)).toHaveTextContent(mockedCategory.name);
        });
      })
      .catch();
  });
});