import {Anchor, Container, useMantineTheme} from '@mantine/core';
import {DataTableWrapper} from "@components/DataTableWrapper.jsx";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useModal} from "@hooks/AddEditModal.jsx";
import {useHttp} from "@hooks/AxiosInstance.js";
import {useApiConfig} from "@context/ApiConfig.jsx";
import {utils} from "../utils.js";
import {CreateUpdateStudent} from "../models/CreateUpdateStudent.jsx";
import {CreateUpdateRecoveryAgent} from "../models/CreateUpdateRecoveryAgent.jsx";

export default function RecoveryAgent({data}) {

    /*
    * Id
    * Name
    * Email
    * Contact
    * */
    const [dataSource, setDataSource] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const {openModal} = useModal();
    const theme = useMantineTheme();
    const {get, post, del} = useHttp();
    const apiConfig = useApiConfig();
    const columns = useMemo(() => [
        // {
        //     accessor: 'id',
        //     title: 'ID',
        //     width: 40,
        //     style: {padding: '10px'},
        //     ...colPros,
        //     render: (record) => (
        //         <div className={`w-full, text-center`}>
        //             <Anchor c={theme.colors.blue[6]} onClick={() => handleIdClick(record)}>
        //                 {record.id}
        //             </Anchor>
        //         </div>
        //     )
        // },
        {
            accessor: 'name',
            title: 'Name',
            width: 150,
            style: {padding: '10px'},
            ...utils.colPros,
            render: (record) => (
                <div className={`w-full, text-left`}>
                    <Anchor c={theme.colors.blue[6]} size={'xs'} onClick={() => handleLinkClick(record)}>
                        {record.name}
                    </Anchor>
                </div>
            )
        },
        {
            accessor: 'email',
            title: 'Email',
            width: 200,
            style: {padding: '10px'},
            ...utils.colPros
        },
        {
            accessor: 'contact',
            title: 'Contact',
            width: 200,
            style: {padding: '10px'},
            ...utils.colPros
        },
    ], [])

    useEffect(() => {
        getRecoveryAgentList().then();
    }, [])

    const getRecoveryAgentList = useCallback(async () => {
        try {
            const response = await get(apiConfig.recoveryAgent.list(utils.pageConfig.pageNumber, utils.pageConfig.pageSize));
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
            Component: CreateUpdateRecoveryAgent,
            data,
            mode,
            title: 'Recovery Agent',
            handleRefresh: () => getRecoveryAgentList().then()
        });
    }

    const handleOnDelete = async (data) => {
        setIsLoading(true);
        const {id} = data;
        try {
            const response = await del(apiConfig.recoveryAgent.delete, {data: {id}});
            if (response.status === 200) {
                utils.showNotifications('Success', 'Operation successful!', 'success', theme);
                getRecoveryAgentList().then();
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
                showAddButton={false}
                showActions={true}
                canDelete={false}
                canEdit={true}
                handleOnAdd={() => handleOnAddEdit(null, "add")}
                handleOnEdit={(data) => handleOnAddEdit(data, 'edit')}
                handleOnDelete={(data) => handleOnDelete(data)}
                onRefresh={getRecoveryAgentList}
            />
        </Container>
    )
}