import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart, Info, Globe } from 'lucide-react';
import { useData } from '../context/DataContext';

export const Footer = () => {
  const { t, lang, changeLang } = useData();

  return (
    <footer className="bg-[#0A1822]/80 backdrop-blur-sm border-t border-gold/15 py-12 text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-saffron" />
              <span className="font-heading font-bold text-lg text-cream">{t('brandTitle')} 2027</span>
            </div>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
              {t('brandSubtitle')} — Dedicated 3-Portal Platform for Pilgrims, On-Ground Staff, and Central Control Command.
            </p>

            {/* Language Selection Pills */}
            <div className="flex items-center gap-2 text-xs pt-1">
              <span className="text-slate-500 font-semibold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-saffron" /> Language:
              </span>
              <button 
                onClick={() => changeLang('EN')} 
                className={`px-2 py-0.5 rounded font-bold ${lang === 'EN' ? 'bg-saffron text-[#2a1400]' : 'bg-white/5 text-slate-400'}`}
              >
                English
              </button>
              <button 
                onClick={() => changeLang('TE')} 
                className={`px-2 py-0.5 rounded font-bold ${lang === 'TE' ? 'bg-saffron text-[#2a1400]' : 'bg-white/5 text-slate-400'}`}
              >
                తెలుగు
              </button>
              <button 
                onClick={() => changeLang('HI')} 
                className={`px-2 py-0.5 rounded font-bold ${lang === 'HI' ? 'bg-saffron text-[#2a1400]' : 'bg-white/5 text-slate-400'}`}
              >
                हिंदी
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-cream mb-3 text-xs uppercase tracking-wider">Pilgrim Services</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/ghats" className="hover:text-saffron transition-colors">{t('bathingSlots')}</Link></li>
              <li><Link to="/pujas" className="hover:text-saffron-light transition-colors">{t('devotionalPujas')}</Link></li>
              <li><Link to="/food" className="hover:text-emerald-400 transition-colors">{t('foodNearMe')}</Link></li>
              <li><Link to="/safety" className="hover:text-rose-400 transition-colors">{t('safetyCenter')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-cream mb-3 text-xs uppercase tracking-wider">Dedicated Portal Logins</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-saffron transition-colors">👤 {t('pilgrimLogin')}</Link></li>
              <li><Link to="/staff/login" className="hover:text-river-light transition-colors">📱 {t('staffLogin')}</Link></li>
              <li><Link to="/admin/login" className="hover:text-gold transition-colors">🛡️ {t('adminLogin')}</Link></li>
              <li><Link to="/admin/mongo-guide" className="hover:text-emerald-400 transition-colors">🍃 MongoDB Integration Docs</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gold/15 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2027 Godavari Seva Pilgrim Ecosystem. Developed for Godavari Pushkaralu Hackathon.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for pilgrim safety & seamless worship.
          </p>
        </div>

      </div>
    </footer>
  );
};