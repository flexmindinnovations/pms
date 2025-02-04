import {Anchor, Text, Container, useMantineTheme} from "@mantine/core";
import {useCallback, useEffect, useMemo, useState} from "react";
import {DataTableWrapper} from "@components/DataTableWrapper.jsx";
import {utils} from "../utils.js";
import {CreateUpdateStudent} from "@models/CreateUpdateStudent.jsx";
import {useModal} from "@hooks/AddEditModal.jsx";
import {useHttp} from "@hooks/AxiosInstance.js";
import {useApiConfig} from "@context/ApiConfig.jsx";
import {CreateUpdateFollowUp} from "@models/CreateUpdateFollowUp.jsx";

export default function Students() {
    const [dataSource, setDataSource] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const {openModal} = useModal();
    const theme = useMantineTheme();
    const {get, post, del} = useHttp();
    const apiConfig = useApiConfig();
    const columns = useMemo(() => [
        {
            accessor: 'name',
            title: 'Name',
            minWidth: 150,
            ...utils.colPros,
            render: (record) => (
                <div className={`w-full text-left px-4`}>
                    {/*<Anchor c={theme.colors.blue[6]} size={'sm'} onClick={() => handleLinkClick(record)}>*/}
                    {/*    {record.name}*/}
                    {/*</Anchor>*/}
                    <p className={`px-4 text-start`}>{record.name}</p>
                </div>
            )
        },
        {
            accessor: 'instituteName',
            title: 'Institute',
            minWidth: 200,
            ...utils.colPros,
            render: (record) => (
                <p className={`px-4 text-start`}>{record.instituteName}</p>
            ),
        },
        {
            accessor: 'batch',
            title: 'Batch',
            minWidth: 100,
            ...utils.colPros,
            render: (record) => (
                <p className={`px-4 text-start`}>{record.batch}</p>
            ),
        },
        {
            accessor: 'phone',
            title: 'Phone',
            minWidth: 120,
            ...utils.colPros,
            render: (record) => (
                <p className={`px-4 text-start`}>{record.phone}</p>
            ),
        },
        {
            accessor: 'gaurdianPhone',
            title: 'Guardian Phone',
            minWidth: 140,
            ...utils.colPros,
            render: (record) => (
                <p className={`px-4 text-start`}>{record.gaurdianPhone}</p>
            ),
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
            accessor: 'gaurdianEmail',
            title: 'Guardian Email',
            minWidth: 200,
            ...utils.colPros,
            render: (record) => (
                <p className={`px-4 text-start`}>{record.gaurdianEmail}</p>
            ),
        },
    ], [])

    useEffect(() => {
        getStudentList().then();
    }, [])

    const handleLinkClick = (record) => {
        openFollowupModal({data: record});
    }

    const getStudentList = useCallback(async (
        pageNumber = utils.pageConfig.pageNumber,
        pageSize = utils.pageConfig.pageSize) => {
        setIsLoading(true);
        try {
            const response = await get(apiConfig.students.list(pageNumber, pageSize));
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
            Component: CreateUpdateStudent,
            data,
            mode,
            title: 'Student',
            handleRefresh: () => getStudentList().then()
        });
    }

    const openFollowupModal = ({data = {}, mode = 'followup'}) => {
        openModal({
            Component: CreateUpdateFollowUp,
            data,
            mode,
            title: 'Follow Up',
        })
    }

    const handleOnDelete = async (data) => {
        setIsLoading(true);
        const {id} = data;
        try {
            const response = await del(apiConfig.students.delete, {data: {id}});
            if (response.status === 200) {
                utils.showNotifications('Success', 'Operation successful!', 'success', theme);
                getStudentList().then();
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
                showActions={true}
                canDelete={true}
                canEdit={true}
                handleOnAdd={() => handleOnAddEdit(null, "add")}
                handleOnEdit={(data) => handleOnAddEdit(data, 'edit')}
                handleOnDelete={(data) => handleOnDelete(data)}
                onRefresh={() => getStudentList()}
            />
        </Container>
    )
}