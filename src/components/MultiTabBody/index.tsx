import { styled } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import Scrollbar from '@/components/Scrollbar';

export interface MultiTabBodyProps {
  tabs: Array<{
    id: number;
    icon: ReactElement;
    children: ReactElement | string;
  }>;
  with_right_things?: boolean;
  right_element?: ReactElement;
  cutSpace: number;
  animateChangeFilter?: boolean;
}
const MultiTabContainer = styled('div')(
  () => `
            position: relative;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
        `
);
const MultiTabContainerWithElemnt = styled('div')(
  () => `
            position: relative;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `
);
const Tab = styled('div')(
  () => `
            display: flex;
            align-items: center;
            justify-content: center;
            width: 21px;
            height: 21px;
        `
);
const ChildrenContainer = styled('div')(
  () => `
           height: 40em;
           width: 400px;
        `
);
const RightContainer = styled('div')(
  () => `
            position: relative;
            width: fit-content;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            border-left: 0.5px solid #8E8E8E;
        `
);
export default function MultiTabBody({
  tabs,
  with_right_things,
  right_element,
  cutSpace,
  animateChangeFilter
}: MultiTabBodyProps) {
  const [activeTab, setActiveTab] = useState<number>(tabs[0].id);
  const [childAnimate, setChildAnimate] = useState(false);
  const animate = () => {
    setChildAnimate(true);
    setTimeout(() => {
      setChildAnimate(false);
    }, 500);
  };

  useEffect(() => {
    animate();
  }, [animateChangeFilter]);

  return (
    <>
      {with_right_things ? (
        <MultiTabContainerWithElemnt>
          <MultiTabContainer>
            {tabs?.map((one, index) => (
              <Tab
                key={index}
                onClick={() => setActiveTab(one.id)}
                className={one.id === activeTab ? 'activeTabMultiTabBody' : ''}
                style={
                  index === 0
                    ? {
                        marginLeft: '5px',
                        border:
                          one.id === activeTab ? '0.5px solid #6694FC' : 'none',
                        borderRadius: '5px'
                      }
                    : {
                        marginLeft: '17px',
                        border:
                          one.id === activeTab ? '0.5px solid #6694FC' : 'none',
                        borderRadius: '5px'
                      }
                }
              >
                {one.icon}
              </Tab>
            ))}
          </MultiTabContainer>
          <RightContainer>{right_element}</RightContainer>
        </MultiTabContainerWithElemnt>
      ) : (
        <MultiTabContainer>
          {tabs?.map((one, index) => (
            <Tab
              key={index}
              onClick={() => setActiveTab(one.id)}
              className={one.id === activeTab ? 'activeTabMultiTabBody' : ''}
              style={
                index === 0
                  ? {
                      marginLeft: '5px',
                      border:
                        one.id === activeTab ? '0.5px solid #6694FC' : 'none',
                      borderRadius: '5px'
                    }
                  : {
                      marginLeft: '17px',
                      border:
                        one.id === activeTab ? '0.5px solid #6694FC' : 'none',
                      borderRadius: '5px'
                    }
              }
            >
              {one.icon}
            </Tab>
          ))}
        </MultiTabContainer>
      )}
      <ChildrenContainer
        style={{ height: `calc(100vh - ${cutSpace}px)` }}
        className={childAnimate ? 'flip-vertical-right' : ''}
      >
        <Scrollbar>
          {tabs.filter((one) => one.id === activeTab)[0].children}
        </Scrollbar>
      </ChildrenContainer>
    </>
  );
}
