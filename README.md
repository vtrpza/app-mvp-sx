# SX Locações - Mobility Rental Platform MVP

🚲 **Plataforma de mobilidade urbana com sistema de gamificação Ponto X integrado**

Uma aplicação web progressiva (PWA) moderna para aluguel de patinetes, bikes e veículos recreativos com sistema completo de gamificação e painel administrativo.

## 🌟 Funcionalidades Principais

### 🎯 Para Usuários
- **Aluguel de Veículos**: Scooters e bikes disponíveis na cidade
- **Sistema Ponto X**: Gamificação completa com pontos, níveis e recompensas
- **Dashboard Pessoal**: Acompanhe seus pontos, conquistas e progresso
- **Check-in em Pontos Turísticos**: Ganhe pontos visitando locais incríveis
- **Sistema de Níveis**: Bronze, Silver, Gold, Platinum, Diamond
- **Conquistas**: 8 tipos diferentes de achievements para desbloquear
- **Recompensas**: Sistema de resgate com descontos e benefícios

### 🛠️ Para Administradores
- **Dashboard Completo**: Visão geral do sistema e estatísticas
- **Gestão de Usuários**: Visualize, filtre e gerencie todos os usuários
- **Sistema de Pontos**: Configure pontos por ação e níveis
- **Pontos Turísticos**: CRUD completo com upload de imagens
- **Controle de Gamificação**: Ajuste manual de pontos e níveis

## 🚀 Deploy na Vercel

### Pré-requisitos
- Conta na [Vercel](https://vercel.com)
- Repositório no GitHub/GitLab

### Deploy Automático
1. **Conecte seu repositório na Vercel**:
   ```bash
   # Via Vercel CLI (opcional)
   npm i -g vercel
   vercel
   ```

2. **Configure as variáveis de ambiente** (opcional para MVP):
   ```bash
   NEXT_PUBLIC_APP_URL=https://sua-app.vercel.app
   NEXT_PUBLIC_APP_NAME="SX Locações"
   ```

3. **Deploy automático**: O projeto está configurado para deploy automático!

### Configuração Personalizada
O projeto já inclui:
- ✅ `vercel.json` configurado
- ✅ `next.config.js` otimizado
- ✅ Headers de segurança
- ✅ Redirects automáticos
- ✅ Otimizações de build
- ✅ Error boundaries
- ✅ Páginas de erro personalizadas

## 🏗️ Arquitetura Técnica

### Stack Tecnológica
- **Framework**: Next.js 15.4.1 (App Router)
- **Frontend**: React 18.3.1 + TypeScript 5.8.3
- **Styling**: Tailwind CSS 4.1.11
- **Icons**: Lucide React
- **Estado**: localStorage (MVP) → Supabase (produção)

### Estrutura do Projeto
```
app-mvp-sx/
├── app/                     # Pages (App Router)
│   ├── admin/              # Dashboard administrativo
│   ├── dashboard/          # Dashboard do usuário
│   ├── error.tsx           # Página de erro global
│   ├── loading.tsx         # Loading global
│   └── not-found.tsx       # 404 personalizado
├── components/             # Componentes React
├── lib/                    # Utilitários e mock database
├── scripts/               # Scripts de inicialização
├── vercel.json            # Configuração Vercel
└── next.config.js         # Configuração Next.js
```

## 📊 Sistema de Gamificação

### Níveis e Pontos
- **Bronze**: 0 pontos
- **Silver**: 500 pontos  
- **Gold**: 1.500 pontos
- **Platinum**: 3.000 pontos
- **Diamond**: 10.000 pontos

### Ações que Geram Pontos
- **Cadastro**: 100 pontos
- **Check-in**: 50 pontos
- **Aluguel**: 10 pontos
- **Indicação**: 200 pontos
- **Avaliação**: 25 pontos
- **Streak Diário**: 30 pontos
- **Conquista**: 100 pontos

### Conquistas Disponíveis
1. 🚲 **Primeiro Aluguel** (50 pts)
2. 🗺️ **Explorador** - 5 check-ins diferentes (100 pts)
3. 👥 **Social** - 3 indicações (150 pts)
4. 🔥 **Streak Master** - 7 dias consecutivos (200 pts)
5. 🌱 **Eco Warrior** - 20 aluguéis (250 pts)
6. ⭐ **Avaliador Expert** - 10 avaliações (100 pts)
7. 🦉 **Coruja Noturna** - Aluguel noturno (75 pts)
8. 📅 **Guerreiro do Fim de Semana** - Aluguéis em fins de semana (180 pts)

## 🧪 Testando a Aplicação

### 1. Dados Mock
Execute no console do browser:
```javascript
// O arquivo scripts/init-mock-data.js inicializa dados de teste
// 5 usuários, conquistas, pontos turísticos, transações
```

### 2. Fluxos de Teste

#### Usuário Final
1. Acesse `/` - página inicial
2. Clique "Alugar" → escolha entre registro/WhatsApp
3. Registre-se → ganhe 100 pontos iniciais
4. Acesse `/dashboard` → explore todas as funcionalidades

#### Administrador
1. Acesse `/admin/login` 
2. Login: `admin` / Senha: `sx2024admin`
3. Explore: dashboard, usuários, pontos, pontos turísticos

### 3. Funcionalidades para Testar
- ✅ Sistema de pontos completo
- ✅ Mudança automática de níveis
- ✅ Conquistas e recompensas
- ✅ Leaderboard e ranking
- ✅ Upload de imagens (Base64)
- ✅ Filtros e busca
- ✅ Ajuste manual de pontos
- ✅ Interface responsiva

## 🛡️ Segurança e Performance

### Headers de Segurança
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### Otimizações
- **Bundle**: ~146KB por página
- **Images**: WebP/AVIF + lazy loading
- **CSS**: Tailwind purging + optimization
- **Caching**: Headers configurados
- **Compression**: Gzip habilitado

## 📱 PWA Features

- ✅ Manifest configurado
- ✅ Service Worker (futuro)
- ✅ Responsivo mobile-first
- ✅ Offline-ready (localStorage)

## 🔮 Roadmap de Produção

### Fase 1: MVP Atual ✅
- Sistema mock completo
- Interface responsiva
- Gamificação robusta
- Painel administrativo

### Fase 2: Backend Real
- Migração para Supabase
- API de pagamentos
- Geolocalização real
- Upload de arquivos

### Fase 3: Recursos Avançados
- Push notifications
- WhatsApp Business API
- Analytics avançado
- Multi-idioma

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

- **Email**: contato@sxlocadora.com.br
- **Website**: https://sxlocadora.com.br
- **GitHub**: https://github.com/sxlocadora

---

**Desenvolvido com ❤️ pela equipe SX Locadora**