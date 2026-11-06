import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type { BotClient } from '../../client/BotClient.js';
import { COLORS } from '../../music/MusicEmbeds.js';
import { Command } from '../../types/index.js';

export const helpCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Muestra la guía completa de comandos y funcionamiento del bot'),
  voiceChannelRequired: false,
  sameVoiceChannelRequired: false,
  djRoleRequired: false,
  async execute(interaction: ChatInputCommandInteraction, _client: BotClient): Promise<void> {
    const embed = new EmbedBuilder()
      .setColor(COLORS.PRIMARY)
      .setTitle('📖 Manual de Comandos & Funciones')
      .setDescription(
        'Bot de música avanzado de alta fidelidad con soporte para YouTube, Spotify, SoundCloud, controles por botones y sistema de roles DJ.'
      )
      .addFields(
        {
          name: '🎵 Comandos de Reproducción',
          value:
            '`/play <canción o url>` - Reproduce música o playlists desde YouTube, Spotify, SoundCloud.\n' +
            '`/nowplaying` - Despliega el reproductor interactivo con controles táctiles.\n' +
            '`/queue [página]` - Muestra la lista de canciones en espera con paginación.\n' +
            '`/skip` - Salta a la siguiente pista de la cola.\n' +
            '`/stop` - Detiene la música, vacía la cola y sale del canal.\n' +
            '`/pause` - Pausa la canción actual.\n' +
            '`/resume` - Reanuda la música pausada.',
        },
        {
          name: '🎛️ Efectos & Control de Audio',
          value:
            '`/volume <1-100>` - Ajusta el volumen del reproductor.\n' +
            '`/loop <off | song | queue>` - Activa la repetición de una pista o de la cola.\n' +
            '`/shuffle` - Reordena las canciones de la cola aleatoriamente.\n' +
            '`/seek <tiempo>` - Salta a un minuto o segundo específico (ej: `01:30`).\n' +
            '`/filter <tipo>` - Aplica efectos como Bassboost, 8D, Nightcore, Vaporwave, etc.\n' +
            '`/autoplay` - Reproduce automáticamente música similar cuando termina la cola.',
        },
        {
          name: '🛡️ Sistema de DJ & Administración',
          value:
            '`/dj set-role <rol>` - Asigna qué rol actúa como DJ oficial del servidor.\n' +
            '`/dj remove-role` - Remueve la restricción de rol de DJ.\n' +
            '`/dj mode <only_dj | everyone>` - Define si solo los DJs o cualquiera pueden controlar la música.\n' +
            '`/dj status` - Consulta la configuración actual del servidor.',
        },
        {
          name: '🕹️ Controles por Botones',
          value:
            'Cada vez que una canción empieza a sonar, el bot enviará un reproductor con botones para **Pausar/Reanudar**, **Saltar**, **Detener**, **Repetir**, **Aleatorio**, **Volumen +/-**, **Cola** y **Autoplay** sin necesidad de escribir comandos.',
        }
      )
      .setFooter({
        text: 'Desarrollado para la máxima fidelidad y rendimiento | BotMusica',
      });

    await interaction.reply({ embeds: [embed] });
  },
};
