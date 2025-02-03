import {ActionIcon, Anchor, Container, useMantineTheme} from "@mantine/core";
import {useCallback, useEffect, useState} from "react";
import {useHttp} from "@hooks/AxiosInstance.js";
import {useApiConfig} from "@context/ApiConfig.jsx";
import {utils} from "../utils.js";
import {DataTableWrapper} from "@components/DataTableWrapper.jsx";
import {ExternalLink} from 'lucide-react';
import {useModal} from "@hooks/AddEditModal.jsx";
import {useLocation, useNavigate, useParams} from "react-router-dom";

export default function CampaignDetails() {
    const {campaignId} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [dataSource, setDataSource] = useState(null);
    const theme = useMantineTheme();
    const {get, del} = useHttp();
    const {openModal} = useModal();
    const apiConfig = useApiConfig();
    const columns = [
        {
            accessor: 'name',
            title: 'Name',
            minWidth: 150,
            ...utils.colPros,
            render: (record) => (
                <div className={`w-full text-left px-4 py-2`}>
                    <Anchor c={theme.colors.blue[6]} size={'md'} onClick={() => handleLinkClick(record)}>
                        {record.name}
                    </Anchor>
                </div>
            )
        },
        {
            accessor: 'instituteName',
            title: 'Institute',
            minWidth: 200,
            ...utils.colPros,
            render: (record) => (
                <p className={`px-4 py-2 text-base text-start`}>{record.instituteName}</p>
            ),
        },
        {
            accessor: 'batch',
            title: 'Batch',
            minWidth: 100,
            ...utils.colPros,
            render: (record) => (
                <p className={`px-4 py-2 text-base text-start`}>{record.batch}</p>
            ),
        },
        {
            accessor: 'phone',
            title: 'Phone',
            minWidth: 120,
            ...utils.colPros,
            render: (record) => (
                <p className={`px-4 py-2 text-base text-start`}>{record.phone}</p>
            ),
        },
        {
            accessor: 'followUp',
            title: 'Follow Up',
            textAlign: 'center',
            minWidth: 40,
            width: 100,
            render: (record) => (
                <div className={`w-full flex items-center justify-center`}>
                    <ActionIcon onClick={() => openFollowUpModal(record)} size={"md"}>
                        <ExternalLink size={14}/>
                    </ActionIcon>
                </div>
            ),
        },
    ];

    const openFollowUpModal = (record) => {
        navigate(`/campaign-details/${campaignId}/follow-up`, {state: record});
    }

    const handleLinkClick = (record) => {
        console.log('record: ', record);
    }

    useEffect(() => {
        getCampaignDetails().then();
    }, []);

    const getCampaignDetails = useCallback(async (pageNumber = utils.pageConfig.pageNumber, pageSize = utils.pageConfig.pageSize) => {
        setIsLoading(true);
        try {
            const response = await get(apiConfig.recoveryCampaign.details(campaignId, pageNumber, pageSize));
            if (response.status === 200) {
                const data = response.data;
                const newDataSource = {
                    ...data,
                    items: data?.items.map((record) => {
                        return {
                            followups: record.followups,
                            ...record.studentDto
                        }
                    })
                }
                setDataSource(newDataSource);
            }
        } catch (err) {
            const {message} = err;
            utils.showNotifications('Error', message, 'error', theme);
        } finally {
            setIsLoading(false);
        }
    }, [])

    return (
        <Container size={'xl'} p={0} fluid>
            <DataTableWrapper
                tableId={campaignId}
                loading={isLoading}
                showAddButton={false}
                showRefreshButton={false}
                id={'id'}
                addTitle={'Recovery Campaign Details'}
                columns={columns}
                showActions={false}
                canEdit={false}
                canDelete={false}
                dataSource={dataSource}
            />
        </Container>
    )
}