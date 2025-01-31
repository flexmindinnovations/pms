import {ActionIcon, Card, Container, Text, useMantineTheme} from "@mantine/core";
import {useEffect, useMemo, useState} from "react";
import dayjs from "dayjs";
import {RefreshCw} from 'lucide-react';
import {DataTableWrapper} from "@components/DataTableWrapper.jsx";
import {CreateUpdateStudent} from "../models/CreateUpdateStudent.jsx";
import {useModal} from "@hooks/AddEditModal.jsx";
import {CreateUpdateCampaign} from "../models/CreateUpdateCampaign.jsx";

export default function RecoveryCampaign() {
    /**
     * id
     * Name
     * Start Date
     * End Date
     * Status => Active, Inactive
     * Description
     * LastTallySyncTimestamp
     * */

    const colPros = {
        height: 50,
    }

    const [isLoading, setIsLoading] = useState(false);
    const {openModal} = useModal();

    const [dataSource, setDataSource] = useState(null);
    const theme = useMantineTheme();

    const columns = useMemo(() => [
        {
            accessor: 'recoveryCampaignId',
            title: 'ID',
            width: 40,
            style: {padding: '10px'},
            ...colPros
        },
        {
            accessor: 'recoveryCampaignName',
            title: 'Name',
            width: 200,
            style: {padding: '10px'},
            ...colPros
        },
        {
            accessor: 'startDate',
            title: 'Start Date',
            width: 60,
            style: {padding: '10px'},
            render: (record) => dayjs(record.startDate).format('DD/MM/YYYY'),
            ...colPros
        },
        {
            accessor: 'endDate',
            title: 'End Date',
            width: 60,
            style: {padding: '10px'},
            render: (record) => dayjs(record.endDate).format('DD/MM/YYYY'),
            ...colPros
        },
        {
            accessor: 'status',
            title: 'Status',
            width: 40,
            style: {padding: '10px'},
            render: (record) => (
                <Card p={0} className={`flex w-full items-center justify-center`}>
                    <Text size={'xs'} fw={'bold'}>{record?.status === 'active' ? 'Active' : 'Inactive'}</Text>
                </Card>
            ),
            ...colPros
        },
        {
            accessor: 'LastTallySyncTimestamp',
            title: 'Last TallySync Timestamp',
            width: 100,
            style: {padding: '10px'},
            ...colPros
        },
        {
            accessor: 'tallySync',
            title: 'Tally Sync',
            width: 50,
            style: {padding: '10px'},
            render: () => (
                <div className={`w-full flex items-center justify-center`}>
                    <ActionIcon>
                        <RefreshCw size={16}/>
                    </ActionIcon>
                </div>
            ),
            ...colPros
        }
    ], [])

    const generateDummyData = () => {
        const statuses = ['active', 'inactive'];
        return Array.from({length: 10}).map((_, index) => ({
            recoveryCampaignId: index + 1,
            recoveryCampaignName: `Campaign ${index + 1}`,
            startDate: dayjs().subtract(index, 'days').format('YYYY-MM-DD'),
            endDate: dayjs().add(index, 'days').format('YYYY-MM-DD'),
            status: statuses[index % 2], // Alternating active/inactive
            LastTallySyncTimestamp: dayjs().subtract(index, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        }));
    };

    useEffect(() => {
        const data = generateDummyData();
        setDataSource(data);
    }, [])


    const getRecoveryCampaign = async () => {

    }

    const handleOnAddEdit = (data, mode) => {
        openAddEditModal({data, mode});
    }

    const openAddEditModal = ({data = {}, mode = 'add'}) => {
        console.log('data: ', data)
        openModal({
            Component: CreateUpdateCampaign,
            data,
            mode,
            title: 'Recovery Campaign',
            handleRefresh: getRecoveryCampaign
        });
    }

    const handleOnDelete = (data) => {
        console.log('data: ', data);
    }

    return (
        <Container fluid m={0} p={0}>
            <DataTableWrapper
                loading={isLoading}
                showAddButton={true}
                id={'recoveryCampaignId'}
                addTitle={'Recovery Campaign'}
                columns={columns}
                canEdit={true}
                canDelete={true}
                dataSource={dataSource}
                handleOnAdd={handleOnAddEdit}
                handleOnEdit={(data) => handleOnAddEdit(data, 'add')}
                handleOnDelete={(data) => handleOnDelete(data, 'edit')}
                onRefresh={getRecoveryCampaign}
            />
        </Container>
    )
}