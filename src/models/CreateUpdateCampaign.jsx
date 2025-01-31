import {TextInput, Button, Select, Textarea, Grid, Container, Group} from '@mantine/core';
import {DateInput} from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

export function CreateUpdateCampaign({data = {}, handleCancel, onAddEdit}) {
    const [formData, setFormData] = useState(data);

    const form = useForm({
        initialValues: {
            name: data?.recoveryCampaignName || '',
            startDate: data?.startDate ? dayjs(data.startDate).toDate() : null,
            endDate: data?.endDate ? dayjs(data.endDate).toDate() : null,
            status: data?.status || 'Active',
            description: data?.description || '',
        },
        validate: {
            name: (value) => (value.length > 0 ? null : 'Name is required'),
            startDate: (value) => (value ? null : 'Start Date is required'),
            endDate: (value) => (value ? null : 'End Date is required'),
            status: (value) => (value.length > 0 ? null : 'Status is required'),
            description: (value) => (value.length > 0 ? null : 'Description is required'),
        },
    });

    const handleSubmit = async (values) => {

    };

    useEffect(() => {
        setFormData(data);
    }, [data]);

    return (
        <Container  size="xs" py={20}>
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
                                { value: 'Active', label: 'Active' },
                                { value: 'Inactive', label: 'Inactive' },
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
                    <Button type="submit">
                        Submit
                    </Button>
                </Group>
            </form>
        </Container>
    );
}