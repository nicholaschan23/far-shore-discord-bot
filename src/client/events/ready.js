const { Events } = require("discord.js");
const loadAutofeed = require("../../schedule/src/loadAutofeed");
const removeInactive = require("../../inactive/src/removeInactive")
const loadCommands = require("../handlers/commandHandler");
const loadSchedules = require("../../schedule/src/loadSchedules");
const client = require("../../index");

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute() {
        console.log(`[READY] Client logged in as ${client.user.tag}`);
        client.user.setActivity("in the Far Shore");

        loadCommands();
        loadSchedules();
        loadAutofeed();
        removeInactive();
    },
};
