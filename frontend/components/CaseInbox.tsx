import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { apiClient } from '../lib/api/client';
import { CaseResponse } from '../lib/api/types';
import { formatDateTime, formatRole, formatShortId } from '../utils/format';
import { STATUS_CONFIG } from '../utils/status';
import Panel from './Panel';
import KpiCard from './KpiCard';
import DataTable, { DataColumn } from './DataTable';
import StatusBadge from './StatusBadge';
import InlineError from './InlineError';
import { ApiError } from '../lib/api/client';
import { useToast } from './ToastHost';

const stateOptions = Object.keys(STATUS_CONFIG);

const CaseInbox: React.FC = () => {
  const router = useRouter();
  const { pushToast } = useToast();
  const [cases, setCases] = useState<CaseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [assignedRole, setAssignedRole] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [onlyEscalations, setOnlyEscalations] = useState(false);
  const [overdueCount, setOverdueCount] = useState<number | null>(null);
  const search = typeof router.query.search === 'string' ? router.query.search.trim() : '';

  const fetchCases = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.listCases({
        state: selectedStates.length === 1 ? selectedStates[0] : undefined,
        assigned_role: assignedRole || undefined,
      });
      setCases(response.cases);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [selectedStates, assignedRole]);

  useEffect(() => {
    const computeOverdue = async () => {
      if (!cases.length) {
        setOverdueCount(0);
        return;
      }
      const details = await Promise.all(
        cases.map((item) => apiClient.getCase(item.id).catch(() => null))
      );
      const overdue = details.reduce((count, detail) => {
        if (!detail) return count;
        const now = Date.now();
        const hasOverdue = detail.tasks.some((task) =>
          task.due_at ? new Date(task.due_at).getTime() < now && task.status !== 'DONE' : false
        );
        return hasOverdue ? count + 1 : count;
      }, 0);
      setOverdueCount(overdue);
    };

    computeOverdue().catch(() => {
      setOverdueCount(0);
    });
  }, [cases]);

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      if (selectedStates.length && !selectedStates.includes(item.state)) return false;
      if (onlyEscalations && item.state !== 'ESCALATION_REQUIRED') return false;
      if (dateStart && new Date(item.created_at) < new Date(dateStart)) return false;
      if (dateEnd && new Date(item.created_at) > new Date(dateEnd)) return false;
      if (search && !item.id.includes(search)) return false;
      return true;
    });
  }, [cases, selectedStates, onlyEscalations, dateStart, dateEnd, search]);

  const columns: DataColumn<CaseResponse>[] = [
    {
      key: 'id',
      label: 'Case ID',
      render: (row) => <span className="mono">{formatShortId(row.id)}</span>,
    },
    {
      key: 'created_at',
      label: 'Discharge Time',
      render: (row) => formatDateTime(row.created_at),
    },
    {
      key: 'state',
      label: 'State',
      render: (row) => <StatusBadge status={row.state} />,
    },
    {
      key: 'next_action',
      label: 'Next Action',
      render: (row) => STATUS_CONFIG[row.state]?.nextAction || 'Review case',
    },
    {
      key: 'assigned_role',
      label: 'Assigned Role',
      render: (row) => formatRole(row.assigned_role),
    },
    {
      key: 'risk_flags',
      label: 'Risk Flags',
      render: (row) => (row.risk_flags?.length ? row.risk_flags.join(', ') : 'None'),
    },
  ];

  const totalOpen = filteredCases.filter((item) => item.state !== 'CLOSED').length;
  const humanReview = filteredCases.filter((item) => item.state === 'HUMAN_REVIEW_REQUIRED').length;
  const escalations = filteredCases.filter((item) => item.state === 'ESCALATION_REQUIRED').length;

  const handleRowClick = (row: CaseResponse) => {
    router.push(`/cases/${row.id}`);
  };

  const handleCopyError = () => {
    if (!error) return;
    const payload = `Error: ${error.message}\nDetails: ${error.details}\nCorrelation ID: ${error.correlationId}`;
    navigator.clipboard.writeText(payload).then(() => {
      pushToast({ type: 'info', message: 'Error details copied.' });
    });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Case Inbox</h1>
          <p className="muted">Review and approve clinical drafts. Drafts are not final until approved.</p>
        </div>
      </div>

      <div className="kpi-grid">
        <KpiCard title="Total open cases" value={totalOpen} helper="Excludes closed" />
        <KpiCard title="Human review required" value={humanReview} helper="Awaiting approvals" />
        <KpiCard title="Escalations" value={escalations} helper="Urgent red flags" />
        <KpiCard title="Overdue outreach" value={overdueCount ?? '—'} helper="Based on due tasks" />
      </div>

      <Panel
        title="Filters"
        actions={
          <button type="button" className="btn btn-ghost" onClick={fetchCases} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        }
      >
        <div className="filter-grid">
          <div className="filter-group">
            <label className="filter-label">State</label>
            <div className="filter-options">
              {stateOptions.map((state) => (
                <label key={state} className="checkbox">
                  <input
                    type="checkbox"
                    checked={selectedStates.includes(state)}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      setSelectedStates((prev) =>
                        checked ? [...prev, state] : prev.filter((item) => item !== state)
                      );
                    }}
                  />
                  <span>{STATUS_CONFIG[state]?.label || state}</span>
                </label>
              ))}
            </div>
          </div>
          <label className="filter-label">
            Assigned role
            <select value={assignedRole} onChange={(event) => setAssignedRole(event.target.value)}>
              <option value="">Any</option>
              <option value="rn">RN</option>
              <option value="clinician">Clinician</option>
              <option value="pharmacist">Pharmacist</option>
              <option value="scheduler">Scheduler</option>
            </select>
          </label>
          <label className="filter-label">
            Date start
            <input type="date" value={dateStart} onChange={(event) => setDateStart(event.target.value)} />
          </label>
          <label className="filter-label">
            Date end
            <input type="date" value={dateEnd} onChange={(event) => setDateEnd(event.target.value)} />
          </label>
          <label className="filter-label checkbox-inline">
            <input
              type="checkbox"
              checked={onlyEscalations}
              onChange={(event) => setOnlyEscalations(event.target.checked)}
            />
            Only escalations
          </label>
        </div>
      </Panel>

      <Panel title="Queue" status={loading ? 'DATA_READY' : undefined}>
        {error && (
          <InlineError
            message={error.details || error.message}
            correlationId={error.correlationId}
            onCopy={handleCopyError}
          />
        )}
        <DataTable
          columns={columns}
          data={filteredCases}
          onRowClick={handleRowClick}
          emptyMessage={loading ? 'Loading cases...' : 'No matching cases.'}
        />
      </Panel>
    </div>
  );
};

export default CaseInbox;
