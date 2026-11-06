import { ActivityType, Events, Interaction, MessageFlags } from 'discord.js';
import type { BotClient } from '../client/BotClient.js';
import { checkDjGuard } from '../guards/djGuard.js';
import { checkVoiceGuard } from '../guards/voiceGuard.js';
import { MusicEmbeds } from '../music/MusicEmbeds.js';

export function registerDiscordEvents(client: BotClient): void {
  client.once(Events.ClientReady, (readyClient) => {
    console.log(`🤖 Bot iniciado con éxito como: ${readyClient.user.tag}`);
    readyClient.user.setActivity({
      name: '🎶 /play',
      type: ActivityType.Listening,
    });
  });

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    try {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        if (command.voiceChannelRequired || command.sameVoiceChannelRequired) {
          const voiceCheck = await checkVoiceGuard(interaction, client, {
            requireVoice: command.voiceChannelRequired,
            requireSameVoice: command.sameVoiceChannelRequired,
          });
          if (!voiceCheck.allowed) return;
        }

        if (command.djRoleRequired) {
          const djAllowed = await checkDjGuard(interaction, client);
          if (!djAllowed) return;
        }

        await command.execute(interaction, client);
        return;
      }

      if (interaction.isButton()) {
        const customId = interaction.customId;
        const handler = client.buttons.find((h) => customId.startsWith(h.idPrefix));
        if (!handler) return;

        if (handler.voiceChannelRequired || handler.sameVoiceChannelRequired) {
          const voiceCheck = await checkVoiceGuard(interaction, client, {
            requireVoice: handler.voiceChannelRequired,
            requireSameVoice: handler.sameVoiceChannelRequired,
          });
          if (!voiceCheck.allowed) return;
        }

        if (handler.djRoleRequired) {
          const djAllowed = await checkDjGuard(interaction, client);
          if (!djAllowed) return;
        }

        await handler.execute(interaction, client);
        return;
      }

      if (interaction.isStringSelectMenu()) {
        const customId = interaction.customId;
        const handler = client.selectMenus.find((h) => customId.startsWith(h.idPrefix));
        if (!handler) return;

        if (handler.voiceChannelRequired || handler.sameVoiceChannelRequired) {
          const voiceCheck = await checkVoiceGuard(interaction, client, {
            requireVoice: handler.voiceChannelRequired,
            requireSameVoice: handler.sameVoiceChannelRequired,
          });
          if (!voiceCheck.allowed) return;
        }

        if (handler.djRoleRequired) {
          const djAllowed = await checkDjGuard(interaction, client);
          if (!djAllowed) return;
        }

        await handler.execute(interaction, client);
        return;
      }
    } catch (error: unknown) {
      console.error('Error al procesar interacción:', error);
      const errorMessage = 'Hubo un error inesperado al procesar esta acción.';
      const embed = MusicEmbeds.error('Error Inesperado', errorMessage);

      if (interaction.isRepliable()) {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ embeds: [embed], flags: MessageFlags.Ephemeral }).catch(() => null);
        } else {
          await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral }).catch(() => null);
        }
      }
    }
  });
}
