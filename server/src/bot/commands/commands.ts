import { CommandContext, Context } from "grammy";
import { prisma } from "../../lib/prisma/client";
import { endOfDay, startOfDay } from "date-fns";
import { TaskPriority } from "@prisma/client";

export function startCommand(ctx: CommandContext<Context>) {
  ctx.reply("Nexbot is live! Use /help to see available commands.");
}

export function helpCommand(ctx: CommandContext<Context>) {
  const commands = [
    {
      command: "/start",
      description: "🚀 Check the bot's status to ensure it's up and running.",
    },
    {
      command: "/help",
      description: "ℹ️ Display this help message with a list of all available commands.",
    },
    {
      command: "/task",
      description:
        "📝 Create a new task.\n" +
        "Format: `/create #projectxyz P1 Task description`\n" +
        "• `#projectxyz`: Optional project tag (e.g., #tgaf).\n" +
        "• `P1`, `P2`, `P3`, `UI`, `UX`, `BUG`: Optional priority (use uppercase for priority).\n" +
        "Example: `/create #tgaf P1 Fix login button`",
    },
    {
      command: "/update",
      description: "✅ View all tasks completed today.",
    },
    {
      command: "/note",
      description:
        "📋 Add a note to a project.\n" +
        "Format: `/note #projectxyz Note content`\n" +
        "• `#projectxyz`: Optional project tag.\n" +
        "Example: `/note #tgaf Discuss UI improvements`",
    },
    {
      command: "/auth",
      description:
        "🔑 authorization key for a project.\n" +
        "Format: `/auth #projectxyz Key description`\n" +
        "• `#projectxyz`: Optional project tag.\n" +
        "Example: `/auth #tgaf API access for frontend\n`" +
        "What to send?: `email, password, api key, backup key, etc`",
    },
    {
      command: "/login",
      description:
        "🔐 Retrieve your login credentials.\n" +
        "Note: Start a private chat with the bot using `/start` to receive credentials securely via private message.\n" +
        "Click on the link message me: [Private Message](https://t.me/nexusinfotec_bot?start)",
    },
  ];

  const helpMessage: string = "📖 **Available Commands**\n\n" +
    commands
      .map((cmd) => `${cmd.command} ${cmd.description}`)
      .join("\n\n");

  ctx.reply(helpMessage);
}

export async function createTask(ctx: CommandContext<Context>) {
  const description = ctx.message?.text?.replace("/task", "").replace(/@\w+/g, "").trim();
  const extractedPriority = description ? description.match(/\b(P[1-3]|UI|UX|BUG)\b/) : null;
  const priority = extractedPriority ? extractedPriority[0] : "P3";
  const username = ctx.from?.username;

  await checkLogin(ctx);

  if (TaskPriority[priority as TaskPriority] === undefined) {
    return ctx.reply(`Invalid priority: ${priority}. Please use P1, P2, P3, UI, UX, or BUG.`);
  }

  if (description) {
    const cleanedDescription = description.replace(/#\w+|\b(P[1-3]|UI|UX|BUG)\b/g, "").trim();
    const projectId = await getProjectId(ctx);
    await prisma.task.create({
      data: {
        description: cleanedDescription,
        createdBy: username || "unknown",
        priority: priority as TaskPriority,
        projectId
      }
    })
    const replys = ["Hmm Hmm..", "Sure..", "Okay..", "Alright..", "Got it..", "Umm..Hmm"];
    ctx.reply(`${replys[Math.floor(Math.random() * replys.length)]}`)
  }
}

export async function getUpdates(ctx: CommandContext<Context>) {
  await checkLogin(ctx);
  const today = new Date();
  const startDate = startOfDay(today);
  const endDate = endOfDay(today);

  const tasks = await prisma.task.findMany({
    where: {
      completed: true,
      updatedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      project: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  if (tasks.length === 0) {
    return ctx.reply('🟡 No updates for today.');
  }

  // Group tasks by project name
  const grouped = tasks.reduce((acc, task) => {
    const projectName = task.project?.name || '🗂️ Uncategorized';
    if (!acc[projectName]) acc[projectName] = [];
    acc[projectName].push(task.description);
    return acc;
  }, {} as Record<string, string[]>);

  // Build reply message
  let message = `✅ *Completed Tasks Today*\n`;

  for (const [projectName, descriptions] of Object.entries(grouped)) {
    message += `\n*${projectName}*\n`;
    for (const desc of descriptions) {
      message += `  • ${desc}\n`;
    }
  }

  return ctx.reply(message, { parse_mode: 'Markdown' });
}


export async function createNote(ctx: CommandContext<Context>) {
  const description = ctx.message?.text?.replace("/note", "").replace(/@\w+/g, "").trim();
  const username = ctx.from?.username;

  await checkLogin(ctx);

  if (description) {
    const projectId = await getProjectId(ctx);
    const cleanedDescription = description.replace(/#\w+/g, "").trim();
    await prisma.note.create({
      data: {
        content: cleanedDescription,
        createdBy: username || "unknown",
        projectId
      }
    })
    ctx.reply(`📝 Noted`);
  }
}

export async function createAuthKey(ctx: CommandContext<Context>) {
  const description = ctx.message?.text?.replace("/auth", "").replace(/@\w+/g, "").trim();
  const username = ctx.from?.username;

  await checkLogin(ctx);

  if (description) {
    const projectId = await getProjectId(ctx);
    await prisma.authKey.create({
      data: {
        content: description,
        createdBy: username || "unknown",
        projectId
      }
    })
    ctx.reply(`🔑 Noted`);
  }
}

export async function getLogin(ctx: CommandContext<Context>) {
  const username = ctx.from?.username;
  const userId = ctx.from?.id;
  const link = `[Site Link](https://nex-sync-virid.vercel.app/)`

  if (!userId) {
    return ctx.reply("Error: Could not retrieve user information.");
  }

  const isLoggedIn = await checkLogin(ctx);

  if (isLoggedIn) {
    const user = await prisma.user.findUnique({
      where: { username: username }
    });

    if (user) {
      try {
        await ctx.api.sendMessage(
          userId,
          `Your credentials are:\nUsername: ${user.username}\nPassword: ${user.password}\ngo to ${link} to login`
        );
        await ctx.reply("Check your private messages for your credentials!");
      } catch (error) {
        await ctx.reply("Error: Please start a private chat with me by sending /start, then try again.");
        console.error("Failed to send private message:", error);
      }
    }
  }
}

async function getProjectId(ctx: CommandContext<Context>) {
  const description = ctx.message?.text?.replace("/task", "").replace(/@\w+/g, "").trim();
  const username = ctx.from?.username;
  const projects = description ? description.match(/#\w+/g) || [] : [];
  const projectName = projects.length > 0 ? projects[0].replace("#", "") : "GENERAL";

  const projectsDb = await prisma.project.findUnique({
    where: {
      name: projectName,
    }
  })
  let projectId = projectsDb ? projectsDb.id : null;

  if (!projectsDb) {
    const createdProject = await prisma.project.create({
      data: {
        name: projectName,
        createdBy: username || "unknown",
      }
    });
    projectId = createdProject.id;
    if (projectName !== "GENERAL") {
      ctx.reply(`hmm.. ${projectName} sounds new\ncreated ${projectName} project`);
    } else {
      ctx.reply(`Saved in ${projectName}`);
    }
  }

  return projectId;
}

export async function checkLogin(ctx: CommandContext<Context>): Promise<boolean> {
  const username = ctx.from?.username;
  const userId = ctx.from?.id;
  const link = `[Site Link](https://nextask.vercel.app)`

  if (!userId) {
    ctx.reply("Error: Could not retrieve user information.")
    return false;
  }

  if (username) {
    const user = await prisma.user.findUnique({
      where: { username: username }
    });

    if (!user) {
      await prisma.user.create({
        data: { username: username, password: "12345678" }
      });

      // Send private message to the user
      try {
        await ctx.api.sendMessage(
          userId,
          `Hmm..${username}, you look new here! I created your user profile.\nYour credentials are:\nUsername: ${username}\nPassword: 12345678\ngo to ${link} to login`
        );
        await ctx.reply("Check your private messages for your credentials!");
      } catch (error) {
        await ctx.reply("Error: Please start a private chat with me by sending /start, then try again.");
        console.error("Failed to send private message:", error);
      }
    }

    return true;
  } else {
    await ctx.reply("Error: You don't have a Telegram username set. Please set one in your Telegram settings.");
    return false;
  }
}