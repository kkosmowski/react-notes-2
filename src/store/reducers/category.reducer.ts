import { Action } from '../../domain/interfaces/action.interface';
import { CategoryActions } from '../actions/actions.enum';
import { CategoryState } from '../interfaces/category-state.interface';
import { rootCategory } from '../../domain/consts/root-category.const';

const initialState: CategoryState = {
  categories: [rootCategory],
  categoryCreationInProgress: false,
  categoriesLoading: false,
  selectedCategory: rootCategory
};

export function category(state: CategoryState = initialState, action: Action): CategoryState {
  switch (action.type) {
    case CategoryActions.GET_CATEGORIES: {
      return {
        ...state,
        categoriesLoading: true,
      };
    }

    case CategoryActions.GET_CATEGORIES_SUCCESS: {
      return {
        ...state,
        categories: action.payload,
        categoriesLoading: false,
      };
    }

    case CategoryActions.GET_CATEGORIES_FAIL: {
      return {
        ...state,
        categoriesLoading: false,
      };
    }
    case CategoryActions.CREATE_CATEGORY: {
      return {
        ...state,
        categoryCreationInProgress: true,
      };
    }

    case CategoryActions.CREATE_CATEGORY_SUCCESS: {
      return {
        ...state,
        categories: [action.payload, ...state.categories],
        categoryCreationInProgress: false,
      };
    }

    case CategoryActions.CREATE_CATEGORY_FAIL: {
      return {
        ...state,
        categoryCreationInProgress: false,
      };
    }

    case CategoryActions.SELECT_CATEGORY: {
      return {
        ...state,
        selectedCategory: action.payload,
      };
    }
  }
  return state;
}