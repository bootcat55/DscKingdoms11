const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Show an example of an embed"),
    async execute(interaction) {
        const myEmbed = {
            color: 0xfa8072,
            title: "Embed Title",
            url: "https://youtube.com",
            author: {
                name: "Author Name",
                icon_url: "https://",
                url: "https://",
            },
            description: "Embed Description Here",
            thumbnail: {
                url: "https://shorturl.at/ntuAV",
            },
            fields: [
                {
                    name: "Normal Embed Field",
                    value: "This is a regular field",
                },
                {
                    name: "\u200B",
                    value: "\u200B",
                },
                {
                    name: "Inline Embed Field",
                    value: "This is an inline field",
                    inline: true,
                },
                {
                    name: "Inline Embed Field",
                    value: "This is an inline field",
                    inline: true,
                },
                {
                    name: "Inline Embed Field",
                    value: "This is an inline field",
                    inline: true,
                },
            ],
            image: {
                url: "https://shorturl.at/ajUY8",
            },
            timestamp: new Date().toISOString(),
            footer: {
                text: "Footer text here!",
                icon_url: "https://",
            },
        };

        await interaction.reply({ embeds: [myEmbed] });
    },
};