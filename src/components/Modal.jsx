import {useMediaQuery} from '@mantine/hooks';
import {Modal, useMantineTheme} from '@mantine/core';

/**
 * @typedef {import('@mantine/core').ModalProps & { title: string, isOpen: boolean, toggle: Function }} ModalWrapperProps
 */

/**
 * ModalWrapper component that wraps the Mantine Modal component with additional customization
 * @param {ModalWrapperProps} props - Props for the ModalWrapper component
 */
export default function ModalWrapper({
                                         children,
                                         isOpen,
                                         toggle,
                                         title,
                                         size = "lg",
                                         ...rest
                                     }) {
    const isMobile = useMediaQuery('(max-width: 50em)');
    const theme = useMantineTheme();

    const handleModalClose = () => {
        toggle();
    };

    return (
        <Modal
            opened={isOpen}
            onClose={handleModalClose}
            title={title}
            size={size}
            fullScreen={isMobile}
            centered
            transitionProps={{transition: 'scale', duration: 300, timingFunction: 'linear'}}
            radius="lg"
            withinPortal={true}
            styles={{
                title: {
                    fontSize: theme.fontSizes.sm
                }
            }}
            {...rest}
        >

            {children}
        </Modal>
    );
}
