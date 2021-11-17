import { MouseEvent, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { SidebarButtonWrapper, StyledButton } from './styles/SidebarButton.styled';
import { Color } from '../domain/enums/color.enum';

interface Props {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  children: ReactElement;
  label: string;
  color?: Color;
}

export const SidebarButton = ({ onClick, children, label, color }: Props): ReactElement => {
  const { t } = useTranslation('SIDEBAR');
  return (
    <SidebarButtonWrapper>
      <StyledButton onClick={ onClick } className={ `button --icon --lighter ${ color }` } type="button">
        { children }
      </StyledButton>

      <span className={ color }>{ t(label) }</span>
    </SidebarButtonWrapper>
  );
};