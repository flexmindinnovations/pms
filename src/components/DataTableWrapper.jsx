import {DataTable} from 'mantine-datatable';
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
    ScrollArea
} from '@mantine/core';
import {useCallback, useEffect, useState} from 'react';
import {ChevronRightIcon, Plus, RefreshCcw, Search, SquarePen, Stethoscope, Trash2} from 'lucide-react';
import {modals} from "@mantine/modals";
import styles from "@styles/DataTableWrapper.module.css";
import clsx from "clsx";

export function DataTableWrapper({
                                     loading,
                                     columns = [],
                                     dataSource = [],
                                     showAddButton = false,
                                     addTitle = '',
                                     id,
                                     handleOnAdd,
                                     handleOnEdit,
                                     handleOnDelete,
                                     onRefresh,
                                     nestedTableConfig = null,
                                     hasNestedTable = false,
                                     nestedTableAccessor = '',
                                     nestedColumns = [],
                                     nestedTableAccessorId,
                                     showActions = true,
                                     canEdit = true,
                                     canDelete = true,
                                 }) {
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        sortStatus: {columnAccessor: '', direction: ''},
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(dataSource || []);
    const theme = useMantineTheme();
    const {colorScheme} = useMantineColorScheme();
    const [themeMode, setThemeMode] = useState(colorScheme);
    const [rowData, setRowData] = useState({});
    const [expandedRowIds, setExpandedRowIds] = useState([]);

    const PAGE_SIZES = [10, 15, 20];
    const radius = theme.radius.xl;

    const applyFilters = () => {
        const query = searchQuery.toLowerCase();
        if (dataSource?.length) {
            setFilteredData(
                dataSource.filter((record) =>
                    Object.values(record).some((value) =>
                        String(value).toLowerCase().includes(query)
                    )
                )
            );
        }
    };

    useEffect(applyFilters, [searchQuery, dataSource]);

    useEffect(() => {
        if (colorScheme === 'auto') {
            const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setThemeMode(isDarkMode ? 'dark' : 'light');
        } else {
            setThemeMode(colorScheme);
        }
    }, [colorScheme]);

    const handleSortChange = (sortStatus) => {
        const {columnAccessor, direction} = sortStatus;
        setFilteredData((prev) =>
            [...prev].sort((a, b) => {
                const valA = a[columnAccessor];
                const valB = b[columnAccessor];
                return direction === 'asc'
                    ? valA > valB
                        ? 1
                        : -1
                    : valA < valB
                        ? 1
                        : -1;
            })
        );
        setPagination((prev) => ({...prev, sortStatus}));
    };

    const enhancedColumns = (showActions && (canEdit || canDelete)) ? [
        ...columns.map((col) => ({...col})),
        {
            accessor: 'actions',
            title: 'Action',
            width: 60,
            titleStyle: () => ({
                backgroundColor: themeMode === 'light' ? theme.white : theme.colors.dark[7],
                textAlign: 'center'
            }),
            cellsStyle: () => ({
                backgroundColor: themeMode === 'light' ? theme.white : theme.colors.dark[7],
            }),
            render: (record) => (
                <Group gap={8} wrap='nowrap' justify='center'>
                    {
                        canEdit && (
                            <Tooltip label={'Edit'}>
                                <SquarePen
                                    size={16}
                                    style={{cursor: 'pointer'}}
                                    onClick={() => handleOnEdit(record)}
                                />
                            </Tooltip>
                        )
                    }
                    {
                        canDelete && (
                            <Tooltip label={'Delete'}>
                                <Trash2
                                    size={16}
                                    style={{cursor: 'pointer', color: 'red'}}
                                    onClick={() => {
                                        setRowData(record);
                                        openDeleteModal(record);
                                    }}
                                />
                            </Tooltip>
                        )
                    }
                </Group>
            ),
        },
    ] : [...columns.map((col) => ({...col}))];

    const nestedTableConfigIndex = enhancedColumns.findIndex((col) => col.accessor === nestedTableConfig);
    enhancedColumns[nestedTableConfigIndex] = {
        ...enhancedColumns[nestedTableConfigIndex],
        render: (record) => (
            <Group gap={5}>
                <Tooltip label={expandedRowIds.includes(record[id]) ? 'Collapse Row' : 'Expand Row'}>
                    <ChevronRightIcon
                        size={16}
                        className={clsx(styles.icon, styles.expandIcon, {
                            [styles.expandIconRotated]: expandedRowIds.includes(record[id]),
                        })}
                    />
                </Tooltip>
                <Stethoscope size={14}/>
                <span>{record[nestedTableConfig]}</span>
            </Group>
        )
    }

    const openDeleteModal = useCallback(
        (data) => {
            modals.closeAll();
            modals.openConfirmModal({
                title: 'Delete Confirm',
                centered: true,
                withOverlay: true,
                children: (
                    <Text size="sm">{'Are you sure you want to delete this'}?</Text>
                ),
                labels: {confirm: 'Delete', cancel: 'Cancel'},
                confirmProps: {color: 'red', radius: radius, leftSection: <Trash2 size={16}/>},
                cancelProps: {radius: radius, leftSection: <CloseIcon size={16}/>},
                onCancel: () => {
                },
                onConfirm: () => onDelete(data),
            })
        }, [])

    const onDelete = (data) => {
        handleOnDelete(data);
    }

    const rowExpansionConfig = hasNestedTable
        ? {
            allowMultiple: false,
            expanded: {recordIds: expandedRowIds, onRecordIdsChange: setExpandedRowIds},
            content: (nested) => (
                <Group justify={'center'} align={'center'} width={'100%'}>
                    <DataTable
                        idAccessor={nestedTableAccessorId}
                        styles={{
                            root: {width: '50%'},
                            header: {
                                fontSize: theme.fontSizes.xs,
                            },
                        }}
                        noRecordsText={'No Records To Show'}
                        columns={nestedColumns}
                        records={nested.record[nestedTableAccessor]}
                        rowStyle={(record, index) => ({
                            fontSize: theme.fontSizes.xs,
                            borderBottom: index === nested.record[nestedTableAccessor]?.length - 1 ? 'none' : '',
                        })}
                    />
                </Group>
            ),
        }
        : undefined;

    const paginatedData = filteredData.slice(
        (pagination.page - 1) * pagination.pageSize,
        pagination.page * pagination.pageSize
    );

    return (
        <div className="h-full w-full flex flex-col items-start justify-start gap-4">
            <div className={`${styles.toolbar}`}>
                <div className="search-filter flex items-center justify-between w-full gap-4">
                    <div style={{position: 'relative', width: '50%'}}>
                        <TextInput
                            type="text"
                            leftSection={<Search size={16}/>}
                            disabled={loading || !dataSource?.length}
                            rightSection={searchQuery && <Tooltip label={'Clear Search'}><CloseButton
                                onClick={() => setSearchQuery('')}/></Tooltip>}
                            rightSectionWidth={40}
                            placeholder={'Search'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{width: '100%'}}
                        />
                    </div>
                    <Group gap={1}>
                        <Tooltip label={'Refresh Data'}>
                            <ActionIcon
                                onClick={onRefresh}
                                loading={loading}
                                style={{
                                    borderRadius: showAddButton
                                        ? `${radius} 0 0 ${radius}`
                                        : radius,
                                    width: 60,
                                    height: 38,
                                }}
                            >
                                {<RefreshCcw size={16}/>}
                            </ActionIcon>
                        </Tooltip>
                        {showAddButton && (
                            <Tooltip label={`${'Add'} ${addTitle}`}>
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
                classNames={{
                    pagination: {
                        fontSize: theme.fontSizes.xs,
                    }
                }}
                styles={{
                    root: {
                        maxHeight: 'calc(100vh - 210px)',
                        minHeight: '25vh',
                        width: '100%',

                    },
                    body:{
                        overflowY: 'auto',
                    },
                    header: {
                        fontSize: theme.fontSizes.xs,
                    },
                    row: {
                        height: '50px',
                    },
                    pagination: {
                        fontSize: theme.fontSizes.xs,
                    },
                }}
                idAccessor={id}
                fetching={loading}
                highlightOnHover
                pinLastColumn
                records={paginatedData}
                noRecordsText={'No Records To Show'}
                recordsPerPageLabel={'Records Per Page'}
                columns={enhancedColumns}
                totalRecords={filteredData?.length}
                recordsPerPage={pagination.pageSize}
                page={pagination.page}
                onPageChange={(page) => setPagination((prev) => ({...prev, page}))}
                recordsPerPageOptions={PAGE_SIZES}
                onRecordsPerPageChange={(pageSize) =>
                    setPagination((prev) => ({...prev, pageSize}))
                }
                sortStatus={pagination.sortStatus}
                onSortStatusChange={handleSortChange}
                paginationSize="md"
                paginationText={({from, to, totalRecords}) =>
                    `${'Records'} ${from} - ${to} ${'of'} ${totalRecords}`
                }
                rowStyle={(record, index) => ({
                    fontSize: theme.fontSizes.xs,
                    height: '50px',
                })}
                paginationWrapBreakpoint="sm"
                rowExpansion={rowExpansionConfig}
            />
        </div>
    );
}
