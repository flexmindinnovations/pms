import {Anchor, Container, useMantineTheme} from "@mantine/core";
import {useCallback, useEffect, useMemo, useState} from "react";
import {DataTableWrapper} from "@components/DataTableWrapper.jsx";
import {studentData, utils} from "../utils.js";
import {CreateUpdateStudent} from "../models/CreateUpdateStudent.jsx";
import {useModal} from "@hooks/AddEditModal.jsx";
import {FollowUp} from "../models/FllowUp.jsx";
import {useHttp} from "@hooks/AxiosInstance.js";
import {useApiConfig} from "@context/ApiConfig.jsx";


export default function Students() {

    /*
    * id
    * Name
    * Institute
    * Batch
    * Phone
    * Guardian Phone
    * Email
    * Guardian Email
    * */

    // {
    //     "id": "becb2b7c-a45f-426d-9029-0d2a62275691",
    //     "name": "Ali Khan",
    //     "instituteName": "Oxford International School",
    //     "batch": "2025",
    //     "phone": "+919876543210",
    //     "gaurdianPhone": "+919876543211",
    //     "email": "ali.khan@example.com",
    //     "gaurdianEmail": "parent.khan@example.com"
    // }

    const colPros = {
        height: 50,
    }
    const [dataSource, setDataSource] = useState(studentData);
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
            ...colPros,
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
            ...colPros
        },
        {
            accessor: 'batch',
            title: 'Batch',
            width: 100,
            style: {padding: '10px'},
            ...colPros
        },
        {
            accessor: 'phone',
            title: 'Phone',
            width: 120,
            style: {padding: '10px'},
            ...colPros
        },
        {
            accessor: 'gaurdianPhone',
            title: 'Guardian Phone',
            width: 140,
            style: {padding: '10px'},
            ...colPros
        },
        {
            accessor: 'email',
            title: 'Email',
            width: 200,
            style: {padding: '10px'},
            ...colPros
        },
        {
            accessor: 'gaurdianEmail',
            title: 'Guardian Email',
            width: 200,
            style: {padding: '10px'},
            ...colPros
        },
    ], [])

    const pageConfig = {
        pageNumber: 1,
        pageSize: 10,
    }

    useEffect(() => {
        if (dataSource.length) setIsLoading(false);
        getStudentList().then((res) => {
        });
    }, [dataSource])

    const handleLinkClick = (record) => {
        openFollowupModal({data: record});
    }

    const getStudentList = useCallback(async () => {
        try {
            const response = await get(apiConfig.students.list(pageConfig.pageNumber, pageConfig.pageSize));
            if (response.status === 200) {
                const data = response.data;
                console.log('data: ', data);
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
            handleRefresh: getStudentList
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

    const handleOnDelete = (data) => {
        console.log('data: ', data);
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
                handleOnAdd={handleOnAddEdit}
                handleOnEdit={(data) => handleOnAddEdit(data, 'add')}
                handleOnDelete={(data) => handleOnDelete(data, 'edit')}
                onRefresh={getStudentList}
            />
        </Container>
    )
}