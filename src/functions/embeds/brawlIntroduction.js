const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

function getIntroductionEmbed(setupModel) {
    const embed = new EmbedBuilder()
        .setTitle(`Live Event`)
        .setDescription(
            `Welcome to the **${setupModel.name}** Card Brawl! There are a total of **${setupModel.size}** cards in this competition. Stick around to the end to see how it all unfolds! 🥊\n\n**Theme**:\nCast your votes for the cards you believe best fit the \`theme\`: **${setupModel.theme}**\n\n**How To Play**:\nFor each match, you have \`${config.voteTime} seconds\` to vote by reacting with "1️⃣" or "2️⃣"! The card with more votes moves on to the next round. This repeats until a winner is decided.\n\nCheck the https://discord.com/channels/${config.guildID}/${config.competitorsChannelID}/${setupModel.messageID} for info on unqiue bonuses.\n\n**Chat**:\nFeel free to join a <#1157036694802014319> voice channel to talk with people during the event!`
        );
    return embed;
}

module.exports = { getIntroductionEmbed };
