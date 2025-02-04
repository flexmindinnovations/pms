import {useCallback} from 'react';
import {modals} from '@mantine/modals';

export function useModal(handleRefresh) {

    const openModal = useCallback(
        ({
             Component,
             data = null,
             mode = 'add',
             title = 'Add ',
             props = '',
             isAddEdit = true,
             size = 'lg',
             fullScreen = false,
             isView = false,
             handleRefresh,
             withCloseButton = false
         }) => {
            modals.closeAll();
            modals.open({
                title: isView ? title : `${isAddEdit ? (mode === 'edit' ? 'Update' : 'Add') : ''} ${title}`,
                centered: true,
                trapFocus: false,
                size,
                fullScreen,
                withCloseButton,
                classNames: {
                    body: `${props} !p-0 !overflow-hidden`,
                },
                styles: {
                    title: {fontWeight: '500', fontSize: '14px'},
                },
                children: (
                    <Component
                        mode={mode}
                        data={data}
                        handleCancel={(event) => {
                            const {refresh} = event;
                            if (refresh) handleRefresh({refresh});
                            modals.closeAll();
                        }}
                    />
                ),
            });
        },
        [handleRefresh]
    );

    return {openModal};
}
