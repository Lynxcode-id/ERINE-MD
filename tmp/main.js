const _0x509857 = _0xfdad;
(function (_0x1f0ce9, _0x4ca73e) {
    const _0x131a70 = _0xfdad, _0x4f8cff = _0x1f0ce9();
    while (!![]) {
        try {
            const _0xaea15a = -parseInt(_0x131a70(0x165)) / (-0xaf6 + -0x1fc3 * 0x1 + 0xe3e * 0x3) * (parseInt(_0x131a70(0xf1)) / (0x266 + 0x2419 + 0xa7 * -0x3b)) + parseInt(_0x131a70(0xf7)) / (-0xec9 * -0x1 + -0x18f7 + 0xa31) + parseInt(_0x131a70(0x18c)) / (-0x14b * 0xd + 0x40f * -0x6 + 0x292d) * (parseInt(_0x131a70(0x2c8)) / (0x1 * -0x29b + -0x1128 + -0x1a6 * -0xc)) + parseInt(_0x131a70(0x1d7)) / (-0x269a + 0xb * -0xdb + 0x3009 * 0x1) * (-parseInt(_0x131a70(0x87)) / (0x915 * -0x1 + 0x153 * -0x1d + -0x2f83 * -0x1)) + parseInt(_0x131a70(0xeb)) / (0x1504 + -0xf * 0x281 + -0x1093 * -0x1) + -parseInt(_0x131a70(0xfa)) / (-0x8 * -0x60 + -0x1 * -0x92b + 0x611 * -0x2) + parseInt(_0x131a70(0x1a6)) / (0x3b3 + -0x1761 + 0x13b8);
            if (_0xaea15a === _0x4ca73e)
                break;
            else
                _0x4f8cff['push'](_0x4f8cff['shift']());
        } catch (_0x5ea35d) {
            _0x4f8cff['push'](_0x4f8cff['shift']());
        }
    }
}(_0x500f, -0x737e8 + 0x86 * 0x141e + 0x31d42), process[_0x509857(0xcd)][_0x509857(0x221) + _0x509857(0x14e) + _0x509857(0x25b)] = '1');
import './config.js';
import _0x3abfb1, { join } from 'path';
import { platform } from 'process';
import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import { createRequire } from 'module';
global[_0x509857(0x196)] = function filename(_0x15c9cf = import.meta.url, _0x9d4ec5 = platform !== _0x509857(0x8b)) {
    const _0xe388bf = _0x509857, _0x1469f9 = {
            'hlbhE': function (_0x1a00e7, _0xeb67e0) {
                return _0x1a00e7(_0xeb67e0);
            },
            'uEiAR': function (_0x4514a0, _0x4f01b2) {
                return _0x4514a0(_0x4f01b2);
            }
        };
    return _0x9d4ec5 ? /file:\/\/\//[_0xe388bf(0x22d)](_0x15c9cf) ? _0x1469f9[_0xe388bf(0x88)](fileURLToPath, _0x15c9cf) : _0x15c9cf : _0x1469f9[_0xe388bf(0x241)](pathToFileURL, _0x15c9cf)[_0xe388bf(0x1d0)]();
}, global[_0x509857(0x7b)] = function dirname(_0x1dd9db) {
    const _0x28fef9 = _0x509857;
    return _0x3abfb1[_0x28fef9(0x1a4)](global[_0x28fef9(0x196)](_0x1dd9db, !![]));
}, global[_0x509857(0xaa)] = function require(_0x2aa203 = import.meta.url) {
    const _0x13f693 = _0x509857, _0x45409e = {
            'IHvYn': function (_0x5e80fe, _0x466538) {
                return _0x5e80fe(_0x466538);
            }
        };
    return _0x45409e[_0x13f693(0xdb)](createRequire, _0x2aa203);
};
import {
    readdirSync,
    statSync,
    unlinkSync,
    existsSync,
    readFileSync,
    watch
} from 'fs';
import _0x32e06d from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
const argv = _0x32e06d(hideBin(process[_0x509857(0x27f)]))[_0x509857(0x27f)];
import { spawn } from 'child_process';
import _0x4c33c1 from 'lodash';
import _0x197fe4 from 'syntax-error';
import _0x3d0367 from 'chalk';
import { tmpdir } from 'os';
import _0x335b90 from 'readline';
import { format } from 'util';
import _0x246174 from 'pino';
import _0xd6e533 from 'ws';
import * as _0x439ed0 from '@whiskeysockets/baileys';
const {useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, makeCacheableSignalKeyStore, jidNormalizedUser} = _0x439ed0;
import _0x1e967a from 'node-cache';
const msgRetryCounterCache = new _0x1e967a({
        'stdTTL': (-0x1 * -0x1ea2 + 0x66 + -0x1 * 0x1efe) * (-0x2103 + 0xbcc * -0x2 + -0x38d7 * -0x1),
        'checkperiod': 0x3c
    }), groupCache = new _0x1e967a({
        'stdTTL': (-0x1f3c + -0x1f4d * 0x1 + 0x3e8e * 0x1) * (-0x1 * -0x5c9 + 0x1a36 + 0xad * -0x2f),
        'useClones': ![]
    }), lidMap = new Map(), pnMap = new Map();
async function resolvePhoneNumber(_0x3b0f70 = '', _0xdf9a69 = global[_0x509857(0x267)]) {
    const _0x421757 = _0x509857, _0x52842b = {
            'jhcRE': function (_0x45358d, _0x53cf5c) {
                return _0x45358d(_0x53cf5c);
            },
            'YJUQY': _0x421757(0x25f) + _0x421757(0x2af),
            'bVNfK': _0x421757(0x156)
        };
    if (!_0x3b0f70)
        return '';
    _0x3b0f70 = _0x52842b[_0x421757(0x105)](jidNormalizedUser, _0x3b0f70);
    if (pnMap[_0x421757(0x15d)](_0x3b0f70))
        return pnMap[_0x421757(0x223)](_0x3b0f70);
    if (/^\d+$/[_0x421757(0x22d)](_0x3b0f70))
        return _0x3b0f70;
    if (_0x3b0f70[_0x421757(0x14c)](_0x52842b[_0x421757(0x7e)])) {
        const _0x554ee2 = _0x3b0f70[_0x421757(0xd1)]('@')[0x1cf5 * 0x1 + 0x1525 + -0x321a];
        return pnMap[_0x421757(0x2df)](_0x3b0f70, _0x554ee2), _0x554ee2;
    }
    if (_0xdf9a69?.[_0x421757(0x129)])
        for (const _0x4b9df8 of Object[_0x421757(0x28a)](_0xdf9a69[_0x421757(0x129)])) {
            const _0x596172 = _0x4b9df8?.[_0x421757(0x261)]?.[_0x421757(0x273) + 'ts']?.[_0x421757(0x125)](_0x53b6b0 => _0x53b6b0[_0x421757(0x180)] === _0x3b0f70 || _0x53b6b0['id'] === _0x3b0f70);
            if (_0x596172?.[_0x421757(0xb1) + 'r']) {
                const _0x5aa87f = _0x596172[_0x421757(0xb1) + 'r'][_0x421757(0x140)](/[^0-9]/g, '');
                return pnMap[_0x421757(0x2df)](_0x3b0f70, _0x5aa87f), _0x5aa87f;
            }
            if (_0x596172?.['id'] && !_0x596172['id'][_0x421757(0x24d)](_0x52842b[_0x421757(0x1db)])) {
                const _0x1bd2f0 = _0x596172['id'][_0x421757(0xd1)]('@')[0x25a6 + -0x2143 + -0x463];
                return pnMap[_0x421757(0x2df)](_0x3b0f70, _0x1bd2f0), _0x1bd2f0;
            }
        }
    try {
        const [_0x490c7a] = await global[_0x421757(0x267)][_0x421757(0x14d)](_0x3b0f70)[_0x421757(0x1b5)](() => [{}]);
        if (_0x490c7a?.[_0x421757(0x14f)] && !_0x490c7a[_0x421757(0x14f)][_0x421757(0x24d)](_0x52842b[_0x421757(0x1db)])) {
            const _0x5af1a9 = _0x490c7a[_0x421757(0x14f)][_0x421757(0xd1)]('@')[-0x24d5 + 0x1 * -0x191b + -0x10 * -0x3df];
            return pnMap[_0x421757(0x2df)](_0x3b0f70, _0x5af1a9), _0x5af1a9;
        }
    } catch {
    }
    return _0x3b0f70[_0x421757(0x140)](/[^0-9]/g, '');
}
async function normalizeMainJid(_0x133f3d) {
    const _0x5b1f74 = _0x509857, _0x5e5388 = {
            'aYdGx': function (_0x2eca3a, _0x195589) {
                return _0x2eca3a(_0x195589);
            },
            'RIUDx': _0x5b1f74(0x156)
        };
    if (!_0x133f3d)
        return '';
    _0x133f3d = _0x5e5388[_0x5b1f74(0x1c2)](jidNormalizedUser, _0x133f3d);
    if (!_0x133f3d[_0x5b1f74(0x24d)](_0x5e5388[_0x5b1f74(0x263)]))
        return _0x133f3d;
    if (lidMap[_0x5b1f74(0x15d)](_0x133f3d))
        return lidMap[_0x5b1f74(0x223)](_0x133f3d);
    if (global[_0x5b1f74(0x267)]?.[_0x5b1f74(0x195)]?.[_0x133f3d])
        return global[_0x5b1f74(0x267)][_0x5b1f74(0x195)][_0x133f3d];
    if (global[_0x5b1f74(0x267)]?.[_0x5b1f74(0x129)])
        for (const _0x1e28c2 of Object[_0x5b1f74(0x28a)](global[_0x5b1f74(0x267)][_0x5b1f74(0x129)])) {
            const _0xde5186 = _0x1e28c2?.[_0x5b1f74(0x261)]?.[_0x5b1f74(0x273) + 'ts']?.[_0x5b1f74(0x125)](_0x5e32c8 => _0x5e32c8[_0x5b1f74(0x180)] === _0x133f3d);
            if (_0xde5186?.['id'] && !_0xde5186['id'][_0x5b1f74(0x24d)](_0x5e5388[_0x5b1f74(0x263)])) {
                lidMap[_0x5b1f74(0x2df)](_0x133f3d, _0xde5186['id']);
                if (!global[_0x5b1f74(0x267)][_0x5b1f74(0x195)])
                    global[_0x5b1f74(0x267)][_0x5b1f74(0x195)] = {};
                return global[_0x5b1f74(0x267)][_0x5b1f74(0x195)][_0x133f3d] = _0xde5186['id'], _0xde5186['id'];
            }
            if (_0xde5186?.[_0x5b1f74(0xb1) + 'r']) {
                const _0xf18c2e = _0xde5186[_0x5b1f74(0xb1) + 'r'][_0x5b1f74(0x140)](/[^0-9]/g, '') + (_0x5b1f74(0x25f) + _0x5b1f74(0x2af));
                lidMap[_0x5b1f74(0x2df)](_0x133f3d, _0xf18c2e);
                if (!global[_0x5b1f74(0x267)][_0x5b1f74(0x195)])
                    global[_0x5b1f74(0x267)][_0x5b1f74(0x195)] = {};
                return global[_0x5b1f74(0x267)][_0x5b1f74(0x195)][_0x133f3d] = _0xf18c2e, _0xf18c2e;
            }
        }
    try {
        const [_0x2663b1] = await global[_0x5b1f74(0x267)][_0x5b1f74(0x14d)](_0x133f3d)[_0x5b1f74(0x1b5)](() => [{}]);
        if (_0x2663b1?.[_0x5b1f74(0x14f)] && !_0x2663b1[_0x5b1f74(0x14f)][_0x5b1f74(0x24d)](_0x5e5388[_0x5b1f74(0x263)])) {
            lidMap[_0x5b1f74(0x2df)](_0x133f3d, _0x2663b1[_0x5b1f74(0x14f)]);
            if (!global[_0x5b1f74(0x267)][_0x5b1f74(0x195)])
                global[_0x5b1f74(0x267)][_0x5b1f74(0x195)] = {};
            return global[_0x5b1f74(0x267)][_0x5b1f74(0x195)][_0x133f3d] = _0x2663b1[_0x5b1f74(0x14f)], _0x2663b1[_0x5b1f74(0x14f)];
        }
    } catch {
    }
    const _0x3696aa = _0x133f3d[_0x5b1f74(0x140)](/[^0-9]/g, '');
    if (_0x3696aa)
        return _0x3696aa + (_0x5b1f74(0x25f) + _0x5b1f74(0x2af));
    return _0x133f3d;
}
setInterval(() => {
    const _0x51356a = _0x509857, _0x34db69 = {
            'NSacg': function (_0x4ecb36, _0x3670f6) {
                return _0x4ecb36 > _0x3670f6;
            }
        };
    if (_0x34db69[_0x51356a(0xee)](lidMap[_0x51356a(0x1ae)], -0xba8 * -0x3 + 0x1e3c + -0x4a * 0x9e))
        lidMap[_0x51356a(0x1e6)]();
    if (_0x34db69[_0x51356a(0xee)](pnMap[_0x51356a(0x1ae)], -0x3 * -0xc0e + -0xea + -0xfb8))
        pnMap[_0x51356a(0x1e6)]();
}, (-0xc42 * -0x1 + 0x29f + -0xedb * 0x1) * (-0x18bf + 0x1 * 0xf8d + 0x4b7 * 0x2) * (0x1 * -0x509 + -0x5b + 0x5a0) * (0x20be + -0x8a0 + -0x1a * 0xc7));
const setGroupCache = async _0x213226 => {
    const _0x16a2db = _0x509857, _0x263191 = {
            'fnazZ': function (_0x5902e2, _0x289fda) {
                return _0x5902e2(_0x289fda);
            },
            'Xyesg': _0x16a2db(0x14a),
            'oaofK': _0x16a2db(0x156)
        }, _0x579b25 = await _0x263191[_0x16a2db(0x294)](normalizeMainJid, _0x213226);
    if (_0x579b25[_0x16a2db(0x24d)](_0x263191[_0x16a2db(0xc3)])) {
        const _0x12e820 = await global[_0x16a2db(0x267)][_0x16a2db(0x18a) + _0x16a2db(0xc0)](_0x579b25)[_0x16a2db(0x1b5)](() => null);
        if (_0x12e820) {
            groupCache[_0x16a2db(0x2df)](_0x579b25, _0x12e820);
            for (let _0x12d74a of _0x12e820[_0x16a2db(0x273) + 'ts'] || []) {
                if (_0x12d74a[_0x16a2db(0x180)] && _0x12d74a['id'] && !_0x12d74a['id'][_0x16a2db(0x24d)](_0x263191[_0x16a2db(0x258)])) {
                    lidMap[_0x16a2db(0x2df)](_0x12d74a[_0x16a2db(0x180)], _0x12d74a['id']);
                    if (!global[_0x16a2db(0x267)][_0x16a2db(0x195)])
                        global[_0x16a2db(0x267)][_0x16a2db(0x195)] = {};
                    global[_0x16a2db(0x267)][_0x16a2db(0x195)][_0x12d74a[_0x16a2db(0x180)]] = _0x12d74a['id'];
                }
                if (_0x12d74a[_0x16a2db(0xb1) + 'r'] && _0x12d74a[_0x16a2db(0x180)]) {
                    const _0x5c5ce1 = _0x12d74a[_0x16a2db(0xb1) + 'r'][_0x16a2db(0x140)](/[^0-9]/g, '') + (_0x16a2db(0x25f) + _0x16a2db(0x2af));
                    lidMap[_0x16a2db(0x2df)](_0x12d74a[_0x16a2db(0x180)], _0x5c5ce1);
                    if (!global[_0x16a2db(0x267)][_0x16a2db(0x195)])
                        global[_0x16a2db(0x267)][_0x16a2db(0x195)] = {};
                    global[_0x16a2db(0x267)][_0x16a2db(0x195)][_0x12d74a[_0x16a2db(0x180)]] = _0x5c5ce1, pnMap[_0x16a2db(0x2df)](_0x12d74a[_0x16a2db(0x180)], _0x12d74a[_0x16a2db(0xb1) + 'r'][_0x16a2db(0x140)](/[^0-9]/g, ''));
                }
            }
        }
    }
};
import {
    Low,
    JSONFile
} from 'lowdb';
import {
    makeWASocket,
    protoType,
    serialize
} from './lib/simple.js';
import _0x1cd324 from './lib/cloudDBAdapter.js';
import {
    mongoDB,
    mongoDBV2
} from './lib/mongoDB.js';
const {CONNECTING} = _0xd6e533, {chain} = _0x4c33c1, PORT = process[_0x509857(0xcd)][_0x509857(0x1e1)] || process[_0x509857(0xcd)][_0x509857(0x1fc) + 'T'] || -0xdd2 + -0xe1b + 0x255 * 0x11;
protoType(), serialize(), global[_0x509857(0x214)] = (_0xfbe878, _0x25f534 = '/', _0x2a4eae = {}, _0x511a1b) => (_0xfbe878 in global[_0x509857(0xde)] ? global[_0x509857(0xde)][_0xfbe878] : _0xfbe878) + _0x25f534 + (_0x2a4eae || _0x511a1b ? '?' + new URLSearchParams(Object[_0x509857(0x218)]({
    ..._0x2a4eae,
    ..._0x511a1b ? { [_0x511a1b]: global[_0x509857(0xa0)][_0xfbe878 in global[_0x509857(0xde)] ? global[_0x509857(0xde)][_0xfbe878] : _0xfbe878] } : {}
})) : ''), global[_0x509857(0x28e)] = { 'start': new Date() };
const __dirname = global[_0x509857(0x7b)](import.meta.url);
function _0x500f() {
    const _0x297e24 = [
        's\x20follow\x20s',
        'prefix',
        'stringify',
        'sage',
        'requestPai',
        '12665352@n',
        'telah\x20diub',
        'registered',
        'test',
        '\x20\x0a@desc',
        'rface',
        'nect\x20karen',
        'ate',
        'xPvnj',
        'statusCode',
        'son',
        'Follow',
        'SAVUH',
        'BHnbo',
        'aGNbs',
        'ringCode',
        'match',
        'repeat',
        'ORZlW',
        'wnQMP',
        'TIclj',
        'or\x20while\x20l',
        './sessions',
        'uEiAR',
        'VBKDy',
        'object',
        'DATABASE',
        '%+£¢€¥^°=¶',
        'ringing',
        'segera!',
        'redBright',
        'NJkEK',
        'yellow',
        'bold',
        'nerate\x20pai',
        'endsWith',
        'vAPYU',
        'Error\x20in\x20C',
        'BVkBA',
        'mengirim\x20v',
        'push',
        'icipants.u',
        'peg\x20terleb',
        'l\x20(pkg\x20ins',
        'ah\x20ke\x20hany',
        'IvQhF',
        'oaofK',
        'Dvyoe',
        '🔄\x20Menghidu',
        'THORIZED',
        'Deskripsi\x20',
        'message.de',
        'lete',
        '@s.whatsap',
        '--use-pair',
        'metadata',
        'GMCuU',
        'RIUDx',
        'READ',
        'semua\x20pese',
        'mNPhC',
        'conn',
        'Dwtee',
        '✅\x20Sukses\x20A',
        '☑️\x20Quick\x20Te',
        'FDagx',
        'RdqAM',
        'bgRed',
        'info',
        'isInit',
        'aLSvS',
        'Fitur\x20Stik',
        '\x20version:',
        'participan',
        'essing\x20',
        'st\x20Baileys',
        'MqmHh',
        'i\x20\x0a@subjec',
        'color',
        'DFCFR',
        'are',
        '--version',
        'ffprobe',
        'ffmpeg\x20(--',
        '\x20compiling',
        'argv',
        'credsUpdat',
        'ibwebp\x20di\x20',
        'nakan:\x20',
        'syntax\x20err',
        'pVIeh',
        'bah\x20ke\x20\x0a@r',
        'rejectCall',
        '‎xzXZ/i!#$',
        '/jadibot.j',
        'sIcon',
        'values',
        'iQfZz',
        'Nibfu',
        '\x20grup\x20baru',
        'timestamp',
        'menerima\x20p',
        'lXlZW',
        'terputus\x20&',
        '\x20creds.jso',
        'key',
        'fnazZ',
        'XMNgP',
        'Sfmpi',
        './plugins/',
        'attrs',
        'esan.',
        '69528126@n',
        '\x20pairing\x20c',
        'uncaughtEx',
        'ditolak',
        'reloadHand',
        'then',
        'TOAiM',
        'magick',
        '1203634223',
        'nama\x20file\x20',
        'hSMVX',
        'oixav',
        '✅\x20Sukses\x20m',
        'ing-code',
        'BOOjR',
        'Update',
        'freeze',
        'Menunggu\x20P',
        'silent',
        'race',
        '\x20terinstal',
        'p.net',
        'Force\x20fetc',
        'pat\x20mengir',
        'zjyzl',
        'mulihkan\x20J',
        'r...',
        '❌\x20Gagal\x20Au',
        'NLlQM',
        'js?update=',
        'exit',
        'messages.u',
        'n\x20di\x20./lib',
        'mongodbv2',
        'pa\x20lagi,\x20@',
        'sRestrictO',
        'createInte',
        'heOcJ',
        '?&.\x5c-',
        'ontoh:\x20628',
        'sRevoke',
        'ngkin\x20Tida',
        'd\x20(awali\x20d',
        'templateMe',
        'er\x20Mungkin',
        'ZuIkS',
        '6200yGCvTX',
        'ubject*\x20🎉',
        'nstall\x20ffm',
        'database.j',
        'gu\x20sebenta',
        'axScm',
        'ring\x20code:',
        'isFile',
        'enyambung\x20',
        'wrtkQ',
        'XaeaN',
        './lib/jadi',
        'dah,\x20Siap\x20',
        '\x20🚫\x20[BLOKIR',
        'sSubject',
        '\x20negara,\x20c',
        'OElBG',
        'user',
        'gyFLs',
        'Link\x20group',
        'webp\x20di\x20ff',
        'a\x20admin!',
        'VVPvW',
        'set',
        '\x20Pairing\x20C',
        'pEqyx',
        'to-Join\x20GC',
        '58946360@n',
        'CZCtK',
        'xmlns',
        '1203634006',
        'bah\x20menjad',
        'st\x20Done\x20,\x20',
        'bot\x20(Sub-B',
        'aFLPz',
        'mplex',
        'adibot:',
        'DOcZT',
        'evoke',
        'r\x20WhatsApp',
        'se\x20mencoba',
        '__dirname',
        'xGxtO',
        'Group\x20tela',
        'YJUQY',
        'Status\x20Akt',
        'bot.js',
        'fkan\x20Bot,\x20',
        'tcVzs',
        'Dyawb',
        'ygtWW',
        'action',
        'erintah',
        '7JuhPnu',
        'hlbhE',
        'off',
        'bmIMG',
        'win32',
        'creds',
        'Failed\x20to\x20',
        '❌\x20Gagal\x20ge',
        'h\x20di\x20buka!',
        'wcnTt',
        'data',
        'jbpbX',
        'webp',
        'g\x20salah',
        'EjyrY',
        'nwudH',
        'isteners',
        'esan\x20Baru',
        'OVKTO',
        'sWDqN',
        'BMNzl',
        'Panggilan\x20',
        'Grup\x20di\x20ub',
        'si\x20tanpa\x20l',
        'prepare-sh',
        'APIKeys',
        'creds.json',
        'remoteJid',
        'ler',
        'Odvox',
        'HVxKd',
        'forEach',
        'groups.upd',
        'IkEEa',
        'ZagRG',
        '__require',
        '1203634045',
        'close',
        'EXScH',
        'epgoR',
        'spromote',
        'jalur\x20bela',
        'phoneNumbe',
        'newsletter',
        './handler.',
        './tmp',
        'low\x22',
        'lMaWK',
        'MajhY',
        'sBOPt',
        'Unfollow',
        'a\x20emang\x20ma',
        'now',
        'Success\x20Au',
        'listMessag',
        '\x0asekarang\x20',
        'HRUiS',
        'ata',
        '✅\x20Tersambu',
        'k\x20Beranima',
        'Xyesg',
        '\x20menembak\x20',
        '\x20hanya\x20adm',
        'blueBright',
        'output',
        'length',
        'log',
        'default',
        'BBVTK',
        'keys',
        'env',
        'plugins',
        'BLFdz',
        'SdnsH',
        'split',
        'oading\x20\x27',
        '!\x0asekarang',
        'SkTIv',
        'eBnLI',
        '\x20mencoba\x20m',
        'JoyoR',
        'im\x20pesan.',
        'rang\x20bukan',
        'HNmmy',
        'IHvYn',
        'utdown',
        '1203634249',
        'APIs',
        'write',
        'lWtWz',
        'map',
        '\x5c$&',
        'ShPNz',
        'bye',
        '@newslette',
        'loadMessag',
        'sDesc',
        'NvOpk',
        'TUtfj',
        'urPbP',
        '3265952pUGDik',
        'ieKYM',
        'status',
        'NSacg',
        'VFcXv',
        'join',
        '26PbmFcb',
        'kang!\x20Akse',
        'estart...',
        'JtYZI',
        'zgUhh',
        'admin!',
        '1258632lgQavb',
        'DgbZe',
        'Error\x20proc',
        '6490899rAHjkQ',
        'readyState',
        'ulang...',
        'bind',
        'rcpYR',
        'YTofG',
        'Icon\x20grup\x20',
        'connecting',
        'opts',
        'ya\x20ada\x20yan',
        '\x20imagemagi',
        'jhcRE',
        'Nomor\x20digu',
        'utDDu',
        'Silahkan\x20i',
        '\x20telah\x20diu',
        'safari',
        'ah\x20ke\x20semu',
        're\x20-\x20requi',
        'stdin',
        '\x20Tidak\x20Bek',
        'YBswL',
        're\x20plugin\x20',
        'UK\x20]\x20',
        'qKNmK',
        'chain',
        'joefd',
        'ons:\x20',
        'cKCEb',
        'users',
        'ots)...',
        'authState',
        '--mobile',
        'qgCBF',
        'h\x20di\x20tutup',
        'HCtRN',
        'veCXQ',
        'ire\x20plugin',
        'qTeJC',
        'knjCn',
        '57729073@g',
        'cyan',
        'aPPIE',
        'find',
        '\x20lagi\x20admi',
        'dibot\x20tida',
        'Input\x20nomo',
        'chats',
        '-frames:v',
        'KkmNq',
        'joLdN',
        'mtimeMs',
        'Cannot\x20use',
        'kUCWn',
        'error\x20requ',
        'logger',
        'EhsXD',
        './server.j',
        'ZyNiX',
        'Judul\x20grup',
        '?update=',
        'ottiv',
        '\x20sesi\x20Jadi',
        'tall\x20image',
        'mpeg\x20belum',
        '-loglevel',
        'uOAui',
        'ih\x20dahulu\x20',
        'pWZYe',
        'ck\x20dan\x20lib',
        'replace',
        'ode\x20with\x20m',
        'Sampai\x20jum',
        'Status\x20Mat',
        'requiring\x20',
        'cuy\x20di\x20*@s',
        'APQbq',
        't\x20error:',
        'ode:\x20',
        'QGtwD',
        '@g.us',
        'support',
        'includes',
        'onWhatsApp',
        'EJECT_UNAU',
        'jid',
        '\x20WhatsApp\x20',
        '│\x20\x20',
        'mwdjJ',
        'fromEntrie',
        'CULEd',
        '3|4|0|1|2',
        '@lid',
        'red',
        'ode...',
        '⚡\x20Mengakti',
        'mWMdP',
        '∆×÷π√✓©®:;',
        'group-part',
        'has',
        'ssion:',
        '⚠️\x20Modul\x20Ja',
        'Sticker\x20Mu',
        'message',
        'pkan\x20ulang',
        'filter',
        'KLNlF',
        '17079kcOdnU',
        'moWbn',
        'ideo',
        'isGRr',
        'deleteUpda',
        'buttonsMes',
        'loadDataba',
        'QKzSM',
        '\x20yang\x20vali',
        'EmgdI',
        'OkmZL',
        'vyWmQ',
        'h\x20metadata',
        'mengirim\x20p',
        'OerMc',
        'PdgRz',
        'question',
        'magenta',
        'ffmpeg',
        'lear\x20Sessi',
        'ssage',
        'zZjFl',
        '\x0aPairing\x20C',
        'sort',
        'ception',
        '12xxxxxx):',
        'ugin\x20\x27',
        'lid',
        'qgWVx',
        'store',
        'all',
        'obile\x20api',
        'wCoJu',
        '57759585@n',
        '⏱️\x20Koneksi\x20',
        'vpwVK',
        '-filter_co',
        'groupMetad',
        'DkEgW',
        '1360WRIHKJ',
        'Jadibot!',
        'diterima:',
        'pdate',
        'welcome',
        'emulihkan\x20',
        'psert',
        'tInvite',
        'sAnnounceO',
        'isLid',
        '__filename',
        'ode\x20ini\x20ke',
        'creds.upda',
        'k\x20ditemuka',
        'user\x20👋',
        'yEvEA',
        'n\x20before\x20r',
        'ewsletter',
        'CtEZz',
        'EQyxu',
        'a\x20peserta!',
        'trim',
        'bgWhite',
        'Skip\x20recon',
        'dirname',
        '\x20TOTAL]\x20Ba',
        '3714920WqtRFU',
        'main',
        'yDPsb',
        'tsUpdate',
        'green',
        'error',
        'erja\x20Tanpa',
        '\x22tag\x22:\x22fol',
        'size',
        'enable-lib',
        'BVBOZ',
        'open',
        'rang\x20jadi\x20',
        'IKebS',
        'pdbBE',
        'catch',
        '@user\x20Seka',
        'XpQER',
        'localeComp',
        'add',
        'NTxWX',
        'number',
        'fetch\x20late',
        'sdemote',
        '\x20[\x20LID\x20MAS',
        '5.1.10',
        'aluran\x20dit',
        'to\x20Reset\x20L',
        'aYdGx',
        'BUxpY',
        '.update',
        'reload',
        'UPGOV',
        'blue',
        'WIscm',
        'rLfYz',
        'warn',
        'parse',
        'read',
        'loggedOut',
        '1|4|3|2|5|',
        'qsbPz',
        'toString',
        'removeAllL',
        'stdout',
        'imit\x20ke\x2015',
        'engan\x20kode',
        'osPrd',
        'ah!',
        '1539048TKRuyW',
        'new\x20plugin',
        'Deleted\x20se',
        'connection',
        'bVNfK',
        '1203634267',
        'tag',
        'concat',
        'groupsUpda',
        'ERINEPRJ',
        'PORT',
        'IFLTD',
        'Edit\x20Info\x20',
        'Reset\x20limi',
        'u\x20restart',
        'clear',
        '👋\x20Halo\x20@us',
        'webp\x20while',
        'Kuxlr',
        '✅\x20Erine\x20su',
        'er!\x0a\x0aSelam',
        'in\x20yang\x20da',
        'xsuPT',
        'VULHD',
        'mavyD',
        '.us',
        'call',
        'child',
        'query',
        'some',
        'white',
        'index',
        'ciLmk',
        '❌\x20Gagal\x20me',
        'quuUn',
        'uto-Join\x20G',
        'GXmvX',
        'SERVER_POR',
        'isRestarti',
        'deleted\x20pl',
        'limit',
        'plJCc',
        'tyIUU',
        'ZoUWE',
        'olak.\x20',
        'rta\x20dapat\x20',
        'agar\x20bisa\x20',
        'resolvePn',
        'FVjkr',
        'convert',
        'ing\x20sessio',
        'module',
        'Mac\x20OS',
        'session\x20~>',
        'handler',
        '\x20\x20│',
        'ah\x20menjadi',
        'Generating',
        'groupAccep',
        'onDelete',
        'kSaOK',
        'API',
        '❌\x20Sepertin',
        '\x20ffmpeg)',
        'magick)',
        'entries',
        '📌\x20Masukkan',
        'at\x20datang\x20',
        '[MAIN]\x20Sav',
        'exitProces',
        '-hide_bann',
        'normalizeJ',
        'iyxGU',
        'Mohon\x20tung',
        'NODE_TLS_R',
        'ffmpegWebp',
        'get',
        'slice'
    ];
    _0x500f = function () {
        return _0x297e24;
    };
    return _0x500f();
}
global[_0x509857(0x102)] = new Object(_0x32e06d(process[_0x509857(0x27f)][_0x509857(0x224)](-0x371 * -0x4 + 0x1a * 0x15f + -0x3168))[_0x509857(0x21c) + 's'](![])[_0x509857(0x1cb)]()), global[_0x509857(0x226)] = new RegExp('^[' + (opts[_0x509857(0x226)] || _0x509857(0x287) + _0x509857(0x245) + _0x509857(0x15b) + _0x509857(0x2c0))[_0x509857(0x140)](/[|\\{}()[\]^$+*?.\-\^]/g, _0x509857(0xe2)) + ']'), global['db'] = new Low(/https?:\/\//[_0x509857(0x22d)](opts['db'] || '') ? new _0x1cd324(opts['db']) : /mongodb(\+srv)?:\/\//i[_0x509857(0x22d)](opts['db']) ? opts[_0x509857(0x2bb)] ? new mongoDBV2(opts['db']) : new mongoDB(opts['db']) : new JSONFile((opts['_'][0x1747 + 0x67f * -0x1 + -0x10c8 * 0x1] ? opts['_'][0x1111 + 0x2 * -0x1112 + 0x1113] + '_' : '') + (_0x509857(0x2cb) + _0x509857(0x234)))), global[_0x509857(0x244)] = global['db'], global[_0x509857(0x16b) + 'se'] = async function loadDatabase() {
    const _0x3ba014 = _0x509857, _0x4d807 = {
            'hSMVX': function (_0x3dc756, _0x550a41) {
                return _0x3dc756(_0x550a41);
            },
            'YBswL': function (_0x26f0f3, _0x131735) {
                return _0x26f0f3(_0x131735);
            },
            'ZyNiX': function (_0x44df5e, _0x4d4e21) {
                return _0x44df5e == _0x4d4e21;
            },
            'aLSvS': function (_0x46ae89, _0x365f0d) {
                return _0x46ae89 !== _0x365f0d;
            }
        };
    if (db[_0x3ba014(0x264)])
        return new Promise(_0x306cfc => setInterval(async function () {
            const _0x2ff64d = _0x3ba014;
            !db[_0x2ff64d(0x264)] && (_0x4d807[_0x2ff64d(0x2a4)](clearInterval, this), _0x4d807[_0x2ff64d(0x10f)](_0x306cfc, _0x4d807[_0x2ff64d(0x134)](db[_0x2ff64d(0x91)], null) ? global[_0x2ff64d(0x16b) + 'se']() : db[_0x2ff64d(0x91)]));
        }, (0x58 * -0x69 + 0x1ffe + -0x1 * -0x41b) * (0x2 * 0xcb3 + -0x24c8 + 0x2 * 0x7a5)));
    if (_0x4d807[_0x3ba014(0x270)](db[_0x3ba014(0x91)], null))
        return;
    db[_0x3ba014(0x264)] = !![], await db[_0x3ba014(0x1cc)]()[_0x3ba014(0x1b5)](console[_0x3ba014(0x1ab)]), db[_0x3ba014(0x264)] = null, db[_0x3ba014(0x91)] = {
        'users': {},
        'chats': {},
        'stats': {},
        'msgs': {},
        'sticker': {},
        'settings': {},
        ...db[_0x3ba014(0x91)] || {}
    }, global['db'][_0x3ba014(0x113)] = _0x4d807[_0x3ba014(0x10f)](chain, db[_0x3ba014(0x91)]);
}, loadDatabase();
const usePairingCode = !process[_0x509857(0x27f)][_0x509857(0x14c)](_0x509857(0x260) + _0x509857(0x2a7)), useMobile = process[_0x509857(0x27f)][_0x509857(0x14c)](_0x509857(0x11a));
var question = function (_0x4c9409) {
    return new Promise(function (_0x3974b8) {
        const _0xc889db = _0xfdad;
        rl[_0xc889db(0x175)](_0x4c9409, _0x3974b8);
    });
};
const rl = _0x335b90[_0x509857(0x2be) + _0x509857(0x22f)]({
        'input': process[_0x509857(0x10d)],
        'output': process[_0x509857(0x1d2)]
    }), {
        version: waVersion,
        isLatest
    } = await fetchLatestBaileysVersion()[_0x509857(0x1b5)](_0x13b872 => {
        const _0xd32912 = _0x509857, _0x3a4eb1 = { 'kUCWn': _0xd32912(0x8d) + _0xd32912(0x1bc) + _0xd32912(0x275) + _0xd32912(0x272) };
        return console[_0xd32912(0x1ab)](_0x3a4eb1[_0xd32912(0x12f)], _0x13b872), {
            'version': undefined,
            'isLatest': ![]
        };
    }), {state, saveCreds} = await useMultiFileAuthState(_0x509857(0x240));
function _0xfdad(_0x21923c, _0x99f7b7) {
    _0x21923c = _0x21923c - (-0xfb * 0x1f + 0x1 * -0x56a + 0x2443);
    const _0x4cf617 = _0x500f();
    let _0x406515 = _0x4cf617[_0x21923c];
    return _0x406515;
}
process['on'](_0x509857(0x161), async _0x50de39 => {
    const _0x35e299 = _0x509857, _0x19494c = {
            'gyFLs': function (_0x35bb7e, _0x333612) {
                return _0x35bb7e === _0x333612;
            },
            'TIclj': _0x35e299(0x9f) + _0x35e299(0xdc),
            'IFLTD': _0x35e299(0x155),
            'DkEgW': _0x35e299(0x21b) + _0x35e299(0x209) + _0x35e299(0x19c) + _0x35e299(0xf3),
            'Odvox': function (_0x1dceff) {
                return _0x1dceff();
            }
        };
    if (_0x19494c[_0x35e299(0x2da)](_0x50de39, _0x19494c[_0x35e299(0x23e)])) {
        const _0x170c3f = _0x19494c[_0x35e299(0x1e2)][_0x35e299(0xd1)]('|');
        let _0x56d25a = -0x2637 + -0x2 * -0x101 + -0x2c9 * -0xd;
        while (!![]) {
            switch (_0x170c3f[_0x56d25a++]) {
            case '0':
                if (global['db'] && global['db'][_0x35e299(0x91)])
                    await global['db'][_0x35e299(0xdf)]()[_0x35e299(0x1b5)](() => {
                    });
                continue;
            case '1':
                await new Promise(_0x559a94 => setTimeout(_0x559a94, 0x1 * 0xf7c + -0x1107 + 0x573));
                continue;
            case '2':
                process[_0x35e299(0x2b8)](0x1 * 0x776 + 0x3 * -0x785 + -0xf19 * -0x1);
                continue;
            case '3':
                console[_0x35e299(0xc9)](_0x3d0367[_0x35e299(0x24a)](_0x19494c[_0x35e299(0x18b)]));
                continue;
            case '4':
                await _0x19494c[_0x35e299(0xa4)](saveCreds);
                continue;
            }
            break;
        }
    }
});
const store = makeInMemoryStore({
        'logger': _0x246174()[_0x509857(0x1f2)]({
            'level': _0x509857(0x2ac),
            'stream': _0x509857(0x182)
        })
    }), connectionOptions = {
        ...waVersion ? { 'version': waVersion } : {},
        'logger': _0x246174({ 'level': _0x509857(0x2ac) }),
        'printQRInTerminal': !usePairingCode,
        'browser': [
            _0x509857(0x20b),
            _0x509857(0x10a),
            _0x509857(0x1bf)
        ],
        'auth': {
            'creds': state[_0x509857(0x8c)],
            'keys': makeCacheableSignalKeyStore(state[_0x509857(0xcc)], _0x246174()[_0x509857(0x1f2)]({
                'level': _0x509857(0x2ac),
                'stream': _0x509857(0x182)
            }))
        },
        'msgRetryCounterCache': msgRetryCounterCache,
        'cachedGroupMetadata': async _0x286ce7 => groupCache[_0x509857(0x223)](await normalizeMainJid(_0x286ce7)),
        'getMessage': async _0x44a886 => {
            const _0x4205fc = _0x509857, _0x50c25b = {
                    'VULHD': function (_0x191116, _0x5b1c3f) {
                        return _0x191116(_0x5b1c3f);
                    }
                }, _0x1b72f7 = await _0x50c25b[_0x4205fc(0x1ee)](normalizeMainJid, _0x44a886[_0x4205fc(0xa2)]), _0x43a82d = await store[_0x4205fc(0xe6) + 'e'](_0x1b72f7, _0x44a886['id']);
            return _0x43a82d?.[_0x4205fc(0x161)] || undefined;
        },
        'generateHighQualityLinkPreview': !![],
        'patchMessageBeforeSending': _0x110635 => {
            const _0x1176e9 = _0x509857, _0x91823a = !!(_0x110635[_0x1176e9(0x16a) + _0x1176e9(0x228)] || _0x110635[_0x1176e9(0x2c5) + _0x1176e9(0x179)] || _0x110635[_0x1176e9(0xbd) + 'e']);
            return _0x91823a && (_0x110635 = {
                'viewOnceMessage': {
                    'message': {
                        'messageContextInfo': {
                            'deviceListMetadataVersion': 0x2,
                            'deviceListMetadata': {}
                        },
                        ..._0x110635
                    }
                }
            }), _0x110635;
        },
        'connectTimeoutMs': 0xea60,
        'defaultQueryTimeoutMs': 0x0,
        'syncFullHistory': !![],
        'markOnlineOnConnect': !![]
    };
global[_0x509857(0x267)] = makeWASocket(connectionOptions), conn[_0x509857(0x26f)] = ![], store[_0x509857(0xfd)](conn['ev']), global[_0x509857(0x21e) + 'id'] = normalizeMainJid, global[_0x509857(0x206)] = resolvePhoneNumber, conn['ev']['on'](_0x509857(0x2b9) + _0x509857(0x192), async ({messages: _0x2b2cc8}) => {
    const _0x845a54 = _0x509857, _0x35fed3 = {
            'CtEZz': function (_0x1100ff, _0x2e8dc0) {
                return _0x1100ff(_0x2e8dc0);
            },
            'ZuIkS': _0x845a54(0x1be) + _0x845a54(0x111)
        }, _0x383ab5 = _0x2b2cc8[-0x3 * 0x308 + 0x1500 + -0xbe8];
    if (!_0x383ab5)
        return;
    if ([
            _0x383ab5[_0x845a54(0x293)][_0x845a54(0xa2)],
            _0x383ab5[_0x845a54(0x293)][_0x845a54(0x273) + 't']
        ][_0x845a54(0x1f4)](_0x17df38 => _0x17df38?.[_0x845a54(0x24d)](_0x845a54(0x156)))) {
        const _0x458fac = _0x383ab5[_0x845a54(0x293)][_0x845a54(0x273) + 't'] || _0x383ab5[_0x845a54(0x293)][_0x845a54(0xa2)], _0x531914 = await _0x35fed3[_0x845a54(0x19e)](normalizeMainJid, _0x458fac);
        console[_0x845a54(0xc9)](_0x3d0367[_0x845a54(0x26d)][_0x845a54(0x1f5)](_0x35fed3[_0x845a54(0x2c7)]), _0x458fac, '->', _0x531914);
    }
});
const originalQuery = conn[_0x509857(0x1f3)][_0x509857(0xfd)](conn);
conn[_0x509857(0x1f3)] = async _0x5761b5 => {
    const _0x2cb310 = _0x509857, _0x4b602e = {
            'cKCEb': function (_0x2679fc, _0x5aa022) {
                return _0x2679fc === _0x5aa022;
            },
            'osPrd': function (_0x55953f, _0x3fa4b0) {
                return _0x55953f === _0x3fa4b0;
            },
            'iyxGU': _0x2cb310(0xb2),
            'lWtWz': _0x2cb310(0x1ad) + _0x2cb310(0xb5),
            'VVPvW': _0x2cb310(0x2e6) + _0x2cb310(0x22a) + _0x2cb310(0x19d),
            'BOOjR': _0x2cb310(0x1dc) + _0x2cb310(0x186) + _0x2cb310(0x19d),
            'lMaWK': _0x2cb310(0x2a2) + _0x2cb310(0x2e3) + _0x2cb310(0x19d),
            'HCtRN': _0x2cb310(0xab) + _0x2cb310(0x29a) + _0x2cb310(0x19d),
            'qKNmK': _0x2cb310(0x2d5) + _0x2cb310(0x1a5) + _0x2cb310(0x7a) + _0x2cb310(0xc4) + _0x2cb310(0xb0) + _0x2cb310(0xf2) + _0x2cb310(0x225) + _0x2cb310(0x1c0) + _0x2cb310(0x203),
            'Dyawb': function (_0x1d9d01, _0x3aa107) {
                return _0x1d9d01(_0x3aa107);
            }
        };
    if (_0x5761b5 && _0x4b602e[_0x2cb310(0x116)](_0x5761b5[_0x2cb310(0x1dd)], 'iq') && _0x5761b5[_0x2cb310(0x298)] && _0x4b602e[_0x2cb310(0x1d5)](_0x5761b5[_0x2cb310(0x298)][_0x2cb310(0x2e5)], _0x4b602e[_0x2cb310(0x21f)])) {
        let _0x568f77 = JSON[_0x2cb310(0x227)](_0x5761b5);
        if (_0x568f77[_0x2cb310(0x14c)](_0x4b602e[_0x2cb310(0xe0)])) {
            const _0x52aeab = [
                _0x4b602e[_0x2cb310(0x2de)],
                _0x4b602e[_0x2cb310(0x2a8)],
                _0x4b602e[_0x2cb310(0xb6)],
                _0x4b602e[_0x2cb310(0x11d)]
            ];
            let _0x3c81a1 = _0x52aeab[_0x2cb310(0x1f4)](_0x4a92a8 => _0x568f77[_0x2cb310(0x14c)](_0x4a92a8));
            if (!_0x3c81a1)
                return console[_0x2cb310(0xc9)](_0x3d0367[_0x2cb310(0x26d)][_0x2cb310(0x1f5)](_0x4b602e[_0x2cb310(0x112)])), { 'status': 0xc8 };
        }
    }
    return _0x4b602e[_0x2cb310(0x83)](originalQuery, _0x5761b5);
};
if (usePairingCode && !conn[_0x509857(0x119)][_0x509857(0x8c)][_0x509857(0x22c)]) {
    if (useMobile)
        throw new Error(_0x509857(0x12e) + _0x509857(0x29b) + _0x509857(0x141) + _0x509857(0x184));
    let phoneNumber = (argv['_'][-0x14ef * -0x1 + -0x468 + -0x1087] || '')[_0x509857(0x1a1)]()[_0x509857(0x140)](/[^0-9]/g, '');
    while (!phoneNumber) {
        phoneNumber = (await question(_0x3d0367[_0x509857(0xc6)](_0x509857(0x128) + _0x509857(0x79) + _0x509857(0x16d) + _0x509857(0x2c4) + _0x509857(0x1d4) + _0x509857(0x2d7) + _0x509857(0x2c1) + _0x509857(0x17e) + '\x0a')))[_0x509857(0x1a1)]()[_0x509857(0x140)](/[^0-9]/g, '');
    }
    rl[_0x509857(0xac)](), console[_0x509857(0xc9)](_0x3d0367[_0x509857(0x1aa)](_0x509857(0x106) + _0x509857(0x282) + phoneNumber)), console[_0x509857(0xc9)](_0x3d0367[_0x509857(0x1a2)](_0x3d0367[_0x509857(0x1c7)](_0x509857(0x210) + _0x509857(0x2e0) + _0x509857(0x158)))), setTimeout(async () => {
        const _0x5ed6a7 = _0x509857, _0x37633f = {
                'aGNbs': _0x5ed6a7(0x1e0),
                'BLFdz': function (_0x40ffb8, _0x7ff466) {
                    return _0x40ffb8 + _0x7ff466;
                },
                'heOcJ': _0x5ed6a7(0x219) + _0x5ed6a7(0x29b) + _0x5ed6a7(0x197) + _0x5ed6a7(0x150) + _0x5ed6a7(0x247),
                'wnQMP': _0x5ed6a7(0x8e) + _0x5ed6a7(0x24c) + _0x5ed6a7(0x2ce)
            };
        try {
            const _0xf4219e = await conn[_0x5ed6a7(0x229) + _0x5ed6a7(0x239)](phoneNumber, _0x37633f[_0x5ed6a7(0x238)]), _0x340392 = _0xf4219e?.[_0x5ed6a7(0x23a)](/.{1,4}/g)?.[_0x5ed6a7(0xf0)]('-') || _0xf4219e, _0x4b458b = '─'[_0x5ed6a7(0x23b)](_0x37633f[_0x5ed6a7(0xcf)](_0x340392[_0x5ed6a7(0xc8)], -0xfc3 + -0x3 * -0x879 + -0x9a4));
            console[_0x5ed6a7(0xc9)](_0x3d0367[_0x5ed6a7(0x1aa)]('\x0a┌' + _0x4b458b + '┐')), console[_0x5ed6a7(0xc9)](_0x3d0367[_0x5ed6a7(0x1aa)](_0x5ed6a7(0x151) + _0x3d0367[_0x5ed6a7(0x24a)][_0x5ed6a7(0x24b)](_0x340392) + _0x5ed6a7(0x20e))), console[_0x5ed6a7(0xc9)](_0x3d0367[_0x5ed6a7(0x1aa)]('└' + _0x4b458b + '┘')), console[_0x5ed6a7(0xc9)](_0x3d0367[_0x5ed6a7(0x123)](_0x5ed6a7(0x17b) + _0x5ed6a7(0x148) + _0x3d0367[_0x5ed6a7(0x24b)](_0x37633f[_0x5ed6a7(0x238)]))), console[_0x5ed6a7(0xc9)](_0x3d0367[_0x5ed6a7(0x176)](_0x37633f[_0x5ed6a7(0x2bf)]));
        } catch (_0xcd16be) {
            console[_0x5ed6a7(0x1ab)](_0x3d0367[_0x5ed6a7(0x157)](_0x37633f[_0x5ed6a7(0x23d)]), _0xcd16be), process[_0x5ed6a7(0x2b8)](0x1 * -0x14e7 + -0x1bd8 + 0x10 * 0x30c);
        }
    }, -0x2083 + -0x25ac + -0x1 * -0x4dff);
}
async function resetLimit() {
    const _0x245514 = _0x509857, _0xa5fcba = {
            'rLfYz': function (_0x31afda, _0x303681) {
                return _0x31afda !== _0x303681;
            },
            'qgCBF': _0x245514(0x243),
            'xPvnj': _0x245514(0x1bb),
            'ottiv': function (_0x4d5420, _0x42dacc) {
                return _0x4d5420 < _0x42dacc;
            },
            'VBKDy': _0x245514(0xbc) + _0x245514(0x1c1) + _0x245514(0x1d3),
            'yEvEA': _0x245514(0x1e4) + _0x245514(0x147)
        };
    try {
        if (!global['db']?.[_0x245514(0x91)]?.[_0x245514(0x117)])
            return;
        const _0x5e494c = -0x63a * 0x1 + 0x1534 + -0xeeb;
        for (const [, _0xe679da] of Object[_0x245514(0x218)](global['db'][_0x245514(0x91)][_0x245514(0x117)])) {
            if (!_0xe679da || _0xa5fcba[_0x245514(0x1c9)](typeof _0xe679da, _0xa5fcba[_0x245514(0x11b)]))
                continue;
            (_0xa5fcba[_0x245514(0x1c9)](typeof _0xe679da[_0x245514(0x1ff)], _0xa5fcba[_0x245514(0x232)]) || _0xa5fcba[_0x245514(0x137)](_0xe679da[_0x245514(0x1ff)], _0x5e494c)) && (_0xe679da[_0x245514(0x1ff)] = _0x5e494c);
        }
        console[_0x245514(0xc9)](_0x3d0367[_0x245514(0x1aa)](_0xa5fcba[_0x245514(0x242)]));
    } catch (_0x2c3d47) {
        console[_0x245514(0x1ab)](_0xa5fcba[_0x245514(0x19b)], _0x2c3d47);
    }
}
setTimeout(() => {
    const _0x3bc119 = _0x509857, _0x57b509 = {
            'BVBOZ': function (_0x4c1d14) {
                return _0x4c1d14();
            },
            'pVIeh': function (_0x4bc447, _0x45926b, _0x59abb7) {
                return _0x4bc447(_0x45926b, _0x59abb7);
            },
            'HVxKd': function (_0x35fb18, _0x329cbb) {
                return _0x35fb18 * _0x329cbb;
            }
        };
    _0x57b509[_0x3bc119(0x1b0)](resetLimit), _0x57b509[_0x3bc119(0x284)](setInterval, resetLimit, _0x57b509[_0x3bc119(0xa5)](0x1bb + 0xb8d + 0xb * -0x135, 0x354fb * -0xb + 0x47c2c9d + 0xced62c));
}, -0x11 * -0x36b + -0x5c9 + -0xd42);
!opts[_0x509857(0x22d)] && ((await import(_0x509857(0x133) + 's'))[_0x509857(0xca)](PORT), setInterval(async () => {
    const _0x27de6f = _0x509857, _0x29e04e = {
            'XaeaN': function (_0x5e7eb6) {
                return _0x5e7eb6();
            }
        };
    if (global['db'][_0x27de6f(0x91)])
        await global['db'][_0x27de6f(0xdf)]()[_0x27de6f(0x1b5)](console[_0x27de6f(0x1ab)]);
    _0x29e04e[_0x27de6f(0x2d2)](clearTmp);
}, (-0x100f + -0x2187 * -0x1 + -0x4 * 0x44f) * (-0x2be * -0x1 + -0x9 * -0x1d3 + -0xb * 0x163)));
function clearTmp() {
    const _0x5d25f1 = _0x509857, _0x59ace1 = {
            'EmgdI': function (_0x4f5e16, _0x57aacf) {
                return _0x4f5e16(_0x57aacf);
            },
            'moWbn': function (_0x5a9462, _0x1b4758) {
                return _0x5a9462(_0x1b4758);
            },
            'ZagRG': function (_0xe9f071, _0x4e2dfb) {
                return _0xe9f071 >= _0x4e2dfb;
            },
            'veCXQ': function (_0x3b66dc, _0x54a226) {
                return _0x3b66dc - _0x54a226;
            },
            'utDDu': function (_0x1ad691, _0x4283b0) {
                return _0x1ad691 * _0x4283b0;
            },
            'EQyxu': function (_0x42e5aa, _0x572ef4) {
                return _0x42e5aa * _0x572ef4;
            },
            'aPPIE': function (_0xc09cb, _0x27209f) {
                return _0xc09cb(_0x27209f);
            },
            'WIscm': function (_0x1797f7) {
                return _0x1797f7();
            },
            'SdnsH': function (_0x1ebc67, _0x422a1e, _0x5dcc6a) {
                return _0x1ebc67(_0x422a1e, _0x5dcc6a);
            },
            'Dwtee': _0x5d25f1(0xb4)
        }, _0x3f8741 = [
            _0x59ace1[_0x5d25f1(0x1c8)](tmpdir),
            _0x59ace1[_0x5d25f1(0xd0)](join, __dirname, _0x59ace1[_0x5d25f1(0x268)])
        ], _0x359fa1 = [];
    return _0x3f8741[_0x5d25f1(0xa6)](_0x21e04b => {
        const _0x22fc0d = _0x5d25f1;
        if (_0x59ace1[_0x22fc0d(0x16e)](existsSync, _0x21e04b))
            _0x59ace1[_0x22fc0d(0x166)](readdirSync, _0x21e04b)[_0x22fc0d(0xa6)](_0x2b793f => _0x359fa1[_0x22fc0d(0x252)](join(_0x21e04b, _0x2b793f)));
    }), _0x359fa1[_0x5d25f1(0xe1)](_0x2856e2 => {
        const _0x29f31f = _0x5d25f1;
        try {
            const _0x1128b2 = _0x59ace1[_0x29f31f(0x166)](statSync, _0x2856e2);
            if (_0x1128b2[_0x29f31f(0x2cf)]() && _0x59ace1[_0x29f31f(0xa9)](_0x59ace1[_0x29f31f(0x11e)](Date[_0x29f31f(0xbb)](), _0x1128b2[_0x29f31f(0x12d)]), _0x59ace1[_0x29f31f(0x107)](_0x59ace1[_0x29f31f(0x19f)](-0x134e + -0x21d7 * 0x1 + 0x390d, -0x2246 + -0xe35 + 0x3 * 0x103d), 0x1cf0 + 0xb52 + 0x1 * -0x283f)))
                return _0x59ace1[_0x29f31f(0x124)](unlinkSync, _0x2856e2);
        } catch (_0x3b4e9e) {
        }
        return ![];
    });
}
async function clearSessions(_0x2bb679 = _0x509857(0x240)) {
    const _0x3edde9 = _0x509857, _0xf8e99 = {
            'jbpbX': function (_0x957f34, _0xb626f4) {
                return _0x957f34(_0xb626f4);
            },
            'SAVUH': function (_0x44f47c, _0xd3aed3) {
                return _0x44f47c !== _0xd3aed3;
            },
            'eBnLI': _0x3edde9(0xa1),
            'isGRr': _0x3edde9(0x1d9) + _0x3edde9(0x15e),
            'VFcXv': function (_0x3b7639, _0x46aa15) {
                return _0x3b7639(_0x46aa15);
            },
            'HRUiS': function (_0x24970d, _0x458c8f, _0x59ccf0) {
                return _0x24970d(_0x458c8f, _0x59ccf0);
            },
            'YTofG': function (_0x299313, _0x5ab2ab) {
                return _0x299313 * _0x5ab2ab;
            }
        };
    try {
        const _0x385956 = await _0xf8e99[_0x3edde9(0xef)](readdirSync, _0x2bb679), _0x277ba3 = await Promise[_0x3edde9(0x183)](_0x385956[_0x3edde9(0xe1)](async _0x29acd3 => {
                const _0x2de2f4 = _0x3edde9;
                try {
                    const _0x298fe2 = _0x3abfb1[_0x2de2f4(0xf0)](_0x2bb679, _0x29acd3), _0x5739d2 = await _0xf8e99[_0x2de2f4(0x92)](statSync, _0x298fe2);
                    if (_0x5739d2[_0x2de2f4(0x2cf)]() && _0xf8e99[_0x2de2f4(0x236)](_0x29acd3, _0xf8e99[_0x2de2f4(0xd5)]))
                        return await _0xf8e99[_0x2de2f4(0x92)](unlinkSync, _0x298fe2), console[_0x2de2f4(0xc9)](_0xf8e99[_0x2de2f4(0x168)][_0x2de2f4(0x1a7)], _0x298fe2[_0x2de2f4(0x26e)]), _0x298fe2;
                } catch (_0x203365) {
                    console[_0x2de2f4(0x1ab)](_0x2de2f4(0xf9) + _0x2de2f4(0x274) + _0x29acd3 + ':\x20' + _0x203365[_0x2de2f4(0x161)]);
                }
            }));
        return _0x277ba3[_0x3edde9(0x163)](_0x4973b6 => _0x4973b6 !== null);
    } catch (_0x5cd722) {
        return console[_0x3edde9(0x1ab)](_0x3edde9(0x24f) + _0x3edde9(0x178) + _0x3edde9(0x115) + _0x5cd722[_0x3edde9(0x161)]), [];
    } finally {
        _0xf8e99[_0x3edde9(0xbf)](setTimeout, () => clearSessions(_0x2bb679), _0xf8e99[_0x3edde9(0xff)](-0x1479 + -0x5 * 0x78e + 0x3a40, -0x20c7a8 + -0x391c38 + -0x2 * -0x486930));
    }
}
async function connectionUpdate(_0x406c3d) {
    const _0x126e68 = _0x509857, _0xe16543 = {
            'ygtWW': function (_0x185c63, _0xd7306b) {
                return _0x185c63(_0xd7306b);
            },
            'mWMdP': _0x126e68(0x14a),
            'FVjkr': function (_0x4e34f1, _0xf5545c) {
                return _0x4e34f1(_0xf5545c);
            },
            'pWZYe': function (_0x1e4e61, _0x1fd590) {
                return _0x1e4e61 === _0x1fd590;
            },
            'NvOpk': _0x126e68(0x1b9),
            'UPGOV': function (_0x2aa2a5, _0x474115) {
                return _0x2aa2a5(_0x474115);
            },
            'kSaOK': _0x126e68(0x2b0) + _0x126e68(0x171) + _0x126e68(0x28d) + ':',
            'KLNlF': function (_0x5d10c9, _0x3c6735) {
                return _0x5d10c9(_0x3c6735);
            },
            'pEqyx': _0x126e68(0x2e6) + _0x126e68(0x22a) + _0x126e68(0x19d),
            'zjyzl': _0x126e68(0x1dc) + _0x126e68(0x186) + _0x126e68(0x19d),
            'XpQER': _0x126e68(0x2a2) + _0x126e68(0x2e3) + _0x126e68(0x19d),
            'IkEEa': _0x126e68(0xab) + _0x126e68(0x29a) + _0x126e68(0x19d),
            'BUxpY': function (_0x2b81a1, _0x14f28c) {
                return _0x2b81a1(_0x14f28c);
            },
            'EjyrY': function (_0x3000ab, _0x42e787, _0x1b9a5d) {
                return _0x3000ab(_0x42e787, _0x1b9a5d);
            },
            'qTeJC': function (_0x1d618d, _0x377be8) {
                return _0x1d618d * _0x377be8;
            },
            'MqmHh': _0x126e68(0x101),
            'HNmmy': _0x126e68(0x159) + _0x126e68(0x81) + _0x126e68(0x220) + _0x126e68(0x2cc) + _0x126e68(0x2b4),
            'BVkBA': _0x126e68(0x1b1),
            'SkTIv': _0x126e68(0xc1) + 'ng',
            'EhsXD': _0x126e68(0xa7) + _0x126e68(0x231),
            'ShPNz': _0x126e68(0x15c) + _0x126e68(0x253) + _0x126e68(0x18f),
            'QKzSM': _0x126e68(0xdd) + _0x126e68(0x122) + _0x126e68(0x1f0),
            'JtYZI': _0x126e68(0x269) + _0x126e68(0x1fa) + 'C!',
            'MajhY': _0x126e68(0x2b5) + _0x126e68(0x2e2) + ':',
            'APQbq': _0x126e68(0x1ea) + _0x126e68(0x2d4) + _0x126e68(0x28f) + _0x126e68(0x86),
            'pdbBE': _0x126e68(0x215) + _0x126e68(0x103) + _0x126e68(0x94),
            'mNPhC': _0x126e68(0x2d3) + _0x126e68(0x80),
            'tcVzs': _0x126e68(0x25a) + _0x126e68(0x162) + _0x126e68(0x138) + _0x126e68(0x2e9) + _0x126e68(0x118),
            'mwdjJ': function (_0x9bec8a, _0x20b871) {
                return _0x9bec8a(_0x20b871);
            },
            'GXmvX': _0x126e68(0x2a6) + _0x126e68(0x191) + _0x126e68(0x18d),
            'qgWVx': _0x126e68(0x15f) + _0x126e68(0x127) + _0x126e68(0x199) + _0x126e68(0x2ba) + _0x126e68(0x288) + 's',
            'Dvyoe': _0x126e68(0x1f8) + _0x126e68(0x2b3) + _0x126e68(0x76),
            'JoyoR': function (_0x371207, _0x19533d, _0x108922) {
                return _0x371207(_0x19533d, _0x108922);
            },
            'sBOPt': function (_0x538d84, _0x26bde5) {
                return _0x538d84 === _0x26bde5;
            },
            'XMNgP': _0x126e68(0x7f) + 'if',
            'IvQhF': _0x126e68(0x143) + 'i',
            'KkmNq': _0x126e68(0x2ab) + _0x126e68(0x98),
            'ciLmk': _0x126e68(0xac),
            'Sfmpi': _0x126e68(0x187) + _0x126e68(0x291) + _0x126e68(0xd6) + _0x126e68(0x2d0) + _0x126e68(0xfc),
            'aFLPz': function (_0x5bd069, _0x3566b5) {
                return _0x5bd069 !== _0x3566b5;
            },
            'wcnTt': function (_0x2b0ff6, _0x158a29) {
                return _0x2b0ff6 !== _0x158a29;
            },
            'xGxtO': _0x126e68(0x1a3) + _0x126e68(0x230) + _0x126e68(0xba) + _0x126e68(0x1e5),
            'ORZlW': function (_0x4b4ead, _0x4b3fc6) {
                return _0x4b4ead == _0x4b3fc6;
            }
        }, {
            connection: _0x9a23e9,
            lastDisconnect: _0xbd05d7,
            isOnline: _0x273cca,
            receivedPendingNotifications: _0x3627d0
        } = _0x406c3d;
    _0xe16543[_0x126e68(0x13e)](_0x9a23e9, _0xe16543[_0x126e68(0x276)]) && console[_0x126e68(0xc9)](_0x3d0367[_0x126e68(0x248)](_0xe16543[_0x126e68(0xda)]));
    if (_0xe16543[_0x126e68(0x13e)](_0x9a23e9, _0xe16543[_0x126e68(0x250)])) {
        console[_0x126e68(0xc9)](_0x3d0367[_0x126e68(0x1aa)](_0xe16543[_0x126e68(0xd4)])), conn['ev']['on'](_0xe16543[_0x126e68(0x132)], async ([_0x2ed33b]) => {
            const _0x4f9aa2 = _0x126e68;
            if (_0x2ed33b && _0x2ed33b['id']) {
                const _0x582619 = await _0xe16543[_0x4f9aa2(0x84)](normalizeMainJid, _0x2ed33b['id']);
                if (_0x582619[_0x4f9aa2(0x24d)](_0xe16543[_0x4f9aa2(0x15a)]))
                    await _0xe16543[_0x4f9aa2(0x84)](setGroupCache, _0x582619);
            }
        }), conn['ev']['on'](_0xe16543[_0x126e68(0xe3)], async _0x2cff50 => {
            const _0x3f3711 = _0x126e68;
            if (_0x2cff50 && _0x2cff50['id']) {
                const _0x213040 = await _0xe16543[_0x3f3711(0x207)](normalizeMainJid, _0x2cff50['id']);
                if (_0xe16543[_0x3f3711(0x13e)](_0x2cff50[_0x3f3711(0x85)], _0xe16543[_0x3f3711(0xe8)]) && _0x2cff50[_0x3f3711(0x273) + 'ts'][_0x3f3711(0x14c)](conn[_0x3f3711(0x2d9)]['id']))
                    await _0xe16543[_0x3f3711(0x1c6)](setGroupCache, _0x213040), console[_0x3f3711(0xc9)](_0xe16543[_0x3f3711(0x213)], _0x213040);
                else
                    _0x213040[_0x3f3711(0x24d)](_0xe16543[_0x3f3711(0x15a)]) && await _0xe16543[_0x3f3711(0x164)](setGroupCache, _0x213040);
            }
        });
        try {
            const _0x180245 = _0xe16543[_0x126e68(0x16c)];
            await conn[_0x126e68(0x211) + _0x126e68(0x193)](_0x180245)[_0x126e68(0x1b5)](() => {
            }), console[_0x126e68(0xc9)](_0x3d0367[_0x126e68(0x1aa)](_0xe16543[_0x126e68(0xf4)]));
        } catch (_0x15991f) {
            console[_0x126e68(0xc9)](_0x3d0367[_0x126e68(0x157)](_0xe16543[_0x126e68(0xb7)], _0x15991f));
        }
        try {
            const _0x515798 = [
                _0xe16543[_0x126e68(0x2e1)],
                _0xe16543[_0x126e68(0x2b2)],
                _0xe16543[_0x126e68(0x1b7)],
                _0xe16543[_0x126e68(0xa8)]
            ];
            for (let _0x479d1e of _0x515798) {
                await conn[_0x126e68(0xb2) + _0x126e68(0x235)](_0x479d1e)[_0x126e68(0x1b5)](() => {
                }), await new Promise(_0x219d4a => setTimeout(_0x219d4a, -0x1ebf * 0x1 + -0x1a1e * -0x1 + -0x1 * -0x1829));
            }
            console[_0x126e68(0xc9)](_0x3d0367[_0x126e68(0x1aa)](_0xe16543[_0x126e68(0x146)]));
        } catch (_0x5d4709) {
            console[_0x126e68(0xc9)](_0x3d0367[_0x126e68(0x157)](_0xe16543[_0x126e68(0x1b4)], _0x5d4709));
        }
        try {
            const {restoreJadibot: _0x659160} = await import(_0xe16543[_0x126e68(0x266)])[_0x126e68(0x1b5)](() => ({ 'restoreJadibot': null }));
            _0x659160 ? (console[_0x126e68(0xc9)](_0x3d0367[_0x126e68(0x24a)](_0xe16543[_0x126e68(0x82)])), await _0xe16543[_0x126e68(0x152)](_0x659160, conn), console[_0x126e68(0xc9)](_0x3d0367[_0x126e68(0x1aa)](_0xe16543[_0x126e68(0x1fb)]))) : console[_0x126e68(0xc9)](_0x3d0367[_0x126e68(0x157)](_0xe16543[_0x126e68(0x181)]));
        } catch (_0x2e0a42) {
            console[_0x126e68(0xc9)](_0x3d0367[_0x126e68(0x157)](_0xe16543[_0x126e68(0x259)], _0x2e0a42));
        }
        _0xe16543[_0x126e68(0xd7)](setTimeout, () => {
            const _0x3bbd71 = _0x126e68;
            _0xe16543[_0x3bbd71(0x95)](setInterval, async () => {
                const _0x23fb19 = _0x3bbd71;
                try {
                    let _0x1d547d = Object[_0x23fb19(0xcc)](global['db'][_0x23fb19(0x91)]?.[_0x23fb19(0x129)] || {})[_0x23fb19(0x1de)](Object[_0x23fb19(0xcc)](conn[_0x23fb19(0x129)] || {})), _0x58a42d = [...new Set(_0x1d547d)][_0x23fb19(0x163)](_0x393a24 => _0x393a24?.[_0x23fb19(0x24d)](_0x23fb19(0xe5) + 'r'));
                    const _0x1f76f0 = [
                        _0xe16543[_0x23fb19(0x2e1)],
                        _0xe16543[_0x23fb19(0x2b2)],
                        _0xe16543[_0x23fb19(0x1b7)],
                        _0xe16543[_0x23fb19(0xa8)]
                    ];
                    for (let _0x4e0431 of _0x58a42d) {
                        const _0x299418 = await _0xe16543[_0x23fb19(0x1c3)](normalizeMainJid, _0x4e0431);
                        if (!_0x1f76f0[_0x23fb19(0x14c)](_0x299418)) {
                            await conn[_0x23fb19(0xb2) + _0x23fb19(0xb9)](_0x299418)[_0x23fb19(0x1b5)](() => {
                            });
                            if (global['db'][_0x23fb19(0x91)]?.[_0x23fb19(0x129)] && global['db'][_0x23fb19(0x91)][_0x23fb19(0x129)][_0x4e0431])
                                delete global['db'][_0x23fb19(0x91)][_0x23fb19(0x129)][_0x4e0431];
                            if (conn[_0x23fb19(0x129)] && conn[_0x23fb19(0x129)][_0x4e0431])
                                delete conn[_0x23fb19(0x129)][_0x4e0431];
                        }
                    }
                } catch (_0x3f0319) {
                }
            }, _0xe16543[_0x3bbd71(0x120)](0x157af + -0x8755 + 0x1a06, 0x1597 * 0x1 + -0x1536 + -0x5c));
        }, 0x2ed9 * -0x1 + -0x2bf3 + 0x9564);
    }
    if (_0xe16543[_0x126e68(0xb8)](_0x273cca, !![]))
        console[_0x126e68(0xc9)](_0x3d0367[_0x126e68(0x1aa)](_0xe16543[_0x126e68(0x295)]));
    else {
        if (_0xe16543[_0x126e68(0xb8)](_0x273cca, ![]))
            console[_0x126e68(0xc9)](_0x3d0367[_0x126e68(0x157)](_0xe16543[_0x126e68(0x257)]));
    }
    if (_0x3627d0)
        console[_0x126e68(0xc9)](_0x3d0367[_0x126e68(0x24a)](_0xe16543[_0x126e68(0x12b)]));
    if (_0xe16543[_0x126e68(0xb8)](_0x9a23e9, _0xe16543[_0x126e68(0x1f7)]))
        console[_0x126e68(0xc9)](_0x3d0367[_0x126e68(0x157)](_0xe16543[_0x126e68(0x296)]));
    if (_0xbd05d7 && _0xbd05d7[_0x126e68(0x1ab)] && _0xbd05d7[_0x126e68(0x1ab)][_0x126e68(0xc7)] && _0xe16543[_0x126e68(0x74)](_0xbd05d7[_0x126e68(0x1ab)][_0x126e68(0xc7)][_0x126e68(0x233)], DisconnectReason[_0x126e68(0x1cd)]) && _0xe16543[_0x126e68(0x90)](conn['ws'][_0x126e68(0xfb)], CONNECTING)) {
        if (global[_0x126e68(0x1fd) + 'ng']) {
            console[_0x126e68(0xc9)](_0xe16543[_0x126e68(0x7c)]);
            return;
        }
        console[_0x126e68(0xc9)](await global[_0x126e68(0x29e) + _0x126e68(0xa3)](!![]));
    }
    _0xe16543[_0x126e68(0x23c)](global['db'][_0x126e68(0x91)], null) && await global[_0x126e68(0x16b) + 'se']();
}
process['on'](_0x509857(0x29c) + _0x509857(0x17d), console[_0x509857(0x1ab)]);
let isInit = !![], handler = await import(_0x509857(0xb3) + 'js');
global[_0x509857(0x29e) + _0x509857(0xa3)] = async function (_0x1c31a0) {
    const _0x2a1df1 = _0x509857, _0x2bd5b7 = {
            'ZoUWE': _0x2a1df1(0x9c) + _0x2a1df1(0x18e),
            'TUtfj': function (_0x15872e, _0x22b5ec) {
                return _0x15872e === _0x22b5ec;
            },
            'TOAiM': _0x2a1df1(0x246),
            'EXScH': _0x2a1df1(0x9c) + _0x2a1df1(0x29d),
            'wrtkQ': function (_0x574788, _0x389763) {
                return _0x574788 || _0x389763;
            },
            'ieKYM': function (_0xed0699, _0x2a0d05, _0x16ddfa) {
                return _0xed0699(_0x2a0d05, _0x16ddfa);
            },
            'oixav': _0x2a1df1(0x1ce) + '0',
            'NTxWX': _0x2a1df1(0x198) + 'te',
            'vAPYU': _0x2a1df1(0x2b9) + _0x2a1df1(0x192),
            'BBVTK': _0x2a1df1(0x25d) + _0x2a1df1(0x25e),
            'uOAui': _0x2a1df1(0xa7) + _0x2a1df1(0x231),
            'DOcZT': _0x2a1df1(0x15c) + _0x2a1df1(0x253) + _0x2a1df1(0x18f),
            'joLdN': _0x2a1df1(0x1da) + _0x2a1df1(0x1c4),
            'lXlZW': _0x2a1df1(0x1e7) + _0x2a1df1(0x1eb) + _0x2a1df1(0x21a) + _0x2a1df1(0x145) + _0x2a1df1(0x2c9),
            'bmIMG': _0x2a1df1(0x142) + _0x2a1df1(0x2bc) + _0x2a1df1(0x19a),
            'CZCtK': _0x2a1df1(0x1b6) + _0x2a1df1(0x1b2) + _0x2a1df1(0xf6),
            'yDPsb': _0x2a1df1(0x1b6) + _0x2a1df1(0xd9) + _0x2a1df1(0x126) + 'n!',
            'sWDqN': _0x2a1df1(0x25c) + _0x2a1df1(0x22b) + _0x2a1df1(0x20f) + _0x2a1df1(0x22e),
            'OVKTO': _0x2a1df1(0x135) + _0x2a1df1(0x109) + _0x2a1df1(0x2e7) + _0x2a1df1(0x277) + 't',
            'quuUn': _0x2a1df1(0x100) + _0x2a1df1(0x22b) + _0x2a1df1(0x1d6),
            'RdqAM': _0x2a1df1(0x2db) + _0x2a1df1(0x109) + _0x2a1df1(0x285) + _0x2a1df1(0x78),
            'BMNzl': _0x2a1df1(0x7d) + _0x2a1df1(0x11c) + _0x2a1df1(0xd3) + _0x2a1df1(0xc5) + _0x2a1df1(0x1ec) + _0x2a1df1(0x2b1) + _0x2a1df1(0xd8),
            'epgoR': _0x2a1df1(0x7d) + _0x2a1df1(0x8f) + _0x2a1df1(0xbe) + _0x2a1df1(0x265) + _0x2a1df1(0x204) + _0x2a1df1(0x172) + _0x2a1df1(0x299),
            'iQfZz': _0x2a1df1(0x1e3) + _0x2a1df1(0x9d) + _0x2a1df1(0x256) + _0x2a1df1(0x2dd),
            'axScm': _0x2a1df1(0x1e3) + _0x2a1df1(0x9d) + _0x2a1df1(0x10b) + _0x2a1df1(0x1a0),
            'PdgRz': _0x2a1df1(0x1f1)
        };
    try {
        const _0x146756 = await import(_0x2a1df1(0xb3) + _0x2a1df1(0x2b7) + Date[_0x2a1df1(0xbb)]())[_0x2a1df1(0x1b5)](console[_0x2a1df1(0x1ab)]);
        if (Object[_0x2a1df1(0xcc)](_0x2bd5b7[_0x2a1df1(0x2d1)](_0x146756, {}))[_0x2a1df1(0xc8)])
            handler = _0x146756;
    } catch (_0x3da8eb) {
        console[_0x2a1df1(0x1ab)](_0x3da8eb);
    }
    if (_0x1c31a0) {
        const _0x40a0c3 = global[_0x2a1df1(0x267)][_0x2a1df1(0x129)];
        try {
            global[_0x2a1df1(0x267)]['ws'][_0x2a1df1(0xac)]();
        } catch {
        }
        conn['ev'][_0x2a1df1(0x1d1) + _0x2a1df1(0x97)](), global[_0x2a1df1(0x267)] = _0x2bd5b7[_0x2a1df1(0xec)](makeWASocket, connectionOptions, { 'chats': _0x40a0c3 }), isInit = !![];
    }
    if (!isInit) {
        const _0x500da8 = _0x2bd5b7[_0x2a1df1(0x2a5)][_0x2a1df1(0xd1)]('|');
        let _0x11e893 = -0x867 + -0x1a5d * 0x1 + -0x59 * -0x64;
        while (!![]) {
            switch (_0x500da8[_0x11e893++]) {
            case '0':
                conn['ev'][_0x2a1df1(0x89)](_0x2bd5b7[_0x2a1df1(0x1ba)], conn[_0x2a1df1(0x280) + 'e']);
                continue;
            case '1':
                conn['ev'][_0x2a1df1(0x89)](_0x2bd5b7[_0x2a1df1(0x24e)], conn[_0x2a1df1(0x20d)]);
                continue;
            case '2':
                conn['ev'][_0x2a1df1(0x89)](_0x2bd5b7[_0x2a1df1(0xcb)], conn[_0x2a1df1(0x212)]);
                continue;
            case '3':
                conn['ev'][_0x2a1df1(0x89)](_0x2bd5b7[_0x2a1df1(0x13c)], conn[_0x2a1df1(0x1df) + 'te']);
                continue;
            case '4':
                conn['ev'][_0x2a1df1(0x89)](_0x2bd5b7[_0x2a1df1(0x77)], conn[_0x2a1df1(0x273) + _0x2a1df1(0x1a9)]);
                continue;
            case '5':
                conn['ev'][_0x2a1df1(0x89)](_0x2bd5b7[_0x2a1df1(0x12c)], conn[_0x2a1df1(0x1da) + _0x2a1df1(0x2a9)]);
                continue;
            }
            break;
        }
    }
    return conn[_0x2a1df1(0x190)] = _0x2bd5b7[_0x2a1df1(0x290)], conn[_0x2a1df1(0xe4)] = _0x2bd5b7[_0x2a1df1(0x8a)], conn[_0x2a1df1(0xaf)] = _0x2bd5b7[_0x2a1df1(0x2e4)], conn[_0x2a1df1(0x1bd)] = _0x2bd5b7[_0x2a1df1(0x1a8)], conn[_0x2a1df1(0xe7)] = _0x2bd5b7[_0x2a1df1(0x9a)], conn[_0x2a1df1(0x2d6)] = _0x2bd5b7[_0x2a1df1(0x99)], conn[_0x2a1df1(0x289)] = _0x2bd5b7[_0x2a1df1(0x1f9)], conn[_0x2a1df1(0x2c2)] = _0x2bd5b7[_0x2a1df1(0x26c)], conn[_0x2a1df1(0x194) + 'n'] = _0x2bd5b7[_0x2a1df1(0x9b)], conn[_0x2a1df1(0x194) + 'ff'] = _0x2bd5b7[_0x2a1df1(0xae)], conn[_0x2a1df1(0x2bd) + 'n'] = _0x2bd5b7[_0x2a1df1(0x28b)], conn[_0x2a1df1(0x2bd) + 'ff'] = _0x2bd5b7[_0x2a1df1(0x2cd)], conn[_0x2a1df1(0x20d)] = handler[_0x2a1df1(0x20d)][_0x2a1df1(0xfd)](global[_0x2a1df1(0x267)]), conn[_0x2a1df1(0x273) + _0x2a1df1(0x1a9)] = handler[_0x2a1df1(0x273) + _0x2a1df1(0x1a9)][_0x2a1df1(0xfd)](global[_0x2a1df1(0x267)]), conn[_0x2a1df1(0x1df) + 'te'] = handler[_0x2a1df1(0x1df) + 'te'][_0x2a1df1(0xfd)](global[_0x2a1df1(0x267)]), conn[_0x2a1df1(0x212)] = handler[_0x2a1df1(0x169) + 'te'][_0x2a1df1(0xfd)](global[_0x2a1df1(0x267)]), conn[_0x2a1df1(0x1da) + _0x2a1df1(0x2a9)] = connectionUpdate[_0x2a1df1(0xfd)](global[_0x2a1df1(0x267)]), conn[_0x2a1df1(0x280) + 'e'] = saveCreds[_0x2a1df1(0xfd)](global[_0x2a1df1(0x267)]), conn['ev']['on'](_0x2bd5b7[_0x2a1df1(0x174)], async _0x405981 => {
        const _0xafef5f = _0x2a1df1;
        console[_0xafef5f(0xc9)](_0x2bd5b7[_0xafef5f(0x202)], _0x405981), _0x2bd5b7[_0xafef5f(0xe9)](_0x405981[_0xafef5f(0xed)], _0x2bd5b7[_0xafef5f(0x2a0)]) && (await conn[_0xafef5f(0x286)](_0x405981['id']), console[_0xafef5f(0xc9)](_0x2bd5b7[_0xafef5f(0xad)]));
    }), conn['ev']['on'](_0x2bd5b7[_0x2a1df1(0x24e)], conn[_0x2a1df1(0x20d)]), conn['ev']['on'](_0x2bd5b7[_0x2a1df1(0x77)], conn[_0x2a1df1(0x273) + _0x2a1df1(0x1a9)]), conn['ev']['on'](_0x2bd5b7[_0x2a1df1(0x13c)], conn[_0x2a1df1(0x1df) + 'te']), conn['ev']['on'](_0x2bd5b7[_0x2a1df1(0xcb)], conn[_0x2a1df1(0x212)]), conn['ev']['on'](_0x2bd5b7[_0x2a1df1(0x12c)], conn[_0x2a1df1(0x1da) + _0x2a1df1(0x2a9)]), conn['ev']['on'](_0x2bd5b7[_0x2a1df1(0x1ba)], conn[_0x2a1df1(0x280) + 'e']), isInit = ![], !![];
};
const pluginFolder = global[_0x509857(0x7b)](join(__dirname, _0x509857(0x297) + _0x509857(0x1f6))), pluginFilter = _0xaca4dc => /\.js$/[_0x509857(0x22d)](_0xaca4dc);
global[_0x509857(0xce)] = {};
async function filesInit() {
    const _0x453d1e = _0x509857, _0x5239ee = {
            'DFCFR': function (_0x3beb67, _0xfabe8e) {
                return _0x3beb67(_0xfabe8e);
            },
            'zgUhh': function (_0x5b5f55, _0x4fa07c, _0x1d42a6) {
                return _0x5b5f55(_0x4fa07c, _0x1d42a6);
            }
        };
    for (let _0x81e784 of _0x5239ee[_0x453d1e(0x279)](readdirSync, pluginFolder)[_0x453d1e(0x163)](pluginFilter)) {
        try {
            let _0x5cce87 = global[_0x453d1e(0x196)](_0x5239ee[_0x453d1e(0xf5)](join, pluginFolder, _0x81e784));
            const _0x2bfce0 = await import(_0x5cce87);
            global[_0x453d1e(0xce)][_0x81e784] = _0x2bfce0[_0x453d1e(0xca)] || _0x2bfce0;
        } catch (_0xf13981) {
            conn[_0x453d1e(0x131)][_0x453d1e(0x1ab)](_0xf13981), delete global[_0x453d1e(0xce)][_0x81e784];
        }
    }
}
filesInit()[_0x509857(0x29f)](_0xed11a3 => console[_0x509857(0xc9)](Object[_0x509857(0xcc)](global[_0x509857(0xce)])))[_0x509857(0x1b5)](console[_0x509857(0x1ab)]), global[_0x509857(0x1c5)] = async (_0x37899e, _0x275908) => {
    const _0x372356 = _0x509857, _0x579a2a = {
            'mavyD': function (_0x21fb86, _0x3fb658) {
                return _0x21fb86(_0x3fb658);
            },
            'CULEd': function (_0x1738f6, _0x454829, _0x5336d0) {
                return _0x1738f6(_0x454829, _0x5336d0);
            },
            'plJCc': function (_0x4a3a9c, _0x5b8e48) {
                return _0x4a3a9c in _0x5b8e48;
            },
            'NLlQM': function (_0x3e724b, _0x2163f7) {
                return _0x3e724b(_0x2163f7);
            },
            'OerMc': function (_0x2e8869, _0x1a67cb, _0x36c37e, _0x4cfa92) {
                return _0x2e8869(_0x1a67cb, _0x36c37e, _0x4cfa92);
            },
            'DgbZe': _0x372356(0x20a)
        };
    if (_0x579a2a[_0x372356(0x1ef)](pluginFilter, _0x275908)) {
        let _0x409c39 = global[_0x372356(0x196)](_0x579a2a[_0x372356(0x154)](join, pluginFolder, _0x275908), !![]);
        if (_0x579a2a[_0x372356(0x200)](_0x275908, global[_0x372356(0xce)])) {
            if (_0x579a2a[_0x372356(0x2b6)](existsSync, _0x409c39))
                conn[_0x372356(0x131)][_0x372356(0x26e)](_0x372356(0x10c) + _0x372356(0x110) + '\x27' + _0x275908 + '\x27');
            else
                return conn[_0x372356(0x131)][_0x372356(0x1ca)](_0x372356(0x1fe) + _0x372356(0x17f) + _0x275908 + '\x27'), delete global[_0x372356(0xce)][_0x275908];
        } else
            conn[_0x372356(0x131)][_0x372356(0x26e)](_0x372356(0x144) + _0x372356(0x1d8) + '\x20\x27' + _0x275908 + '\x27');
        let _0x52b79e = _0x579a2a[_0x372356(0x173)](_0x197fe4, _0x579a2a[_0x372356(0x1ef)](readFileSync, _0x409c39), _0x275908, {
            'sourceType': _0x579a2a[_0x372356(0xf8)],
            'allowAwaitOutsideFunction': !![]
        });
        if (_0x52b79e)
            conn[_0x372356(0x131)][_0x372356(0x1ab)](_0x372356(0x283) + _0x372356(0x23f) + _0x372356(0xd2) + _0x275908 + '\x27\x0a' + _0x579a2a[_0x372356(0x2b6)](format, _0x52b79e));
        else
            try {
                const _0x135d6d = await import(global[_0x372356(0x196)](_0x409c39) + _0x372356(0x136) + Date[_0x372356(0xbb)]());
                global[_0x372356(0xce)][_0x275908] = _0x135d6d[_0x372356(0xca)] || _0x135d6d;
            } catch (_0x5ba30c) {
                conn[_0x372356(0x131)][_0x372356(0x1ab)](_0x372356(0x130) + _0x372356(0x11f) + '\x20\x27' + _0x275908 + '\x0a' + _0x579a2a[_0x372356(0x1ef)](format, _0x5ba30c) + '\x27');
            } finally {
                global[_0x372356(0xce)] = Object[_0x372356(0x153) + 's'](Object[_0x372356(0x218)](global[_0x372356(0xce)])[_0x372356(0x17c)](([_0x4bc7dc], [_0x529926]) => _0x4bc7dc[_0x372356(0x1b8) + _0x372356(0x27a)](_0x529926)));
            }
    }
}, Object[_0x509857(0x2aa)](global[_0x509857(0x1c5)]), watch(pluginFolder, global[_0x509857(0x1c5)]), await global[_0x509857(0x29e) + _0x509857(0xa3)]();
async function _quickTest() {
    const _0x419e88 = _0x509857, _0xce7862 = {
            'BHnbo': _0x419e88(0xac),
            'wCoJu': _0x419e88(0x1ab),
            'GMCuU': function (_0x1fbdce, _0x5ac337) {
                return _0x1fbdce(_0x5ac337);
            },
            'OkmZL': function (_0x2276e6, _0x50b025) {
                return _0x2276e6 !== _0x50b025;
            },
            'zZjFl': _0x419e88(0x177),
            'vyWmQ': _0x419e88(0x27c),
            'urPbP': function (_0x5c557a, _0x131877, _0x69a634) {
                return _0x5c557a(_0x131877, _0x69a634);
            },
            'FDagx': _0x419e88(0x21d) + 'er',
            'QGtwD': _0x419e88(0x13b),
            'vpwVK': _0x419e88(0x189) + _0x419e88(0x75),
            'IKebS': _0x419e88(0x278),
            'knjCn': _0x419e88(0x12a),
            'nwudH': _0x419e88(0x93),
            'Nibfu': _0x419e88(0x208),
            'rcpYR': _0x419e88(0x2a1),
            'joefd': function (_0x543833, _0xf37854) {
                return _0x543833(_0xf37854);
            },
            'OElBG': _0x419e88(0x125),
            'qsbPz': _0x419e88(0x27b),
            'Kuxlr': _0x419e88(0x160) + _0x419e88(0x2c3) + _0x419e88(0xc2) + _0x419e88(0x9e) + _0x419e88(0x281) + _0x419e88(0x27d) + _0x419e88(0x1af) + _0x419e88(0x1e8) + _0x419e88(0x27e) + _0x419e88(0x216),
            'xsuPT': _0x419e88(0x271) + _0x419e88(0x2c6) + _0x419e88(0x10e) + _0x419e88(0x1ac) + _0x419e88(0x104) + _0x419e88(0x13f) + _0x419e88(0x2dc) + _0x419e88(0x13a) + _0x419e88(0x2ae) + _0x419e88(0x255) + _0x419e88(0x139) + _0x419e88(0x217)
        };
    let _0x391761 = await Promise[_0x419e88(0x183)]([
            _0xce7862[_0x419e88(0x262)](spawn, _0xce7862[_0x419e88(0x17a)]),
            _0xce7862[_0x419e88(0x262)](spawn, _0xce7862[_0x419e88(0x170)]),
            _0xce7862[_0x419e88(0xea)](spawn, _0xce7862[_0x419e88(0x17a)], [
                _0xce7862[_0x419e88(0x26b)],
                _0xce7862[_0x419e88(0x149)],
                _0xce7862[_0x419e88(0x185)],
                _0xce7862[_0x419e88(0x188)],
                _0xce7862[_0x419e88(0x1b3)],
                _0xce7862[_0x419e88(0x121)],
                '1',
                '-f',
                _0xce7862[_0x419e88(0x96)],
                '-'
            ]),
            _0xce7862[_0x419e88(0x262)](spawn, _0xce7862[_0x419e88(0x28c)]),
            _0xce7862[_0x419e88(0x262)](spawn, _0xce7862[_0x419e88(0xfe)]),
            _0xce7862[_0x419e88(0x114)](spawn, 'gm'),
            _0xce7862[_0x419e88(0xea)](spawn, _0xce7862[_0x419e88(0x2d8)], [_0xce7862[_0x419e88(0x1cf)]])
        ][_0x419e88(0xe1)](_0x5239e6 => {
            const _0xe54b4c = _0x419e88, _0x37bba5 = {
                    'tyIUU': function (_0x206bb8, _0x46433b) {
                        const _0xfb1958 = _0xfdad;
                        return _0xce7862[_0xfb1958(0x262)](_0x206bb8, _0x46433b);
                    },
                    'NJkEK': function (_0x3a14c6, _0x5a5a35) {
                        const _0x3e89b3 = _0xfdad;
                        return _0xce7862[_0x3e89b3(0x16f)](_0x3a14c6, _0x5a5a35);
                    }
                };
            return Promise[_0xe54b4c(0x2ad)]([
                new Promise(_0x3a6319 => {
                    const _0x3d362d = _0xe54b4c;
                    _0x5239e6['on'](_0xce7862[_0x3d362d(0x237)], _0x419bcd => {
                        const _0x4c6fcf = _0x3d362d;
                        _0x37bba5[_0x4c6fcf(0x201)](_0x3a6319, _0x37bba5[_0x4c6fcf(0x249)](_0x419bcd, 0x3d * -0x26 + 0x1 * 0x21ad + -0x608 * 0x4));
                    });
                }),
                new Promise(_0x1efd22 => {
                    const _0x4f36ca = _0xe54b4c;
                    _0x5239e6['on'](_0xce7862[_0x4f36ca(0x185)], _0x590202 => _0x1efd22(![]));
                })
            ]);
        })), [_0x4b4c0b, _0xfcb9a7, _0x1b0add, _0x14195a, _0x210a06, _0x363cdf, _0x42b257] = _0x391761, _0x4af6db = global[_0x419e88(0x14b)] = {
            'ffmpeg': _0x4b4c0b,
            'ffprobe': _0xfcb9a7,
            'ffmpegWebp': _0x1b0add,
            'convert': _0x14195a,
            'magick': _0x210a06,
            'gm': _0x363cdf,
            'find': _0x42b257
        };
    Object[_0x419e88(0x2aa)](global[_0x419e88(0x14b)]), !_0x4af6db[_0x419e88(0x177)] && conn[_0x419e88(0x131)][_0x419e88(0x1ca)](_0x419e88(0x108) + _0x419e88(0x2ca) + _0x419e88(0x254) + _0x419e88(0x13d) + _0x419e88(0x205) + _0x419e88(0x251) + _0x419e88(0x167)), _0x4af6db[_0x419e88(0x177)] && !_0x4af6db[_0x419e88(0x222)] && conn[_0x419e88(0x131)][_0x419e88(0x1ca)](_0xce7862[_0x419e88(0x1e9)]), !_0x4af6db[_0x419e88(0x208)] && !_0x4af6db[_0x419e88(0x2a1)] && !_0x4af6db['gm'] && conn[_0x419e88(0x131)][_0x419e88(0x1ca)](_0xce7862[_0x419e88(0x1ed)]);
}
_quickTest()[_0x509857(0x29f)](() => conn[_0x509857(0x131)][_0x509857(0x26e)](_0x509857(0x26a) + _0x509857(0x2e8) + _0x509857(0x2a3) + _0x509857(0x20c) + _0x509857(0x292) + 'n'))[_0x509857(0x1b5)](console[_0x509857(0x1ab)]);