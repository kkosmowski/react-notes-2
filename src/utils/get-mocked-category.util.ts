import { v4 } from 'uuid';
import { Category } from '../domain/interfaces/category.interface';

export const getMockedCategory = (partial: Partial<Category> = {}): Category => ({
  id: v4(),
  name: 'Mocked category',
  deleted: false,
  ...partial,
});