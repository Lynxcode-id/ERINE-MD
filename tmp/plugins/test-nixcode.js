/**
 * ───「 NIXCODE EXAMPLES (v4.6) 」───
 * 👤 Original : Nixel
 * 📝 Adapted  : Lynx Decode
 * ─────────────────────────────────
 */

import { Button, ButtonV2, Carousel, AIRich } from '../lib/nixcode.js'; // Pastikan path lib bener

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let namebot = global.namebot || 'Erine-MD';

    await m.react('⏳');

    try {
        // ==========================================
        // 1. TEST BUTTON (V1)
        // ==========================================
        if (command === 'testui') {
            await new Button(conn)
                .setTitle('🚀 NIXCODE')
                .setSubtitle('Interactive Message')
                .setBody('Pilih menu di bawah')
                .setFooter('© Nixel x Erine')
                .setImage('https://cdn.ornzora.eu.cc/b57c0d1e-d7a6-4277-8739-8f6b1d9894e6-FIORA.jpg')
                .addReply('📦 Menu', '.menu', { icon: 'DEFAULT' }) 
                .addReply('👤 Profile', '.profile', { icon: 'REVIEW' })
                .addUrl('🌐 Website', 'https://example.com', true, { icon: 'PROMOTION' })
                .addCopy('📋 Copy Code', 'NIX-2026', { icon: 'DOCUMENT' })
                .addSelection('📚 Pilih Kategori')
                .makeSection('Main Menu') // UPDATE 4.6: Pake makeSection bukan makeSections
                .makeRow('🔥 HOT', 'Downloader', 'Download social media', '.dl')
                .makeRow('⚡ FAST', 'AI Chat', 'Chat dengan AI', '.ai')
                .send(m.chat, { quoted: m });
        }

        // ==========================================
        // 2. TEST BUTTON V2 (MULTI-ROW & RAW BUTTON)
        // ==========================================
        else if (command === 'testbtn') {
            await new ButtonV2(conn)
                .setTitle('🚀 NIXCODE')
                .setSubtitle('Buttons Message V2')
                .setBody('Halo dunia, tes tombol versi 2.')
                .setFooter('Footer Message')
                .setThumbnail('https://cdn.ornzora.eu.cc/4d2905ce-3707-4ec0-998a-68a3d851629f-FIORA.jpg')
                // UPDATE 4.6: Bisa masukin Raw Button (Native Flow mentahan)
                .addRawButton({ 
                    buttonText: { displayText: '📡 Menu Interaktif' }, 
                    buttonId: 'Nixel', 
                    type: 1, 
                    nativeFlowInfo: { 
                        name: 'single_select', 
                        paramsJson: "{\"title\":\"Click Here!\",\"sections\":[{\"title\":\"Erine Menu\",\"highlight_label\":\"\",\"rows\":[{\"header\":\"\",\"title\":\"Buka Menu\",\"description\":\"\",\"id\":\".menu\"}]}]}" 
                    } 
                })
                .addButton('👤 Profile', '.profile')
                .send(m.chat);
        }

        // ==========================================
        // 3. TEST CAROUSEL
        // ==========================================
        else if (command === 'testcarousel') {
            await new Carousel(conn)
                .setBody('🛍️ Product List')
                .setFooter('Swipe untuk lihat ke samping')
                .addCard(
                    await new Button(conn)
                        .setTitle('🍔 Burger')
                        .setBody('Burger terenak di kota')
                        .setFooter('$5')
                        .setImage('https://cdn.ornzora.eu.cc/36df8c36-c74e-4dc2-bc03-87893f373cb4-FIORA.jpg')
                        .addReply('🛒 Buy Burger', '.buy burger')
                        .toCard()
                )
                .addCard(
                    await new Button(conn)
                        .setTitle('🍕 Pizza')
                        .setBody('Pizza mozzarella mantap')
                        .setFooter('$7')
                        .setImage('https://cdn.ornzora.eu.cc/36df8c36-c74e-4dc2-bc03-87893f373cb4-FIORA.jpg')
                        .addReply('🛒 Buy Pizza', '.buy pizza')
                        .toCard()
                )
                .send(m.chat, { quoted: m });
        }

        // ==========================================
        // 4. TEST AI RICH RESPONSE (FULL FEATURES)
        // ==========================================
        else if (command === 'testairich') {
            await new AIRich(conn)
                .setTitle('🚀 NIXCODE v4.6')
                .setFooter('© Erine x Nixel')
                .addSuggest("MessageBuilderV4.6")
                .addSuggest(['Nixel', 'NIXCODE', 'AIRich', 'Erine MD'])
                .addTip('Ini adalah text tip (Metadata Text) cuy')
                .addText(`
# Halo Dunia
## NIXCODE V4.6 UPDATE

---

=={ Yellow Text }==

---

Ini hyperlink:
[Text] (url) 
## TRUSTED LINK
[Google](https://google.com)
## UNTRUSTED LINK
[Google](!https://google.com)

Ini auto citation:
[] (url) 
[](https://openai.com)

Ini LaTeX:
[Identifier|?Width|?Height|?Font_Height|?Padding] <url>
[Shiroko|1429|1897]<https://cdn.ornzora.eu.cc/5442e78b-fe26-4cb9-939d-e6df83acad6a-FIORA.png>
                `)
                .addText('SingleLayout Product (Object Input):')
                .addProduct({
                    title: namebot,
                    brand: 'INF PROJECT',
                    price: 'Rp 1000',
                    sale_price: 'Rp 0',
                    url: 'https://wa.me/6282139672290',
                    image: "https://cdn.ornzora.eu.cc/152f4f0b-02fb-4d60-aacc-fc4cfa87ccdb-FIORA.jpg" 
                })
                .addText('HScroll Product (Array of Object Input):')
                .addProduct(Array(3).fill({
                    title: 'Bundle Bot',
                    brand: 'Lynx',
                    price: 'Rp 50.000',
                    sale_price: 'Rp 30.000',
                    url: 'https://wa.me/6282139672290',
                    image: "https://cdn.ornzora.eu.cc/152f4f0b-02fb-4d60-aacc-fc4cfa87ccdb-FIORA.jpg" 
                }))
                .addCode('javascript', `class Nixel {\n  static hello() {\n    return 'Hello World';\n  }\n}`)
                .addTable([
                    ['Nama', 'Role'],
                    ['[Lynx](https://wa.me/6282139672290)', 'Developer'], 
                    ['Dinda', 'Deputy Owner']
                ])
                .addSource([
                    [
                        'https://cdn.ornzora.eu.cc/dc85c945-96f7-4d50-aaa4-1dff7249aaf4-FIORA.jpg', 
                        'https://github.com/FgsiDev/',
                        'GitHub'
                    ],
                    [
                        'https://cdn.ornzora.eu.cc/dc85c945-96f7-4d50-aaa4-1dff7249aaf4-FIORA.jpg', 
                        'https://fiora.nixel.my.id/',
                        'Fiora Sylvie'
                    ]
                ])
                .addImage('https://cdn.ornzora.eu.cc/d987ff9c-c16c-4f1e-a8d6-953e375f4aec-FIORA.jpg') 
                .addVideo("https://cdn.ornzora.eu.cc/5c3e1109-38d3-408e-926c-588694fd9581-FIORA.mp4") 
                // .addVideo({ url: "https://cdn.ornzora.eu.cc/5c3e1109-38d3-408e-926c-588694fd9581-FIORA.mp4", file_length: 100000000, duration: 120, thumbnail: "https://cdn.ornzora.eu.cc/0800269d-8f1e-4c7e-b38e-8684db560345-FIORA.jpg" }) 
                .addReels(Array(3).fill({
                        username: 'Erine MD',
                        profile: 'https://cdn.ornzora.eu.cc/4d2905ce-3707-4ec0-998a-68a3d851629f-FIORA.jpg', 
                        thumbnail: 'https://cdn.ornzora.eu.cc/0800269d-8f1e-4c7e-b38e-8684db560345-FIORA.jpg', 
                        url: 'https://fiora.nixel.my.id/',
                        title: 'Demo Reel',
                        source: 'IG',
                        verified: true
                }))
                .addPost(Array(2).fill({
                    profile: "https://cdn.ornzora.eu.cc/2498bf66-6870-4f8a-8421-0a77f7baa95b-FIORA.jpg", 
                    username: 'Erine_Daily',
                    title: "Demo Post",
                    subtitle: 'Erine Update',
                    caption: 'hii~ ini contoh fitur addPost dari NIXCODE terbaru.',
                    verified: true,
                    url: 'https://fiora.nixel.my.id/',
                    thumbnail: 'https://cdn.ornzora.eu.cc/7048efb4-2abf-4081-bdd1-2f65972d793a-FIORA.jpg', 
                    source: 'INSTAGRAM', 
                    footer: 'Erine Bot',
                    deeplink: 'https://fiora.nixel.my.id/',
                    icon: "https://cdn.ornzora.eu.cc/2498bf66-6870-4f8a-8421-0a77f7baa95b-FIORA.jpg", 
                }))
                .send(m.chat, { quoted: m });
        }

        await m.react('✅');

    } catch (e) {
        console.error('[NIXCODE TEST ERROR]', e);
        await m.react('❌');
        m.reply(`⚠️ *Error NIXCODE:*\n_${e.message || e}_`);
    }
};

handler.help = ['testui', 'testbtn', 'testcarousel', 'testairich'];
handler.tags = ['tools', 'owner'];
handler.command = /^(testui|testbtn|testcarousel|testairich)$/i;
handler.limit = false; 

export default handler;
