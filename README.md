# RESTCraft Backend

A small **Node.js backend** for [RESTCraft](https://github.com/agonyz/restcraft), a RESTful API service for managing and interacting with Minecraft servers.  
It tracks player events (join, leave, death) and persists death counts in a SQLite database. Optionally, it can notify a Discord webhook when a player dies.

---

## Features
- Tracks **player join** and **leave** events.
- Tracks **player deaths** and stores counts in **SQLite**.
- Sends **Discord notifications** on player death (optional).
- Fully RESTful endpoints:
    - `POST /api/join`
    - `POST /api/leave`
    - `POST /api/death`

---

## Getting Started

### Requirements

- Node.js 24+
- Docker
- SQLite (bundled via `better-sqlite3`)

## How to develop the mod
- Startup the minecraft server and let it generate the files in the `data` directory.
- Move the `restcraft-x.x.x.jar` to the `data/mods` directory.
- Start the docker compose and test the modification

