import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  FileCheck,
  MapPin,
  DollarSign,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { ClientLeadInfo } from '../types/chat';

interface ClientLeadCardProps {
  lead: ClientLeadInfo;
  onCall?: (phoneNumber: string) => void;
}

export const ClientLeadCard: React.FC<ClientLeadCardProps> = ({ lead, onCall }) => {
  const [proposalSent, setProposalSent] = useState(false);

  const cleanPhone = lead.whatsappNumber.replace(/\D/g, '');
  const encodedText = encodeURIComponent(
    `Hello ${lead.companyName}! I am responding to your inquiry regarding ${lead.projectType}. I would love to build your website and custom AI chatbot.`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  return (
    <div className="my-2.5 rounded-2xl bg-white border border-[#25D366]/30 shadow-xs overflow-hidden text-[#1F2C34]">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#00685D] via-[#128C7E] to-[#25D366] text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#8ff4e3] block">
              Verified USA Client Inquiry
            </span>
            <h4 className="text-xs font-bold leading-tight flex items-center gap-1.5">
              {lead.projectType}
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-normal">
                {lead.status}
              </span>
            </h4>
          </div>
        </div>

        <span className="text-xs font-bold font-mono bg-white/20 px-2 py-0.5 rounded-lg text-white">
          {lead.budget}
        </span>
      </div>

      {/* Main Details */}
      <div className="p-3.5 flex flex-col gap-2.5 bg-[#F5FAFF]">
        {/* Company & Location */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#1F2C34] font-bold">
            <span>{lead.companyName}</span>
          </div>
          <div className="flex items-center gap-1 text-[#667781] text-[11px]">
            <MapPin className="w-3 h-3 text-[#128C7E]" />
            <span>{lead.location}</span>
          </div>
        </div>

        {/* Project Scope */}
        <p className="text-xs text-[#3D4946] leading-relaxed bg-white p-2.5 rounded-xl border border-[#E9EDEF]">
          {lead.scope}
        </p>

        {/* WhatsApp & Call Action Dock */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          {/* WhatsApp Action Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#1faa53] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95"
            title="Chat directly on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp ({lead.whatsappNumber})</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>

          {/* Direct Phone Call Button */}
          <button
            type="button"
            onClick={() => onCall?.(lead.whatsappNumber)}
            className="w-full sm:w-auto py-2 px-3 rounded-xl bg-[#F0F2F5] hover:bg-[#E2F0FB] text-[#075E54] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-[#E9EDEF]"
            title="Call Phone Number"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call</span>
          </button>
        </div>

        {/* Proposal Sent Trigger */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E9EDEF] text-[11px]">
          <span className="text-[#667781]">Contract status: Ready for development</span>
          <button
            type="button"
            onClick={() => setProposalSent(true)}
            disabled={proposalSent}
            className={`font-semibold transition-colors flex items-center gap-1 ${
              proposalSent ? 'text-[#25D366]' : 'text-[#128C7E] hover:underline'
            }`}
          >
            {proposalSent ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                <span>Proposal Submitted</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                <span>Send Scope & Quote</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
