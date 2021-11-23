import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { SelectOption } from './select-option.interface';
import styled from 'styled-components/macro';
import { Label } from '../Label/Label';
import { InputStyles } from '../Input/Input.styled';
import { useTranslation } from 'react-i18next';

interface Props {
  label?: string;
  options: SelectOption[];
  initialValue?: string | number;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export const Select = ({ options, label, initialValue, onChange }: Props): ReactElement => {
  const [value, setValue] = useState(initialValue);
  const { t } = useTranslation();

  useEffect(() => { setValue(initialValue); }, [initialValue]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setValue(e.target.value);
    onChange(e);
  };

  return (
    <SelectWrapper>
      { label && <Label>{ label }</Label> }
      <StyledSelect onChange={ handleChange } value={ value }>
        { options.map(({ label, value, translate }) => (
          <option value={ value } key={ value }>
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
    color: var(--foreground-61);
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
  
  @media (max-width: 599px) {
    width: 100%;
  }
`;
