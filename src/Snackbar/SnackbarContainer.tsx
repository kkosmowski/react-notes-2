import { ReactElement } from 'react';
import { Snackbar } from './Snackbar';
import { StyledContainer } from './SnackbarContainer.styled';
import { useSelector } from 'react-redux';
import { selectSnackbarQueue } from '../store/selectors/ui.selectors';

export const SnackbarContainer = (): ReactElement => {
  const snackbarQueue = useSelector(selectSnackbarQueue);

  return (
    <StyledContainer>
      { snackbarQueue.map((instance) => (
        <Snackbar
          id={ instance.id }
          details={ instance.details }
          key={ instance.id }
        />
      )) }
    </StyledContainer>
  );
};
