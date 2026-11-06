import { Command } from '../types/index.js';
import { autoplayCommand } from './music/autoplay.js';
import { filterCommand } from './music/filters.js';
import { loopCommand } from './music/loop.js';
import { nowPlayingCommand } from './music/nowplaying.js';
import { pauseCommand } from './music/pause.js';
import { playCommand } from './music/play.js';
import { queueCommand } from './music/queue.js';
import { resumeCommand } from './music/resume.js';
import { seekCommand } from './music/seek.js';
import { setupCommand } from './music/setup.js';
import { shuffleCommand } from './music/shuffle.js';
import { skipCommand } from './music/skip.js';
import { stopCommand } from './music/stop.js';
import { volumeCommand } from './music/volume.js';
import { djCommand } from './dj/dj.js';
import { helpCommand } from './general/help.js';
import { languageCommand } from './general/language.js';
import { lastfmCommand } from './general/lastfm.js';
import { pingCommand } from './general/ping.js';
import { themeCommand } from './general/theme.js';

export const allCommands: Command[] = [
  playCommand,
  skipCommand,
  pauseCommand,
  resumeCommand,
  stopCommand,
  nowPlayingCommand,
  queueCommand,
  volumeCommand,
  loopCommand,
  shuffleCommand,
  seekCommand,
  filterCommand,
  autoplayCommand,
  setupCommand,
  djCommand,
  languageCommand,
  themeCommand,
  lastfmCommand,
  helpCommand,
  pingCommand,
];
