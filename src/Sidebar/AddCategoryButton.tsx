import { ReactElement } from 'react';
import { CreateNewFolder } from '@material-ui/icons';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface Props {
  onClick: () => void;
}

export const AddCategoryButton = ({ onClick }: Props): ReactElement => {
  const { t } = useTranslation('SIDEBAR');
  return (
    <AddCategoryButtonWrapper>
      <Button onClick={ onClick } className="button --icon --lighter --primary" type="button">
        <CreateNewFolder />
      </Button>

      <span className="--primary">{ t('ADD_CATEGORY') }</span>
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