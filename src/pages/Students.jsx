import {Anchor, Container, useMantineTheme} from "@mantine/core";
import {useCallback, useEffect, useMemo, useState} from "react";
import {DataTableWrapper} from "@components/DataTableWrapper.jsx";
import {utils} from "../utils.js";
import {CreateUpdateStudent} from "../models/CreateUpdateStudent.jsx";
import {useModal} from "@hooks/AddEditModal.jsx";
import {FollowUp} from "../models/FllowUp.jsx";
import {useHttp} from "@hooks/AxiosInstance.js";
import {useApiConfig} from "@context/ApiConfig.jsx";

export default function Students() {
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
            accessor: 'instituteName',
            title: 'Institute',
            width: 200,
            style: {padding: '10px'},
            ...utils.colPros,
        },
        {
            accessor: 'batch',
            title: 'Batch',
            width: 100,
            style: {padding: '10px'},
            ...utils.colPros,
        },
        {
            accessor: 'phone',
            title: 'Phone',
            width: 120,
            style: {padding: '10px'},
            ...utils.colPros,
        },
        {
            accessor: 'gaurdianPhone',
            title: 'Guardian Phone',
            width: 140,
            style: {padding: '10px'},
            ...utils.colPros,
        },
        {
            accessor: 'email',
            title: 'Email',
            width: 200,
            style: {padding: '10px'},
            ...utils.colPros,
        },
        {
            accessor: 'gaurdianEmail',
            title: 'Guardian Email',
            width: 200,
            style: {padding: '10px'},
            ...utils.colPros,
        },
    ], [])

    useEffect(() => {
        getStudentList().then();
    }, [])

    const handleLinkClick = (record) => {
        openFollowupModal({data: record});
    }

    const getStudentList = useCallback(async (pageNumber = utils.pageConfig.pageNumber, pageSize = utils.pageConfig.pageSize) => {
        try {
            const response = await get(apiConfig.students.list(pageNumber, pageSize));
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
            title: 'Student',
            handleRefresh: () => getStudentList().then()
        });
    }

    const openFollowupModal = ({data = {}, mode = 'followup'}) => {
        openModal({
            Component: FollowUp,
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
                onRefresh={getStudentList}
            />
        </Container>
    )
}