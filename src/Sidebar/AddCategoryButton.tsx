import { ReactElement } from 'react';
import { CreateNewFolder } from '@material-ui/icons';
import styled from 'styled-components';

export const AddCategoryButton = (): ReactElement => {
  return (
    <AddCategoryButtonWrapper>
      <Button className="button --icon --lighter --primary" type="button">
        <CreateNewFolder />
      </Button>

      <span className="--primary">Add new category</span>
    </AddCategoryButtonWrapper>
  );
};

const AddCategoryButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

const Button = styled.button`
  margin: 0 calc((var(--sidebar-width) - var(--icon-button-size)) / 2);
  flex-shrink: 0;
`;