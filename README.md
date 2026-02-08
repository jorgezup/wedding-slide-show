# Wedding Slide Show 💍

Slideshow de fotos em tempo real para casamento. Os convidados compartilham fotos via Google Drive e elas aparecem automaticamente no telão.

## Funcionalidades

- **Página Inicial**: Título "Eiva e Jorge 14/02/2026", QR Code para compartilhamento
- **Slideshow**: Exibição automática de fotos com transições suaves
- **Tempo Real**: Novas fotos aparecem automaticamente a cada 15 segundos
- **Google Drive**: Integração com pasta compartilhada do Google Drive

## Tecnologias

- [Next.js](https://nextjs.org/) com App Router
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [qrcode.react](https://github.com/zpao/qrcode.react) para geração de QR Code

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Preencha as variáveis:

- `GOOGLE_API_KEY`: Chave de API do Google (obtenha em [Google Cloud Console](https://console.cloud.google.com))
- `GOOGLE_DRIVE_FOLDER_ID`: ID da pasta compartilhada no Google Drive
- `NEXT_PUBLIC_GOOGLE_DRIVE_SHARE_URL`: URL pública da pasta para o QR Code

### 3. Configurar Google Drive

1. Crie uma pasta no Google Drive
2. Compartilhe a pasta com permissão para "Qualquer pessoa com o link pode editar"
3. Copie o ID da pasta (parte da URL após `/folders/`)
4. Ative a API do Google Drive no [Google Cloud Console](https://console.cloud.google.com)
5. Crie uma chave de API

### 4. Executar

```bash
npm run dev
```

Acesse:
- Página inicial: [http://localhost:3000](http://localhost:3000)
- Slideshow: [http://localhost:3000/slideshow](http://localhost:3000/slideshow)

## Modo Demo

Se as credenciais do Google Drive não estiverem configuradas, o app funciona em modo demo com fotos de exemplo.

## Build de Produção

```bash
npm run build
npm start
```

## Deploy na Vercel

Este projeto está otimizado para deploy na [Vercel](https://vercel.com).

### Passos para Deploy

1. **Conecte seu repositório** no Vercel
2. **Configure as variáveis de ambiente** no painel da Vercel:
   - `GOOGLE_API_KEY`
   - `GOOGLE_DRIVE_FOLDER_ID`
   - `NEXT_PUBLIC_GOOGLE_DRIVE_SHARE_URL`

3. **Importante**: Certifique-se de que o Framework Preset está configurado como "Next.js" nas configurações do projeto
   - Vá em Project Settings > General > Framework Preset
   - Selecione "Next.js"
   - **NÃO configure um Output Directory customizado** - deixe em branco
   - A Vercel detecta automaticamente a saída do Next.js

### Solução de Problemas

#### Erro: "No Output Directory named 'public' found"

Se você receber este erro:

1. Verifique nas configurações do projeto na Vercel (Project Settings > General)
2. Confirme que "Framework Preset" está definido como "Next.js"
3. Verifique se "Output Directory" está vazio ou não definido
4. Para projetos Next.js com SSR e API routes (como este), a Vercel gerencia automaticamente a saída - não é necessário configurar manualmente

O erro geralmente ocorre quando o projeto está configurado incorretamente como um site estático ao invés de uma aplicação Next.js.

#### Erro 404 nas Páginas Após Deploy Bem-Sucedido

Se o deploy foi concluído com sucesso, mas você está recebendo erro 404 ao acessar `/` ou `/slideshow`:

1. **Verifique as Configurações do Projeto na Vercel:**
   - Acesse seu projeto na Vercel → Settings → General
   - Confirme que **"Framework Preset"** está definido como **"Next.js"** (não "Other" ou "Vite")
   - Verifique se **"Root Directory"** está vazio ou definido como `.` (raiz do projeto)
   - Confirme que **"Output Directory"** está vazio (Vercel gerencia automaticamente para Next.js)

2. **Force um Novo Deploy:**
   - Após corrigir as configurações, faça um novo commit (pode ser vazio):
     ```bash
     git commit --allow-empty -m "Trigger redeploy"
     git push
     ```
   - Ou use o botão "Redeploy" no painel da Vercel

3. **Verifique os Logs de Build:**
   - Na aba "Deployments", clique no deploy mais recente
   - Verifique se o build mostra as rotas corretamente:
     ```
     Route (app)
     ┌ ○ /
     ├ ƒ /api/photos
     └ ○ /slideshow
     ```

4. **Limpe o Cache:**
   - Às vezes o cache da Vercel pode causar problemas
   - Vá em Settings → General → Clear Build Cache
   - Faça um novo deploy

**Causa Comum:** Este erro geralmente ocorre quando o projeto foi inicialmente configurado com o framework preset incorreto. A solução é garantir que a Vercel reconheça o projeto como uma aplicação Next.js, não como um site estático genérico.
