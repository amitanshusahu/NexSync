// sync-zod.js
const fs = require("fs");

const serverZodPath = "/home/amitanshu/Desktop/Nextask/server/src/shared/zod.ts";
const clientZodPath = "/home/amitanshu/Desktop/Nextask/client/src/shared/zod.ts";

function syncZod() {
  try {
    // admin
    const content = fs.readFileSync(serverZodPath, "utf-8");
    fs.writeFileSync(clientZodPath, content);
    console.log("✅ Zod schema synced successfully to frontend.");

  } catch (err) {
    console.error("❌ Failed to sync Zod schema:", err.message);
  }
}

syncZod();