const { SlashCommandSubcommandBuilder, EmbedBuilder } = require("discord.js");
const BrawlSetupModel = require("../../../brawl/schemas/brawlSetupSchema");
const buttonPages = require("../../../support/src/pagination");
const config = require("../../../../config.json");

module.exports = {
    category: "public/brawl",
    data: new SlashCommandSubcommandBuilder()
        .setName("view")
        .setDescription("View Card Brawl competitors.")
        .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("Name of the Card Brawl to view competitors for.")
                .setRequired(true)
                // .setAutocomplete(true)
        ),
    async execute(interaction) {
        const name = interaction.options.getString("name");

        let setupModel;
        try {
            // Check if brawl exists
            setupModel = await BrawlSetupModel.findOne({ name }).exec();
            if (!setupModel) {
                return await interaction.reply(`There is no Card Brawl with that name.`);
            }
        } catch (error) {
            console.error("[BRAWL VIEW] Error retrieving BrawlSetupModel:", error);
            return await interaction.reply(
                `Error retrieving the Card Brawl competitors. Notifying <@${config.developerID}>.`
            );
        }

        // Format competitors into lines
        let lines = [];
        const mapArray = Array.from(setupModel.entries.entries());
        mapArray.forEach(([key, value]) => {
            const entries =
                value.length == 1 ? "(**1** entry)" : `(**${value.length}** entries)`;
            lines.push(`${lines.length + 1}. <@${key}> ${entries}`);
        });

        // Create page embeds
        let pages = [];
        let description = "";
        for (let i = 0, lineNum = 0, pageNum = 1; i < lines.length; i++) {
            description += lines[i] + "\n";
            lineNum++;

            if (lineNum === 10 || i === lines.length - 1) {
                const embed = new EmbedBuilder()
                    .setTitle(`${setupModel.name} Card Brawl`)
                    .setDescription("**Competitors**:\n" + description)
                    .setFooter({ text: `Page ${pageNum}` });
                pages.push(embed);

                lineNum = 0;
                pageNum++;
                description = "";
            }
        }
        buttonPages(interaction, pages, false);
    },
};
