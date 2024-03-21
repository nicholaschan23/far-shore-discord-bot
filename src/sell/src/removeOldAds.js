const CardAdModel = require("../schemas/cardAdSchema");
const client = require("../../index");
const config = require("../../../config.json");
const cron = require("node-cron");

async function removeOldAds() {
    // Get timestamp from 2 weeks ago
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const timestampThreshold = Math.floor(twoWeeksAgo.getTime() / 1000);
    // const oneMonthAgo = new Date();
    // oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    // const timestampThreshold = Math.floor(oneMonthAgo.getTime() / 1000);

    let totalMessagesDeleted = 0;
    const task = async () => {
        const batchSize = 100;
        const channel = client.channels.cache.get(config.channelID.cardAds);
        while (true) {
            // Query models with timestamp less than the threshold
            const modelsToDelete = await CardAdModel.find({
                timestamp: { $lt: timestampThreshold },
            }).limit(batchSize);

            if (modelsToDelete.length === 0) {
                break;
            }

            // Extract message IDs from the models
            const messageIDsToDelete = modelsToDelete.map((model) => model.messageID);

            // Bulk delete the fetched messages
            try {
                await channel.bulkDelete(messageIDsToDelete);
            } catch (error) {
                for (let i = 0; i < modelsToDelete.length; i++) {
                    const messageID = messageIDsToDelete[i];
                    const message = await channel.messages.fetch(messageID);
                    if (message) {
                        await message.delete();
                        // console.log(`Deleted message ID: ${messageID}`);
                    }
                }
            }
            console.log(
                `[INFO] [removeOldAds] Deleted ${messageIDsToDelete.length} messages.`
            );

            await CardAdModel.deleteMany({ timestamp: { $lt: timestampThreshold } });
            totalMessagesDeleted += modelsToDelete.length;
        }
    };

    try {
        await client.cardAdsQueue.enqueue(task);
        return totalMessagesDeleted;
    } catch (error) {
        console.log(`[ERROR] [removeOldAds]:`, error);
        return -1;
    }
}

function scheduleRemoveOldAds() {
    /**
     * 0 minutes
     * 23 hours (11 PM)
     * * any day of the month
     * * any month
     * * everyday
     */
    cron.schedule("0 23 * * *", async () => {
        removeOldAds();
    });

    console.log("[INFO] [removeOldAds] Scheduled remove old ads daily");
}

module.exports = { removeOldAds, scheduleRemoveOldAds };
