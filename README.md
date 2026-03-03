<p align="center">
  <img src="https://i.imgur.com/kdqUNGr.png" width="200" height="200" alt="Groovy">
</p>

<h1 align="center">Groovy</h1>

<p align="center">
  <b>A feature-rich Discord Music Bot built with discord.js v14</b>
</p>

<p align="center">
  <a href="https://github.com/kingpin1dev/Groovy-Revamped/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/kingpin1dev/Groovy-Revamped?style=flat-square" alt="License">
  </a>
  <img src="https://img.shields.io/badge/node-%3E%3D22.12.0-brightgreen?style=flat-square" alt="Node Version">
  <img src="https://img.shields.io/badge/discord.js-v14-5865F2?style=flat-square" alt="discord.js">
</p>

---

## About

Groovy is a revamped Discord music bot that lets you play music from YouTube directly in your voice channels. It supports both **slash commands** (`/play`) and **prefix commands** (`!play`), giving users flexibility in how they interact with the bot.

Built from the ground up with a modular architecture using discord.js v14, @discordjs/voice, and play-dl.

## Features

- YouTube music playback with search and direct URL support
- Queue system with per-server queue management
- Dual command system — slash commands and prefix commands
- Volume control with persistent per-server settings
- Now playing display with progress information
- Pause, resume, skip, and stop controls
- Rich embed responses for a clean user experience
- Auto-disconnect when the queue is empty
- Modular command and event handler architecture

## Prerequisites

- [Node.js](https://nodejs.org/) v22.12.0 or higher
- A [Discord Bot Token](https://discord.com/developers/applications)
- FFmpeg installed on your system

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kingpin1dev/Groovy-Revamped.git
   cd Groovy-Revamped
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the example env file and fill in your values:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your credentials:
   ```env
   BOT_TOKEN=your_discord_bot_token
   GUILD_ID=your_guild_id
   PREFIX=!
   ```

   | Variable | Required | Description |
   |----------|----------|-------------|
   | `BOT_TOKEN` | Yes | Your Discord bot token |
   | `GUILD_ID` | No | Guild ID for guild-specific slash commands (faster registration) |
   | `PREFIX` | No | Command prefix (defaults to `!`) |

4. **Start the bot**
   ```bash
   npm start
   ```

   Or use the included `start.sh` for auto-restart:
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

## Commands

### Music Commands

| Command | Aliases | Usage | Description |
|---------|---------|-------|-------------|
| `play` | `p` | `!play <song name or URL>` | Search and play a song from YouTube |
| `skip` | `s` | `!skip` | Skip the currently playing song |
| `stop` | `dc`, `leave`, `disconnect` | `!stop` | Stop playback, clear queue, and leave the channel |
| `queue` | `q` | `!queue` | Display the current song queue |
| `pause` | — | `!pause` | Pause the currently playing song |
| `resume` | `r` | `!resume` | Resume a paused song |
| `nowplaying` | `np` | `!nowplaying` | Show details about the currently playing song |
| `volume` | `vol` | `!volume [0-150]` | View or set the playback volume |

### General Commands

| Command | Aliases | Usage | Description |
|---------|---------|-------|-------------|
| `help` | `h`, `commands` | `!help` | Show all available commands |
| `ping` | — | `!ping` | Check the bot's latency |
| `info` | `about`, `botinfo` | `!info` | Display bot information and stats |

> All commands work with both slash commands (`/play`) and prefix commands (`!play`).

## Project Structure

```
Groovy-Revamped/
├── src/
│   ├── index.js                 # Bot entry point and client setup
│   ├── handlers/
│   │   ├── commandHandler.js    # Loads and registers commands
│   │   └── eventHandler.js      # Loads and registers events
│   ├── commands/
│   │   ├── music/               # Music commands
│   │   │   ├── play.js
│   │   │   ├── skip.js
│   │   │   ├── stop.js
│   │   │   ├── queue.js
│   │   │   ├── pause.js
│   │   │   ├── resume.js
│   │   │   ├── nowplaying.js
│   │   │   └── volume.js
│   │   └── general/             # General commands
│   │       ├── help.js
│   │       ├── ping.js
│   │       └── info.js
│   └── events/
│       ├── ready.js             # Bot ready event + slash command registration
│       ├── messageCreate.js     # Prefix command handler
│       └── interactionCreate.js # Slash command handler
├── .env.example                 # Environment variable template
├── package.json
├── start.sh                     # Auto-restart script
└── LICENSE
```

## Tech Stack

| Package | Purpose |
|---------|---------|
| [discord.js](https://discord.js.org/) v14 | Discord API wrapper |
| [@discordjs/voice](https://www.npmjs.com/package/@discordjs/voice) | Voice connection handling |
| [@discordjs/opus](https://www.npmjs.com/package/@discordjs/opus) | Opus audio encoding |
| [play-dl](https://www.npmjs.com/package/play-dl) | YouTube audio streaming |
| [youtube-sr](https://www.npmjs.com/package/youtube-sr) | YouTube search |
| [dotenv](https://www.npmjs.com/package/dotenv) | Environment variable management |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the Apache License 2.0 — see the [LICENSE](LICENSE) file for details.

## Author

**[kingpindev](https://github.com/kingpin1dev)**
