export interface AppConfig {
  dbPath: string;
  discordWebhookUrl: string;
}

export const config: AppConfig = {
  dbPath: process.env.DB_PATH || './db/database.sqlite',
  discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL!,
};
