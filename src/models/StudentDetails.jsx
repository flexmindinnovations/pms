import {Container, Grid, Text} from "@mantine/core";

export function StudentDetails({data = {}}) {
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
                    <Text fw={500}>Institute Name:</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Text>{data.instituteName ?? 'N/A'}</Text>
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text fw={500}>Batch:</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Text>{data.batch ?? 'N/A'}</Text>
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text fw={500}>Phone:</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Text>{data.phone}</Text>
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text fw={500}>Guardian Phone:</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Text>{data.gaurdianPhone ?? 'N/A'}</Text>
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text fw={500}>Email:</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Text>{data.email}</Text>
                </Grid.Col>

                <Grid.Col span={6}>
                    <Text fw={500}>Guardian Email:</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Text>{data.gaurdianEmail ?? 'N/A'}</Text>
                </Grid.Col>
            </Grid>
        </Container>
    )
}