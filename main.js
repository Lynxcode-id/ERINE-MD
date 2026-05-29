const _0x8b60c9 = _0x169d;
(function (_0x1d138a, _0x58e45f) {
    const _0x2dd44b = _0x169d, _0x784f9 = _0x1d138a();
    while (!![]) {
        try {
            const _0x2722b4 = -parseInt(_0x2dd44b(0x1a8)) / (0x877 + -0x2 * 0xd3f + -0x1208 * -0x1) * (parseInt(_0x2dd44b(0x1f0)) / (0x446 * 0x1 + -0xceb + 0x8a7)) + parseInt(_0x2dd44b(0x1d8)) / (-0xb06 + -0x1ac6 + 0x25cf) * (parseInt(_0x2dd44b(0x24c)) / (-0x142f + 0xdd * -0x3 + -0xb65 * -0x2)) + parseInt(_0x2dd44b(0xd6)) / (-0x1525 * -0x1 + 0x17 * -0x8d + -0x1b1 * 0x5) + -parseInt(_0x2dd44b(0x1b5)) / (-0x2398 + 0xcb * -0x17 + -0x11 * -0x32b) + -parseInt(_0x2dd44b(0x1cd)) / (-0x7 * -0x374 + 0x46 * 0x1c + -0x1fcd) + -parseInt(_0x2dd44b(0x24e)) / (0x22b0 + -0xf61 * 0x2 + 0x2 * -0x1f3) + parseInt(_0x2dd44b(0x2ea)) / (0x3 * 0x89f + -0x193e + -0xa * 0xf);
            if (_0x2722b4 === _0x58e45f)
                break;
            else
                _0x784f9['push'](_0x784f9['shift']());
        } catch (_0x33b59a) {
            _0x784f9['push'](_0x784f9['shift']());
        }
    }
}(_0x490b, 0x1f * -0x2317 + -0x1 * 0x353d4 + 0x9c0a2), process[_0x8b60c9(0x242)][_0x8b60c9(0xe8) + _0x8b60c9(0x1dd) + _0x8b60c9(0x216)] = '1');
import './readme-guard.js';
import { startReadmeWatchdog } from './lib/bootlock.js';
startReadmeWatchdog(_0x8b60c9(0x2a8)), await import(_0x8b60c9(0x152) + 's');
import _0x2eefe2, { join } from 'path';
import { platform } from 'process';
import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import { createRequire } from 'module';
global[_0x8b60c9(0x20b)] = function filename(_0x2f86ef = import.meta.url, _0x34961f = platform !== _0x8b60c9(0x2f9)) {
    const _0x1a91a2 = _0x8b60c9, _0x50562c = {
            'GSgXg': function (_0x2e95d8, _0x42f520) {
                return _0x2e95d8(_0x42f520);
            }
        };
    return _0x34961f ? /file:\/\/\//[_0x1a91a2(0x2aa)](_0x2f86ef) ? _0x50562c[_0x1a91a2(0x2a7)](fileURLToPath, _0x2f86ef) : _0x2f86ef : _0x50562c[_0x1a91a2(0x2a7)](pathToFileURL, _0x2f86ef)[_0x1a91a2(0xda)]();
}, global[_0x8b60c9(0x187)] = function dirname(_0x2006ce) {
    const _0x2437cd = _0x8b60c9;
    return _0x2eefe2[_0x2437cd(0x1ed)](global[_0x2437cd(0x20b)](_0x2006ce, !![]));
}, global[_0x8b60c9(0x21c)] = function require(_0x4c919b = import.meta.url) {
    const _0x537b19 = _0x8b60c9, _0x1792db = {
            'vEaCJ': function (_0xebf15c, _0x6a9734) {
                return _0xebf15c(_0x6a9734);
            }
        };
    return _0x1792db[_0x537b19(0x223)](createRequire, _0x4c919b);
};
function _0x169d(_0x180abe, _0x4d3b8f) {
    _0x180abe = _0x180abe - (-0x115 * 0xc + -0xd * -0x193 + -0x6b8);
    const _0x4ae17e = _0x490b();
    let _0x4bda18 = _0x4ae17e[_0x180abe];
    return _0x4bda18;
}
import {
    readdirSync,
    statSync,
    unlinkSync,
    existsSync,
    readFileSync,
    watch
} from 'fs';
import _0x15705 from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
const argv = _0x15705(hideBin(process[_0x8b60c9(0x22f)]))[_0x8b60c9(0x22f)];
import { spawn } from 'child_process';
import _0x34987f from 'lodash';
import _0x2dddc5 from 'syntax-error';
import _0x2c2651 from 'chalk';
import { tmpdir } from 'os';
import _0x7b6b30 from 'readline';
import { format } from 'util';
import _0x87d6a8 from 'pino';
import _0xa553f6 from 'ws';
import * as _0x2593ad from '@whiskeysockets/baileys';
const {useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, makeCacheableSignalKeyStore, jidNormalizedUser} = _0x2593ad;
import _0x12c86a from 'node-cache';
const msgRetryCounterCache = new _0x12c86a(), groupCache = new _0x12c86a({
        'stdTTL': (-0x106c + -0x1515 + 0x2586) * (0x1c5c + 0x5 * 0x17b + -0x55 * 0x6b),
        'useClones': ![]
    });
import {
    Low,
    JSONFile
} from 'lowdb';
import {
    makeWASocket,
    protoType,
    serialize
} from './lib/simple.js';
import _0x3056e3 from './lib/cloudDBAdapter.js';
import {
    mongoDB,
    mongoDBV2
} from './lib/mongoDB.js';
const {CONNECTING} = _0xa553f6, {chain} = _0x34987f, PORT = process[_0x8b60c9(0x242)][_0x8b60c9(0x157)] || process[_0x8b60c9(0x242)][_0x8b60c9(0x227) + 'T'] || -0x1123 + -0x2232 + 0x3f0d;
protoType(), serialize(), global[_0x8b60c9(0x1e1)] = (_0x4e2124, _0x575855 = '/', _0xc917c2 = {}, _0x599ce0) => (_0x4e2124 in global[_0x8b60c9(0x13e)] ? global[_0x8b60c9(0x13e)][_0x4e2124] : _0x4e2124) + _0x575855 + (_0xc917c2 || _0x599ce0 ? '?' + new URLSearchParams(Object[_0x8b60c9(0x19f)]({
    ..._0xc917c2,
    ..._0x599ce0 ? { [_0x599ce0]: global[_0x8b60c9(0x112)][_0x4e2124 in global[_0x8b60c9(0x13e)] ? global[_0x8b60c9(0x13e)][_0x4e2124] : _0x4e2124] } : {}
})) : ''), global[_0x8b60c9(0x2ef)] = { 'start': new Date() };
const __dirname = global[_0x8b60c9(0x187)](import.meta.url);
global[_0x8b60c9(0x2dd)] = new Object(_0x15705(process[_0x8b60c9(0x22f)][_0x8b60c9(0x135)](0x25 * -0xfd + 0x625 + -0x29 * -0xbe))[_0x8b60c9(0x1e5) + 's'](![])[_0x8b60c9(0x210)]()), global[_0x8b60c9(0x1da)] = new RegExp('^[' + (opts[_0x8b60c9(0x1da)] || _0x8b60c9(0x121) + _0x8b60c9(0x254) + _0x8b60c9(0x126) + _0x8b60c9(0x105))[_0x8b60c9(0xff)](/[|\\{}()[\]^$+*?.\-\^]/g, _0x8b60c9(0x11b)) + ']'), global['db'] = new Low(/https?:\/\//[_0x8b60c9(0x2aa)](opts['db'] || '') ? new _0x3056e3(opts['db']) : /mongodb(\+srv)?:\/\//i[_0x8b60c9(0x2aa)](opts['db']) ? opts[_0x8b60c9(0x287)] ? new mongoDBV2(opts['db']) : new mongoDB(opts['db']) : new JSONFile((opts['_'][-0x242a + 0x2117 + 0x313] ? opts['_'][-0x28d + 0x471 * 0x2 + -0x655] + '_' : '') + (_0x8b60c9(0x25f) + _0x8b60c9(0x1d9)))), global[_0x8b60c9(0x2c8)] = global['db'], global[_0x8b60c9(0x205) + 'se'] = async function loadDatabase() {
    const _0x3d26ea = _0x8b60c9, _0x1310c4 = {
            'bmfjZ': function (_0x355f5f, _0x4b4ae4) {
                return _0x355f5f(_0x4b4ae4);
            },
            'jyegF': function (_0x204e7d, _0x42da38) {
                return _0x204e7d == _0x42da38;
            },
            'HhqZj': function (_0x18be60, _0x1caa21) {
                return _0x18be60 !== _0x1caa21;
            }
        };
    if (db[_0x3d26ea(0xde)])
        return new Promise(_0x52e0ce => setInterval(async function () {
            const _0x396ef2 = _0x3d26ea;
            !db[_0x396ef2(0xde)] && (_0x1310c4[_0x396ef2(0x1a2)](clearInterval, this), _0x1310c4[_0x396ef2(0x1a2)](_0x52e0ce, _0x1310c4[_0x396ef2(0xd9)](db[_0x396ef2(0x2f6)], null) ? global[_0x396ef2(0x205) + 'se']() : db[_0x396ef2(0x2f6)]));
        }, (0x2 * 0x92c + -0xd1e + -0x539 * 0x1) * (-0x91 * 0x7 + -0x8c2 + 0x2b * 0x63)));
    if (_0x1310c4[_0x3d26ea(0x23e)](db[_0x3d26ea(0x2f6)], null))
        return;
    db[_0x3d26ea(0xde)] = !![], await db[_0x3d26ea(0x29e)]()[_0x3d26ea(0x1b9)](console[_0x3d26ea(0x1fa)]), db[_0x3d26ea(0xde)] = null, db[_0x3d26ea(0x2f6)] = {
        'users': {},
        'chats': {},
        'stats': {},
        'msgs': {},
        'sticker': {},
        'settings': {},
        ...db[_0x3d26ea(0x2f6)] || {}
    }, global['db'][_0x3d26ea(0x23c)] = _0x1310c4[_0x3d26ea(0x1a2)](chain, db[_0x3d26ea(0x2f6)]);
}, loadDatabase();
const usePairingCode = !process[_0x8b60c9(0x22f)][_0x8b60c9(0x1d0)](_0x8b60c9(0x1b8) + _0x8b60c9(0x2ed)), useMobile = process[_0x8b60c9(0x22f)][_0x8b60c9(0x1d0)](_0x8b60c9(0x10a));
var question = function (_0x95e3f9) {
    return new Promise(function (_0x5440e5) {
        const _0x43f0e0 = _0x169d;
        rl[_0x43f0e0(0x17c)](_0x95e3f9, _0x5440e5);
    });
};
const rl = _0x7b6b30[_0x8b60c9(0x280) + _0x8b60c9(0x1d5)]({
        'input': process[_0x8b60c9(0x2f8)],
        'output': process[_0x8b60c9(0x148)]
    }), {
        version: waVersion,
        isLatest
    } = await fetchLatestBaileysVersion()[_0x8b60c9(0x1b9)](_0x23cb9b => {
        const _0x38b22f = _0x8b60c9, _0x1e9133 = { 'apJAj': _0x38b22f(0x20e) + _0x38b22f(0xfa) + _0x38b22f(0x140) + _0x38b22f(0x168) };
        return console[_0x38b22f(0x1fa)](_0x1e9133[_0x38b22f(0x2d9)], _0x23cb9b), {
            'version': undefined,
            'isLatest': ![]
        };
    }), {state, saveCreds} = await useMultiFileAuthState(_0x8b60c9(0x299)), store = makeInMemoryStore({
        'logger': _0x87d6a8()[_0x8b60c9(0x224)]({
            'level': _0x8b60c9(0xc6),
            'stream': _0x8b60c9(0xc9)
        })
    }), connectionOptions = {
        ...waVersion ? { 'version': waVersion } : {},
        'logger': _0x87d6a8({ 'level': _0x8b60c9(0xc6) }),
        'printQRInTerminal': !usePairingCode,
        'browser': [
            _0x8b60c9(0x180),
            _0x8b60c9(0x196),
            _0x8b60c9(0x176)
        ],
        'auth': {
            'creds': state[_0x8b60c9(0x17e)],
            'keys': makeCacheableSignalKeyStore(state[_0x8b60c9(0x1a6)], _0x87d6a8()[_0x8b60c9(0x224)]({
                'level': _0x8b60c9(0xc6),
                'stream': _0x8b60c9(0xc9)
            }))
        },
        'msgRetryCounterCache': msgRetryCounterCache,
        'cachedGroupMetadata': async _0x25bdb => groupCache[_0x8b60c9(0x1af)](_0x25bdb),
        'getMessage': async _0x355281 => {
            const _0x275857 = _0x8b60c9, _0x3bd741 = {
                    'ZtbkZ': function (_0x35cc3c, _0xc5050e) {
                        return _0x35cc3c(_0xc5050e);
                    }
                }, _0x668c33 = _0x3bd741[_0x275857(0x18b)](jidNormalizedUser, _0x355281[_0x275857(0x2c1)]), _0x1ce2df = await store[_0x275857(0x26f) + 'e'](_0x668c33, _0x355281['id']);
            return _0x1ce2df?.[_0x275857(0x1e2)] || undefined;
        },
        'generateHighQualityLinkPreview': !![],
        'patchMessageBeforeSending': _0x25f40d => {
            const _0x83dc59 = _0x8b60c9, _0x465b2c = !!(_0x25f40d[_0x83dc59(0x12a) + _0x83dc59(0x186)] || _0x25f40d[_0x83dc59(0xf9) + _0x83dc59(0x1ad)] || _0x25f40d[_0x83dc59(0x1e9) + 'e']);
            return _0x465b2c && (_0x25f40d = {
                'viewOnceMessage': {
                    'message': {
                        'messageContextInfo': {
                            'deviceListMetadataVersion': 0x2,
                            'deviceListMetadata': {}
                        },
                        ..._0x25f40d
                    }
                }
            }), _0x25f40d;
        },
        'connectTimeoutMs': 0xea60,
        'defaultQueryTimeoutMs': 0x0,
        'syncFullHistory': !![],
        'markOnlineOnConnect': !![]
    };
global[_0x8b60c9(0x1ab)] = makeWASocket(connectionOptions), conn[_0x8b60c9(0x11d)] = ![], store[_0x8b60c9(0x15d)](conn['ev']);
function _0x490b() {
    const _0xa877d7 = [
        'default',
        'aFDtj',
        '__require',
        'forEach',
        '❌\x20Gagal\x20ge',
        'oading\x20\x27',
        'participan',
        'nvkJN',
        'ah!',
        'vEaCJ',
        'child',
        'bvbQi',
        'cyan',
        'SERVER_POR',
        'sIcon',
        '/jadibot.j',
        'h\x20di\x20buka!',
        'sort',
        'requestPai',
        '❌\x20Sepertin',
        'ception',
        'argv',
        'Group\x20tela',
        'tuYfg',
        'UzEcx',
        'group-part',
        'to\x20Reset\x20L',
        'set',
        'VkEGi',
        'ah\x20ke\x20semu',
        '🔄\x20Menghidu',
        'webp\x20while',
        'error\x20requ',
        'magick)',
        'chain',
        'statusCode',
        'HhqZj',
        'registered',
        '\x20TOTAL]\x20Ba',
        'bye',
        'env',
        'Status\x20Mat',
        'evoke',
        'tag',
        'a\x20admin!',
        'log',
        'trim',
        '1|3|4|0|5|',
        'loggedOut',
        'bgRed',
        '5036GMjIPv',
        'tzlgy',
        '1723536MrfSGt',
        'dsBiO',
        '1203634249',
        'ewxmd',
        './plugins/',
        'sdemote',
        '%+£¢€¥^°=¶',
        'message.de',
        'KHass',
        'mJuCF',
        'YUTYi',
        '❌\x20Gagal\x20me',
        'erintah',
        'LKVRC',
        'RSVBn',
        '\x20WhatsApp\x20',
        'ZENmY',
        'database.j',
        'some',
        'lete',
        'kang!\x20Akse',
        'GNWvP',
        'spromote',
        'ode...',
        'nmegr',
        'attrs',
        'erja\x20Tanpa',
        'nPNCZ',
        'pat\x20mengir',
        'YTLSN',
        'info',
        'sDesc',
        'ata',
        'loadMessag',
        '-hide_bann',
        'xajVA',
        'NUtFq',
        'mpeg\x20belum',
        'connecting',
        'beuPq',
        'users',
        'call',
        'ASFdx',
        'at\x20datang\x20',
        '\x0aPairing\x20C',
        'ffmpeg\x20(--',
        'CvuOI',
        'credsUpdat',
        'Nomor\x20digu',
        'readyState',
        'createInte',
        'vNGaO',
        'concat',
        'Status\x20Akt',
        'hdvHr',
        'rqcUh',
        '✅\x20Erine\x20su',
        'mongodbv2',
        'ERINEPRJ',
        '\x20creds.jso',
        'groupsUpda',
        'Error\x20in\x20C',
        'dah,\x20Siap\x20',
        'QbMfy',
        'groups.upd',
        './tmp',
        'bot\x20(Sub-B',
        'nakan:\x20',
        'convert',
        'fromEntrie',
        'nstall\x20ffm',
        'rKFOF',
        'er!\x0a\x0aSelam',
        'bulVZ',
        'ugin\x20\x27',
        './sessions',
        'JvEeA',
        'zHWSV',
        'ssion:',
        'sRestrictO',
        'read',
        'psert',
        'itpje',
        'Success\x20Au',
        'gGdld',
        'ExvUS',
        'then',
        'low\x22',
        'rta\x20dapat\x20',
        'GSgXg',
        'main.js',
        're\x20plugin\x20',
        'test',
        'deleted\x20pl',
        'Deleted\x20se',
        'rNVGd',
        'jGSmo',
        'close',
        'filter',
        'ulang...',
        'gu\x20sebenta',
        '@newslette',
        'gYbdz',
        'magick',
        '\x20hanya\x20adm',
        'semua\x20pese',
        'si\x20tanpa\x20l',
        'h\x20di\x20tutup',
        'newsletter',
        'telah\x20diub',
        'nOKDR',
        'jgyCQ',
        'ditolak',
        'NAPXY',
        'ring\x20code:',
        'remoteJid',
        'mtimeMs',
        'dibot\x20tida',
        'ots)...',
        'UXqpd',
        'pdate',
        'ILBrQ',
        'DATABASE',
        './handler.',
        'creds.upda',
        'red',
        'i\x20\x0a@subjec',
        'er\x20Mungkin',
        'lZNqQ',
        'emulihkan\x20',
        '!\x0asekarang',
        'output',
        'Link\x20group',
        '✅\x20Sukses\x20m',
        'pHMMx',
        '\x20🚫\x20[BLOKIR',
        'YCaja',
        'Grup\x20di\x20ub',
        '⚠️\x20Modul\x20Ja',
        'apJAj',
        'localeComp',
        '⏱️\x20Koneksi\x20',
        '✅\x20Sukses\x20A',
        'opts',
        '👋\x20Halo\x20@us',
        'handler',
        'im\x20pesan.',
        '\x20imagemagi',
        'new\x20plugin',
        'module',
        '☑️\x20Quick\x20Te',
        'Judul\x20grup',
        'wNBLD',
        'EUFaQ',
        '\x20compiling',
        'all',
        '3004821cHxqMF',
        'webp',
        'ffmpegWebp',
        'ing-code',
        'k\x20ditemuka',
        'timestamp',
        'ngkin\x20Tida',
        'VaSFl',
        'now',
        'Deskripsi\x20',
        'Update',
        'write',
        'data',
        'Gvxsf',
        'stdin',
        'win32',
        't\x20error:',
        'repeat',
        'Unfollow',
        'js?update=',
        'xRZLK',
        'silent',
        '-frames:v',
        'aUVtb',
        'store',
        'ode\x20ini\x20ke',
        '❌\x20Gagal\x20Au',
        '1203634223',
        '-loglevel',
        'YJNTr',
        '58946360@n',
        'xuVoL',
        'peg\x20terleb',
        'STbYu',
        'ringCode',
        '\x20yang\x20vali',
        'sRevoke',
        '830585XNKsvJ',
        'nITSg',
        'yellow',
        'jyegF',
        'toString',
        'se\x20mencoba',
        'Jadibot!',
        '1203634045',
        'READ',
        'bot.js',
        'iQZKK',
        'groupAccep',
        'syntax\x20err',
        'requiring\x20',
        'tInvite',
        'rejectCall',
        'Panggilan\x20',
        'deleteUpda',
        'NODE_TLS_R',
        'VIwFZ',
        'FCuYN',
        'magenta',
        'nama\x20file\x20',
        'main',
        'index',
        'freeze',
        'welcome',
        'chats',
        'user\x20👋',
        '12xxxxxx):',
        'ygrgz',
        'dOfFc',
        'GFsco',
        'FjjnL',
        'ode:\x20',
        'templateMe',
        'fetch\x20late',
        'fkan\x20Bot,\x20',
        'VZVtY',
        'sAnnounceO',
        'xfkZV',
        'replace',
        'RxWbl',
        './lib/jadi',
        'uKxXD',
        'number',
        'UIhLj',
        '?&.\x5c-',
        'authState',
        'Silahkan\x20i',
        'ibwebp\x20di\x20',
        'session\x20~>',
        '--mobile',
        'endsWith',
        '.update',
        'NXTRK',
        '\x20Pairing\x20C',
        'ideo',
        'prGov',
        'off',
        'APIKeys',
        'Fwemn',
        'admin!',
        'reload',
        'Cannot\x20use',
        'wDYob',
        'enyambung\x20',
        'aluran\x20dit',
        'removeAllL',
        '\x5c$&',
        'PnyFK',
        'isInit',
        'groupMetad',
        'icipants.u',
        'open',
        '‎xzXZ/i!#$',
        'gqChx',
        '1203634267',
        'in\x20yang\x20da',
        '-filter_co',
        '∆×÷π√✓©®:;',
        '\x20Tidak\x20Bek',
        'webp\x20di\x20ff',
        '✅\x20Tersambu',
        'buttonsMes',
        'BDQNO',
        'Follow',
        'mCgmC',
        'Fitur\x20Stik',
        'sSubject',
        'ler',
        '\x20sesi\x20Jadi',
        'ya\x20ada\x20yan',
        'logger',
        'segera!',
        'slice',
        'split',
        'ah\x20ke\x20hany',
        'kVVDB',
        'mplex',
        'xmlns',
        'cRNTf',
        'nerate\x20pai',
        'bold',
        'APIs',
        'Edit\x20Info\x20',
        'st\x20Baileys',
        'isFile',
        'onDelete',
        'Generating',
        'bUOPy',
        'essing\x20',
        'cenfC',
        'tsUpdate',
        'stdout',
        'uncaughtEx',
        'ate',
        'or\x20while\x20l',
        'QKjHG',
        'olak.\x20',
        'white',
        '57759585@n',
        '\x20\x0a@desc',
        'AcIEp',
        './config.j',
        'esan.',
        'Mohon\x20tung',
        'ffmpeg',
        'aphsq',
        'PORT',
        'ah\x20menjadi',
        'Input\x20nomo',
        'push',
        'ons:\x20',
        '\x20telah\x20diu',
        'bind',
        'Menunggu\x20P',
        'blue',
        'ZpaYt',
        '\x22tag\x22:\x22fol',
        'ZMwJI',
        'AHIMa',
        '69528126@n',
        'engan\x20kode',
        '\x0asekarang\x20',
        'length',
        '\x20version:',
        'map',
        'color',
        'xgHoq',
        'ire\x20plugin',
        'status',
        'mengirim\x20p',
        'messages.u',
        'wcIih',
        'WIiUr',
        'eaBZY',
        'pIAoQ',
        'nIfaM',
        'RNSyv',
        '5.1.10',
        'menerima\x20p',
        'xxILn',
        'bah\x20ke\x20\x0a@r',
        'Icon\x20grup\x20',
        'HKsxi',
        'question',
        'r\x20WhatsApp',
        'creds',
        'XRdBU',
        'Mac\x20OS',
        '⚡\x20Mengakti',
        'esan\x20Baru',
        '\x20negara,\x20c',
        'rang\x20bukan',
        'k\x20Beranima',
        'sage',
        '__dirname',
        '\x20lagi\x20admi',
        'tall\x20image',
        'GeLLL',
        'ZtbkZ',
        'BjVvu',
        'Sampai\x20jum',
        'creds.json',
        'bah\x20menjad',
        'xywWi',
        'jalur\x20bela',
        'rPOsA',
        'iVzfI',
        'TYwHO',
        'support',
        'safari',
        'r...',
        'hjZAy',
        'are',
        'ffprobe',
        'BBDuO',
        '.us',
        'yhBCu',
        'UbRyh',
        'entries',
        'mengirim\x20v',
        'to-Join\x20GC',
        'bmfjZ',
        'Lurzv',
        'redBright',
        'object',
        'keys',
        'isteners',
        '16637TUQkQr',
        'ubject*\x20🎉',
        'ontoh:\x20628',
        'conn',
        'QjULM',
        'ssage',
        'ryczE',
        'get',
        'd\x20(awali\x20d',
        'lear\x20Sessi',
        '\x20menembak\x20',
        'mulihkan\x20J',
        'n\x20di\x20./lib',
        '486414ENOOSg',
        'match',
        'xOBzm',
        '--use-pair',
        'catch',
        're\x20-\x20requi',
        'hjQwK',
        'MGeZp',
        'exit',
        'YRoEC',
        '@user\x20Seka',
        'g\x20salah',
        'find',
        'obile\x20api',
        'imit\x20ke\x2015',
        '--version',
        'BeqQw',
        'EGPto',
        'xsxFf',
        'KQVwh',
        'rang\x20jadi\x20',
        'wYEKY',
        'MELsG',
        '📌\x20Masukkan',
        '218393pcXybY',
        'adibot:',
        'connection',
        'includes',
        'agar\x20bisa\x20',
        'l\x20(pkg\x20ins',
        'ih\x20dahulu\x20',
        './server.j',
        'rface',
        'YXQBf',
        'pa\x20lagi,\x20@',
        '405DVkFzh',
        'son',
        'prefix',
        'ck\x20dan\x20lib',
        'enable-lib',
        'EJECT_UNAU',
        'yCTFY',
        'plugins',
        'st\x20Done\x20,\x20',
        'API',
        'message',
        'terputus\x20&',
        '1203634006',
        'exitProces',
        'WymDD',
        'join',
        '?update=',
        'listMessag',
        '12665352@n',
        'JOAyt',
        'ringing',
        'dirname',
        'limit',
        'green',
        '24VROKKZ',
        'fTfye',
        'uSqku',
        '\x20pairing\x20c',
        'sCnDu',
        'Error\x20proc',
        'bgWhite',
        'BGXfh',
        's\x20follow\x20s',
        'query',
        'error',
        'Reset\x20limi',
        'race',
        'stringify',
        '\x20terinstal',
        'CHQvP',
        'warn',
        'ewsletter',
        'Sticker\x20Mu',
        'ozPnd',
        'blueBright',
        'loadDataba',
        'ode\x20with\x20m',
        'pkan\x20ulang',
        'iXbgh',
        'cuy\x20di\x20*@s',
        'diterima:',
        '__filename',
        'reloadHand',
        'uto-Join\x20G',
        'Failed\x20to\x20',
        'dgMnO',
        'parse',
        'nfSWR',
        '\x20mencoba\x20m',
        '57729073@g',
        'a\x20peserta!',
        '\x20ffmpeg)',
        'THORIZED',
        'WxnNM',
        'gqZXU',
        'bDOrF'
    ];
    _0x490b = function () {
        return _0xa877d7;
    };
    return _0x490b();
}
const originalQuery = conn[_0x8b60c9(0x1f9)][_0x8b60c9(0x15d)](conn);
conn[_0x8b60c9(0x1f9)] = async _0x5a9e41 => {
    const _0x4bbfa1 = _0x8b60c9, _0x2f5347 = {
            'hdvHr': function (_0x3b54a6, _0x3201c8) {
                return _0x3b54a6 === _0x3201c8;
            },
            'dgMnO': function (_0x572420, _0x502557) {
                return _0x572420 === _0x502557;
            },
            'UbRyh': _0x4bbfa1(0x2ba),
            'QjULM': _0x4bbfa1(0x161) + _0x4bbfa1(0x2a5),
            'xywWi': _0x4bbfa1(0x1e4) + _0x4bbfa1(0x1ea) + _0x4bbfa1(0x201),
            'GNWvP': _0x4bbfa1(0x123) + _0x4bbfa1(0x14f) + _0x4bbfa1(0x201),
            'BGXfh': _0x4bbfa1(0xcc) + _0x4bbfa1(0xcf) + _0x4bbfa1(0x201),
            'nOKDR': _0x4bbfa1(0xdd) + _0x4bbfa1(0x164) + _0x4bbfa1(0x201),
            'ExvUS': _0x4bbfa1(0x2d5) + _0x4bbfa1(0x240) + _0x4bbfa1(0xdb) + _0x4bbfa1(0x1b2) + _0x4bbfa1(0x191) + _0x4bbfa1(0x262) + _0x4bbfa1(0x1f8) + _0x4bbfa1(0x119) + _0x4bbfa1(0x14d),
            'dsBiO': function (_0x113a8c, _0x39dc78) {
                return _0x113a8c(_0x39dc78);
            }
        };
    if (_0x5a9e41 && _0x2f5347[_0x4bbfa1(0x284)](_0x5a9e41[_0x4bbfa1(0x245)], 'iq') && _0x5a9e41[_0x4bbfa1(0x267)] && _0x2f5347[_0x4bbfa1(0x20f)](_0x5a9e41[_0x4bbfa1(0x267)][_0x4bbfa1(0x13a)], _0x2f5347[_0x4bbfa1(0x19e)])) {
        let _0x10f5fe = JSON[_0x4bbfa1(0x1fd)](_0x5a9e41);
        if (_0x10f5fe[_0x4bbfa1(0x1d0)](_0x2f5347[_0x4bbfa1(0x1ac)])) {
            const _0x1155a6 = [
                _0x2f5347[_0x4bbfa1(0x190)],
                _0x2f5347[_0x4bbfa1(0x263)],
                _0x2f5347[_0x4bbfa1(0x1f7)],
                _0x2f5347[_0x4bbfa1(0x2bc)]
            ];
            let _0x55da84 = _0x1155a6[_0x4bbfa1(0x260)](_0x36d787 => _0x10f5fe[_0x4bbfa1(0x1d0)](_0x36d787));
            if (!_0x55da84)
                return console[_0x4bbfa1(0x247)](_0x2c2651[_0x4bbfa1(0x24b)][_0x4bbfa1(0x14e)](_0x2f5347[_0x4bbfa1(0x2a3)])), { 'status': 0xc8 };
        }
    }
    return _0x2f5347[_0x4bbfa1(0x24f)](originalQuery, _0x5a9e41);
};
if (usePairingCode && !conn[_0x8b60c9(0x106)][_0x8b60c9(0x17e)][_0x8b60c9(0x23f)]) {
    if (useMobile)
        throw new Error(_0x8b60c9(0x116) + _0x8b60c9(0x1f3) + _0x8b60c9(0x206) + _0x8b60c9(0x1c2));
    let phoneNumber = (argv['_'][0x1 * -0xb6a + -0x1738 + 0x22a2] || '')[_0x8b60c9(0x248)]()[_0x8b60c9(0xff)](/[^0-9]/g, '');
    while (!phoneNumber) {
        phoneNumber = (await question(_0x2c2651[_0x8b60c9(0x204)](_0x8b60c9(0x159) + _0x8b60c9(0x17d) + _0x8b60c9(0xd4) + _0x8b60c9(0x1b0) + _0x8b60c9(0x165) + _0x8b60c9(0x183) + _0x8b60c9(0x1aa) + _0x8b60c9(0xf3) + '\x0a')))[_0x8b60c9(0x248)]()[_0x8b60c9(0xff)](/[^0-9]/g, '');
    }
    rl[_0x8b60c9(0x2af)](), console[_0x8b60c9(0x247)](_0x2c2651[_0x8b60c9(0x1ef)](_0x8b60c9(0x27e) + _0x8b60c9(0x291) + phoneNumber)), console[_0x8b60c9(0x247)](_0x2c2651[_0x8b60c9(0x1f6)](_0x2c2651[_0x8b60c9(0x15f)](_0x8b60c9(0x143) + _0x8b60c9(0x10e) + _0x8b60c9(0x265)))), setTimeout(async () => {
        const _0x51798e = _0x8b60c9, _0x2a41f3 = {
                'dOfFc': _0x51798e(0x288),
                'uKxXD': function (_0x2ad2f5, _0x694b4e) {
                    return _0x2ad2f5 + _0x694b4e;
                },
                'cRNTf': _0x51798e(0x1cc) + _0x51798e(0x1f3) + _0x51798e(0xca) + _0x51798e(0x25d) + _0x51798e(0x134),
                'nIfaM': _0x51798e(0x21e) + _0x51798e(0x13c) + _0x51798e(0x2c0)
            };
        try {
            const _0x47ea18 = await conn[_0x51798e(0x22c) + _0x51798e(0xd3)](phoneNumber, _0x2a41f3[_0x51798e(0xf5)]), _0x54e398 = _0x47ea18?.[_0x51798e(0x1b6)](/.{1,4}/g)?.[_0x51798e(0x1e7)]('-') || _0x47ea18, _0x15a710 = '─'[_0x51798e(0x2fb)](_0x2a41f3[_0x51798e(0x102)](_0x54e398[_0x51798e(0x167)], -0x4 * -0x2dc + -0x1 * -0x142d + -0x1 * 0x1f99));
            console[_0x51798e(0x247)](_0x2c2651[_0x51798e(0x1ef)]('\x0a┌' + _0x15a710 + '┐')), console[_0x51798e(0x247)](_0x2c2651[_0x51798e(0x1ef)]('│\x20' + _0x2c2651[_0x51798e(0xd8)][_0x51798e(0x13d)](_0x54e398) + '\x20│')), console[_0x51798e(0x247)](_0x2c2651[_0x51798e(0x1ef)]('└' + _0x15a710 + '┘')), console[_0x51798e(0x247)](_0x2c2651[_0x51798e(0x226)](_0x51798e(0x27a) + _0x51798e(0xf8) + _0x2c2651[_0x51798e(0x13d)](_0x2a41f3[_0x51798e(0xf5)]))), console[_0x51798e(0x247)](_0x2c2651[_0x51798e(0xeb)](_0x2a41f3[_0x51798e(0x13b)]));
        } catch (_0x4e0491) {
            console[_0x51798e(0x1fa)](_0x2c2651[_0x51798e(0x2cb)](_0x2a41f3[_0x51798e(0x174)]), _0x4e0491), process[_0x51798e(0x1bd)](0x205d * -0x1 + -0x3ac * 0x2 + 0x22 * 0x12b);
        }
    }, -0x1 * 0x114a + 0x28d * 0x1 + 0x17 * 0xfb);
}
async function resetLimit() {
    const _0x1ace0a = _0x8b60c9, _0x27fac9 = {
            'UIhLj': function (_0x3005ab, _0x3f705f) {
                return _0x3005ab !== _0x3f705f;
            },
            'gqChx': _0x1ace0a(0x1a5),
            'xgHoq': function (_0x258dd5, _0x1b43d1) {
                return _0x258dd5 !== _0x1b43d1;
            },
            'jgyCQ': _0x1ace0a(0x103),
            'WIiUr': function (_0x4428dc, _0x58a956) {
                return _0x4428dc < _0x58a956;
            },
            'bUOPy': _0x1ace0a(0x2a1) + _0x1ace0a(0x234) + _0x1ace0a(0x1c3),
            'tuYfg': _0x1ace0a(0x1fb) + _0x1ace0a(0x2fa)
        };
    try {
        if (!global['db']?.[_0x1ace0a(0x2f6)]?.[_0x1ace0a(0x276)])
            return;
        const _0x27e04d = 0x1014 + -0x5ab + -0xa5a;
        for (const [, _0x443f6a] of Object[_0x1ace0a(0x19f)](global['db'][_0x1ace0a(0x2f6)][_0x1ace0a(0x276)])) {
            if (!_0x443f6a || _0x27fac9[_0x1ace0a(0x104)](typeof _0x443f6a, _0x27fac9[_0x1ace0a(0x122)]))
                continue;
            (_0x27fac9[_0x1ace0a(0x16b)](typeof _0x443f6a[_0x1ace0a(0x1ee)], _0x27fac9[_0x1ace0a(0x2bd)]) || _0x27fac9[_0x1ace0a(0x171)](_0x443f6a[_0x1ace0a(0x1ee)], _0x27e04d)) && (_0x443f6a[_0x1ace0a(0x1ee)] = _0x27e04d);
        }
        console[_0x1ace0a(0x247)](_0x2c2651[_0x1ace0a(0x1ef)](_0x27fac9[_0x1ace0a(0x144)]));
    } catch (_0x2a3fcd) {
        console[_0x1ace0a(0x1fa)](_0x27fac9[_0x1ace0a(0x231)], _0x2a3fcd);
    }
}
setTimeout(() => {
    const _0x53b69e = _0x8b60c9, _0x5d299a = {
            'wcIih': function (_0x1cdb7b) {
                return _0x1cdb7b();
            },
            'mJuCF': function (_0x472d56, _0x468ffc, _0x38a71d) {
                return _0x472d56(_0x468ffc, _0x38a71d);
            },
            'PnyFK': function (_0x397ffe, _0x5578c9) {
                return _0x397ffe * _0x5578c9;
            }
        };
    _0x5d299a[_0x53b69e(0x170)](resetLimit), _0x5d299a[_0x53b69e(0x257)](setInterval, resetLimit, _0x5d299a[_0x53b69e(0x11c)](-0x90 * 0x12 + 0xfbc + -0xcd * 0x7, -0x96f401b + 0xb2bd * -0x8c1 + 0x14b24498));
}, 0x274 * -0x13 + -0x2 * 0x1acd + 0x8b46);
!opts[_0x8b60c9(0x2aa)] && ((await import(_0x8b60c9(0x1d4) + 's'))[_0x8b60c9(0x21a)](PORT), setInterval(async () => {
    const _0x45730 = _0x8b60c9, _0x5e86e6 = {
            'bulVZ': function (_0x4b4641) {
                return _0x4b4641();
            }
        };
    if (global['db'][_0x45730(0x2f6)])
        await global['db'][_0x45730(0x2f5)]()[_0x45730(0x1b9)](console[_0x45730(0x1fa)]);
    _0x5e86e6[_0x45730(0x297)](clearTmp);
}, (-0x7d * 0x3b + -0x1535 + -0x8 * -0x648) * (-0x1603 + 0x2 * 0x130d + -0xc2f)));
function clearTmp() {
    const _0x20e125 = _0x8b60c9, _0x44d9cb = {
            'BDQNO': function (_0x225a6f, _0x568d75) {
                return _0x225a6f(_0x568d75);
            },
            'bDOrF': function (_0xd83c16, _0x860530) {
                return _0xd83c16(_0x860530);
            },
            'xsxFf': function (_0x2b630a, _0x2ea49a) {
                return _0x2b630a >= _0x2ea49a;
            },
            'VZVtY': function (_0x47caa4, _0xe3505d) {
                return _0x47caa4 - _0xe3505d;
            },
            'UzEcx': function (_0x44b372, _0x375b8c) {
                return _0x44b372 * _0x375b8c;
            },
            'AcIEp': function (_0x186072, _0x4eb87e) {
                return _0x186072 * _0x4eb87e;
            },
            'nITSg': function (_0x5bbde5) {
                return _0x5bbde5();
            },
            'prGov': function (_0xe99086, _0x11f919, _0x1f10a8) {
                return _0xe99086(_0x11f919, _0x1f10a8);
            },
            'WymDD': _0x20e125(0x28f)
        }, _0x2ba738 = [
            _0x44d9cb[_0x20e125(0xd7)](tmpdir),
            _0x44d9cb[_0x20e125(0x110)](join, __dirname, _0x44d9cb[_0x20e125(0x1e6)])
        ], _0x1d7f46 = [];
    return _0x2ba738[_0x20e125(0x21d)](_0x44f47a => {
        const _0x338efe = _0x20e125;
        if (_0x44d9cb[_0x338efe(0x12b)](existsSync, _0x44f47a))
            _0x44d9cb[_0x338efe(0x12b)](readdirSync, _0x44f47a)[_0x338efe(0x21d)](_0x19fdba => _0x1d7f46[_0x338efe(0x15a)](join(_0x44f47a, _0x19fdba)));
    }), _0x1d7f46[_0x20e125(0x169)](_0x16bdec => {
        const _0x5cebba = _0x20e125;
        try {
            const _0x492e59 = _0x44d9cb[_0x5cebba(0x219)](statSync, _0x16bdec);
            if (_0x492e59[_0x5cebba(0x141)]() && _0x44d9cb[_0x5cebba(0x1c7)](_0x44d9cb[_0x5cebba(0xfc)](Date[_0x5cebba(0x2f2)](), _0x492e59[_0x5cebba(0x2c2)]), _0x44d9cb[_0x5cebba(0x232)](_0x44d9cb[_0x5cebba(0x151)](0xa3d * 0x1 + 0x1 * 0x56b + -0xbc0, -0x4af + 0x174a + 0x125f * -0x1), -0x1086 * 0x1 + 0x19b7 + 0x1 * -0x92e)))
                return _0x44d9cb[_0x5cebba(0x219)](unlinkSync, _0x16bdec);
        } catch (_0x55952f) {
        }
        return ![];
    });
}
async function clearSessions(_0xafbfca = _0x8b60c9(0x299)) {
    const _0x3dee8c = _0x8b60c9, _0x3be72 = {
            'VaSFl': function (_0x492bbd, _0x444c21) {
                return _0x492bbd(_0x444c21);
            },
            'nPNCZ': function (_0x3592c8, _0x414a97) {
                return _0x3592c8 !== _0x414a97;
            },
            'pHMMx': _0x3dee8c(0x18e),
            'Lurzv': function (_0x220e4c, _0x521d74) {
                return _0x220e4c(_0x521d74);
            },
            'lZNqQ': _0x3dee8c(0x2ac) + _0x3dee8c(0x29c),
            'ZMwJI': function (_0x3726e7, _0x4957a4) {
                return _0x3726e7(_0x4957a4);
            },
            'YXQBf': function (_0x154ab0, _0x26f424, _0xe038e1) {
                return _0x154ab0(_0x26f424, _0xe038e1);
            },
            'wDYob': function (_0xc7538, _0x1db814) {
                return _0xc7538 * _0x1db814;
            }
        };
    try {
        const _0x1c090b = await _0x3be72[_0x3dee8c(0x162)](readdirSync, _0xafbfca), _0x555b57 = await Promise[_0x3dee8c(0x2e9)](_0x1c090b[_0x3dee8c(0x169)](async _0x5df12d => {
                const _0x4d9425 = _0x3dee8c;
                try {
                    const _0x218a8c = _0x2eefe2[_0x4d9425(0x1e7)](_0xafbfca, _0x5df12d), _0x5763c9 = await _0x3be72[_0x4d9425(0x2f1)](statSync, _0x218a8c);
                    if (_0x5763c9[_0x4d9425(0x141)]() && _0x3be72[_0x4d9425(0x269)](_0x5df12d, _0x3be72[_0x4d9425(0x2d4)]))
                        return await _0x3be72[_0x4d9425(0x1a3)](unlinkSync, _0x218a8c), console[_0x4d9425(0x247)](_0x3be72[_0x4d9425(0x2ce)][_0x4d9425(0xed)], _0x218a8c[_0x4d9425(0x26c)]), _0x218a8c;
                } catch (_0x1cdb33) {
                    console[_0x4d9425(0x1fa)](_0x4d9425(0x1f5) + _0x4d9425(0x145) + _0x5df12d + ':\x20' + _0x1cdb33[_0x4d9425(0x1e2)]);
                }
            }));
        return _0x555b57[_0x3dee8c(0x2b0)](_0x1e83a9 => _0x1e83a9 !== null);
    } catch (_0x5c08c8) {
        return console[_0x3dee8c(0x1fa)](_0x3dee8c(0x28b) + _0x3dee8c(0x1b1) + _0x3dee8c(0x15b) + _0x5c08c8[_0x3dee8c(0x1e2)]), [];
    } finally {
        _0x3be72[_0x3dee8c(0x1d6)](setTimeout, () => clearSessions(_0xafbfca), _0x3be72[_0x3dee8c(0x117)](-0x166 * -0x6 + -0x17ea + -0x5 * -0x31b, 0x521b90 + 0x560f72 + 0x13 * -0x5f5b6));
    }
}
async function connectionUpdate(_0x533e44) {
    const _0x28b867 = _0x8b60c9, _0x39e6fb = {
            'tzlgy': _0x28b867(0x1e4) + _0x28b867(0x1ea) + _0x28b867(0x201),
            'aFDtj': _0x28b867(0x123) + _0x28b867(0x14f) + _0x28b867(0x201),
            'KQVwh': _0x28b867(0xcc) + _0x28b867(0xcf) + _0x28b867(0x201),
            'YTLSN': _0x28b867(0xdd) + _0x28b867(0x164) + _0x28b867(0x201),
            'CvuOI': function (_0x4bf3ad, _0x4e503f, _0x14be62) {
                return _0x4bf3ad(_0x4e503f, _0x14be62);
            },
            'BeqQw': function (_0x19176c, _0x39fdf9) {
                return _0x19176c * _0x39fdf9;
            },
            'mCgmC': function (_0x178412, _0x65bbd8) {
                return _0x178412 === _0x65bbd8;
            },
            'nfSWR': _0x28b867(0x274),
            'ewxmd': _0x28b867(0x181) + _0x28b867(0xfb) + _0x28b867(0x154) + _0x28b867(0x2b2) + _0x28b867(0x197),
            'ZENmY': _0x28b867(0x120),
            'nvkJN': _0x28b867(0x129) + 'ng',
            'xfkZV': _0x28b867(0x28e) + _0x28b867(0x14a),
            'VIwFZ': _0x28b867(0x233) + _0x28b867(0x11f) + _0x28b867(0x2c6),
            'JvEeA': _0x28b867(0x250) + _0x28b867(0x213) + _0x28b867(0x19c),
            'xOBzm': _0x28b867(0x2dc) + _0x28b867(0x20d) + 'C!',
            'YRoEC': _0x28b867(0xcb) + _0x28b867(0x1a1) + ':',
            'vNGaO': _0x28b867(0x286) + _0x28b867(0x28c) + _0x28b867(0x177) + _0x28b867(0x25a),
            'BjVvu': _0x28b867(0x22d) + _0x28b867(0x132) + _0x28b867(0x1c0),
            'nmegr': _0x28b867(0x101) + _0x28b867(0xdf),
            'rKFOF': _0x28b867(0x238) + _0x28b867(0x207) + _0x28b867(0x131) + _0x28b867(0x290) + _0x28b867(0x2c4),
            'YJNTr': function (_0x237310, _0x217dad) {
                return _0x237310(_0x217dad);
            },
            'CHQvP': _0x28b867(0x2d3) + _0x28b867(0x2cf) + _0x28b867(0xdc),
            'gqZXU': _0x28b867(0x2d8) + _0x28b867(0x2c3) + _0x28b867(0x2ee) + _0x28b867(0x1b4) + _0x28b867(0x229) + 's',
            'zHWSV': _0x28b867(0x259) + _0x28b867(0x1b3) + _0x28b867(0x1ce),
            'NUtFq': function (_0x6b706d, _0x4e8c1b, _0x2b3e3d) {
                return _0x6b706d(_0x4e8c1b, _0x2b3e3d);
            },
            'rqcUh': _0x28b867(0x283) + 'if',
            'KHass': _0x28b867(0x243) + 'i',
            'wYEKY': _0x28b867(0x15e) + _0x28b867(0x182),
            'pIAoQ': function (_0x40dd59, _0x26e08d) {
                return _0x40dd59 === _0x26e08d;
            },
            'UXqpd': _0x28b867(0x2af),
            'iQZKK': _0x28b867(0x2db) + _0x28b867(0x1e3) + _0x28b867(0x212) + _0x28b867(0x118) + _0x28b867(0x2b1),
            'LKVRC': function (_0x499a81, _0x9ba11d) {
                return _0x499a81 !== _0x9ba11d;
            },
            'cenfC': function (_0x49c5c4, _0x57551b) {
                return _0x49c5c4 == _0x57551b;
            }
        }, {
            connection: _0xa6f965,
            lastDisconnect: _0x473e78,
            isOnline: _0x5bee9a,
            receivedPendingNotifications: _0x40885c
        } = _0x533e44;
    _0x39e6fb[_0x28b867(0x12d)](_0xa6f965, _0x39e6fb[_0x28b867(0x211)]) && console[_0x28b867(0x247)](_0x2c2651[_0x28b867(0x1a4)](_0x39e6fb[_0x28b867(0x251)]));
    if (_0x39e6fb[_0x28b867(0x12d)](_0xa6f965, _0x39e6fb[_0x28b867(0x25e)])) {
        console[_0x28b867(0x247)](_0x2c2651[_0x28b867(0x1ef)](_0x39e6fb[_0x28b867(0x221)])), conn['ev']['on'](_0x39e6fb[_0x28b867(0xfe)], async ([_0x28d434]) => {
            const _0xf502fa = _0x28b867;
            if (_0x28d434 && _0x28d434['id']) {
                const _0x6e9e7 = await conn[_0xf502fa(0x11e) + _0xf502fa(0x26e)](_0x28d434['id'])[_0xf502fa(0x1b9)](() => null);
                if (_0x6e9e7)
                    groupCache[_0xf502fa(0x235)](_0x28d434['id'], _0x6e9e7);
            }
        }), conn['ev']['on'](_0x39e6fb[_0x28b867(0xe9)], async _0x52ab57 => {
            const _0x109505 = _0x28b867;
            if (_0x52ab57 && _0x52ab57['id']) {
                const _0x1504d6 = await conn[_0x109505(0x11e) + _0x109505(0x26e)](_0x52ab57['id'])[_0x109505(0x1b9)](() => null);
                if (_0x1504d6)
                    groupCache[_0x109505(0x235)](_0x52ab57['id'], _0x1504d6);
            }
        });
        try {
            const _0x49be82 = _0x39e6fb[_0x28b867(0x29a)];
            await conn[_0x28b867(0xe1) + _0x28b867(0xe4)](_0x49be82)[_0x28b867(0x1b9)](() => {
            }), console[_0x28b867(0x247)](_0x2c2651[_0x28b867(0x1ef)](_0x39e6fb[_0x28b867(0x1b7)]));
        } catch (_0x249095) {
            console[_0x28b867(0x247)](_0x2c2651[_0x28b867(0x2cb)](_0x39e6fb[_0x28b867(0x1be)], _0x249095));
        }
        try {
            const _0x30b5a8 = [
                _0x39e6fb[_0x28b867(0x24d)],
                _0x39e6fb[_0x28b867(0x21b)],
                _0x39e6fb[_0x28b867(0x1c8)],
                _0x39e6fb[_0x28b867(0x26b)]
            ];
            for (let _0x555fd5 of _0x30b5a8) {
                await conn[_0x28b867(0x2ba) + _0x28b867(0x12c)](_0x555fd5)[_0x28b867(0x1b9)](() => {
                }), await new Promise(_0xa09c1d => setTimeout(_0xa09c1d, 0xf * 0x23 + -0x8f + 0x120a));
            }
            console[_0x28b867(0x247)](_0x2c2651[_0x28b867(0x1ef)](_0x39e6fb[_0x28b867(0x281)]));
        } catch (_0x4a2ffa) {
            console[_0x28b867(0x247)](_0x2c2651[_0x28b867(0x2cb)](_0x39e6fb[_0x28b867(0x18c)], _0x4a2ffa));
        }
        try {
            const {restoreJadibot: _0x534485} = await import(_0x39e6fb[_0x28b867(0x266)])[_0x28b867(0x1b9)](() => ({ 'restoreJadibot': null }));
            _0x534485 ? (console[_0x28b867(0x247)](_0x2c2651[_0x28b867(0xd8)](_0x39e6fb[_0x28b867(0x295)])), await _0x39e6fb[_0x28b867(0xce)](_0x534485, conn), console[_0x28b867(0x247)](_0x2c2651[_0x28b867(0x1ef)](_0x39e6fb[_0x28b867(0x1ff)]))) : console[_0x28b867(0x247)](_0x2c2651[_0x28b867(0x2cb)](_0x39e6fb[_0x28b867(0x218)]));
        } catch (_0x592700) {
            console[_0x28b867(0x247)](_0x2c2651[_0x28b867(0x2cb)](_0x39e6fb[_0x28b867(0x29b)], _0x592700));
        }
        _0x39e6fb[_0x28b867(0x272)](setTimeout, () => {
            const _0x1848a4 = _0x28b867;
            _0x39e6fb[_0x1848a4(0x27c)](setInterval, async () => {
                const _0x1b396a = _0x1848a4;
                try {
                    let _0x3a1386 = Object[_0x1b396a(0x1a6)](global['db'][_0x1b396a(0x2f6)]?.[_0x1b396a(0xf1)] || {})[_0x1b396a(0x282)](Object[_0x1b396a(0x1a6)](conn[_0x1b396a(0xf1)] || {})), _0x1ce6a8 = [...new Set(_0x3a1386)][_0x1b396a(0x2b0)](_0x1059ce => _0x1059ce?.[_0x1b396a(0x10b)](_0x1b396a(0x2b3) + 'r'));
                    const _0x219c38 = [
                        _0x39e6fb[_0x1b396a(0x24d)],
                        _0x39e6fb[_0x1b396a(0x21b)],
                        _0x39e6fb[_0x1b396a(0x1c8)],
                        _0x39e6fb[_0x1b396a(0x26b)]
                    ];
                    for (let _0x118d9c of _0x1ce6a8) {
                        if (!_0x219c38[_0x1b396a(0x1d0)](_0x118d9c)) {
                            await conn[_0x1b396a(0x2ba) + _0x1b396a(0xc3)](_0x118d9c)[_0x1b396a(0x1b9)](() => {
                            });
                            if (global['db'][_0x1b396a(0x2f6)]?.[_0x1b396a(0xf1)] && global['db'][_0x1b396a(0x2f6)][_0x1b396a(0xf1)][_0x118d9c])
                                delete global['db'][_0x1b396a(0x2f6)][_0x1b396a(0xf1)][_0x118d9c];
                            if (conn[_0x1b396a(0xf1)] && conn[_0x1b396a(0xf1)][_0x118d9c])
                                delete conn[_0x1b396a(0xf1)][_0x118d9c];
                        }
                    }
                } catch (_0x44743e) {
                }
            }, _0x39e6fb[_0x1848a4(0x1c5)](-0x19 * -0xb5a + 0x101 * 0x5a + -0x8bc4 * 0x1, -0xc5 + 0xdb0 + -0x2 * 0x673));
        }, -0x571d + 0x6 * -0x1039 + 0x1 * 0xf30b);
    }
    if (_0x39e6fb[_0x28b867(0x12d)](_0x5bee9a, !![]))
        console[_0x28b867(0x247)](_0x2c2651[_0x28b867(0x1ef)](_0x39e6fb[_0x28b867(0x285)]));
    else {
        if (_0x39e6fb[_0x28b867(0x12d)](_0x5bee9a, ![]))
            console[_0x28b867(0x247)](_0x2c2651[_0x28b867(0x2cb)](_0x39e6fb[_0x28b867(0x256)]));
    }
    if (_0x40885c)
        console[_0x28b867(0x247)](_0x2c2651[_0x28b867(0xd8)](_0x39e6fb[_0x28b867(0x1ca)]));
    if (_0x39e6fb[_0x28b867(0x173)](_0xa6f965, _0x39e6fb[_0x28b867(0x2c5)]))
        console[_0x28b867(0x247)](_0x2c2651[_0x28b867(0x2cb)](_0x39e6fb[_0x28b867(0xe0)]));
    _0x473e78 && _0x473e78[_0x28b867(0x1fa)] && _0x473e78[_0x28b867(0x1fa)][_0x28b867(0x2d1)] && _0x39e6fb[_0x28b867(0x25b)](_0x473e78[_0x28b867(0x1fa)][_0x28b867(0x2d1)][_0x28b867(0x23d)], DisconnectReason[_0x28b867(0x24a)]) && _0x39e6fb[_0x28b867(0x25b)](conn['ws'][_0x28b867(0x27f)], CONNECTING) && console[_0x28b867(0x247)](await global[_0x28b867(0x20c) + _0x28b867(0x130)](!![])), _0x39e6fb[_0x28b867(0x146)](global['db'][_0x28b867(0x2f6)], null) && await global[_0x28b867(0x205) + 'se']();
}
process['on'](_0x8b60c9(0x149) + _0x8b60c9(0x22e), console[_0x8b60c9(0x1fa)]);
let isInit = !![], handler = await import(_0x8b60c9(0x2c9) + 'js');
global[_0x8b60c9(0x20c) + _0x8b60c9(0x130)] = async function (_0x33b34b) {
    const _0x17f69d = _0x8b60c9, _0x46c7cc = {
            'fTfye': _0x17f69d(0xe6) + _0x17f69d(0x20a),
            'ASFdx': function (_0x470306, _0x84f442) {
                return _0x470306 === _0x84f442;
            },
            'Gvxsf': _0x17f69d(0x1ec),
            'GFsco': _0x17f69d(0xe6) + _0x17f69d(0x2be),
            'ozPnd': function (_0x2a97b4, _0xb78e87) {
                return _0x2a97b4 || _0xb78e87;
            },
            'VkEGi': function (_0x59585b, _0x154186, _0x2b96fa) {
                return _0x59585b(_0x154186, _0x2b96fa);
            },
            'NAPXY': _0x17f69d(0x249) + '2',
            'Fwemn': _0x17f69d(0x255) + _0x17f69d(0x261),
            'RxWbl': _0x17f69d(0x16f) + _0x17f69d(0x29f),
            'ryczE': _0x17f69d(0x2ca) + 'te',
            'xxILn': _0x17f69d(0x233) + _0x17f69d(0x11f) + _0x17f69d(0x2c6),
            'iVzfI': _0x17f69d(0x28e) + _0x17f69d(0x14a),
            'MELsG': _0x17f69d(0x1cf) + _0x17f69d(0x10c),
            'hjQwK': _0x17f69d(0x2de) + _0x17f69d(0x296) + _0x17f69d(0x279) + _0x17f69d(0x209) + _0x17f69d(0x1a9),
            'rNVGd': _0x17f69d(0x18d) + _0x17f69d(0x1d7) + _0x17f69d(0xf2),
            'xRZLK': _0x17f69d(0x1bf) + _0x17f69d(0x1c9) + _0x17f69d(0x114),
            'uSqku': _0x17f69d(0x1bf) + _0x17f69d(0x184) + _0x17f69d(0x188) + 'n!',
            'iXbgh': _0x17f69d(0x2f3) + _0x17f69d(0x2bb) + _0x17f69d(0x158) + _0x17f69d(0x150),
            'YUTYi': _0x17f69d(0x2e5) + _0x17f69d(0x15c) + _0x17f69d(0x18f) + _0x17f69d(0x2cc) + 't',
            'aphsq': _0x17f69d(0x17a) + _0x17f69d(0x2bb) + _0x17f69d(0x222),
            'FjjnL': _0x17f69d(0x2d2) + _0x17f69d(0x15c) + _0x17f69d(0x179) + _0x17f69d(0x244),
            'MGeZp': _0x17f69d(0x230) + _0x17f69d(0x2b9) + _0x17f69d(0x2d0) + _0x17f69d(0x2b6) + _0x17f69d(0x124) + _0x17f69d(0x26a) + _0x17f69d(0x2e0),
            'BBDuO': _0x17f69d(0x230) + _0x17f69d(0x22a) + _0x17f69d(0x166) + _0x17f69d(0x2b7) + _0x17f69d(0x2a6) + _0x17f69d(0x16e) + _0x17f69d(0x153),
            'NXTRK': _0x17f69d(0x13f) + _0x17f69d(0x2d7) + _0x17f69d(0x137) + _0x17f69d(0x246),
            'EUFaQ': _0x17f69d(0x13f) + _0x17f69d(0x2d7) + _0x17f69d(0x237) + _0x17f69d(0x214),
            'gGdld': _0x17f69d(0x277)
        };
    try {
        const _0x5f351c = await import(_0x17f69d(0x2c9) + _0x17f69d(0xc4) + Date[_0x17f69d(0x2f2)]())[_0x17f69d(0x1b9)](console[_0x17f69d(0x1fa)]);
        if (Object[_0x17f69d(0x1a6)](_0x46c7cc[_0x17f69d(0x203)](_0x5f351c, {}))[_0x17f69d(0x167)])
            handler = _0x5f351c;
    } catch (_0x11dea9) {
        console[_0x17f69d(0x1fa)](_0x11dea9);
    }
    if (_0x33b34b) {
        const _0xb1c87 = global[_0x17f69d(0x1ab)][_0x17f69d(0xf1)];
        try {
            global[_0x17f69d(0x1ab)]['ws'][_0x17f69d(0x2af)]();
        } catch {
        }
        conn['ev'][_0x17f69d(0x11a) + _0x17f69d(0x1a7)](), global[_0x17f69d(0x1ab)] = _0x46c7cc[_0x17f69d(0x236)](makeWASocket, connectionOptions, { 'chats': _0xb1c87 }), isInit = !![];
    }
    if (!isInit) {
        const _0x3628b9 = _0x46c7cc[_0x17f69d(0x2bf)][_0x17f69d(0x136)]('|');
        let _0x310e92 = 0x2 * 0x1289 + -0x484 * 0x2 + -0x4a * 0x61;
        while (!![]) {
            switch (_0x3628b9[_0x310e92++]) {
            case '0':
                conn['ev'][_0x17f69d(0x111)](_0x46c7cc[_0x17f69d(0x113)], conn[_0x17f69d(0x142)]);
                continue;
            case '1':
                conn['ev'][_0x17f69d(0x111)](_0x46c7cc[_0x17f69d(0x100)], conn[_0x17f69d(0x2df)]);
                continue;
            case '2':
                conn['ev'][_0x17f69d(0x111)](_0x46c7cc[_0x17f69d(0x1ae)], conn[_0x17f69d(0x27d) + 'e']);
                continue;
            case '3':
                conn['ev'][_0x17f69d(0x111)](_0x46c7cc[_0x17f69d(0x178)], conn[_0x17f69d(0x220) + _0x17f69d(0x147)]);
                continue;
            case '4':
                conn['ev'][_0x17f69d(0x111)](_0x46c7cc[_0x17f69d(0x193)], conn[_0x17f69d(0x28a) + 'te']);
                continue;
            case '5':
                conn['ev'][_0x17f69d(0x111)](_0x46c7cc[_0x17f69d(0x1cb)], conn[_0x17f69d(0x1cf) + _0x17f69d(0x2f4)]);
                continue;
            }
            break;
        }
    }
    return conn[_0x17f69d(0xf0)] = _0x46c7cc[_0x17f69d(0x1bb)], conn[_0x17f69d(0x241)] = _0x46c7cc[_0x17f69d(0x2ad)], conn[_0x17f69d(0x264)] = _0x46c7cc[_0x17f69d(0xc5)], conn[_0x17f69d(0x253)] = _0x46c7cc[_0x17f69d(0x1f2)], conn[_0x17f69d(0x26d)] = _0x46c7cc[_0x17f69d(0x208)], conn[_0x17f69d(0x12f)] = _0x46c7cc[_0x17f69d(0x258)], conn[_0x17f69d(0x228)] = _0x46c7cc[_0x17f69d(0x156)], conn[_0x17f69d(0xd5)] = _0x46c7cc[_0x17f69d(0xf7)], conn[_0x17f69d(0xfd) + 'n'] = _0x46c7cc[_0x17f69d(0x1bc)], conn[_0x17f69d(0xfd) + 'ff'] = _0x46c7cc[_0x17f69d(0x19b)], conn[_0x17f69d(0x29d) + 'n'] = _0x46c7cc[_0x17f69d(0x10d)], conn[_0x17f69d(0x29d) + 'ff'] = _0x46c7cc[_0x17f69d(0x2e7)], conn[_0x17f69d(0x2df)] = handler[_0x17f69d(0x2df)][_0x17f69d(0x15d)](global[_0x17f69d(0x1ab)]), conn[_0x17f69d(0x220) + _0x17f69d(0x147)] = handler[_0x17f69d(0x220) + _0x17f69d(0x147)][_0x17f69d(0x15d)](global[_0x17f69d(0x1ab)]), conn[_0x17f69d(0x28a) + 'te'] = handler[_0x17f69d(0x28a) + 'te'][_0x17f69d(0x15d)](global[_0x17f69d(0x1ab)]), conn[_0x17f69d(0x142)] = handler[_0x17f69d(0xe7) + 'te'][_0x17f69d(0x15d)](global[_0x17f69d(0x1ab)]), conn[_0x17f69d(0x1cf) + _0x17f69d(0x2f4)] = connectionUpdate[_0x17f69d(0x15d)](global[_0x17f69d(0x1ab)]), conn[_0x17f69d(0x27d) + 'e'] = saveCreds[_0x17f69d(0x15d)](global[_0x17f69d(0x1ab)]), conn['ev']['on'](_0x46c7cc[_0x17f69d(0x2a2)], async _0x144bfc => {
        const _0x4d088f = _0x17f69d;
        console[_0x4d088f(0x247)](_0x46c7cc[_0x4d088f(0x1f1)], _0x144bfc), _0x46c7cc[_0x4d088f(0x278)](_0x144bfc[_0x4d088f(0x16d)], _0x46c7cc[_0x4d088f(0x2f7)]) && (await conn[_0x4d088f(0xe5)](_0x144bfc['id']), console[_0x4d088f(0x247)](_0x46c7cc[_0x4d088f(0xf6)]));
    }), conn['ev']['on'](_0x46c7cc[_0x17f69d(0x100)], conn[_0x17f69d(0x2df)]), conn['ev']['on'](_0x46c7cc[_0x17f69d(0x178)], conn[_0x17f69d(0x220) + _0x17f69d(0x147)]), conn['ev']['on'](_0x46c7cc[_0x17f69d(0x193)], conn[_0x17f69d(0x28a) + 'te']), conn['ev']['on'](_0x46c7cc[_0x17f69d(0x113)], conn[_0x17f69d(0x142)]), conn['ev']['on'](_0x46c7cc[_0x17f69d(0x1cb)], conn[_0x17f69d(0x1cf) + _0x17f69d(0x2f4)]), conn['ev']['on'](_0x46c7cc[_0x17f69d(0x1ae)], conn[_0x17f69d(0x27d) + 'e']), isInit = ![], !![];
};
const pluginFolder = global[_0x8b60c9(0x187)](join(__dirname, _0x8b60c9(0x252) + _0x8b60c9(0xee))), pluginFilter = _0x809bc0 => /\.js$/[_0x8b60c9(0x2aa)](_0x809bc0);
global[_0x8b60c9(0x1df)] = {};
async function filesInit() {
    const _0x424274 = _0x8b60c9, _0x266ea7 = {
            'ZpaYt': function (_0x108b03, _0x2c4625) {
                return _0x108b03(_0x2c4625);
            },
            'YCaja': function (_0x1560bd, _0x8f7c96, _0x16737c) {
                return _0x1560bd(_0x8f7c96, _0x16737c);
            }
        };
    for (let _0x4e7d53 of _0x266ea7[_0x424274(0x160)](readdirSync, pluginFolder)[_0x424274(0x2b0)](pluginFilter)) {
        try {
            let _0x4a149f = global[_0x424274(0x20b)](_0x266ea7[_0x424274(0x2d6)](join, pluginFolder, _0x4e7d53));
            const _0x19c2a4 = await import(_0x4a149f);
            global[_0x424274(0x1df)][_0x4e7d53] = _0x19c2a4[_0x424274(0x21a)] || _0x19c2a4;
        } catch (_0x1fdbdd) {
            conn[_0x424274(0x133)][_0x424274(0x1fa)](_0x1fdbdd), delete global[_0x424274(0x1df)][_0x4e7d53];
        }
    }
}
filesInit()[_0x8b60c9(0x2a4)](_0x578fbe => console[_0x8b60c9(0x247)](Object[_0x8b60c9(0x1a6)](global[_0x8b60c9(0x1df)])))[_0x8b60c9(0x1b9)](console[_0x8b60c9(0x1fa)]), global[_0x8b60c9(0x115)] = async (_0x31b0ae, _0x3fe788) => {
    const _0x241e9a = _0x8b60c9, _0x6758a6 = {
            'RNSyv': function (_0x454aa1, _0x5c5d79) {
                return _0x454aa1(_0x5c5d79);
            },
            'rPOsA': function (_0x13272b, _0x5a9eb8, _0x561066) {
                return _0x13272b(_0x5a9eb8, _0x561066);
            },
            'xajVA': function (_0x5c6f59, _0x29ff32) {
                return _0x5c6f59 in _0x29ff32;
            },
            'aUVtb': function (_0x23a60c, _0x429b13) {
                return _0x23a60c(_0x429b13);
            },
            'XRdBU': function (_0x3057de, _0x4dca3e, _0x6a3972, _0x5301ec) {
                return _0x3057de(_0x4dca3e, _0x6a3972, _0x5301ec);
            },
            'bvbQi': _0x241e9a(0x2e3),
            'JOAyt': function (_0x3ecbb8, _0x4f09ed) {
                return _0x3ecbb8(_0x4f09ed);
            }
        };
    if (_0x6758a6[_0x241e9a(0x175)](pluginFilter, _0x3fe788)) {
        let _0xae677b = global[_0x241e9a(0x20b)](_0x6758a6[_0x241e9a(0x192)](join, pluginFolder, _0x3fe788), !![]);
        if (_0x6758a6[_0x241e9a(0x271)](_0x3fe788, global[_0x241e9a(0x1df)])) {
            if (_0x6758a6[_0x241e9a(0xc8)](existsSync, _0xae677b))
                conn[_0x241e9a(0x133)][_0x241e9a(0x26c)](_0x241e9a(0x1ba) + _0x241e9a(0x2a9) + '\x27' + _0x3fe788 + '\x27');
            else
                return conn[_0x241e9a(0x133)][_0x241e9a(0x200)](_0x241e9a(0x2ab) + _0x241e9a(0x298) + _0x3fe788 + '\x27'), delete global[_0x241e9a(0x1df)][_0x3fe788];
        } else
            conn[_0x241e9a(0x133)][_0x241e9a(0x26c)](_0x241e9a(0xe3) + _0x241e9a(0x2e2) + '\x20\x27' + _0x3fe788 + '\x27');
        let _0xc8b5cb = _0x6758a6[_0x241e9a(0x17f)](_0x2dddc5, _0x6758a6[_0x241e9a(0x175)](readFileSync, _0xae677b), _0x3fe788, {
            'sourceType': _0x6758a6[_0x241e9a(0x225)],
            'allowAwaitOutsideFunction': !![]
        });
        if (_0xc8b5cb)
            conn[_0x241e9a(0x133)][_0x241e9a(0x1fa)](_0x241e9a(0xe2) + _0x241e9a(0x14b) + _0x241e9a(0x21f) + _0x3fe788 + '\x27\x0a' + _0x6758a6[_0x241e9a(0xc8)](format, _0xc8b5cb));
        else
            try {
                const _0x22bc3b = await import(global[_0x241e9a(0x20b)](_0xae677b) + _0x241e9a(0x1e8) + Date[_0x241e9a(0x2f2)]());
                global[_0x241e9a(0x1df)][_0x3fe788] = _0x22bc3b[_0x241e9a(0x21a)] || _0x22bc3b;
            } catch (_0x27d2a5) {
                conn[_0x241e9a(0x133)][_0x241e9a(0x1fa)](_0x241e9a(0x23a) + _0x241e9a(0x16c) + '\x20\x27' + _0x3fe788 + '\x0a' + _0x6758a6[_0x241e9a(0x1eb)](format, _0x27d2a5) + '\x27');
            } finally {
                global[_0x241e9a(0x1df)] = Object[_0x241e9a(0x293) + 's'](Object[_0x241e9a(0x19f)](global[_0x241e9a(0x1df)])[_0x241e9a(0x22b)](([_0x4479b7], [_0x1ce718]) => _0x4479b7[_0x241e9a(0x2da) + _0x241e9a(0x199)](_0x1ce718)));
            }
    }
}, Object[_0x8b60c9(0xef)](global[_0x8b60c9(0x115)]), watch(pluginFolder, global[_0x8b60c9(0x115)]), await global[_0x8b60c9(0x20c) + _0x8b60c9(0x130)]();
async function _quickTest() {
    const _0x571403 = _0x8b60c9, _0x300fbc = {
            'sCnDu': function (_0x20497e, _0x1594ae) {
                return _0x20497e(_0x1594ae);
            },
            'AHIMa': function (_0x460b8c, _0x582a9b) {
                return _0x460b8c !== _0x582a9b;
            },
            'HKsxi': _0x571403(0x2af),
            'yCTFY': _0x571403(0x1fa),
            'beuPq': function (_0x4d8ac5, _0x258a80) {
                return _0x4d8ac5(_0x258a80);
            },
            'kVVDB': _0x571403(0x155),
            'GeLLL': _0x571403(0x19a),
            'QbMfy': function (_0x2a517a, _0x5da985, _0x23d4cb) {
                return _0x2a517a(_0x5da985, _0x23d4cb);
            },
            'jGSmo': _0x571403(0x270) + 'er',
            'FCuYN': _0x571403(0xcd),
            'yhBCu': _0x571403(0x125) + _0x571403(0x139),
            'WxnNM': _0x571403(0x16a),
            'STbYu': _0x571403(0xc7),
            'wNBLD': _0x571403(0x2eb),
            'QKjHG': function (_0x411bf4, _0x51c1b3) {
                return _0x411bf4(_0x51c1b3);
            },
            'TYwHO': _0x571403(0x292),
            'itpje': _0x571403(0x2b5),
            'xuVoL': function (_0x303fe6, _0x4a56c1) {
                return _0x303fe6(_0x4a56c1);
            },
            'hjZAy': _0x571403(0x1c1),
            'EGPto': _0x571403(0x1c4),
            'gYbdz': _0x571403(0x202) + _0x571403(0x2f0) + _0x571403(0x185) + _0x571403(0x2b8) + _0x571403(0x108) + _0x571403(0x27b) + _0x571403(0x1dc) + _0x571403(0x239) + _0x571403(0x2e8) + _0x571403(0x215),
            'ILBrQ': _0x571403(0x12e) + _0x571403(0x2cd) + _0x571403(0x127) + _0x571403(0x268) + _0x571403(0x2e1) + _0x571403(0x1db) + _0x571403(0x128) + _0x571403(0x273) + _0x571403(0x1fe) + _0x571403(0x1d2) + _0x571403(0x189) + _0x571403(0x23b)
        };
    let _0x3cf7ee = await Promise[_0x571403(0x2e9)]([
            _0x300fbc[_0x571403(0x275)](spawn, _0x300fbc[_0x571403(0x138)]),
            _0x300fbc[_0x571403(0x275)](spawn, _0x300fbc[_0x571403(0x18a)]),
            _0x300fbc[_0x571403(0x28d)](spawn, _0x300fbc[_0x571403(0x138)], [
                _0x300fbc[_0x571403(0x2ae)],
                _0x300fbc[_0x571403(0xea)],
                _0x300fbc[_0x571403(0x1de)],
                _0x300fbc[_0x571403(0x19d)],
                _0x300fbc[_0x571403(0x217)],
                _0x300fbc[_0x571403(0xd2)],
                '1',
                '-f',
                _0x300fbc[_0x571403(0x2e6)],
                '-'
            ]),
            _0x300fbc[_0x571403(0x14c)](spawn, _0x300fbc[_0x571403(0x194)]),
            _0x300fbc[_0x571403(0x275)](spawn, _0x300fbc[_0x571403(0x2a0)]),
            _0x300fbc[_0x571403(0xd0)](spawn, 'gm'),
            _0x300fbc[_0x571403(0x28d)](spawn, _0x300fbc[_0x571403(0x198)], [_0x300fbc[_0x571403(0x1c6)]])
        ][_0x571403(0x169)](_0x207f45 => {
            const _0x2e611e = _0x571403, _0x5d9ae6 = { 'ygrgz': _0x300fbc[_0x2e611e(0x1de)] };
            return Promise[_0x2e611e(0x1fc)]([
                new Promise(_0x565026 => {
                    const _0x2beace = _0x2e611e, _0x30e0d1 = {
                            'eaBZY': function (_0x1a1d83, _0x57e8af) {
                                const _0x2173a2 = _0x169d;
                                return _0x300fbc[_0x2173a2(0x1f4)](_0x1a1d83, _0x57e8af);
                            },
                            'RSVBn': function (_0x464d24, _0x3665c3) {
                                const _0x38e5ce = _0x169d;
                                return _0x300fbc[_0x38e5ce(0x163)](_0x464d24, _0x3665c3);
                            }
                        };
                    _0x207f45['on'](_0x300fbc[_0x2beace(0x17b)], _0x40fe67 => {
                        const _0x19ae6b = _0x2beace;
                        _0x30e0d1[_0x19ae6b(0x172)](_0x565026, _0x30e0d1[_0x19ae6b(0x25c)](_0x40fe67, -0x21 * -0x11d + -0x2605 + 0x5b * 0x5));
                    });
                }),
                new Promise(_0x1acae2 => {
                    const _0x12f33d = _0x2e611e;
                    _0x207f45['on'](_0x5d9ae6[_0x12f33d(0xf4)], _0x401242 => _0x1acae2(![]));
                })
            ]);
        })), [_0x2dbe15, _0x364919, _0xe71913, _0x323f5b, _0x2bb66b, _0x23cca3, _0x5930a3] = _0x3cf7ee, _0xe5024f = global[_0x571403(0x195)] = {
            'ffmpeg': _0x2dbe15,
            'ffprobe': _0x364919,
            'ffmpegWebp': _0xe71913,
            'convert': _0x323f5b,
            'magick': _0x2bb66b,
            'gm': _0x23cca3,
            'find': _0x5930a3
        };
    Object[_0x571403(0xef)](global[_0x571403(0x195)]), !_0xe5024f[_0x571403(0x155)] && conn[_0x571403(0x133)][_0x571403(0x200)](_0x571403(0x107) + _0x571403(0x294) + _0x571403(0xd1) + _0x571403(0x1d3) + _0x571403(0x1d1) + _0x571403(0x1a0) + _0x571403(0x10f)), _0xe5024f[_0x571403(0x155)] && !_0xe5024f[_0x571403(0x2ec)] && conn[_0x571403(0x133)][_0x571403(0x200)](_0x300fbc[_0x571403(0x2b4)]), !_0xe5024f[_0x571403(0x292)] && !_0xe5024f[_0x571403(0x2b5)] && !_0xe5024f['gm'] && conn[_0x571403(0x133)][_0x571403(0x200)](_0x300fbc[_0x571403(0x2c7)]);
}
_quickTest()[_0x8b60c9(0x2a4)](() => conn[_0x8b60c9(0x133)][_0x8b60c9(0x26c)](_0x8b60c9(0x2e4) + _0x8b60c9(0x1e0) + _0x8b60c9(0xec) + _0x8b60c9(0x109) + _0x8b60c9(0x289) + 'n'))[_0x8b60c9(0x1b9)](console[_0x8b60c9(0x1fa)]);