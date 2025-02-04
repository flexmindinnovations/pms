import {ActionIcon, Anchor, CloseButton, Container, Text, TextInput, Tooltip, useMantineTheme} from "@mantine/core";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useHttp} from "@hooks/AxiosInstance.js";
import {useApiConfig} from "@context/ApiConfig.jsx";
import {utils} from "../utils.js";
import {ExternalLink, IndianRupee, Search} from 'lucide-react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {DataTable} from "mantine-datatable";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import tz from "dayjs/plugin/timezone.js";
import {useModal} from "@hooks/AddEditModal.jsx";
import {RecoveryAgentDetails} from "@models/RecoveryAgentDetails.jsx";
import {StudentDetails} from "@models/StudentDetails.jsx";
import {CreateUpdateStudent} from "@models/CreateUpdateStudent.jsx";

dayjs.extend(utc);
dayjs.extend(tz);

export default function CampaignDetails() {
    const {campaignId} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [dataSource, setDataSource] = useState(null);
    const theme = useMantineTheme();
    const {get, del} = useHttp();
    const apiConfig = useApiConfig();
    const {openModal} = useModal();
    const [pagination, setPagination] = useState({
        page: dataSource?.pageNumber || 1,
        pageSize: 15,
        sortStatus: {columnAccessor: "", direction: ""},
    });
    const PAGE_SIZES = [10, 15, 20];
    const [searchQuery, setSearchQuery] = useState("");

    const moreDetailsColumns = [

        {
            accessor: 'followUp',
            title: 'Follow Up',
            textAlign: 'center',
            minWidth: 40,
            width: 100,
            titleStyle: {
                backgroundColor: theme.white
            },
            render: (record) => (
                <div className={`bg-white w-full flex items-center justify-center`}>
                    <ActionIcon onClick={() => openFollowUpModal(record)} size={"md"}>
                        <ExternalLink size={14}/>
                    </ActionIcon>
                </div>
            ),
        },
    ];
    const studentColumns = [
        {
            accessor: 'name',
            title: 'Name',
            minWidth: 150,
            ...utils.colPros,
            render: (record) => (
                <div className={`w-full text-left px-4 py-2`}>
                    <Anchor c={theme.colors.blue[6]} size={'md'} onClick={() => handleLinkClick(record, 'student')}>
                        {record.name}
                    </Anchor>
                </div>
            )
        },
        {
            accessor: 'instituteName',
            title: 'Institute',
            minWidth: 220,
            ...utils.colPros,
            width: 220,
            render: (record) => (
                <p className={`px-4 py-2 text-base text-start`}>{record.instituteName}</p>
            ),
        },
        {
            accessor: 'batch',
            title: 'Batch',
            minWidth: 200,
            ...utils.colPros,
            width: 200,
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
    ]
    const followUpColumns = [
        {
            accessor: 'outstandingAmount',
            title: 'Balances',
            minWidth: 150,
            ...utils.colPros,
            render: ({followUp}) => (
                <div className={`w-full text-left px-4 py-2`}>
                    {
                        followUp?.outstandingAmount ? (
                                <Text className={`flex items-center`}><IndianRupee size={14}/>{followUp?.outstandingAmount}
                                </Text>
                            ) :
                            <Text>NA</Text>
                    }
                </div>
            )
        },
        {
            accessor: 'timestamp',
            title: 'Last Followup',
            minWidth: 150,
            ...utils.colPros,
            render: ({followUp}) => (
                <div className={`w-full text-left px-4 py-2`}>
                    <Text>{dayjs.utc(followUp?.timestamp).tz('Asia/Kolkata').format('MMMM D, YYYY h:mm A')}</Text>
                </div>
            )
        },
        {
            accessor: 'noOfCalls',
            title: 'No. of Calls',
            minWidth: 80,
            ...utils.colPros,
            render: (record) => (
                <div className={`w-full text-left px-4 py-2`}>
                    <Text>{record?.followups?.length}</Text>
                </div>
            )
        },
        {
            accessor: 'lastCaller',
            title: 'Last Caller',
            minWidth: 80,
            ...utils.colPros,
            render: (record) => (
                <div className={`w-full text-left px-4 py-2`}>
                    <Anchor c={theme.colors.blue[6]} size={'md'}
                            onClick={() => handleLinkClick(record, 'recoveryAgent')}>
                        {record?.followUp?.recoveryAgentDto?.name}
                    </Anchor>
                </div>
            )
        },
        {
            accessor: 'commitmentDate',
            title: 'Commitment Date',
            minWidth: 80,
            ...utils.colPros,
            render: (record) => (
                <div className={`w-full text-left px-4 py-2`}>
                    <Text>{dayjs(record?.followUp?.committmentDate).format('MM/DD/YYYY')}</Text>
                </div>
            )
        },
        {
            accessor: 'commitmentAmount',
            title: 'Commitment Amount',
            minWidth: 80,
            ...utils.colPros,
            render: ({followUp}) => (
                <div className={`w-full text-left px-4 py-2`}>
                    {
                        followUp?.committmentAmount ? (
                                <Text className={`flex items-center`}><IndianRupee size={14}/>{followUp?.committmentAmount}
                                </Text>
                            ) :
                            <Text>NA</Text>
                    }
                </div>
            )
        }
    ]

    const filteredData = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return dataSource?.items?.filter((record) =>
            Object.values(record).some((value) =>
                String(value || "").toLowerCase().includes(query)
            )
        ) || [];
    }, [searchQuery, dataSource]);

    useEffect(() => {
        if (!dataSource?.items?.length) return;
        setPagination((prev) => ({
            ...prev,
            page: dataSource.pageNumber || 1,
            totalRecords: dataSource.totalCount || 0,
            hasPreviousPage: !!dataSource.hasPreviousPage,
            hasNextPage: !!dataSource.hasNextPage,
        }));
        filteredData.slice(
            (pagination.page - 1) * pagination.pageSize,
            pagination.page * pagination.pageSize
        )
    }, [dataSource]);

    const handleSortChange = useCallback((sortStatus) => {
        setPagination((prev) => ({...prev, sortStatus}));
    }, []);

    const handlePageChange = (page) => {
        setPagination((prev) => ({...prev, page}));
        fetchData({page, pageSize: pagination.pageSize});
    };

    const handlePageSizeChange = (pageSize) => {
        setPagination({...pagination, pageSize, page: 1});
        fetchData({page: 1, pageSize});
    };

    const fetchData = ({page, pageSize}) => {
        getCampaignDetails(page, pageSize).then();
    };

    const openFollowUpModal = (record) => {
        navigate(`/campaign-details/${campaignId}/follow-up`, {state: record});
    }

    const handleLinkClick = (record, user) => {
        switch (user) {
            case 'recoveryAgent': {
                const {recoveryAgentDto} = record.followUp;
                openDetailsModel(recoveryAgentDto, RecoveryAgentDetails, 'Recovery Agent', 'view')
                break;
            }
            case 'student': {
                const {studentDto} = record;
                openDetailsModel(studentDto, CreateUpdateStudent, 'Update Student Details', 'edit');
                break;
            }
        }
    }

    const openDetailsModel = (data, component, title, mode) => {
        openModal({
            data,
            Component: component,
            isAddEdit: mode !== 'edit',
            withCloseButton: true,
            size: mode === 'edit' ? 'lg' : 'md',
            title,
            isView: mode !== 'edit',
        })
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
                            ...record,
                            followups: record.followups,
                            followUp: record.followups.reduce((latest, current) => {
                                return dayjs(current.timestamp).isAfter(dayjs(latest.timestamp)) ? current : latest;
                            }, record.followups[0]),
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
            <div className={`mb-4`} style={{position: "relative", width: "50%"}}>
                <TextInput
                    type="text"
                    leftSection={<Search size={16}/>}
                    disabled={isLoading || !dataSource?.items?.length}
                    rightSection={
                        searchQuery && (
                            <Tooltip label="Clear Search">
                                <CloseButton onClick={() => setSearchQuery("")}/>
                            </Tooltip>
                        )
                    }
                    rightSectionWidth={40}
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{width: "100%"}}
                />
            </div>
            <DataTable
                withTableBorder
                withColumnBorders
                records={filteredData}
                fetching={isLoading}
                pinLastColumn
                borderRadius={theme.radius.lg}
                striped
                totalRecords={pagination?.totalRecords}
                recordsPerPage={pagination.pageSize}
                page={pagination.page}
                onPageChange={handlePageChange}
                onRecordsPerPageChange={handlePageSizeChange}
                recordsPerPageOptions={PAGE_SIZES}
                sortStatus={pagination.sortStatus}
                onSortStatusChange={handleSortChange}
                paginationSize="md"
                paginationText={({from, to, totalRecords}) =>
                    `Records ${from} - ${to} of ${totalRecords}`
                }
                paginationWrapBreakpoint="sm"
                styles={{
                    root: {
                        width: "100%",
                        minHeight: '25vh'
                    },
                    td: {
                        padding: 0,
                    },
                }}
                groups={[
                    {
                        id: 'student',
                        title: 'Student',
                        textAlign: 'center',
                        columns: studentColumns
                    },
                    {
                        id: 'follow-up',
                        title: 'Follow Up',
                        textAlign: 'center',
                        columns: followUpColumns
                    },
                    {
                        id: 'details',
                        textAlign: 'center',
                        columns: moreDetailsColumns
                    }
                ]}
            />
        </Container>
    )
}