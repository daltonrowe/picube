import 'dotenv/config'

import { Client, Events, GatewayIntentBits } from "discord.js"
import { connect } from '../../broker/src/client.js'

const channels = {
  "1277604617680846881": "picube-general",
};

function lookupChannelId(name) {
  return Object.keys(channels).find(key => channels[key] === name)
}

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
    // message.author.username, message.content
    // do nothing
  }
});

connect('discord', (event) => {
  const id = lookupChannelId(event.data.channel)
  const channel = client.channels.cache.get(id);
  channel.send(event.data.message);
})

client.login(process.env.DISCORD_TOKEN);