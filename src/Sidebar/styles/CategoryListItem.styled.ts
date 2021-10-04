import styled from 'styled-components';
import { textEllipsis } from '../../styles/styled-components-utils/text-ellipsis.mixin';

export const ListItem = styled.li`
  display: flex;
  align-items: center;
  white-space: nowrap;
  padding: 3px 0 3px calc((var(--sidebar-width) - var(--icon-size)) / 2);
  height: 47px;
  cursor: pointer;
  border-bottom: 1px solid var(--white-7);
  
  > span {
    flex: 1;
    ${ textEllipsis };
  }

  &:first-child {
    border-top: 1px solid var(--white-7);
  }

  &:hover {
    background-color: var(--white-7);
  }

  > .icon {
    margin-right: calc((var(--sidebar-width) - var(--icon-size)) / 2);

    &.--selected {
      color: var(--primary);
    }
  }

  &.--edited {
    padding-top: 2px;
    padding-bottom: 2px;
  }

  > .category-name {
    margin-left: -8px;
    margin-right: 2px;
  }
`;