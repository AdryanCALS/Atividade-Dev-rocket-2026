# 0002: Adoção do Design System e Paleta Light da Visagio

## Contexto
O projeto foi inicialmente concebido com um visual escuro (dark mode) inspirado na estética original de catálogos como o Letterboxd. No entanto, por se tratar de uma aplicação desenvolvida no contexto do RocketLab da **Visagio**, definiu-se alinhar a identidade visual do sistema à marca institucional da empresa e de sua unidade de tecnologia **v(dev)** (acessível em `https://www.v-dev.io/`).

## Decisão
Decidimos migrar toda a interface da aplicação para uma paleta clara (*light mode*) estruturada sobre as cores características da Visagio:

1. **Fundo Principal (Canvas)**: `#F4F4F4` (branco suave/off-white característico, proporcionando conforto visual e contraste moderno).
2. **Tipografia e Contraste Máximo**: `#0F0E0E` (preto profundo para títulos, corpo de texto, rótulos e elementos estruturais de alto contraste).
3. **Cor de Destaque e Ação Primária (Highlight / Accent)**: `#FFD45A` (Amarelo Visagio utilizado em botões de ação primária, seleção de gêneros, estrelas de avaliação, anéis de foco e badges de destaque).
4. **Superfícies de Conteúdo (Cards, Heros e Modais)**: `#FFFFFF` (branco puro com bordas neutras sutis `#E5E5E5` e sombras suaves para garantir hierarquia de profundidade limpa).
5. **Acessibilidade e WCAG**: Em botões e elementos preenchidos com o Amarelo Visagio (`#FFD45A`), o texto é sempre fixado em preto `#0F0E0E` com peso semibold/bold, garantindo conformidade estrita com os critérios de contraste da WCAG AAA (>10:1).
6. **Ações Destrutivas e Alertas**: Permanecem utilizando a cor semântica vermelha (`rose`), adaptada para fundos claros (`bg-rose-50`, `border-rose-200`, `text-rose-700`).

## Consequências
- A experiência de navegação passa a ter um padrão corporativo limpo, editorial e coeso com o ecossistema Visagio/v(dev).
- Todos os componentes compartilham tokens semânticos centralizados no `tailwind.config.js` e em variáveis no `index.css`.
- Elimina-se a sobrecarga visual do dark mode genérico, destacando o catálogo de pôsteres e avaliações dos filmes.
