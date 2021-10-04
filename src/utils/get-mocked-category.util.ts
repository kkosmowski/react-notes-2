import { v4 } from 'uuid';
import { Category } from '../domain/interfaces/category.interface';

export const getMockedCategory = (): Category => ({
  id: v4(),
  name: 'Mocked category',
  deleted: false,
});