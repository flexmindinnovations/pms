import {ActionIcon, Card, Container, Text, useMantineTheme} from "@mantine/core";
import {useCallback, useEffect, useMemo, useState} from "react";
import dayjs from "dayjs";
import {RefreshCw} from 'lucide-react';
import {DataTableWrapper} from "@components/DataTableWrapper.jsx";
import {useModal} from "@hooks/AddEditModal.jsx";
import {CreateUpdateCampaign} from "../models/CreateUpdateCampaign.jsx";
import {useHttp} from "@hooks/AxiosInstance.js";
import {useApiConfig} from "@context/ApiConfig.jsx";
import {utils} from "../utils.js";

export default function RecoveryCampaign() {
    const [isLoading, setIsLoading] = useState(false);
    const {openModal} = useModal();
    const [dataSource, setDataSource] = useState(null);
    const theme = useMantineTheme();
    const {get, del} = useHttp();
    const apiConfig = useApiConfig();

    const columns = useMemo(() => [
        {
            accessor: 'name',
            title: 'Name',
            minWidth: 200,
            ...utils.colPros,
            render: (record) => (
                <p className={`px-4 text-start`}>{record.name}</p>
            ),
        },
        {
            accessor: 'startDate',
            title: 'Start Date',
            minWidth: 60,
            ...utils.colPros,
            render: (record) => <p className={`px-4 text-start`}>{dayjs(record.startDate).format('DD/MM/YYYY')}</p>,
        },
        {
            accessor: 'endDate',
            title: 'End Date',
            minWidth: 60,
            ...utils.colPros,
            render: (record) => <p className={`px-4 text-start`}>{dayjs(record.endDate).format('DD/MM/YYYY')}</p>,
        },
        {
            accessor: 'status',
            title: 'Status',
            minWidth: 40,
            ...utils.colPros,
            render: (record) => (
                <div className={`px-4`}>
                    <Card p={2} py={4} c={record?.status === 'Active' ? theme.colors.green[9] : theme.colors.red[9]}
                          withBorder
                          bg={record?.status === 'Active' ? theme.colors.green[1] : theme.colors.red[1]}
                          className={`flex w-full items-center justify-center`}>
                        <Text size={'xs'} fw={'bold'}>{record?.status}</Text>
                    </Card>
                </div>
            ),
        },
        {
            accessor: 'LastTallySyncTimestamp',
            title: 'Last TallySync Timestamp',
            ...utils.colPros,
            minWidth: 100,
        },
        {
            accessor: 'tallySync',
            title: 'Tally Sync',
            minWidth: 50,
            ...utils.colPros,
            render: () => (
                <div className={`w-full flex items-center justify-center`}>
                    <ActionIcon size={"md"}>
                        <RefreshCw size={14}/>
                    </ActionIcon>
                </div>
            ),
        }
    ], [])

    useEffect(() => {
        getRecoveryCampaignList().then();
    }, [])

    const getRecoveryCampaignList = useCallback(async (pageNumber = utils.pageConfig.pageNumber, pageSize = utils.pageConfig.pageSize) => {
        setIsLoading(true);
        try {
            const response = await get(apiConfig.recoveryCampaign.list(pageNumber, pageSize));
            if (response.status === 200) {
                const data = response.data;
                setDataSource(data);
            }
        } catch (err) {
            console.error("Error:", err);
            utils.showNotifications('Error',
                <p className={`text-white`}>{err.message}</p>,
                'error',
                theme);
        } finally {
            setIsLoading(false);
        }
    }, [])

    const handleOnAddEdit = (data, mode) => {
        openAddEditModal({data, mode});
    }

    const openAddEditModal = ({data = {}, mode = 'add'}) => {
        openModal({
            Component: CreateUpdateCampaign,
            data,
            mode,
            title: 'Recovery Campaign',
            handleRefresh: getRecoveryCampaignList
        });
    }

    const handleOnDelete = async (data) => {
        const {id} = data
        setIsLoading(true);
        try {
            const response = await del(apiConfig.recoveryCampaign.delete, {data: {id}});
            if (response.status === 200) {
                utils.showNotifications('Success', 'Operation successful!', 'success', theme);
                getRecoveryCampaignList().then();
            }
        } catch (err) {
            console.log(err);
            utils.showNotifications('Error', err.message, 'error', theme);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Container fluid m={0} p={0}>
            <DataTableWrapper
                loading={isLoading}
                showAddButton={true}
                id={'id'}
                addTitle={'Recovery Campaign'}
                columns={columns}
                canEdit={false}
                canDelete={true}
                dataSource={dataSource}
                handleOnAdd={() => handleOnAddEdit(null)}
                handleOnEdit={(data) => handleOnAddEdit(data, 'add')}
                handleOnDelete={(data) => handleOnDelete(data, 'edit')}
                onRefresh={getRecoveryCampaignList}
            />
        </Container>
    )
}