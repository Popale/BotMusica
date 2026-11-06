import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { MusicEmbeds } from '../../music/MusicEmbeds.js';
import { Command } from '../../types/index.js';

export const filterCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('filter')
    .setDescription('Aplica o desactiva filtros de ecualización de audio en tiempo real')
    .addStringOption((opt) =>
      opt
        .setName('filtro')
        .setDescription('Filtro de audio a aplicar/alternar')
        .setRequired(true)
        .addChoices(
          { name: '🧹 Limpiar todos los filtros', value: 'clear' },
          { name: '🔊 Bass Boost', value: 'bassboost' },
          { name: '🎧 Audio 8D / 3D', value: '3d' },
          { name: '⚡ Nightcore', value: 'nightcore' },
          { name: '🌊 Vaporwave', value: 'vaporwave' },
          { name: '📢 Eco', value: 'echo' },
          { name: '📻 Surround', value: 'surround' },
          { name: '🎤 Karaoke', value: 'karaoke' }
        )
    ),
  voiceChannelRequired: true,
  sameVoiceChannelRequired: true,
  djRoleRequired: true,
  async execute(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
    const guildId = interaction.guildId;
    if (!guildId) return;

    const queue = client.distube.getQueue(guildId);
    if (!queue) {
      const embed = MusicEmbeds.error('Sin Reproducción', 'No hay música sonando para aplicar filtros.');
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const filterName = interaction.options.getString('filtro', true);

    if (filterName === 'clear') {
      queue.filters.clear();
      const embed = MusicEmbeds.success('Filtros Limpiados', '🧹 Se han desactivado todos los efectos de audio.');
      await interaction.reply({ embeds: [embed] });
      return;
    }

    let statusText: string;
    if (queue.filters.has(filterName)) {
      queue.filters.remove(filterName);
      statusText = `Filtro \`${filterName}\` **desactivado**.`;
    } else {
      queue.filters.add(filterName);
      statusText = `Filtro \`${filterName}\` **activado** (puede tomar unos segundos en actualizarse).`;
    }

    const currentFilters = queue.filters.names.length > 0
      ? queue.filters.names.join(', ')
      : 'Ninguno';

    const embed = MusicEmbeds.success('Filtro Actualizado', `${statusText}\n\n**Filtros activos:** \`${currentFilters}\``);
    await interaction.reply({ embeds: [embed] });
  },
};
