import {useCallback, useEffect, useMemo, useState} from "react";
import {useModal} from "@hooks/AddEditModal.jsx";
import {Anchor, Container, useMantineTheme} from "@mantine/core";
import {useHttp} from "@hooks/AxiosInstance.js";
import {useApiConfig} from "@context/ApiConfig.jsx";
import {utils} from "../utils.js";
import {CreateUpdateStudent} from "../models/CreateUpdateStudent.jsx";
import {DataTableWrapper} from "@components/DataTableWrapper.jsx";
import dayjs from "dayjs";
import {CampaignDetails} from "../models/CampaignDetails.jsx";
import {StudentDetails} from "../models/StudentDetails.jsx";
import {RecoveryAgentDetails} from "../models/RecoveryAgentDetails.jsx";

export default function FollowUp() {
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
    const [dataSource, setDataSource] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const {openModal} = useModal();
    const theme = useMantineTheme();
    const {get, del} = useHttp();
    const apiConfig = useApiConfig();
    const columns = useMemo(() =>
                [
                    {
                        accessor: 'campaignId',
                        title: 'Campaign ID',
                        minWidth: 120,
                        render: (record) => (
                            <div className={`w-full text-left px-4`}>
                                <Anchor c={theme.colors.blue[6]} size={'xs'}
                                        onClick={() => handleLinkClick(record, 'campaign')}>
                                    {record.campaignId}
                                </Anchor>
                            </div>
                        ),
                    },
                    {
                        accessor: 'studentId',
                        title: 'Student ID',
                        minWidth: 120,
                        render: (record) => (
                            <div className={`w-full text-left px-4`}>
                                <Anchor c={theme.colors.blue[6]} size={'xs'} onClick={() => handleLinkClick(record, 'student')}>
                                    {record.studentId}
                                </Anchor>
                            </div>
                        ),
                    },
                    {
                        accessor: 'recoveryAgentId',
                        title: 'Recovery Agent ID',
                        minWidth: 150,
                        render: (record) => (
                            <div className={`w-full text-left px-4`}>
                                <Anchor c={theme.colors.blue[6]} size={'xs'}
                                        onClick={() => handleLinkClick(record, 'recoveryAgent')}>
                                    {record.recoveryAgentId}
                                </Anchor>
                            </div>
                        ),
                    },
                    {
                        accessor: 'commitmentAmount',
                        title: 'Commitment Amount',
                        minWidth: 160,
                        render:
                            (record) => (
                                <p className={`px-4 text-start`}>${record.commitmentAmount.toFixed(2)}</p>
                            ),
                    },
                    {
                        accessor: 'commitmentDate',
                        title:
                            'Commitment Date',
                        minWidth:
                            180,
                        render:
                            (record) => (
                                <p className={`px-4 text-start`}>{dayjs(record.commitmentDate).format('DD/MM/YYYY')}</p>
                            ),
                    }
                    ,
                    {
                        accessor: 'remarks',
                        title:
                            'Remarks',
                        minWidth:
                            200,
                        render:
                            (record) => (
                                <p className={`px-4 text-start`}>{record.remarks || 'N/A'}</p>
                            ),
                    }
                    ,
                    {
                        accessor: 'timestamp',
                        title:
                            'Timestamp',
                        minWidth:
                            180,
                        render:
                            (record) => (
                                <p className={`px-4 text-start`}>{new Date(record.timestamp).toLocaleString()}</p>
                            ),
                    }
                    ,
                    {
                        accessor: 'noOfCalls',
                        title:
                            'No Of Calls',
                        minWidth:
                            120,
                        render:
                            (record) => (
                                <p className={`px-4 text-start`}>{record.noOfCalls || 0}</p>
                            ),
                    }
                    ,
                    {
                        accessor: 'lastCaller',
                        title:
                            'Last Caller',
                        minWidth:
                            180,
                        render:
                            (record) => (
                                <p className={`px-4 text-start`}>{record.lastCaller || 'N/A'}</p>
                            ),
                    }
                    ,
                ],
            []
        )
    ;

    useEffect(() => {
        getFollowUpList().then();
    }, [])

    const handleLinkClick = (record, src) => {
        switch (src) {
            case 'campaign':
                openDetailsModal({data: record, component: CampaignDetails, title: 'Campaign Details'});
                break;
            case 'student':
                openDetailsModal({data: record, component: StudentDetails, title: 'Student Details'});
                break;
            case 'recoveryAgent':
                openDetailsModal({data: record, component: RecoveryAgentDetails, title: 'Recovery Agent Details'});
                break;
        }
    }

    const getFollowUpList = useCallback(async (
        pageNumber = utils.pageConfig.pageNumber,
        pageSize = utils.pageConfig.pageSize) => {
        try {
            const response = await get(apiConfig.followUp.list(pageNumber, pageSize));
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
            Component: CreateUpdateStudent,
            data,
            mode,
            title: 'Follow Up',
            handleRefresh: () => getFollowUpList().then()
        });
    }

    const openDetailsModal = ({data = {}, component, title}) => {
        openModal({
            Component: component,
            data,
            title,
        })
    }

    const handleOnDelete = async (data) => {
        setIsLoading(true);
        const {id} = data;
        try {
            const response = await del(apiConfig.followUp.delete, {data: {id}});
            if (response.status === 200) {
                utils.showNotifications('Success', 'Operation successful!', 'success', theme);
                getFollowUpList().then();
            }
        } catch (error) {
            console.log(error);
            utils.showNotifications('Error', error.message, 'error', theme);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Container fluid p={0} m={0}>
            <DataTableWrapper
                id="id"
                addTitle={'Student'}
                loading={isLoading}
                dataSource={dataSource}
                columns={columns}
                showAddButton={true}
                showActions={false}
                canDelete={false}
                canEdit={false}
                handleOnAdd={() => handleOnAddEdit(null, "add")}
                handleOnEdit={(data) => handleOnAddEdit(data, 'edit')}
                handleOnDelete={(data) => handleOnDelete(data)}
                onRefresh={getFollowUpList}
            />
        </Container>
    )
}