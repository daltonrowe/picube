require("dotenv").config();

const { Client, Events, GatewayIntentBits } = require("discord.js");

const channels = {
  "1277604617680846881": "picube-general",
};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (channels[message.channel.id] === "picube-general") {
    console.log(message.author.username, message.content);
  }
});

client.login(process.env.DISCORD_TOKEN);
