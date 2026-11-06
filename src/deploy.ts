import { ApplicationIntegrationType, InteractionContextType, REST, Routes } from 'discord.js';
import { allCommands } from './commands/index.js';
import { env } from './config/env.js';

async function deploy(): Promise<void> {
  const commandsData = allCommands.map((cmd) => {
    // Enable Guild, DM, and User App integration contexts
    cmd.data.setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ]);
    cmd.data.setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ]);
    return cmd.data.toJSON();
  });

  const rest = new REST({ version: '10' }).setToken(env.discordToken);

  console.log(`🚀 Iniciando despliegue de ${commandsData.length} comandos Slash con soporte de Servidores y DMs...`);

  try {
    if (env.devGuildId) {
      console.log(`📍 Modo Desarrollo: Registrando comandos en el servidor ${env.devGuildId}...`);
      await rest.put(
        Routes.applicationGuildCommands(env.clientId, env.devGuildId),
        { body: commandsData }
      );
      console.log('✅ ¡Comandos registrados exitosamente en el servidor de desarrollo!');
    } else {
      console.log('🌍 Modo Global: Registrando comandos globalmente en Discord...');
      await rest.put(
        Routes.applicationCommands(env.clientId),
        { body: commandsData }
      );
      console.log('✅ ¡Comandos registrados globalmente en Discord!');
    }
  } catch (error) {
    console.error('❌ Error al desplegar los comandos en Discord:', error);
    process.exit(1);
  }
}

void deploy();
