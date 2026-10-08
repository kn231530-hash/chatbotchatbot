import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Phone,
  Building,
  Mail,
  MessageCircle,
  FileText,
  Check,
} from 'lucide-react';
import { Participant } from '../types/chat';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveContact: (contact: Participant, startChat?: boolean, callNow?: boolean) => void;
  initialPhoneNumber?: string;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({
  isOpen,
  onClose,
  onSaveContact,
  initialPhoneNumber = '',
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(initialPhoneNumber);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('Website & Chatbot Client');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('United States');
  const [isWhatsApp, setIsWhatsApp] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent, action: 'save' | 'chat' | 'call' = 'save') => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const cleanPhone = phone.trim();
    const newParticipant: Participant = {
      id: `contact_custom_${Date.now()}`,
      name: name.trim(),
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      role: role.trim() || (company.trim() ? `${company.trim()} Representative` : 'Client Lead'),
      isAI: false,
      category: 'Client Lead',
      status: 'online',
      statusText: `${location} • Active Client`,
      bio: company.trim()
        ? `Client from ${company.trim()} looking for digital services.`
        : 'Registered client contact.',
      phone: cleanPhone,
      whatsappNumber: isWhatsApp ? cleanPhone : undefined,
      email: email.trim() || undefined,
      location: location.trim(),
      clientLead: {
        projectType: 'Website Development',
        budget: '$15,000 - $30,000 USD',
        location: location.trim(),
        companyName: company.trim() || name.trim(),
        whatsappNumber: cleanPhone,
        status: 'New Lead',
        scope: 'Client interested in website development, custom chatbots, and online systems.',
      },
    };

    onSaveContact(newParticipant, action === 'chat', action === 'call');
    onClose();

    // Reset form
    setName('');
    setPhone('');
    setCompany('');
    setEmail('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#E9EDEF] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F0F2F5] border-b border-[#E9EDEF] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#128C7E]/10 text-[#075E54] flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1F2C34]">Add New Phone Number</h2>
              <p className="text-[11px] text-[#667781]">Save client contact, call, or chat on WhatsApp</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#E9EDEF] text-[#54656F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={(e) => handleSubmit(e, 'save')} className="p-6 overflow-y-auto flex flex-col gap-4 flex-1">
          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-[#54656F] block mb-1">
              Person / Client Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe, Sarah Miller, or Tech Client"
              className="w-full h-10 px-3.5 bg-[#F0F2F5] rounded-xl text-sm border border-transparent focus:border-[#128C7E] focus:outline-none text-[#1F2C34]"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-xs font-semibold text-[#54656F] flex items-center justify-between mb-1">
              <span>Phone Number <span className="text-red-500">*</span></span>
              <span className="text-[10px] text-[#667781]">Includes Country Code (+1, +44, etc.)</span>
            </label>
            <div className="relative flex items-center">
              <Phone className="w-4 h-4 text-[#667781] absolute left-3 pointer-events-none" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 (555) 234-5678 or +44 7911 123456"
                className="w-full h-10 pl-9 pr-3.5 bg-[#F0F2F5] rounded-xl text-sm font-mono border border-transparent focus:border-[#128C7E] focus:outline-none text-[#1F2C34]"
              />
            </div>
          </div>

          {/* Company / Business Name */}
          <div>
            <label className="text-xs font-semibold text-[#54656F] block mb-1">
              Company / Business Name (Optional)
            </label>
            <div className="relative flex items-center">
              <Building className="w-4 h-4 text-[#667781] absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Apex Global, NYC Brands, or Startup Inc"
                className="w-full h-10 pl-9 pr-3.5 bg-[#F0F2F5] rounded-xl text-sm border border-transparent focus:border-[#128C7E] focus:outline-none text-[#1F2C34]"
              />
            </div>
          </div>

          {/* Project / Category */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-[#54656F] block mb-1">
                Project / Interest
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 px-3 bg-[#F0F2F5] rounded-xl text-xs border border-transparent focus:border-[#128C7E] focus:outline-none text-[#1F2C34]"
              >
                <option value="Website & Chatbot Client">Website & Chatbot Client</option>
                <option value="Custom AI Chatbot Lead">Custom AI Chatbot Lead</option>
                <option value="E-Commerce Website Client">E-Commerce Website Client</option>
                <option value="Software Development Lead">Software Development Lead</option>
                <option value="General Contact">General Contact</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#54656F] block mb-1">
                Location / Country
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. New York, USA"
                className="w-full h-10 px-3 bg-[#F0F2F5] rounded-xl text-xs border border-transparent focus:border-[#128C7E] focus:outline-none text-[#1F2C34]"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-[#54656F] block mb-1">
              Email Address (Optional)
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#667781] absolute left-3 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@company.com"
                className="w-full h-10 pl-9 pr-3.5 bg-[#F0F2F5] rounded-xl text-sm border border-transparent focus:border-[#128C7E] focus:outline-none text-[#1F2C34]"
              />
            </div>
          </div>

          {/* WhatsApp Direct Chat Toggle */}
          <div className="p-3 bg-[#E7FCE3]/60 rounded-2xl border border-[#25D366]/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#075E54] fill-current" />
              <div>
                <span className="text-xs font-bold text-[#075E54] block">Enable WhatsApp Direct</span>
                <span className="text-[10px] text-[#3D4946]">Create instant 1-tap WhatsApp chat link</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isWhatsApp}
              onChange={(e) => setIsWhatsApp(e.target.checked)}
              className="w-4 h-4 accent-[#25D366] rounded cursor-pointer"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-[#F0F2F5] flex flex-col gap-2">
            <button
              type="submit"
              className="w-full h-10 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              Save to Contacts Directory
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'chat')}
                className="h-9 rounded-xl bg-[#F0F2F5] hover:bg-[#E2F0FB] text-[#075E54] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#E9EDEF]"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Save & Start Chat
              </button>

              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'call')}
                className="h-9 rounded-xl bg-[#25D366] hover:bg-[#1faa53] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                Save & Call Now
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
