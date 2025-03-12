import {Button, Container, Grid, Group, TextInput, useMantineTheme} from '@mantine/core';
import {useForm} from '@mantine/form';
import {utils} from "../utils.js";
import {useState} from "react";
import {useApiConfig} from "@context/ApiConfig.jsx";
import {useHttp} from "@hooks/AxiosInstance.js";

const payload = {
    name: 'Sarah Lee',
    email: 'sarah.lee@companymail.com',
    contact: '9123456789',
};

export function CreateUpdateRecoveryAgent({data = {}, mode = 'add', handleCancel}) {
    const formData = data || payload;
    const [disableForm, setDisableForm] = useState(false);
    const form = useForm({
        initialValues: {
            name: formData?.name || '',
            email: formData?.email || '',
            contact: formData?.contact || '',
        },
        enhanceGetInputProps: () => ({disabled: disableForm})
    });
    const [isLoading, setIsLoading] = useState(false);
    const theme = useMantineTheme();
    const apiConfig = useApiConfig();
    const {post, put} = useHttp();

    const handleSubmit = async (values) => {
        setIsLoading(true);
        setDisableForm(true);
        try {
            const response = mode === 'add' ? await post(apiConfig.recoveryAgent.create, values) : await put(apiConfig.recoveryAgent.update, {id: data.id, ...values});
            if (response.status === 200) {
                utils.showNotifications('Success', 'Operation successful!', 'success', theme);
            }
        } catch (error) {
            console.log(error);
            utils.showNotifications('Error', error.message, 'error', theme);
        } finally {
            setIsLoading(false);
            setDisableForm(false);
            handleCancel({refresh: true});
        }
    };

    return (
        <Container p={20}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Grid gutter="md">
                    <Grid.Col span={12} sm={6}>
                        <TextInput
                            label="Name"
                            placeholder="Enter your name"
                            {...form.getInputProps('name')}
                        />
                    </Grid.Col>

                    <Grid.Col span={12} sm={6}>
                        <TextInput
                            label="Email"
                            readOnly
                            disabled
                            placeholder="Enter your email"
                            {...form.getInputProps('email')}
                        />
                    </Grid.Col>

                    <Grid.Col span={12} sm={6}>
                        <TextInput
                            label="Contact"
                            placeholder="Enter your contact number"
                            {...form.getInputProps('contact')}
                        />
                    </Grid.Col>
                </Grid>
                <Group position="center" justify={'end'} style={{marginTop: '1rem'}}>
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} loading={isLoading}>
                        Submit
                    </Button>
                </Group>
            </form>
        </Container>
    );
}