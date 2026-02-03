import React, { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';
import { CaseSummary, CaseListResponse } from '../lib/types';
import KpiCard from './KpiCard';
import DataTable from './DataTable';

const CaseInbox: React.FC = () => {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    apiClient.getCases().then((data: CaseListResponse) => {
      setCases(data.cases);
      setTotal(data.total);
    });
  }, []);

  const columns = [
    { key: 'id', label: 'Case ID' },
    { key: 'created_at', label: 'Discharge Time' },
    { key: 'state', label: 'State' },
    { key: 'assigned_role', label: 'Assigned Role' },
  ];

  const handleRowClick = (row: CaseSummary) => {
    window.location.href = `/case/${row.id}`;
  };

  return (
    <div>
      <div className="kpi-row">
        <KpiCard title="Total Open Cases" value={total} />
        <KpiCard title="Human Review Required" value={cases.filter(c => c.state === 'HUMAN_REVIEW_REQUIRED').length} />
        <KpiCard title="Escalations" value={cases.filter(c => c.state === 'ESCALATION_REQUIRED').length} />
        <KpiCard title="Overdue" value={0} />
      </div>
      <DataTable columns={columns} data={cases} onRowClick={handleRowClick} />
    </div>
  );
};

export default CaseInbox;