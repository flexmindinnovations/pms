import {Container, Grid, Text} from '@mantine/core';

// eslint-disable-next-line react/prop-types
export function RecoveryAgentDetails({
                                         data = {
                                             name: '',
                                             email: '',
                                             contact: ''
                                         }
                                     }) {
    return (
        <Container size='md' p={20}>
            <Grid>
                <Grid.Col span={6}>
                    <Text fw={500}>Name:</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Text>{data.name}</Text>
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text fw={500}>Email:</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Text>{data.email}</Text>
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text fw={500}>Contact:</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Text>{data.contact}</Text>
                </Grid.Col>
            </Grid>
        </Container>
    )
}