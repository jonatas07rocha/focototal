// shop.js

/**
 * Nova Estrutura de Coleções:
 * A loja agora é um objeto onde cada chave é o ID de uma coleção.
 * Cada coleção tem um nome, uma descrição e uma lista de itens.
 * Itens sazonais estão agrupados em sua própria coleção.
 */

export const shopCollections = {
    // --- COLEÇÕES FIXAS ---
    NATUREZA: {
        name: 'Coleção Paisagens Brasileiras',
        description: 'Temas inspirados na beleza natural do Brasil.',
        items: {
            FLORESTA_AMAZONICA: {
                id: 'FLORESTA_AMAZONICA',
                name: 'Tema Floresta Amazônica',
                price: 350,
                type: 'theme',
                themeId: 'natureza_floresta'
            },
            CERRADO_SUNSET: {
                id: 'CERRADO_SUNSET',
                name: 'Tema Cerrado ao Entardecer',
                price: 300,
                type: 'theme',
                themeId: 'natureza_cerrado'
            },
            PRAIAS_NORDESTE: {
                id: 'PRAIAS_NORDESTE',
                name: 'Tema Praias do Nordeste',
                price: 350,
                type: 'theme',
                themeId: 'natureza_praias'
            },
            PANTANAL: {
                id: 'PANTANAL',
                name: 'Tema Pantanal',
                price: 300,
                type: 'theme',
                themeId: 'natureza_pantanal'
            },
        }
    },
    MINIMALIST: {
        name: 'Coleção Abstratos & Minimalistas',
        description: 'Temas limpos e suaves para máxima tranquilidade e foco.',
        items: {
            ZEN_LIGHT: {
                id: 'ZEN_LIGHT',
                name: 'Tema Zen (Claro)',
                price: 300,
                type: 'theme',
                themeId: 'zen_light'
            },
            ENERGIA_TOTAL: {
                id: 'ENERGIA_TOTAL',
                name: 'Tema Energia Total',
                price: 250,
                type: 'theme',
                themeId: 'abstrato_energia'
            },
            CEU_ESTRELADO: {
                id: 'CEU_ESTRELADO',
                name: 'Tema Céu Estrelado',
                price: 400,
                type: 'theme',
                themeId: 'abstrato_estrelas'
            },
            AQUARELA: {
                id: 'AQUARELA',
                name: 'Tema Aquarela',
                price: 350,
                type: 'theme',
                themeId: 'abstrato_aquarela'
            },
        }
    },
    TECH: {
        name: 'Coleção Tecnologia & Ficção Científica',
        description: 'Para uma imersão profunda em ambientes digitais e futuristas.',
        items: {
            MATRIX_DARK: {
                id: 'MATRIX_DARK',
                name: 'Tema Matrix (Escuro)',
                price: 350,
                type: 'theme',
                themeId: 'tech_matrix'
            },
            VAPORWAVE: {
                id: 'VAPORWAVE',
                name: 'Tema Vaporwave',
                price: 400,
                type: 'theme',
                themeId: 'tech_vaporwave'
            },
            HIGH_TECH: {
                id: 'HIGH_TECH',
                name: 'Tema Minimalista High-Tech',
                price: 300,
                type: 'theme',
                themeId: 'tech_hightech'
            },
            CYBERPUNK: {
                id: 'CYBERPUNK',
                name: 'Tema Cyberpunk',
                price: 450,
                type: 'theme',
                themeId: 'tech_cyberpunk'
            },
        }
    },

    // --- COLEÇÃO SAZONAL ---
    SEASONAL: {
        name: 'Coleção Sazonal',
        description: 'Itens exclusivos disponíveis apenas em épocas especiais do ano!',
        seasonal: true,
        items: {
            CARNAVAL: {
                id: 'CARNAVAL',
                name: 'Tema Carnaval',
                price: 500,
                type: 'theme',
                themeId: 'seasonal_carnaval',
                availability: 'Disponível em Fevereiro e Março.'
            },
            FESTA_JUNINA: {
                id: 'FESTA_JUNINA',
                name: 'Tema Festa Junina',
                price: 500,
                type: 'theme',
                themeId: 'seasonal_festa_junina',
                availability: 'Disponível em Junho e Julho.'
            },
            HALLOWEEN: {
                id: 'HALLOWEEN',
                name: 'Tema Halloween',
                price: 500,
                type: 'theme',
                themeId: 'seasonal_halloween',
                availability: 'Disponível em Outubro.'
            },
            NATAL: {
                id: 'NATAL',
                name: 'Tema Natalino',
                price: 500,
                type: 'theme',
                themeId: 'seasonal_natal',
                availability: 'Disponível em Dezembro.'
            }
        }
    }
};
