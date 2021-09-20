import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-bottom: 4px;
  color: var(--white-64);
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
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

export const Input = styled.input`${ InputStyles }`;

export const TextArea = styled.textarea`
  ${ InputStyles };
  min-height: 140px;
  resize: vertical;
`;