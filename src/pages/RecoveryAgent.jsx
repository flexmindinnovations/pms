import {Anchor, Container, useMantineTheme} from '@mantine/core';
import {DataTableWrapper} from "@components/DataTableWrapper.jsx";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useModal} from "@hooks/AddEditModal.jsx";
import {useHttp} from "@hooks/AxiosInstance.js";
import {useApiConfig} from "@context/ApiConfig.jsx";
import {utils} from "../utils.js";
import {CreateUpdateRecoveryAgent} from "../models/CreateUpdateRecoveryAgent.jsx";
import {RecoveryAgentDetails} from "@models/RecoveryAgentDetails.jsx";

export default function RecoveryAgent() {
    const [dataSource, setDataSource] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const {openModal} = useModal();
    const theme = useMantineTheme();
    const {get, del} = useHttp();
    const apiConfig = useApiConfig();
    const columns = useMemo(() => [
        {
            accessor: 'name',
            title: 'Name',
            minWidth: 150,
            ...utils.colPros,
            render: (record) => (
                <div className={`w-full text-start px-4`}>
                    <Anchor c={theme.colors.blue[6]} size={'sm'}
                            onClick={() => handleLinkClick(record, 'recoveryAgent')}>
                        {record.name}
                    </Anchor>
                </div>
            )
        },
        {
            accessor: 'email',
            title: 'Email',
            minWidth: 200,
            ...utils.colPros,
            render: (record) => (
                <p className={`px-4 text-start`}>{record.email}</p>
            ),
        },
        {
            accessor: 'contact',
            title: 'Contact',
            minWidth: 200,
            ...utils.colPros,
            render: (record) => (
                <p className={`px-4 text-start`}>{record.contact}</p>
            ),
        },
    ], [])

    useEffect(() => {
        getRecoveryAgentList().then();
    }, [])

    const getRecoveryAgentList = useCallback(async (
        pageNumber = utils.pageConfig.pageNumber,
        pageSize = 15) => {
        setIsLoading(true);
        try {
            const response = await get(apiConfig.recoveryAgent.list(pageNumber, pageSize));
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

    const openAddEditModal = ({data = {}, mode = 'add'}) => {
        openModal({
            Component: CreateUpdateRecoveryAgent,
            data,
            mode,
            title: 'Recovery Agent',
            handleRefresh: () => getRecoveryAgentList().then()
        });
    }

    const handleLinkClick = (record, user) => {
        switch (user) {
            case 'recoveryAgent': {
                openDetailsModel(record, RecoveryAgentDetails, 'Recovery Agent', 'view')
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
                onRefresh={() => getRecoveryAgentList()}
                onPageChange={getRecoveryAgentList}
            />
        </Container>
    )
}