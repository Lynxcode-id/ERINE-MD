let handler = async (m, { conn }) => {
    const stickers = [
        {
            url: 'https://mmg.whatsapp.net/v/t62.15575-24/665920022_1793555442018558_6364229514877626553_n.enc?ccb=11-4&oh=01_Q5Aa4wG7N1ZyIwluo88ir9aHWM1uoJR0FlTsVM_WjX3UqfZYyA&oe=6A62CDF9&_nc_sid=5e03e0&mms3=true',
            fileSha256: new Uint8Array([60, 31, 146, 39, 51, 191, 70, 169, 3, 155, 134, 215, 96, 124, 232, 115, 180, 207, 222, 189, 30, 146, 222, 109, 182, 14, 95, 197, 138, 69, 9, 181]),
            fileEncSha256: new Uint8Array([121, 93, 212, 214, 144, 252, 215, 175, 122, 112, 252, 149, 115, 234, 44, 89, 242, 44, 215, 161, 161, 116, 41, 88, 194, 87, 230, 240, 172, 90, 155, 56]),
            mediaKey: new Uint8Array([128, 221, 145, 95, 32, 93, 250, 125, 27, 125, 53, 194, 41, 185, 196, 160, 173, 123, 241, 71, 241, 75, 8, 216, 50, 166, 100, 28, 97, 201, 228, 170]),
            mimetype: 'application/was',
            height: 512,
            width: 512,
            directPath: '/v/t62.15575-24/665920022_1793555442018558_6364229514877626553_n.enc?ccb=11-4&oh=01_Q5Aa4wG7N1ZyIwluo88ir9aHWM1uoJR0FlTsVM_WjX3UqfZYyA&oe=6A62CDF9&_nc_sid=5e03e0',
            fileLength: { low: 18063, high: 0, unsigned: true },
            mediaKeyTimestamp: { low: 1782272590, high: 0, unsigned: false },
            isAnimated: true,
            isAvatar: false,
            isAiSticker: false,
            isLottie: true,
            premium: 0
        },
        {
            url: 'https://mmg.whatsapp.net/v/t62.15575-24/616665526_1006925975406249_240790339840158422_n.enc?ccb=11-4&oh=01_Q5Aa4wG38DGeBVkTv0rAT7WliE87I4tX6gmkTGk3Vj3DPYp28g&oe=6A62CC6C&_nc_sid=5e03e0&mms3=true',
            fileSha256: new Uint8Array([247, 135, 208, 185, 117, 157, 74, 227, 112, 108, 79, 141, 178, 199, 245, 207, 111, 11, 125, 189, 166, 4, 99, 123, 140, 86, 161, 104, 235, 140, 189, 189]),
            fileEncSha256: new Uint8Array([160, 2, 123, 124, 167, 115, 184, 190, 220, 112, 109, 150, 116, 161, 140, 139, 66, 23, 120, 40, 226, 190, 67, 174, 81, 66, 96, 74, 24, 150, 32, 83]),
            mediaKey: new Uint8Array([151, 159, 239, 29, 8, 101, 239, 139, 133, 240, 113, 42, 128, 58, 126, 63, 205, 215, 229, 1, 168, 200, 245, 158, 1, 86, 136, 241, 60, 106, 39, 241]),
            mimetype: 'application/was',
            height: 512,
            width: 512,
            directPath: '/v/t62.15575-24/616665526_1006925975406249_240790339840158422_n.enc?ccb=11-4&oh=01_Q5Aa4wG38DGeBVkTv0rAT7WliE87I4tX6gmkTGk3Vj3DPYp28g&oe=6A62CC6C&_nc_sid=5e03e0',
            fileLength: { low: 39104, high: 0, unsigned: true },
            mediaKeyTimestamp: { low: 1782272600, high: 0, unsigned: false },
            isAnimated: true,
            isAvatar: false,
            isAiSticker: false,
            isLottie: true,
            premium: 0
        },
        {
            url: 'https://mmg.whatsapp.net/v/t62.15575-24/612766283_2125590291387213_5906131647525586559_n.enc?ccb=11-4&oh=01_Q5Aa4wGy3UAzHRaz10CLxqP3PrJx83CuWEvljI_TfvC2QTxPqA&oe=6A62C914&_nc_sid=5e03e0&mms3=true',
            fileSha256: new Uint8Array([172, 211, 50, 206, 101, 99, 203, 142, 223, 51, 134, 231, 46, 33, 196, 169, 207, 214, 140, 253, 166, 175, 23, 134, 107, 35, 131, 189, 129, 197, 221, 153]),
            fileEncSha256: new Uint8Array([107, 138, 181, 123, 189, 185, 67, 224, 48, 227, 9, 107, 65, 25, 48, 113, 196, 129, 217, 162, 241, 195, 116, 135, 129, 92, 244, 213, 93, 121, 253, 169]),
            mediaKey: new Uint8Array([96, 66, 16, 25, 49, 30, 194, 137, 33, 246, 163, 20, 250, 148, 212, 240, 193, 122, 130, 122, 71, 227, 195, 159, 145, 193, 147, 247, 115, 79, 127, 242]),
            mimetype: 'application/was',
            height: 512,
            width: 512,
            directPath: '/v/t62.15575-24/612766283_2125590291387213_5906131647525586559_n.enc?ccb=11-4&oh=01_Q5Aa4wGy3UAzHRaz10CLxqP3PrJx83CuWEvljI_TfvC2QTxPqA&oe=6A62C914&_nc_sid=5e03e0',
            fileLength: { low: 16141, high: 0, unsigned: true },
            mediaKeyTimestamp: { low: 1782272607, high: 0, unsigned: false },
            isAnimated: true,
            isAvatar: false,
            isAiSticker: false,
            isLottie: true,
            premium: 1
        },
        {
            url: 'https://mmg.whatsapp.net/v/t62.15575-24/671231531_988173207339082_4221059288680028252_n.enc?ccb=11-4&oh=01_Q5Aa4wEBgZ-yMS5KXIs0m7-dWGYQmBs9VzeR1hUCNDJyKo7Peg&oe=6A62B58F&_nc_sid=5e03e0&mms3=true',
            fileSha256: new Uint8Array([70, 77, 248, 198, 204, 221, 223, 168, 222, 228, 230, 13, 30, 255, 61, 17, 25, 72, 16, 192, 87, 151, 145, 83, 45, 81, 125, 126, 91, 79, 220, 169]),
            fileEncSha256: new Uint8Array([17, 7, 239, 232, 38, 22, 185, 8, 248, 17, 104, 184, 121, 11, 251, 226, 193, 176, 173, 99, 68, 251, 179, 77, 183, 49, 116, 12, 249, 41, 132, 103]),
            mediaKey: new Uint8Array([136, 109, 19, 200, 55, 170, 138, 210, 161, 79, 11, 141, 142, 57, 161, 98, 26, 67, 171, 194, 167, 226, 200, 242, 202, 237, 30, 80, 238, 199, 199, 182]),
            mimetype: 'application/was',
            height: 512,
            width: 512,
            directPath: '/v/t62.15575-24/671231531_988173207339082_4221059288680028252_n.enc?ccb=11-4&oh=01_Q5Aa4wEBgZ-yMS5KXIs0m7-dWGYQmBs9VzeR1hUCNDJyKo7Peg&oe=6A62B58F&_nc_sid=5e03e0',
            fileLength: { low: 31457, high: 0, unsigned: true },
            mediaKeyTimestamp: { low: 1782272610, high: 0, unsigned: false },
            isAnimated: true,
            isAvatar: false,
            isAiSticker: false,
            isLottie: true,
            premium: 1
        }
    ];

    const pick = stickers[Math.floor(Math.random() * stickers.length)];

    const lottieStickerObj = {
        lottieStickerMessage: {
            message: {
                stickerMessage: pick
            },
            contextInfo: { mentionedJid: [m.sender] }
        }
    };

    await conn.relayMessage(m.chat, lottieStickerObj, { messageId: m.key.id });
};

handler.customPrefix = /^(halo|hai|hy|hlo|p)\s*(rin|erine|erin|rine)$|^erine$|^rin$|^erin$|^rine$/i;
handler.command = new RegExp();

export default handler;