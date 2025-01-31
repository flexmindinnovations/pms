import {Container, Text, Grid} from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';
import dayjs from "dayjs";

export function FollowUp({data}) {
    /*
    * id
    * CampaignId
    * StudentId
    * RecoveryAgentId
    * CommitmentAmount
    * CommitmentDate
    * Remarks
    * Timestamp
    * No Of Calls => Last Caller
    * */
    const sampleData = {
        id: 123,
        CampaignId: 'Campaign001',
        StudentId: 'Student456',
        RecoveryAgentId: 'Agent789',
        CommitmentAmount: 5000,
        CommitmentDate: '2024-03-15',
        Remarks: 'Promised to pay by next month.',
        Timestamp: '2024-02-20T10:00:00Z',
        NoOfCalls: 5,
        LastCaller: 'John Doe',
    };

    const displayData = data || sampleData;
    const isMobile = useMediaQuery('(max-width: 768px)');

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return dayjs(dateString).format('DD MMM YYYY');
    };

    const formatTimestamp = (timestampString) => {
        if (!timestampString) return "-";
        return dayjs(timestampString).format('DD MMM YYYY, h:mm A');
    }
    const gridSpan = isMobile ? 12 : 6;

    return (
        <Container size={'md'} p={20}>
            <Grid gutter="xl">
                <Grid.Col span={gridSpan}>
                    <Text weight={500}>ID:</Text>
                    <Text>{displayData.id}</Text>
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                    <Text weight={500}>Campaign ID:</Text>
                    <Text>{displayData.CampaignId}</Text>
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                    <Text weight={500}>Student ID:</Text>
                    <Text>{displayData.StudentId}</Text>
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                    <Text weight={500}>Recovery Agent ID:</Text>
                    <Text>{displayData.RecoveryAgentId}</Text>
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                    <Text weight={500}>Commitment Amount:</Text>
                    <Text>{displayData.CommitmentAmount}</Text>
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                    <Text weight={500}>Commitment Date:</Text>
                    <Text>{formatDate(displayData.CommitmentDate)}</Text>
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                    <Text weight={500}>Remarks:</Text>
                    <Text>{displayData.Remarks || "-"}</Text> {/* Handle null/undefined */}
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                    <Text weight={500}>Timestamp:</Text>
                    <Text>{formatTimestamp(displayData.Timestamp)}</Text>
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                    <Text weight={500}>No. of Calls:</Text>
                    <Text>{displayData.NoOfCalls}</Text>
                </Grid.Col>
                <Grid.Col span={gridSpan}>
                    <Text weight={500}>Last Caller:</Text>
                    <Text>{displayData.LastCaller || "-"}</Text>
                </Grid.Col>
            </Grid>
        </Container>
    )
}