const {SlashCommandBuilder} = require("discord.js");
const parseMilliseconds = require("parse-ms-2");
const profileModel = require("../models/profileSchema.js");
const { dailyMin, dailyMax } = require("../globalValues.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Redeem free coins every day"),
    async execute(interaction, profileData) {
        const {id} = interaction.user;
        const {dailyLastUsed} = profileData;

        const cooldown = 4000; //86400000; //24 hours = 86400000 milliseconds.
        const timeLeft = cooldown - (Date.now() - dailyLastUsed);

        if(timeLeft > 0) {
            await interaction.deferReply({ ephemeral: true });
            const { hours, minutes, seconds } = parseMilliseconds(timeLeft);
            await interaction.editReply(
                `Claim your next daily in ${hours} hrs ${minutes} min ${seconds} sec`
            );
        }

        await interaction.deferReply();

        const randomAmt = Math.floor(
            Math.random() * (dailyMax - dailyMin + 1) + dailyMin
        );

        try {
            await profileModel.findOneAndUpdate(
            {userId: id},
            {
                $set: {
                    dailyLastUsed: Date.now(),
                },
                $inc: {
                    balance: randomAmt,
                },
            }
            );
        } catch (error) {
        console.log(error);
        }

        await interaction.editReply(`You redeemed ${randomAmt} coins!`);
    },
};