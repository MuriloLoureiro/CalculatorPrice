/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Service {
  category: string;
  id: string;
  name: string;
  prices: [number, number, number]; // [Start, Basic, Standard]
}

export const PF_SERVICES: Service[] = [
  { category: 'Documento Dossiê', id: 'pf_dossie', name: 'Relatório Dossiê PDF (por API ou Manual)', prices: [1.29, 0.86, 0.86] },
  { category: 'Cadastral', id: 'pf_dados', name: 'Dados Cadastrais Básicos — Receita Federal', prices: [0.27, 0.18, 0.18] },
  { category: 'Cadastral', id: 'pf_sms', name: 'Validação de Telefone de Contato / Convite (SMS)', prices: [0.44, 0.29, 0.29] },
  { category: 'Cadastral', id: 'pf_datavalid', name: 'Autenticação de Dados — Datavalid', prices: [1.75, 1.67, 1.67] },
  { category: 'Cadastral', id: 'pf_facematch', name: 'Face Match — Selfie x Documento', prices: [0.09, 0.06, 0.06] },
  { category: 'Cadastral', id: 'pf_dv_img', name: 'Autenticação de Identidade Imagem — Datavalid', prices: [5.78, 3.86, 3.86] },
  { category: 'Cadastral', id: 'pf_liveness', name: 'Liveness — Autenticação Facial', prices: [0.68, 0.47, 0.47] },
  { category: 'Cadastral', id: 'pf_ia', name: 'Processamento de Imagem com I.A.', prices: [1.34, 0.89, 0.89] },
  { category: 'Cadastral/Transacional', id: 'pf_unico', name: 'Biometria Facial Unico', prices: [2.00, 1.70, 1.70] },
  { category: 'Compliance', id: 'pf_kyc', name: 'KYC e PLD — Lista PEP e Sanções', prices: [0.86, 0.59, 0.59] },
  { category: 'Compliance (Bet)', id: 'pf_bet', name: 'Casa de Apostas — Compliance (Lei 14.790)', prices: [0.68, 0.59, 0.59] },
  { category: 'Criminal', id: 'pf_pf', name: 'Antecedentes Criminais — Polícia Federal (Nada Consta)', prices: [1.02, 0.68, 0.68] },
  { category: 'Criminal', id: 'pf_pc', name: 'Antecedentes Criminais — Polícia Civil', prices: [1.02, 0.68, 0.68] },
  { category: 'Criminal', id: 'pf_cnj', name: 'Mandados de Prisão — CNJ', prices: [1.02, 0.68, 0.68] },
  { category: 'Criminal e Judicial', id: 'pf_proc', name: 'Processos Judiciais (Cível + Criminal + Trabalhista)', prices: [1.29, 0.86, 0.86] },
  { category: 'Criminal e Judicial', id: 'pf_jus', name: 'Processos Judiciais — Jusbrasil', prices: [6.98, 6.02, 5.79] },
  { category: 'Criminal e Judicial', id: 'pf_trf', name: 'TRF 1, 2, 4, 5, 6 — Tribunal Regional Federal', prices: [0.60, 0.40, 0.40] },
  { category: 'BPO', id: 'pf_bpo', name: 'BPO Criminal', prices: [21.50, 19.50, 17.00] },
  { category: 'Financeiro/Crédito', id: 'pf_bv', name: 'Dados Restritivos de Crédito — Boa Vista', prices: [15.50, 12.40, 8.70] },
  { category: 'Financeiro/Crédito', id: 'pf_quod', name: 'Dados Restritivos de Crédito — Quod', prices: [2.76, 2.50, 2.50] },
  { category: 'Financeiro/Crédito', id: 'pf_serasa', name: 'Integração Token Serasa (cliente contrata direto)', prices: [1.65, 1.65, 1.65] },
  { category: 'Social', id: 'pf_bolsa', name: 'Benefício Social', prices: [0.76, 0.70, 0.70] },
  { category: 'Social', id: 'pf_hist', name: 'Histórico de Trabalho', prices: [0.68, 0.59, 0.59] },
  { category: 'Social', id: 'pf_turn', name: 'Histórico Turn Over', prices: [0.68, 0.59, 0.59] },
  { category: 'Social', id: 'pf_email', name: 'E-mail', prices: [0.20, 0.10, 0.10] },
  { category: 'Social', id: 'pf_tel', name: 'Telefone', prices: [0.20, 0.10, 0.10] },
  { category: 'Social', id: 'pf_end', name: 'Endereço', prices: [0.20, 0.10, 0.10] },
  { category: 'Social', id: 'pf_rel_emp', name: 'Relacionamento com Empresas', prices: [0.12, 0.06, 0.06] },
  { category: 'Social', id: 'pf_rel_pes', name: 'Relacionamento com Pessoas', prices: [0.12, 0.06, 0.06] },
];

export const PJ_SERVICES: Service[] = [
  { category: 'Documento Dossiê', id: 'pj_dossie', name: 'Relatório Dossiê PDF (por API ou Manual)', prices: [1.29, 0.86, 0.86] },
  { category: 'Cadastral', id: 'pj_rep', name: 'Consulta de Representantes Legais — Receita Federal', prices: [0.18, 0.14, 0.14] },
  { category: 'Cadastral', id: 'pj_dados', name: 'Dados Cadastrais Básicos — Receita Federal', prices: [0.27, 0.18, 0.18] },
  { category: 'Cadastral', id: 'pj_contato', name: 'Dados de Contato (telefone, e-mail, endereço)', prices: [0.39, 0.35, 0.35] },
  { category: 'Cadastral', id: 'pj_sms', name: 'Validação de Telefone de Contato / Convite (SMS)', prices: [0.44, 0.29, 0.29] },
  { category: 'Cadastral', id: 'pj_qsa', name: 'QSA e Percentual de Participação Societária', prices: [4.20, 4.03, 4.03] },
  { category: 'Cadastral', id: 'pj_sintegra', name: 'Sintegra', prices: [0.75, 0.75, 0.75] },
  { category: 'Compliance', id: 'pj_kyc', name: 'KYC e PLD — Lista PEP e Sanções', prices: [0.86, 0.59, 0.59] },
  { category: 'Compliance', id: 'pj_cgu', name: 'Certidão Negativa CGU', prices: [0.86, 0.68, 0.68] },
  { category: 'Criminal e Judicial', id: 'pj_proc', name: 'Processos Judiciais (Cível + Criminal + Trabalhista)', prices: [1.29, 0.86, 0.86] },
  { category: 'Criminal e Judicial', id: 'pj_jus', name: 'Processos Judiciais — Jusbrasil', prices: [6.98, 6.02, 5.79] },
  { category: 'Criminal e Judicial', id: 'pj_socios', name: 'Dados de Distribuição de Processos dos Sócios', prices: [0.86, 0.68, 0.68] },
  { category: 'Trabalhista', id: 'pj_fgts', name: 'Certidão FGTS / Devedores do Governo', prices: [0.86, 0.68, 0.68] },
  { category: 'Trabalhista', id: 'pj_trab', name: 'Certidão Negativa de Débitos Trabalhistas', prices: [0.86, 0.68, 0.68] },
  { category: 'Financeiro/Crédito', id: 'pj_quod', name: 'Consulta de Risco de Crédito para Empresa — Quod', prices: [2.76, 2.50, 2.50] },
  { category: 'Financeiro/Crédito', id: 'pj_cred', name: 'Dados Restritivos de Crédito', prices: [15.50, 12.40, 8.70] },
  { category: 'Financeiro/Crédito', id: 'pj_serasa', name: 'Integração Token Serasa (cliente contrata direto)', prices: [1.65, 1.65, 1.65] },
  { category: 'Tributário', id: 'pj_pgfn', name: 'Certidão PGFN / Devedores do Governo', prices: [0.86, 0.68, 0.68] },
];

export interface PlanFeature {
  ok: boolean;
  txt: string;
}

export interface Plan {
  id: string;
  label: string;
  price: number | null;
  idx: number;
  locked: string[];
  lockReason: string;
  features: PlanFeature[];
  badgeColor?: string;
}

export const PLANS: Record<string, Plan> = {
  start: {
    id: 'start',
    label: 'Start',
    price: 397,
    idx: 0,
    locked: ['pf_dossie', 'pj_dossie', 'pf_bpo', 'pj_qsa'],
    lockReason: 'Não incluso no Start',
    features: [
      { ok: true, txt: 'Consulta básica online' },
      { ok: false, txt: 'Consulta avançada' },
      { ok: false, txt: 'Relatório Dossiê' },
      { ok: false, txt: 'Integração via API' },
    ],
  },
  basic: {
    id: 'basic',
    label: 'Basic',
    price: 797,
    idx: 1,
    locked: [],
    lockReason: '',
    features: [
      { ok: true, txt: 'Consulta básica online' },
      { ok: true, txt: 'Consulta avançada' },
      { ok: true, txt: 'Relatório Dossiê' },
      { ok: false, txt: 'Integração via API' },
    ],
  },
  standard: {
    id: 'standard',
    label: 'Standard',
    price: 1797,
    idx: 2,
    locked: [],
    lockReason: '',
    badgeColor: '#f5a623',
    features: [
      { ok: true, txt: 'Consulta básica online' },
      { ok: true, txt: 'Consulta avançada' },
      { ok: true, txt: 'Relatório Dossiê' },
      { ok: true, txt: 'Integração via API' },
    ],
  },
  enterprise: {
    id: 'enterprise',
    label: 'Enterprise',
    price: null,
    idx: 3,
    locked: [],
    lockReason: '',
    badgeColor: '#a78bfa',
    features: [
      { ok: true, txt: 'Consulta básica online' },
      { ok: true, txt: 'Consulta avançada' },
      { ok: true, txt: 'Relatório Dossiê' },
      { ok: true, txt: 'Integração via API' },
    ],
  },
};

export const CAT_COLORS: Record<string, string> = {
  'Documento Dossiê': '#94a3b8',
  'Cadastral': '#38bdf8',
  'Cadastral/Transacional': '#38bdf8',
  'Compliance': '#4ade80',
  'Compliance (Bet)': '#a3e635',
  'Criminal': '#f87171',
  'Criminal e Judicial': '#fb923c',
  'BPO': '#e879f9',
  'Financeiro/Crédito': '#fbbf24',
  'Social': '#67e8f9',
  'Trabalhista': '#86efac',
  'Tributário': '#fde68a',
};
