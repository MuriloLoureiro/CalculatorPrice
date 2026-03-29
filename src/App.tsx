/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, 
  X, 
  Share2, 
  FileText, 
  Info, 
  TrendingUp, 
  Calendar, 
  User, 
  Building2, 
  AlertCircle,
  Copy,
  CheckCircle2,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Cookies from 'js-cookie';
import { 
  PF_SERVICES, 
  PJ_SERVICES, 
  PLANS, 
  CAT_COLORS, 
  Service, 
  Plan 
} from './constants';

export default function App() {
  // State
  const [planId, setPlanId] = useState<string>('start');
  const [tab, setTab] = useState<'pf' | 'pj'>('pf');
  const [selectedServices, setSelectedServices] = useState<Record<'pf' | 'pj', Set<string>>>({
    pf: new Set(['pf_dados', 'pf_pc', 'pf_pf']),
    pj: new Set(['pj_dados'])
  });
  const [clientInfo, setClientInfo] = useState({ empresa: '', responsavel: '', email: '', telefone: '' });
  const [extraVerifications, setExtraVerifications] = useState(50);
  const [showShareModal, setShowShareModal] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'info'; title: string; msg: string } | null>(null);
  const [showGoToTop, setShowGoToTop] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const plan = PLANS[planId];
  const services = tab === 'pf' ? PF_SERVICES : PJ_SERVICES;
  const currentSelected = selectedServices[tab];

  // Derived Data
  const costPerVerification = useMemo(() => {
    const selectedList = services.filter(s => currentSelected.has(s.id));
    return selectedList.reduce((acc, s) => {
      const priceIdx = plan.idx === 3 ? 2 : plan.idx;
      return acc + s.prices[priceIdx];
    }, 0);
  }, [services, currentSelected, plan]);

  const verificationsInPlan = useMemo(() => {
    if (plan.price === null) return Infinity;
    return Math.floor(plan.price / costPerVerification);
  }, [plan, costPerVerification]);

  const usagePercentage = useMemo(() => {
    if (plan.price === null) return 100;
    const used = verificationsInPlan * costPerVerification;
    return Math.min(100, Math.round((used / plan.price) * 100));
  }, [verificationsInPlan, costPerVerification, plan]);

  // Effects
  useEffect(() => {
    const handleScroll = () => {
      setShowGoToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cfg = params.get('cfg');
    let state: any = null;

    if (cfg) {
      try {
        state = JSON.parse(decodeURIComponent(atob(cfg)));
        showToast('info', 'Proposta carregada', 'Configuração restaurada do link compartilhado.');
      } catch (e) {
        console.warn('URL state inválido');
      }
    } else {
      const saved = Cookies.get('liberado_app_session');
      if (saved) {
        try {
          state = JSON.parse(saved);
        } catch (e) {
          console.warn('Cookie state inválido');
        }
      }
    }

    if (state) {
      if (state.plan && PLANS[state.plan]) setPlanId(state.plan);
      if (state.tab && (state.tab === 'pf' || state.tab === 'pj')) setTab(state.tab);
      if (Array.isArray(state.pf)) {
        setSelectedServices(prev => ({ ...prev, pf: new Set(state.pf) }));
      }
      if (Array.isArray(state.pj)) {
        setSelectedServices(prev => ({ ...prev, pj: new Set(state.pj) }));
      }
      if (state.empresa || state.responsavel || state.email || state.telefone) {
        setClientInfo({
          empresa: state.empresa || '',
          responsavel: state.responsavel || '',
          email: state.email || '',
          telefone: state.telefone || ''
        });
      }
      if (state.isStarted !== undefined) {
        setIsStarted(state.isStarted);
      } else if (state.empresa || state.responsavel) {
        setIsStarted(true);
      }
    }
    setHasLoaded(true);
  }, []);

  // Save to cookie whenever state changes
  useEffect(() => {
    if (!hasLoaded) return;

    const state = {
      plan: planId,
      tab,
      pf: Array.from(selectedServices.pf),
      pj: Array.from(selectedServices.pj),
      empresa: clientInfo.empresa,
      responsavel: clientInfo.responsavel,
      email: clientInfo.email,
      telefone: clientInfo.telefone,
      isStarted
    };
    Cookies.set('liberado_app_session', JSON.stringify(state), { expires: 7, sameSite: 'strict' });
  }, [planId, tab, selectedServices, clientInfo, isStarted, hasLoaded]);

  // Handlers
  const toggleService = (id: string) => {
    if (plan.locked.includes(id)) return;
    
    setSelectedServices(prev => {
      const newSet = new Set(prev[tab]);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return { ...prev, [tab]: newSet };
    });
  };

  const showToast = (type: 'success' | 'info', title: string, msg: string) => {
    setToast({ type, title, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const buildShareURL = () => {
    const state = {
      plan: planId,
      tab,
      pf: Array.from(selectedServices.pf),
      pj: Array.from(selectedServices.pj),
      empresa: clientInfo.empresa,
      responsavel: clientInfo.responsavel,
      email: clientInfo.email,
      telefone: clientInfo.telefone,
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(state)));
    return `${window.location.origin}${window.location.pathname}?cfg=${encoded}`;
  };

  const copyShareURL = () => {
    navigator.clipboard.writeText(buildShareURL()).then(() => {
      setShowShareModal(false);
      showToast('success', 'Link copiado!', 'Cole no e-mail ou WhatsApp para compartilhar.');
    });
  };

  const exportPDF = () => {
    if (!clientInfo.empresa) {
      showToast('info', 'Identifique o cliente primeiro', 'Preencha o nome da empresa antes de exportar.');
      return;
    }
    showToast('info', 'Gerando PDF...', 'Selecione "Salvar como PDF" no destino da impressão.');
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const formatNumber = (val: number) => 
    new Intl.NumberFormat('pt-BR').format(val);

  // Group services by category
  const groupedServices = useMemo(() => {
    const groups: Record<string, Service[]> = {};
    services.forEach(s => {
      if (!groups[s.category]) groups[s.category] = [];
      groups[s.category].push(s);
    });
    return groups;
  }, [services]);

  return (
    <div className="min-h-screen pb-20">
      {/* Initial Quote Form */}
      <AnimatePresence mode="wait">
        {!isStarted ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex items-center justify-center p-4 bg-navy"
          >
            <div className="w-full max-w-xl glass p-8 rounded-2xl border border-white/10 shadow-2xl">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 border-2 border-brand-cyan rounded-full opacity-50" />
                    <div className="w-2 h-2 bg-white rounded-full absolute top-3 left-3" />
                    <div className="w-2 h-2 bg-white rounded-full absolute top-3 right-3" />
                    <div className="w-4 h-1 bg-white rounded-full absolute bottom-3" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Gerador de Cotação Customizada</h2>
                <p className="text-white/60 text-sm">Preencha os dados abaixo para iniciar sua simulação personalizada.</p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (clientInfo.empresa && clientInfo.responsavel) {
                    setIsStarted(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    showToast('info', 'Campos obrigatórios', 'Por favor, preencha o nome da empresa e do responsável.');
                  }
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-cyan">Empresa / Cliente *</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ex: Liberado App"
                      value={clientInfo.empresa}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, empresa: e.target.value }))}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-cyan transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-cyan">Responsável *</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Nome completo"
                      value={clientInfo.responsavel}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, responsavel: e.target.value }))}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-cyan transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-cyan">E-mail Corporativo</label>
                    <input 
                      type="email" 
                      placeholder="contato@empresa.com"
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-cyan transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand-cyan">Telefone / WhatsApp</label>
                    <input 
                      type="tel" 
                      placeholder="(00) 00000-0000"
                      value={clientInfo.telefone}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, telefone: e.target.value }))}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-cyan transition-colors"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 rounded-xl bg-brand-cyan text-navy font-bold text-sm hover:bg-brand-cyan/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-cyan/20"
                >
                  Iniciar Simulação
                  <TrendingUp size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="simulator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen"
          >
            {/* Topbar */}
            <header className="sticky top-0 z-50 h-14 bg-navy-light border-b border-white/10 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold tracking-tight">Liberad</span>
            <div className="w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 border-2 border-brand-cyan rounded-full opacity-50" />
              <div className="w-1 h-1 bg-white rounded-full absolute top-1.5 left-1.5" />
              <div className="w-1 h-1 bg-white rounded-full absolute top-1.5 right-1.5" />
              <div className="w-2 h-0.5 bg-white rounded-full absolute bottom-1.5" />
            </div>
          </div>
          <div className="hidden sm:block w-px h-5 bg-white/10" />
          <div className="hidden sm:block text-[9px] font-bold uppercase tracking-widest text-white/40">
            Proposta Comercial
          </div>
        </div>

        <div className="flex items-center gap-3">
          {clientInfo.empresa && (
            <div className="hidden lg:block text-xs font-mono text-white/40">
              <strong className="text-white/60 font-medium">{clientInfo.empresa}</strong>
            </div>
          )}
          <button 
            onClick={() => setShowShareModal(true)}
            className="btn-ghost flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Share2 size={14} />
            <span className="hidden sm:inline">Compartilhar</span>
          </button>
          <button 
            onClick={exportPDF}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500/20 transition-colors"
          >
            <FileText size={14} />
            <span className="hidden sm:inline">Baixar PDF</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start border-b border-white/10 pb-6 mb-8 gap-4">
          <div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-brand-cyan mb-1">
              Liberado App · Proposta Comercial
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Simulador de <span className="text-brand-cyan italic">Consultas Mensais</span>
            </h1>
          </div>
          <div className="text-right font-mono text-[11px] text-white/40">
            <strong className="block text-white/60 text-xs mb-1">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </strong>
            liberadoapp.com
          </div>
        </div>

        {/* Client Identification */}
        <section className="mb-8">
          <div className="text-[9px] font-bold uppercase tracking-widest text-brand-cyan mb-3">
            00 — Identifique o cliente
          </div>
          <div className="glass p-5 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-widest text-brand-cyan">Empresa / Cliente</label>
              <input 
                type="text" 
                placeholder="Nome da empresa"
                value={clientInfo.empresa}
                onChange={(e) => setClientInfo(prev => ({ ...prev, empresa: e.target.value }))}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-cyan transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-widest text-brand-cyan">Responsável pelo contato</label>
              <input 
                type="text" 
                placeholder="Nome do responsável"
                value={clientInfo.responsavel}
                onChange={(e) => setClientInfo(prev => ({ ...prev, responsavel: e.target.value }))}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-cyan transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-widest text-brand-cyan">Status</label>
              <div className="flex items-center gap-2 bg-brand-cyan/5 border border-brand-cyan/20 rounded-lg px-3 py-2 text-xs text-brand-cyan">
                <CheckCircle2 size={14} />
                <span>{clientInfo.empresa ? clientInfo.empresa : 'Aguardando dados'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Banner */}
        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 mb-8 flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
            <Check size={18} className="text-green-500" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-green-500 mb-1">Política de excedente — sem surpresas na fatura</h4>
            <p className="text-xs text-white/60 leading-relaxed">
              O valor mensal do plano é uma <strong className="text-white/80 font-medium">mensalidade de acesso à plataforma</strong>. As consultas são cobradas por uso unitário.
              Se o cliente usar <strong className="text-white/80 font-medium">mais do que o estimado</strong>, ele paga apenas o <strong className="text-white/80 font-medium">valor unitário de cada consulta excedente</strong> — sem reajuste no plano, sem multa.
            </p>
          </div>
        </div>

        {/* Plans Selection */}
        <section className="mb-8">
          <div className="text-[9px] font-bold uppercase tracking-widest text-brand-cyan mb-3">
            01 — Selecione o plano
          </div>
          <div id="plans-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.values(PLANS).map((p) => (
              <button
                key={p.id}
                onClick={() => setPlanId(p.id)}
                className={`plan text-left p-4 rounded-xl border transition-all relative group ${
                  planId === p.id 
                    ? 'active border-brand-cyan bg-brand-cyan/10' 
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: p.badgeColor || (planId === p.id ? '#00c4f4' : 'rgba(255,255,255,0.4)') }}>
                  {p.label === 'Standard' ? '⭐ Standard — mais popular' : p.label}
                </div>
                <div className="text-xl font-semibold">{p.price ? formatCurrency(p.price) : 'Custom'}</div>
                <div className="text-[10px] text-white/40 mb-3">por mês</div>
                
                <div className="pn-features space-y-1.5 pt-3 border-t border-white/10">
                  {p.features.map((f, i) => (
                    <div key={i} className={`flex items-center gap-1.5 text-[10px] ${f.ok ? 'text-white/60' : 'text-white/20 line-through'}`}>
                      {f.ok ? <Check size={10} className="text-brand-cyan" /> : <X size={10} />}
                      {f.txt}
                    </div>
                  ))}
                </div>

                {planId === p.id && (
                  <div className="absolute top-3 right-3 w-4 h-4 bg-brand-cyan rounded-full flex items-center justify-center">
                    <Check size={10} className="text-navy" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Selected Plan Details Section (Reflected below) */}
        <section className="mb-8 glass p-6 rounded-xl border-brand-cyan/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-[9px] font-bold uppercase tracking-widest text-brand-cyan mb-4">
            01.1 — Detalhes do Plano Ativo: {plan.label}
          </div>
          <div className="pn-features grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plan.features.map((f, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 transition-all ${f.ok ? 'opacity-100 border-brand-cyan/30' : 'opacity-30'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${f.ok ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-white/10 text-white/40'}`}>
                  {f.ok ? <Check size={14} /> : <X size={14} />}
                </div>
                <span className="text-xs font-medium leading-tight">{f.txt}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Services Configuration */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="text-[9px] font-bold uppercase tracking-widest text-brand-cyan">
              02 — Configure o pacote de serviços
            </div>
            <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
              <button 
                onClick={() => setTab('pf')}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${tab === 'pf' ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30' : 'text-white/40 hover:text-white/60'}`}
              >
                Pessoa Física
              </button>
              <button 
                onClick={() => setTab('pj')}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${tab === 'pj' ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30' : 'text-white/40 hover:text-white/60'}`}
              >
                Pessoa Jurídica
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr,370px] gap-6 items-start">
            {/* Services List (as Cards) */}
            <div className="glass rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <span className="text-xs font-medium text-white/60">
                  {tab === 'pf' ? 'Pessoa Física (28 serviços)' : 'Pessoa Jurídica (18 serviços)'}
                </span>
                <span className="text-[11px] font-mono text-brand-cyan">
                  {currentSelected.size} selecionado{currentSelected.size !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(groupedServices).map(([cat, items]) => (
                    <React.Fragment key={cat}>
                      <div className="col-span-full mt-4 first:mt-0 mb-2">
                        <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: CAT_COLORS[cat] || '#94a3b8' }}>
                          {cat}
                        </div>
                      </div>
                      {(items as Service[]).map((s) => {
                        const isLocked = plan.locked.includes(s.id);
                        const isSelected = !isLocked && currentSelected.has(s.id);
                        const price = plan.idx === 3 ? s.prices[2] : s.prices[plan.idx];

                        return (
                          <button
                            key={s.id}
                            onClick={() => toggleService(s.id)}
                            disabled={isLocked}
                            className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between gap-2 h-full ${
                              isSelected 
                                ? 'border-green-500 bg-green-500/10' 
                                : isLocked 
                                  ? 'opacity-40 cursor-not-allowed border-white/5 bg-white/2'
                                  : 'border-white/10 bg-white/5 hover:border-white/20'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span className={`text-[11px] leading-tight ${isSelected ? 'text-white' : 'text-white/60'}`}>
                                {s.name}
                              </span>
                              <div className={`w-4 h-4 rounded shrink-0 border flex items-center justify-center ${isSelected ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>
                                {isSelected && <Check size={10} className="text-navy" />}
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-auto">
                              {isLocked ? (
                                <span className="text-[8px] font-bold uppercase tracking-tight px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                  🔒 {plan.lockReason}
                                </span>
                              ) : (
                                <span className={`text-[10px] font-mono ${isSelected ? 'text-green-500' : 'text-white/40'}`}>
                                  {plan.idx === 3 && '~'} {formatCurrency(price)}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Summary & Calculations */}
            <aside className="flex flex-col gap-4">
              {/* Main Metric */}
              <div className="bg-navy-lighter border border-brand-cyan/20 rounded-xl p-6 text-center relative overflow-hidden">
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-brand-cyan/5 rounded-full" />
                <div className="text-[9px] font-bold uppercase tracking-widest text-brand-cyan mb-2">
                  Verificações completas / mês no plano
                </div>
                <div className="text-5xl font-semibold tracking-tighter font-mono leading-none">
                  {plan.id === 'enterprise' ? '∞' : formatNumber(verificationsInPlan)}
                </div>
                <div className="text-[11px] text-white/40 mt-3">
                  {plan.id === 'enterprise' 
                    ? 'volume negociado com a equipe comercial' 
                    : `plano ${plan.label} · ${formatCurrency(costPerVerification)} por verificação`}
                </div>
              </div>

              {/* Mini Grid Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="glass p-3 rounded-xl">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1">Por dia útil</div>
                  <div className="text-lg font-semibold font-mono">
                    {plan.id === 'enterprise' ? '—' : formatNumber(Math.floor(verificationsInPlan / 22))}
                  </div>
                  <div className="text-[9px] text-white/30">base 22 dias/mês</div>
                </div>
                <div className="glass p-3 rounded-xl">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1">Por semana</div>
                  <div className="text-lg font-semibold font-mono">
                    {plan.id === 'enterprise' ? '—' : formatNumber(Math.floor(verificationsInPlan / 4.35))}
                  </div>
                  <div className="text-[9px] text-white/30">aprox. 4,3 semanas</div>
                </div>
                <div className="glass p-3 rounded-xl">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1">Custo/verificação</div>
                  <div className="text-base font-semibold font-mono text-brand-cyan">
                    {formatCurrency(costPerVerification)}
                  </div>
                  <div className="text-[9px] text-white/30">{currentSelected.size} serviço(s)</div>
                </div>
                <div className="glass p-3 rounded-xl">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1">Saldo do plano</div>
                  <div className="text-base font-semibold font-mono">
                    {plan.id === 'enterprise' ? '—' : formatCurrency(plan.price! - (verificationsInPlan * costPerVerification))}
                  </div>
                  <div className="text-[9px] text-white/30">crédito residual</div>
                </div>
              </div>

              {/* Budget Bar */}
              {plan.price !== null && (
                <div className="glass p-4 rounded-xl">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Aproveitamento do plano</div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${usagePercentage}%` }}
                      className="h-full bg-gradient-to-r from-brand-cyan to-brand-blue rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-white/40 font-mono">
                    <span>{formatCurrency(verificationsInPlan * costPerVerification)} utilizado</span>
                    <span>{usagePercentage}%</span>
                    <span>limite {formatCurrency(plan.price)}</span>
                  </div>
                </div>
              )}

              {/* Overage Simulator */}
              {plan.price !== null && (
                <div className="glass rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-white/10 text-[9px] font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2 bg-amber-500/5">
                    <AlertCircle size={12} />
                    Simulador de excedente
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="text-xs text-white/60">Verificações extras além do plano</span>
                      <input 
                        type="number" 
                        value={extraVerifications}
                        onChange={(e) => setExtraVerifications(Math.max(0, parseInt(e.target.value || '0')))}
                        className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-right font-mono outline-none focus:border-amber-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-white/40">Mensalidade do plano {plan.label}</span>
                        <span className="text-white/60 font-mono">{formatCurrency(plan.price)}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-white/40">{formatNumber(extraVerifications)} extras × {formatCurrency(costPerVerification)}</span>
                        <span className="text-white/60 font-mono">{formatCurrency(extraVerifications * costPerVerification)}</span>
                      </div>
                      <div className="h-px bg-white/10 my-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold">Total do mês</span>
                        <span className="text-sm font-bold font-mono text-amber-500">
                          {formatCurrency(plan.price + (extraVerifications * costPerVerification))}
                        </span>
                      </div>
                      <div className="mt-3">
                        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20">
                          ✓ Sem reajuste de plano · Paga só o excedente
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Breakdown */}
              <div className="glass rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/10 text-[9px] font-bold uppercase tracking-widest text-white/40">
                  Composição de custo por verificação
                </div>
                <div className="divide-y divide-white/5">
                  {services.filter(s => currentSelected.has(s.id)).map(s => (
                    <div key={s.id} className="flex justify-between items-start p-3 gap-4">
                      <span className="text-[11px] text-white/60 leading-tight">{s.name}</span>
                      <span className="text-[10px] font-mono text-white/40 shrink-0">
                        {formatCurrency(plan.idx === 3 ? s.prices[2] : s.prices[plan.idx])}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 bg-green-500/5">
                    <span className="text-xs font-semibold">Total por pessoa verificada</span>
                    <span className="text-sm font-bold font-mono text-green-500">{formatCurrency(costPerVerification)}</span>
                  </div>
                </div>
              </div>

              {/* Insight Box */}
              <div className="bg-brand-cyan/5 border border-brand-cyan/15 rounded-xl p-4 text-xs text-white/60 leading-relaxed">
                {plan.id === 'enterprise' ? (
                  <p>
                    Plano <strong className="text-brand-cyan font-medium">Enterprise</strong>: preço personalizado por volume. Referência ao custo Standard: <strong className="text-white/80">{formatCurrency(costPerVerification)}/verificação</strong>, ~<strong className="text-white/80">{formatNumber(Math.floor(1797 / costPerVerification))} verificações/mês</strong>.
                  </p>
                ) : (
                  <p>
                    Plano <strong className="text-brand-cyan font-medium">{plan.label}</strong>: <strong className="text-white/80">{formatNumber(verificationsInPlan)} verificações incluídas</strong>. Excedente a <strong className="text-white/80">{formatCurrency(costPerVerification)}/verificação</strong>. 
                    {planId !== 'standard' && (
                      <> No plano <strong className="text-white/80">Standard</strong> o custo cai para <strong className="text-white/80">{formatCurrency(services.filter(s => currentSelected.has(s.id)).reduce((a, s) => a + s.prices[2], 0))}</strong>.</>
                    )}
                  </p>
                )}
              </div>
            </aside>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 flex justify-center no-print">
          <button 
            onClick={exportPDF}
            className="flex items-center gap-3 px-8 py-4 rounded-xl bg-green-500 text-navy font-bold text-sm hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
          >
            <FileText size={20} />
            Baixar Orçamento em PDF
          </button>
        </div>

        <footer className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-end gap-6">
          <div className="text-[10px] text-white/40">
            Valores unitários por consulta · Tabela de referência <strong className="text-white/60 font-medium">2025/2026</strong>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <span className="text-[10px] text-white/40">
              <strong className="text-white/60 font-medium">Maxwell da Conceição Félix</strong> · Growth Marketing Analyst
            </span>
            <span className="text-[10px] text-white/40">maxwell@liberadoapp.com</span>
          </div>
        </footer>
      </main>
    </motion.div>
  )}
</AnimatePresence>

{/* Share Modal */}
<AnimatePresence>
  {showShareModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-navy-light border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Share2 size={18} className="text-brand-cyan" />
                  Link compartilhável
                </h3>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 block mb-2">URL com configuração atual</label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] font-mono text-brand-cyan truncate">
                      {buildShareURL()}
                    </div>
                    <button 
                      onClick={copyShareURL}
                      className="px-4 py-2 rounded-lg bg-brand-cyan text-navy text-xs font-bold hover:bg-brand-cyan/90 transition-colors flex items-center gap-2"
                    >
                      <Copy size={14} />
                      Copiar
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 block mb-2">Resumo da configuração</label>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Cliente</span>
                      <span className="text-white/80 font-medium">{clientInfo.empresa || '—'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Plano</span>
                      <span className="text-white/80 font-medium">{plan.label}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Serviços {tab.toUpperCase()}</span>
                      <span className="text-white/80 font-medium">{currentSelected.size} selecionados</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40">Custo/verificação</span>
                      <span className="text-brand-cyan font-mono">{formatCurrency(costPerVerification)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-[200] bg-navy-light border border-white/10 rounded-xl p-4 shadow-2xl flex items-center gap-4 max-w-xs"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${toast.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-brand-cyan/10 text-brand-cyan'}`}>
              {toast.type === 'success' ? <Check size={18} /> : <Info size={18} />}
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight">{toast.title}</div>
              <div className="text-[10px] text-white/60 mt-0.5">{toast.msg}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Go to Top Button */}
      <AnimatePresence>
        {showGoToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 z-[200] w-12 h-12 rounded-full bg-brand-cyan text-navy flex items-center justify-center shadow-2xl hover:bg-brand-cyan/90 transition-colors group no-print"
            title="Voltar ao topo"
          >
            <ChevronUp size={24} className="group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
