// © INF PROJECT - Erine-MD
// Developed by INF PROJECT

import jimp from 'jimp';
const { Jimp } = jimp;
import axios from 'axios';

class SnakeAndLadderGame {
    constructor(conn) {
        this.conn = conn;
        this.players = [];
        this.boardSize = 100;
        this.snakesAndLadders = [
            { start: 29, end: 7 }, { start: 24, end: 12 }, { start: 15, end: 37 },
            { start: 23, end: 41 }, { start: 72, end: 36 }, { start: 49, end: 86 },
            { start: 90, end: 56 }, { start: 75, end: 64 }, { start: 74, end: 95 },
            { start: 91, end: 72 }, { start: 97, end: 78 }
        ];
        this.currentPositions = {};
        this.currentPlayerIndex = 0;
        this.bgImageUrl = 'https://i.pinimg.com/originals/2f/68/a7/2f68a7e1eee18556b055418f7305b3c0.jpg';
        this.player1ImageUrl = 'https://i.pinimg.com/originals/75/33/22/7533227c53f6c270a96d364b595d6dd5.jpg';
        this.player2ImageUrl = 'https://i.pinimg.com/originals/be/68/13/be6813a6086681070b0f886d33ca4df9.jpg';
        this.bgImage = null;
        this.player1Image = null;
        this.player2Image = null;
        this.cellWidth = 40;
        this.cellHeight = 40;
        this.keyId = null; 
        this.started = false;
    }

    initializeGame() {
        this.players.forEach(p => this.currentPositions[p] = 1);
        this.currentPlayerIndex = 0;
        this.started = true;
    }

    rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }

    async movePlayer(m, player, steps) {
        let currentPos = this.currentPositions[player];
        let newPos = currentPos + steps;

        for (let other of this.players) {
            if (other !== player && this.currentPositions[other] === newPos) {
                await m.reply(`😱 *Mampus!* @${player.split('@')[0]} diinjek sama @${other.split('@')[0]}!\nBalik ke kotak 1 lu!`, null, { mentions: [player, other] });
                newPos = 1;
            }
        }

        const jump = this.snakesAndLadders.find(s => s.start === newPos);
        if (jump) {
            const isLadder = jump.end > jump.start;
            await m.reply(`${isLadder ? '🪜 *Hoki!*' : '🐍 *Amsyong!*'} @${player.split('@')[0]} nemu ${isLadder ? 'Tangga' : 'Ular'}! ${isLadder ? 'Maju' : 'Turun'} ke kotak *${jump.end}*.`, null, { mentions: [player] });
            newPos = jump.end;
        }

        this.currentPositions[player] = Math.min(newPos, this.boardSize);
    }

    async fetchImage(url) {
        const res = await axios.get(url, { responseType: 'arraybuffer' });
        return await Jimp.read(Buffer.from(res.data));
    }

    async getBoardBuffer() {
        // Fix: Constructor Jimp terbaru (angka langsung)
        const board = new Jimp(420, 420, 0xFFFFFFFF);
        this.bgImage.resize(420, 420);
        board.composite(this.bgImage, 0, 0);

        for (const player of this.players) {
            const pos = this.currentPositions[player];
            const img = player === this.players[0] ? this.player1Image : this.player2Image;
            
            const x = ((pos - 1) % 10) * this.cellWidth + 10;
            const y = (9 - Math.floor((pos - 1) / 10)) * this.cellHeight + 10;
            
            const pImg = img.clone().resize(this.cellWidth, this.cellHeight);
            board.composite(pImg, x, y);
        }
        return await board.getBufferAsync("image/png");
    }

    async startGame(m) {
        await m.reply(`🐍🎲 *GAME DIMULAI!* 🎲🐍\n\n@${this.players[0].split('@')[0]} *VS* @${this.players[1].split('@')[0]}\n\n_Sedang memuat papan..._`, null, { mentions: this.players });
        
        this.initializeGame();
        if (!this.bgImage) this.bgImage = await this.fetchImage(this.bgImageUrl);
        if (!this.player1Image) this.player1Image = await this.fetchImage(this.player1ImageUrl);
        if (!this.player2Image) this.player2Image = await this.fetchImage(this.player2ImageUrl);

        const board = await this.getBoardBuffer();
        const sent = await this.conn.sendFile(m.chat, board, 'board.png', 'Giliran: @' + this.players[0].split('@')[0], m, false, { mentions: [this.players[0]] });
        this.keyId = sent.key;
    }
}

const handler = async (m, { conn, args, usedPrefix, command }) => {
    conn.ulartangga = conn.ulartangga || {};
    let session = conn.ulartangga[m.chat];

    switch (args[0]) {
        case 'join':
            if (session?.started) return m.reply('❌ Game udah jalan, Bang.');
            if (!session) session = conn.ulartangga[m.chat] = new SnakeAndLadderGame(conn);
            
            if (session.players.includes(m.sender)) return m.reply('Lu udah join.');
            if (session.players.length >= 2) return m.reply('❌ Room penuh.');

            session.players.push(m.sender);
            m.reply(`✅ @${m.sender.split('@')[0]} join! (${session.players.length}/2)`, null, { mentions: [m.sender] });
            break;

        case 'start':
            if (!session || session.players.length < 2) return m.reply(`Pemain kurang! Ketik *${usedPrefix + command} join*`);
            if (session.started) return m.reply('Game udah jalan.');
            await session.startGame(m);
            break;

        case 'roll':
            if (!session || !session.started) return m.reply('Mulai dulu gamenya.');
            const currentPlayer = session.players[session.currentPlayerIndex];
            
            if (m.sender !== currentPlayer) {
                return m.reply(`🕒 Giliran @${currentPlayer.split('@')[0]}`, null, { mentions: [currentPlayer] });
            }

            const dice = session.rollDice();
            await m.reply(`🎲 @${m.sender.split('@')[0]} dapet angka *${dice}*!`, null, { mentions: [m.sender] });

            await session.movePlayer(m, currentPlayer, dice);

            if (session.currentPositions[currentPlayer] >= session.boardSize) {
                await m.reply(`🎉 *MENANG!* @${currentPlayer.split('@')[0]} menang!`, null, { mentions: [currentPlayer] });
                delete conn.ulartangga[m.chat];
                return;
            }

            if (dice !== 6) {
                session.currentPlayerIndex = 1 - session.currentPlayerIndex;
            } else {
                await m.reply('🎲 Dapet 6, jalan lagi!');
            }

            const boardBuffer = await session.getBoardBuffer();
            if (session.keyId) await conn.sendMessage(m.chat, { delete: session.keyId });
            
            const nextPlayer = session.players[session.currentPlayerIndex];
            const newSent = await conn.sendFile(m.chat, boardBuffer, 'board.png', `Next: @${nextPlayer.split('@')[0]}`, m, false, { mentions: [nextPlayer] });
            session.keyId = newSent.key;
            break;

        case 'reset':
            delete conn.ulartangga[m.chat];
            m.reply('🔄 Sesi direset!');
            break;

        default:
            m.reply(`🎲 *ULAR TANGGA*\n\n*Command:*\n◦ ${usedPrefix + command} join\n◦ ${usedPrefix + command} start\n◦ ${usedPrefix + command} roll`);
    }
};

handler.help = ['ulartangga'];
handler.tags = ['game'];
handler.command = /^(ular(tangga)?|ladders|snake)$/i;

export default handler;
