import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  helper?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, helper }) => {
  return (
    <div className="kpi-card">
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">{value}</div>
      {helper && <div className="kpi-helper">{helper}</div>}
    </div>
  );
};

export default KpiCard;
