import styled from 'styled-components/macro';
import { transition } from '../styles/styled-components-utils/transition.mixin';
import { InputStyles } from '../Input/Input.styled';

export const SelectWrapper = styled.div<{ opened: boolean }>`
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
    ${ ({ opened }) => `transform: translateY(${ opened ? '17px' : '13px' }) rotate(${ opened ? '585deg' : '45deg' });` }
    ${ transition('transform', '0.3s') }
  }
`;

export const CustomSelect = styled.div`
  position: relative;
  display: inline-block;
  ${ InputStyles };
  padding: 4px 32px 4px 20px;
  min-width: 140px;
  
  @media (max-width: 599px) {
    width: 100%;
  }
`;

export const CurrentOption = styled.span`
  white-space: nowrap;
`;

export const OptionsContainer = styled.div<{ visible: boolean }>`
  position: absolute;
  z-index: 100;
  left: 0;
  top: 100%;
  width: 100%;
  max-height: 300px;
  overflow: auto;
  ${ ({ visible }) => `display: ${ visible ? 'flex' : 'none' };` }
  flex-direction: column;
`;

export const Option = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 0 16px;
  height: 40px;
  background-color: var(--background150);
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    background-color: var(--background250);
  }
`;