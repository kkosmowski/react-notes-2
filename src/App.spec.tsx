import { getMockedCategory } from './utils/get-mocked-category.util';
import CategoryActions from './store/actionCreators/category.action-creators';
import store from './store/store';
import { AnyAction } from 'redux';
import { getMockedNote } from './utils/get-mocked-note.util';
import NoteActions from './store/actionCreators/note.action-creators';
import { ProvidedApp } from './App';
import { render, waitFor } from '@testing-library/react';
import { categoryTitleTestId, noteTestId } from './domain/consts/test-ids.consts';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Main } from './Main/Main';
import { Category } from './domain/interfaces/category.interface';
import { NoteInterface } from './domain/interfaces/note.interface';

describe('Category', () => {
  it('selecting a category filters notes assigned to this category', async () => {
    const mockedCategory: Category = getMockedCategory();
    const notesNotInAnyCategory: NoteInterface[] = [getMockedNote(), getMockedNote(), getMockedNote()];
    const notesInMockedCategory: NoteInterface[] = [
      getMockedNote({ categories: [mockedCategory.id] }),
      getMockedNote({ categories: [mockedCategory.id] }),
    ];

    const { getAllByTestId } = render(<ProvidedApp />);

    store.dispatch(CategoryActions._getSuccess([mockedCategory]) as unknown as AnyAction);
    store.dispatch(NoteActions._getSuccess([...notesNotInAnyCategory, ...notesInMockedCategory]) as unknown as AnyAction);
    store.dispatch(CategoryActions.change(mockedCategory.id) as unknown as AnyAction);

    await waitFor(() => {
      expect(getAllByTestId(noteTestId)).toHaveLength(notesInMockedCategory.length);
    });
  });

  it('is correctly selected when entering a specific URL', async () => {
    const mockedCategory = getMockedCategory({ name: 'Different name' });
    const categoryRoute = `/category/${ mockedCategory.id }`;

    const { getByTestId } = render(
      <MemoryRouter initialEntries={ [categoryRoute] }>
        <Provider store={ store }>
          <Main />
        </Provider>
      </MemoryRouter>
    );

    store.dispatch(CategoryActions._getSuccess([mockedCategory]) as unknown as AnyAction);

    await waitFor(() => {
      expect(getByTestId(categoryTitleTestId)).toHaveTextContent(mockedCategory.name);
    });
  });
});