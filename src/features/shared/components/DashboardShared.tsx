import type { RootState } from '@/app/store';
import { SidebarContext } from '@/contexts/SidebarContext';
import { TranslationContext } from '@/contexts/translationContext';
import { setViewMode } from '@/features/view_mode/viewModeSlice';
import { useGetlanguagesQuery } from '@/services/languages';
import FollowerIcon from '@/ui/icons/FollowerIcon';
import ToolTip from '@/ui/Tooltip';
import CanCall from '@/utils/ability';
import useTrans from '@/utils/translation_util';
import ViewListIcon from '@mui/icons-material/ViewList'; // Import ViewListIcon
import ViewModuleIcon from '@mui/icons-material/ViewModule'; // Import ViewModuleIcon
import Image from 'next/image';
import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
  add_permission?: string;
}
export const TopNav = ({
  table_icon,
  top_name_clk,
  table_name,
  follower,
  followerclk,
  add_permission,
  open_button_clk
}: Props) => {
  const { data: languages, isLoading: isLoadingLanguages } =
    useGetlanguagesQuery(undefined, {
      skip: true
    });
  const { language_code, changeLanguage } = useContext(TranslationContext);
  const { sidebarToggle } = useContext(SidebarContext);

  const dispatch = useDispatch();
  const viewMode = useSelector((state: RootState) => state.viewMode.mode);

  const handleSetViewMode = (mode: 'list' | 'table') => {
    dispatch(setViewMode(mode));
  };

  return (
    <div
      className="lang-top"
      style={{
        width: sidebarToggle ? 'calc(100vw - 215px)' : 'calc(100vw - 85px)',
        right: 10
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
                justifyContent: 'center'
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
        {/* <div className="top-option">
            <span>
              <Search />
            </span>
          </div> */}
        {/* <div className="top-option langs">
            <span>
              <Translated />
            </span>
            <div className="lang-items">
              {isLoadingLanguages ? (
                <SuspenseLoader />
              ) : (
                languages?.map(
                  (language: { language_code: string }, index: number) => (
                    <div
                      key={index}
                      onClick={() => changeLanguage(language.language_code)}
                      className={`lang-item  ${
                        language_code?.toLowerCase() ===
                        language.language_code?.toLowerCase()
                          ? 'selected-lang'
                          : ''
                      }`}
                    >
                      {language.language_code.toUpperCase()}
                    </div>
                  )
                )
              )}
            </div>
          </div> */}
        <div className="top-option">
          <ToolTip text="List View">
            <span
              onClick={() => handleSetViewMode('list')}
              style={{ color: viewMode === 'list' ? '#555' : '#8e8e8e' }}
            >
              <ViewListIcon />
            </span>
          </ToolTip>
        </div>
        <div className="top-option">
          <ToolTip text="Table View">
            <span
              onClick={() => handleSetViewMode('table')}
              style={{ color: viewMode === 'table' ? '#555' : '#8e8e8e' }}
            >
              <ViewModuleIcon />
            </span>
          </ToolTip>
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
          <ToolTip text={`${useTrans()('Add')} ${table_name}`}>
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
