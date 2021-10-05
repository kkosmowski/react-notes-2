import { ReactElement } from 'react';
import { Snackbar } from './Snackbar';
import { StyledContainer } from './SnackbarContainer.styled';
import { useSelector } from 'react-redux';
import { selectSnackbarQueue } from '../store/selectors/ui.selectors';

export const SnackbarContainer = (): ReactElement => {
  const snackbarQueue = useSelector(selectSnackbarQueue);

  return (
    <StyledContainer>
      { snackbarQueue.map((snackbar) => (
        <Snackbar
          details={ snackbar.details }
          key={ snackbar.id }
        />
      )) }
    </StyledContainer>
  );
};
