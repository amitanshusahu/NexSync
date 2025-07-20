import { Bot } from "grammy";
import { createAuthKey, createNote, createTask, getLogin, getUpdates, helpCommand, startCommand } from "./commands";

export function useCommands(bot: Bot) {
  bot.command("start", startCommand);
  bot.command("help", helpCommand);
  bot.command("task", createTask);
  bot.command("update", getUpdates)
  bot.command("note", createNote);
  bot.command("auth", createAuthKey);
  bot.command("login", getLogin);
}