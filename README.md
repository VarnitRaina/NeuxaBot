# Neuxabot 🤖

Neuxabot is a powerful social media post creator bot for Telegram. It helps you generate highly engaging and personalized posts for platforms like LinkedIn, Facebook, and Twitter. Just feed the bot your thoughts and daily events, and it will use a large language model to craft three unique and impactful posts for you.

-----

## Features

  * **Social Media Post Generation**: Transforms your raw thoughts into professionally written posts.
  * **Multi-Platform Support**: Creates tailored content for LinkedIn, Facebook, and Twitter.
  * **Usage Tracking**: Monitors token usage to help you manage API costs.
  * **Easy to Use**: A simple, conversational interface on Telegram.

-----

## How to Use

1.  **Start a chat** with the bot on Telegram by searching for `@NeuxaBot`.
2.  **Send your thoughts and daily events** as simple text messages to the bot.
3.  **Run the `/generate` command** to receive three unique social media posts based on your events.

-----

## Deployment

Neuxabot is a Node.js application deployed as a web service on Render. It uses a webhook to receive updates from Telegram.

  * **Live Bot**: [https://neuxabot.onrender.com](https://neuxabot.onrender.com)
  * **Framework**: Telegraf.js
  * **Database**: MongoDB
  * **AI Model**: Google Gemini 1.5 Flash

-----

## Project Structure

  * `server.js`: The main application file that handles bot logic and webhook setup.
  * `src/config/db.js`: Contains the MongoDB connection logic.
  * `src/models/User.js`: Mongoose model for storing user data.
  * `src/models/Event.js`: Mongoose model for storing user events.

-----

## Getting Started

To run this project locally, clone the repository and install the dependencies:

```bash
git clone https://github.com/VarnitRaina/NeuxaBot.git
cd NeuxaBot
npm install
```

### Environment Variables

You need to create a `.env` file in the root of the project with the following variables:

```
BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
MONGO_CONNECT_STRING=YOUR_MONGODB_CONNECTION_STRING
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Then, you can run the bot locally with:

```bash
npm run dev
```
