const { SlashCommandBuilder } = require("discord.js");
const profileModel = require("../models/profileSchema");
const { customRoleCost, customRoleEditCost } = require("../shopPrices.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("A shop where you can spend your coins")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("custom-role")
                .setDescription(`Buy a custom role for ${customRoleCost} coins`)
                .addStringOption((option) => 
                    option
                        .setName("action")
                        .setDescription("Choose to edit or buy a custom role")
                        .addChoices(
                            { 
                                name: `Buy Role (${customRoleCost} coins)`, 
                                value: "buy", 
                            },
                            { 
                                name: `Edit Role (${customRoleEditCost} coins)`, 
                                value: "edit", 
                            }
                        )
                        .setRequired(true)
                )
                .addStringOption((option) => 
                    option
                        .setName("name")
                        .setDescription("Choose the name of your role")
                        .setMinLength(1)
                        .setMaxLength(25)
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("color")
                        .setDescription("Choose a color for your role")
                        .addChoices(
                            { name: "Red" , value: "0xFF0000"},
                            { name: "Cyan" , value: "0x00FFFF"},
                            { name: "Blue" , value: "0x0000FF"},
                            { name: "Yellow" , value: "0xFFFF00"},
                            { name: "Magenta" , value: "0xFF00FF"}
                        )
                        .setRequired(true)
                )
            )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("custom-role-remove")
                .setDescription("Delete your custom role for free")
        ),
    async execute(interaction, profileData) {
        const { balance, userId, customRoleId } = profileData;
        const shopCommand = interaction.options.getSubcommand();

        if (shopCommand === "custom-role") {
            const action = interaction.options.getString("action");
            const name = interaction.options.getstring("name");
            const color = interaction.options.getString("color");

            if (action === "edit") {
                if (customRoleId === "") {
                    await interaction.deferReply({ephemeral: true});
                    return await interaction.editReply(
                        "You need to buy a custom role first"
                    );
                } else if (balance < customRoleEditCost) {
                    await interaction.deferReply({ephemeral: true});
                    return await interaction.editReply(
                        `You need ${customRoleEditCost} coins to edit a custom role`
                    );
                }

                await interaction.deferReply();

                const customRole = await interaction.guild.roles.fetch(
                    customRoleId
                );

                customRole.edit({ name, color });

                await profileModel.findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $inc: {
                            balance: -customRoleEditCost,
                        },
                    }
                );

                await interaction.editReply(
                    "Successfully edited a custom role."
                );
            }

            if (action === "buy") {
                if (customRoleId !== "") {
                    await interaction.deferReply({ ephemeral: true});
                    return await interaction.editReply(
                        "You already have a custom role!"
                    );
                } else if (balance < customRoleCost) {
                    await interaction.deferReply({ ephemeral: true });
                    return await interaction.editReply(
                        `You need ${customRoleCost} coins to buy a custom role`
                    );
                }
    
                await interaction.deferReply();
    
                const customRole = await interaction.guild.role.create({
                    name,
                    Permissions: [],
                    color,
                });
    
                interaction.member.roles.add(customRole);
    
                await profileModel.findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $set: {
                            customRoleId: customRole.id
                        },
                        $inc: {
                            balance: -customRoleCost,
                        },
                    }
                );
    
                await interaction.editReply("Successfully bought custom role!")
            }            
        }

        if (shopCommand === "custom-role-remove") {
            if (customRoleId === "") {
                await interaction.deferReply({ ephemeral: true });
		return interaction.editReply("You do not have a custom role");
            }
	    await interaction.deferReply();

	    const customRole = await interaction.guild.roles.fetch(
		customRoleId
	    );

            customRole.delete();

            await profileModel.findOneAndUpdate(
                {
                    userId,
                },
                {
                    $set: {
                        customRoleId: "",
                    },
                }
            );

            await interaction.editReply("Your custom role has been deleted");
        }
    },
};