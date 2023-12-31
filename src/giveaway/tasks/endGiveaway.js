const { ActionRowBuilder, EmbedBuilder } = require("discord.js");
const GiveawayModel = require("../schemas/giveawaySchema");
const ScheduleModel = require("../../schedule/schemas/scheduleSchema");
const UserInventoryModel = require("../../inventory/schemas/userInventorySchema");
const getWinnerEmbed = require("../../giveaway/embeds/giveawayWinner");
const rollWinner = require("../src/rollWinner");
const client = require("../../index");
const config = require("../../../config.json");

async function endGiveaway(data) {
    const messageID = data.messageID;
    const giveawayChannel = client.channels.cache.get(config.channelID.giveaway);
    const winnersChannel = client.channels.cache.get(config.threadID.giveawayWinners);
    const giveawayModel = await GiveawayModel.findOne({ messageID }).exec();
    if (!giveawayModel) {
        console.error("Couldn't find giveaway model in database");
    }

    const message = await giveawayChannel.messages.fetch(messageID);

    // Set embed color to red
    const embed = EmbedBuilder.from(message.embeds[0]);
    embed.setColor(config.embed.red);

    // Disable entries by disabling button
    const row = ActionRowBuilder.from(message.components[0]);
    row.components[0].setDisabled(true);

    message.edit({ embeds: [embed], components: [row] });

    giveawayModel.open = false;
    const giveawayTask = async () => {
        await giveawayModel.save();
    };
    await client.giveawayQueue.enqueue(giveawayTask);
    console.log("Closed giveaway");

    // Calculate yield to give sponsor
    const totalTokens = [...giveawayModel.entries.values()].reduce(
        (sum, weight) => sum + weight,
        0
    );
    const yield = Math.floor(totalTokens / config.giveaway.percentYield);

    // Give sponsor tokens
    const userID = giveawayModel.sponsor;
    if (yield > 0) {
        const inventoryTask = async () => {
            let inventoryModel = await UserInventoryModel.findOne({ userID }).exec();
            if (!inventoryModel) {
                inventoryModel = new UserInventoryModel({
                    userID: userID,
                    lastUnixTime: 0,
                    tokenCounter: 0,
                });
            }
            inventoryModel.numTokens += yield;
            await inventoryModel.save();
        };
        await client.inventoryQueue.enqueue(inventoryTask);

        await winnersChannel.send(
            `Thank you <@${userID}> for sponsoring this giveaway! You've received **${yield} ${config.emoji.token} Tokens**!`
        );
    } else {
        await winnersChannel.send(
            `Thank you <@${userID}> for sponsoring this giveaway! Unfortunately, not enough people entered the giveaway so you received **${yield} ${config.emoji.token} Tokens**.`
        );
    }
    console.log("Gave sponsor tokens");

    // Get array of winners and convert to mentions
    const winnerArray = await rollWinner(giveawayModel, giveawayModel.winners);
    if (!winnerArray) {
        await winnersChannel.send("There are no participants to roll as winners.");
        console.warn("There are no participants to roll as winners");
    } else {
        const addMentions = [...winnerArray.map((element) => `<@${element}>`)];
        const winnerMentions = addMentions.join(", ");

        await winnersChannel.send({
            content: `Congrats to ${winnerMentions}! 🎉`,
            embeds: [
                getWinnerEmbed(
                    winnerMentions,
                    giveawayModel.host,
                    messageID,
                    giveawayModel.prize
                ),
            ],
        });
    }

    // Delete schedule
    const name = data.scheduleName;
    try {
        await ScheduleModel.deleteOne({ name }).exec();
        console.log(`Schedule deleted ${name}`);
    } catch (error) {
        console.error(`Error deleting schedule ${name}:`, error);
    }
}

module.exports = endGiveaway;
