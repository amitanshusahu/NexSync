import { Bot } from 'grammy';
import { useCommands } from './commands/useCommands';

export function createBot() {
  const bot = new Bot(process.env.BOT_TOKEN!);
  useCommands(bot);

  bot.start()
    .then(() => {
      console.log('Bot started successfully');
    })
    .catch((err) => {
      console.error('Failed to start bot:', err);
    });
}
