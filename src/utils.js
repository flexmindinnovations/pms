import {Home, Receipt, Users, Bell} from 'lucide-react';
import {notifications} from "@mantine/notifications";

export const utils = {
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
    pageConfig: {
        pageNumber: 1,
        pageSize: 10,
    },
    colPros: {
        noWrap: true,
        textAlign: 'center',
        width: 'auto',
        height: 50,
    },
    gradientButton: {
        color: 'white',
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
        backgroundImage: 'linear-gradient(to right, #9b4dca, #ec4899, #ef4444)',
        transition: 'opacity 0.3s ease'
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
        {
            id: 3,
            key: 'followUp',
            title: 'Follow Up',
            icon: Bell,
            route: 'follow-up',
            active: false,
            roles: ['ADMIN'],
        },
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
