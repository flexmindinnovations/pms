import {DataTable} from "mantine-datatable";
import {
    ActionIcon,
    CloseButton,
    CloseIcon,
    Group,
    Text,
    TextInput,
    Tooltip,
    useMantineColorScheme,
    useMantineTheme,
} from "@mantine/core";
import {useCallback, useEffect, useMemo, useState} from "react";
import {Plus, RefreshCcw, Search, SquarePen, Trash2,} from "lucide-react";
import {modals} from "@mantine/modals";
import styles from "@styles/DataTableWrapper.module.css";
import {data} from "react-router-dom";

export function DataTableWrapper({
                                     loading,
                                     columns = [],
                                     dataSource = {
                                         items: [],
                                         totalCount: 0,
                                         pageNumber: 1,
                                         hasPreviousPage: false,
                                         hasNextPage: false
                                     },
                                     showAddButton = false,
                                     addTitle = "",
                                     id,
                                     handleOnAdd,
                                     handleOnEdit,
                                     handleOnDelete,
                                     onRefresh,
                                     showActions = true,
                                     canEdit = true,
                                     canDelete = true,
                                 }) {
    const [pagination, setPagination] = useState({
        page: dataSource?.pageNumber || 1,
        pageSize: 15,
        sortStatus: {columnAccessor: "", direction: ""},
    });
    const [searchQuery, setSearchQuery] = useState("");

    const theme = useMantineTheme();
    const {colorScheme} = useMantineColorScheme();
    const themeMode = colorScheme === "auto"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        : colorScheme;

    const PAGE_SIZES = [10, 15, 20];
    const radius = theme.radius.xl;

    const filteredData = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return dataSource?.items?.filter((record) =>
            Object.values(record).some((value) =>
                String(value || "").toLowerCase().includes(query)
            )
        ) || [];
    }, [searchQuery, dataSource]);

    useEffect(() => {
        if (!dataSource) return;
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

    const openDeleteModal = useCallback((record) => {
        modals.openConfirmModal({
            title: "Delete Confirm",
            centered: true,
            children: <Text size="sm">Are you sure you want to delete this?</Text>,
            labels: {confirm: "Delete", cancel: "Cancel"},
            confirmProps: {color: 'red', radius: radius, icon: <Trash2 size={16}/>},
            cancelProps: {radius: radius, icon: <CloseIcon size={16}/>},
            onConfirm: () => handleOnDelete(record),
        });
    }, [handleOnDelete]);

    const enhancedColumns = useMemo(() => {
        if (!showActions || (!canEdit && !canDelete)) return columns;

        return [
            ...columns,
            {
                accessor: "actions",
                title: "Action",
                width: 80,
                textAlign: 'center',
                padding: 0,
                titleStyle: {
                    backgroundColor: theme.white
                },
                render: (record) => (
                    <Group gap={8} p={0} wrap="nowrap" justify="center" className={`bg-white min-h-[40px] w-full h-full`}>
                        {canEdit && (
                            <Tooltip label="Edit">
                                <SquarePen size={16} style={{cursor: "pointer"}} onClick={() => handleOnEdit(record)}/>
                            </Tooltip>
                        )}
                        {canDelete && (
                            <Tooltip label="Delete">
                                <Trash2
                                    size={16}
                                    style={{cursor: "pointer", color: "red"}}
                                    onClick={() => openDeleteModal(record)}
                                />
                            </Tooltip>
                        )}
                    </Group>
                ),
            },
        ];
    }, [columns, showActions, canEdit, canDelete, handleOnEdit, openDeleteModal]);

    const handlePageChange = (page) => {
        setPagination((prev) => ({...prev, page}));
        fetchData({page, pageSize: pagination.pageSize});
    };

    const handlePageSizeChange = (pageSize) => {
        setPagination({...pagination, pageSize, page: 1});
        fetchData({page: 1, pageSize});
    };

    const fetchData = ({page, pageSize}) => {
        onRefresh(page, pageSize);
    };

    return (
        <div className="h-full w-full flex flex-col items-start justify-start overflow-auto gap-4">
            <div className={`${styles.toolbar} w-full`}>
                <div className="search-filter flex items-center justify-between w-full gap-4">
                    <div style={{position: "relative", width: "50%"}}>
                        <TextInput
                            type="text"
                            leftSection={<Search size={16}/>}
                            disabled={loading || !dataSource?.items?.length}
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
                    <Group gap={1}>
                        <Tooltip label="Refresh Data">
                            <ActionIcon
                                onClick={onRefresh}
                                loading={loading}
                                style={{
                                    borderRadius: showAddButton ? `${radius} 0 0 ${radius}` : radius,
                                    width: 60,
                                    height: 38,
                                }}
                            >
                                <RefreshCcw size={16}/>
                            </ActionIcon>
                        </Tooltip>
                        {showAddButton && (
                            <Tooltip label={`Add ${addTitle}`}>
                                <ActionIcon
                                    onClick={handleOnAdd}
                                    disabled={loading}
                                    style={{
                                        borderRadius: `0 ${radius} ${radius} 0`,
                                        width: 60,
                                        height: 38,
                                    }}
                                >
                                    <Plus size={16}/>
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </Group>
                </div>
            </div>

            <DataTable
                withTableBorder
                withColumnBorders
                storeColumnsKey={id}
                striped
                borderRadius={theme.radius.lg}
                idAccessor={id}
                fetching={loading}
                highlightOnHover
                pinLastColumn
                records={filteredData}
                noRecordsText="No Records To Show"
                columns={enhancedColumns}
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
            />
        </div>
    );
}
