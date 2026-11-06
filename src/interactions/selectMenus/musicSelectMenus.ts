import { GuildMember, MessageFlags, StringSelectMenuInteraction, VoiceBasedChannel } from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { getTranslation } from '../../i18n/index.js';
import { SelectMenuHandler } from '../../types/index.js';

export const musicSelectMenuHandler: SelectMenuHandler = {
  idPrefix: 'music:',
  voiceChannelRequired: true,
  sameVoiceChannelRequired: true,
  djRoleRequired: true,
  async execute(interaction: StringSelectMenuInteraction, client: BotClient): Promise<void> {
    const guildId = interaction.guildId;
    if (!guildId) return;

    const queue = client.distube.getQueue(guildId);
    const config = await client.guildRepo.get(guildId);
    const selected = interaction.values[0];

    // 1. Recommended Track Dropdown
    if (interaction.customId === 'music:recommended_select') {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      const member = interaction.member as GuildMember;
      const voiceChannel = member.voice.channel as VoiceBasedChannel;

      let query = selected;
      if (selected.startsWith('rec_')) {
        const parts = selected.split('_');
        const encodedUrl = parts.slice(2).join('_');
        query = encodedUrl !== 'none' ? decodeURIComponent(encodedUrl) : 'lofi hip hop';
      }

      try {
        await client.distube.play(voiceChannel, query, {
          textChannel: interaction.channel as any,
          member,
        });
        await interaction.editReply({
          content: `✨ Added recommended track: **${query}**`,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error playing track';
        await interaction.editReply({ content: `❌ ${msg}` });
      }
      return;
    }

    // 2. Audio Filters Dropdown
    if (interaction.customId === 'music:filter_select') {
      if (!queue) {
        await interaction.reply({ content: 'No active queue to apply filters.', flags: MessageFlags.Ephemeral });
        return;
      }

      const filterKey = selected.replace('filter_', '');

      if (filterKey === 'clear') {
        queue.filters.clear();
        await interaction.reply({
          content: getTranslation(config.language, 'filters.cleared'),
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      if (queue.filters.has(filterKey)) {
        queue.filters.remove(filterKey);
        await interaction.reply({
          content: `Filter \`${filterKey}\` removed.`,
          flags: MessageFlags.Ephemeral,
        });
      } else {
        queue.filters.add(filterKey);
        await interaction.reply({
          content: `Filter \`${filterKey}\` enabled.`,
          flags: MessageFlags.Ephemeral,
        });
      }
      return;
    }
  },
};
