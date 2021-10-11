import { ReactElement } from 'react';
import { CreateNewFolder } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { AddCategoryButtonWrapper, StyledButton } from './styles/AddCategoryButton.styled';

interface Props {
  onClick: () => void;
}

export const AddCategoryButton = ({ onClick }: Props): ReactElement => {
  const { t } = useTranslation('SIDEBAR');
  return (
    <AddCategoryButtonWrapper>
      <StyledButton onClick={ onClick } className="button --icon --lighter --primary" type="button">
        <CreateNewFolder />
      </StyledButton>

      <span className="--primary">{ t('ADD_CATEGORY') }</span>
    </AddCategoryButtonWrapper>
  );
};