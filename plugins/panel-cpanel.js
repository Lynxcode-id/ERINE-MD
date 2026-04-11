/*
📌 Nama Fitur: Cpanel (Auto Create Server)
🏷️ Type : Plugin ESM
🔗 Developed for : Erine-MD | INF PROJECT
✍️ Moded by : Lynx Decode
*/

import fetch from 'node-fetch';
import pkg from '@wishkeysocket/baileys';
const { proto } = pkg;
import '../config.js';

function generatePassword(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

const handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`Contoh:\n\n*${command} username,628xxx* atau *${command} username*`);

  let [usernem, nom] = text.split(',').map(s => s.trim());
  if (!usernem) return m.reply(`Contoh:\n\n*${command} username,628xxx* atau *${command} username*`);

  const username = usernem.toLowerCase();
  const nomor = nom
    ? nom.replace(/\D/g, '') + '@s.whatsapp.net'
    : m.chat.endsWith('@g.us')
      ? m.sender
      : m.chat;

  const email = `${username}@gmail.com`;
  const password = generatePassword();
  const name = username.charAt(0).toUpperCase() + username.slice(1) + " Server";

  // Pastikan variabel ini ada di config.js lu
  const { egg, nestid, loc, domain, apikey } = global;

  const resourceMap = {
    '1gb': { ram: "1024", disk: "1024", cpu: "50" },
    '2gb': { ram: "2048", disk: "2048", cpu: "100" },
    '3gb': { ram: "3072", disk: "3072", cpu: "150" },
    '4gb': { ram: "4096", disk: "4096", cpu: "200" },
    '5gb': { ram: "5120", disk: "5120", cpu: "250" },
    'unlimited': { ram: "0", disk: "0", cpu: "0" },
    'unli': { ram: "0", disk: "0", cpu: "0" }
  };

  const { ram, disk, cpu } = resourceMap[command.toLowerCase()] || { ram: "0", disk: "0", cpu: "0" };

  try {
    await m.react('⏳');

    // 1. Create User
    const userRes = await fetch(`${domain}/api/application/users`, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + apikey
      },
      body: JSON.stringify({
        email,
        username,
        first_name: name,
        last_name: "INF",
        language: "en",
        password
      })
    });

    const userJson = await userRes.json();
    if (userJson.errors) return m.reply("❌ Error create user: " + userJson.errors[0].detail);
    const user = userJson.attributes;

    // 2. Get Startup Command
    const eggRes = await fetch(`${domain}/api/application/nests/${nestid}/eggs/${egg}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + apikey
      }
    });

    const eggJson = await eggRes.json();
    const startup_cmd = eggJson.attributes.startup;

    // 3. Create Server (Node.js 22 LTS)
    const serverRes = await fetch(`${domain}/api/application/servers`, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + apikey
      },
      body: JSON.stringify({
        name,
        description: `Erine-MD Server: ${new Date().toLocaleString()}`,
        user: user.id,
        egg: parseInt(egg),
        docker_image: "ghcr.io/parkervcp/yolks:nodejs_22",
        startup: startup_cmd,
        environment: {
          INST: "npm",
          USER_UPLOAD: "0",
          AUTO_UPDATE: "0",
          CMD_RUN: "npm start"
        },
        limits: { memory: ram, swap: 0, disk, io: 500, cpu },
        feature_limits: { databases: 5, backups: 5, allocations: 5 },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: []
        }
      })
    });

    const serverJson = await serverRes.json();
    if (serverJson.errors) return m.reply("❌ Error create server: " + serverJson.errors[0].detail);
    const server = serverJson.attributes;

    const teks = `乂  *E R I N E  -  M D  P A N E L*

┌  ◦ *ID Server:* ${server.id}
│  ◦ *Username:* ${user.username}
│  ◦ *Password:* ${password}
│  ◦ *Host:* ${domain}
└  ◦ *Date:* ${new Date().toLocaleDateString()}

*𝐒𝐩𝐞𝐬𝐢𝐟𝐢𝐤𝐚𝐬𝐢:*
◦ RAM: ${ram == "0" ? "Unlimited" : ram + "MB"}
◦ Disk: ${disk == "0" ? "Unlimited" : disk + "MB"}
◦ CPU: ${cpu == "0" ? "Unlimited" : cpu + "%"}
◦ Engine: Node.js 22

> © INF PROJECT | JEMIMA-MD`.trim();

    const msg = {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({ text: teks }),
            footer: proto.Message.InteractiveMessage.Footer.create({ text: "Erine-MD Project" }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons: [
                {
                  name: "cta_copy",
                  buttonParamsJson: JSON.stringify({
                    display_text: "📋 Salin Username",
                    copy_code: user.username
                  })
                },
                {
                  name: "cta_copy",
                  buttonParamsJson: JSON.stringify({
                    display_text: "🔐 Salin Password",
                    copy_code: password
                  })
                }
              ]
            })
          })
        }
      }
    };

    // Kirim ke target
    await conn.relayMessage(nomor, msg.message, { messageId: m.key.id });

    if (nomor !== m.chat) {
      await m.reply(`✅ *Done!* Akun panel sudah dikirim ke private chat @${nomor.split('@')[0]}`, null, { mentions: [nomor] });
    }
    await m.react('✅');

  } catch (err) {
    console.error(err);
    return m.reply("⚠️ Error: " + err.message);
  }
};

handler.command = /^(1gb|2gb|3gb|4gb|5gb|unlimited|unli)$/i;
handler.tags = ['panel'];
handler.help = ['1gb', '2gb', '3gb', '4gb', '5gb', 'unli'].map(v => v + ' <username>[,nomor]');
handler.owner = true;

export default handler;
