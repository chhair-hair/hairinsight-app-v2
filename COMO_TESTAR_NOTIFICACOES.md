# 🧪 Como Testar as Notificações Push

Guia rápido para testar se suas notificações estão funcionando perfeitamente!

## 🚀 Passo a Passo

### 1️⃣ Acessar a Página de Teste

Abra o seu app e acesse:
```
/teste-notificacoes
```

### 2️⃣ Ativar Notificações

1. Clique no botão **"Ativar Notificações"**
2. Quando o navegador pedir permissão, clique em **"Permitir"**
3. Aguarde alguns segundos até aparecer a mensagem de sucesso

### 3️⃣ Verificar o Token

Após ativar, você verá:
- ✅ Um card verde mostrando "Notificações Ativadas"
- 📋 Um box com o seu **Token FCM** (uma string longa)
- 📊 O contador de dispositivos ativos aumentará para 1

### 4️⃣ Enviar Notificação de Teste

1. O formulário já vem preenchido com uma mensagem de exemplo
2. Você pode personalizar o **Título** e a **Mensagem**
3. Clique em **"Enviar para Mim"**
4. Aguarde alguns segundos

### 5️⃣ Verificar se Recebeu

A notificação pode aparecer de 3 formas:

**Se o app estiver ABERTO (foreground):**
- Você verá um toast/popup dentro do app com a mensagem

**Se o app estiver MINIMIZADO (background):**
- Aparecerá uma notificação do sistema (canto da tela)
- No Windows: canto inferior direito
- No Mac: canto superior direito
- No celular: barra de notificações

**Se não aparecer:**
- Verifique as permissões do navegador
- Abra o Console (F12) e procure por erros
- Verifique se tem mensagens com ✅ ou ❌

## 📱 Testar Envio em Massa

1. Abra o app em várias abas ou dispositivos
2. Ative as notificações em cada um
3. Volte para a página de teste
4. Clique em **"Enviar para Todos"**
5. Você verá quantas notificações foram enviadas com sucesso

## 🔍 O Que Verificar

### ✅ Se tudo está OK, você vai ver:

```
✅ Firebase Cloud Messaging inicializado com sucesso
✅ Token FCM obtido: abc123...
✅ Token FCM registrado com sucesso
✅ Notificação enviada com sucesso
```

### ❌ Se algo deu errado:

#### Erro: "Permissão de notificações negada"
**Solução:** Vá nas configurações do navegador e permita notificações para o site

#### Erro: "VAPID Key não configurada"
**Solução:** Configure a variável `NEXT_PUBLIC_FIREBASE_VAPID_KEY` no arquivo `.env.local`

#### Erro: "Firebase Cloud Messaging não configurado"
**Solução:** Verifique se todas as variáveis do Firebase estão configuradas:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

#### Erro: "Tabela fcm_tokens não existe"
**Solução:** Execute o comando para criar a tabela no Supabase:
```bash
npx supabase migration new create_fcm_tokens_table
```
Depois adicione o SQL da tabela e rode:
```bash
npx supabase db push --yes
```

## 🧪 Testes Avançados

### Testar notificação com ação
Cole este JSON no campo de dados customizados (se você adicionar esse campo):
```json
{
  "url": "/app",
  "action": "view_routine"
}
```

### Testar notificação com imagem
Adicione uma URL de imagem no campo `imageUrl` (se você adicionar esse campo)

### Testar notificação agendada
Use a API de cron jobs para agendar notificações automáticas

## 📊 Monitorar no Console

Abra o Console do navegador (F12) e vá na aba **Console**.

Você verá logs detalhados:
- `📬 Mensagem recebida em foreground:` - quando recebe notificação
- `[FCM SW] Mensagem recebida em background:` - no service worker
- `[FCM SW] Clique na notificação:` - quando clica na notificação

## 🎯 Próximos Passos

Depois de testar, você pode:

1. **Integrar com sua rotina capilar**
   - Enviar lembretes automáticos
   - Notificar quando análise terminar
   - Alertas de produtos

2. **Criar agendamentos**
   - Usar cron jobs para lembretes diários
   - Notificações baseadas em horário do usuário

3. **Personalizar notificações**
   - Adicionar imagens dos produtos
   - Botões de ação customizados
   - Som customizado

## 🆘 Precisa de Ajuda?

Se algo não funcionou:
1. Leia os erros no Console (F12)
2. Verifique se todas as variáveis de ambiente estão configuradas
3. Confira se o Service Worker está registrado em `Application > Service Workers`
4. Teste em modo anônimo para descartar problemas de cache

---

**Pronto!** Agora você sabe testar suas notificações completamente! 🎉
