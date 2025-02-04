import {
    Button,
    Card,
    Center,
    Container,
    Group,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title,
    useMantineTheme
} from "@mantine/core";
import {motion} from 'motion/react';
import {useEffect, useState} from "react";
import {useForm} from "@mantine/form";
import {useHttp} from "@hooks/AxiosInstance.js";
import {useApiConfig} from "@context/ApiConfig.jsx";
import {utils} from "../utils.js";
import {useNavigate} from "react-router-dom";
import {useEncrypt} from "@hooks/EncryptData.js";

export default function Login() {
    const [cardKey, setCardKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const {post} = useHttp();
    const apiConfig = useApiConfig();
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const {setEncryptedData} = useEncrypt();
    const form = useForm({
        initialValues: {
            loginName: "",
            password: "",
        },
        validate: {
            loginName: (value) => (/^\S+@\S+$/.test(value) ? null : 'Please provide valid email'),
            password: (value) => {
                if (!value) return 'Password is required';
                if (value.length < 3) return 'Password must be at least 3 characters long';
                return null;
            },
        },
        validateInputOnBlur: true,
        validateInputOnChange: true
    })

    const loginUser = async (values) => {
        return await post(apiConfig.login, values);
    }

    useEffect(() => {
        const key = Math.random().toString(36).substring(2);
        setCardKey(key);
        setTestFormValues();
    }, []);

    const setTestFormValues = () => {
        const formValue = {
            loginName: 'LOKESHYADAV704@GMAIL.COM',
            password: 'exec@2019$',
        }
        form.setValues(formValue);
    }

    const handleFormSubmit = async (values) => {
        setIsLoading(true);
        try {
            const response = await loginUser({...values});
            if (response.status === 200) {
                const data = response.data;
                const {authenticationToken, userID, message, userName, emailID} = data;
                if (authenticationToken) {
                    sessionStorage.setItem("token", authenticationToken);
                    setEncryptedData("userID", userID);
                    setEncryptedData("user", userName);
                    utils.showNotifications(message,
                        <p>{'Successfully logged in!'}</p>,
                        'success',
                        theme);
                    createAgent({name: userName, email: emailID, contact: data?.contact}).then();
                }
            }
        } catch (err) {
            console.error("Error:", err);
            utils.showNotifications('Error',
                <p className={`text-white`}>{'Error while logging in!'}</p>,
                'error',
                theme);
        } finally {
            setIsLoading(false);
        }
    }

    const createAgent = async ({name, email, contact = null}) => {
        setIsLoading(true);
        const payload = {name, email, contact};
        try {
            const response = await post(apiConfig.recoveryAgent.create, payload);
            if (response.status === 200) {
                    setTimeout(() => {
                        navigate('/');
                        setIsLoading(false);
                    }, 1000);
            }
        } catch (err) {
            console.error("Error:", err);
            utils.showNotifications('Error',
                <p className={`text-white`}>{err.message}</p>,
                'error',
                theme);
            setIsLoading(false);
        }
    }

    return (
        <Container fluid className="polka h-screen flex items-center justify-center p-4">
            <motion.div
                key={cardKey}
                transition={{delay: 0.3, duration: 0.3}}
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -20}}
                className="w-full max-w-md"
            >
                <Card p={20}
                      styles={{
                          root: {
                              maxWidth: (theme.breakpoints.xs || theme.breakpoints.sm) ? '100%' : '40%',
                              backgroundColor: "var(--polka)"
                          }
                      }}
                >
                    <Center>
                        <Stack gap={0} align="center">
                            <div
                                className="text-cente mb-4">
                                <Title className={`!leading-7 gradientText`}>PMS</Title>
                                <p className={`gradientText !font-bold`}>Fee Recovery</p>
                            </div>
                            <Text className="text-center !text-white">Enter your credentials to continue</Text>
                        </Stack>
                    </Center>
                    <form onSubmit={form.onSubmit((values) => handleFormSubmit(values))}>
                        <Stack gap={5} mt="md">
                            <TextInput
                                withAsterisk
                                label="Email"
                                size="lg"
                                placeholder="your@email.com"
                                key={form.key('loginName')}
                                styles={{
                                    root: {
                                        minHeight: '6.5rem',
                                    },
                                    label: {
                                        color: theme.white,
                                    }
                                }}
                                {...form.getInputProps('loginName')}
                            />
                            <PasswordInput
                                label="Password"
                                size="lg"
                                withAsterisk
                                styles={{
                                    root: {
                                        minHeight: '6.5rem',
                                    },
                                    label: {
                                        color: theme.white,
                                    }
                                }}
                                key={form.key('password')}
                                {...form.getInputProps('password')}
                            />
                            <Group justify="flex-end" mt="md">
                                <Button
                                    size={'lg'}
                                    disabled={!form.isValid() || isLoading}
                                    type="submit"
                                    loading={isLoading}
                                    fullWidth>
                                    {isLoading ? "Logging in..." : "Login"}
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Card>
            </motion.div>
        </Container>
    )
}