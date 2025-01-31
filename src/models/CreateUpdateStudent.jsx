import {Container, TextInput, Group, Button, Grid, CloseIcon} from '@mantine/core';
import {useForm} from "@mantine/form";

export function CreateUpdateStudent({data = {}, handleCancel, onAddEdit}) {

    const form = useForm({
        initialValues: {
            name: data?.name || '',
            institute: data?.institute || '',
            batch: data?.batch || '',
            phone: data?.phone || '',
            guardianPhone: data?.guardianPhone || '',
            email: data?.email || '',
            guardianEmail: data?.guardianEmail || '',
        },
        validate: {
            name: (value) => (value.length > 0 ? null : 'Name is required'),
            institute: (value) => (value.length > 0 ? null : 'Institute is required'),
            batch: (value) => (value.length > 0 ? null : 'Batch is required'),
            phone: (value) => (/^\d{10}$/.test(value) ? null : 'Phone number must be 10 digits'),
            guardianPhone: (value) => (/^\d{10}$/.test(value) ? null : 'Guardian phone number must be 10 digits'),
            email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email format'),
            guardianEmail: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid guardian email format'),
        },
    });

    const handleSubmit = (values) => {
        console.log(values);
        // You can handle form submission here
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
                            {...form.getInputProps('institute')}
                            required
                        />
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <TextInput
                            label="Batch"
                            placeholder="Enter batch"
                            {...form.getInputProps('batch')}
                            required
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TextInput
                            label="Phone"
                            placeholder="Enter phone number"
                            {...form.getInputProps('phone')}
                            required
                            type="tel"
                        />
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <TextInput
                            label="Guardian Phone"
                            placeholder="Enter guardian's phone number"
                            {...form.getInputProps('guardianPhone')}
                            required
                            type="tel"
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TextInput
                            label="Email"
                            placeholder="Enter email address"
                            {...form.getInputProps('email')}
                            required
                            type="email"
                        />
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <TextInput
                            label="Guardian Email"
                            placeholder="Enter guardian's email address"
                            {...form.getInputProps('guardianEmail')}
                            required
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
                    <Button type="submit">
                        Submit
                    </Button>
                </Group>
            </form>
        </Container>
    )
}