import React from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <div className="tab-pane fade active show">
          {children}
        </div>
      )}
    </div>
  );
};

export default TabPanel;
