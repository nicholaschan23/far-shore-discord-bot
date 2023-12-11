const { EmbedBuilder } = require("discord.js");
const { config } = require("../../index");

function getAnnouncementEmbed(setupModel) {
    const name = setupModel.name;
    const theme = setupModel.theme;
    const series = setupModel.series;
    const sketch = setupModel.sketch;
    const size = setupModel.cards.size;
    const unixStartTime = setupModel.unixStartTime;

    let sketchText;
    switch (sketch) {
        case "prohibited": {
            sketchText = "🩸 Not Sketched";
            break;
        }
        case "optional": {
            sketchText = "🩸 Sketched";
            break;
        }
    }

    // Description
    const headers =
        `Size: **${size}** card${size === 1 ? "" : "s"} submitted\n` +
        `Theme: **${theme}**\n` +
        `Series: **${series ?? "Any"}**\n` +
        `Date: <t:${unixStartTime}:f>`;
    const requirements =
        `**Requirements**:` +
        `${series ? "\n🏷️ Match series" : ""}\n` +
        `🖼️ Framed\n` +
        `🎨 Morphed` +
        `${sketch === "prohibited" ? "\n" + sketchText : ""}\n\n` +
        `**Optional**:\n` +
        `💧 Dyed\n` +
        `✂️ Trimmed` +
        `${sketch === "optional" ? "\n" + sketchText : ""}`;
    const bonuses =
        `**Entries**:\n` +
        `@everyone **1** entry\n` +
        `<@&${config.roleID.serverSubscriber}> **${config.brawl.serverSubscriberEntry}** entries\n\n` +
        `**Bonus Votes**: *(Does not stack)*\n` +
        `<@&${config.roleID.activeBooster}> **+${config.brawl.activeBoosterBonus}** vote\n` +
        `<@&${config.roleID.serverSubscriber}> **+${config.brawl.serverSubscriberBonus}** vote`;

    const embed = new EmbedBuilder()
        .setColor(config.embed.blue)
        .setTitle(`${name}`)
        .setDescription(headers + "\n\n" + requirements + "\n\n" + bonuses);
    return embed;
}

module.exports = getAnnouncementEmbed;
