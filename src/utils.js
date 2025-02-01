import {Home, Users} from 'lucide-react';
import {notifications} from "@mantine/notifications";

export const utils = {
    showNotifications: (title, message, variant = 'success' | 'error', theme) => (
        notifications.show({
            title: title,
            color:  variant == 'success' ? theme.colors.green[9] : theme.colors.red[9],
            message: message,
            withCloseButton: false,
            withBorder: true,
            styles: {
                title: {color: variant == 'success' ? theme.colors.green[9] : theme.colors.red[9], fontSize: theme.fontSizes.lg},
                body: {color: variant == 'success' ? theme.colors.green[9] : theme.colors.red[9]},
                icon: {color: variant == 'success' ? theme.colors.green[9] : theme.colors.red[9]},
            }
        })
    ),
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
            key: 'students',
            title: 'Students',
            icon: Users,
            route: 'students',
            active: false,
            roles: ['ADMIN', 'TEACHER'],
        },
    ]
}

const studentData = [
    { id: 1, name: 'John Doe', institute: 'Harvard University', batch: '2025-A', phone: '9876543210', guardianPhone: '9888776655', email: 'john.doe@example.com', guardianEmail: 'guardian.john@example.com' },
    { id: 2, name: 'Jane Smith', institute: 'MIT', batch: '2024-B', phone: '9876543201', guardianPhone: '9888776644', email: 'jane.smith@example.com', guardianEmail: 'guardian.jane@example.com' },
    { id: 3, name: 'Michael Johnson', institute: 'Stanford University', batch: '2023-C', phone: '9876543202', guardianPhone: '9888776633', email: 'michael.johnson@example.com', guardianEmail: 'guardian.michael@example.com' },
    { id: 4, name: 'Emily Davis', institute: 'University of California', batch: '2026-A', phone: '9876543203', guardianPhone: '9888776622', email: 'emily.davis@example.com', guardianEmail: 'guardian.emily@example.com' },
    { id: 5, name: 'David Martinez', institute: 'Princeton University', batch: '2024-C', phone: '9876543204', guardianPhone: '9888776611', email: 'david.martinez@example.com', guardianEmail: 'guardian.david@example.com' },
    { id: 6, name: 'Sarah Garcia', institute: 'Yale University', batch: '2023-A', phone: '9876543205', guardianPhone: '9888776600', email: 'sarah.garcia@example.com', guardianEmail: 'guardian.sarah@example.com' },
    { id: 7, name: 'Christopher Lee', institute: 'Columbia University', batch: '2025-B', phone: '9876543206', guardianPhone: '9888776599', email: 'christopher.lee@example.com', guardianEmail: 'guardian.christopher@example.com' },
    { id: 8, name: 'Sophia Anderson', institute: 'California Institute of Technology', batch: '2024-A', phone: '9876543207', guardianPhone: '9888776588', email: 'sophia.anderson@example.com', guardianEmail: 'guardian.sophia@example.com' },
    { id: 9, name: 'Daniel Wilson', institute: 'University of Chicago', batch: '2026-B', phone: '9876543208', guardianPhone: '9888776577', email: 'daniel.wilson@example.com', guardianEmail: 'guardian.daniel@example.com' },
    { id: 10, name: 'Olivia Moore', institute: 'Cornell University', batch: '2023-B', phone: '9876543209', guardianPhone: '9888776566', email: 'olivia.moore@example.com', guardianEmail: 'guardian.olivia@example.com' },
    { id: 11, name: 'Aiden Thompson', institute: 'University of Oxford', batch: '2025-C', phone: '9876543210', guardianPhone: '9888776555', email: 'aiden.thompson@example.com', guardianEmail: 'guardian.aiden@example.com' },
    { id: 12, name: 'Charlotte White', institute: 'Harvard University', batch: '2024-A', phone: '9876543211', guardianPhone: '9888776544', email: 'charlotte.white@example.com', guardianEmail: 'guardian.charlotte@example.com' },
    { id: 13, name: 'Mason Clark', institute: 'Princeton University', batch: '2026-A', phone: '9876543212', guardianPhone: '9888776533', email: 'mason.clark@example.com', guardianEmail: 'guardian.mason@example.com' },
    { id: 14, name: 'Lily Rodriguez', institute: 'Stanford University', batch: '2023-C', phone: '9876543213', guardianPhone: '9888776522', email: 'lily.rodriguez@example.com', guardianEmail: 'guardian.lily@example.com' },
    { id: 15, name: 'Lucas Perez', institute: 'MIT', batch: '2025-A', phone: '9876543214', guardianPhone: '9888776511', email: 'lucas.perez@example.com', guardianEmail: 'guardian.lucas@example.com' },
    { id: 16, name: 'Harper Lewis', institute: 'University of California', batch: '2024-B', phone: '9876543215', guardianPhone: '9888776500', email: 'harper.lewis@example.com', guardianEmail: 'guardian.harper@example.com' },
    { id: 17, name: 'Sebastian Walker', institute: 'Yale University', batch: '2026-C', phone: '9876543216', guardianPhone: '9888776499', email: 'sebastian.walker@example.com', guardianEmail: 'guardian.sebastian@example.com' },
    { id: 18, name: 'Ethan Hall', institute: 'University of Chicago', batch: '2023-A', phone: '9876543217', guardianPhone: '9888776488', email: 'ethan.hall@example.com', guardianEmail: 'guardian.ethan@example.com' },
    { id: 19, name: 'Ella Allen', institute: 'California Institute of Technology', batch: '2025-B', phone: '9876543218', guardianPhone: '9888776477', email: 'ella.allen@example.com', guardianEmail: 'guardian.ella@example.com' },
    { id: 20, name: 'Benjamin Young', institute: 'Columbia University', batch: '2024-A', phone: '9876543219', guardianPhone: '9888776466', email: 'benjamin.young@example.com', guardianEmail: 'guardian.benjamin@example.com' },
    { id: 21, name: 'Amelia King', institute: 'University of Oxford', batch: '2026-A', phone: '9876543220', guardianPhone: '9888776455', email: 'amelia.king@example.com', guardianEmail: 'guardian.amelia@example.com' },
    { id: 22, name: 'James Scott', institute: 'MIT', batch: '2025-C', phone: '9876543221', guardianPhone: '9888776444', email: 'james.scott@example.com', guardianEmail: 'guardian.james@example.com' },
    { id: 23, name: 'Grace Harris', institute: 'Harvard University', batch: '2023-B', phone: '9876543222', guardianPhone: '9888776433', email: 'grace.harris@example.com', guardianEmail: 'guardian.grace@example.com' },
    { id: 24, name: 'Alexander Robinson', institute: 'Stanford University', batch: '2024-A', phone: '9876543223', guardianPhone: '9888776422', email: 'alexander.robinson@example.com', guardianEmail: 'guardian.alexander@example.com' },
    { id: 25, name: 'Maya Martinez', institute: 'Princeton University', batch: '2025-B', phone: '9876543224', guardianPhone: '9888776411', email: 'maya.martinez@example.com', guardianEmail: 'guardian.maya@example.com' },
    { id: 26, name: 'Jack Carter', institute: 'University of California', batch: '2026-B', phone: '9876543225', guardianPhone: '9888776400', email: 'jack.carter@example.com', guardianEmail: 'guardian.jack@example.com' },
    { id: 27, name: 'Liam Mitchell', institute: 'Yale University', batch: '2024-B', phone: '9876543226', guardianPhone: '9888776399', email: 'liam.mitchell@example.com', guardianEmail: 'guardian.liam@example.com' },
    { id: 28, name: 'Chloe Perez', institute: 'California Institute of Technology', batch: '2025-A', phone: '9876543227', guardianPhone: '9888776388', email: 'chloe.perez@example.com', guardianEmail: 'guardian.chloe@example.com' },
    { id: 29, name: 'Logan Nelson', institute: 'Columbia University', batch: '2026-C', phone: '9876543228', guardianPhone: '9888776377', email: 'logan.nelson@example.com', guardianEmail: 'guardian.logan@example.com' },
    { id: 30, name: 'Zoe Clark', institute: 'University of Oxford', batch: '2023-C', phone: '9876543229', guardianPhone: '9888776366', email: 'zoe.clark@example.com', guardianEmail: 'guardian.zoe@example.com' },
    { id: 31, name: 'Ryan Lee', institute: 'Harvard University', batch: '2025-C', phone: '9876543230', guardianPhone: '9888776355', email: 'ryan.lee@example.com', guardianEmail: 'guardian.ryan@example.com' },
    { id: 32, name: 'Avery White', institute: 'Princeton University', batch: '2024-B', phone: '9876543231', guardianPhone: '9888776344', email: 'avery.white@example.com', guardianEmail: 'guardian.avery@example.com' },
    { id: 33, name: 'Eleanor Brown', institute: 'Stanford University', batch: '2025-A', phone: '9876543232', guardianPhone: '9888776333', email: 'eleanor.brown@example.com', guardianEmail: 'guardian.eleanor@example.com' },
    { id: 34, name: 'Jackie Wilson', institute: 'University of California', batch: '2026-A', phone: '9876543233', guardianPhone: '9888776322', email: 'jackie.wilson@example.com', guardianEmail: 'guardian.jackie@example.com' },
    { id: 35, name: 'Samuel Lee', institute: 'Yale University', batch: '2024-C', phone: '9876543234', guardianPhone: '9888776311', email: 'samuel.lee@example.com', guardianEmail: 'guardian.samuel@example.com' },
    { id: 36, name: 'Nina Miller', institute: 'California Institute of Technology', batch: '2025-B', phone: '9876543235', guardianPhone: '9888776300', email: 'nina.miller@example.com', guardianEmail: 'guardian.nina@example.com' },
    { id: 37, name: 'Mila Taylor', institute: 'Columbia University', batch: '2023-A', phone: '9876543236', guardianPhone: '9888776299', email: 'mila.taylor@example.com', guardianEmail: 'guardian.mila@example.com' },
    { id: 38, name: 'Isaac Hall', institute: 'University of Oxford', batch: '2026-B', phone: '9876543237', guardianPhone: '9888776288', email: 'isaac.hall@example.com', guardianEmail: 'guardian.isaac@example.com' },
    { id: 39, name: 'Megan Allen', institute: 'Princeton University', batch: '2024-A', phone: '9876543238', guardianPhone: '9888776277', email: 'megan.allen@example.com', guardianEmail: 'guardian.megan@example.com' },
    { id: 40, name: 'Daniel Harris', institute: 'Stanford University', batch: '2025-C', phone: '9876543239', guardianPhone: '9888776266', email: 'daniel.harris@example.com', guardianEmail: 'guardian.daniel@example.com' },
    { id: 41, name: 'Benjamin Wright', institute: 'Harvard University', batch: '2026-A', phone: '9876543240', guardianPhone: '9888776255', email: 'benjamin.wright@example.com', guardianEmail: 'guardian.benjamin@example.com' },
    { id: 42, name: 'Ava Young', institute: 'University of California', batch: '2024-A', phone: '9876543241', guardianPhone: '9888776244', email: 'ava.young@example.com', guardianEmail: 'guardian.ava@example.com' },
    { id: 43, name: 'Carter Martinez', institute: 'Yale University', batch: '2025-B', phone: '9876543242', guardianPhone: '9888776233', email: 'carter.martinez@example.com', guardianEmail: 'guardian.carter@example.com' },
    { id: 44, name: 'Ella Robinson', institute: 'MIT', batch: '2026-C', phone: '9876543243', guardianPhone: '9888776222', email: 'ella.robinson@example.com', guardianEmail: 'guardian.ella@example.com' },
    { id: 45, name: 'Matthew Moore', institute: 'University of Oxford', batch: '2023-B', phone: '9876543244', guardianPhone: '9888776211', email: 'matthew.moore@example.com', guardianEmail: 'guardian.matthew@example.com' },
    { id: 46, name: 'Sophia Harris', institute: 'Princeton University', batch: '2025-A', phone: '9876543245', guardianPhone: '9888776200', email: 'sophia.harris@example.com', guardianEmail: 'guardian.sophia@example.com' },
    { id: 47, name: 'Ryan Brown', institute: 'Stanford University', batch: '2024-C', phone: '9876543246', guardianPhone: '9888776199', email: 'ryan.brown@example.com', guardianEmail: 'guardian.ryan@example.com' },
    { id: 48, name: 'Charlotte Wilson', institute: 'University of California', batch: '2026-A', phone: '9876543247', guardianPhone: '9888776188', email: 'charlotte.wilson@example.com', guardianEmail: 'guardian.charlotte@example.com' },
    { id: 49, name: 'Zoe Johnson', institute: 'MIT', batch: '2023-A', phone: '9876543248', guardianPhone: '9888776177', email: 'zoe.johnson@example.com', guardianEmail: 'guardian.zoe@example.com' },
    { id: 50, name: 'Isaac Taylor', institute: 'Yale University', batch: '2025-B', phone: '9876543249', guardianPhone: '9888776166', email: 'isaac.taylor@example.com', guardianEmail: 'guardian.isaac@example.com' }
];

export {studentData};
