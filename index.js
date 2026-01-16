const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const TOKEN = 'MTQ2MDg1NDI0MjU5MTExNzUwNA.GXAoSu.bY9klXE4Kg4bXguoV0LJDZ0nyuZwNO825c4fXI';
const LINKS_CHANNEL_ID = '1460850841610092678';
const COMMANDS_CHANNEL_ID = '1460847537232678942';

const linksMessage = `
📱 **My Social Links**

Twitch: https://twitch.tv/itzmalimo  
YouTube: https://youtube.com/@itzmalimo  
TikTok: https://tiktok.com/@itzmalimo  
Instagram: https://instagram.com/itzmalimo  
`;

const cooldowns = new Map();
const COOLDOWN_TIME = 10 * 1000; // 10 seconds

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    const channel = await client.channels.fetch(LINKS_CHANNEL_ID);
    await channel.send(linksMessage);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === '!links') {

        // Only allow in #commands channel
        if (message.channel.id !== COMMANDS_CHANNEL_ID) {
            const commandsChannel = await message.guild.channels.fetch(COMMANDS_CHANNEL_ID);
return message.reply(`❌ Please use this command in ${commandsChannel}.`);
        }

        const userId = message.author.id;
        const now = Date.now();

        if (cooldowns.has(userId)) {
            const expiration = cooldowns.get(userId) + COOLDOWN_TIME;
            if (now < expiration) {
                const remaining = Math.ceil((expiration - now) / 1000);
                return message.reply(`Please wait ${remaining} seconds before using this command again.`);
            }
        }

        cooldowns.set(userId, now);

        await message.channel.send(linksMessage);

        setTimeout(() => {
            cooldowns.delete(userId);
        }, COOLDOWN_TIME);
    }
});

client.login(TOKEN);
