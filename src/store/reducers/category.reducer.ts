import { Action } from '../../domain/interfaces/action.interface';
import { CategoryActions } from '../actions/actions.enum';
import { CategoryState } from '../interfaces/category-state.interface';
import { rootCategory } from '../../domain/consts/root-category.const';

const initialState: CategoryState = {
  categories: [],
  categoryCreationInProgress: false,
  categoriesLoading: false,
  selectedCategory: rootCategory,
  editedCategory: null,
  temporaryCategory: null,
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

    case CategoryActions.ADD_TEMPORARY_CATEGORY: {
      return {
        ...state,
        temporaryCategory: action.payload,
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
        categories: [...state.categories, action.payload],
        temporaryCategory: null,
        categoryCreationInProgress: false,
      };
    }

    case CategoryActions.CREATE_CATEGORY_FAIL: {
      return {
        ...state,
        categoryCreationInProgress: false,
      };
    }

    case CategoryActions.DELETE_TEMPORARY_CATEGORY: {
      return {
        ...state,
        temporaryCategory: null,
      };
    }

    case CategoryActions.SELECT_CATEGORY: {
      return {
        ...state,
        selectedCategory: action.payload,
      };
    }

    case CategoryActions.EDIT_CATEGORY: {
      return {
        ...state,
        editedCategory: action.payload,
      };
    }

    case CategoryActions.EDIT_CATEGORY_SUCCESS: {
      return {
        ...state,
        editedCategory: null
      };
    }
  }
  return state;
}