const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

function getBrawlHelpEmbed() {
    const embed = new EmbedBuilder()
        .setTitle(`Card Brawl Help`)
        .setDescription(
            `Card Brawl hosts automated live bracket-style card competitions! To participate, players can compete by submitting cards and act as judges by voting during the live event. Learn more in the <#${config.brawlInfoChannelID}> channel.\n\n**Notifications**:\nGet notified for Card Brawl community events in <id:customize>.\n<@&${config.competitorRole}>: Get notified to submit cards to compete.\n<@&${config.judgeRole}>: Get notified when the event goes live.\n\n**Compete**:\nCard Brawls will be posted in <#${config.competitorsChannelID}> with requirements and details about how to join.\n\n**Judge**:\nCard Brawl live events will be hosted in <#${config.judgesChannelID}>. Card matchups will be displayed and players can react to vote with "1️⃣" or "2️⃣". It's a bracket-style tournament so stay to the end to determine the winner!`
        );
    return embed;
}

module.exports = getBrawlHelpEmbed;