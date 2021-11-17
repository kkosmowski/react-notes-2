import { ChangeEvent, ReactElement } from 'react';
import { SelectOption } from './select-option.interface';
import styled from 'styled-components/macro';
import { Label } from '../Label/Label';
import { InputStyles } from '../Input/Input.styled';
import { useTranslation } from 'react-i18next';

interface Props {
  label?: string;
  options: SelectOption[];
  initialValue?: any;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const Select = ({ options, label, initialValue, onChange }: Props): ReactElement => {
  const { t } = useTranslation();

  return (
    <SelectWrapper>
      { label && <Label>{ label }</Label> }
      <StyledSelect onChange={ onChange }>
        { options.map(({ label, value, translate }) => (
          <option value={ value } key={ value } selected={ value === initialValue }>
            { translate ? t(label) : label }
          </option>
        ))}
      </StyledSelect>
    </SelectWrapper>
  );
};

const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &::after {
    position: absolute;
    content: '';
    width: 8px;
    height: 8px;
    color: var(--white-61);
    border-right: 1px solid;
    border-bottom: 1px solid;
    right: 10px;
    bottom: 15px;
    transform: rotate(45deg);
  }
`;

const StyledSelect = styled.select`
  appearance: none;
  ${ InputStyles };
  padding: 4px 32px 4px 20px;
  min-width: 80px;
`;