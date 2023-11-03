const { SlashCommandBuilder } = require("discord.js");
const getInventoryEmbed = require("../../functions/embeds/userInventory");
const config = require("../../../config.json");
const UserInventoryModel = require("../../data/schemas/userInventorySchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("View user inventory.")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("To view the inventory for a user, please provide their name.")
        ),
    category: "public",
    async execute(interaction) {
        const user = interaction.options.getUser("user") ?? interaction.user;
        const userID = user.id;

        try {
            // Check if inventory exists
            const inventoryModel = await UserInventoryModel.findOne({ userID }).exec();

            // Checking for self
            if (userID === interaction.user.id) {
                // Inventory doesn't exist
                if (!inventoryModel) {
                    return await interaction.reply({
                        content: `<@${userID}>, you have no inventory yet.`,
                        allowedMentions: { parse: [] },
                    });
                }
                // Private inventory
                if (!inventoryModel.private) {
                    return await interaction.reply({
                        embeds: getInventoryEmbed(inventoryModel),
                        allowedMentions: { parse: [] },
                        ephermeral: true,
                    });
                }
            } else {
                if (!inventoryModel) {
                    return await interaction.reply({
                        content: `<@${userID}> has no inventory yet.`,
                        allowedMentions: { parse: [] },
                    });
                }
                // Private inventory
                if (!inventoryModel.private) {
                    return await interaction.reply({
                        content: `<@${userID}>'s inventory is private.`,
                        allowedMentions: { parse: [] },
                    });
                }
            }
            await interaction.reply({
                embeds: getInventoryEmbed(inventoryModel),
            });
        } catch (error) {
            console.error("[INVENTORY] Error retrieving UserInventoryModel:", error);
            await interaction.reply(
                `Error retrieving the user's inventory. Notifying <@${config.developerID}>.`
            );
        }
    },
};