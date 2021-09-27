import styled from 'styled-components';

export const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;

  > input[type="checkbox"] {
    margin-right: 8px;
  }
`;

export const Checkbox = styled.input`
  appearance: none;
  width: 16px;
  height: 16px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;

  &:checked::after {
    content: '';
    width: 10px;
    height: 6px;
    transform: rotate(-45deg);
    color: var(--dark0);
    margin-bottom: 2px;
    border-left: 2px solid;
    border-bottom: 2px solid;
  }

  &:not(:disabled) {
    cursor: pointer;

    &:not(:checked) {
      background-color: var(--white-16);

      &:hover {
        background-color: var(--white-27);
      }
    }

    &:checked {
      background-color: var(--primary);

      &:hover {
        background-color: var(--primary100);
      }
    }
  }

  &:disabled {
    background-color: var(--white-7);

    &:checked {
      background-color: var(--primary400);

      &::after {
        color: var(--dark200)
      }
    }
  }
`;