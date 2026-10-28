import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export default function AdminStaff() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-staff-list'],
    queryFn: async () => {
      const res = await api.get('/admin/staff');
      return res.data.staff || [];
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      api.patch(`/admin/staff/${id}/role`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-staff-list'] });
      toast({ title: 'Role Updated Successfully', variant: 'success' });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || err.response?.data?.error || 'Could not update staff role', variant: 'error' });
    },
  });

  const staff = data || [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#2d2a26]">Staff & Team Roles</h1>
        <p className="text-xs text-[#7d7567] mt-0.5">Control administrative permissions and team operational access</p>
      </div>

      <div className="card border-[#e5e2da] bg-[#fafbf5] overflow-hidden rounded-3xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f4f4ec] border-b border-[#e5e2da] text-[#2d2a26] uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4">Permission Role</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e2da]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#7d7567] font-sans text-xs uppercase tracking-wider">
                    Loading team directory...
                  </td>
                </tr>
              ) : (
                staff.map((member: any) => (
                  <tr key={member.id} className="hover:bg-[#f4f4ec]/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#2d2a26] flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#f4f4ec] border border-[#e5e2da] text-[#2d2a26] flex items-center justify-center font-bold text-xs shadow-inner">
                        {member.name?.charAt(0) || 'S'}
                      </div>
                      {member.name}
                    </td>
                    <td className="py-3.5 px-4 text-[#7d7567]">
                      {member.email}
                    </td>
                    <td className="py-3.5 px-4 text-[#7d7567]">
                      {formatDate(member.createdAt)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 border text-[10px] font-bold rounded-full ${
                        member.role === 'SUPER_ADMIN'
                          ? 'bg-[#f4f4ec] text-[#6e3418] border-[#6e3418]'
                          : member.role === 'ADMIN'
                          ? 'bg-[#eef5f1] text-[#3f674f] border-[#3f674f]'
                          : 'bg-[#f4f4ec] text-[#7d7567] border-[#e5e2da]'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {member.role !== 'SUPER_ADMIN' ? (
                        <select
                          value={member.role}
                          onChange={(e) => updateRoleMutation.mutate({ id: member.id, role: e.target.value })}
                          className="select text-[11px] py-1 px-3 w-auto rounded-full"
                        >
                          <option value="STAFF">STAFF</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      ) : (
                        <span className="text-[11px] text-[#7d7567] italic font-serif">Protected Super Admin</span>
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
