import { ChangeEvent, ReactElement } from 'react';
import styled from 'styled-components';

interface Props {
  id: string;
  label: string;
  value: any;
  type?: 'text' | 'textarea';
  disabled?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const InputWithLabel = ({ id, label, value, type, disabled, onChange }: Props): ReactElement => {
  return (
    <Wrapper>
      <Label>{ label }</Label>
      { type === 'textarea'
        ? <TextArea id={ id } value={ value } disabled={ disabled } onChange={ onChange } />
        : <Input type="text" id={ id } value={ value } disabled={ disabled } onChange={ onChange } />
      }
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 4px;
  color: var(--white-64);
`;

const InputStyles = `
  padding: 8px 24px;
  font: inherit;
  background-color: var(--white-4);
  border-radius: 2px;
  line-height: 1.5;
  color: var(--white);
  outline: none;
  border: 2px solid transparent;

  &[disabled] {
    padding: 8px;
    background-color: transparent;
    resize: none;
  }
  
  &:not([disabled]):hover {
    background-color: var(--white-7);
  }
  
  &:not([disabled]):focus {
    border-color: var(--white-16);
  }
`;

const Input = styled.input`${ InputStyles }`;
const TextArea = styled.textarea`
  ${ InputStyles };
  min-height: 140px;
  resize: vertical;
`;