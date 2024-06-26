const { Events } = require("discord.js");
const UserInventoryModel = require("../../inventory/schemas/userInventorySchema");
const client = require("../../index");
const config = require("../../../config.json");

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (
            (message.channel.id === config.channelID.karutaMain ||
                message.channel.id === config.channelID.karutaDrop) &&
            message.author.bot &&
            message.author.id === config.botID.karuta
        ) {
            // Karuta wishlist
            if (
                message.content.includes("A card from your wishlist is dropping") ||
                message.content.includes("A wishlisted card is dropping")
            ) {
                console.log("[INFO] [readMessages] Karuta wishlist card dropped");
                message.channel.send(
                    `<@&${config.roleID.karutaWishlist}> A wishlisted card is dropping!`
                );
                return;
            }

            // Check for Karuta event drops on server and user drops
            if (
                message.content.includes("I'm dropping") ||
                message.content.includes("is dropping")
            ) {
                // Emoji filter
                const filter = (reaction, reactingUser) => {
                    return (
                        reactingUser.id === config.botID.karuta &&
                        (reaction.emoji.name === "🍬" ||
                            reaction.emoji.name === "🍫" ||
                            reaction.emoji.name === "🎀" ||
                            reaction.emoji.name === "🥀" ||
                            reaction.emoji.name === "🌻" ||
                            reaction.emoji.name === "🌹" ||
                            reaction.emoji.name === "🌼" ||
                            reaction.emoji.name === "🌷" ||
                            reaction.emoji.name === "💐" ||
                            reaction.emoji.name === "stEgg1a" ||
                            reaction.emoji.name === "stEgg2a" ||
                            reaction.emoji.name === "stEgg3a" ||
                            reaction.emoji.name === "stEgg4a" ||
                            reaction.emoji.name === "stEgg5a" ||
                            reaction.emoji.name === "stEgg6a" ||
                            reaction.emoji.name === "stEgg7a" ||
                            reaction.emoji.name === "stEgg8a" ||
                            reaction.emoji.name === "stEgg9a" ||
                            reaction.emoji.name === "stEgg10a" ||
                            reaction.emoji.name === "stEgg11a" ||
                            reaction.emoji.name === "stEgg12a" ||
                            reaction.emoji.name === "stEgg13a" ||
                            reaction.emoji.name === "stEgg14a" ||
                            reaction.emoji.name === "stEgg15a" ||
                            reaction.emoji.name === "stEgg16a" ||
                            reaction.emoji.name === "stEgg17a" ||
                            reaction.emoji.name === "stEgg18a" ||
                            reaction.emoji.name === "stEgg19a" ||
                            reaction.emoji.name === "stEgg20a")
                    );
                };

                // Wait for reaction
                try {
                    const collector = message.createReactionCollector({
                        filter,
                        max: 1,
                        time: 6 * 1000,
                    });

                    collector.on("collect", (reaction) => {
                        const emoji = reaction.emoji.name;
                        if (emoji.includes("stEgg")) {
                            const number = parseInt(emoji.match(/\d+/)[0]);
                            message.reply(
                                `<@&${config.roleID.karutaEvent}> **:nest_with_eggs: Springtide Egg #${number}** has dropped!`
                            );
                        } else {
                            message.reply(
                                `<@&${config.roleID.karutaEvent}> A ${emoji} has dropped!`
                            );
                        }
                    });

                    collector.on("end", (collected) => {
                        if (collected.size > 0) {
                            console.log(
                                `[INFO] [readMessages] Karuta event reaction collected`
                            );
                        }
                    });
                } catch (error) {
                    console.error(
                        "[ERROR] [readMessages] Something went wrong with the Karuta drop. Couldn't find reactions",
                        error
                    );
                }

                const guild = client.guilds.cache.get(config.guildID);
                const starflight = await guild.members.fetch(config.botID.starflight);
                // Only server drop ping if other bot is offline
                if (
                    starflight.presence === null ||
                    starflight.presence.status !== "online"
                ) {
                    if (
                        message.content.includes(
                            "cards since this server is currently active"
                        )
                    ) {
                        const regex = /dropping (\d+) cards/; // This regex captures the number after "dropping" and before "cards"
                        const match = message.content.match(regex);
                        if (!match) {
                            console.warn(
                                "[WARN] [readMessages] Couldn't find number of cards dropped"
                            );
                            return;
                        }
                        const numCards = parseInt(match[1], 10);

                        console.log("[INFO] [readMessages] Karuta drop ping");
                        message.reply(
                            `<@&${config.roleID.karutaDrop}> ${numCards} cards are dropping!`
                        );
                        return;
                    }
                }
            }
        }

        if (
            message.channel.id === config.channelID.sofiDrop &&
            message.author.bot &&
            message.author.id === config.botID.sofi
        ) {
            try {
                // Sofi wishlist
                if (message.content.includes("A card from your wishlist is dropping")) {
                    console.log("[INFO] [readMessages] Sofi wishlist card dropped");
                    message.channel.send(
                        `<@&${config.roleID.sofiWishlist}> A wishlisted card is dropping!`
                    );
                    return;
                }
            } catch (error) {
                console.error(
                    "[ERROR] [readMessages] Failed to send Sofi drop ping",
                    error
                );
            }
        }

        if (
            message.channel.id === config.channelID.tofuSummon &&
            message.author.bot &&
            message.author.id === config.botID.tofu
        ) {
            try {
                // Tofu wishlist
                if (
                    message.content.includes(
                        "A card from your summon list is being summoned"
                    )
                ) {
                    console.log("[INFO] [readMessages] Tofu wishlist card dropped");
                    message.channel.send(
                        `<@&${config.roleID.tofuWishlist}> A wishlisted card is dropping!`
                    );
                    return;
                }

                // Tofu drop
                if (message.content.includes(`Server activity has summoned`)) {
                    const regex = /summoned (\d+) cards/;
                    const match = message.content.match(regex);
                    if (match) {
                        const numCards = parseInt(match[1], 10);

                        console.log("[INFO] [readMessages] Tofu drop ping");
                        message.reply(
                            `<@&${config.roleID.tofuDrop}> ${numCards} cards are dropping!`
                        );
                    }
                }
            } catch (error) {
                console.error(
                    "[ERROR] [readMessages] Failed to send Sofi drop ping",
                    error
                );
            }
        }

        if (
            message.channel.id === config.channelID.gachaponDrop &&
            message.author.bot &&
            message.author.id === config.botID.gachapon
        ) {
            try {
                // Gachapon wishlist
                if (
                    message.content.includes(
                        "A card from your wish list is being dropped!"
                    )
                ) {
                    console.log("[INFO] [readMessages] Gachapon wishlist card dropped");
                    message.channel.send(
                        `<@&${config.roleID.gachaponWishlist}> A wishlisted card is dropping!`
                    );
                    return;
                }

                // Gachapon drop
                if (
                    message.content.includes(`is dropping`) &&
                    message.mentions.users.first().id === config.botID.gachapon
                ) {
                    const regex = /dropping (\d+) cards/;
                    const match = message.content.match(regex);
                    if (!match) {
                        console.warn(
                            "[WARN] [readMessages] Couldn't find number of cards dropped"
                        );
                        return;
                    }
                    const numCards = parseInt(match[1], 10);

                    console.log("[INFO] [readMessages] Gachapon drop ping");
                    message.reply(
                        `<@&${config.roleID.gachaponDrop}> ${numCards} cards are dropping!`
                    );
                }
            } catch (error) {
                console.error(
                    "[ERROR] [readMessages] Failed to send Gachapon drop ping",
                    error
                );
            }
        }

        if (
            message.author.bot &&
            (message.author.id === config.botID.karuta ||
                message.author.id === config.botID.sofi ||
                message.author.id === config.botID.tofu ||
                message.author.id === config.botID.gachapon)
        ) {
            // User dropped cards
            if (
                (message.content.includes("dropping") ||
                    message.content.includes("summoning")) &&
                !message.content.includes("wishlist")
            ) {
                // Message has to actually ping (mention) the user
                const user = message.mentions.users.first();
                if (!user) {
                    // console.warn(
                    //     "[WARN] [readMessages] Couldn't find user that dropped cards:",
                    //     message.url
                    // );
                    return;
                }
                if (user.bot) {
                    return;
                }

                const task = async () => {
                    const userID = user.id;
                    const currentUnixTime = Math.floor(Date.now() / 1000);

                    const uim = await UserInventoryModel.findOne({ userID }).exec();
                    // Inventory doesn't exist, create one
                    if (!uim) {
                        console.log(`[INFO] [inventory] Inventory created: ${user.tag}`);
                        const model = new UserInventoryModel({
                            userID: userID,
                            lastUnixTime: currentUnixTime,
                            tokenCounter: 1,
                        });
                        await model.save();
                        return;
                    }

                    // Inventory exists, check cooldown
                    if (currentUnixTime >= uim.lastUnixTime + 30 * 60) {
                        uim.tokenCounter++;
                        uim.lastUnixTime = currentUnixTime;
                        console.log(
                            `[INFO] [inventory] Token counter ${uim.tokenCounter}: ${user.tag}`
                        );

                        if (uim.tokenCounter === 5) {
                            uim.tokenCounter = 0;

                            const guild = client.guilds.cache.get(config.guildID);
                            const member = await guild.members.fetch(userID);

                            // Award tokens
                            const hasSubscriberRole = member.roles.cache.some(
                                (role) => role.id === config.roleID.serverSubscriber
                            );
                            if (hasSubscriberRole) {
                                const amount = config.token.serverSubscriber;
                                uim.numTokens += amount;
                                message.channel.send({
                                    content: `<@${userID}>, you received **${amount} ${config.emoji.token} Tokens**! Thank you for being a <@&${config.roleID.serverSubscriber}>.`,
                                    allowedMentions: { parse: ["users"] },
                                });
                            } else {
                                uim.numTokens++;
                                message.channel.send(
                                    `<@${userID}>, you received a ${config.emoji.token} **Token**!`
                                );
                            }
                            console.log(`[INFO] [inventory] Token received: ${user.tag}`);

                            // Award active player role
                            const hasActiveRole = member.roles.cache.some(
                                (role) => role.id === config.roleID.activePlayer
                            );
                            if (!hasActiveRole) {
                                member.roles.add(
                                    guild.roles.cache.get(config.roleID.activePlayer)
                                );
                                message.channel.send({
                                    content: `<@${userID}>, you've been recognized as an <@&${config.roleID.activePlayer}> and earned access to <#${config.channelID.karutaMain}> for server drops!`,
                                    allowedMentions: { parse: ["users"] },
                                });
                                console.log(
                                    `[INFO] [inventory] Granted access to 'Karuta main': ${user.tag}`
                                );
                            }
                        }
                        await uim.save();
                    }
                };

                try {
                    await client.inventoryQueue.enqueue(task);
                } catch (error) {
                    console.error("[ERROR] [inventory]", error);
                }
            }
        }
    },
};
