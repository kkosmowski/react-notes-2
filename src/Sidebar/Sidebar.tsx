import { ReactElement, useState } from 'react';
import { Backdrop } from '../Backdrop/Backdrop';
import { AddCategoryButton } from './AddCategoryButton';
import { CategoriesList } from './CategoriesList';
import { RootState } from '../store/interfaces/root-state.interface';
import { bindActionCreators, Dispatch } from 'redux';
import * as uiActions from '../store/actionCreators/ui.action-creators';
import { connect } from 'react-redux';
import { SidebarWrapper } from './styles/Sidebar.styles';

interface Props {
  opened: boolean;
  uiActions: any;
}

export const SidebarComponent = ({ opened, uiActions }: Props): ReactElement => {
  const [addCategory, setAddCategory] = useState<void[]>([]); // @todo temporary hack

  const handleCategoryAdd = (): void => {
    setAddCategory([...addCategory]);
  };

  const handleSidebarClose = (): void => {
    uiActions.closeSidebar();
  };

  return (
    <>
      <SidebarWrapper className={ opened ? '--opened' : '' }>
        <AddCategoryButton onClick={ handleCategoryAdd } />
        <CategoriesList add={ addCategory } />
      </SidebarWrapper>
      <Backdrop onClick={ handleSidebarClose } className="sidebar-backdrop" />
    </>
  );
};

const mapStateToProps = ({ ui }: RootState) => ({
  opened: ui.sidebarOpened,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  uiActions: bindActionCreators(uiActions, dispatch),
});

export const Sidebar = connect(mapStateToProps, mapDispatchToProps)(SidebarComponent);
