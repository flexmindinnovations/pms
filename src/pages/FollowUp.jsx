import {useCallback, useEffect, useState} from "react";
import {useModal} from "@hooks/AddEditModal.jsx";
import {Anchor, Button, Card, Container, Grid, Loader, Text, useMantineTheme} from "@mantine/core";
import {useHttp} from "@hooks/AxiosInstance.js";
import {useApiConfig} from "@context/ApiConfig.jsx";
import {utils} from "../utils.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import tz from "dayjs/plugin/timezone.js";
import {StudentDetails} from "../models/StudentDetails.jsx";
import {RecoveryAgentDetails} from "../models/RecoveryAgentDetails.jsx";
import {useLocation, useParams, useSearchParams} from "react-router-dom";
import {CreateUpdateFollowUp} from "@models/CreateUpdateFollowUp.jsx"
import {motion} from 'motion/react';
import {Plus} from 'lucide-react';

dayjs.extend(utc);
dayjs.extend(tz);

export default function FollowUp() {
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const {openModal} = useModal();
    const theme = useMantineTheme();
    const {get, del} = useHttp();
    const apiConfig = useApiConfig();
    const location = useLocation();
    const [params] = useSearchParams();
    const {campaignId} = useParams();
    useEffect(() => {
        getFollowupList().then();
    }, [])

    const getFollowupList = useCallback(async (
        pageNumber = utils.pageConfig.pageNumber,
        pageSize = utils.pageConfig.pageSize) => {
        setIsLoading(true);
        try {
            const campaignDetailsId = location.state.followUp?.campaignDetailsId || location.state.id;
            const response = await get(apiConfig.followUp.list(campaignDetailsId, pageNumber, pageSize));
            if (response.status === 200) {
                const data = response.data;
                const sortedFollowUps = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setDataSource(sortedFollowUps);
            }
        } catch (err) {
            const {message} = err;
            utils.showNotifications('Error', message, 'error', theme);
        } finally {
            setIsLoading(false);
        }
    }, [])

    const handleLinkClick = (record, src) => {
        switch (src) {
            case 'student':
                openDetailsModal({data: record, component: StudentDetails, title: 'Student Details'});
                break;
            case 'recoveryAgent':
                openDetailsModal({data: record, component: RecoveryAgentDetails, title: 'Recovery Agent Details'});
                break;
        }
    }


    const openAddEditModal = ({data = {}, mode = 'add'}) => {
        openModal({
            Component: CreateUpdateFollowUp,
            data,
            mode,
            title: 'Follow Up',
            handleRefresh: () => getFollowupList().then()
        });
    }

    const openDetailsModal = ({data = {}, Component, title}) => {
        openModal({
            Component,
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
            }
        } catch (error) {
            const {message} = error;
            utils.showNotifications('Error', message, 'error', theme);
        } finally {
            setIsLoading(false);
        }
    }

    const handleAddFollowUp = () => {
        const campaignDetailsId = location.state.followUp?.campaignDetailsId || location.state.id;
        const data = {campaignId, campaignDetailsId};
        openAddEditModal({data, mode: 'add'});
    }

    return (
        <Container fluid p={0} m={0} className={`w-full h-full flex flex-col items-center justify-start`}>
            <div className={`w-full flex items-center justify-end`}>
                <Button leftSection={<Plus size={16}/>} onClick={handleAddFollowUp}>
                    Follow Up
                </Button>
            </div>
            {
                !dataSource.length ? (
                        isLoading ? (
                            <div className={`h-full w-full flex items-center justify-center`}>
                                <Loader/>
                            </div>
                    ) :
                    <div className={`h-full w-full flex items-center justify-center`}>
                        <Text opacity={0.8}>
                            No following ups!
                        </Text>
                    </div>
                ) : (
                    <motion.div
                        variants={utils.parentVariants}
                        initial={'hidden'}
                        animate={'visible'}
                        className={`mt-4 py-4 h-full w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 place-content-start gap-4 overflow-auto`}>
                        {
                            dataSource?.map((record, index) => (
                                <motion.div variants={utils.childVariants}
                                            key={record.id + index}>
                                    <Card shadow="lg" className="max-h-[24rem] lg:max-h-[26rem] xl:max-h-[21rem]" p={20}
                                          withBorder key={record.id}>
                                        <Grid>
                                            <Grid.Col span={12}>
                                                <Text size={'sm'} opacity={0.6} size={"sm"} weight={500}>Agent
                                                    Name:</Text>
                                                <Text size={'sm'}>
                                                    <Anchor onClick={handleLinkClick}>
                                                        {record.recoveryAgentDto.name}
                                                    </Anchor>
                                                </Text>
                                            </Grid.Col>
                                            <Grid.Col span={12}>
                                                <Text size={'sm'} opacity={0.6} size={"sm"} weight={500}>Email:</Text>
                                                <Text size={'sm'}>{record.recoveryAgentDto.email}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={6}>
                                                <Text size={'sm'} opacity={0.6} size={"sm"} weight={500}>Contact:</Text>
                                                <Text size={'sm'}>{record.recoveryAgentDto.contact}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={6}>
                                                <Text size={'sm'} opacity={0.6} size={"sm"} weight={500}>Commitment
                                                    Date:</Text>
                                                <Text
                                                    size={'sm'}>{dayjs(record.committmentDate).format('MM/DD/YYYY')}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={6}>
                                                <Text size={'sm'} opacity={0.6} size={"sm"} weight={500}>Commitment
                                                    Amount:</Text>
                                                <Text size={'sm'}>₹{record.committmentAmount?.toLocaleString()}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={6}>
                                                <Text size={'sm'} opacity={0.6} size={"sm"} weight={500}>Last
                                                    Call:</Text>
                                                <Text
                                                    size={'sm'}>{dayjs.utc(record.timestamp).tz('Asia/Kolkata').format('MMMM D, YYYY h:mm A')}</Text>
                                            </Grid.Col>
                                            <Grid.Col span={12}>
                                                <Text size={'sm'} opacity={0.6} size={'sm'} weight={500}>Remarks:</Text>
                                                <Text size={'sm'} style={{whiteSpace: 'pre-wrap'}}>
                                                    {record.remarks}
                                                </Text>
                                            </Grid.Col>
                                        </Grid>
                                    </Card>
                                </motion.div>
                            ))
                        }
                    </motion.div>
                )
            }
        </Container>
    )
}