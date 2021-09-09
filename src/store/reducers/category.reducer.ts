import { Action } from '../../domain/interfaces/action.interface';
import { CategoryActions } from '../actions/actions.enum';
import { CategoryState } from '../interfaces/category-state.interface';
import { rootCategory } from '../../domain/consts/root-category.const';
import { Category } from '../../domain/interfaces/category.interface';

const initialState: CategoryState = {
  categories: [],
  categoryCreationInProgress: false,
  categoriesLoading: false,
  selectedCategory: rootCategory,
  editedCategory: null,
  temporaryCategory: null,
  categoriesUpdating: false
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

    case CategoryActions.UPDATE_CATEGORIES_STARTED: {
      return {
        ...state,
        categoriesUpdating: true
      };
    }

    case CategoryActions.UPDATE_CATEGORY_SUCCESS: {
      const updatedCategory: Category = action.payload;
      return {
        ...state,
        categories: state.categories.map((category) => category.id === updatedCategory.id
          ? updatedCategory
          : category
        )
      };
    }

    case CategoryActions.UPDATE_CATEGORIES_FINISHED: {
      return {
        ...state,
        categoriesUpdating: false
      };
    }
  }
  return state;
}