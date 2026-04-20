const _0x4cc0d7 = _0x6c0f;
(function (_0x22864d, _0x144df9) {
    const _0x312eff = _0x6c0f, _0x410fda = _0x22864d();
    while (!![]) {
        try {
            const _0x265396 = -parseInt(_0x312eff(0x135)) / (0x4 * 0x95f + 0x90c * 0x4 + -0x49ab) + -parseInt(_0x312eff(0x2fd)) / (-0x2a9 + 0x32 * -0x49 + 0x26b * 0x7) + parseInt(_0x312eff(0x1b0)) / (-0x1f81 + 0x203 + 0x1d81) + parseInt(_0x312eff(0x2e4)) / (-0x8ab + 0x181 + 0x72e) * (-parseInt(_0x312eff(0x10f)) / (0x256e + 0x1769 * 0x1 + -0x1 * 0x3cd2)) + -parseInt(_0x312eff(0x2e0)) / (-0x15a3 + 0xc76 + -0x933 * -0x1) * (-parseInt(_0x312eff(0x197)) / (-0x677 + 0x8a * -0x5 + -0x1 * -0x930)) + -parseInt(_0x312eff(0x283)) / (0x21 * -0xf7 + 0x1075 + 0x2 * 0x7b5) * (-parseInt(_0x312eff(0x1b3)) / (0x80b + 0x1 * -0x619 + -0x1e9)) + parseInt(_0x312eff(0x201)) / (0x175d + -0x787 + 0x3 * -0x544) * (parseInt(_0x312eff(0x2f0)) / (-0x205f * 0x1 + 0x1353 + 0x45d * 0x3));
            if (_0x265396 === _0x144df9)
                break;
            else
                _0x410fda['push'](_0x410fda['shift']());
        } catch (_0x238561) {
            _0x410fda['push'](_0x410fda['shift']());
        }
    }
}(_0x5a54, 0x16a0a3 + -0x2 * -0x33271 + -0x1101d3), process[_0x4cc0d7(0x23b)][_0x4cc0d7(0x21a) + _0x4cc0d7(0x20a) + _0x4cc0d7(0x106)] = '1');
import './config.js';
import _0x302de9, { join } from 'path';
import { platform } from 'process';
import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import { createRequire } from 'module';
global[_0x4cc0d7(0x17c)] = function filename(_0x48a6e1 = import.meta.url, _0xfc9e08 = platform !== _0x4cc0d7(0x287)) {
    const _0x3defb8 = _0x4cc0d7, _0x4be6a9 = {
            'bOjJg': function (_0x3322de, _0x37bac3) {
                return _0x3322de(_0x37bac3);
            },
            'QLYYh': function (_0x5b8cd0, _0x37b91d) {
                return _0x5b8cd0(_0x37b91d);
            }
        };
    return _0xfc9e08 ? /file:\/\/\//[_0x3defb8(0x2af)](_0x48a6e1) ? _0x4be6a9[_0x3defb8(0x29a)](fileURLToPath, _0x48a6e1) : _0x48a6e1 : _0x4be6a9[_0x3defb8(0x24e)](pathToFileURL, _0x48a6e1)[_0x3defb8(0xea)]();
}, global[_0x4cc0d7(0x298)] = function dirname(_0x45fbd5) {
    const _0x234673 = _0x4cc0d7;
    return _0x302de9[_0x234673(0x2ff)](global[_0x234673(0x17c)](_0x45fbd5, !![]));
}, global[_0x4cc0d7(0x1ca)] = function require(_0x26fac9 = import.meta.url) {
    const _0x4adcca = _0x4cc0d7, _0x2a411a = {
            'JSHKc': function (_0x27c2ba, _0x27f8b6) {
                return _0x27c2ba(_0x27f8b6);
            }
        };
    return _0x2a411a[_0x4adcca(0x305)](createRequire, _0x26fac9);
};
import {
    readdirSync,
    statSync,
    unlinkSync,
    existsSync,
    readFileSync,
    watch
} from 'fs';
import _0x3f8cd1 from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
const argv = _0x3f8cd1(hideBin(process[_0x4cc0d7(0x2b9)]))[_0x4cc0d7(0x2b9)];
import { spawn } from 'child_process';
import _0x148e2b from 'lodash';
import _0xc18767 from 'syntax-error';
import _0x23b56c from 'chalk';
import { tmpdir } from 'os';
import _0x53e228 from 'readline';
import { format } from 'util';
import _0x7a28ec from 'pino';
import _0x3ac9b0 from 'ws';
const {useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, makeCacheableSignalKeyStore} = await import(_0x4cc0d7(0x103) + _0x4cc0d7(0x109) + 'ys');
import {
    Low,
    JSONFile
} from 'lowdb';
import {
    makeWASocket,
    protoType,
    serialize
} from './lib/simple.js';
import _0x1f650d from './lib/cloudDBAdapter.js';
import {
    mongoDB,
    mongoDBV2
} from './lib/mongoDB.js';
const {CONNECTING} = _0x3ac9b0, {chain} = _0x148e2b, PORT = process[_0x4cc0d7(0x23b)][_0x4cc0d7(0x264)] || process[_0x4cc0d7(0x23b)][_0x4cc0d7(0x218) + 'T'] || 0xc96 + -0x1ca2 + 0x4 * 0x6f1;
protoType(), serialize(), global[_0x4cc0d7(0x1ec)] = (_0x1d6ed0, _0x2a01c6 = '/', _0x472041 = {}, _0x4796e4) => (_0x1d6ed0 in global[_0x4cc0d7(0x262)] ? global[_0x4cc0d7(0x262)][_0x1d6ed0] : _0x1d6ed0) + _0x2a01c6 + (_0x472041 || _0x4796e4 ? '?' + new URLSearchParams(Object[_0x4cc0d7(0x194)]({
    ..._0x472041,
    ..._0x4796e4 ? { [_0x4796e4]: global[_0x4cc0d7(0x13b)][_0x1d6ed0 in global[_0x4cc0d7(0x262)] ? global[_0x4cc0d7(0x262)][_0x1d6ed0] : _0x1d6ed0] } : {}
})) : ''), global[_0x4cc0d7(0x2a7)] = { 'start': new Date() };
const __dirname = global[_0x4cc0d7(0x298)](import.meta.url);
global[_0x4cc0d7(0x13a)] = new Object(_0x3f8cd1(process[_0x4cc0d7(0x2b9)][_0x4cc0d7(0x2ab)](0x20ad + -0x8 * 0x1a5 + 0x1 * -0x1383))[_0x4cc0d7(0x314) + 's'](![])[_0x4cc0d7(0x16e)]()), global[_0x4cc0d7(0xe4)] = new RegExp('^[' + (opts[_0x4cc0d7(0xe4)] || _0x4cc0d7(0x1c6) + _0x4cc0d7(0x10e) + _0x4cc0d7(0x26c) + _0x4cc0d7(0x1d6))[_0x4cc0d7(0x117)](/[|\\{}()[\]^$+*?.\-\^]/g, _0x4cc0d7(0x213)) + ']'), global['db'] = new Low(/https?:\/\//[_0x4cc0d7(0x2af)](opts['db'] || '') ? new _0x1f650d(opts['db']) : /mongodb(\+srv)?:\/\//i[_0x4cc0d7(0x2af)](opts['db']) ? opts[_0x4cc0d7(0x27a)] ? new mongoDBV2(opts['db']) : new mongoDB(opts['db']) : new JSONFile((opts['_'][0x463 * 0x5 + -0x1def + 0x800] ? opts['_'][-0x1bd5 + -0x1f * 0x13d + 0x211c * 0x2] + '_' : '') + (_0x4cc0d7(0x1f6) + _0x4cc0d7(0x13e)))), global[_0x4cc0d7(0x255)] = global['db'], global[_0x4cc0d7(0x2c2) + 'se'] = async function loadDatabase() {
    const _0x340a3b = _0x4cc0d7, _0x54b2e9 = {
            'iciZd': function (_0x2caf58, _0x560233) {
                return _0x2caf58(_0x560233);
            },
            'GoHLb': function (_0x2c0f10, _0x21784b) {
                return _0x2c0f10 == _0x21784b;
            },
            'isqBK': function (_0x480c36, _0x58905f) {
                return _0x480c36 !== _0x58905f;
            },
            'CAxkX': function (_0x17bfd5, _0x13177b) {
                return _0x17bfd5(_0x13177b);
            }
        };
    if (db[_0x340a3b(0xe0)])
        return new Promise(_0x53827c => setInterval(async function () {
            const _0x21956b = _0x340a3b;
            !db[_0x21956b(0xe0)] && (_0x54b2e9[_0x21956b(0x286)](clearInterval, this), _0x54b2e9[_0x21956b(0x286)](_0x53827c, _0x54b2e9[_0x21956b(0x277)](db[_0x21956b(0x2d9)], null) ? global[_0x21956b(0x2c2) + 'se']() : db[_0x21956b(0x2d9)]));
        }, (0x1d33 + 0x196 * 0x8 + -0x29e2) * (-0x1 * 0x10fd + -0xb * -0x134 + 0x7a9 * 0x1)));
    if (_0x54b2e9[_0x340a3b(0x29c)](db[_0x340a3b(0x2d9)], null))
        return;
    db[_0x340a3b(0xe0)] = !![], await db[_0x340a3b(0x1ba)]()[_0x340a3b(0x186)](console[_0x340a3b(0x275)]), db[_0x340a3b(0xe0)] = null, db[_0x340a3b(0x2d9)] = {
        'users': {},
        'chats': {},
        'stats': {},
        'msgs': {},
        'sticker': {},
        'settings': {},
        ...db[_0x340a3b(0x2d9)] || {}
    }, global['db'][_0x340a3b(0x2fe)] = _0x54b2e9[_0x340a3b(0x295)](chain, db[_0x340a3b(0x2d9)]);
}, loadDatabase();
const usePairingCode = !process[_0x4cc0d7(0x2b9)][_0x4cc0d7(0x29e)](_0x4cc0d7(0x2a1) + _0x4cc0d7(0x29d)), useMobile = process[_0x4cc0d7(0x2b9)][_0x4cc0d7(0x29e)](_0x4cc0d7(0x10b));
var question = function (_0xd3dfe1) {
    return new Promise(function (_0x285a4a) {
        const _0x394c9f = _0x6c0f;
        rl[_0x394c9f(0x160)](_0xd3dfe1, _0x285a4a);
    });
};
const rl = _0x53e228[_0x4cc0d7(0x19a) + _0x4cc0d7(0x19c)]({
        'input': process[_0x4cc0d7(0xf1)],
        'output': process[_0x4cc0d7(0x18e)]
    }), {version, isLatest} = await fetchLatestBaileysVersion(), {state, saveCreds} = await useMultiFileAuthState(_0x4cc0d7(0x27e)), store = makeInMemoryStore({
        'logger': _0x7a28ec()[_0x4cc0d7(0x16a)]({
            'level': _0x4cc0d7(0x1f2),
            'stream': _0x4cc0d7(0x1d9)
        })
    }), connectionOptions = {
        'version': version,
        'logger': _0x7a28ec({ 'level': _0x4cc0d7(0x1f2) }),
        'printQRInTerminal': !usePairingCode,
        'browser': [
            _0x4cc0d7(0x2a5),
            _0x4cc0d7(0x212),
            _0x4cc0d7(0x167)
        ],
        'auth': {
            'creds': state[_0x4cc0d7(0x1f7)],
            'keys': makeCacheableSignalKeyStore(state[_0x4cc0d7(0x157)], _0x7a28ec()[_0x4cc0d7(0x16a)]({
                'level': _0x4cc0d7(0x1f2),
                'stream': _0x4cc0d7(0x1d9)
            }))
        },
        'getMessage': async _0x327fbd => {
            const _0x434273 = _0x4cc0d7, _0x373d04 = await store[_0x434273(0x200) + 'e'](_0x327fbd[_0x434273(0x24c)], _0x327fbd['id']);
            return _0x373d04?.[_0x434273(0x14b)] || undefined;
        },
        'generateHighQualityLinkPreview': !![],
        'patchMessageBeforeSending': _0x3285ef => {
            const _0x3a56da = _0x4cc0d7, _0x21ae63 = !!(_0x3285ef[_0x3a56da(0x100) + _0x3a56da(0x2c4)] || _0x3285ef[_0x3a56da(0x112) + _0x3a56da(0x13c)] || _0x3285ef[_0x3a56da(0x234) + 'e']);
            return _0x21ae63 && (_0x3285ef = {
                'viewOnceMessage': {
                    'message': {
                        'messageContextInfo': {
                            'deviceListMetadataVersion': 0x2,
                            'deviceListMetadata': {}
                        },
                        ..._0x3285ef
                    }
                }
            }), _0x3285ef;
        },
        'connectTimeoutMs': 0xea60,
        'defaultQueryTimeoutMs': 0x0,
        'syncFullHistory': !![],
        'markOnlineOnConnect': !![]
    };
global[_0x4cc0d7(0x1bc)] = makeWASocket(connectionOptions), conn[_0x4cc0d7(0x26b)] = ![], store[_0x4cc0d7(0x2c0)](conn['ev']);
const originalQuery = conn[_0x4cc0d7(0x284)][_0x4cc0d7(0x2c0)](conn);
conn[_0x4cc0d7(0x284)] = async _0x56fb13 => {
    const _0x1d12b2 = _0x4cc0d7, _0x35c1f1 = {
            'EQoFV': function (_0xf0aa0f, _0x15ee54) {
                return _0xf0aa0f === _0x15ee54;
            },
            'CWdpg': function (_0x4af8bf, _0x1198ad) {
                return _0x4af8bf === _0x1198ad;
            },
            'qtliy': _0x1d12b2(0x257),
            'qITHu': _0x1d12b2(0x2bb) + _0x1d12b2(0x243),
            'wDmsM': _0x1d12b2(0x30f) + _0x1d12b2(0x129) + _0x1d12b2(0x1ff),
            'HGXnp': _0x1d12b2(0x203) + _0x1d12b2(0x18c) + _0x1d12b2(0x1ff),
            'QIAyH': _0x1d12b2(0x14e) + _0x1d12b2(0x27f) + _0x1d12b2(0x1ff),
            'aKZlV': _0x1d12b2(0x273) + _0x1d12b2(0x2d2) + _0x1d12b2(0x1ff),
            'ZIdmA': _0x1d12b2(0x267) + _0x1d12b2(0x300) + _0x1d12b2(0xfa) + _0x1d12b2(0x265) + _0x1d12b2(0x2f3) + _0x1d12b2(0x2c1) + _0x1d12b2(0x14a) + _0x1d12b2(0x2e9) + _0x1d12b2(0x1b4),
            'gUCGD': function (_0x544431, _0x5d5b9e) {
                return _0x544431(_0x5d5b9e);
            }
        };
    if (_0x56fb13 && _0x35c1f1[_0x1d12b2(0xf3)](_0x56fb13[_0x1d12b2(0x301)], 'iq') && _0x56fb13[_0x1d12b2(0x235)] && _0x35c1f1[_0x1d12b2(0x221)](_0x56fb13[_0x1d12b2(0x235)][_0x1d12b2(0x183)], _0x35c1f1[_0x1d12b2(0x108)])) {
        let _0x393f50 = JSON[_0x1d12b2(0x2cf)](_0x56fb13);
        if (_0x393f50[_0x1d12b2(0x29e)](_0x35c1f1[_0x1d12b2(0x12d)])) {
            const _0x47afab = [
                _0x35c1f1[_0x1d12b2(0x311)],
                _0x35c1f1[_0x1d12b2(0xeb)],
                _0x35c1f1[_0x1d12b2(0x256)],
                _0x35c1f1[_0x1d12b2(0x114)]
            ];
            let _0x323a56 = _0x47afab[_0x1d12b2(0x2a8)](_0x4045e9 => _0x393f50[_0x1d12b2(0x29e)](_0x4045e9));
            if (!_0x323a56)
                return console[_0x1d12b2(0x187)](_0x23b56c[_0x1d12b2(0x229)][_0x1d12b2(0x165)](_0x35c1f1[_0x1d12b2(0x141)])), { 'status': 0xc8 };
        }
    }
    return _0x35c1f1[_0x1d12b2(0x2a3)](originalQuery, _0x56fb13);
};
if (usePairingCode && !conn[_0x4cc0d7(0x225)][_0x4cc0d7(0x1f7)][_0x4cc0d7(0x238)]) {
    if (useMobile)
        throw new Error(_0x4cc0d7(0x127) + _0x4cc0d7(0x310) + _0x4cc0d7(0x249) + _0x4cc0d7(0x22f));
    let phoneNumber = (argv['_'][-0x1c87 + -0x1 * 0xaa9 + -0x390 * -0xb] || '')[_0x4cc0d7(0x2dd)]()[_0x4cc0d7(0x117)](/[^0-9]/g, '');
    while (!phoneNumber) {
        phoneNumber = (await question(_0x23b56c[_0x4cc0d7(0x153)](_0x4cc0d7(0x2df) + _0x4cc0d7(0x159) + _0x4cc0d7(0x260) + _0x4cc0d7(0x215) + _0x4cc0d7(0x288) + _0x4cc0d7(0xf6) + _0x4cc0d7(0xec) + _0x4cc0d7(0xf9) + '\x0a')))[_0x4cc0d7(0x2dd)]()[_0x4cc0d7(0x117)](/[^0-9]/g, '');
    }
    rl[_0x4cc0d7(0x2f1)](), console[_0x4cc0d7(0x187)](_0x23b56c[_0x4cc0d7(0x15f)](_0x4cc0d7(0x253) + _0x4cc0d7(0x205) + phoneNumber)), console[_0x4cc0d7(0x187)](_0x23b56c[_0x4cc0d7(0x2f4)](_0x23b56c[_0x4cc0d7(0x228)](_0x4cc0d7(0x2d8) + _0x4cc0d7(0x282) + _0x4cc0d7(0xf2)))), setTimeout(async () => {
        const _0x416c48 = _0x4cc0d7, _0x4cc913 = {
                'aalQH': _0x416c48(0x268),
                'RKzOk': function (_0x91011a, _0x4ae5b4) {
                    return _0x91011a + _0x4ae5b4;
                },
                'lFQDX': _0x416c48(0x125) + _0x416c48(0x310) + _0x416c48(0x20d) + _0x416c48(0x2dc) + _0x416c48(0x1b6),
                'DxeZV': _0x416c48(0x1ce) + _0x416c48(0x21d) + _0x416c48(0x25d)
            };
        try {
            const _0x266bb0 = await conn[_0x416c48(0x224) + _0x416c48(0x1a3)](phoneNumber, _0x4cc913[_0x416c48(0x2a2)]), _0xfce9eb = _0x266bb0?.[_0x416c48(0x293)](/.{1,4}/g)?.[_0x416c48(0x1dd)]('-') || _0x266bb0, _0x16b7b7 = '─'[_0x416c48(0x120)](_0x4cc913[_0x416c48(0x281)](_0xfce9eb[_0x416c48(0x26a)], -0x2570 + 0x1feb + 0x589));
            console[_0x416c48(0x187)](_0x23b56c[_0x416c48(0x15f)]('\x0a┌' + _0x16b7b7 + '┐')), console[_0x416c48(0x187)](_0x23b56c[_0x416c48(0x15f)]('│\x20' + _0x23b56c[_0x416c48(0x1a6)][_0x416c48(0xe7)](_0xfce9eb) + '\x20│')), console[_0x416c48(0x187)](_0x23b56c[_0x416c48(0x15f)]('└' + _0x16b7b7 + '┘')), console[_0x416c48(0x187)](_0x23b56c[_0x416c48(0x2ac)](_0x416c48(0x2c7) + _0x416c48(0x155) + _0x23b56c[_0x416c48(0xe7)](_0x4cc913[_0x416c48(0x2a2)]))), console[_0x416c48(0x187)](_0x23b56c[_0x416c48(0x1bb)](_0x4cc913[_0x416c48(0x12c)]));
        } catch (_0x76422b) {
            console[_0x416c48(0x275)](_0x23b56c[_0x416c48(0x304)](_0x4cc913[_0x416c48(0x2e3)]), _0x76422b), process[_0x416c48(0x237)](-0xf63 + 0x36d * 0xa + 0x3 * -0x64a);
        }
    }, 0x1 * 0x62b + 0xd3 * 0x1d + -0x1642);
}
async function resetLimit() {
    const _0x14ffb1 = _0x4cc0d7, _0x55e153 = {
            'VSfwN': function (_0x4b5006, _0x7f6578) {
                return _0x4b5006 <= _0x7f6578;
            },
            'CeKJn': function (_0x47bfea, _0x41f8ea, _0x13eb10) {
                return _0x47bfea(_0x41f8ea, _0x13eb10);
            },
            'afrNM': function (_0xd5fd38, _0x2c2f1c) {
                return _0xd5fd38 * _0x2c2f1c;
            }
        };
    try {
        let _0x51a39c = Object[_0x14ffb1(0x194)](global['db'][_0x14ffb1(0x2d9)][_0x14ffb1(0x122)]), _0x632a8 = -0x72c + -0x106f + -0xbda * -0x2;
        _0x51a39c[_0x14ffb1(0x1c2)](([_0x4a87a5, _0x42ca9d], _0x103c5b) => {
            const _0x5487d9 = _0x14ffb1;
            _0x55e153[_0x5487d9(0x227)](_0x42ca9d[_0x5487d9(0x17b)], _0x632a8) && (_0x42ca9d[_0x5487d9(0x17b)] = _0x632a8);
        }), console[_0x14ffb1(0x187)](_0x14ffb1(0x245) + _0x14ffb1(0x15e) + _0x14ffb1(0x2d0));
    } finally {
        _0x55e153[_0x14ffb1(0x11f)](setInterval, () => resetLimit(), _0x55e153[_0x14ffb1(0x10d)](-0x1 * -0x119d + -0x2 * -0xaba + -0x2710, -0x8 * 0x138d281 + -0x7e88f9 * -0x8 + 0x8 * 0x15f1508));
    }
}
!opts[_0x4cc0d7(0x2af)] && ((await import(_0x4cc0d7(0x105) + 's'))[_0x4cc0d7(0x119)](PORT), setInterval(async () => {
    const _0x7292b7 = _0x4cc0d7, _0x2af4e3 = {
            'tYNCC': function (_0x594f6d) {
                return _0x594f6d();
            }
        };
    if (global['db'][_0x7292b7(0x2d9)])
        await global['db'][_0x7292b7(0x104)]()[_0x7292b7(0x186)](console[_0x7292b7(0x275)]);
    _0x2af4e3[_0x7292b7(0x2c3)](clearTmp);
}, (0x1a61 + -0x3a * 0x92 + -0x19 * -0x47) * (0x5a + 0x757 * 0x2 + -0xb20)));
function clearTmp() {
    const _0x4e17be = _0x4cc0d7, _0x337aaa = {
            'CFzFv': function (_0x178c13, _0x2c76d3) {
                return _0x178c13(_0x2c76d3);
            },
            'Gruvu': function (_0x467fa5, _0x52d607) {
                return _0x467fa5 >= _0x52d607;
            },
            'NXFYl': function (_0x20269a, _0x383185) {
                return _0x20269a - _0x383185;
            },
            'erbxq': function (_0x47aba1, _0x304981) {
                return _0x47aba1 * _0x304981;
            },
            'ySRMl': function (_0x34eb07) {
                return _0x34eb07();
            },
            'PWdPz': function (_0x48a552, _0x29561e, _0x1dbc7d) {
                return _0x48a552(_0x29561e, _0x1dbc7d);
            },
            'wdmnC': _0x4e17be(0x1e9)
        }, _0x3acbeb = [
            _0x337aaa[_0x4e17be(0x178)](tmpdir),
            _0x337aaa[_0x4e17be(0x130)](join, __dirname, _0x337aaa[_0x4e17be(0x14f)])
        ], _0x35191c = [];
    return _0x3acbeb[_0x4e17be(0x2b2)](_0x14312d => readdirSync(_0x14312d)[_0x4e17be(0x2b2)](_0x399c6e => _0x35191c[_0x4e17be(0x2a4)](join(_0x14312d, _0x399c6e)))), _0x35191c[_0x4e17be(0x1c2)](_0x11a51e => {
        const _0x1fd4a6 = _0x4e17be, _0xc44db9 = _0x337aaa[_0x1fd4a6(0xe6)](statSync, _0x11a51e);
        if (_0xc44db9[_0x1fd4a6(0x204)]() && _0x337aaa[_0x1fd4a6(0x239)](_0x337aaa[_0x1fd4a6(0x15b)](Date[_0x1fd4a6(0x23d)](), _0xc44db9[_0x1fd4a6(0x16d)]), _0x337aaa[_0x1fd4a6(0x274)](_0x337aaa[_0x1fd4a6(0x274)](0x158 * 0x4 + 0x61f + -0x797, -0x23f6 + -0xa4f + 0x2e81), -0x1a6d + -0x662 + 0x20d2)))
            return _0x337aaa[_0x1fd4a6(0xe6)](unlinkSync, _0x11a51e);
        return ![];
    });
}
async function clearSessions(_0x2b3076 = _0x4cc0d7(0x27e)) {
    const _0x3b8bc5 = _0x4cc0d7, _0x208345 = {
            'fLaHj': function (_0x30796c, _0x52665c) {
                return _0x30796c(_0x52665c);
            },
            'ASwZw': function (_0x2cdfb2, _0x7fe734) {
                return _0x2cdfb2 !== _0x7fe734;
            },
            'oyWyV': _0x3b8bc5(0x21f),
            'IsfZs': _0x3b8bc5(0x271) + _0x3b8bc5(0xe8),
            'gDHBK': function (_0x2e8e39, _0x46ddd7) {
                return _0x2e8e39(_0x46ddd7);
            },
            'FkwIQ': function (_0x4527b6, _0x232cc8, _0x138559) {
                return _0x4527b6(_0x232cc8, _0x138559);
            },
            'FZKTD': function (_0x389d50, _0x589e18) {
                return _0x389d50 * _0x589e18;
            }
        };
    try {
        const _0x2fd154 = await _0x208345[_0x3b8bc5(0x180)](readdirSync, _0x2b3076), _0x59f375 = await Promise[_0x3b8bc5(0x2ba)](_0x2fd154[_0x3b8bc5(0x1c2)](async _0x46ce83 => {
                const _0xe5d954 = _0x3b8bc5;
                try {
                    const _0x507a21 = _0x302de9[_0xe5d954(0x1dd)](_0x2b3076, _0x46ce83), _0x379a07 = await _0x208345[_0xe5d954(0x118)](statSync, _0x507a21);
                    if (_0x379a07[_0xe5d954(0x204)]() && _0x208345[_0xe5d954(0x28f)](_0x46ce83, _0x208345[_0xe5d954(0x266)]))
                        return await _0x208345[_0xe5d954(0x118)](unlinkSync, _0x507a21), console[_0xe5d954(0x187)](_0x208345[_0xe5d954(0x1a5)][_0xe5d954(0xf7)], _0x507a21[_0xe5d954(0x2ca)]), _0x507a21;
                } catch (_0xe5fb6c) {
                    console[_0xe5d954(0x275)](_0xe5d954(0x23c) + _0xe5d954(0x208) + _0x46ce83 + ':\x20' + _0xe5fb6c[_0xe5d954(0x14b)]);
                }
            }));
        return _0x59f375[_0x3b8bc5(0x291)](_0x4364bd => _0x4364bd !== null);
    } catch (_0x1c7f6e) {
        return console[_0x3b8bc5(0x275)](_0x3b8bc5(0x1ef) + _0x3b8bc5(0x1e0) + _0x3b8bc5(0x24d) + _0x1c7f6e[_0x3b8bc5(0x14b)]), [];
    } finally {
        _0x208345[_0x3b8bc5(0x22d)](setTimeout, () => clearSessions(_0x2b3076), _0x208345[_0x3b8bc5(0x152)](-0x1ed6 + 0xc7a * 0x1 + 0x61f * 0x3, 0x2c8fd6 * -0x1 + 0x7 * -0xd93bb + 0x5 * 0x26e817));
    }
}
async function connectionUpdate(_0x42d69c) {
    const _0x14f870 = _0x4cc0d7, _0x30b2c0 = {
            'AIpzN': _0x14f870(0x30f) + _0x14f870(0x129) + _0x14f870(0x1ff),
            'hmvxi': _0x14f870(0x203) + _0x14f870(0x18c) + _0x14f870(0x1ff),
            'fpDlC': _0x14f870(0x14e) + _0x14f870(0x27f) + _0x14f870(0x1ff),
            'WVcaQ': _0x14f870(0x273) + _0x14f870(0x2d2) + _0x14f870(0x1ff),
            'OdAAj': function (_0x3ebdde, _0x3baedf, _0x2e5fd2) {
                return _0x3ebdde(_0x3baedf, _0x2e5fd2);
            },
            'PBtwA': function (_0x3e2d1c, _0x198a60) {
                return _0x3e2d1c * _0x198a60;
            },
            'lzYOC': function (_0x4fa1c1, _0x575219) {
                return _0x4fa1c1 === _0x575219;
            },
            'aOcBX': _0x14f870(0x2e8),
            'Stfsr': _0x14f870(0x1cc) + _0x14f870(0x176) + _0x14f870(0x15a) + _0x14f870(0xfc) + _0x14f870(0x2c9),
            'irolw': _0x14f870(0x211),
            'NVhvl': _0x14f870(0x1fa) + 'ng',
            'kBsNe': _0x14f870(0x206) + _0x14f870(0x24f) + _0x14f870(0x2f6),
            'UZASo': _0x14f870(0x139) + _0x14f870(0x150) + 'C!',
            'iuSut': _0x14f870(0x202) + _0x14f870(0x144) + ':',
            'KyKTy': _0x14f870(0x139) + _0x14f870(0x13d) + _0x14f870(0x195) + _0x14f870(0x11e) + _0x14f870(0xff),
            'cAcza': _0x14f870(0x202) + _0x14f870(0x308) + _0x14f870(0x163),
            'oVmRo': _0x14f870(0x28b) + _0x14f870(0x27c) + _0x14f870(0x2d6),
            'vCqKM': _0x14f870(0x1e8) + _0x14f870(0x188) + _0x14f870(0x26e) + _0x14f870(0x11d),
            'UmNIR': _0x14f870(0x116) + _0x14f870(0x107) + _0x14f870(0x124),
            'CwZxZ': _0x14f870(0x151) + _0x14f870(0x23f),
            'DVWJZ': _0x14f870(0x149) + _0x14f870(0x254) + _0x14f870(0x1a4) + _0x14f870(0x251) + _0x14f870(0x1ea),
            'CwIYB': function (_0xf6494a, _0x2ff298) {
                return _0xf6494a(_0x2ff298);
            },
            'DFnFS': _0x14f870(0x128) + _0x14f870(0xe1) + _0x14f870(0x1fd),
            'gJbxI': _0x14f870(0x16b) + _0x14f870(0x252) + _0x14f870(0x25c) + _0x14f870(0x279) + _0x14f870(0x1e3) + 's',
            'HMsSx': _0x14f870(0x292) + _0x14f870(0x2c8) + _0x14f870(0xfb),
            'viErU': function (_0x60ee83, _0x5a425b, _0x1b9f9a) {
                return _0x60ee83(_0x5a425b, _0x1b9f9a);
            },
            'lkXIS': function (_0x57b8f0, _0x470ec6) {
                return _0x57b8f0 === _0x470ec6;
            },
            'dHDsZ': _0x14f870(0x1f0) + 'if',
            'CqSWI': _0x14f870(0xdf) + 'i',
            'rLnDl': _0x14f870(0x247) + _0x14f870(0x19b),
            'Atgdc': function (_0xdbc602, _0x25e28b) {
                return _0xdbc602 === _0x25e28b;
            },
            'uCbvZ': _0x14f870(0x2f1),
            'bMcaZ': _0x14f870(0x1fc) + _0x14f870(0x1ee) + _0x14f870(0xe3) + _0x14f870(0x2f5) + _0x14f870(0x136),
            'RoMkM': function (_0x33c806, _0x380478) {
                return _0x33c806 !== _0x380478;
            },
            'EQtXF': function (_0x1d9faf, _0x119b7e) {
                return _0x1d9faf !== _0x119b7e;
            },
            'ZJNAC': function (_0x420a5d, _0x313ed7) {
                return _0x420a5d == _0x313ed7;
            }
        }, {
            connection: _0x5e657e,
            lastDisconnect: _0xfe36e4,
            isOnline: _0x5c8de6,
            receivedPendingNotifications: _0xc11118
        } = _0x42d69c;
    _0x30b2c0[_0x14f870(0x1aa)](_0x5e657e, _0x30b2c0[_0x14f870(0x1ac)]) && console[_0x14f870(0x187)](_0x23b56c[_0x14f870(0x2e5)](_0x30b2c0[_0x14f870(0x14c)]));
    if (_0x30b2c0[_0x14f870(0x1aa)](_0x5e657e, _0x30b2c0[_0x14f870(0x2ec)])) {
        console[_0x14f870(0x187)](_0x23b56c[_0x14f870(0x15f)](_0x30b2c0[_0x14f870(0x138)]));
        try {
            const _0x34ded1 = _0x30b2c0[_0x14f870(0x30b)];
            await conn[_0x14f870(0x1e4) + _0x14f870(0x2be)](_0x34ded1)[_0x14f870(0x186)](() => {
            }), console[_0x14f870(0x187)](_0x23b56c[_0x14f870(0x15f)](_0x30b2c0[_0x14f870(0x2bf)]));
        } catch (_0x138a18) {
            console[_0x14f870(0x187)](_0x23b56c[_0x14f870(0x304)](_0x30b2c0[_0x14f870(0x2cb)], _0x138a18));
        }
        try {
            const _0xb27728 = [
                _0x30b2c0[_0x14f870(0x1d1)],
                _0x30b2c0[_0x14f870(0x2b4)],
                _0x30b2c0[_0x14f870(0x148)],
                _0x30b2c0[_0x14f870(0x26d)]
            ];
            for (let _0x335239 of _0xb27728) {
                await conn[_0x14f870(0x257) + _0x14f870(0x1c0)](_0x335239)[_0x14f870(0x186)](() => {
                }), await new Promise(_0x44df71 => setTimeout(_0x44df71, 0x119d + 0x204c + -0x1e61));
            }
            console[_0x14f870(0x187)](_0x23b56c[_0x14f870(0x15f)](_0x30b2c0[_0x14f870(0x22c)]));
        } catch (_0x26c434) {
            console[_0x14f870(0x187)](_0x23b56c[_0x14f870(0x304)](_0x30b2c0[_0x14f870(0x2f9)], _0x26c434));
        }
        try {
            let _0x3a499c = _0x30b2c0[_0x14f870(0x226)];
            await conn[_0x14f870(0x14d) + 'e'](_0x3a499c, { 'text': _0x30b2c0[_0x14f870(0x17f)] });
        } catch (_0x3b970e) {
            console[_0x14f870(0x187)](_0x30b2c0[_0x14f870(0x2fb)], _0x3b970e);
        }
        try {
            const {restoreJadibot: _0x1c4927} = await import(_0x30b2c0[_0x14f870(0xf0)])[_0x14f870(0x186)](() => ({ 'restoreJadibot': null }));
            _0x1c4927 ? (console[_0x14f870(0x187)](_0x23b56c[_0x14f870(0x1a6)](_0x30b2c0[_0x14f870(0xf8)])), await _0x30b2c0[_0x14f870(0x170)](_0x1c4927, conn), console[_0x14f870(0x187)](_0x23b56c[_0x14f870(0x15f)](_0x30b2c0[_0x14f870(0x29f)]))) : console[_0x14f870(0x187)](_0x23b56c[_0x14f870(0x304)](_0x30b2c0[_0x14f870(0x162)]));
        } catch (_0x1a6c38) {
            console[_0x14f870(0x187)](_0x23b56c[_0x14f870(0x304)](_0x30b2c0[_0x14f870(0x2d7)], _0x1a6c38));
        }
        _0x30b2c0[_0x14f870(0x2ad)](setTimeout, () => {
            const _0x392f2d = _0x14f870;
            _0x30b2c0[_0x392f2d(0x185)](setInterval, async () => {
                const _0x965194 = _0x392f2d;
                try {
                    let _0x5991ce = Object[_0x965194(0x157)](global['db'][_0x965194(0x2d9)]?.[_0x965194(0x1e5)] || {})[_0x965194(0x1f9)](Object[_0x965194(0x157)](conn[_0x965194(0x1e5)] || {})), _0x336fdc = [...new Set(_0x5991ce)][_0x965194(0x291)](_0x95c24c => _0x95c24c?.[_0x965194(0x193)](_0x965194(0x12f) + 'r'));
                    const _0x2fdcd7 = [
                        _0x30b2c0[_0x965194(0x1d1)],
                        _0x30b2c0[_0x965194(0x2b4)],
                        _0x30b2c0[_0x965194(0x148)],
                        _0x30b2c0[_0x965194(0x26d)]
                    ];
                    for (let _0xad1fdb of _0x336fdc) {
                        if (!_0x2fdcd7[_0x965194(0x29e)](_0xad1fdb)) {
                            await conn[_0x965194(0x257) + _0x965194(0x2f2)](_0xad1fdb)[_0x965194(0x186)](() => {
                            });
                            if (global['db'][_0x965194(0x2d9)]?.[_0x965194(0x1e5)] && global['db'][_0x965194(0x2d9)][_0x965194(0x1e5)][_0xad1fdb])
                                delete global['db'][_0x965194(0x2d9)][_0x965194(0x1e5)][_0xad1fdb];
                            if (conn[_0x965194(0x1e5)] && conn[_0x965194(0x1e5)][_0xad1fdb])
                                delete conn[_0x965194(0x1e5)][_0xad1fdb];
                        }
                    }
                } catch (_0x1836f2) {
                }
            }, _0x30b2c0[_0x392f2d(0x2ae)](-0x4 * -0x248e + 0x1c * -0xf07 + -0x183c * -0x15, -0x2309 + 0x1599 + 0x2b1 * 0x5));
        }, 0x5593 + -0x5df6 + 0x42fb);
    }
    if (_0x30b2c0[_0x14f870(0x143)](_0x5c8de6, !![]))
        console[_0x14f870(0x187)](_0x23b56c[_0x14f870(0x15f)](_0x30b2c0[_0x14f870(0x2fc)]));
    else {
        if (_0x30b2c0[_0x14f870(0x1aa)](_0x5c8de6, ![]))
            console[_0x14f870(0x187)](_0x23b56c[_0x14f870(0x304)](_0x30b2c0[_0x14f870(0x2ed)]));
    }
    if (_0xc11118)
        console[_0x14f870(0x187)](_0x23b56c[_0x14f870(0x1a6)](_0x30b2c0[_0x14f870(0x164)]));
    if (_0x30b2c0[_0x14f870(0x1a1)](_0x5e657e, _0x30b2c0[_0x14f870(0x113)]))
        console[_0x14f870(0x187)](_0x23b56c[_0x14f870(0x304)](_0x30b2c0[_0x14f870(0x1c8)]));
    _0xfe36e4 && _0xfe36e4[_0x14f870(0x275)] && _0xfe36e4[_0x14f870(0x275)][_0x14f870(0x2ee)] && _0x30b2c0[_0x14f870(0xf4)](_0xfe36e4[_0x14f870(0x275)][_0x14f870(0x2ee)][_0x14f870(0x1c3)], DisconnectReason[_0x14f870(0x276)]) && _0x30b2c0[_0x14f870(0x30a)](conn['ws'][_0x14f870(0x126)], CONNECTING) && console[_0x14f870(0x187)](await global[_0x14f870(0x2cd) + _0x14f870(0x28a)](!![])), _0x30b2c0[_0x14f870(0x177)](global['db'][_0x14f870(0x2d9)], null) && await global[_0x14f870(0x2c2) + 'se']();
}
function _0x5a54() {
    const _0x296d80 = [
        './tmp',
        'ots)...',
        'dXKvq',
        'API',
        '\x20ffmpeg)',
        'terputus\x20&',
        'Error\x20in\x20C',
        'Status\x20Akt',
        'sSubject',
        'silent',
        'ffmpeg',
        'message.de',
        '-frames:v',
        'database.j',
        'creds',
        'hIKxG',
        'concat',
        '✅\x20Tersambu',
        'ubject*\x20🎉',
        '⏱️\x20Koneksi\x20',
        'Jadibot!',
        'oading\x20\x27',
        'ewsletter',
        'loadMessag',
        '10MHKpnH',
        '❌\x20Gagal\x20Au',
        '1203634267',
        'isFile',
        'nakan:\x20',
        'KODE_INVIT',
        'rBGcM',
        'essing\x20',
        'plugins',
        'EJECT_UNAU',
        'groups.upd',
        'sRestrictO',
        'ode\x20ini\x20ke',
        'OXZFc',
        'webp\x20di\x20ff',
        '5|0|4|1|2|',
        'open',
        'safari',
        '\x5c$&',
        'SyiHG',
        'd\x20(awali\x20d',
        'bye',
        'ire\x20plugin',
        'SERVER_POR',
        'KRXmI',
        'NODE_TLS_R',
        'pat\x20mengir',
        'hfmhv',
        'nerate\x20pai',
        'rnqFZ',
        'creds.json',
        'Judul\x20grup',
        'CWdpg',
        'hosZm',
        'tall\x20image',
        'requestPai',
        'authState',
        'oVmRo',
        'VSfwN',
        'blue',
        'bgRed',
        'EGMCC',
        'call',
        'KyKTy',
        'FkwIQ',
        'module',
        'obile\x20api',
        '☑️\x20Quick\x20Te',
        'ngkin\x20Tida',
        'groupsUpda',
        'Icon\x20grup\x20',
        'listMessag',
        'attrs',
        './handler.',
        'exit',
        'registered',
        'Gruvu',
        'EHhtg',
        'env',
        'Error\x20proc',
        'now',
        'ih\x20dahulu\x20',
        'bot.js',
        'rang\x20bukan',
        'js?update=',
        'support',
        'low\x22',
        'magick',
        'Success\x20Au',
        'localeComp',
        'Menunggu\x20P',
        '\x20hanya\x20adm',
        'ode\x20with\x20m',
        'agar\x20bisa\x20',
        '\x20telah\x20diu',
        'remoteJid',
        'ons:\x20',
        'QLYYh',
        'E_GC_LU_DI',
        'or\x20while\x20l',
        'bot\x20(Sub-B',
        'dibot\x20tida',
        'Nomor\x20digu',
        'pkan\x20ulang',
        'DATABASE',
        'QIAyH',
        'newsletter',
        'olhRO',
        'are',
        'MhTaQ',
        'jqVbt',
        'k\x20ditemuka',
        'ring\x20code:',
        '-filter_co',
        'h\x20di\x20tutup',
        '\x20yang\x20vali',
        'spromote',
        'APIs',
        'ate',
        'PORT',
        '\x20menembak\x20',
        'oyWyV',
        '\x20🚫\x20[BLOKIR',
        'ERINEPRJ',
        'tsUpdate',
        'length',
        'isInit',
        '∆×÷π√✓©®:;',
        'WVcaQ',
        'sukses\x20ter',
        'admin!',
        'new\x20plugin',
        'Deleted\x20se',
        'jlzDO',
        '1203634045',
        'erbxq',
        'error',
        'loggedOut',
        'GoHLb',
        'Group\x20tela',
        'n\x20di\x20./lib',
        'mongodbv2',
        'rejectCall',
        '396@s.what',
        'uncaughtEx',
        './sessions',
        '58946360@n',
        'ugin\x20\x27',
        'RKzOk',
        '\x20Pairing\x20C',
        '57752hcfkTZ',
        'query',
        '?update=',
        'iciZd',
        'win32',
        'engan\x20kode',
        'xukCu',
        'ler',
        '6288258041',
        'rang\x20jadi\x20',
        '\x20imagemagi',
        '👋\x20Halo\x20@us',
        'ASwZw',
        'sDesc',
        'filter',
        '❌\x20Gagal\x20me',
        'match',
        'sdemote',
        'CAxkX',
        'xLSMO',
        'MCkKV',
        '__dirname',
        'OvCrk',
        'bOjJg',
        'RpwGc',
        'isqBK',
        'ing-code',
        'includes',
        'DFnFS',
        'buYMJ',
        '--use-pair',
        'aalQH',
        'gUCGD',
        'push',
        'Mac\x20OS',
        'zUSZx',
        'timestamp',
        'some',
        'sAnnounceO',
        'Update',
        'slice',
        'cyan',
        'viErU',
        'PBtwA',
        'test',
        'h\x20di\x20buka!',
        'erja\x20Tanpa',
        'forEach',
        'a\x20peserta!',
        'hmvxi',
        'uSGVL',
        '\x20\x0a@desc',
        'ydZZa',
        'nama\x20file\x20',
        'argv',
        'all',
        '\x22tag\x22:\x22fol',
        'creds.upda',
        'diterima:',
        'tInvite',
        'UZASo',
        'bind',
        'kang!\x20Akse',
        'loadDataba',
        'tYNCC',
        'sage',
        're\x20plugin\x20',
        'group-part',
        '\x0aPairing\x20C',
        'mulihkan\x20J',
        'r...',
        'info',
        'iuSut',
        'warn',
        'reloadHand',
        'participan',
        'stringify',
        'imit',
        'tQjko',
        '69528126@n',
        'k\x20Beranima',
        'status',
        'ubrjz',
        'sapp.net',
        'HMsSx',
        'Generating',
        'data',
        'oKBQm',
        'mpeg\x20belum',
        '\x20WhatsApp\x20',
        'trim',
        'fromEntrie',
        'Input\x20nomo',
        '2196kzYMue',
        'off',
        'onDelete',
        'DxeZV',
        '4FFQrBb',
        'redBright',
        'lete',
        'webp',
        'connecting',
        'aluran\x20dit',
        'RIMiA',
        'HNQju',
        'irolw',
        'CqSWI',
        'output',
        'Sampai\x20jum',
        '5006529VVXtMI',
        'close',
        'Unfollow',
        'jalur\x20bela',
        'bgWhite',
        'enyambung\x20',
        'SINI',
        'race',
        'find',
        'cAcza',
        'bah\x20ke\x20\x0a@r',
        'UmNIR',
        'dHDsZ',
        '704740TjRjrt',
        'chain',
        'dirname',
        '\x20TOTAL]\x20Ba',
        'tag',
        'enable-lib',
        'er!\x0a\x0aSelam',
        'red',
        'JSHKc',
        'er\x20Mungkin',
        'BuJnD',
        'to-Follow\x20',
        'semua\x20pese',
        'EQtXF',
        'kBsNe',
        '.update',
        'PJCuk',
        '\x20creds.jso',
        '1203634006',
        '\x20pairing\x20c',
        'wDmsM',
        'Fitur\x20Stik',
        'bBdoC',
        'exitProces',
        'Status\x20Mat',
        'READ',
        'emulihkan\x20',
        'VfPdd',
        '\x20mencoba\x20m',
        'prefix',
        '-hide_bann',
        'CFzFv',
        'bold',
        'ssion:',
        're\x20-\x20requi',
        'toString',
        'HGXnp',
        'ontoh:\x20628',
        'welcome',
        'ideo',
        'pa\x20lagi,\x20@',
        'CwZxZ',
        'stdin',
        'ode...',
        'EQoFV',
        'RoMkM',
        'ah\x20menjadi',
        '\x20negara,\x20c',
        'main',
        'DVWJZ',
        '12xxxxxx):',
        'se\x20mencoba',
        'adibot:',
        'gu\x20sebenta',
        'Silahkan\x20i',
        'credsUpdat',
        '\x20MD!',
        'buttonsMes',
        'AImof',
        'IWbKQ',
        '@wishkeyso',
        'write',
        './server.j',
        'THORIZED',
        'm\x20pesan\x20ke',
        'qtliy',
        'cket/baile',
        'bah\x20menjad',
        '--mobile',
        'BPfsh',
        'afrNM',
        '%+£¢€¥^°=¶',
        '3891245IeOMTy',
        'ception',
        'ibwebp\x20di\x20',
        'templateMe',
        'uCbvZ',
        'aKZlV',
        'cuy\x20di\x20*@s',
        'Gagal\x20kiri',
        'replace',
        'fLaHj',
        'default',
        'vSNpH',
        'session\x20~>',
        'messages.u',
        'aktifasi\x20✅',
        'uran\x20Erine',
        'CeKJn',
        'repeat',
        '\x20terinstal',
        'users',
        'Bbdui',
        '\x20owner:',
        '📌\x20Masukkan',
        'readyState',
        'Cannot\x20use',
        '✅\x20Sukses\x20m',
        '12665352@n',
        'im\x20pesan.',
        'ffmpegWebp',
        'lFQDX',
        'qITHu',
        'l\x20(pkg\x20ins',
        '@newslette',
        'PWdPz',
        'split',
        'error\x20requ',
        'then',
        'zmAgW',
        '1040495dBjPfI',
        'ulang...',
        'DxGjk',
        'NVhvl',
        '✅\x20Sukses\x20A',
        'opts',
        'APIKeys',
        'ssage',
        'uto-Follow',
        'son',
        'XbPpX',
        'vPnoQ',
        'ZIdmA',
        'deleteUpda',
        'lkXIS',
        'to-Join\x20GC',
        'mplex',
        'convert',
        'Panggilan\x20',
        'fpDlC',
        '🔄\x20Menghidu',
        's\x20follow\x20s',
        'message',
        'Stfsr',
        'sendMessag',
        '1203634223',
        'wdmnC',
        'uto-Join\x20G',
        './lib/jadi',
        'FZKTD',
        'blueBright',
        'mengirim\x20v',
        'ode:\x20',
        'WGPkg',
        'keys',
        'Deskripsi\x20',
        'r\x20WhatsApp',
        'Mohon\x20tung',
        'NXFYl',
        'telah\x20diub',
        'aLJIt',
        'to\x20Reset\x20L',
        'green',
        'question',
        'index',
        'gJbxI',
        'saluran:',
        'rLnDl',
        'white',
        'kcVly',
        '5.1.10',
        'YCGJE',
        'gIwFL',
        'child',
        '⚠️\x20Modul\x20Ja',
        'reload',
        'mtimeMs',
        'parse',
        'color',
        'CwIYB',
        'esan.',
        'rta\x20dapat\x20',
        'MjHfQ',
        'MifVp',
        'XiDhR',
        'fkan\x20Bot,\x20',
        'ZJNAC',
        'ySRMl',
        'ouDzn',
        'pdate',
        'limit',
        '__filename',
        'icipants.u',
        'at\x20datang\x20',
        'vCqKM',
        'gDHBK',
        'sort',
        '\x20lagi\x20admi',
        'xmlns',
        'ffprobe',
        'OdAAj',
        'catch',
        'log',
        '\x0aErine\x20MD\x20',
        'ah\x20ke\x20hany',
        './plugins/',
        'DTOBF',
        '57759585@n',
        'mengirim\x20p',
        'stdout',
        'TJoBh',
        'logger',
        'evoke',
        'a\x20admin!',
        'endsWith',
        'entries',
        '\x20semua\x20sal',
        'RzHrV',
        '9317jJXQwW',
        'PsoJW',
        '\x20compiling',
        'createInte',
        'esan\x20Baru',
        'rface',
        'deleted\x20pl',
        'xLzlE',
        'syntax\x20err',
        'Edit\x20Info\x20',
        'Atgdc',
        'dHceq',
        'ringCode',
        '\x20sesi\x20Jadi',
        'IsfZs',
        'yellow',
        'crpXF',
        'ZLwRO',
        'magick)',
        'lzYOC',
        '-loglevel',
        'aOcBX',
        'nstall\x20ffm',
        'si\x20tanpa\x20l',
        'Vyiyi',
        '2431902LfJpeW',
        'peg\x20terleb',
        'handler',
        '1503apThMN',
        'olak.\x20',
        'ffmpeg\x20(--',
        'segera!',
        'Link\x20group',
        'sIcon',
        'removeAllL',
        'read',
        'magenta',
        'conn',
        'ringing',
        'sRevoke',
        'connection',
        'Follow',
        'freeze',
        'map',
        'statusCode',
        'i\x20\x0a@subjec',
        'ah!',
        '‎xzXZ/i!#$',
        'st\x20Done\x20,\x20',
        'bMcaZ',
        '@user\x20Seka',
        '__require',
        'Xqkgx',
        '⚡\x20Mengakti',
        'user\x20👋',
        '❌\x20Gagal\x20ge',
        'webp\x20while',
        '\x20Tidak\x20Bek',
        'AIpzN',
        'ck\x20dan\x20lib',
        'Grup\x20di\x20ub',
        'ditolak',
        '!\x0asekarang',
        '?&.\x5c-',
        '--version',
        'dxyET',
        'store',
        'requiring\x20',
        '\x0asekarang\x20',
        'in\x20yang\x20da',
        'join',
        'JDXwt',
        'psert',
        'lear\x20Sessi',
        'isteners',
        'iqGZA',
        '/jadibot.j',
        'groupAccep',
        'chats',
        'ah\x20ke\x20semu',
        'Sticker\x20Mu',
        'Halo\x20kak\x20👋'
    ];
    _0x5a54 = function () {
        return _0x296d80;
    };
    return _0x5a54();
}
process['on'](_0x4cc0d7(0x27d) + _0x4cc0d7(0x110), console[_0x4cc0d7(0x275)]);
let isInit = !![], handler = await import(_0x4cc0d7(0x236) + 'js');
global[_0x4cc0d7(0x2cd) + _0x4cc0d7(0x28a)] = async function (_0x17f2e7) {
    const _0xefabc8 = _0x4cc0d7, _0x60e3d4 = {
            'gIwFL': _0xefabc8(0x147) + _0xefabc8(0x2bd),
            'vPnoQ': function (_0x524458, _0x11f565) {
                return _0x524458 === _0x11f565;
            },
            'aLJIt': _0xefabc8(0x1bd),
            'crpXF': _0xefabc8(0x147) + _0xefabc8(0x1d4),
            'ydZZa': function (_0x598385, _0x2d77a1) {
                return _0x598385 || _0x2d77a1;
            },
            'ouDzn': function (_0x10d6a2, _0x43e61a, _0x1f6f56) {
                return _0x10d6a2(_0x43e61a, _0x1f6f56);
            },
            'MifVp': _0xefabc8(0x210) + '3',
            'YCGJE': _0xefabc8(0x2c6) + _0xefabc8(0x17d) + _0xefabc8(0x17a),
            'XiDhR': _0xefabc8(0x1f4) + _0xefabc8(0x2e6),
            'EHhtg': _0xefabc8(0x1bf) + _0xefabc8(0x30c),
            'jqVbt': _0xefabc8(0x2bc) + 'te',
            'OXZFc': _0xefabc8(0x20b) + _0xefabc8(0x263),
            'xukCu': _0xefabc8(0x11c) + _0xefabc8(0x1df),
            'DxGjk': _0xefabc8(0x28e) + _0xefabc8(0x303) + _0xefabc8(0x17e) + _0xefabc8(0x115) + _0xefabc8(0x1fb),
            'AImof': _0xefabc8(0x2ef) + _0xefabc8(0xef) + _0xefabc8(0x1cd),
            'RIMiA': _0xefabc8(0x1c9) + _0xefabc8(0x28c) + _0xefabc8(0x26f),
            'DTOBF': _0xefabc8(0x1c9) + _0xefabc8(0x240) + _0xefabc8(0x182) + 'n!',
            'hIKxG': _0xefabc8(0x158) + _0xefabc8(0x15c) + _0xefabc8(0xf5) + _0xefabc8(0x2b6),
            'kcVly': _0xefabc8(0x220) + _0xefabc8(0x24b) + _0xefabc8(0x10a) + _0xefabc8(0x1c4) + 't',
            'tQjko': _0xefabc8(0x233) + _0xefabc8(0x15c) + _0xefabc8(0x1c5),
            'WGPkg': _0xefabc8(0x1b7) + _0xefabc8(0x24b) + _0xefabc8(0x2fa) + _0xefabc8(0x191),
            'ZLwRO': _0xefabc8(0x278) + _0xefabc8(0x25f) + _0xefabc8(0x1d5) + _0xefabc8(0x248) + _0xefabc8(0x1dc) + _0xefabc8(0x21b) + _0xefabc8(0x12a),
            'jlzDO': _0xefabc8(0x278) + _0xefabc8(0x2b0) + _0xefabc8(0x1db) + _0xefabc8(0x309) + _0xefabc8(0x172) + _0xefabc8(0x18d) + _0xefabc8(0x171),
            'xLzlE': _0xefabc8(0x1a0) + _0xefabc8(0x1d3) + _0xefabc8(0x189) + _0xefabc8(0x192),
            'zmAgW': _0xefabc8(0x1a0) + _0xefabc8(0x1d3) + _0xefabc8(0x1e6) + _0xefabc8(0x2b3),
            'bBdoC': _0xefabc8(0x22b)
        };
    try {
        const _0x439b8e = await import(_0xefabc8(0x236) + _0xefabc8(0x241) + Date[_0xefabc8(0x23d)]())[_0xefabc8(0x186)](console[_0xefabc8(0x275)]);
        if (Object[_0xefabc8(0x157)](_0x60e3d4[_0xefabc8(0x2b7)](_0x439b8e, {}))[_0xefabc8(0x26a)])
            handler = _0x439b8e;
    } catch (_0x3949f9) {
        console[_0xefabc8(0x275)](_0x3949f9);
    }
    if (_0x17f2e7) {
        const _0x1d9e10 = global[_0xefabc8(0x1bc)][_0xefabc8(0x1e5)];
        try {
            global[_0xefabc8(0x1bc)]['ws'][_0xefabc8(0x2f1)]();
        } catch {
        }
        conn['ev'][_0xefabc8(0x1b9) + _0xefabc8(0x1e1)](), global[_0xefabc8(0x1bc)] = _0x60e3d4[_0xefabc8(0x179)](makeWASocket, connectionOptions, { 'chats': _0x1d9e10 }), isInit = !![];
    }
    if (!isInit) {
        const _0x1caab9 = _0x60e3d4[_0xefabc8(0x174)][_0xefabc8(0x131)]('|');
        let _0x4f7b49 = 0xbd5 * 0x1 + -0x2b * -0x81 + -0x2180;
        while (!![]) {
            switch (_0x1caab9[_0x4f7b49++]) {
            case '0':
                conn['ev'][_0xefabc8(0x2e1)](_0x60e3d4[_0xefabc8(0x168)], conn[_0xefabc8(0x2ce) + _0xefabc8(0x269)]);
                continue;
            case '1':
                conn['ev'][_0xefabc8(0x2e1)](_0x60e3d4[_0xefabc8(0x175)], conn[_0xefabc8(0x2e2)]);
                continue;
            case '2':
                conn['ev'][_0xefabc8(0x2e1)](_0x60e3d4[_0xefabc8(0x23a)], conn[_0xefabc8(0x1bf) + _0xefabc8(0x2aa)]);
                continue;
            case '3':
                conn['ev'][_0xefabc8(0x2e1)](_0x60e3d4[_0xefabc8(0x25b)], conn[_0xefabc8(0xfe) + 'e']);
                continue;
            case '4':
                conn['ev'][_0xefabc8(0x2e1)](_0x60e3d4[_0xefabc8(0x20e)], conn[_0xefabc8(0x232) + 'te']);
                continue;
            case '5':
                conn['ev'][_0xefabc8(0x2e1)](_0x60e3d4[_0xefabc8(0x289)], conn[_0xefabc8(0x1b2)]);
                continue;
            }
            break;
        }
    }
    return conn[_0xefabc8(0xed)] = _0x60e3d4[_0xefabc8(0x137)], conn[_0xefabc8(0x216)] = _0x60e3d4[_0xefabc8(0x101)], conn[_0xefabc8(0x261)] = _0x60e3d4[_0xefabc8(0x2ea)], conn[_0xefabc8(0x294)] = _0x60e3d4[_0xefabc8(0x18b)], conn[_0xefabc8(0x290)] = _0x60e3d4[_0xefabc8(0x1f8)], conn[_0xefabc8(0x1f1)] = _0x60e3d4[_0xefabc8(0x166)], conn[_0xefabc8(0x1b8)] = _0x60e3d4[_0xefabc8(0x2d1)], conn[_0xefabc8(0x1be)] = _0x60e3d4[_0xefabc8(0x156)], conn[_0xefabc8(0x2a9) + 'n'] = _0x60e3d4[_0xefabc8(0x1a8)], conn[_0xefabc8(0x2a9) + 'ff'] = _0x60e3d4[_0xefabc8(0x272)], conn[_0xefabc8(0x20c) + 'n'] = _0x60e3d4[_0xefabc8(0x19e)], conn[_0xefabc8(0x20c) + 'ff'] = _0x60e3d4[_0xefabc8(0x134)], conn[_0xefabc8(0x1b2)] = handler[_0xefabc8(0x1b2)][_0xefabc8(0x2c0)](global[_0xefabc8(0x1bc)]), conn[_0xefabc8(0x2ce) + _0xefabc8(0x269)] = handler[_0xefabc8(0x2ce) + _0xefabc8(0x269)][_0xefabc8(0x2c0)](global[_0xefabc8(0x1bc)]), conn[_0xefabc8(0x232) + 'te'] = handler[_0xefabc8(0x232) + 'te'][_0xefabc8(0x2c0)](global[_0xefabc8(0x1bc)]), conn[_0xefabc8(0x2e2)] = handler[_0xefabc8(0x142) + 'te'][_0xefabc8(0x2c0)](global[_0xefabc8(0x1bc)]), conn[_0xefabc8(0x1bf) + _0xefabc8(0x2aa)] = connectionUpdate[_0xefabc8(0x2c0)](global[_0xefabc8(0x1bc)]), conn[_0xefabc8(0xfe) + 'e'] = saveCreds[_0xefabc8(0x2c0)](global[_0xefabc8(0x1bc)]), conn['ev']['on'](_0x60e3d4[_0xefabc8(0x313)], async _0x1a61d2 => {
        const _0x4da2ba = _0xefabc8;
        console[_0x4da2ba(0x187)](_0x60e3d4[_0x4da2ba(0x169)], _0x1a61d2), _0x60e3d4[_0x4da2ba(0x140)](_0x1a61d2[_0x4da2ba(0x2d4)], _0x60e3d4[_0x4da2ba(0x15d)]) && (await conn[_0x4da2ba(0x27b)](_0x1a61d2['id']), console[_0x4da2ba(0x187)](_0x60e3d4[_0x4da2ba(0x1a7)]));
    }), conn['ev']['on'](_0x60e3d4[_0xefabc8(0x289)], conn[_0xefabc8(0x1b2)]), conn['ev']['on'](_0x60e3d4[_0xefabc8(0x168)], conn[_0xefabc8(0x2ce) + _0xefabc8(0x269)]), conn['ev']['on'](_0x60e3d4[_0xefabc8(0x20e)], conn[_0xefabc8(0x232) + 'te']), conn['ev']['on'](_0x60e3d4[_0xefabc8(0x175)], conn[_0xefabc8(0x2e2)]), conn['ev']['on'](_0x60e3d4[_0xefabc8(0x23a)], conn[_0xefabc8(0x1bf) + _0xefabc8(0x2aa)]), conn['ev']['on'](_0x60e3d4[_0xefabc8(0x25b)], conn[_0xefabc8(0xfe) + 'e']), isInit = ![], !![];
};
const pluginFolder = global[_0x4cc0d7(0x298)](join(__dirname, _0x4cc0d7(0x18a) + _0x4cc0d7(0x161))), pluginFilter = _0x2978df => /\.js$/[_0x4cc0d7(0x2af)](_0x2978df);
global[_0x4cc0d7(0x209)] = {};
async function filesInit() {
    const _0x55eafb = _0x4cc0d7, _0x503610 = {
            'VfPdd': function (_0x57df45, _0x540043) {
                return _0x57df45(_0x540043);
            },
            'HNQju': function (_0x1d42c1, _0x43f505, _0x15e8f2) {
                return _0x1d42c1(_0x43f505, _0x15e8f2);
            }
        };
    for (let _0x3b3709 of _0x503610[_0x55eafb(0xe2)](readdirSync, pluginFolder)[_0x55eafb(0x291)](pluginFilter)) {
        try {
            let _0x19f4b7 = global[_0x55eafb(0x17c)](_0x503610[_0x55eafb(0x2eb)](join, pluginFolder, _0x3b3709));
            const _0xb2bba7 = await import(_0x19f4b7);
            global[_0x55eafb(0x209)][_0x3b3709] = _0xb2bba7[_0x55eafb(0x119)] || _0xb2bba7;
        } catch (_0x4c8df0) {
            conn[_0x55eafb(0x190)][_0x55eafb(0x275)](_0x4c8df0), delete global[_0x55eafb(0x209)][_0x3b3709];
        }
    }
}
filesInit()[_0x4cc0d7(0x133)](_0x5950d6 => console[_0x4cc0d7(0x187)](Object[_0x4cc0d7(0x157)](global[_0x4cc0d7(0x209)])))[_0x4cc0d7(0x186)](console[_0x4cc0d7(0x275)]), global[_0x4cc0d7(0x16c)] = async (_0x364354, _0x439880) => {
    const _0x53b29b = _0x4cc0d7, _0x886e91 = {
            'rBGcM': function (_0x328229, _0x32ecb1) {
                return _0x328229(_0x32ecb1);
            },
            'IWbKQ': function (_0x46d331, _0x355d27, _0x2a4c0e) {
                return _0x46d331(_0x355d27, _0x2a4c0e);
            },
            'MjHfQ': function (_0x59d08f, _0x5ddaec) {
                return _0x59d08f in _0x5ddaec;
            },
            'BPfsh': function (_0x52e947, _0x4f2ddf) {
                return _0x52e947(_0x4f2ddf);
            },
            'PJCuk': function (_0x14a612, _0x20f322, _0xe4770e, _0x179f25) {
                return _0x14a612(_0x20f322, _0xe4770e, _0x179f25);
            },
            'rnqFZ': _0x53b29b(0x22e),
            'RpwGc': function (_0xfdb6b4, _0x280d56) {
                return _0xfdb6b4(_0x280d56);
            },
            'vSNpH': function (_0x24ef27, _0x28deb4) {
                return _0x24ef27(_0x28deb4);
            }
        };
    if (_0x886e91[_0x53b29b(0x207)](pluginFilter, _0x439880)) {
        let _0x3fd65e = global[_0x53b29b(0x17c)](_0x886e91[_0x53b29b(0x102)](join, pluginFolder, _0x439880), !![]);
        if (_0x886e91[_0x53b29b(0x173)](_0x439880, global[_0x53b29b(0x209)])) {
            if (_0x886e91[_0x53b29b(0x10c)](existsSync, _0x3fd65e))
                conn[_0x53b29b(0x190)][_0x53b29b(0x2ca)](_0x53b29b(0xe9) + _0x53b29b(0x2c5) + '\x27' + _0x439880 + '\x27');
            else
                return conn[_0x53b29b(0x190)][_0x53b29b(0x2cc)](_0x53b29b(0x19d) + _0x53b29b(0x280) + _0x439880 + '\x27'), delete global[_0x53b29b(0x209)][_0x439880];
        } else
            conn[_0x53b29b(0x190)][_0x53b29b(0x2ca)](_0x53b29b(0x1da) + _0x53b29b(0x270) + '\x20\x27' + _0x439880 + '\x27');
        let _0x39c21d = _0x886e91[_0x53b29b(0x30d)](_0xc18767, _0x886e91[_0x53b29b(0x10c)](readFileSync, _0x3fd65e), _0x439880, {
            'sourceType': _0x886e91[_0x53b29b(0x21e)],
            'allowAwaitOutsideFunction': !![]
        });
        if (_0x39c21d)
            conn[_0x53b29b(0x190)][_0x53b29b(0x275)](_0x53b29b(0x19f) + _0x53b29b(0x250) + _0x53b29b(0x1fe) + _0x439880 + '\x27\x0a' + _0x886e91[_0x53b29b(0x29b)](format, _0x39c21d));
        else
            try {
                const _0x117580 = await import(global[_0x53b29b(0x17c)](_0x3fd65e) + _0x53b29b(0x285) + Date[_0x53b29b(0x23d)]());
                global[_0x53b29b(0x209)][_0x439880] = _0x117580[_0x53b29b(0x119)] || _0x117580;
            } catch (_0x16d637) {
                conn[_0x53b29b(0x190)][_0x53b29b(0x275)](_0x53b29b(0x132) + _0x53b29b(0x217) + '\x20\x27' + _0x439880 + '\x0a' + _0x886e91[_0x53b29b(0x11a)](format, _0x16d637) + '\x27');
            } finally {
                global[_0x53b29b(0x209)] = Object[_0x53b29b(0x2de) + 's'](Object[_0x53b29b(0x194)](global[_0x53b29b(0x209)])[_0x53b29b(0x181)](([_0x37871e], [_0x454a11]) => _0x37871e[_0x53b29b(0x246) + _0x53b29b(0x259)](_0x454a11)));
            }
    }
}, Object[_0x4cc0d7(0x1c1)](global[_0x4cc0d7(0x16c)]), watch(pluginFolder, global[_0x4cc0d7(0x16c)]), await global[_0x4cc0d7(0x2cd) + _0x4cc0d7(0x28a)]();
async function _quickTest() {
    const _0x7e6dbb = _0x4cc0d7, _0x1294df = {
            'hfmhv': function (_0x5e3baa, _0x37e324) {
                return _0x5e3baa(_0x37e324);
            },
            'oKBQm': function (_0xd2e211, _0x4bc9be) {
                return _0xd2e211 !== _0x4bc9be;
            },
            'SyiHG': _0x7e6dbb(0x2f1),
            'buYMJ': _0x7e6dbb(0x275),
            'iqGZA': function (_0x2466b2, _0x2cbd04) {
                return _0x2466b2(_0x2cbd04);
            },
            'MCkKV': _0x7e6dbb(0x1f3),
            'JDXwt': function (_0x11d445, _0x58cf5) {
                return _0x11d445(_0x58cf5);
            },
            'uSGVL': _0x7e6dbb(0x184),
            'dXKvq': function (_0x4d9336, _0x358f8c, _0x4f1288) {
                return _0x4d9336(_0x358f8c, _0x4f1288);
            },
            'Vyiyi': _0x7e6dbb(0xe5) + 'er',
            'xLSMO': _0x7e6dbb(0x1ab),
            'hosZm': _0x7e6dbb(0x25e) + _0x7e6dbb(0x145),
            'olhRO': _0x7e6dbb(0x16f),
            'XbPpX': _0x7e6dbb(0x1f5),
            'PsoJW': _0x7e6dbb(0x2e7),
            'ubrjz': _0x7e6dbb(0x146),
            'Bbdui': _0x7e6dbb(0x244),
            'Xqkgx': function (_0x3c2567, _0x1eac57) {
                return _0x3c2567(_0x1eac57);
            },
            'RzHrV': _0x7e6dbb(0x2f8),
            'EGMCC': _0x7e6dbb(0x1d7),
            'dxyET': _0x7e6dbb(0x1e7) + _0x7e6dbb(0x231) + _0x7e6dbb(0x2d3) + _0x7e6dbb(0x1ae) + _0x7e6dbb(0x111) + _0x7e6dbb(0x1b5) + _0x7e6dbb(0x302) + _0x7e6dbb(0x1cf) + _0x7e6dbb(0x199) + _0x7e6dbb(0x1ed),
            'KRXmI': _0x7e6dbb(0x312) + _0x7e6dbb(0x306) + _0x7e6dbb(0x1d0) + _0x7e6dbb(0x2b1) + _0x7e6dbb(0x28d) + _0x7e6dbb(0x1d2) + _0x7e6dbb(0x20f) + _0x7e6dbb(0x2db) + _0x7e6dbb(0x121) + _0x7e6dbb(0x12e) + _0x7e6dbb(0x223) + _0x7e6dbb(0x1a9)
        };
    let _0xbb4de = await Promise[_0x7e6dbb(0x2ba)]([
            _0x1294df[_0x7e6dbb(0x1e2)](spawn, _0x1294df[_0x7e6dbb(0x297)]),
            _0x1294df[_0x7e6dbb(0x1de)](spawn, _0x1294df[_0x7e6dbb(0x2b5)]),
            _0x1294df[_0x7e6dbb(0x1eb)](spawn, _0x1294df[_0x7e6dbb(0x297)], [
                _0x1294df[_0x7e6dbb(0x1af)],
                _0x1294df[_0x7e6dbb(0x296)],
                _0x1294df[_0x7e6dbb(0x2a0)],
                _0x1294df[_0x7e6dbb(0x222)],
                _0x1294df[_0x7e6dbb(0x258)],
                _0x1294df[_0x7e6dbb(0x13f)],
                '1',
                '-f',
                _0x1294df[_0x7e6dbb(0x198)],
                '-'
            ]),
            _0x1294df[_0x7e6dbb(0x1e2)](spawn, _0x1294df[_0x7e6dbb(0x2d5)]),
            _0x1294df[_0x7e6dbb(0x1de)](spawn, _0x1294df[_0x7e6dbb(0x123)]),
            _0x1294df[_0x7e6dbb(0x1cb)](spawn, 'gm'),
            _0x1294df[_0x7e6dbb(0x1eb)](spawn, _0x1294df[_0x7e6dbb(0x196)], [_0x1294df[_0x7e6dbb(0x22a)]])
        ][_0x7e6dbb(0x1c2)](_0x35b602 => {
            const _0x560028 = _0x7e6dbb, _0x303bdc = {
                    'dHceq': function (_0xa9e383, _0x273bc9) {
                        const _0xc75ddf = _0x6c0f;
                        return _0x1294df[_0xc75ddf(0x21c)](_0xa9e383, _0x273bc9);
                    },
                    'BuJnD': function (_0xd34d96, _0x46bab0) {
                        const _0x3c0946 = _0x6c0f;
                        return _0x1294df[_0x3c0946(0x2da)](_0xd34d96, _0x46bab0);
                    },
                    'zUSZx': _0x1294df[_0x560028(0x214)],
                    'MhTaQ': _0x1294df[_0x560028(0x2a0)]
                };
            return Promise[_0x560028(0x2f7)]([
                new Promise(_0x1ecad3 => {
                    const _0x1c8681 = _0x560028, _0x1dc62a = {
                            'TJoBh': function (_0x25b0fa, _0x1a1b58) {
                                const _0x213f3a = _0x6c0f;
                                return _0x303bdc[_0x213f3a(0x1a2)](_0x25b0fa, _0x1a1b58);
                            },
                            'OvCrk': function (_0x534a76, _0x249cc7) {
                                const _0x2be585 = _0x6c0f;
                                return _0x303bdc[_0x2be585(0x307)](_0x534a76, _0x249cc7);
                            }
                        };
                    _0x35b602['on'](_0x303bdc[_0x1c8681(0x2a6)], _0x41d40d => {
                        const _0x42056b = _0x1c8681;
                        _0x1dc62a[_0x42056b(0x18f)](_0x1ecad3, _0x1dc62a[_0x42056b(0x299)](_0x41d40d, -0x1505 + -0x11f * -0x14 + -0x3a * 0x4));
                    });
                }),
                new Promise(_0x84ae5c => {
                    const _0x3eb423 = _0x560028;
                    _0x35b602['on'](_0x303bdc[_0x3eb423(0x25a)], _0x46931b => _0x84ae5c(![]));
                })
            ]);
        })), [_0x4788c8, _0x37071e, _0x3d8917, _0x4c90dd, _0x366b68, _0x3fd6eb, _0xeb3bab] = _0xbb4de, _0x19d3cc = global[_0x7e6dbb(0x242)] = {
            'ffmpeg': _0x4788c8,
            'ffprobe': _0x37071e,
            'ffmpegWebp': _0x3d8917,
            'convert': _0x4c90dd,
            'magick': _0x366b68,
            'gm': _0x3fd6eb,
            'find': _0xeb3bab
        };
    Object[_0x7e6dbb(0x1c1)](global[_0x7e6dbb(0x242)]), !_0x19d3cc[_0x7e6dbb(0x1f3)] && conn[_0x7e6dbb(0x190)][_0x7e6dbb(0x2cc)](_0x7e6dbb(0xfd) + _0x7e6dbb(0x1ad) + _0x7e6dbb(0x1b1) + _0x7e6dbb(0x23e) + _0x7e6dbb(0x24a) + _0x7e6dbb(0x154) + _0x7e6dbb(0xee)), _0x19d3cc[_0x7e6dbb(0x1f3)] && !_0x19d3cc[_0x7e6dbb(0x12b)] && conn[_0x7e6dbb(0x190)][_0x7e6dbb(0x2cc)](_0x1294df[_0x7e6dbb(0x1d8)]), !_0x19d3cc[_0x7e6dbb(0x146)] && !_0x19d3cc[_0x7e6dbb(0x244)] && !_0x19d3cc['gm'] && conn[_0x7e6dbb(0x190)][_0x7e6dbb(0x2cc)](_0x1294df[_0x7e6dbb(0x219)]);
}
function _0x6c0f(_0x143586, _0x539a3f) {
    _0x143586 = _0x143586 - (-0x25eb * -0x1 + 0x1086 + -0x1ac9 * 0x2);
    const _0x30d25e = _0x5a54();
    let _0x48e544 = _0x30d25e[_0x143586];
    return _0x48e544;
}
_quickTest()[_0x4cc0d7(0x133)](() => conn[_0x4cc0d7(0x190)][_0x4cc0d7(0x2ca)](_0x4cc0d7(0x230) + _0x4cc0d7(0x1c7) + _0x4cc0d7(0x2b8) + _0x4cc0d7(0x11b) + _0x4cc0d7(0x30e) + 'n'))[_0x4cc0d7(0x186)](console[_0x4cc0d7(0x275)]);