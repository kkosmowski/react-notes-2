import { ChangeEvent, ReactElement } from 'react';
import styled from 'styled-components';

interface Props {
  id: string;
  label: string;
  value: any;
  type?: 'text' | 'textarea';
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const InputWithLabel = ({ id, label, value, type, onChange }: Props): ReactElement => {
  return (
    <Wrapper>
      <Label>{ label }</Label>
      { type === 'textarea'
        ? <TextArea id={ id } value={ value } onChange={ onChange } />
        : <Input type="text" id={ id } value={ value } onChange={ onChange } />
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
  
  &:hover {
    background-color: var(--white-7);
  }
  
  &:focus {
    border-color: var(--white-13);
  }
`;

const Input = styled.input`${ InputStyles }`;
const TextArea = styled.textarea`
  ${ InputStyles };
  resize: vertical;
`;