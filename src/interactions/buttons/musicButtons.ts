import { ButtonInteraction, MessageFlags } from 'discord.js';
import { RepeatMode } from 'distube';
import type { BotClient } from '../../client/BotClient.js';
import { getTranslation } from '../../i18n/index.js';
import { MusicEmbeds } from '../../music/MusicEmbeds.js';
import { ButtonHandler } from '../../types/index.js';

export const musicButtonHandler: ButtonHandler = {
  idPrefix: 'music:',
  voiceChannelRequired: true,
  sameVoiceChannelRequired: true,
  djRoleRequired: true,
  async execute(interaction: ButtonInteraction, client: BotClient): Promise<void> {
    const guildId = interaction.guildId;
    if (!guildId) return;

    const queue = client.distube.getQueue(guildId);
    const customId = interaction.customId;
    const config = await client.guildRepo.get(guildId);
    const lang = config.language;

    // Handle pagination for queue
    if (customId.startsWith('music:queue_page:')) {
      if (!queue) {
        await interaction.reply({ content: getTranslation(lang, 'queue.empty'), flags: MessageFlags.Ephemeral });
        return;
      }
      const page = parseInt(customId.split(':')[2], 10) || 1;
      const { embed, components } = MusicEmbeds.queue(queue, page, config);
      await interaction.update({ embeds: [embed], components });
      return;
    }

    if (!queue || queue.songs.length === 0) {
      await interaction.reply({ content: getTranslation(lang, 'queue.empty'), flags: MessageFlags.Ephemeral });
      return;
    }

    switch (customId) {
      case 'music:pause_resume': {
        if (queue.paused) {
          queue.resume();
        } else {
          queue.pause();
        }
        await interaction.update({ components: MusicEmbeds.playerControls(queue, config) });
        break;
      }

      case 'music:skip': {
        if (queue.songs.length <= 1 && !queue.autoplay) {
          await queue.stop();
          await interaction.reply({ content: getTranslation(lang, 'commands.stopped'), flags: MessageFlags.Ephemeral });
        } else {
          await queue.skip();
          await interaction.reply({ content: getTranslation(lang, 'commands.skipped'), flags: MessageFlags.Ephemeral });
        }
        break;
      }

      case 'music:previous': {
        try {
          await queue.previous();
          await interaction.reply({ content: '⏮️ Replaying previous song...', flags: MessageFlags.Ephemeral });
        } catch {
          await interaction.reply({ content: 'No previous song in history.', flags: MessageFlags.Ephemeral });
        }
        break;
      }

      case 'music:stop': {
        await queue.stop();
        await interaction.reply({ content: getTranslation(lang, 'commands.stopped') });
        break;
      }

      case 'music:loop': {
        let nextMode: RepeatMode;
        if (queue.repeatMode === RepeatMode.DISABLED) nextMode = RepeatMode.SONG;
        else if (queue.repeatMode === RepeatMode.SONG) nextMode = RepeatMode.QUEUE;
        else nextMode = RepeatMode.DISABLED;

        queue.setRepeatMode(nextMode);
        await interaction.update({ components: MusicEmbeds.playerControls(queue, config) });
        break;
      }

      case 'music:shuffle': {
        await queue.shuffle();
        await interaction.reply({ content: getTranslation(lang, 'commands.shuffleDone'), flags: MessageFlags.Ephemeral });
        break;
      }

      case 'music:vol_down': {
        const newVol = Math.max(0, queue.volume - 10);
        queue.setVolume(newVol);
        await interaction.update({ components: MusicEmbeds.playerControls(queue, config) });
        break;
      }

      case 'music:vol_up': {
        const newVol = Math.min(100, queue.volume + 10);
        queue.setVolume(newVol);
        await interaction.update({ components: MusicEmbeds.playerControls(queue, config) });
        break;
      }

      case 'music:view_queue': {
        const { embed, components } = MusicEmbeds.queue(queue, 1, config);
        await interaction.reply({ embeds: [embed], components, flags: MessageFlags.Ephemeral });
        break;
      }

      case 'music:toggle_autoplay': {
        queue.toggleAutoplay();
        await interaction.update({ components: MusicEmbeds.playerControls(queue, config) });
        break;
      }

      default:
        await interaction.reply({ content: 'Action not recognized.', flags: MessageFlags.Ephemeral });
        break;
    }
  },
};
