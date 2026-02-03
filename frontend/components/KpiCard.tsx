import React from 'react';

interface KpiCardProps {
  title: string;
  value: number;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value }) => {
  return (
    <div className="kpi-card">
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
};

export default KpiCard;