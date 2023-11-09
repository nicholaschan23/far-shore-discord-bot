const { EmbedBuilder } = require("discord.js");
const color = require("../color-config.json");
const config = require("../../../config.json");

const colors = `<@&${color.red}>\n<@&${color.pink}>\n<@&${color.purple}>\n<@&${color.deepPurple}>\n<@&${color.indigo}>\n<@&${color.blue}>\n<@&${color.lightBlue}>\n<@&${color.cyan}>\n<@&${color.teal}>\n<@&${color.green}>`;
const neonColors = `<@&${color.neonRed}>\n<@&${color.neonPink}>\n<@&${color.neonPurple}>\n<@&${color.neonDeepPurple}>\n<@&${color.neonIndigo}>\n<@&${color.neonBlue}>\n<@&${color.neonLightBlue}>\n<@&${color.neonCyan}>\n<@&${color.neonTeal}>\n<@&${color.neonGreen}>`;

function getPreviewEmbed() {
    const embed = new EmbedBuilder()
        .setTitle("Color Role")
        .setDescription("Select a color using the dropdown menu below.")
        .addFields({ name: `${color.cost} ${config.emojiToken}`, value: colors, inline: true }, { name: `${color.neonCost} ${config.emojiToken}`, value: neonColors, inline: true });
    return embed;
}

module.exports = getPreviewEmbed;
