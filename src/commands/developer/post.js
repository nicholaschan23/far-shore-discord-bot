const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const rules = require("./post/rules");
const features = require("./post/features");
const brawlInfo = require("./post/brawlInfo");
const karutaGuide = require("./post/karutaGuide");
const perks = require("./post/perks");
const cardInfo = require("./post/cardInfo");
const marketInfo = require("./post/marketInfo");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("post")
    .setDescription("Post main command.")
    .addSubcommand(rules.data)
    .addSubcommand(features.data)
    .addSubcommand(brawlInfo.data)
    .addSubcommand(karutaGuide.data)
    .addSubcommand(perks.data)
    .addSubcommand(cardInfo.data)
    .addSubcommand(marketInfo.data)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    category: "developer",
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case "rules": {
                await rules.execute(interaction);
                break;
            }
            case "features": {
                await features.execute(interaction);
                break;
            }
            case "brawl-info": {
                await brawlInfo.execute(interaction);
                break;
            }
            case "karuta-guide": {
                await karutaGuide.execute(interaction);
                break;
            }
            case "perks": {
                await perks.execute(interaction);
                break;
            }
            case "card-info": {
                await cardInfo.execute(interaction);
                break;
            }
            case "market-info": {
                await marketInfo.execute(interaction);
                break;
            }
            default: {
                console.error(
                    "[ERROR] [post] There was no execute case for the '${subcommand}' subcommand"
                );
                await interaction.reply(
                    `There was no execute case for the \`${subcommand}\` subcommand.`
                );
            }
        }
    },
};
