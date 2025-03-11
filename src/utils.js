import {Home, Receipt, Users, Bell} from 'lucide-react';
import {notifications} from "@mantine/notifications";

export const utils = {
    brandName: 'SHASHIB',
    showNotifications: (title, message, variant = 'success' | 'error', theme) => (
        notifications.show({
            title: title,
            color: variant == 'success' ? theme.colors.green[9] : theme.colors.red[9],
            message: message,
            withCloseButton: false,
            withBorder: true,
            styles: {
                title: {
                    color: variant == 'success' ? theme.colors.green[9] : theme.colors.red[9],
                    fontSize: theme.fontSizes.lg
                },
                body: {color: variant == 'success' ? theme.colors.green[9] : theme.colors.red[9]},
                icon: {color: variant == 'success' ? theme.colors.green[9] : theme.colors.red[9]},
            }
        })
    ),
    pageConfig: Object.freeze({
        pageNumber: '1',
        pageSize: '-1',
    }),
    colPros: {
        noWrap: true,
        textAlign: 'center',
        width: 'auto',
        height: 50,
        padding: '10px'
    },
    gradientButton: {
        color: 'white',
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
        backgroundImage: 'linear-gradient(to right, #9b4dca, #ec4899, #ef4444)',
        transition: 'opacity 0.3s ease'
    },
    parentVariants: {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                when: "beforeChildren",
            },
        },
    },
    childVariants: {
        hidden: {opacity: 0, x: -20},
        visible: {
            opacity: 1,
            x: 0,
            transition: {type: "spring", stiffness: 150, damping: 20}
        },
    },
    truncateText: (text, maxLength) => {
        if(!text) return '';
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + '...';
    },
    menuItems: [
        {
            id: 1,
            key: 'recoveryCampaign',
            title: 'Recovery Campaign',
            icon: Home,
            route: '',
            active: false,
            roles: ['ADMIN'],
        },
        {
            id: 2,
            key: 'recoveryAgent',
            title: 'Recovery Agent',
            icon: Receipt,
            route: 'recovery-agent',
            active: false,
            roles: ['ADMIN'],
        },
        // {
        //     id: 3,
        //     key: 'followUp',
        //     title: 'Follow Up',
        //     icon: Bell,
        //     route: 'follow-up',
        //     active: false,
        //     roles: ['ADMIN'],
        // },
        {
            id: 4,
            key: 'students',
            title: 'Students',
            icon: Users,
            route: 'students',
            active: false,
            roles: ['ADMIN', 'TEACHER'],
        },
    ]
}
