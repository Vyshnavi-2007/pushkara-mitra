import React, { useState } from 'react';
import { Database, Code, Server, CheckCircle2, Copy } from 'lucide-react';
import { MONGO_SCHEMAS_CODE } from '../../services/mongoDbIntegrationGuide';

export const MongoGuideView = () => {
  const [activeTab, setActiveTab] = useState('GHAT'); // 'GHAT' | 'BOOKING' | 'SERVER'
  const [copied, setCopied] = useState(false);

  const getActiveCode = () => {
    if (activeTab === 'GHAT') return MONGO_SCHEMAS_CODE.ghatSchema;
    if (activeTab === 'BOOKING') return MONGO_SCHEMAS_CODE.bookingSchema;
    return MONGO_SCHEMAS_CODE.expressServerSnippet;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-900/40 pb-6">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white flex items-center gap-2">
            <Database className="w-7 h-7 text-emerald-400" />
            MongoDB Database & Backend Integration Guide
          </h1>
          <p className="text-xs text-slate-400">Production-ready Mongoose Schemas & Express API snippet for Godavari Seva.</p>
        </div>

        <button
          onClick={handleCopy}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-emerald-500/40 flex items-center gap-2 shadow-lg shadow-emerald-600/20 shrink-0"
        >
          {copied ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied to Clipboard!" : "Copy Code Snippet"}
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('GHAT')}
          className={`flex-1 py-3 rounded-xl transition-all ${activeTab === 'GHAT' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          Ghat & Slot Mongoose Schema
        </button>
        <button
          onClick={() => setActiveTab('BOOKING')}
          className={`flex-1 py-3 rounded-xl transition-all ${activeTab === 'BOOKING' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          Customer & Family Aadhaar Schema
        </button>
        <button
          onClick={() => setActiveTab('SERVER')}
          className={`flex-1 py-3 rounded-xl transition-all ${activeTab === 'SERVER' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          Node/Express Server API Code
        </button>
      </div>

      {/* Code Display Box */}
      <div className="glass-card p-6 border-slate-800 bg-slate-950 rounded-2xl overflow-hidden font-mono text-xs text-emerald-300">
        <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed">
          {getActiveCode()}
        </pre>
      </div>

    </div>
  );
};
