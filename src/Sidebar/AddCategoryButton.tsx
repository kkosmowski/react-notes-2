import { ReactElement } from 'react';
import { CreateNewFolder } from '@material-ui/icons';

export const AddCategoryButton = (): ReactElement => {
  return (
    <button className="button --icon --lighter" type="button">
      <CreateNewFolder />
    </button>
  );
};