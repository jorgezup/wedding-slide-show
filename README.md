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
