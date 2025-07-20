# SX Locadora - Mobile First PWA

Uma aplicação web progressiva (PWA) moderna para aluguel de patinetes, bikes e veículos recreativos com funcionalidades avançadas de mobilidade urbana sustentável.

## 🚀 Funcionalidades

### ✅ Implementadas

1. **Cadastro Inteligente**
   - Upload de documentos com validação
   - Análise automatizada + validação manual
   - Aprovação automática para clientes recorrentes

2. **Contrato Digital**
   - Assinatura eletrônica válida
   - Registro de IP, geolocalização e timestamp
   - Botão "Li e autorizo" com consentimento jurídico

3. **Programa de Fidelidade "Ponto X"**
   - Acúmulo de pontos por uso e indicações
   - Sistema de níveis (Bronze, Silver, Gold, Platinum)
   - Troca por benefícios reais (descontos, gratuidades)

4. **Geolocalização em Tempo Real**
   - Localização de patinetes e veículos ativos
   - Notificações em áreas restritas
   - Rastreamento de clientes durante o aluguel

5. **Marketplace Integrado**
   - Aluguel de bikes, jet ski, lanchas e outros veículos
   - Controle de requisitos legais (CNH Náutica, etc.)
   - Sistema de categorias e filtros

6. **Guia Turístico Digital**
   - Localização de pontos turísticos
   - Cálculo de melhor trajeto (custo vs tempo)
   - Sugestões de modal mais barato e sustentável

7. **Check-in Social e Gamificação**
   - Sistema de ranking e desafios
   - Badges e conquistas
   - Engajamento com pontos turísticos locais

8. **Anfitrião Local Conectado**
   - Chat seguro integrado
   - Canal direto entre usuário e anfitrião
   - Suporte local especializado

## 🛠 Tecnologias

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **PWA**: Service Worker, Web App Manifest
- **Icons**: Lucide React
- **Deployment**: Vercel Ready

## 🎨 Design System

### Cores da Marca
- **Verde Principal**: #05a658
- **Verde Claro**: #82c5a1
- **Cinza**: #d1cfc2
- **Preto**: #000000

### Fontes
- **Principal**: Inter (Google Fonts)
- **Fallback**: System UI, Sans-serif

## 📱 PWA Features

- ✅ Service Worker para cache offline
- ✅ Web App Manifest configurado
- ✅ Instalação como app nativo
- ✅ Ícones e splash screens
- ✅ Shortcuts para funcionalidades principais

## 🔧 Instalação e Uso

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd app-mvp-sx

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.local.example .env.local
# Edite o arquivo .env.local com suas credenciais

# Execute em modo de desenvolvimento
npm run dev

# Acesse http://localhost:3000
```

### Scripts Disponíveis
```bash
npm run dev      # Modo desenvolvimento
npm run build    # Build para produção
npm run start    # Servidor de produção
npm run lint     # Linter ESLint
```

## 🔐 Configuração do Ambiente

### Variáveis de Ambiente (.env.local)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google Maps (opcional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key

# Outros serviços...
```

## 🗄 Estrutura do Banco de Dados

### Tabelas Principais
- `users` - Usuários e perfis
- `vehicles` - Veículos disponíveis
- `rentals` - Aluguéis ativos e histórico
- `contracts` - Contratos digitais
- `documents` - Documentos de usuários
- `achievements` - Sistema de gamificação
- `tourist_attractions` - Pontos turísticos
- `chat_messages` - Mensagens com anfitriões

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Instale a CLI da Vercel
npm i -g vercel

# Execute o deploy
vercel

# Configure as variáveis de ambiente no dashboard
```

### Outras Plataformas
- Netlify
- Railway
- Heroku
- AWS Amplify

## 📊 Funcionalidades Mockadas

Durante o desenvolvimento, as seguintes funcionalidades estão mockadas:

- ✅ Autenticação de usuários
- ✅ Upload de documentos
- ✅ Geolocalização
- ✅ Pagamentos
- ✅ Notificações push
- ✅ Chat em tempo real
- ✅ Análise de documentos

## 🔄 Próximos Passos

### Para Produção
1. Configurar Supabase com schema real
2. Implementar autenticação real
3. Integrar com gateway de pagamento
4. Configurar mapas (Google Maps/OpenStreetMap)
5. Implementar upload de arquivos (Cloudinary)
6. Configurar notificações push
7. Implementar chat em tempo real
8. Adicionar analytics (Google Analytics)

### Melhorias Futuras
- Modo offline completo
- Sincronização em background
- Notificações push avançadas
- Análise de comportamento do usuário
- A/B testing
- Multilinguagem

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