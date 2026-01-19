# Configuração do Tawk.to

O chat integrado do HairInsight usa o Tawk.to para fornecer suporte via IA em tempo real.

## Como Configurar

### 1. Criar Conta no Tawk.to

1. Acesse [https://www.tawk.to/](https://www.tawk.to/)
2. Crie uma conta gratuita
3. Faça login no dashboard

### 2. Obter as Credenciais

1. No dashboard do Tawk.to, vá em **Administration** > **Channels** > **Chat Widget**
2. Você verá um código de integração que se parece com isso:

```html
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
```

3. Copie os valores de `YOUR_PROPERTY_ID` e `YOUR_WIDGET_ID` da URL

### 3. Configurar no Código

Abra o arquivo `src/app/chat/page.tsx` e localize a linha 31:

```typescript
script.src = 'https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
```

Substitua `YOUR_PROPERTY_ID` e `YOUR_WIDGET_ID` pelos valores copiados do Tawk.to.

**Exemplo:**
```typescript
script.src = 'https://embed.tawk.to/5f8a9b1c4c4c4c4c4c4c4c4c/1abc2def3';
```

### 4. Configurar IA no Tawk.to (Opcional)

Para habilitar respostas automáticas da IA:

1. No dashboard do Tawk.to, vá em **Automation** > **Triggers**
2. Configure mensagens automáticas para perguntas frequentes
3. Ou integre com sua API de IA preferida via webhooks

### 5. Personalizar o Widget

No dashboard do Tawk.to:

1. Vá em **Administration** > **Channels** > **Chat Widget**
2. Customize:
   - Cor do widget (sugerimos usar #FF6F91 para feminino ou #9B59B6 para masculino)
   - Mensagem de boas-vindas
   - Posição do widget na tela
   - Horário de disponibilidade

### 6. Testar

1. Salve as alterações
2. Acesse a página `/chat` do seu app
3. O widget do Tawk.to deve abrir automaticamente
4. Teste enviando uma mensagem

## Recursos Úteis

- [Documentação Oficial do Tawk.to](https://help.tawk.to/)
- [API do Tawk.to](https://developer.tawk.to/)
- [Personalização do Widget](https://help.tawk.to/article/widget-customization)

## Dúvidas Frequentes

**Q: O chat não está aparecendo**
A: Verifique se os IDs do Tawk.to estão corretos no arquivo `chat/page.tsx`

**Q: Como adicionar IA às respostas?**
A: Use a funcionalidade "Automation" do Tawk.to ou integre com APIs de IA como OpenAI

**Q: É gratuito?**
A: Sim! O Tawk.to oferece um plano gratuito completo com chat ilimitado
