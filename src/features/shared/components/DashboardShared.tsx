import { SidebarContext } from '@/contexts/SidebarContext';
import { TranslationContext } from '@/contexts/translationContext';
import Application from '@/ui/icons/Application';
import Filter from '@/ui/icons/Filter';
import FollowerIcon from '@/ui/icons/FollowerIcon';
import ToolTip from '@/ui/Tooltip';
import CanCall from '@/utils/ability';
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image';
import { JSX, useContext } from 'react';

interface FollowerItem {
    id: number;
    name: string;
}
interface Props {
    table_icon?: { src: string } | string | React.ComponentType<any>;
    top_name_clk?: () => void;
    table_name?: string;
    follower?: Array<FollowerItem>;
    followerclk?: (index: number, name: string, id: number) => void;
    open_button_clk?: () => void;
    haveView?: boolean;
    viewData?: () => JSX.Element | null;
    add_permission?: string;
    onFilterClick?: () => void;
    onApplicationClick?: () => void;
    onRefreshClick?: () => void;
    isRefreshing?: boolean;
    activeViewMode?: 'list' | 'table';
}
export const TopNav = ({
    table_icon,
    top_name_clk,
    table_name,
    follower,
    followerclk,
    add_permission,
    open_button_clk,
    haveView,
    viewData,
    onFilterClick,
    onApplicationClick,
    onRefreshClick,
    isRefreshing,
    activeViewMode,
}: Props) => {
    const { language_code, changeLanguage } = useContext(TranslationContext);
    const { sidebarToggle } = useContext(SidebarContext);

    return (
        <div
            className="lang-top"
            style={{
                width: sidebarToggle ? 'calc(100vw - 215px)' : 'calc(100vw - 85px)',
                right: 10,
            }}
        >
            <div className="lang-info">
                <div className="lang-icon header-icon">
                    {typeof table_icon === 'function' ? (
                        <div
                            style={{
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {/* Render the component by assigning it to a capitalized variable */}
                            {(() => {
                                const TableIcon = table_icon as React.ComponentType<any>;
                                return <TableIcon />;
                            })()}
                        </div>
                    ) : (
                        <Image
                            alt={table_name || 'Icon'}
                            src={
                                typeof table_icon === 'string'
                                    ? table_icon
                                    : (table_icon as { src?: string })?.src || ''
                            }
                            width={20}
                            height={20}
                        />
                    )}
                </div>
                <div
                    className="lang-name"
                    onClick={() => {
                        if (top_name_clk) top_name_clk();
                    }}
                >
                    {table_name}
                </div>
                <div className="follower-list">
                    {follower?.map((fo, index) => (
                        <div
                            key={index}
                            className="follower"
                            onClick={() => {
                                if (followerclk) followerclk(index, fo.name, fo.id);
                            }}
                        >
                            <span>
                                <FollowerIcon />
                            </span>
                            <span>{fo.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="top-options">
                <div
                    className="top-option"
                    onClick={onFilterClick}
                    title="List View"
                    style={{
                        cursor: onFilterClick ? 'pointer' : 'default',
                        opacity: activeViewMode === 'table' ? 0.5 : 1,
                    }}
                >
                    <span>
                        <Filter />
                    </span>
                </div>
                <div
                    className="top-option"
                    onClick={onApplicationClick}
                    title="Table View"
                    style={{
                        cursor: onApplicationClick ? 'pointer' : 'default',
                        opacity: activeViewMode === 'list' ? 0.5 : 1,
                    }}
                >
                    <span>
                        <Application />
                    </span>
                </div>
                <div
                    className="top-option pl-6"
                    onClick={isRefreshing ? undefined : onRefreshClick}
                    title="Refresh Data"
                    style={{
                        cursor: onRefreshClick && !isRefreshing ? 'pointer' : 'default',
                        opacity: onRefreshClick ? (isRefreshing ? 0.7 : 1) : 0.5,
                    }}
                >
                    <span>
                        {isRefreshing ? (
                            <CircularProgress size={14} thickness={6} />
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M23 4v6h-6" />
                                <path d="M1 20v-6h6" />
                                <path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10" />
                                <path d="M20.49 15a9 9 0 0 1-14.13 3.36L1 14" />
                            </svg>
                        )}
                    </span>
                </div>
                <svg
                    className={'lines'}
                    xmlns="http://www.w3.org/2000/svg"
                    width="0.5"
                    height="25.5"
                    viewBox="0 0 0.5 25.5"
                >
                    <line
                        id="Line_992"
                        data-name="Line 992"
                        y1="25"
                        transform="translate(0.25 0.25)"
                        fill="none"
                        stroke="#8e8e8e"
                        strokeLinecap="round"
                        strokeWidth="0.5"
                    />
                </svg>
            </div>
            <div className={`lang-add currency-add`}>
                {haveView && viewData ? viewData() : null}
                <svg
                    className={'addlines'}
                    xmlns="http://www.w3.org/2000/svg"
                    width="0.5"
                    height="25.5"
                    viewBox="0 0 0.5 25.5"
                >
                    <line
                        id="Line_992"
                        data-name="Line 992"
                        y1="25"
                        transform="translate(0.25 0.25)"
                        fill="none"
                        stroke="#8e8e8e"
                        strokeLinecap="round"
                        strokeWidth="0.5"
                    />
                </svg>
                <CanCall permission={add_permission}>
                    <ToolTip text={`Add ${table_name}`}>
                        <svg
                            onClick={() => {
                                if (open_button_clk) open_button_clk();
                            }}
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                        >
                            <g
                                id="Mask_Group_16"
                                data-name="Mask Group 16"
                                transform="translate(-324 -333)"
                            >
                                <path
                                    id="add-3"
                                    d="M13.235,5.714H9.286V1.765a1.786,1.786,0,0,0-3.571,0v3.95H1.765a1.786,1.786,0,0,0,0,3.571h3.95v3.95a1.786,1.786,0,0,0,3.571,0V9.286h3.95a1.786,1.786,0,0,0,0-3.571Z"
                                    transform="translate(324 333)"
                                    fill="#404040"
                                />
                            </g>
                        </svg>
                    </ToolTip>
                </CanCall>
            </div>
        </div>
    );
};
