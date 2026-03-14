'use client';

import InfiniteScrollTrigger from '@/components/InfiniteScrollTrigger';
import ListComponent from '@/components/List';
import SuspenseLoader from '@/components/SuspenseLoader';
import TableComponent, { TableColumn } from '@/components/TableComponent';
import { TopNav } from '@/features/shared/components/DashboardShared';
import TemplateListItem from '@/features/templates/components/TemplateListItem';
import TemplateStatusBadge from '@/features/templates/components/TemplateStatusBadge';
import WhatsAppPreview from '@/features/templates/components/WhatsAppPreview';
import type { PaginatedResponse } from '@/models/pagination';
import { Template } from '@/models/templates';
import { useGetTemplatesInfiniteQuery, useGetTemplatesQuery } from '@/services/templates';
import { useViewModeStore } from '@/stores/viewModeStore';
import { PermissionKey } from '@/types/permissions';
import DocsIcon from '@/ui/icons/Docs';
import ModalComponent from '@/ui/Modal';
import ModalHeader from '@/ui/Modal/ModalHeader';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Helmet } from 'react-helmet-async';

interface Props {
    initialData?: PaginatedResponse<Template>;
}

const initialState: Template = {
    id: '',
    client_id: '',
    name: '',
    category: 'MARKETING',
    language: 'en_US',
    status: 'PENDING',
    parameter_format: 'positional',
    components: [],
    send_to_meta: false,
};

const templateTableColumns: TableColumn<Template>[] = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'category', label: 'Category', minWidth: 120 },
    { id: 'language', label: 'Language', minWidth: 100 },
    {
        id: 'status',
        label: 'Status',
        minWidth: 120,
        format: (value: string) => <TemplateStatusBadge status={value} />,
    },
    { id: 'parameter_format', label: 'Param Format', minWidth: 120 },
    {
        id: 'send_to_meta',
        label: 'Send to Meta',
        minWidth: 100,
        format: (value: boolean) => (value ? 'Yes' : 'No'),
    },
    {
        id: 'created_at',
        label: 'Created At',
        minWidth: 150,
        format: (value: string) => (value ? new Date(value).toLocaleDateString() : '-'),
    },
    { id: 'actions', label: 'Actions', minWidth: 100, align: 'center' },
];

function TemplatesPage({ initialData }: Props) {
    const router = useRouter();
    const [isPending] = useTransition();
    const [page, setPage] = useState<number>(1);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const {
        data: templatesData,
        isLoading: isLoadingTemplates,
        refetch: refetchTableTemplates,
    } = useGetTemplatesQuery({
        page,
        initialData: page === 1 ? initialData : undefined,
    });

    const {
        data: infiniteData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch: refetchListTemplates,
    } = useGetTemplatesInfiniteQuery();

    const [open, setOpen] = useState<boolean>(false);
    const [mode, setMode] = useState<'add' | 'update' | 'preview'>('preview');
    const [currentData, setCurrentData] = useState<Template>(initialState);
    const viewMode = useViewModeStore((state) => state.mode);
    const setViewMode = useViewModeStore((state) => state.setMode);

    const listTemplates =
        viewMode === 'list'
            ? (infiniteData?.pages.flatMap((p) => p.data) ?? [])
            : (templatesData?.data ?? []);

    const handleViewModeChange = (mode: 'list' | 'table') => {
        if (mode === 'table') setPage(1);
        setViewMode(mode);
    };

    const handleViewTemplate = (template: Template) => {
        setCurrentData(template);
        setMode('preview');
        setOpen(true);
    };

    const isApprovedTemplate = (template: Template) =>
        template.status?.toUpperCase() === 'APPROVED';

    const handlePreviewInMeta = (template: Template) => {
        if (!isApprovedTemplate(template)) return;

        setCurrentData(template);
        setMode('preview');
        setOpen(true);
    };

    return (
        <>
            <Helmet>
                <title>Templates</title>
            </Helmet>
            <TopNav
                add_permission={PermissionKey.TEMPLATES_CREATE}
                table_icon={DocsIcon}
                table_name="Templates"
                top_name_clk={() => {}}
                open_button_clk={() => {
                    router.push('/templates/create');
                }}
                onFilterClick={() => handleViewModeChange('list')}
                onApplicationClick={() => handleViewModeChange('table')}
                onRefreshClick={async () => {
                    setIsRefreshing(true);
                    try {
                        await Promise.all([refetchTableTemplates(), refetchListTemplates()]);
                    } finally {
                        setIsRefreshing(false);
                    }
                }}
                isRefreshing={isRefreshing}
                activeViewMode={viewMode}
                haveView={false}
            />
            {isPending ? <SuspenseLoader /> : <></>}
            <div style={{ padding: '70px 20px 20px 20px' }}>
                {isLoadingTemplates ? (
                    <SuspenseLoader />
                ) : viewMode === 'list' ? (
                    <>
                        <ListComponent>
                            <>
                                {listTemplates.map((one, index) => (
                                    <TemplateListItem
                                        key={one.id}
                                        one={one}
                                        index={index}
                                        onView={() => handleViewTemplate(one)}
                                        onPreviewInMeta={() => handlePreviewInMeta(one)}
                                    />
                                ))}
                            </>
                        </ListComponent>
                        <InfiniteScrollTrigger
                            onIntersect={fetchNextPage}
                            isLoading={isFetchingNextPage}
                            hasMore={hasNextPage ?? false}
                        />
                    </>
                ) : (
                    <TableComponent
                        columns={templateTableColumns}
                        data={templatesData?.data || []}
                        total={templatesData?.total ?? initialData?.total}
                        page={page}
                        onPageChange={setPage}
                        perPage={templatesData?.per_page ?? initialData?.per_page}
                        renderActions={(row) =>
                            isApprovedTemplate(row) ? (
                                <Button size="small" onClick={() => handlePreviewInMeta(row)}>
                                    Preview WhatsApp
                                </Button>
                            ) : (
                                <Button size="small" onClick={() => handleViewTemplate(row)}>
                                    View
                                </Button>
                            )
                        }
                    />
                )}

                <ModalComponent open={open}>
                    <>
                        <ModalHeader
                            add_permission=""
                            update_permission=""
                            delete_permission=""
                            Delete={() => {}}
                            close={() => {
                                setOpen(false);
                                setCurrentData(initialState);
                            }}
                            title={currentData?.name ? `Template: ${currentData.name}` : 'Template'}
                            mode={mode}
                            icon={<></>}
                            edit={() => {}}
                            hasAddSub={false}
                            addChild={() => {}}
                            clear_button_clk={() => {}}
                        />
                        <div
                            style={{
                                padding: '20px',
                                height: 'calc(100vh - 260px)',
                                overflow: 'hidden',
                            }}
                        >
                            <div>
                                <strong>Name:</strong> {currentData.name}
                            </div>
                            <div>
                                <strong>Category:</strong> {currentData.category}
                            </div>
                            <div>
                                <strong>Language:</strong> {currentData.language}
                            </div>
                            <div>
                                <strong>Status:</strong>{' '}
                                <TemplateStatusBadge status={currentData.status} />
                            </div>
                            <div>
                                <strong>Components:</strong> {currentData.components?.length || 0}
                            </div>
                            <div style={{ width: '100%', marginTop: '16px' }}>
                                <WhatsAppPreview
                                    components={currentData.components || []}
                                    category={currentData.category}
                                    compact
                                />
                            </div>
                        </div>
                    </>
                </ModalComponent>
            </div>
        </>
    );
}

export default TemplatesPage;
