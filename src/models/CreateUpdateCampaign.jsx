import {Button, Container, Grid, Group, Select, Textarea, TextInput, useMantineTheme} from '@mantine/core';
import {DateInput} from '@mantine/dates';
import {useForm} from '@mantine/form';
import {useState} from 'react';
import dayjs from 'dayjs';
import {utils} from "../utils.js";
import {useApiConfig} from "@context/ApiConfig.jsx";
import {useHttp} from "@hooks/AxiosInstance.js";

export function CreateUpdateCampaign({data = {}, mode = 'add', handleCancel, onAddEdit}) {
    const payload = {
        "name": "Corporate Loan Recovery Q1",
        "startDate": "2025-03-01T00:00:00.000Z",
        "endDate": "2025-05-31T23:59:59.999Z",
        "status": "Active",
        "description": "Targeting corporate clients with overdue loan payments."
    }

    const formData = data || payload;
    const [disableForm, setDisableForm] = useState(false);
    const form = useForm({
        initialValues: {
            name: formData?.name || '',
            startDate: formData?.startDate ? dayjs(formData.startDate).toDate() : null,
            endDate: formData?.endDate ? dayjs(formData.endDate).toDate() : null,
            status: formData?.status || 'Active',
            description: formData?.description || '',
        },
        validate: {
            name: (value) => (value.length > 0 ? null : 'Name is required'),
            startDate: (value) => (value ? null : 'Start Date is required'),
            endDate: (value) => (value ? null : 'End Date is required'),
            status: (value) => (value.length > 0 ? null : 'Status is required'),
            description: (value) => (value.length > 0 ? null : 'Description is required'),
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
            const response = mode === 'add' ? await post(apiConfig.recoveryCampaign.create, values) : await put(apiConfig.recoveryCampaign.update, {id: data.id, ...values});
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
                            placeholder="Enter name"
                            {...form.getInputProps('name')}
                            required
                        />
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <DateInput
                            label="Start Date"
                            placeholder="Select start date"
                            {...form.getInputProps('startDate')}
                            required
                        />
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <DateInput
                            label="End Date"
                            placeholder="Select end date"
                            {...form.getInputProps('endDate')}
                            required
                        />
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <Select
                            label="Status"
                            placeholder="Select status"
                            data={[
                                {value: 'Active', label: 'Active'},
                                {value: 'Inactive', label: 'Inactive'},
                            ]}
                            {...form.getInputProps('status')}
                            required
                        />
                    </Grid.Col>

                    <Grid.Col span={12}>
                        <Textarea
                            label="Description"
                            placeholder="Enter description"
                            {...form.getInputProps('description')}
                            required
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