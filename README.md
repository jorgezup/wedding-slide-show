# Wedding Slide Show 💍

Slideshow de fotos em tempo real para casamento. Os convidados compartilham fotos via Google Drive e elas aparecem automaticamente no telão.

## Funcionalidades

- **Página Inicial**: Título "Eiva e Jorge 14/02/2026", QR Code para compartilhamento
- **QR Code**: Acesso direto à pasta compartilhada do Google Drive para upload de fotos pelos convidados
- **Slideshow**: Exibição automática de fotos com transições suaves
- **Tempo Real**: Novas fotos aparecem automaticamente a cada 15 segundos
- **Google Drive**: Integração com pasta compartilhada do Google Drive

## Tecnologias

- [Next.js](https://nextjs.org/) com App Router
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [qrcode.react](https://github.com/zpao/qrcode.react) para geração de QR Code

## ❓ FAQ - Perguntas Frequentes

### Onde devo configurar os IDs do Google Drive e do Projeto?

**Resposta: Na VERCEL, não no código!**

As variáveis de ambiente (API Key, Folder ID, Service Account, etc.) devem ser configuradas diretamente nas **Environment Variables** do seu projeto na Vercel:

1. Acesse seu projeto na Vercel
2. Vá em **Settings → Environment Variables**
3. Adicione as variáveis necessárias (veja seção "Deploy na Vercel" abaixo)
4. Faça um novo deploy

**⚠️ NUNCA adicione as chaves diretamente no código!** Isso é:
- ❌ Inseguro (suas chaves ficariam públicas no GitHub)
- ❌ Inflexível (não pode ter valores diferentes para dev/prod)
- ✅ Use sempre variáveis de ambiente na Vercel

### Já tenho o ID da pasta e do projeto Google Cloud, e agora?

Se você tem:
- **Folder ID:** Como `1ceDM-gzlKY2lFqqnoCL1M5L0lM-UuB7S` (exemplo)
- **Project ID:** Como `wedding-site-468321` (exemplo)

Siga estes passos:

1. **Obtenha a API Key:**
   - Acesse https://console.cloud.google.com
   - Selecione seu projeto (ex: `seu-projeto-id`)
   - Vá em "APIs & Services" → "Credentials"
   - Crie uma API Key e restrinja para Google Drive API

2. **Configure na Vercel:**
   - Vá em seu projeto → Settings → Environment Variables
   - Adicione:
     ```
     GOOGLE_API_KEY=sua_chave_gerada
     GOOGLE_DRIVE_FOLDER_ID=seu_folder_id_aqui
     NEXT_PUBLIC_GOOGLE_DRIVE_SHARE_URL=https://drive.google.com/drive/folders/seu_folder_id_aqui
     ```

3. **Redeploy:**
   - Faça um novo deploy ou use "Redeploy" na Vercel

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

#### Configuração de Permissões do Google Drive

**IMPORTANTE:** Configure sua pasta do Google Drive com permissão **"Qualquer pessoa com o link pode EDITAR"**

- ✅ A **API Key** é usada pelo slideshow para **LER** as fotos (funciona independente da permissão)
- ✅ O **link compartilhado** é usado pelos convidados para **ENVIAR** fotos via QR Code (precisa de permissão de Editor)

**Dica de Segurança:**
- Durante o evento: Use permissão "Editor" para permitir uploads
- Após o evento: Mude para "Visualizador" para proteger as fotos

#### Passos para Configurar:

#### Passos para Configurar:

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

#### 1. Conecte seu repositório no Vercel

Faça login na Vercel e importe seu repositório GitHub.

#### 2. Configure as Variáveis de Ambiente

⚠️ **IMPORTANTE:** As variáveis de ambiente devem ser configuradas **NA VERCEL**, não no código!

Vá em **Project Settings → Environment Variables** e adicione:

##### Exemplo de Configuração:

**Variáveis de Ambiente Necessárias:**
```
GOOGLE_API_KEY=sua_chave_api_aqui
GOOGLE_DRIVE_FOLDER_ID=seu_folder_id_aqui
NEXT_PUBLIC_GOOGLE_DRIVE_SHARE_URL=https://drive.google.com/drive/folders/seu_folder_id_aqui
```

**Como obter cada valor:**

**a) `GOOGLE_API_KEY`** - Chave de API do Google Cloud:
1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Selecione seu projeto (ex: `seu-projeto-google-cloud`)
3. Vá em "APIs & Services" → "Credentials"
4. Clique em "Create Credentials" → "API Key"
5. **Importante:** Restrinja a chave para usar apenas a "Google Drive API"
6. Copie a chave gerada e cole na Vercel como valor de `GOOGLE_API_KEY`

**b) `GOOGLE_DRIVE_FOLDER_ID`** - ID da pasta compartilhada:
1. Abra a pasta no Google Drive
2. Copie o ID da URL: `https://drive.google.com/drive/folders/SEU_ID_AQUI`
3. Exemplo: Se a URL é `.../folders/1ABC-xyz...`, o ID é `1ABC-xyz...`
4. Cole este ID na Vercel como valor de `GOOGLE_DRIVE_FOLDER_ID`

**c) `NEXT_PUBLIC_GOOGLE_DRIVE_SHARE_URL`** - URL completa da pasta:
1. Use a URL completa da pasta: `https://drive.google.com/drive/folders/SEU_ID_AQUI`
2. Esta URL será usada no QR Code para os convidados compartilharem fotos
3. Cole a URL completa na Vercel como valor de `NEXT_PUBLIC_GOOGLE_DRIVE_SHARE_URL`

**⚠️ Lembre-se:**
- Configure estas variáveis em **Production**, **Preview** e **Development** na Vercel
- NÃO adicione estas variáveis diretamente no código ou no repositório Git
- Após configurar, faça um novo deploy para aplicar as mudanças

#### 3. Configurar Google Drive API

1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Selecione ou crie um projeto (ex: `wedding-site-468321`)
3. Vá em "APIs & Services" → "Library"
4. Procure por "Google Drive API" e clique em "Enable"
5. Configure as permissões da pasta do Drive:
   - Abra a pasta no Google Drive
   - Clique em "Share" (Compartilhar)
   - Configure para "Anyone with the link can view" (Qualquer pessoa com o link pode visualizar)
   - Para que os convidados possam fazer upload, use "Anyone with the link can edit" (Qualquer pessoa com o link pode editar)

#### 4. Verificar Framework Preset

**Importante**: Certifique-se de que o Framework Preset está configurado como "Next.js" nas configurações do projeto:
- Vá em Project Settings > General > Framework Preset
- Selecione "Next.js"
- **NÃO configure um Output Directory customizado** - deixe em branco
- A Vercel detecta automaticamente a saída do Next.js

#### 5. Deploy

Após configurar as variáveis de ambiente:
1. Clique em "Deploy" ou faça push para seu repositório
2. Aguarde o build completar
3. Acesse seu site e verifique se as fotos aparecem corretamente


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

#### Erro 400 do Google Drive API

Se você está recebendo erro 400 ao tentar carregar fotos do Google Drive:

**Sintomas:**
- Console mostra: `Error fetching photos from Google Drive: Error: Google Drive API error: 400`
- Fotos não aparecem no slideshow
- Modo demo é ativado automaticamente

**Solução:**

Este erro foi corrigido na versão mais recente do código. Certifique-se de:

1. **Usar a versão mais recente do código:**
   - O código agora inclui o parâmetro `corpora=user` necessário para a API
   - Faça um novo deploy com a versão atualizada

2. **Verificar suas variáveis de ambiente:**
   - Confirme que `GOOGLE_API_KEY` está configurada corretamente
   - Verifique se `GOOGLE_DRIVE_FOLDER_ID` é o ID correto da pasta
   - Teste se a API Key tem permissões para acessar a Google Drive API

3. **Verificar permissões da API:**
   - Acesse o [Google Cloud Console](https://console.cloud.google.com)
   - Vá em "APIs & Services" → "Library"
   - Confirme que "Google Drive API" está **habilitada**
   - Vá em "Credentials" e verifique se sua API Key está **ativa**

4. **Verificar permissões da pasta:**
   - Abra a pasta no Google Drive
   - Verifique se ela está compartilhada (pelo menos como "Anyone with the link can view")
   - Confirme que o ID da pasta está correto na variável de ambiente

**Causa Técnica:** A versão anterior do código não incluía o parâmetro `corpora=user` na requisição da API, que é obrigatório quando se usa `orderBy=createdTime`. A versão atual do código já inclui este parâmetro.
