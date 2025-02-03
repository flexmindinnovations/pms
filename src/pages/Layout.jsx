import {
    AppShell,
    Breadcrumbs,
    Burger,
    Button,
    Container,
    Group,
    Loader,
    Text,
    Title,
    UnstyledButton,
    useMantineTheme
} from "@mantine/core";
import {useDisclosure} from '@mantine/hooks'
import {AnimatePresence, motion} from 'motion/react';
import {Link, NavLink, Outlet, useLocation} from 'react-router-dom';
import {createElement, useEffect, useState} from "react";
import {utils} from "../utils.js";
import styles from '@styles/Layout.module.css';
import {Home, LogOut} from 'lucide-react';
import {useAuth} from "@context/AuthContext.jsx";
import {useEncrypt} from "@hooks/EncryptData.js";

export default function Layout() {
    const [opened, {toggle}] = useDisclosure()
    const [menuItems, setMenuItems] = useState([])
    const theme = useMantineTheme();
    const {pathname} = useLocation()
    const {logout} = useAuth();
    const {getEncryptedData} = useEncrypt();
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    useEffect(() => {
        let _menuItems = utils.menuItems;
        if (_menuItems.length) {
            let activePath = pathname;
            if (sessionStorage.getItem('currentItem')) activePath = sessionStorage.getItem('currentItem');
            _menuItems = _menuItems.map(item => ({
                ...item,
                active: `/${item.route}` === activePath
            }))
            setMenuItems(_menuItems);
        }
        const pathNames = location.pathname
            .split("/")
            .filter((x) => x && !uuidPattern.test(x))
            .map((path) => path.replace(/-/g, " "))
            .map((path) => path.charAt(0).toUpperCase() + path.slice(1));
        const home = <NavLink to={'/'} key={'home'}>
            <Home size={16}/>
        </NavLink>;
        const newBreadcrumbs = pathNames
            .filter((path) => !uuidPattern.test(path))
            .map((path, index) => {
                return (
                    <Text key={index}>
                        {path}
                    </Text>
                )
            });
        setBreadcrumbs([home, ...newBreadcrumbs]);
    }, [pathname]);

    const handleLogout = () => logout();

    const handleNavClick = menuItem => {
        sessionStorage.setItem('currentItem', `/${menuItem.route}`);
        const updateMenuItems = menuItems.map(item => ({
            ...item,
            active: item.id === menuItem.id
        }))
        setMenuItems(updateMenuItems)
        toggle();
    }

    if (!menuItems.length) {
        return (
            <Container fluid>
                <Loader/>
            </Container>
        )
    }

    return (
        <AppShell
            header={{height: 60}}
            footer={{height: 10}}
            navbar={{
                width: 245,
                breakpoint: 'sm',
                collapsed: {mobile: !opened}
            }}
            styles={{
                main: {
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column'
                }
            }}
            padding='md'
            layout='alt'
            pl={0}
        >
            <AppShell.Header>
                <Group h='100%' px='14'>
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        hiddenFrom='sm'
                        size='md'
                    />
                    <Group justify='space-between' style={{flex: 1}}>
                        <Group pos={'left'}>
                            <Breadcrumbs separator="→" separatorMargin="xs" mt="xs">
                                {breadcrumbs}
                            </Breadcrumbs>
                        </Group>
                        <Group pos={'right'} gap={20}>
                            <Text>{getEncryptedData('user')}</Text>
                            <Button
                                variant={"filled"}
                                bg={theme.colors.red[6]}
                                c={theme.white}
                                onClick={handleLogout}
                                leftSection={<LogOut size={14}/>}
                            >Logout</Button>
                        </Group>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar className='px-0'>
                <Group className='flex !flex-col !items-start !justify-start !gap-2 !my-4'>
                    <div
                        className='header w-full relative h-24 flex items-center justify-center bg-cDefault/50'>
                        <Link
                            to={`/${menuItems[0].route}`}
                            onClick={() => handleNavClick(menuItems[0])}
                            className={`flex items-center py-2 px-6 text-sm gap-2 lg:gap-4 xl:gap-4 2xl:gap-4 !font-medium`}
                        >
                            <div
                                className="text-cente mb-4">
                                <Title className={`!leading-8 gradientText`}>PMS</Title>
                                <p className={`gradientText !font-bold`}>Fee Recovery</p>
                            </div>
                        </Link>
                        <Burger
                            opened={opened}
                            className='absolute top-4 right-4'
                            onClick={toggle}
                            hiddenFrom='sm'
                            size='md'
                        />
                    </div>
                    <motion.ul
                        className={styles.navbarContainer}
                        variants={{
                            visible: {
                                opacity: 1,
                                transition: {
                                    when: "beforeChildren",
                                    staggerChildren: 0.4,
                                },
                            },
                            hidden: {opacity: 0},
                        }}
                        initial="hidden"
                        animate="visible"
                    >
                        {menuItems.map((item, index) => (
                            <motion.li
                                key={item.key}
                                className={styles.navbarItemWrapper}
                                variants={{
                                    hidden: {
                                        x: -40,
                                        opacity: 0,
                                    },
                                    visible: {
                                        x: 0,
                                        opacity: 1,
                                        transition: {
                                            delay: index * 0.03,
                                        },
                                    },
                                }}
                            >
                                <UnstyledButton
                                    key={item.key}
                                    onClick={() => handleNavClick(item)}
                                    className={`${item.active ? styles.activeItem : styles.inactiveItem
                                    } ${styles.navbarItem}`}
                                >
                                    <Link
                                        to={`/${item.route}`}
                                        className={`flex items-center py-2 px-6 text-sm gap-2 lg:gap-4 xl:gap-4 2xl:gap-4 !font-medium`}
                                    >
                                        <span>{createElement(item.icon, {size: 16})}</span>
                                        <span>{item.title}</span>
                                    </Link>
                                </UnstyledButton>
                            </motion.li>
                        ))}
                    </motion.ul>
                </Group>
            </AppShell.Navbar>

            <AppShell.Main>
                <div className={`w-full h-full flex flex-col flex-1`}>
                    <AnimatePresence mode={"wait"}>
                        <div style={{overflow: "hidden", height: "100%", width: "100%"}}>
                            <motion.div
                                key={pathname}
                                initial={{x: -10, opacity: 0}}
                                animate={{x: 0, opacity: 1}}
                                exit={{opacity: 0}}
                                transition={{duration: 0.2, ease: "easeOut"}}
                                className='w-full h-full'>
                                <Outlet/>
                            </motion.div>
                        </div>
                    </AnimatePresence>
                </div>
            </AppShell.Main>
        </AppShell>
    )
}