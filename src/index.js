require("dotenv").config();
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const {
    Guilds,
    GuildMembers,
    GuildMessages,
    GuildMessageReactions,
    GuildScheduledEvents,
    GuildPresences,
    MessageContent,
} = GatewayIntentBits;
const { User, Message, GuildMember } = Partials;

const client = new Client({
    intents: [
        Guilds,
        GuildMembers,
        GuildMessages,
        GuildMessageReactions,
        GuildScheduledEvents,
        GuildPresences,
        MessageContent,
    ],
    partials: [User, Message, GuildMember],
});

// Connect to MongoDB
const { mongooseConnect } = require("./functions/startup/mongooseConnect");
mongooseConnect();

// Handle concurrent saves to MongoDB
const TaskQueue = require("./classes/TaskQueue");
const bracketModelQueue = new TaskQueue();
const setupModelQueue = new TaskQueue();
const userStatQueue = new TaskQueue();
client.giveawayQueue = new TaskQueue();
client.inventoryQueue = new TaskQueue();

client.events = new Collection();
client.cooldowns = new Collection();
client.commands = new Collection();

const { autofeedInit } = require("./functions/startup/autofeeds");
autofeedInit(client);

const { loadEvents } = require("./handlers/eventHandler");
loadEvents(client);

client.login(process.env.TOKEN);

module.exports = { client, bracketModelQueue, setupModelQueue, userStatQueue };
