import express from 'express';
import Database from 'better-sqlite3';
import { notifyDiscord } from './discord/notifier';
import { config } from './config';
import * as path from 'node:path';
import * as fs from 'node:fs';

const app = express();
app.use(express.json());

// ensure db directory exists
const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(config.dbPath);

// create table if not exists
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS player_deaths (
    player TEXT PRIMARY KEY,
    deaths INTEGER DEFAULT 0
  )
`,
).run();

const currentPlayers = new Set<string>();

app.post('/api/join', (req, res) => {
  const { player } = req.body;
  if (!player) return res.status(400).send("Missing 'player' field");

  currentPlayers.add(player);
  res.sendStatus(200);
});

app.post('/api/leave', (req, res) => {
  const { player } = req.body;
  if (!player) return res.status(400).send("Missing 'player' field");

  currentPlayers.delete(player);
  res.sendStatus(200);
});

app.post('/api/death', async (req, res) => {
  const { player, deathMessage } = req.body;

  if (!player || !deathMessage) {
    return res.status(400).send("Missing 'player' or 'deathMessage' field");
  }

  // increment death count in database
  const stmt = db.prepare(`
    INSERT INTO player_deaths (player, deaths)
    VALUES (?, 1)
      ON CONFLICT(player) DO UPDATE SET deaths = deaths + 1
  `);
  stmt.run(player);

  type Row = { deaths: number };
  const row = db
    .prepare('SELECT deaths FROM player_deaths WHERE player = ?')
    .get(player) as Row | undefined;
  console.log(`${deathMessage}. Total deaths: ${row ? row.deaths : 0}`);

  await notifyDiscord(
    config.discordWebhookUrl,
    `${deathMessage}. Total deaths: ${row ? row.deaths : 0}`,
  );

  res.sendStatus(200);
});

app.listen(3000, () => console.log('Backend running on port 3000'));
