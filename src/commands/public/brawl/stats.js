const { SlashCommandSubcommandBuilder } = require("discord.js");
const UserStatModel = require("../../../brawl/schemas/userStatSchema");
const getUserStatEmbed = require("../../../brawl/embeds/brawlUserStats");
const config = require("../../../../config.json");

module.exports = {
    category: "public/brawl",
    data: new SlashCommandSubcommandBuilder()
        .setName("stats")
        .setDescription("Retrieve a user's stats.")
        .addUserOption((option) =>
            option.setName("user").setDescription("User you want to get stats for.")
        ),
    async execute(interaction) {
        const user = interaction.options.getUser("user") ?? interaction.user;
        const userID = user.id;

        // Check if user already exists
        try {
            const setupModel = await UserStatModel.findOne({ userID }).exec();
            if (setupModel) {
                await interaction.reply({
                    embeds: [getUserStatEmbed(setupModel)],
                });
            } else {
                await interaction.reply({
                    content: `<@${userID}> has not participated in a Card Brawl yet.`,
                    allowedMentions: { parse: [] },
                });
            }
        } catch (error) {
            console.error("[BRAWL STATS] Error retrieving UserStatModel:", error);
            await interaction.reply(
                `Error retrieving user stats. Notifying <@${config.developerID}>.`
            );
        }
    },
};
