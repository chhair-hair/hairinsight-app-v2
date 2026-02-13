import * as admin from 'firebase-admin';

let isInitialized = false;
let initError: Error | null = null;
let messagingInstance: admin.messaging.Messaging | null = null;

// Função para inicializar o Firebase Admin (lazy initialization)
function initializeFirebaseAdmin() {
  if (isInitialized || admin.apps.length > 0) {
    return true;
  }

  try {
    // Valida que as variáveis de ambiente existem
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      console.warn('⚠️ Firebase Admin não configurado - variáveis de ambiente faltando');
      console.warn('💡 Configure: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
      return false;
    }

    // Trata a chave privada corretamente
    let formattedPrivateKey = privateKey;

    // Se a chave contém \\n literal, converte para quebras de linha reais
    if (privateKey.includes('\\n')) {
      formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
    }

    // Verifica se a chave tem formato válido
    if (!formattedPrivateKey.includes('BEGIN PRIVATE KEY')) {
      console.error('❌ FIREBASE_PRIVATE_KEY não está em formato PEM válido');
      return false;
    }

    // Inicializa o Firebase Admin com as credenciais das variáveis de ambiente
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: formattedPrivateKey,
      }),
    });

    isInitialized = true;
    console.log('✅ Firebase Admin inicializado com sucesso');
    return true;
  } catch (error) {
    initError = error as Error;
    console.error('❌ Erro ao inicializar Firebase Admin:', error);
    console.warn('⚠️ Notificações push não estarão disponíveis');
    isInitialized = false;
    return false;
  }
}

// Função segura para obter messaging (lazy initialization)
export function getMessaging(): admin.messaging.Messaging | null {
  // Tenta inicializar se ainda não foi
  if (!isInitialized) {
    const initialized = initializeFirebaseAdmin();
    if (!initialized) {
      return null;
    }
  }

  // Se já tem instância, retorna
  if (messagingInstance) {
    return messagingInstance;
  }

  // Cria instância do messaging
  try {
    messagingInstance = admin.messaging();
    return messagingInstance;
  } catch (error) {
    console.error('❌ Erro ao obter messaging:', error);
    return null;
  }
}

// Exporta variáveis de controle
export function isAdminInitialized(): boolean {
  if (!isInitialized) {
    initializeFirebaseAdmin();
  }
  return isInitialized;
}

export const adminInitialized = isInitialized;
export const adminError = initError;

// Para compatibilidade com código existente - mas NÃO inicializa automaticamente
export const messaging = null; // Será inicializado via getMessaging() quando necessário

export default admin;
