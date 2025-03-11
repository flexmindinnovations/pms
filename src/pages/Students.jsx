import { TextInput, Text, Container, useMantineTheme, ActionIcon } from "@mantine/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DataTableWrapper } from "@components/DataTableWrapper.jsx";
import { utils } from "../utils.js";
import { CreateUpdateStudent } from "@models/CreateUpdateStudent.jsx";
import { useModal } from "@hooks/AddEditModal.jsx";
import { useHttp } from "@hooks/AxiosInstance.js";
import { useApiConfig } from "@context/ApiConfig.jsx";
import { CreateUpdateFollowUp } from "@models/CreateUpdateFollowUp.jsx";
import { Search, X } from 'lucide-react';

export default function Students() {
    const [dataSource, setDataSource] = useState(null);
    const [dataSourceCopy, setDataSourceCopy] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { openModal } = useModal();
    const theme = useMantineTheme();
    const { get, post, del } = useHttp();
    const apiConfig = useApiConfig();
    const [pagination, setPagination] = useState({
        page: dataSource?.pageNumber || 1,
        pageSize: 15,
        sortStatus: { columnAccessor: "", direction: "" },
    });
    const PAGE_SIZES = [10, 15, 20];
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        name: '',
        instituteName: '',
        batch: '',
        phone: '',
        gaurdianPhone: '',
        email: '',
        gaurdianEmail: ''
    });

    const columns = useMemo(() => [
        {
            accessor: 'name',
            title: 'Name',
            minWidth: 150,
            ...utils.colPros,
            render: (record) => (
                <div className={`w-full text-left px-4`}>
                    <Text className={`px-4 text-start`}>{record.name}</Text>
                </div>
            ),
            filter: (
                <TextInput
                    label="Name"
                    placeholder="Search name..."
                    leftSection={<Search size={16} />}
                    rightSection={
                        <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => handleFilterChange('name', '')}>
                            <X size={14} />
                        </ActionIcon>
                    }
                    value={filters.name}
                    onChange={(e) => handleFilterChange('name', e.currentTarget.value)}
                />
            ),
            filtering: filters.name !== ''
        },
        {
            accessor: 'instituteName',
            title: 'Institute',
            minWidth: 200,
            ...utils.colPros,
            render: (record) => (
                <p className={`px-4 text-start`}>{record.instituteName}</p>
            ),
            filter: (
                <TextInput
                    label="Institute"
                    placeholder="Search institute..."
                    leftSection={<Search size={16} />}
                    rightSection={
                        <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => handleFilterChange('instituteName', '')}>
                            <X size={14} />
                        </ActionIcon>
                    }
                    value={filters.instituteName}
                    onChange={(e) => handleFilterChange('instituteName', e.currentTarget.value)}
                />
            ),
            filtering: filters.instituteName !== ''
        },
        {
            accessor: 'batch',
            title: 'Batch',
            minWidth: 100,
            ...utils.colPros,
            render: (record) => (
                <p className={`px-4 text-start`}>{record.batch}</p>
            ),
            filter: (
                <TextInput
                    label="Batch"
                    placeholder="Search batch..."
                    leftSection={<Search size={16} />}
                    rightSection={
                        <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => handleFilterChange('batch', '')}>
                            <X size={14} />
                        </ActionIcon>
                    }
                    value={filters.batch}
                    onChange={(e) => handleFilterChange('batch', e.currentTarget.value)}
                />
            ),
            filtering: filters.batch !== ''
        },
        {
            accessor: 'phone',
            title: 'Phone',
            minWidth: 120,
            ...utils.colPros,
            render: (record) => (
                <p className={`px-4 text-start`}>{record.phone}</p>
            ),
            filter: (
                <TextInput
                    label="Phone"
                    placeholder="Search phone..."
                    leftSection={<Search size={16} />}
                    rightSection={
                        <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => handleFilterChange('phone', '')}>
                            <X size={14} />
                        </ActionIcon>
                    }
                    value={filters.phone}
                    onChange={(e) => handleFilterChange('phone', e.currentTarget.value)}
                />
            ),
            filtering: filters.phone !== ''
        },
        {
            accessor: 'gaurdianPhone',
            title: 'Guardian Phone',
            minWidth: 140,
            ...utils.colPros,
            render: (record) => (
                <p className={`px-4 text-start`}>{record.gaurdianPhone}</p>
            ),
            filter: (
                <TextInput
                    label="Guardian Phone"
                    placeholder="Search guardian phone..."
                    leftSection={<Search size={16} />}
                    rightSection={
                        <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => handleFilterChange('gaurdianPhone', '')}>
                            <X size={14} />
                        </ActionIcon>
                    }
                    value={filters.gaurdianPhone}
                    onChange={(e) => handleFilterChange('gaurdianPhone', e.currentTarget.value)}
                />
            ),
            filtering: filters.gaurdianPhone !== ''
        },
        {
            accessor: 'email',
            title: 'Email',
            minWidth: 200,
            ...utils.colPros,
            render: (record) => (
                <p className={`px-4 text-start`}>{record.email}</p>
            ),
            filter: (
                <TextInput
                    label="Email"
                    placeholder="Search email..."
                    leftSection={<Search size={16} />}
                    rightSection={
                        <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => handleFilterChange('email', '')}>
                            <X size={14} />
                        </ActionIcon>
                    }
                    value={filters.email}
                    onChange={(e) => handleFilterChange('email', e.currentTarget.value)}
                />
            ),
            filtering: filters.email !== ''
        },
        {
            accessor: 'gaurdianEmail',
            title: 'Guardian Email',
            minWidth: 200,
            ...utils.colPros,
            render: (record) => (
                <p className={`px-4 text-start`}>{record.gaurdianEmail}</p>
            ),
            filter: (
                <TextInput
                    label="Guardian Email"
                    placeholder="Search guardian email..."
                    leftSection={<Search size={16} />}
                    rightSection={
                        <ActionIcon size="sm" variant="transparent" c="dimmed" onClick={() => handleFilterChange('gaurdianEmail', '')}>
                            <X size={14} />
                        </ActionIcon>
                    }
                    value={filters.gaurdianEmail}
                    onChange={(e) => handleFilterChange('gaurdianEmail', e.currentTarget.value)}
                />
            ),
            filtering: filters.gaurdianEmail !== ''
        },
    ], [filters]);


    useEffect(() => {
        getStudentList().then();
    }, [])

    const handleFilterChange = (column, value) => {
        if (value) {
            setSearchQuery(value);
            setFilters(prev => ({
                ...prev,
                [column]: value
            }));
        } else {
            setSearchQuery('');
            setFilters(prev => ({
                ...prev,
                [column]: ''
            }));
            setDataSource(dataSourceCopy)
        }
    };

    const handleLinkClick = (record) => {
        openFollowupModal({ data: record });
    }

    const filteredData = useMemo(() => {
        if (!dataSource?.items) return { items: [], totalCount: 0, pageNumber: 1, totalPages: 1, hasPreviousPage: false, hasNextPage: false };

        const query = searchQuery.toLowerCase();
        let filteredItems = [];

        if (query) {
            filteredItems = dataSource.items.filter((record) => {
                return (
                    (record?.name && record.name.toLowerCase().includes(query)) ||
                    (record?.instituteName && record.instituteName.toLowerCase().includes(query)) ||
                    (record?.batch && record.batch.toLowerCase().includes(query)) ||
                    (record?.phone && record.phone.toLowerCase().includes(query)) ||
                    (record?.gaurdianPhone && record.gaurdianPhone.toLowerCase().includes(query)) ||
                    (record?.email && record.email.toLowerCase().includes(query)) ||
                    (record?.gaurdianEmail && record.gaurdianEmail.toLowerCase().includes(query))
                );
            });
        } else {
            filteredItems = dataSource.items.filter((record) => {
                return columns.every((col) => {
                    if (filters[col.accessor]) {
                        switch (col.accessor) {
                            case 'name':
                                return record.name?.toLowerCase().includes(filters.name.toLowerCase());
                            case 'instituteName':
                                return record.instituteName?.toLowerCase().includes(filters.instituteName.toLowerCase());
                            case 'batch':
                                return record.batch?.toLowerCase().includes(filters.batch.toLowerCase());
                            case 'phone':
                                return record.phone?.toLowerCase().includes(filters.phone.toLowerCase());
                            case 'gaurdianPhone':
                                return record.gaurdianPhone?.toLowerCase().includes(filters.gaurdianPhone.toLowerCase());
                            case 'email':
                                return record.email?.toLowerCase().includes(filters.email.toLowerCase());
                            case 'gaurdianEmail':
                                return record.gaurdianEmail?.toLowerCase().includes(filters.gaurdianEmail.toLowerCase());
                            default:
                                return true;
                        }
                    }
                    return true;
                });
            });
        }

        const totalCount = filteredItems.length;
        const totalPages = Math.ceil(totalCount / pagination.pageSize);
        const startIndex = (pagination.page - 1) * pagination.pageSize;
        const endIndex = pagination.page * pagination.pageSize;

        const paginatedItems = filteredItems.slice(startIndex, endIndex);

        return {
            items: paginatedItems,
            totalCount,
            pageNumber: pagination.page,
            totalPages,
            hasPreviousPage: pagination.page > 1,
            hasNextPage: pagination.page < totalPages,
        };
    }, [dataSource, filters, searchQuery, columns, pagination.page, pagination.pageSize]);

    const getStudentList = useCallback(async (
        pageNumber = utils.pageConfig.pageNumber,
        pageSize = utils.pageConfig.pageSize) => {
        setIsLoading(true);
        try {
            const response = await get(apiConfig.students.list(pageNumber, pageSize));
            if (response.status === 200) {
                const data = response.data;
                setDataSource(data);
                setDataSourceCopy(data);
                setPagination((prev) => ({
                    ...prev,
                    page: data.pageNumber || 1,
                    totalRecords: data.totalCount || 0,
                    hasPreviousPage: !!data.hasPreviousPage,
                    hasNextPage: !!data.hasNextPage,
                }));
            }
        } catch (err) {
            const { message } = err;
            utils.showNotifications('Error', message, 'error', theme);
        } finally {
            setIsLoading(false);
        }
    }, [])

    const handleOnAddEdit = (data, mode) => {
        openAddEditModal({ data, mode });
    }

    const openAddEditModal = ({ data = {}, mode = 'add' }) => {
        openModal({
            Component: CreateUpdateStudent,
            data,
            mode,
            title: 'Student',
            handleRefresh: () => getStudentList().then()
        });
    }

    const openFollowupModal = ({ data = {}, mode = 'followup' }) => {
        openModal({
            Component: CreateUpdateFollowUp,
            data,
            mode,
            title: 'Follow Up',
        })
    }

    const handleOnDelete = async (data) => {
        setIsLoading(true);
        const { id } = data;
        try {
            const response = await del(apiConfig.students.delete, { data: { id } });
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
            {
                filteredData ?

                    <DataTableWrapper
                        id="id"
                        addTitle={'Student'}
                        loading={isLoading}
                        dataSource={filteredData}
                        columns={columns}
                        showAddButton={true}
                        showActions={true}
                        canDelete={true}
                        canEdit={true}
                        handleOnAdd={() => handleOnAddEdit(null, "add")}
                        handleOnEdit={(data) => handleOnAddEdit(data, 'edit')}
                        handleOnDelete={(data) => handleOnDelete(data)}
                        onRefresh={() => getStudentList()}
                        onPageChange={getStudentList}
                    />
                    : <Text>Loading...</Text>
            }
        </Container>
    )
}