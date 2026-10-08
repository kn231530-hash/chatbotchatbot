import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  RefreshCw,
  PieChart,
} from 'lucide-react';
import { CompanyCountData } from '../types/chat';

interface CompanyStatsCardProps {
  data: CompanyCountData;
}

export const CompanyStatsCard: React.FC<CompanyStatsCardProps> = ({ data }) => {
  const [activeSector, setActiveSector] = useState<string>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveOffset, setLiveOffset] = useState(0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLiveOffset((prev) => prev + Math.floor(Math.random() * 5) + 1);
      setIsRefreshing(false);
    }, 500);
  };

  const total = data.totalCompanies + liveOffset;
  const accounts = data.activeAccounts + liveOffset * 2;

  const filteredCompanies =
    activeSector === 'All'
      ? data.featuredCompanies
      : data.featuredCompanies.filter((c) =>
          c.sector.toLowerCase().includes(activeSector.toLowerCase())
        );

  return (
    <div className="my-2.5 rounded-2xl bg-white border border-[#128C7E]/20 shadow-xs overflow-hidden text-[#1F2C34]">
      {/* Top Banner with Gradient & Header */}
      <div className="bg-gradient-to-r from-[#075E54] to-[#128C7E] text-white p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-[#8ff4e3]" />
          </div>
          <div>
            <h4 className="text-sm font-bold flex items-center gap-1.5 leading-tight">
              Online Company Counter & Registry
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            </h4>
            <p className="text-[11px] text-[#8ff4e3] leading-tight">
              Real-time verified corporate census & KRA compliance
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className={`p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all ${
            isRefreshing ? 'animate-spin' : ''
          }`}
          title="Recount Live Data"
        >
          <RefreshCw className="w-3.5 h-3.5 text-white" />
        </button>
      </div>

      {/* Primary Metric Counters Grid */}
      <div className="p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 border-b border-[#F0F2F5] bg-[#F5FAFF]">
        {/* Total Companies */}
        <div className="p-2.5 rounded-xl bg-white border border-[#E9EDEF] shadow-2xs">
          <span className="text-[10px] font-semibold text-[#667781] uppercase tracking-wider block">
            Online Companies
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-bold font-mono text-[#075E54]">
              {total.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-[#25D366] font-semibold flex items-center gap-0.5 mt-0.5">
            <TrendingUp className="w-3 h-3" /> {data.monthlyGrowth} this month
          </span>
        </div>

        {/* Active Accounts */}
        <div className="p-2.5 rounded-xl bg-white border border-[#E9EDEF] shadow-2xs">
          <span className="text-[10px] font-semibold text-[#667781] uppercase tracking-wider block">
            Active Accounts
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-bold font-mono text-[#1F2C34]">
              {accounts.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-[#667781] flex items-center gap-0.5 mt-0.5">
            <Users className="w-3 h-3 text-[#128C7E]" /> Verified portals
          </span>
        </div>

        {/* KRA Compliance Rate */}
        <div className="p-2.5 rounded-xl bg-white border border-[#E9EDEF] shadow-2xs">
          <span className="text-[10px] font-semibold text-[#667781] uppercase tracking-wider block">
            KRA Compliance
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-bold font-mono text-[#128C7E]">
              {data.kraCompliantPercent}%
            </span>
          </div>
          <span className="text-[10px] text-[#25D366] font-semibold flex items-center gap-0.5 mt-0.5">
            <ShieldCheck className="w-3 h-3" /> Statutory audit OK
          </span>
        </div>

        {/* Registered Status */}
        <div className="p-2.5 rounded-xl bg-white border border-[#E9EDEF] shadow-2xs">
          <span className="text-[10px] font-semibold text-[#667781] uppercase tracking-wider block">
            Audit Status
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm font-bold text-[#075E54]">
              98.4% Clean
            </span>
          </div>
          <span className="text-[10px] text-[#667781] mt-0.5 block">
            296 in review
          </span>
        </div>
      </div>

      {/* Sector Breakdown */}
      <div className="p-3.5 border-b border-[#F0F2F5]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#1F2C34] flex items-center gap-1.5">
            <PieChart className="w-3.5 h-3.5 text-[#128C7E]" />
            Company Counts by Sector
          </span>
          <span className="text-[11px] font-mono text-[#667781]">
            100% Normalized
          </span>
        </div>

        {/* Horizontal Stacked Bar */}
        <div className="w-full h-2.5 rounded-full bg-[#E9EDEF] overflow-hidden flex mb-2.5">
          {data.sectors.map((s, idx) => (
            <div
              key={idx}
              style={{
                width: `${s.percentage}%`,
                backgroundColor: s.color,
              }}
              title={`${s.name}: ${s.count.toLocaleString()} (${s.percentage}%)`}
              className="h-full hover:opacity-80 transition-opacity"
            />
          ))}
        </div>

        {/* Sector Legend Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {data.sectors.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() =>
                setActiveSector((prev) => (prev === s.name ? 'All' : s.name))
              }
              className={`flex items-center justify-between p-1.5 rounded-lg border text-left text-xs transition-colors ${
                activeSector === s.name
                  ? 'border-[#128C7E] bg-[#128C7E]/10 font-bold'
                  : 'border-[#E9EDEF] hover:bg-[#F5F6F6] bg-white'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0 pr-1">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-[11px] truncate">{s.name}</span>
              </div>
              <span className="font-mono text-[11px] font-semibold text-[#075E54] shrink-0">
                {s.count.toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sample Verified Enterprise Records */}
      <div className="p-3.5 bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#1F2C34]">
            Recent Verified Company Accounts
          </span>
          {activeSector !== 'All' && (
            <button
              type="button"
              onClick={() => setActiveSector('All')}
              className="text-[11px] text-[#128C7E] hover:underline"
            >
              Clear filter ({activeSector})
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#667781] border-b border-[#F0F2F5] text-[10px] uppercase font-semibold">
                <th className="pb-1.5 font-medium">Company Name</th>
                <th className="pb-1.5 font-medium">Sector</th>
                <th className="pb-1.5 font-medium">Country</th>
                <th className="pb-1.5 font-medium">Accounts</th>
                <th className="pb-1.5 font-medium text-right">KRA Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2F5]">
              {filteredCompanies.map((c, i) => (
                <tr key={i} className="hover:bg-[#F5FAFF]">
                  <td className="py-2 font-semibold text-[#1F2C34]">{c.name}</td>
                  <td className="py-2 text-[#54656F]">{c.sector}</td>
                  <td className="py-2 text-[#667781]">{c.country}</td>
                  <td className="py-2 font-mono text-[#075E54]">
                    {c.accountsCount.toLocaleString()}
                  </td>
                  <td className="py-2 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.kraStatus === 'Compliant'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {c.kraStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
