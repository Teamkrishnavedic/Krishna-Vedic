import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function AdminAuditLog() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-audit-logs', page],
    queryFn: async () => {
      const res = await api.get(`/admin/audit-logs?page=${page}&limit=30`);
      return res.data;
    },
  });

  const logs = data?.logs || [];

  return (
    <div className="space-y-6">
      <div className="border-b border-outline-variant/30 pb-4">
        <h1 className="font-headline-lg text-headline-lg font-serif text-primary">Operational Audit Trail</h1>
        <p className="text-xs text-on-surface-variant mt-1">Activity logs of all administrative adjustments and master ledger events</p>
      </div>

      <div className="bg-surface-container-low border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container-high border-b border-outline-variant/30 text-on-surface uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Admin Actor</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Delta Record</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-on-surface-variant">
                    Retrieving audit records...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-outline">
                    No administrative audit records logged yet.
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-surface-container">
                    <td className="py-3 px-4 font-mono font-bold text-primary">
                      <span className="px-2 py-0.5 bg-surface text-primary border border-outline-variant/30">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-on-surface">
                      {log.entityType} <span className="font-mono text-[10px] text-outline">({log.entityId?.slice(0, 8)})</span>
                    </td>
                    <td className="py-3 px-4 text-on-surface">
                      {log.user?.name || 'System / Admin'}
                      <span className="block text-[10px] text-outline">{log.user?.email}</span>
                    </td>
                    <td className="py-3 px-4 text-outline whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant max-w-xs">
                      {log.newData ? (
                        <div className="text-[10px] bg-surface-container-lowest p-2 border border-outline-variant/30 overflow-x-auto max-h-16 font-mono text-on-surface">
                          {log.newData}
                        </div>
                      ) : (
                        <span className="text-[11px] text-outline italic">No delta</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
