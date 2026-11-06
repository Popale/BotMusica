import { BotClient } from './client/BotClient.js';
import { allCommands } from './commands/index.js';
import { env } from './config/env.js';
import { registerDiscordEvents } from './events/discordEvents.js';
import { registerMessageEvents } from './events/messageEvents.js';
import { musicButtonHandler } from './interactions/buttons/musicButtons.js';
import { musicSelectMenuHandler } from './interactions/selectMenus/musicSelectMenus.js';

async function bootstrap(): Promise<void> {
  const client = new BotClient();

  // 1. Register commands
  for (const cmd of allCommands) {
    client.commands.set(cmd.data.name, cmd);
  }

  // 2. Register interaction handlers (Buttons & Select Menus)
  client.buttons.set(musicButtonHandler.idPrefix, musicButtonHandler);
  client.selectMenus.set(musicSelectMenuHandler.idPrefix, musicSelectMenuHandler);

  // 3. Register Discord event listeners
  registerDiscordEvents(client);
  registerMessageEvents(client);

  // 4. Graceful shutdown handling
  const handleShutdown = async (signal: string) => {
    console.log(`\n🛑 Recibida señal ${signal}. Cerrando bot de forma segura...`);
    await client.shutdown();
    process.exit(0);
  };

  process.on('SIGINT', () => void handleShutdown('SIGINT'));
  process.on('SIGTERM', () => void handleShutdown('SIGTERM'));

  process.on('unhandledRejection', (reason) => {
    const errorStr = reason instanceof Error ? reason.message : String(reason);
    if (errorStr.includes('disallowed intents')) {
      console.error(`
❌ ERROR DE INTENTS DE DISCORD:
Discord rechazó la conexión porque el intent privilegiado "MessageContent" está activo pero no fue habilitado en el Portal de Discord.

👉 CÓMO SOLUCIONARLO EN 20 SEGUNDOS:
1. Ve a: https://discord.com/developers/applications
2. Selecciona tu aplicación (${env.clientId}) -> Pestaña "Bot" en el menú izquierdo.
3. Baja hasta la sección "Privileged Gateway Intents".
4. ACTIVA el interruptor: "Message Content Intent".
5. Haz clic en "Save Changes" y vuelve a iniciar el bot.

💡 Alternativa rápida si solo quieres usar comandos Slash (/):
En tu archivo .env coloca:
ENABLE_MESSAGE_CONTENT=false
      `);
      return;
    }
    console.error('⚠️ Promesa no manejada detectada:', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error('💥 Excepción no capturada:', error);
  });

  console.log('🚀 Iniciando Bot de Música Avanzado...');
  await client.start();
}

void bootstrap();
