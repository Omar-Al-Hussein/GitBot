// script.js
import dotenv from 'dotenv';
dotenv.config();

import {
  Client,
  GatewayIntentBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  Events,
  Partials,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';

// Create client with necessary intents
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  partials: [Partials.Channel]
});

// When bot is ready
client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// When a new member joins
client.on(Events.GuildMemberAdd, async (member) => {
  try {
    // Send welcome message with a button to open modal
    const button = new ButtonBuilder()
      .setCustomId('openNicknameModal')
      .setLabel('Set Guild Wars 2 Nickname')
      .setStyle(ButtonStyle.Primary);

    await member.send({
      content: `👋 Welcome to the guild, ${member.user.username}!\nClick below to set your in-game nickname:`,
      components: [new ActionRowBuilder().addComponents(button)],
    });
  } catch (err) {
    console.error('❌ Could not DM user:', err);
  }
});

// When user clicks the button or submits the modal
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton() && interaction.customId === 'openNicknameModal') {
    const modal = new ModalBuilder()
      .setCustomId('nicknameModal')
      .setTitle('Guild Wars 2 Nickname')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('nicknameInput')
            .setLabel('Enter your in-game name (e.g., Omar.1234)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        )
      );

    await interaction.showModal(modal);
  }

  if (interaction.isModalSubmit() && interaction.customId === 'nicknameModal') {
    const nickname = interaction.fields.getTextInputValue('nicknameInput');
    const guild = interaction.client.guilds.cache.first();
    const member = guild.members.cache.get(interaction.user.id);

    if (member) {
      await member.setNickname(nickname).catch(console.error);
    }

    await interaction.reply({
      content: `✅ Your nickname has been set to **${nickname}**. Welcome to the guild!`,
      ephemeral: true
    });
  }
});

import dotenv from 'dotenv';
dotenv.config();

client.login(process.env.DISCORD_TOKEN);

