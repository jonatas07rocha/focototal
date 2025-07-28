// --- DEFINIÇÃO DOS TEMAS ---
// Este arquivo contém a definição de todos os temas da aplicação.
// Cada tema é um objeto com propriedades CSS personalizadas (variáveis).
export const themes = {
    // Temas Nacionais
    brasil_dark: {
        name: 'Brasil Escuro',
        '--color-primary-rgb': '0, 155, 58', /* Verde Bandeira */
        '--color-primary-focus-rgb': '0, 130, 48',
        '--color-primary-darker-rgb': '0, 100, 38',
        '--color-primary-light-rgb': '77, 184, 108',
        '--color-bg-main': 'radial-gradient(circle at center, #1a202c 0%, #000000 70%)', /* Quase preto */
        '--color-bg-shell': '#1F2937', /* Azul Escuro */
        '--color-bg-panel': '#111827', /* Azul ainda mais escuro */
        '--color-bg-input': '#374151', /* Cinza Azulado */
        '--color-bg-input-light': '#4B5563', /* Cinza Azulado mais claro */
        '--color-text-base': '#D1D5DB', /* Cinza claro */
        '--color-text-header': '#FFFFFF', /* Branco */
        '--color-text-muted': '#9CA3AF', /* Cinza */
        '--color-text-placeholder': '#6B7280', /* Cinza mais escuro */
        '--color-text-timer': '#FFFFFF', /* Branco */
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '#FFDD00', /* Amarelo da bandeira */
        '--color-break-long': '0, 39, 118', /* Azul da bandeira */
    },
    brasil_light: {
        name: 'Brasil Claro',
        '--color-primary-rgb': '255, 221, 0', /* Amarelo Bandeira */
        '--color-primary-focus-rgb': '230, 199, 0',
        '--color-primary-darker-rgb': '200, 170, 0',
        '--color-primary-light-rgb': '255, 235, 77',
        '--color-bg-main': '#FEFCE8', /* Amarelo muito claro */
        '--color-bg-shell': '#FFFFFF',
        '--color-bg-panel': '#FFFBEB',
        '--color-bg-input': '#F7FAFC',
        '--color-bg-input-light': '#EDF2F7',
        '--color-text-base': '#4A5568', /* Cinza escuro */
        '--color-text-header': '#1A202C', /* Quase preto */
        '--color-text-muted': '#718096', /* Cinza */
        '--color-text-placeholder': '#A0AEC0', /* Cinza claro */
        '--color-text-timer': '#1A202C', /* Quase preto */
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '0, 155, 58', /* Verde da bandeira */
        '--color-break-long': '0, 39, 118', /* Azul da bandeira */
    },

    // Região Sudeste
    saopaulo_dark: {
        name: 'São Paulo Escuro',
        '--color-primary-rgb': '200, 16, 46', /* Vermelho da bandeira SP */
        '--color-primary-focus-rgb': '170, 14, 38',
        '--color-primary-darker-rgb': '140, 10, 30',
        '--color-primary-light-rgb': '220, 40, 70',
        '--color-bg-main': 'radial-gradient(circle at center, #1a1a1a 0%, #000000 70%)', /* Preto */
        '--color-bg-shell': '#111111',
        '--color-bg-panel': '#000000',
        '--color-bg-input': '#222222',
        '--color-bg-input-light': '#333333',
        '--color-text-base': '#D1D5DB', /* Cinza claro */
        '--color-text-header': '#FFFFFF', /* Branco */
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '255, 255, 255', /* Branco */
        '--color-break-long': '0, 0, 0', /* Preto */
    },
    riodejaneiro_light: {
        name: 'Rio de Janeiro',
        '--color-primary-rgb': '0, 42, 140', /* Azul da bandeira RJ */
        '--color-primary-focus-rgb': '0, 35, 115',
        '--color-primary-darker-rgb': '0, 28, 90',
        '--color-primary-light-rgb': '50, 80, 180',
        '--color-bg-main': '#F0F8FF', /* Azul muito claro */
        '--color-bg-shell': '#FFFFFF',
        '--color-bg-panel': '#F8F8FF',
        '--color-bg-input': '#E8F0F8',
        '--color-bg-input-light': '#DCE6F0',
        '--color-text-base': '#333333', /* Cinza escuro */
        '--color-text-header': '#000000', /* Preto */
        '--color-text-muted': '#666666',
        '--color-text-placeholder': '#AAAAAA',
        '--color-text-timer': '#000000',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '255, 221, 0', /* Amarelo (sol) */
        '--color-break-long': '200, 16, 46', /* Vermelho (brasão) */
    },
    minasgerais_light: {
        name: 'Minas Gerais',
        '--color-primary-rgb': '200, 16, 46', /* Vermelho da bandeira MG */
        '--color-primary-focus-rgb': '170, 14, 38',
        '--color-primary-darker-rgb': '140, 10, 30',
        '--color-primary-light-rgb': '220, 40, 70',
        '--color-bg-main': '#F9FAFB', /* Branco */
        '--color-bg-shell': '#FFFFFF',
        '--color-bg-panel': '#F3F4F6',
        '--color-bg-input': '#FFFFFF',
        '--color-bg-input-light': '#E5E7EB',
        '--color-text-base': '#374151', /* Cinza escuro */
        '--color-text-header': '#111827', /* Quase preto */
        '--color-text-muted': '#6B7280',
        '--color-text-placeholder': '#9CA3AF',
        '--color-text-timer': '#111827',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '10, 185, 129', /* Verde */
        '--color-break-long': '139, 92, 246', /* Roxo */
    },

    // Região Nordeste
    bahia_dark: {
        name: 'Bahia Escuro',
        '--color-primary-rgb': '204, 0, 0', /* Vermelho da bandeira BA */
        '--color-primary-focus-rgb': '170, 0, 0',
        '--color-primary-darker-rgb': '140, 0, 0',
        '--color-primary-light-rgb': '230, 30, 30',
        '--color-bg-main': 'radial-gradient(circle at center, #003366 0%, #000033 70%)', /* Azul escuro */
        '--color-bg-shell': '#002A5C',
        '--color-bg-panel': '#001A3A',
        '--color-bg-input': '#004080',
        '--color-bg-input-light': '#0050A0',
        '--color-text-base': '#D1D5DB', /* Cinza claro */
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '255, 255, 255', /* Branco */
        '--color-break-long': '0, 51, 102', /* Azul */
    },
    pernambuco_light: {
        name: 'Pernambuco',
        '--color-primary-rgb': '255, 255, 0', /* Amarelo da bandeira PE */
        '--color-primary-focus-rgb': '230, 230, 0',
        '--color-primary-darker-rgb': '200, 200, 0',
        '--color-primary-light-rgb': '255, 255, 77',
        '--color-bg-main': '#F0F8FF', /* Azul muito claro */
        '--color-bg-shell': '#FFFFFF',
        '--color-bg-panel': '#F8F8FF',
        '--color-bg-input': '#E8F0F8',
        '--color-bg-input-light': '#DCE6F0',
        '--color-text-base': '#333333', /* Cinza escuro */
        '--color-text-header': '#000000', /* Preto */
        '--color-text-muted': '#666666',
        '--color-text-placeholder': '#AAAAAA',
        '--color-text-timer': '#000000',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '255, 0, 0', /* Vermelho */
        '--color-break-long': '0, 0, 205', /* Azul */
    },
    alagoas_light: {
        name: 'Alagoas',
        '--color-primary-rgb': '0, 0, 139', /* Azul Marinho da bandeira AL */
        '--color-primary-focus-rgb': '0, 0, 115',
        '--color-primary-darker-rgb': '0, 0, 90',
        '--color-primary-light-rgb': '50, 50, 180',
        '--color-bg-main': '#F0F8FF', /* Azul muito claro */
        '--color-bg-shell': '#FFFFFF',
        '--color-bg-panel': '#F8F8FF',
        '--color-bg-input': '#E8F0F8',
        '--color-bg-input-light': '#DCE6F0',
        '--color-text-base': '#333333',
        '--color-text-header': '#000000',
        '--color-text-muted': '#666666',
        '--color-text-placeholder': '#AAAAAA',
        '--color-text-timer': '#000000',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '255, 0, 0', /* Vermelho */
        '--color-break-long': '255, 255, 255', /* Branco */
    },
    ceara_dark: {
        name: 'Ceará Escuro',
        '--color-primary-rgb': '0, 0, 205', /* Azul da bandeira CE */
        '--color-primary-focus-rgb': '0, 0, 180',
        '--color-primary-darker-rgb': '0, 0, 150',
        '--color-primary-light-rgb': '50, 50, 255',
        '--color-bg-main': 'radial-gradient(circle at center, #1a202c 0%, #000000 70%)',
        '--color-bg-shell': '#1F2937',
        '--color-bg-panel': '#111827',
        '--color-bg-input': '#374151',
        '--color-bg-input-light': '#4B5563',
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '0, 128, 0', /* Verde */
        '--color-break-long': '255, 255, 0', /* Amarelo */
    },
    maranhao_dark: {
        name: 'Maranhão Escuro',
        '--color-primary-rgb': '220, 20, 60', /* Vermelho da bandeira MA */
        '--color-primary-focus-rgb': '170, 14, 38',
        '--color-primary-darker-rgb': '140, 10, 30',
        '--color-primary-light-rgb': '240, 50, 90',
        '--color-bg-main': 'radial-gradient(circle at center, #1a202c 0%, #000000 70%)',
        '--color-bg-shell': '#1F2937',
        '--color-bg-panel': '#111827',
        '--color-bg-input': '#374151',
        '--color-bg-input-light': '#4B5563',
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '255, 255, 255', /* Branco */
        '--color-break-long': '0, 0, 139', /* Azul Marinho */
    },
    paraiba_dark: {
        name: 'Paraíba Escuro',
        '--color-primary-rgb': '200, 16, 46', /* Vermelho da bandeira PB */
        '--color-primary-focus-rgb': '170, 14, 38',
        '--color-primary-darker-rgb': '140, 10, 30',
        '--color-primary-light-rgb': '220, 40, 70',
        '--color-bg-main': 'radial-gradient(circle at center, #1a1a1a 0%, #000000 70%)',
        '--color-bg-shell': '#111111',
        '--color-bg-panel': '#000000',
        '--color-bg-input': '#222222',
        '--color-bg-input-light': '#333333',
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '0, 0, 0', /* Preto */
        '--color-break-long': '255, 255, 255', /* Branco */
    },
    piaui_light: {
        name: 'Piauí',
        '--color-primary-rgb': '255, 255, 0', /* Amarelo da bandeira PI */
        '--color-primary-focus-rgb': '230, 230, 0',
        '--color-primary-darker-rgb': '200, 200, 0',
        '--color-primary-light-rgb': '255, 255, 77',
        '--color-bg-main': '#F9FAFB',
        '--color-bg-shell': '#FFFFFF',
        '--color-bg-panel': '#F3F4F6',
        '--color-bg-input': '#FFFFFF',
        '--color-bg-input-light': '#E5E7EB',
        '--color-text-base': '#374151',
        '--color-text-header': '#111827',
        '--color-text-muted': '#6B7280',
        '--color-text-placeholder': '#9CA3AF',
        '--color-text-timer': '#111827',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '0, 128, 0', /* Verde */
        '--color-break-long': '0, 0, 255', /* Azul */
    },
    riograndedonorte_light: {
        name: 'Rio Grande do Norte',
        '--color-primary-rgb': '255, 221, 0', /* Amarelo da bandeira RN */
        '--color-primary-focus-rgb': '230, 199, 0',
        '--color-primary-darker-rgb': '200, 170, 0',
        '--color-primary-light-rgb': '255, 235, 77',
        '--color-bg-main': '#F9FAFB',
        '--color-bg-shell': '#FFFFFF',
        '--color-bg-panel': '#F3F4F6',
        '--color-bg-input': '#FFFFFF',
        '--color-bg-input-light': '#E5E7EB',
        '--color-text-base': '#374151',
        '--color-text-header': '#111827',
        '--color-text-muted': '#6B7280',
        '--color-text-placeholder': '#9CA3AF',
        '--color-text-timer': '#111827',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '0, 128, 0', /* Verde */
        '--color-break-long': '255, 0, 0', /* Vermelho */
    },
    sergipe_dark: {
        name: 'Sergipe Escuro',
        '--color-primary-rgb': '0, 128, 0', /* Verde da bandeira SE */
        '--color-primary-focus-rgb': '0, 100, 0',
        '--color-primary-darker-rgb': '0, 70, 0',
        '--color-primary-light-rgb': '50, 180, 50',
        '--color-bg-main': 'radial-gradient(circle at center, #1a202c 0%, #000000 70%)',
        '--color-bg-shell': '#1F2937',
        '--color-bg-panel': '#111827',
        '--color-bg-input': '#374151',
        '--color-bg-input-light': '#4B5563',
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '255, 255, 0', /* Amarelo */
        '--color-break-long': '0, 0, 255', /* Azul */
    },

    // Região Norte
    acre_dark: {
        name: 'Acre Escuro',
        '--color-primary-rgb': '0, 128, 0', /* Verde da bandeira AC */
        '--color-primary-focus-rgb': '0, 100, 0',
        '--color-primary-darker-rgb': '0, 70, 0',
        '--color-primary-light-rgb': '50, 180, 50',
        '--color-bg-main': 'radial-gradient(circle at center, #1a202c 0%, #000000 70%)',
        '--color-bg-shell': '#1F2937',
        '--color-bg-panel': '#111827',
        '--color-bg-input': '#374151',
        '--color-bg-input-light': '#4B5563',
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '255, 255, 0', /* Amarelo */
        '--color-break-long': '255, 0, 0', /* Vermelho */
    },
    amapa_dark: {
        name: 'Amapá Escuro',
        '--color-primary-rgb': '255, 204, 0', /* Amarelo da bandeira AP */
        '--color-primary-focus-rgb': '230, 180, 0',
        '--color-primary-darker-rgb': '200, 150, 0',
        '--color-primary-light-rgb': '255, 220, 70',
        '--color-bg-main': 'radial-gradient(circle at center, #1a1a1a 0%, #000000 70%)',
        '--color-bg-shell': '#111111',
        '--color-bg-panel': '#000000',
        '--color-bg-input': '#222222',
        '--color-bg-input-light': '#333333',
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '0, 0, 139', /* Azul Marinho */
        '--color-break-long': '0, 128, 0', /* Verde */
    },
    amazonas_light: {
        name: 'Amazonas',
        '--color-primary-rgb': '0, 0, 139', /* Azul Marinho da bandeira AM */
        '--color-primary-focus-rgb': '0, 0, 115',
        '--color-primary-darker-rgb': '0, 0, 90',
        '--color-primary-light-rgb': '50, 50, 180',
        '--color-bg-main': '#F9FAFB',
        '--color-bg-shell': '#FFFFFF',
        '--color-bg-panel': '#F3F4F6',
        '--color-bg-input': '#FFFFFF',
        '--color-bg-input-light': '#E5E7EB',
        '--color-text-base': '#374151',
        '--color-text-header': '#111827',
        '--color-text-muted': '#6B7280',
        '--color-text-placeholder': '#9CA3AF',
        '--color-text-timer': '#111827',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '255, 0, 0', /* Vermelho */
        '--color-break-long': '255, 255, 255', /* Branco */
    },
    para_dark: {
        name: 'Pará Escuro',
        '--color-primary-rgb': '220, 20, 60', /* Vermelho da bandeira PA */
        '--color-primary-focus-rgb': '170, 14, 38',
        '--color-primary-darker-rgb': '140, 10, 30',
        '--color-primary-light-rgb': '240, 50, 90',
        '--color-bg-main': 'radial-gradient(circle at center, #1a202c 0%, #000000 70%)',
        '--color-bg-shell': '#1F2937',
        '--color-bg-panel': '#111827',
        '--color-bg-input': '#374151',
        '--color-bg-input-light': '#4B5563',
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '255, 255, 255', /* Branco */
        '--color-break-long': '0, 0, 139', /* Azul Marinho */
    },
    rondonia_dark: {
        name: 'Rondônia Escuro',
        '--color-primary-rgb': '0, 128, 0', /* Verde da bandeira RO */
        '--color-primary-focus-rgb': '0, 100, 0',
        '--color-primary-darker-rgb': '0, 70, 0',
        '--color-primary-light-rgb': '50, 180, 50',
        '--color-bg-main': 'radial-gradient(circle at center, #1a202c 0%, #000000 70%)',
        '--color-bg-shell': '#1F2937',
        '--color-bg-panel': '#111827',
        '--color-bg-input': '#374151',
        '--color-bg-input-light': '#4B5563',
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '255, 255, 0', /* Amarelo */
        '--color-break-long': '0, 0, 139', /* Azul Marinho */
    },
    roraima_light: {
        name: 'Roraima',
        '--color-primary-rgb': '255, 204, 0', /* Amarelo da bandeira RR */
        '--color-primary-focus-rgb': '230, 180, 0',
        '--color-primary-darker-rgb': '200, 150, 0',
        '--color-primary-light-rgb': '255, 220, 70',
        '--color-bg-main': '#F9FAFB',
        '--color-bg-shell': '#FFFFFF',
        '--color-bg-panel': '#F3F4F6',
        '--color-bg-input': '#FFFFFF',
        '--color-bg-input-light': '#E5E7EB',
        '--color-text-base': '#374151',
        '--color-text-header': '#111827',
        '--color-text-muted': '#6B7280',
        '--color-text-placeholder': '#9CA3AF',
        '--color-text-timer': '#111827',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '0, 0, 255', /* Azul */
        '--color-break-long': '255, 0, 0', /* Vermelho */
    },
    tocantins_light: {
        name: 'Tocantins',
        '--color-primary-rgb': '255, 221, 0', /* Amarelo da bandeira TO */
        '--color-primary-focus-rgb': '230, 199, 0',
        '--color-primary-darker-rgb': '200, 170, 0',
        '--color-primary-light-rgb': '255, 235, 77',
        '--color-bg-main': '#F0F8FF',
        '--color-bg-shell': '#FFFFFF',
        '--color-bg-panel': '#F8F8FF',
        '--color-bg-input': '#E8F0F8',
        '--color-bg-input-light': '#DCE6F0',
        '--color-text-base': '#333333',
        '--color-text-header': '#000000',
        '--color-text-muted': '#666666',
        '--color-text-placeholder': '#AAAAAA',
        '--color-text-timer': '#000000',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '0, 0, 139', /* Azul Marinho */
        '--color-break-long': '255, 255, 255', /* Branco */
    },

    // Região Sul
    parana_dark: {
        name: 'Paraná Escuro',
        '--color-primary-rgb': '0, 0, 205', /* Azul da bandeira PR */
        '--color-primary-focus-rgb': '0, 0, 180',
        '--color-primary-darker-rgb': '0, 0, 150',
        '--color-primary-light-rgb': '50, 50, 255',
        '--color-bg-main': 'radial-gradient(circle at center, #1a202c 0%, #000000 70%)',
        '--color-bg-shell': '#1F2937',
        '--color-bg-panel': '#111827',
        '--color-bg-input': '#374151',
        '--color-bg-input-light': '#4B5563',
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '255, 255, 255', /* Branco */
        '--color-break-long': '0, 128, 0', /* Verde */
    },
    riograndedosul_dark: {
        name: 'Rio Grande do Sul Escuro',
        '--color-primary-rgb': '200, 16, 46', /* Vermelho da bandeira RS */
        '--color-primary-focus-rgb': '170, 14, 38',
        '--color-primary-darker-rgb': '140, 10, 30',
        '--color-primary-light-rgb': '220, 40, 70',
        '--color-bg-main': 'radial-gradient(circle at center, #1a1a1a 0%, #000000 70%)',
        '--color-bg-shell': '#111111',
        '--color-bg-panel': '#000000',
        '--color-bg-input': '#222222',
        '--color-bg-input-light': '#333333',
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '0, 128, 0', /* Verde */
        '--color-break-long': '255, 255, 0', /* Amarelo */
    },
    santacatarina_light: {
        name: 'Santa Catarina',
        '--color-primary-rgb': '220, 20, 60', /* Vermelho da bandeira SC */
        '--color-primary-focus-rgb': '170, 14, 38',
        '--color-primary-darker-rgb': '140, 10, 30',
        '--color-primary-light-rgb': '240, 50, 90',
        '--color-bg-main': '#F0F8FF',
        '--color-bg-shell': '#FFFFFF',
        '--color-bg-panel': '#F8F8FF',
        '--color-bg-input': '#E8F0F8',
        '--color-bg-input-light': '#DCE6F0',
        '--color-text-base': '#333333',
        '--color-text-header': '#000000',
        '--color-text-muted': '#666666',
        '--color-text-placeholder': '#AAAAAA',
        '--color-text-timer': '#000000',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '255, 255, 255', /* Branco */
        '--color-break-long': '0, 0, 139', /* Azul Marinho */
    },

    // Região Centro-Oeste
    goias_light: {
        name: 'Goiás',
        '--color-primary-rgb': '255, 255, 0', /* Amarelo da bandeira GO */
        '--color-primary-focus-rgb': '230, 230, 0',
        '--color-primary-darker-rgb': '200, 200, 0',
        '--color-primary-light-rgb': '255, 255, 77',
        '--color-bg-main': '#F9FAFB',
        '--color-bg-shell': '#FFFFFF',
        '--color-bg-panel': '#F3F4F6',
        '--color-bg-input': '#FFFFFF',
        '--color-bg-input-light': '#E5E7EB',
        '--color-text-base': '#374151',
        '--color-text-header': '#111827',
        '--color-text-muted': '#6B7280',
        '--color-text-placeholder': '#9CA3AF',
        '--color-text-timer': '#111827',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '0, 128, 0', /* Verde */
        '--color-break-long': '255, 255, 255', /* Branco */
    },
    matogrosso_dark: {
        name: 'Mato Grosso Escuro',
        '--color-primary-rgb': '255, 204, 0', /* Amarelo da bandeira MT */
        '--color-primary-focus-rgb': '230, 180, 0',
        '--color-primary-darker-rgb': '200, 150, 0',
        '--color-primary-light-rgb': '255, 220, 70',
        '--color-bg-main': 'radial-gradient(circle at center, #1a202c 0%, #000000 70%)',
        '--color-bg-shell': '#1F2937',
        '--color-bg-panel': '#111827',
        '--color-bg-input': '#374151',
        '--color-bg-input-light': '#4B5563',
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '0, 128, 0', /* Verde */
        '--color-break-long': '0, 0, 139', /* Azul Marinho */
    },
    matogrossodosul_light: {
        name: 'Mato Grosso do Sul',
        '--color-primary-rgb': '0, 0, 139', /* Azul Marinho da bandeira MS */
        '--color-primary-focus-rgb': '0, 0, 115',
        '--color-primary-darker-rgb': '0, 0, 90',
        '--color-primary-light-rgb': '50, 50, 180',
        '--color-bg-main': '#F0F8FF',
        '--color-bg-shell': '#FFFFFF',
        '--color-bg-panel': '#F8F8FF',
        '--color-bg-input': '#E8F0F8',
        '--color-bg-input-light': '#DCE6F0',
        '--color-text-base': '#333333',
        '--color-text-header': '#000000',
        '--color-text-muted': '#666666',
        '--color-text-placeholder': '#AAAAAA',
        '--color-text-timer': '#000000',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '0, 128, 0', /* Verde */
        '--color-break-long': '255, 255, 255', /* Branco */
    },
    distritofederal_dark: {
        name: 'Distrito Federal Escuro',
        '--color-primary-rgb': '0, 128, 0', /* Verde da bandeira DF */
        '--color-primary-focus-rgb': '0, 100, 0',
        '--color-primary-darker-rgb': '0, 70, 0',
        '--color-primary-light-rgb': '50, 180, 50',
        '--color-bg-main': 'radial-gradient(circle at center, #1a202c 0%, #000000 70%)',
        '--color-bg-shell': '#1F2937',
        '--color-bg-panel': '#111827',
        '--color-bg-input': '#374151',
        '--color-bg-input-light': '#4B5563',
        '--color-text-base': '#D1D5DB',
        '--color-text-header': '#FFFFFF',
        '--color-text-muted': '#9CA3AF',
        '--color-text-placeholder': '#6B7280',
        '--color-text-timer': '#FFFFFF',
        '--color-border-subtle-rgb': '255, 255, 255',
        '--color-break-short': '255, 255, 0', /* Amarelo */
        '--color-break-long': '255, 255, 255', /* Branco */
    },

    // Espírito Santo (ES) - Adicionado
    espiritosanto_light: {
        name: 'Espírito Santo',
        '--color-primary-rgb': '255, 105, 180', /* Rosa da bandeira ES */
        '--color-primary-focus-rgb': '230, 80, 150',
        '--color-primary-darker-rgb': '200, 60, 120',
        '--color-primary-light-rgb': '255, 130, 200',
        '--color-bg-main': '#F0F8FF',
        '--color-bg-shell': '#FFFFFF',
        '--color-bg-panel': '#F8F8FF',
        '--color-bg-input': '#E8F0F8',
        '--color-bg-input-light': '#DCE6F0',
        '--color-text-base': '#333333',
        '--color-text-header': '#000000',
        '--color-text-muted': '#666666',
        '--color-text-placeholder': '#AAAAAA',
        '--color-text-timer': '#000000',
        '--color-border-subtle-rgb': '0, 0, 0',
        '--color-break-short': '255, 255, 255', /* Branco */
        '--color-break-long': '0, 0, 255', /* Azul */
    },
};
