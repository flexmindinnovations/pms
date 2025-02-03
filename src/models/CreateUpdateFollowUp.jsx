import {Anchor, Container, useMantineTheme} from "@mantine/core";
import dayjs from "dayjs";
import {DataTableWrapper} from "@components/DataTableWrapper.jsx";
import {useEffect, useState} from "react";
import {useHttp} from "@hooks/AxiosInstance.js";
import {useModal} from "@hooks/AddEditModal.jsx";
import {useApiConfig} from "@context/ApiConfig.jsx";
import {utils} from "../utils.js";
import {v4 as uuid} from "uuid";

export function CreateUpdateFollowUp({
                             data = {
                                 followUps: [],
                                 data: {}
                             }
                         }) {
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

    const [isLoading, setIsLoading] = useState(true);
    const [dataSource, setDataSource] = useState(data.followUps);
    const [tableColumns, setTableColumns] = useState([{}])
    const theme = useMantineTheme();
    const {get, del} = useHttp();
    const {openModal} = useModal();
    const apiConfig = useApiConfig();

    useEffect(() => {
        setDataSource(data.followUps);
        setTableColumns(columns);
        setIsLoading(false);
    }, [dataSource, tableColumns])

    const handleLinkClick = (record) => {
        console.log('record: ', record);
    }

    return (
        <Container size={'xl'} fluid>
            {
                dataSource?.length > 0 && tableColumns?.length > 0 &&
                <DataTableWrapper
                    tableId={uuid()}
                    loading={isLoading}
                    showAddButton={false}
                    showRefreshButton={false}
                    id={'id'}
                    addTitle={'Recovery Campaign Details'}
                    dataSource={dataSource}
                    columns={tableColumns}
                    showActions={false}
                    canEdit={false}
                    canDelete={false}
                />
            }
        </Container>
    )
}