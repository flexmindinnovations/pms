import {Button, Container, Grid, Group, TextInput, useMantineTheme} from '@mantine/core';
import {useForm} from "@mantine/form";
import {useState} from "react";
import {useApiConfig} from "@context/ApiConfig.jsx";
import {useHttp} from "@hooks/AxiosInstance.js";
import {utils} from "../utils.js";

export function CreateUpdateStudent({data = {}, mode = 'add', handleCancel, onAddEdit}) {
    const dummyData = {
        "name": "Alice Johnson",
        "instituteName": "Harvard University",
        "batch": "2026",
        "phone": "+0012345678901",
        "gaurdianPhone": "+0012345678902",
        "email": "alice.johnson@example.com",
        "gaurdianEmail": "alice.gaurdian@example.com"
    };

    const formData = data;
    const [disableForm, setDisableForm] = useState(false);
    const form = useForm({
        initialValues: {
            name: formData?.name || '',
            instituteName: formData?.instituteName || '',
            batch: formData?.batch || '',
            phone: formData?.phone || '',
            gaurdianPhone: formData?.gaurdianPhone || '',
            email: formData?.email || '',
            gaurdianEmail: formData?.gaurdianEmail || '',
        },
        validate: {
            name: (value) => (value.length > 0 ? null : 'Name is required'),
        },
        enhanceGetInputProps: () => ({disabled: disableForm}),
    });

    const [isLoading, setIsLoading] = useState(false);
    const theme = useMantineTheme();
    const apiConfig = useApiConfig();
    const {post, put} = useHttp();

    const handleSubmit = async (values) => {
        setIsLoading(true);
        setDisableForm(true);
        try {
            const response = mode === 'add' ? await post(apiConfig.students.create, values) : await put(apiConfig.students.update, {id: data.id, ...values});
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
        <Container size="xs" py={20}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Grid gutter="lg">
                    <Grid.Col span={6}>
                        <TextInput
                            label="Name"
                            placeholder="Enter full name"
                            {...form.getInputProps('name')}
                            required
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TextInput
                            label="Institute"
                            placeholder="Enter institute name"
                            {...form.getInputProps('instituteName')}
                        />
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <TextInput
                            label="Batch"
                            placeholder="Enter batch"
                            {...form.getInputProps('batch')}
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TextInput
                            label="Phone"
                            placeholder="Enter phone number"
                            {...form.getInputProps('phone')}
                            type="tel"
                        />
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <TextInput
                            label="Guardian Phone"
                            placeholder="Enter guardian's phone number"
                            {...form.getInputProps('gaurdianPhone')}
                            type="tel"
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TextInput
                            label="Email"
                            placeholder="Enter email address"
                            {...form.getInputProps('email')}
                            type="email"
                        />
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <TextInput
                            label="Guardian Email"
                            placeholder="Enter guardian's email address"
                            {...form.getInputProps('gaurdianEmail')}
                            type="email"
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
    )
}