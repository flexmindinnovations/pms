import {ActionIcon, Anchor, Card, Container, Text, useMantineTheme} from "@mantine/core";
import {useCallback, useEffect, useMemo, useState} from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import tz from "dayjs/plugin/timezone.js";
import {RefreshCw} from 'lucide-react';
import {DataTableWrapper} from "@components/DataTableWrapper.jsx";
import {useModal} from "@hooks/AddEditModal.jsx";
import {CreateUpdateCampaign} from "../models/CreateUpdateCampaign.jsx";
import {useHttp} from "@hooks/AxiosInstance.js";
import {useApiConfig} from "@context/ApiConfig.jsx";
import {utils} from "../utils.js";
import {useNavigate} from "react-router-dom";

dayjs.extend(utc);
dayjs.extend(tz);

export default function RecoveryCampaign() {
    const [isLoading, setIsLoading] = useState(false);
    const {openModal} = useModal();
    const [dataSource, setDataSource] = useState(null);
    const theme = useMantineTheme();
    const {get, post, del} = useHttp();
    const apiConfig = useApiConfig();
    const navigate = useNavigate();

    const columns = useMemo(() => [
        {
            accessor: 'name',
            title: 'Name',
            minWidth: 200,
            ...utils.colPros,
            render: (record) => (
                <div className={`w-full text-start px-4`}>
                    <Anchor c={theme.colors.blue[6]} size={'sm'} onClick={() => handleLinkClick(record)}>
                        {record.name}
                    </Anchor>
                </div>
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
            accessor: 'lastTallySyncTimestamp',
            title: 'Last TallySync Timestamp',
            ...utils.colPros,
            minWidth: 100,
            render: (record) => <p className={`px-4 text-start`}>{
                record.lastTallySyncTimestamp
                    ? dayjs.utc(record.lastTallySyncTimestamp).tz('Asia/Kolkata').format('MMMM D, YYYY h:mm A')
                    : 'NA'}</p>,
        },
        {
            accessor: 'tallySync',
            title: 'Tally Sync',
            minWidth: 50,
            ...utils.colPros,
            render: (record) => (
                <div className={`w-full flex items-center justify-center`}>
                    <ActionIcon onClick={() => handleTallySync(record)} size={"md"}>
                        <RefreshCw size={14}/>
                    </ActionIcon>
                </div>
            ),
        }
    ], [])

    useEffect(() => {
        getRecoveryCampaignList().then();
    }, [])

    const handleTallySync = async ({id}) => {
        setIsLoading(true);
        try {
            const response = await post(apiConfig.recoveryCampaign.tallySync, {id});
            if (response.status === 200) {
                getRecoveryCampaignList().then();
            }
        } catch (err) {
            const {message} = err;
            utils.showNotifications('Error', message, 'error', theme);
        } finally {
            setIsLoading(false);
        }
    }

    const getRecoveryCampaignList = useCallback(async (pageNumber = (utils.pageConfig.pageNumber || 1), pageSize = (utils.pageConfig.pageSize || 15)) => {
        setIsLoading(true);
        try {
            const response = await get(apiConfig.recoveryCampaign.list(pageNumber, pageSize));
            if (response.status === 200) {
                const data = response.data;
                setDataSource(data);
            }
        } catch (err) {
            const {message} = err;
            utils.showNotifications('Error', message, 'error', theme);
        } finally {
            setIsLoading(false);
        }
    }, [])

    const handleOnAddEdit = (data, mode) => {
        openAddEditModal({data, mode});
    }

    const handleLinkClick = (record) => {
        navigate(`/campaign-details/${record.id}`, {state: record});
    }

    const openAddEditModal = ({data = {}, mode = 'add'}) => {
        openModal({
            Component: CreateUpdateCampaign,
            data,
            isAddEdit: true,
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
                canEdit={true}
                canDelete={true}
                dataSource={dataSource}
                handleOnAdd={() => handleOnAddEdit(null)}
                handleOnEdit={(data) => handleOnAddEdit(data, 'edit')}
                handleOnDelete={(data) => handleOnDelete(data)}
                onRefresh={() => getRecoveryCampaignList()}
            />
        </Container>
    )
}