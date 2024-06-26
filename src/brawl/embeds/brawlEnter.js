const { EmbedBuilder } = require("discord.js");
const config = require("../../../config.json");

function getEnterEmbed(setupModel) {
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
        `Name: **${name}**\n` +
        `Size: **${size}** card${size === 1 ? "" : "s"} submitted\n` +
        `Theme: **${theme}**\n` +
        `Series: **${series ?? "Any"}**\n` +
        `Date: <t:${unixStartTime}:f>`;
    const requirements =
        `**Requirements**:` +
        `${series ? "\n🏷️ Match series" : ""}\n` +
        `🖼️ Framed` +
        `${sketch === "prohibited" ? "\n" + sketchText : ""}\n\n` +
        `**Optional**:\n` +
        `🎨 Morphed\n` +
        `💧 Dyed\n` +
        `✂️ Trimmed` +
        `${sketch === "optional" ? "\n" + sketchText : ""}`;

    const embed = new EmbedBuilder()
        .setColor(config.embed.blue)
        .setTitle(`Enter Card Brawl`)
        .setDescription(headers + "\n\n" + requirements);
    return embed;
}

module.exports = getEnterEmbed;
