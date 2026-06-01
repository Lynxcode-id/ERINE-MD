const _0x4217e7 = _0x5337;
(function (_0x123f1a, _0x138b01) {
    const _0x596f20 = _0x5337, _0x497b0c = _0x123f1a();
    while (!![]) {
        try {
            const _0x1d8804 = parseInt(_0x596f20(0x1b9)) / (-0x143 * -0x1 + 0xcad + 0x7b * -0x1d) * (-parseInt(_0x596f20(0x19f)) / (0xb99 + 0xca1 + -0x26c * 0xa)) + -parseInt(_0x596f20(0x294)) / (0xb * -0xf7 + -0x1 * -0x978 + 0x128) + -parseInt(_0x596f20(0x197)) / (-0x9 * -0x115 + 0xa21 + 0xb * -0x1ce) * (-parseInt(_0x596f20(0x1c6)) / (-0x10b2 * -0x2 + -0x19ab * 0x1 + 0x1d * -0x44)) + -parseInt(_0x596f20(0x16c)) / (-0x2466 + 0xbf * 0x18 + -0x316 * -0x6) + -parseInt(_0x596f20(0x1be)) / (0x3 * 0x7b2 + 0x5 + -0x1 * 0x1714) * (parseInt(_0x596f20(0x26c)) / (0x4e6 + -0x1158 + -0x2 * -0x63d)) + -parseInt(_0x596f20(0xf5)) / (0xb83 + -0x1aab * 0x1 + 0xf31) * (-parseInt(_0x596f20(0xaa)) / (0xad3 * -0x1 + 0x1664 + -0xb87)) + parseInt(_0x596f20(0x9a)) / (-0x2178 + 0xd33 + 0x1450);
            if (_0x1d8804 === _0x138b01)
                break;
            else
                _0x497b0c['push'](_0x497b0c['shift']());
        } catch (_0x4749db) {
            _0x497b0c['push'](_0x497b0c['shift']());
        }
    }
}(_0x2211, 0x1 * 0x38a4d + 0x2d7e0 * -0x2 + 0x821 * 0x166), process[_0x4217e7(0x200)][_0x4217e7(0x150) + _0x4217e7(0x10e) + _0x4217e7(0x237)] = '1');
import './readme-guard.js';
import { startReadmeWatchdog } from './lib/bootlock.js';
import './config.js';
import _0xfa417d, { join } from 'path';
import { platform } from 'process';
import {
    fileURLToPath,
    pathToFileURL
} from 'url';
import { createRequire } from 'module';
global[_0x4217e7(0x1bb)] = function filename(_0x10f651 = import.meta.url, _0x1cd53b = platform !== _0x4217e7(0x272)) {
    const _0x11c71d = _0x4217e7, _0x38fdd3 = {
            'FXDvY': function (_0x3fe145, _0x458f9a) {
                return _0x3fe145(_0x458f9a);
            }
        };
    return _0x1cd53b ? /file:\/\/\//[_0x11c71d(0x28f)](_0x10f651) ? _0x38fdd3[_0x11c71d(0x28b)](fileURLToPath, _0x10f651) : _0x10f651 : _0x38fdd3[_0x11c71d(0x28b)](pathToFileURL, _0x10f651)[_0x11c71d(0x1f5)]();
}, global[_0x4217e7(0x92)] = function dirname(_0x401e4d) {
    const _0x3d8e0c = _0x4217e7;
    return _0xfa417d[_0x3d8e0c(0x11f)](global[_0x3d8e0c(0x1bb)](_0x401e4d, !![]));
}, global[_0x4217e7(0x2ab)] = function require(_0x49eda1 = import.meta.url) {
    const _0x5073fa = _0x4217e7, _0x534f1c = {
            'ChFxz': function (_0x18d36a, _0x3523be) {
                return _0x18d36a(_0x3523be);
            }
        };
    return _0x534f1c[_0x5073fa(0xbc)](createRequire, _0x49eda1);
};
import {
    readdirSync,
    statSync,
    unlinkSync,
    existsSync,
    readFileSync,
    watch
} from 'fs';
import _0x4e8527 from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
const argv = _0x4e8527(hideBin(process[_0x4217e7(0x182)]))[_0x4217e7(0x182)];
import { spawn } from 'child_process';
import _0x562bb6 from 'lodash';
import _0x5aebdb from 'syntax-error';
import _0x50899c from 'chalk';
import { tmpdir } from 'os';
import _0x241dfe from 'readline';
import { format } from 'util';
import _0x59f5c7 from 'pino';
import _0x55742c from 'ws';
import * as _0x1ffc68 from '@whiskeysockets/baileys';
const {useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, makeCacheableSignalKeyStore, jidNormalizedUser} = _0x1ffc68;
import _0x5aa60e from 'node-cache';
const msgRetryCounterCache = new _0x5aa60e(), groupCache = new _0x5aa60e({
        'stdTTL': (0x31 * 0xb7 + -0x588 + -0x9a * 0x31) * (0x1 * 0x1b91 + 0x12dd * 0x1 + -0x2e32),
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
import _0x430985 from './lib/cloudDBAdapter.js';
import {
    mongoDB,
    mongoDBV2
} from './lib/mongoDB.js';
const {CONNECTING} = _0x55742c, {chain} = _0x562bb6, PORT = process[_0x4217e7(0x200)][_0x4217e7(0x17d)] || process[_0x4217e7(0x200)][_0x4217e7(0x151) + 'T'] || 0x1 * 0x2581 + 0x20e * 0x10 + -0x3aa9;
protoType(), serialize(), global[_0x4217e7(0x12e)] = (_0x38ada0, _0x3f5488 = '/', _0x28b283 = {}, _0x5023dc) => (_0x38ada0 in global[_0x4217e7(0xdb)] ? global[_0x4217e7(0xdb)][_0x38ada0] : _0x38ada0) + _0x3f5488 + (_0x28b283 || _0x5023dc ? '?' + new URLSearchParams(Object[_0x4217e7(0x267)]({
    ..._0x28b283,
    ..._0x5023dc ? { [_0x5023dc]: global[_0x4217e7(0x224)][_0x38ada0 in global[_0x4217e7(0xdb)] ? global[_0x4217e7(0xdb)][_0x38ada0] : _0x38ada0] } : {}
})) : ''), global[_0x4217e7(0xc6)] = { 'start': new Date() };
const __dirname = global[_0x4217e7(0x92)](import.meta.url);
global[_0x4217e7(0x1f3)] = new Object(_0x4e8527(process[_0x4217e7(0x182)][_0x4217e7(0x162)](-0x33 * -0x1f + -0x1a * 0x5b + 0x313))[_0x4217e7(0xf4) + 's'](![])[_0x4217e7(0xd8)]()), global[_0x4217e7(0x156)] = new RegExp('^[' + (opts[_0x4217e7(0x156)] || _0x4217e7(0xa2) + _0x4217e7(0x1a5) + _0x4217e7(0x1fd) + _0x4217e7(0x13e))[_0x4217e7(0x259)](/[|\\{}()[\]^$+*?.\-\^]/g, _0x4217e7(0x1da)) + ']'), global['db'] = new Low(/https?:\/\//[_0x4217e7(0x28f)](opts['db'] || '') ? new _0x430985(opts['db']) : /mongodb(\+srv)?:\/\//i[_0x4217e7(0x28f)](opts['db']) ? opts[_0x4217e7(0x1b7)] ? new mongoDBV2(opts['db']) : new mongoDB(opts['db']) : new JSONFile((opts['_'][-0x1b4c + -0x98d + -0x24d9 * -0x1] ? opts['_'][-0x2701 * 0x1 + -0x151 * -0x7 + 0x1dca] + '_' : '') + (_0x4217e7(0xdf) + _0x4217e7(0xaf)))), global[_0x4217e7(0x186)] = global['db'], global[_0x4217e7(0xec) + 'se'] = async function loadDatabase() {
    const _0x162332 = _0x4217e7, _0x31fe71 = {
            'bZFqw': function (_0x10e86c, _0xdf1f71) {
                return _0x10e86c(_0xdf1f71);
            },
            'TJnDo': function (_0x338923, _0x336c7d) {
                return _0x338923 == _0x336c7d;
            },
            'RloyN': function (_0x1bc1f3, _0x9b4c0e) {
                return _0x1bc1f3 !== _0x9b4c0e;
            },
            'mNzKY': function (_0x173520, _0x197517) {
                return _0x173520(_0x197517);
            }
        };
    if (db[_0x162332(0x123)])
        return new Promise(_0x523a18 => setInterval(async function () {
            const _0x359486 = _0x162332;
            !db[_0x359486(0x123)] && (_0x31fe71[_0x359486(0x255)](clearInterval, this), _0x31fe71[_0x359486(0x255)](_0x523a18, _0x31fe71[_0x359486(0x11c)](db[_0x359486(0x13c)], null) ? global[_0x359486(0xec) + 'se']() : db[_0x359486(0x13c)]));
        }, (0xfb7 + -0x58b + -0xa2b) * (0x22bc + -0x11 * 0x89 + -0x15bb)));
    if (_0x31fe71[_0x162332(0x29a)](db[_0x162332(0x13c)], null))
        return;
    db[_0x162332(0x123)] = !![], await db[_0x162332(0x296)]()[_0x162332(0x257)](console[_0x162332(0xc4)]), db[_0x162332(0x123)] = null, db[_0x162332(0x13c)] = {
        'users': {},
        'chats': {},
        'stats': {},
        'msgs': {},
        'sticker': {},
        'settings': {},
        ...db[_0x162332(0x13c)] || {}
    }, global['db'][_0x162332(0x234)] = _0x31fe71[_0x162332(0x154)](chain, db[_0x162332(0x13c)]);
}, loadDatabase();
const usePairingCode = !process[_0x4217e7(0x182)][_0x4217e7(0x14f)](_0x4217e7(0x1cf) + _0x4217e7(0x90)), useMobile = process[_0x4217e7(0x182)][_0x4217e7(0x14f)](_0x4217e7(0x107));
var question = function (_0x60ee1d) {
    return new Promise(function (_0x31e18c) {
        const _0x439c90 = _0x5337;
        rl[_0x439c90(0x25d)](_0x60ee1d, _0x31e18c);
    });
};
const rl = _0x241dfe[_0x4217e7(0xdc) + _0x4217e7(0x168)]({
        'input': process[_0x4217e7(0x8f)],
        'output': process[_0x4217e7(0x250)]
    }), {
        version: waVersion,
        isLatest
    } = await fetchLatestBaileysVersion()[_0x4217e7(0x257)](_0x497e35 => {
        const _0x4f4384 = _0x4217e7, _0x41bf41 = { 'JljDb': _0x4f4384(0x233) + _0x4f4384(0x232) + _0x4f4384(0x159) + _0x4f4384(0x9d) };
        return console[_0x4f4384(0xc4)](_0x41bf41[_0x4f4384(0x21a)], _0x497e35), {
            'version': undefined,
            'isLatest': ![]
        };
    }), {state, saveCreds} = await useMultiFileAuthState(_0x4217e7(0x16f)), store = makeInMemoryStore({
        'logger': _0x59f5c7()[_0x4217e7(0x1cc)]({
            'level': _0x4217e7(0x258),
            'stream': _0x4217e7(0x248)
        })
    }), connectionOptions = {
        ...waVersion ? { 'version': waVersion } : {},
        'logger': _0x59f5c7({ 'level': _0x4217e7(0x258) }),
        'printQRInTerminal': !usePairingCode,
        'browser': [
            _0x4217e7(0x2af),
            _0x4217e7(0x133),
            _0x4217e7(0x102)
        ],
        'auth': {
            'creds': state[_0x4217e7(0x204)],
            'keys': makeCacheableSignalKeyStore(state[_0x4217e7(0x143)], _0x59f5c7()[_0x4217e7(0x1cc)]({
                'level': _0x4217e7(0x258),
                'stream': _0x4217e7(0x248)
            }))
        },
        'msgRetryCounterCache': msgRetryCounterCache,
        'cachedGroupMetadata': async _0x3d36b1 => groupCache[_0x4217e7(0x175)](_0x3d36b1),
        'getMessage': async _0x372ec9 => {
            const _0x478b0a = _0x4217e7, _0x2518e6 = {
                    'BdUVX': function (_0x192f16, _0xce8201) {
                        return _0x192f16(_0xce8201);
                    }
                }, _0x394745 = _0x2518e6[_0x478b0a(0x14e)](jidNormalizedUser, _0x372ec9[_0x478b0a(0xd9)]), _0x45c9b9 = await store[_0x478b0a(0x22c) + 'e'](_0x394745, _0x372ec9['id']);
            return _0x45c9b9?.[_0x478b0a(0x223)] || undefined;
        },
        'generateHighQualityLinkPreview': !![],
        'patchMessageBeforeSending': _0x5d6735 => {
            const _0xaa6b18 = _0x4217e7, _0x1e766f = !!(_0x5d6735[_0xaa6b18(0x221) + _0xaa6b18(0x1e7)] || _0x5d6735[_0xaa6b18(0x2a4) + _0xaa6b18(0x213)] || _0x5d6735[_0xaa6b18(0x298) + 'e']);
            return _0x1e766f && (_0x5d6735 = {
                'viewOnceMessage': {
                    'message': {
                        'messageContextInfo': {
                            'deviceListMetadataVersion': 0x2,
                            'deviceListMetadata': {}
                        },
                        ..._0x5d6735
                    }
                }
            }), _0x5d6735;
        },
        'connectTimeoutMs': 0xea60,
        'defaultQueryTimeoutMs': 0x0,
        'syncFullHistory': !![],
        'markOnlineOnConnect': !![]
    };
global[_0x4217e7(0x130)] = makeWASocket(connectionOptions), conn[_0x4217e7(0x149)] = ![], store[_0x4217e7(0x13b)](conn['ev']);
const originalQuery = conn[_0x4217e7(0x93)][_0x4217e7(0x13b)](conn);
conn[_0x4217e7(0x93)] = async _0x46acfd => {
    const _0x3a154a = _0x4217e7, _0x244f2d = {
            'Rhata': function (_0x3b72da, _0x302d75) {
                return _0x3b72da === _0x302d75;
            },
            'QdqpD': _0x3a154a(0x17c),
            'DSmtB': _0x3a154a(0x16a) + _0x3a154a(0x15c),
            'TCZAO': _0x3a154a(0x1ae) + _0x3a154a(0x141) + _0x3a154a(0x9f),
            'feczq': _0x3a154a(0x217) + _0x3a154a(0x27a) + _0x3a154a(0x9f),
            'fbpOd': _0x3a154a(0x1ec) + _0x3a154a(0xed) + _0x3a154a(0x9f),
            'YvsgI': _0x3a154a(0xe8) + _0x3a154a(0x18f) + _0x3a154a(0x9f),
            'iOaGP': _0x3a154a(0x1c2) + _0x3a154a(0x22d) + _0x3a154a(0x2a9) + _0x3a154a(0x19b) + _0x3a154a(0x8b) + _0x3a154a(0x15f) + _0x3a154a(0x1de) + _0x3a154a(0x18a) + _0x3a154a(0xb7),
            'eMIIi': function (_0x3adf0e, _0x555888) {
                return _0x3adf0e(_0x555888);
            }
        };
    if (_0x46acfd && _0x244f2d[_0x3a154a(0x291)](_0x46acfd[_0x3a154a(0xc2)], 'iq') && _0x46acfd[_0x3a154a(0x21b)] && _0x244f2d[_0x3a154a(0x291)](_0x46acfd[_0x3a154a(0x21b)][_0x3a154a(0x20a)], _0x244f2d[_0x3a154a(0xa1)])) {
        let _0x16a967 = JSON[_0x3a154a(0x20b)](_0x46acfd);
        if (_0x16a967[_0x3a154a(0x14f)](_0x244f2d[_0x3a154a(0x134)])) {
            const _0x121e5a = [
                _0x244f2d[_0x3a154a(0x260)],
                _0x244f2d[_0x3a154a(0x2a3)],
                _0x244f2d[_0x3a154a(0x1ef)],
                _0x244f2d[_0x3a154a(0x14a)]
            ];
            let _0x56ae68 = _0x121e5a[_0x3a154a(0x24a)](_0x20f7d3 => _0x16a967[_0x3a154a(0x14f)](_0x20f7d3));
            if (!_0x56ae68)
                return console[_0x3a154a(0x8a)](_0x50899c[_0x3a154a(0x29b)][_0x3a154a(0x1ff)](_0x244f2d[_0x3a154a(0x26f)])), { 'status': 0xc8 };
        }
    }
    return _0x244f2d[_0x3a154a(0x10f)](originalQuery, _0x46acfd);
};
if (usePairingCode && !conn[_0x4217e7(0x1e9)][_0x4217e7(0x204)][_0x4217e7(0xa0)]) {
    if (useMobile)
        throw new Error(_0x4217e7(0x23b) + _0x4217e7(0x12d) + _0x4217e7(0x1e4) + _0x4217e7(0xad));
    let phoneNumber = (argv['_'][0x1db5 + -0xae5 * 0x1 + -0x12d0] || '')[_0x4217e7(0x1c4)]()[_0x4217e7(0x259)](/[^0-9]/g, '');
    while (!phoneNumber) {
        phoneNumber = (await question(_0x50899c[_0x4217e7(0x26d)](_0x4217e7(0x1c0) + _0x4217e7(0x17a) + _0x4217e7(0x1c9) + _0x4217e7(0xfe) + _0x4217e7(0x203) + _0x4217e7(0x247) + _0x4217e7(0x1ed) + _0x4217e7(0x145) + '\x0a')))[_0x4217e7(0x1c4)]()[_0x4217e7(0x259)](/[^0-9]/g, '');
    }
    rl[_0x4217e7(0x19d)](), console[_0x4217e7(0x8a)](_0x50899c[_0x4217e7(0x1f0)](_0x4217e7(0x2a8) + _0x4217e7(0xb0) + phoneNumber)), console[_0x4217e7(0x8a)](_0x50899c[_0x4217e7(0x1e0)](_0x50899c[_0x4217e7(0x167)](_0x4217e7(0x1a3) + _0x4217e7(0x2bb) + _0x4217e7(0x239)))), setTimeout(async () => {
        const _0x475485 = _0x4217e7, _0x36fb45 = {
                'TrUpz': _0x475485(0xc9),
                'hzjvH': function (_0x5172f7, _0x1c47eb) {
                    return _0x5172f7 + _0x1c47eb;
                },
                'NilMh': _0x475485(0x139) + _0x475485(0x12d) + _0x475485(0x148) + _0x475485(0x112) + _0x475485(0xb1),
                'vuHkE': _0x475485(0x194) + _0x475485(0x1ac) + _0x475485(0x131)
            };
        try {
            const _0x390d13 = await conn[_0x475485(0x96) + _0x475485(0x271)](phoneNumber, _0x36fb45[_0x475485(0x10b)]), _0x326829 = _0x390d13?.[_0x475485(0x111)](/.{1,4}/g)?.[_0x475485(0x135)]('-') || _0x390d13, _0x29551c = '─'[_0x475485(0x128)](_0x36fb45[_0x475485(0x205)](_0x326829[_0x475485(0x28d)], -0x1233 + 0x9f6 + 0x841));
            console[_0x475485(0x8a)](_0x50899c[_0x475485(0x1f0)]('\x0a┌' + _0x29551c + '┐')), console[_0x475485(0x8a)](_0x50899c[_0x475485(0x1f0)]('│\x20' + _0x50899c[_0x475485(0x1d8)][_0x475485(0x27e)](_0x326829) + '\x20│')), console[_0x475485(0x8a)](_0x50899c[_0x475485(0x1f0)]('└' + _0x29551c + '┘')), console[_0x475485(0x8a)](_0x50899c[_0x475485(0x157)](_0x475485(0x1ee) + _0x475485(0x244) + _0x50899c[_0x475485(0x27e)](_0x36fb45[_0x475485(0x10b)]))), console[_0x475485(0x8a)](_0x50899c[_0x475485(0x293)](_0x36fb45[_0x475485(0x169)]));
        } catch (_0x1a7c1d) {
            console[_0x475485(0xc4)](_0x50899c[_0x475485(0x2b7)](_0x36fb45[_0x475485(0x1c3)]), _0x1a7c1d), process[_0x475485(0x9e)](-0x2438 + 0x183c + 0x63 * 0x1f);
        }
    }, -0x1d02 + -0x132 + 0x2604);
}
async function resetLimit() {
    const _0x3a83cb = _0x4217e7, _0x4ea38b = {
            'xIsVj': function (_0x525211, _0x341e60) {
                return _0x525211 !== _0x341e60;
            },
            'gMgNC': _0x3a83cb(0x119),
            'XuZyi': function (_0x3c9635, _0x55f09d) {
                return _0x3c9635 !== _0x55f09d;
            },
            'XRwjA': _0x3a83cb(0x2ba),
            'OEKum': function (_0x12cdea, _0x4d3603) {
                return _0x12cdea < _0x4d3603;
            },
            'pUueb': _0x3a83cb(0x2b2) + _0x3a83cb(0x241) + _0x3a83cb(0x256),
            'vdOwE': _0x3a83cb(0x13a) + _0x3a83cb(0x22f)
        };
    try {
        if (!global['db']?.[_0x3a83cb(0x13c)]?.[_0x3a83cb(0x212)])
            return;
        const _0x508b5e = -0x3 + 0x1509 + -0x14f7;
        for (const [, _0x185408] of Object[_0x3a83cb(0x267)](global['db'][_0x3a83cb(0x13c)][_0x3a83cb(0x212)])) {
            if (!_0x185408 || _0x4ea38b[_0x3a83cb(0x177)](typeof _0x185408, _0x4ea38b[_0x3a83cb(0x21e)]))
                continue;
            (_0x4ea38b[_0x3a83cb(0x254)](typeof _0x185408[_0x3a83cb(0xa8)], _0x4ea38b[_0x3a83cb(0xb2)]) || _0x4ea38b[_0x3a83cb(0x2bc)](_0x185408[_0x3a83cb(0xa8)], _0x508b5e)) && (_0x185408[_0x3a83cb(0xa8)] = _0x508b5e);
        }
        console[_0x3a83cb(0x8a)](_0x50899c[_0x3a83cb(0x1f0)](_0x4ea38b[_0x3a83cb(0x275)]));
    } catch (_0x4dd754) {
        console[_0x3a83cb(0xc4)](_0x4ea38b[_0x3a83cb(0x207)], _0x4dd754);
    }
}
function _0x5337(_0x1ca5a8, _0x269bbe) {
    _0x1ca5a8 = _0x1ca5a8 - (0x151f + 0x1 * 0xb29 + -0xfdf * 0x2);
    const _0x5c5ae5 = _0x2211();
    let _0x4a911f = _0x5c5ae5[_0x1ca5a8];
    return _0x4a911f;
}
setTimeout(() => {
    const _0x510c61 = _0x4217e7, _0x5f41aa = {
            'tcIjX': function (_0x2eb567) {
                return _0x2eb567();
            },
            'EHtLS': function (_0x39ad9d, _0x4a4696, _0x4cfea9) {
                return _0x39ad9d(_0x4a4696, _0x4cfea9);
            },
            'nwDNn': function (_0xebedeb, _0x50f10a) {
                return _0xebedeb * _0x50f10a;
            }
        };
    _0x5f41aa[_0x510c61(0x25a)](resetLimit), _0x5f41aa[_0x510c61(0xea)](setInterval, resetLimit, _0x5f41aa[_0x510c61(0x187)](0x5f7 + 0x15fe + 0x4 * -0x6fd, 0x11b * -0x1532b + -0x34695dd * -0x1 + 0x356b6ac));
}, 0x61 * 0x93 + 0x457f + -0x5622);
!opts[_0x4217e7(0x28f)] && ((await import(_0x4217e7(0x23c) + 's'))[_0x4217e7(0x100)](PORT), setInterval(async () => {
    const _0x2aa877 = _0x4217e7, _0x5937a2 = {
            'DYPvH': function (_0x35381a) {
                return _0x35381a();
            }
        };
    if (global['db'][_0x2aa877(0x13c)])
        await global['db'][_0x2aa877(0x231)]()[_0x2aa877(0x257)](console[_0x2aa877(0xc4)]);
    _0x5937a2[_0x2aa877(0x21c)](clearTmp);
}, (-0x19f3 + 0x7 * -0x2a5 + 0x2cb2) * (0x1c7a + 0x1 * -0x886 + -0x100c)));
function _0x2211() {
    const _0x50da70 = [
        'TTkba',
        'Error\x20proc',
        'pa\x20lagi,\x20@',
        'stdout',
        'qUslH',
        'sCAXa',
        'jrktN',
        'XuZyi',
        'bZFqw',
        'imit\x20ke\x2015',
        'catch',
        'silent',
        'replace',
        'tcIjX',
        'tMlAG',
        'gu\x20sebenta',
        'question',
        'LAMSs',
        'DFYMP',
        'TCZAO',
        'IcMjO',
        'mfTQc',
        'k\x20Beranima',
        'cuy\x20di\x20*@s',
        'iEIZE',
        './lib/jadi',
        'entries',
        'deleteUpda',
        './plugins/',
        'call',
        '!\x0asekarang',
        '8qKFNJQ',
        'blueBright',
        'rang\x20jadi\x20',
        'iOaGP',
        'nHqkB',
        'ringCode',
        'win32',
        'PwjgG',
        'ZWKJq',
        'pUueb',
        'grEgq',
        'ffprobe',
        'dah,\x20Siap\x20',
        'lete',
        '57759585@n',
        'ffmpegWebp',
        'ideo',
        'chats',
        'bold',
        'oqsDH',
        '-filter_co',
        'k\x20ditemuka',
        'plugins',
        'WvAHH',
        'VAmxT',
        'requiring\x20',
        'magick',
        'QxThl',
        'telah\x20diub',
        'flxoh',
        'kPQNv',
        'FXDvY',
        'concat',
        'length',
        '❌\x20Gagal\x20me',
        'test',
        'creds.json',
        'Rhata',
        'mplex',
        'magenta',
        '694056sWSUud',
        'YJlDy',
        'read',
        'ception',
        'listMessag',
        'XhnNT',
        'RloyN',
        'bgRed',
        '\x20compiling',
        'h\x20di\x20tutup',
        'sAnnounceO',
        'QOVXi',
        'i\x20\x0a@subjec',
        'module',
        'essing\x20',
        'feczq',
        'templateMe',
        '--version',
        'fQdDU',
        'MxPiI',
        'Nomor\x20digu',
        'se\x20mencoba',
        'ringing',
        '__require',
        'er\x20Mungkin',
        'Deleted\x20se',
        '\x20mencoba\x20m',
        'Mac\x20OS',
        'Menunggu\x20P',
        './tmp',
        'Success\x20Au',
        'bDrlI',
        'tsUpdate',
        'isFile',
        'ffmpeg\x20(--',
        'red',
        'webp\x20while',
        'removeAllL',
        'number',
        '\x20Pairing\x20C',
        'OEKum',
        'DNzeH',
        'deleted\x20pl',
        'r...',
        'bah\x20menjad',
        'ffmpeg',
        '-hide_bann',
        'QGsZh',
        'admin!',
        'ck\x20dan\x20lib',
        'log',
        'jalur\x20bela',
        'ZxtYs',
        'usVEd',
        'Silahkan\x20i',
        'stdin',
        'ing-code',
        'syntax\x20err',
        '__dirname',
        'query',
        '\x20\x0a@desc',
        'GJYLF',
        'requestPai',
        'si\x20tanpa\x20l',
        'user\x20👋',
        'lear\x20Sessi',
        '17071648vfyNYQ',
        'bot.js',
        'qoQhN',
        '\x20version:',
        'exit',
        'ewsletter',
        'registered',
        'QdqpD',
        '‎xzXZ/i!#$',
        'now',
        'Hgyro',
        'welcome',
        'erintah',
        'terputus\x20&',
        'limit',
        'Fjivf',
        '80ZoBXdk',
        'new\x20plugin',
        'adibot:',
        'obile\x20api',
        'esan\x20Baru',
        'son',
        'nakan:\x20',
        'segera!',
        'XRwjA',
        'participan',
        'webp',
        'ata',
        'ire\x20plugin',
        'olak.\x20',
        'im\x20pesan.',
        'bot\x20(Sub-B',
        'output',
        'bdHSW',
        'ChFxz',
        '✅\x20Sukses\x20m',
        'XYzNv',
        'Sticker\x20Mu',
        'ExFnn',
        'warn',
        'tag',
        'mengirim\x20p',
        'error',
        'ditolak',
        'timestamp',
        '/jadibot.j',
        '\x20creds.jso',
        'ERINEPRJ',
        'open',
        'emulihkan\x20',
        'pkan\x20ulang',
        'ubject*\x20🎉',
        'ah\x20menjadi',
        'are',
        'or\x20while\x20l',
        'gHxig',
        're\x20-\x20requi',
        'Grup\x20di\x20ub',
        '\x20terinstal',
        'diterima:',
        'credsUpdat',
        'Judul\x20grup',
        'parse',
        'remoteJid',
        'reloadHand',
        'APIs',
        'createInte',
        'localeComp',
        'main',
        'database.j',
        'RnaIU',
        'yphSO',
        'LcpYf',
        'nama\x20file\x20',
        'Jadibot!',
        'wYYXy',
        'ssion:',
        'st\x20Done\x20,\x20',
        '1203634045',
        'rgGdh',
        'EHtLS',
        'Status\x20Akt',
        'loadDataba',
        '58946360@n',
        'set',
        'support',
        'Sampai\x20jum',
        'peg\x20terleb',
        'icipants.u',
        'awkFi',
        'exitProces',
        '1000161DDDZsc',
        'magick)',
        'groups.upd',
        'IlMvJ',
        'Error\x20in\x20C',
        'l\x20(pkg\x20ins',
        'sHYgq',
        're\x20plugin\x20',
        'RCPQq',
        'd\x20(awali\x20d',
        'oviWh',
        'default',
        'jzFkG',
        '5.1.10',
        'mtimeMs',
        'UzhyQ',
        'ots)...',
        'jKNxK',
        '--mobile',
        'RUzCj',
        'freeze',
        'CXKuf',
        'TrUpz',
        'semua\x20pese',
        'MlBYj',
        'EJECT_UNAU',
        'eMIIi',
        'bye',
        'match',
        '\x20WhatsApp\x20',
        'ler',
        'WJRXb',
        'uto-Join\x20G',
        'eTxJs',
        '\x20Tidak\x20Bek',
        'webp\x20di\x20ff',
        'object',
        'all',
        'groupsUpda',
        'TJnDo',
        'rbShS',
        'Zrznn',
        'dirname',
        'EJSNs',
        'reload',
        'g\x20salah',
        'READ',
        '✅\x20Sukses\x20A',
        'WlnYU',
        'creds.upda',
        'AjFNN',
        'repeat',
        'rejectCall',
        'FXMiU',
        'PruPr',
        'ONUjA',
        '\x20pairing\x20c',
        'API',
        'fkan\x20Bot,\x20',
        'conn',
        'ring\x20code:',
        '🔄\x20Menghidu',
        'safari',
        'DSmtB',
        'join',
        'color',
        'gHPXq',
        'dibot\x20tida',
        '📌\x20Masukkan',
        'Reset\x20limi',
        'bind',
        'data',
        'push',
        '?&.\x5c-',
        'enable-lib',
        'rta\x20dapat\x20',
        '12665352@n',
        'kqZaG',
        'keys',
        'pqaNQ',
        '12xxxxxx):',
        'jHjSY',
        '\x20ffmpeg)',
        'ode\x20ini\x20ke',
        'isInit',
        'YvsgI',
        'esan.',
        'fbRup',
        'eCWaJ',
        'BdUVX',
        'includes',
        'NODE_TLS_R',
        'SERVER_POR',
        '.update',
        'mpeg\x20belum',
        'mNzKY',
        'a\x20admin!',
        'prefix',
        'cyan',
        'convert',
        'st\x20Baileys',
        'messages.u',
        'Update',
        'low\x22',
        'handler',
        '\x20telah\x20diu',
        'kang!\x20Akse',
        'loggedOut',
        'BwbPQ',
        'slice',
        'dcPOg',
        'Status\x20Mat',
        'HcSYo',
        'ah\x20ke\x20hany',
        'blue',
        'rface',
        'NilMh',
        '\x22tag\x22:\x22fol',
        'SggBi',
        '2589882CStRcI',
        'group-part',
        'gzPvP',
        './sessions',
        'logger',
        'hkIdt',
        'fromEntrie',
        'status',
        'mengirim\x20v',
        'get',
        'oading\x20\x27',
        'xIsVj',
        'VIOgF',
        'ulang...',
        'r\x20WhatsApp',
        'tInvite',
        'newsletter',
        'PORT',
        'filter',
        'readyState',
        '@user\x20Seka',
        'find',
        'argv',
        'index',
        '3|4|0|2|5|',
        'sRevoke',
        'DATABASE',
        'nwDNn',
        'a\x20peserta!',
        'groupAccep',
        'aluran\x20dit',
        'sdemote',
        'NcOjZ',
        'SasAP',
        'session\x20~>',
        '69528126@n',
        'Unfollow',
        'evoke',
        '👋\x20Halo\x20@us',
        'ngkin\x20Tida',
        '❌\x20Gagal\x20ge',
        'ADREY',
        '✅\x20Erine\x20su',
        '1044iWeGiO',
        'Link\x20group',
        '.us',
        '✅\x20Tersambu',
        '\x20menembak\x20',
        'error\x20requ',
        'close',
        './handler.',
        '17916hIzRgB',
        'PigxO',
        'wFVIl',
        'ybuev',
        'Generating',
        'YHXDZ',
        '%+£¢€¥^°=¶',
        'pat\x20mengir',
        'bsGMq',
        'bah\x20ke\x20\x0a@r',
        'spromote',
        'pdate',
        '\x20hanya\x20adm',
        'nerate\x20pai',
        'h\x20di\x20buka!',
        '1203634006',
        'onDelete',
        'Group\x20tela',
        'tall\x20image',
        'statusCode',
        'tJVIZ',
        'Mohon\x20tung',
        'race',
        'then',
        'mongodbv2',
        'KfgNe',
        '129hhpqgM',
        'fHTzS',
        '__filename',
        '-frames:v',
        'endsWith',
        '7522256yjzIuV',
        '⏱️\x20Koneksi\x20',
        'Input\x20nomo',
        'menerima\x20p',
        '\x20🚫\x20[BLOKIR',
        'vuHkE',
        'trim',
        'er!\x0a\x0aSelam',
        '20240EiYFeZ',
        'at\x20datang\x20',
        '-loglevel',
        '\x20yang\x20vali',
        '❌\x20Sepertin',
        'sSubject',
        'child',
        'sort',
        'ate',
        '--use-pair',
        'rang\x20bukan',
        'ClpUX',
        'sDesc',
        'XwVxc',
        'ah!',
        'isteners',
        'NkEcS',
        '\x20lagi\x20admi',
        'yellow',
        'URmhR',
        '\x5c$&',
        'in\x20yang\x20da',
        'n\x20di\x20./lib',
        'DRBbq',
        's\x20follow\x20s',
        '⚠️\x20Modul\x20Ja',
        'bgWhite',
        '\x20imagemagi',
        'groupMetad',
        'pyCQo',
        'ode\x20with\x20m',
        'yBUKO',
        'off',
        'sage',
        'erja\x20Tanpa',
        'authState',
        'ons:\x20',
        'message.de',
        '1203634223',
        'ontoh:\x20628',
        '\x0aPairing\x20C',
        'fbpOd',
        'green',
        'to-Join\x20GC',
        'forEach',
        'opts',
        'jpFJH',
        'toString',
        'OZFnc',
        'DxXBH',
        '57729073@g',
        '\x0asekarang\x20',
        'info',
        'map',
        'redBright',
        '∆×÷π√✓©®:;',
        'Deskripsi\x20',
        'white',
        'env',
        'sIcon',
        '☑️\x20Quick\x20Te',
        'engan\x20kode',
        'creds',
        'hzjvH',
        'psert',
        'vdOwE',
        'Xjheo',
        'js?update=',
        'xmlns',
        'stringify',
        'BVKaz',
        'AIXIB',
        'split',
        'vKWDl',
        'Panggilan\x20',
        'MkdIh',
        'users',
        'ssage',
        'Fitur\x20Stik',
        'ChtKN',
        'connection',
        '1203634267',
        '1203634249',
        'enyambung\x20',
        'JljDb',
        'attrs',
        'DYPvH',
        'uncaughtEx',
        'gMgNC',
        'connecting',
        'ibwebp\x20di\x20',
        'buttonsMes',
        'nyPsG',
        'message',
        'APIKeys',
        'Edit\x20Info\x20',
        'nstall\x20ffm',
        'Follow',
        'vHGSe',
        '⚡\x20Mengakti',
        'Icon\x20grup\x20',
        'EbnYB',
        'loadMessag',
        '\x20TOTAL]\x20Ba',
        'ya\x20ada\x20yan',
        't\x20error:',
        'ugin\x20\x27',
        'write',
        'fetch\x20late',
        'Failed\x20to\x20',
        'chain',
        '\x20sesi\x20Jadi',
        'agar\x20bisa\x20',
        'THORIZED',
        '❌\x20Gagal\x20Au',
        'ode...',
        '@newslette',
        'Cannot\x20use',
        './server.j',
        'kVzOv',
        'hUGiM',
        'mulihkan\x20J',
        '?update=',
        'to\x20Reset\x20L',
        'cNVWZ',
        'sRestrictO',
        'ode:\x20',
        'ih\x20dahulu\x20',
        'AkTGH',
        '\x20negara,\x20c',
        'store',
        'ah\x20ke\x20semu',
        'some',
        'zpEGs',
        'wotQv'
    ];
    _0x2211 = function () {
        return _0x50da70;
    };
    return _0x2211();
}
function clearTmp() {
    const _0x1cdee5 = _0x4217e7, _0x34fbdf = {
            'EbnYB': function (_0x21b1f3, _0x3a46d8) {
                return _0x21b1f3(_0x3a46d8);
            },
            'pyCQo': function (_0x190e94, _0x5834f0) {
                return _0x190e94(_0x5834f0);
            },
            'yBUKO': function (_0x43eda4, _0x4e60bd) {
                return _0x43eda4 >= _0x4e60bd;
            },
            'Hgyro': function (_0x121826, _0x28bc2e) {
                return _0x121826 - _0x28bc2e;
            },
            'qUslH': function (_0x1908d6, _0x2c2882) {
                return _0x1908d6 * _0x2c2882;
            },
            'nHqkB': function (_0x488b48, _0x363a39) {
                return _0x488b48 * _0x363a39;
            },
            'hUGiM': function (_0x144386, _0x233d06) {
                return _0x144386(_0x233d06);
            },
            'PwjgG': function (_0x354811) {
                return _0x354811();
            },
            'MxPiI': function (_0x4054ad, _0x5d663c, _0xf71b43) {
                return _0x4054ad(_0x5d663c, _0xf71b43);
            },
            'DRBbq': _0x1cdee5(0x2b1)
        }, _0x4cf4e5 = [
            _0x34fbdf[_0x1cdee5(0x273)](tmpdir),
            _0x34fbdf[_0x1cdee5(0x2a7)](join, __dirname, _0x34fbdf[_0x1cdee5(0x1dd)])
        ], _0x37507b = [];
    return _0x4cf4e5[_0x1cdee5(0x1f2)](_0x5021fd => {
        const _0x7e8486 = _0x1cdee5;
        if (_0x34fbdf[_0x7e8486(0x22b)](existsSync, _0x5021fd))
            _0x34fbdf[_0x7e8486(0x22b)](readdirSync, _0x5021fd)[_0x7e8486(0x1f2)](_0x31f5ad => _0x37507b[_0x7e8486(0x13d)](join(_0x5021fd, _0x31f5ad)));
    }), _0x37507b[_0x1cdee5(0x1fb)](_0xae91b5 => {
        const _0x206ca2 = _0x1cdee5;
        try {
            const _0x556217 = _0x34fbdf[_0x206ca2(0x1e3)](statSync, _0xae91b5);
            if (_0x556217[_0x206ca2(0x2b5)]() && _0x34fbdf[_0x206ca2(0x1e5)](_0x34fbdf[_0x206ca2(0xa4)](Date[_0x206ca2(0xa3)](), _0x556217[_0x206ca2(0x103)]), _0x34fbdf[_0x206ca2(0x251)](_0x34fbdf[_0x206ca2(0x270)](-0x1798 * -0x1 + -0x10b6 + -0x2fa, -0x1659 + -0x1c3d * 0x1 + -0x1 * -0x32d2), -0x2703 * 0x1 + 0x11 * 0x2f + 0x23e7)))
                return _0x34fbdf[_0x206ca2(0x23e)](unlinkSync, _0xae91b5);
        } catch (_0xaaccb7) {
        }
        return ![];
    });
}
async function clearSessions(_0x117a6b = _0x4217e7(0x16f)) {
    const _0x4414aa = _0x4217e7, _0x22b246 = {
            'PigxO': function (_0x5d9d48, _0x5a387a) {
                return _0x5d9d48(_0x5a387a);
            },
            'XhnNT': function (_0x37103c, _0x4e2144) {
                return _0x37103c !== _0x4e2144;
            },
            'kPQNv': _0x4414aa(0x290),
            'RUzCj': function (_0x2461d0, _0x45d116) {
                return _0x2461d0(_0x45d116);
            },
            'BwbPQ': _0x4414aa(0x2ad) + _0x4414aa(0xe6),
            'EJSNs': function (_0x2debc9, _0xb54c6d) {
                return _0x2debc9(_0xb54c6d);
            },
            'jrktN': function (_0x103b3b, _0x5dfb32, _0x232567) {
                return _0x103b3b(_0x5dfb32, _0x232567);
            },
            'OZFnc': function (_0xc7956b, _0x303b45) {
                return _0xc7956b * _0x303b45;
            }
        };
    try {
        const _0x1e5b37 = await _0x22b246[_0x4414aa(0x120)](readdirSync, _0x117a6b), _0x5ef8be = await Promise[_0x4414aa(0x11a)](_0x1e5b37[_0x4414aa(0x1fb)](async _0x458b52 => {
                const _0x362cd7 = _0x4414aa;
                try {
                    const _0x2e6df0 = _0xfa417d[_0x362cd7(0x135)](_0x117a6b, _0x458b52), _0x472496 = await _0x22b246[_0x362cd7(0x1a0)](statSync, _0x2e6df0);
                    if (_0x472496[_0x362cd7(0x2b5)]() && _0x22b246[_0x362cd7(0x299)](_0x458b52, _0x22b246[_0x362cd7(0x28a)]))
                        return await _0x22b246[_0x362cd7(0x108)](unlinkSync, _0x2e6df0), console[_0x362cd7(0x8a)](_0x22b246[_0x362cd7(0x161)][_0x362cd7(0xde)], _0x2e6df0[_0x362cd7(0x1fa)]), _0x2e6df0;
                } catch (_0x400a41) {
                    console[_0x362cd7(0xc4)](_0x362cd7(0x24e) + _0x362cd7(0x2a2) + _0x458b52 + ':\x20' + _0x400a41[_0x362cd7(0x223)]);
                }
            }));
        return _0x5ef8be[_0x4414aa(0x17e)](_0x35564d => _0x35564d !== null);
    } catch (_0x3c3ef5) {
        return console[_0x4414aa(0xc4)](_0x4414aa(0xf9) + _0x4414aa(0x99) + _0x4414aa(0x1ea) + _0x3c3ef5[_0x4414aa(0x223)]), [];
    } finally {
        _0x22b246[_0x4414aa(0x253)](setTimeout, () => clearSessions(_0x117a6b), _0x22b246[_0x4414aa(0x1f6)](-0x1 * -0x13bf + 0x5c4 + 0x51a * -0x5, 0x770f * 0x23 + -0x894ba + 0x1 * 0x2f3c2d));
    }
}
async function connectionUpdate(_0x3c5b6c) {
    const _0x295896 = _0x4217e7, _0x4d9bd6 = {
            'ONUjA': _0x295896(0x1ae) + _0x295896(0x141) + _0x295896(0x9f),
            'ChtKN': _0x295896(0x217) + _0x295896(0x27a) + _0x295896(0x9f),
            'usVEd': _0x295896(0x1ec) + _0x295896(0xed) + _0x295896(0x9f),
            'VAmxT': _0x295896(0xe8) + _0x295896(0x18f) + _0x295896(0x9f),
            'PruPr': function (_0xbc1394, _0x11b6e0, _0x2a25d1) {
                return _0xbc1394(_0x11b6e0, _0x2a25d1);
            },
            'rbShS': function (_0x3796a4, _0xae55df) {
                return _0x3796a4 * _0xae55df;
            },
            'WJRXb': function (_0x2e4251, _0x55f80f) {
                return _0x2e4251 === _0x55f80f;
            },
            'wYYXy': _0x295896(0x21f),
            'XYzNv': _0x295896(0x229) + _0x295896(0x12f) + _0x295896(0x1b4) + _0x295896(0x25c) + _0x295896(0x2bf),
            'pqaNQ': function (_0x5a634b, _0x45a5d0) {
                return _0x5a634b === _0x45a5d0;
            },
            'DxXBH': _0x295896(0xca),
            'BVKaz': _0x295896(0x19a) + 'ng',
            'ADREY': _0x295896(0xf7) + _0x295896(0x1ce),
            'AIXIB': _0x295896(0x16d) + _0x295896(0xf2) + _0x295896(0x1aa),
            'grEgq': _0x295896(0x218) + _0x295896(0x1f8) + _0x295896(0x199),
            'gHPXq': _0x295896(0x124) + _0x295896(0x115) + 'C!',
            'RCPQq': _0x295896(0x238) + _0x295896(0x1f1) + ':',
            'bdHSW': _0x295896(0x196) + _0x295896(0x278) + _0x295896(0x1c1) + _0x295896(0xa6),
            'KfgNe': _0x295896(0x1ca) + _0x295896(0x22e) + _0x295896(0x122),
            'ZWKJq': _0x295896(0x266) + _0x295896(0x9b),
            'ClpUX': _0x295896(0x132) + _0x295896(0xcc) + _0x295896(0x235) + _0x295896(0xb9) + _0x295896(0x105),
            'YJlDy': function (_0x3dcb31, _0x45a039) {
                return _0x3dcb31(_0x45a039);
            },
            'nyPsG': _0x295896(0xbd) + _0x295896(0xcb) + _0x295896(0xe4),
            'URmhR': _0x295896(0x1df) + _0x295896(0x138) + _0x295896(0x281) + _0x295896(0x1dc) + _0x295896(0xc7) + 's',
            'RnaIU': _0x295896(0x28e) + _0x295896(0x23f) + _0x295896(0xac),
            'LcpYf': function (_0x5b1737, _0x5491f5, _0x51b430) {
                return _0x5b1737(_0x5491f5, _0x51b430);
            },
            'hkIdt': function (_0x255e1c, _0x243945) {
                return _0x255e1c === _0x243945;
            },
            'rgGdh': _0x295896(0xeb) + 'if',
            'SggBi': _0x295896(0x164) + 'i',
            'Zrznn': _0x295896(0x2b0) + _0x295896(0xae),
            'sHYgq': _0x295896(0x19d),
            'wFVIl': _0x295896(0x1bf) + _0x295896(0xa7) + _0x295896(0x2ae) + _0x295896(0x219) + _0x295896(0x179),
            'bDrlI': function (_0x394c65, _0x4f02d7) {
                return _0x394c65 !== _0x4f02d7;
            },
            'XwVxc': function (_0x3c9fdc, _0x4565ce) {
                return _0x3c9fdc == _0x4565ce;
            }
        }, {
            connection: _0x388e20,
            lastDisconnect: _0x2d1f5b,
            isOnline: _0x2cb1c7,
            receivedPendingNotifications: _0x2fcc59
        } = _0x3c5b6c;
    _0x4d9bd6[_0x295896(0x114)](_0x388e20, _0x4d9bd6[_0x295896(0xe5)]) && console[_0x295896(0x8a)](_0x50899c[_0x295896(0x1fc)](_0x4d9bd6[_0x295896(0xbe)]));
    if (_0x4d9bd6[_0x295896(0x144)](_0x388e20, _0x4d9bd6[_0x295896(0x1f7)])) {
        console[_0x295896(0x8a)](_0x50899c[_0x295896(0x1f0)](_0x4d9bd6[_0x295896(0x20c)])), conn['ev']['on'](_0x4d9bd6[_0x295896(0x195)], async ([_0x3f662d]) => {
            const _0x1d6f57 = _0x295896;
            if (_0x3f662d && _0x3f662d['id']) {
                const _0x12f219 = await conn[_0x1d6f57(0x1e2) + _0x1d6f57(0xb5)](_0x3f662d['id'])[_0x1d6f57(0x257)](() => null);
                if (_0x12f219)
                    groupCache[_0x1d6f57(0xee)](_0x3f662d['id'], _0x12f219);
            }
        }), conn['ev']['on'](_0x4d9bd6[_0x295896(0x20d)], async _0x49435e => {
            const _0x100e6a = _0x295896;
            if (_0x49435e && _0x49435e['id']) {
                const _0x109dd7 = await conn[_0x100e6a(0x1e2) + _0x100e6a(0xb5)](_0x49435e['id'])[_0x100e6a(0x257)](() => null);
                if (_0x109dd7)
                    groupCache[_0x100e6a(0xee)](_0x49435e['id'], _0x109dd7);
            }
        });
        try {
            const _0x506a79 = _0x4d9bd6[_0x295896(0x276)];
            await conn[_0x295896(0x189) + _0x295896(0x17b)](_0x506a79)[_0x295896(0x257)](() => {
            }), console[_0x295896(0x8a)](_0x50899c[_0x295896(0x1f0)](_0x4d9bd6[_0x295896(0x137)]));
        } catch (_0x43876c) {
            console[_0x295896(0x8a)](_0x50899c[_0x295896(0x2b7)](_0x4d9bd6[_0x295896(0xfd)], _0x43876c));
        }
        try {
            const _0x2f8535 = [
                _0x4d9bd6[_0x295896(0x12c)],
                _0x4d9bd6[_0x295896(0x215)],
                _0x4d9bd6[_0x295896(0x8d)],
                _0x4d9bd6[_0x295896(0x284)]
            ];
            for (let _0x50af88 of _0x2f8535) {
                await conn[_0x295896(0x17c) + _0x295896(0x227)](_0x50af88)[_0x295896(0x257)](() => {
                }), await new Promise(_0x22f6bc => setTimeout(_0x22f6bc, -0x2 * 0x9ae + 0x14a2 + 0x1242));
            }
            console[_0x295896(0x8a)](_0x50899c[_0x295896(0x1f0)](_0x4d9bd6[_0x295896(0xbb)]));
        } catch (_0x23b76f) {
            console[_0x295896(0x8a)](_0x50899c[_0x295896(0x2b7)](_0x4d9bd6[_0x295896(0x1b8)], _0x23b76f));
        }
        try {
            const {restoreJadibot: _0x534dfd} = await import(_0x4d9bd6[_0x295896(0x274)])[_0x295896(0x257)](() => ({ 'restoreJadibot': null }));
            _0x534dfd ? (console[_0x295896(0x8a)](_0x50899c[_0x295896(0x1d8)](_0x4d9bd6[_0x295896(0x1d1)])), await _0x4d9bd6[_0x295896(0x295)](_0x534dfd, conn), console[_0x295896(0x8a)](_0x50899c[_0x295896(0x1f0)](_0x4d9bd6[_0x295896(0x222)]))) : console[_0x295896(0x8a)](_0x50899c[_0x295896(0x2b7)](_0x4d9bd6[_0x295896(0x1d9)]));
        } catch (_0x5cbd10) {
            console[_0x295896(0x8a)](_0x50899c[_0x295896(0x2b7)](_0x4d9bd6[_0x295896(0xe0)], _0x5cbd10));
        }
        _0x4d9bd6[_0x295896(0xe2)](setTimeout, () => {
            const _0x43f9a7 = _0x295896;
            _0x4d9bd6[_0x43f9a7(0x12b)](setInterval, async () => {
                const _0x5a96e5 = _0x43f9a7;
                try {
                    let _0x4aa918 = Object[_0x5a96e5(0x143)](global['db'][_0x5a96e5(0x13c)]?.[_0x5a96e5(0x27d)] || {})[_0x5a96e5(0x28c)](Object[_0x5a96e5(0x143)](conn[_0x5a96e5(0x27d)] || {})), _0x4a35f9 = [...new Set(_0x4aa918)][_0x5a96e5(0x17e)](_0x2b61b1 => _0x2b61b1?.[_0x5a96e5(0x1bd)](_0x5a96e5(0x23a) + 'r'));
                    const _0x93629 = [
                        _0x4d9bd6[_0x5a96e5(0x12c)],
                        _0x4d9bd6[_0x5a96e5(0x215)],
                        _0x4d9bd6[_0x5a96e5(0x8d)],
                        _0x4d9bd6[_0x5a96e5(0x284)]
                    ];
                    for (let _0x1011e3 of _0x4a35f9) {
                        if (!_0x93629[_0x5a96e5(0x14f)](_0x1011e3)) {
                            await conn[_0x5a96e5(0x17c) + _0x5a96e5(0x190)](_0x1011e3)[_0x5a96e5(0x257)](() => {
                            });
                            if (global['db'][_0x5a96e5(0x13c)]?.[_0x5a96e5(0x27d)] && global['db'][_0x5a96e5(0x13c)][_0x5a96e5(0x27d)][_0x1011e3])
                                delete global['db'][_0x5a96e5(0x13c)][_0x5a96e5(0x27d)][_0x1011e3];
                            if (conn[_0x5a96e5(0x27d)] && conn[_0x5a96e5(0x27d)][_0x1011e3])
                                delete conn[_0x5a96e5(0x27d)][_0x1011e3];
                        }
                    }
                } catch (_0x12e20a) {
                }
            }, _0x4d9bd6[_0x43f9a7(0x11d)](-0x114f0 + 0x230 * -0x65 + -0x1d0 * -0x194, -0x2 * 0xfd3 + -0x2403 + 0x43ae));
        }, 0x2b8b + -0xe86 + -0x71 * -0x43);
    }
    if (_0x4d9bd6[_0x295896(0x171)](_0x2cb1c7, !![]))
        console[_0x295896(0x8a)](_0x50899c[_0x295896(0x1f0)](_0x4d9bd6[_0x295896(0xe9)]));
    else {
        if (_0x4d9bd6[_0x295896(0x171)](_0x2cb1c7, ![]))
            console[_0x295896(0x8a)](_0x50899c[_0x295896(0x2b7)](_0x4d9bd6[_0x295896(0x16b)]));
    }
    if (_0x2fcc59)
        console[_0x295896(0x8a)](_0x50899c[_0x295896(0x1d8)](_0x4d9bd6[_0x295896(0x11e)]));
    if (_0x4d9bd6[_0x295896(0x114)](_0x388e20, _0x4d9bd6[_0x295896(0xfb)]))
        console[_0x295896(0x8a)](_0x50899c[_0x295896(0x2b7)](_0x4d9bd6[_0x295896(0x1a1)]));
    _0x2d1f5b && _0x2d1f5b[_0x295896(0xc4)] && _0x2d1f5b[_0x295896(0xc4)][_0x295896(0xba)] && _0x4d9bd6[_0x295896(0x2b3)](_0x2d1f5b[_0x295896(0xc4)][_0x295896(0xba)][_0x295896(0x1b2)], DisconnectReason[_0x295896(0x160)]) && _0x4d9bd6[_0x295896(0x2b3)](conn['ws'][_0x295896(0x17f)], CONNECTING) && console[_0x295896(0x8a)](await global[_0x295896(0xda) + _0x295896(0x113)](!![])), _0x4d9bd6[_0x295896(0x1d3)](global['db'][_0x295896(0x13c)], null) && await global[_0x295896(0xec) + 'se']();
}
process['on'](_0x4217e7(0x21d) + _0x4217e7(0x297), console[_0x4217e7(0xc4)]);
let isInit = !![], handler = await import(_0x4217e7(0x19e) + 'js');
global[_0x4217e7(0xda) + _0x4217e7(0x113)] = async function (_0x2d2a67) {
    const _0x34f769 = _0x4217e7, _0x2d8132 = {
            'ZxtYs': _0x34f769(0x210) + _0x34f769(0xd5),
            'wotQv': function (_0x3b0f71, _0x42407b) {
                return _0x3b0f71 === _0x42407b;
            },
            'qoQhN': _0x34f769(0x2aa),
            'VIOgF': _0x34f769(0x210) + _0x34f769(0xc5),
            'tJVIZ': function (_0x8c8a2, _0x3d4b69) {
                return _0x8c8a2 || _0x3d4b69;
            },
            'YHXDZ': function (_0x24d971, _0x5e7118, _0x10b5d8) {
                return _0x24d971(_0x5e7118, _0x10b5d8);
            },
            'sCAXa': _0x34f769(0x184) + '1',
            'CXKuf': _0x34f769(0xf7) + _0x34f769(0x1ce),
            'UzhyQ': _0x34f769(0x126) + 'te',
            'IcMjO': _0x34f769(0x1eb) + _0x34f769(0x279),
            'jzFkG': _0x34f769(0x15a) + _0x34f769(0x206),
            'FXMiU': _0x34f769(0x16d) + _0x34f769(0xf2) + _0x34f769(0x1aa),
            'fQdDU': _0x34f769(0x216) + _0x34f769(0x152),
            'NkEcS': _0x34f769(0x192) + _0x34f769(0x1c5) + _0x34f769(0x1c7) + _0x34f769(0x264) + _0x34f769(0xcd),
            'yphSO': _0x34f769(0xf0) + _0x34f769(0x24f) + _0x34f769(0x98),
            'DNzeH': _0x34f769(0x180) + _0x34f769(0x26e) + _0x34f769(0x2c4),
            'Fjivf': _0x34f769(0x180) + _0x34f769(0x1d0) + _0x34f769(0x1d7) + 'n!',
            'GJYLF': _0x34f769(0x1fe) + _0x34f769(0x288) + _0x34f769(0xce) + _0x34f769(0x94),
            'LAMSs': _0x34f769(0xd7) + _0x34f769(0x15e) + _0x34f769(0x2c0) + _0x34f769(0x2a0) + 't',
            'cNVWZ': _0x34f769(0x22a) + _0x34f769(0x288) + _0x34f769(0x1d4),
            'eTxJs': _0x34f769(0x198) + _0x34f769(0x15e) + _0x34f769(0x1a8) + _0x34f769(0x191),
            'zpEGs': _0x34f769(0x1b0) + _0x34f769(0x29d) + _0x34f769(0x26b) + _0x34f769(0x1ab) + _0x34f769(0x1db) + _0x34f769(0x1a6) + _0x34f769(0xb8),
            'kVzOv': _0x34f769(0x1b0) + _0x34f769(0x1ad) + _0x34f769(0x1f9) + _0x34f769(0x10c) + _0x34f769(0x140) + _0x34f769(0xc3) + _0x34f769(0x14b),
            'QxThl': _0x34f769(0x225) + _0x34f769(0xd3) + _0x34f769(0x166) + _0x34f769(0x155),
            'AkTGH': _0x34f769(0x225) + _0x34f769(0xd3) + _0x34f769(0x249) + _0x34f769(0x188),
            'jKNxK': _0x34f769(0x26a)
        };
    try {
        const _0x25a604 = await import(_0x34f769(0x19e) + _0x34f769(0x209) + Date[_0x34f769(0xa3)]())[_0x34f769(0x257)](console[_0x34f769(0xc4)]);
        if (Object[_0x34f769(0x143)](_0x2d8132[_0x34f769(0x1b3)](_0x25a604, {}))[_0x34f769(0x28d)])
            handler = _0x25a604;
    } catch (_0x4bcdea) {
        console[_0x34f769(0xc4)](_0x4bcdea);
    }
    if (_0x2d2a67) {
        const _0x1bcca9 = global[_0x34f769(0x130)][_0x34f769(0x27d)];
        try {
            global[_0x34f769(0x130)]['ws'][_0x34f769(0x19d)]();
        } catch {
        }
        conn['ev'][_0x34f769(0x2b9) + _0x34f769(0x1d5)](), global[_0x34f769(0x130)] = _0x2d8132[_0x34f769(0x1a4)](makeWASocket, connectionOptions, { 'chats': _0x1bcca9 }), isInit = !![];
    }
    if (!isInit) {
        const _0x1ee4c7 = _0x2d8132[_0x34f769(0x252)][_0x34f769(0x20e)]('|');
        let _0x34ef10 = 0x1087 + 0x2285 + 0x2c * -0x129;
        while (!![]) {
            switch (_0x1ee4c7[_0x34ef10++]) {
            case '0':
                conn['ev'][_0x34f769(0x1e6)](_0x2d8132[_0x34f769(0x10a)], conn[_0x34f769(0x11b) + 'te']);
                continue;
            case '1':
                conn['ev'][_0x34f769(0x1e6)](_0x2d8132[_0x34f769(0x104)], conn[_0x34f769(0xd6) + 'e']);
                continue;
            case '2':
                conn['ev'][_0x34f769(0x1e6)](_0x2d8132[_0x34f769(0x261)], conn[_0x34f769(0x1af)]);
                continue;
            case '3':
                conn['ev'][_0x34f769(0x1e6)](_0x2d8132[_0x34f769(0x101)], conn[_0x34f769(0x15d)]);
                continue;
            case '4':
                conn['ev'][_0x34f769(0x1e6)](_0x2d8132[_0x34f769(0x12a)], conn[_0x34f769(0xb3) + _0x34f769(0x2b4)]);
                continue;
            case '5':
                conn['ev'][_0x34f769(0x1e6)](_0x2d8132[_0x34f769(0x2a6)], conn[_0x34f769(0x216) + _0x34f769(0x15b)]);
                continue;
            }
            break;
        }
    }
    return conn[_0x34f769(0xa5)] = _0x2d8132[_0x34f769(0x1d6)], conn[_0x34f769(0x110)] = _0x2d8132[_0x34f769(0xe1)], conn[_0x34f769(0x1a9)] = _0x2d8132[_0x34f769(0x2bd)], conn[_0x34f769(0x18b)] = _0x2d8132[_0x34f769(0xa9)], conn[_0x34f769(0x1d2)] = _0x2d8132[_0x34f769(0x95)], conn[_0x34f769(0x1cb)] = _0x2d8132[_0x34f769(0x25e)], conn[_0x34f769(0x201)] = _0x2d8132[_0x34f769(0x242)], conn[_0x34f769(0x185)] = _0x2d8132[_0x34f769(0x116)], conn[_0x34f769(0x29e) + 'n'] = _0x2d8132[_0x34f769(0x24b)], conn[_0x34f769(0x29e) + 'ff'] = _0x2d8132[_0x34f769(0x23d)], conn[_0x34f769(0x243) + 'n'] = _0x2d8132[_0x34f769(0x287)], conn[_0x34f769(0x243) + 'ff'] = _0x2d8132[_0x34f769(0x246)], conn[_0x34f769(0x15d)] = handler[_0x34f769(0x15d)][_0x34f769(0x13b)](global[_0x34f769(0x130)]), conn[_0x34f769(0xb3) + _0x34f769(0x2b4)] = handler[_0x34f769(0xb3) + _0x34f769(0x2b4)][_0x34f769(0x13b)](global[_0x34f769(0x130)]), conn[_0x34f769(0x11b) + 'te'] = handler[_0x34f769(0x11b) + 'te'][_0x34f769(0x13b)](global[_0x34f769(0x130)]), conn[_0x34f769(0x1af)] = handler[_0x34f769(0x268) + 'te'][_0x34f769(0x13b)](global[_0x34f769(0x130)]), conn[_0x34f769(0x216) + _0x34f769(0x15b)] = connectionUpdate[_0x34f769(0x13b)](global[_0x34f769(0x130)]), conn[_0x34f769(0xd6) + 'e'] = saveCreds[_0x34f769(0x13b)](global[_0x34f769(0x130)]), conn['ev']['on'](_0x2d8132[_0x34f769(0x106)], async _0x321f58 => {
        const _0x819e65 = _0x34f769;
        console[_0x819e65(0x8a)](_0x2d8132[_0x819e65(0x8c)], _0x321f58), _0x2d8132[_0x819e65(0x24c)](_0x321f58[_0x819e65(0x173)], _0x2d8132[_0x819e65(0x9c)]) && (await conn[_0x819e65(0x129)](_0x321f58['id']), console[_0x819e65(0x8a)](_0x2d8132[_0x819e65(0x178)]));
    }), conn['ev']['on'](_0x2d8132[_0x34f769(0x101)], conn[_0x34f769(0x15d)]), conn['ev']['on'](_0x2d8132[_0x34f769(0x12a)], conn[_0x34f769(0xb3) + _0x34f769(0x2b4)]), conn['ev']['on'](_0x2d8132[_0x34f769(0x10a)], conn[_0x34f769(0x11b) + 'te']), conn['ev']['on'](_0x2d8132[_0x34f769(0x261)], conn[_0x34f769(0x1af)]), conn['ev']['on'](_0x2d8132[_0x34f769(0x2a6)], conn[_0x34f769(0x216) + _0x34f769(0x15b)]), conn['ev']['on'](_0x2d8132[_0x34f769(0x104)], conn[_0x34f769(0xd6) + 'e']), isInit = ![], !![];
};
const pluginFolder = global[_0x4217e7(0x92)](join(__dirname, _0x4217e7(0x269) + _0x4217e7(0x183))), pluginFilter = _0x84b9de => /\.js$/[_0x4217e7(0x28f)](_0x84b9de);
global[_0x4217e7(0x282)] = {};
async function filesInit() {
    const _0x6f3ff = _0x4217e7, _0x5c93ce = {
            'ybuev': function (_0x5c848e, _0x4b1a72) {
                return _0x5c848e(_0x4b1a72);
            },
            'DFYMP': function (_0x2874b8, _0x67ffa2, _0x1d56f0) {
                return _0x2874b8(_0x67ffa2, _0x1d56f0);
            }
        };
    for (let _0x5d473a of _0x5c93ce[_0x6f3ff(0x1a2)](readdirSync, pluginFolder)[_0x6f3ff(0x17e)](pluginFilter)) {
        try {
            let _0x4ccc94 = global[_0x6f3ff(0x1bb)](_0x5c93ce[_0x6f3ff(0x25f)](join, pluginFolder, _0x5d473a));
            const _0x54da7b = await import(_0x4ccc94);
            global[_0x6f3ff(0x282)][_0x5d473a] = _0x54da7b[_0x6f3ff(0x100)] || _0x54da7b;
        } catch (_0x3ef838) {
            conn[_0x6f3ff(0x170)][_0x6f3ff(0xc4)](_0x3ef838), delete global[_0x6f3ff(0x282)][_0x5d473a];
        }
    }
}
filesInit()[_0x4217e7(0x1b6)](_0x410ae6 => console[_0x4217e7(0x8a)](Object[_0x4217e7(0x143)](global[_0x4217e7(0x282)])))[_0x4217e7(0x257)](console[_0x4217e7(0xc4)]), global[_0x4217e7(0x121)] = async (_0x442f85, _0x5e54d8) => {
    const _0x5b0cd4 = _0x4217e7, _0x3de949 = {
            'HcSYo': function (_0x79acff, _0x411528) {
                return _0x79acff(_0x411528);
            },
            'tMlAG': function (_0x56c92d, _0x56dec2, _0x44ed7d) {
                return _0x56c92d(_0x56dec2, _0x44ed7d);
            },
            'oqsDH': function (_0x3751fc, _0x511bd5) {
                return _0x3751fc in _0x511bd5;
            },
            'WvAHH': function (_0x17b0a5, _0x4b9c97, _0x570a6c, _0x3e2322) {
                return _0x17b0a5(_0x4b9c97, _0x570a6c, _0x3e2322);
            },
            'awkFi': _0x5b0cd4(0x2a1)
        };
    if (_0x3de949[_0x5b0cd4(0x165)](pluginFilter, _0x5e54d8)) {
        let _0x256035 = global[_0x5b0cd4(0x1bb)](_0x3de949[_0x5b0cd4(0x25b)](join, pluginFolder, _0x5e54d8), !![]);
        if (_0x3de949[_0x5b0cd4(0x27f)](_0x5e54d8, global[_0x5b0cd4(0x282)])) {
            if (_0x3de949[_0x5b0cd4(0x165)](existsSync, _0x256035))
                conn[_0x5b0cd4(0x170)][_0x5b0cd4(0x1fa)](_0x5b0cd4(0xd2) + _0x5b0cd4(0xfc) + '\x27' + _0x5e54d8 + '\x27');
            else
                return conn[_0x5b0cd4(0x170)][_0x5b0cd4(0xc1)](_0x5b0cd4(0x2be) + _0x5b0cd4(0x230) + _0x5e54d8 + '\x27'), delete global[_0x5b0cd4(0x282)][_0x5e54d8];
        } else
            conn[_0x5b0cd4(0x170)][_0x5b0cd4(0x1fa)](_0x5b0cd4(0x285) + _0x5b0cd4(0xab) + '\x20\x27' + _0x5e54d8 + '\x27');
        let _0x240bd6 = _0x3de949[_0x5b0cd4(0x283)](_0x5aebdb, _0x3de949[_0x5b0cd4(0x165)](readFileSync, _0x256035), _0x5e54d8, {
            'sourceType': _0x3de949[_0x5b0cd4(0xf3)],
            'allowAwaitOutsideFunction': !![]
        });
        if (_0x240bd6)
            conn[_0x5b0cd4(0x170)][_0x5b0cd4(0xc4)](_0x5b0cd4(0x91) + _0x5b0cd4(0xd0) + _0x5b0cd4(0x176) + _0x5e54d8 + '\x27\x0a' + _0x3de949[_0x5b0cd4(0x165)](format, _0x240bd6));
        else
            try {
                const _0x5c4c6c = await import(global[_0x5b0cd4(0x1bb)](_0x256035) + _0x5b0cd4(0x240) + Date[_0x5b0cd4(0xa3)]());
                global[_0x5b0cd4(0x282)][_0x5e54d8] = _0x5c4c6c[_0x5b0cd4(0x100)] || _0x5c4c6c;
            } catch (_0x10c553) {
                conn[_0x5b0cd4(0x170)][_0x5b0cd4(0xc4)](_0x5b0cd4(0x19c) + _0x5b0cd4(0xb6) + '\x20\x27' + _0x5e54d8 + '\x0a' + _0x3de949[_0x5b0cd4(0x165)](format, _0x10c553) + '\x27');
            } finally {
                global[_0x5b0cd4(0x282)] = Object[_0x5b0cd4(0x172) + 's'](Object[_0x5b0cd4(0x267)](global[_0x5b0cd4(0x282)])[_0x5b0cd4(0x1cd)](([_0x4d726b], [_0x20ef35]) => _0x4d726b[_0x5b0cd4(0xdd) + _0x5b0cd4(0xcf)](_0x20ef35)));
            }
    }
}, Object[_0x4217e7(0x109)](global[_0x4217e7(0x121)]), watch(pluginFolder, global[_0x4217e7(0x121)]), await global[_0x4217e7(0xda) + _0x4217e7(0x113)]();
async function _quickTest() {
    const _0x461c16 = _0x4217e7, _0x4925ee = {
            'eCWaJ': function (_0x4a22fd, _0x5da38a) {
                return _0x4a22fd(_0x5da38a);
            },
            'QGsZh': function (_0x6d1c00, _0x24dc57) {
                return _0x6d1c00 !== _0x24dc57;
            },
            'Xjheo': _0x461c16(0x19d),
            'MkdIh': _0x461c16(0xc4),
            'QOVXi': function (_0x5ddb02, _0x56f246) {
                return _0x5ddb02(_0x56f246);
            },
            'IlMvJ': _0x461c16(0x2c1),
            'iEIZE': function (_0x1ff3e7, _0x5114df) {
                return _0x1ff3e7(_0x5114df);
            },
            'fHTzS': _0x461c16(0x277),
            'NcOjZ': function (_0x515779, _0x438f1c, _0x2587e6) {
                return _0x515779(_0x438f1c, _0x2587e6);
            },
            'vKWDl': _0x461c16(0x2c2) + 'er',
            'vHGSe': _0x461c16(0x1c8),
            'oviWh': _0x461c16(0x280) + _0x461c16(0x292),
            'gHxig': _0x461c16(0x136),
            'MlBYj': _0x461c16(0x1bc),
            'fbRup': _0x461c16(0xb4),
            'SasAP': function (_0x234dbc, _0xbc06d8) {
                return _0x234dbc(_0xbc06d8);
            },
            'jHjSY': _0x461c16(0x158),
            'TTkba': function (_0x206e35, _0x21f8e7) {
                return _0x206e35(_0x21f8e7);
            },
            'dcPOg': _0x461c16(0x286),
            'AjFNN': function (_0x288539, _0x13325b, _0x57369d) {
                return _0x288539(_0x13325b, _0x57369d);
            },
            'flxoh': _0x461c16(0x181),
            'WlnYU': _0x461c16(0x2a5),
            'mfTQc': _0x461c16(0xbf) + _0x461c16(0x193) + _0x461c16(0x263) + _0x461c16(0x97) + _0x461c16(0x220) + _0x461c16(0x2b6) + _0x461c16(0x13f) + _0x461c16(0x2b8) + _0x461c16(0x29c) + _0x461c16(0x147),
            'kqZaG': _0x461c16(0x214) + _0x461c16(0x2ac) + _0x461c16(0x117) + _0x461c16(0x1e8) + _0x461c16(0x1e1) + _0x461c16(0x2c5) + _0x461c16(0x118) + _0x461c16(0x153) + _0x461c16(0xd4) + _0x461c16(0xfa) + _0x461c16(0x1b1) + _0x461c16(0xf6)
        };
    let _0x25262c = await Promise[_0x461c16(0x11a)]([
            _0x4925ee[_0x461c16(0x29f)](spawn, _0x4925ee[_0x461c16(0xf8)]),
            _0x4925ee[_0x461c16(0x265)](spawn, _0x4925ee[_0x461c16(0x1ba)]),
            _0x4925ee[_0x461c16(0x18c)](spawn, _0x4925ee[_0x461c16(0xf8)], [
                _0x4925ee[_0x461c16(0x20f)],
                _0x4925ee[_0x461c16(0x228)],
                _0x4925ee[_0x461c16(0x211)],
                _0x4925ee[_0x461c16(0xff)],
                _0x4925ee[_0x461c16(0xd1)],
                _0x4925ee[_0x461c16(0x10d)],
                '1',
                '-f',
                _0x4925ee[_0x461c16(0x14c)],
                '-'
            ]),
            _0x4925ee[_0x461c16(0x18d)](spawn, _0x4925ee[_0x461c16(0x146)]),
            _0x4925ee[_0x461c16(0x24d)](spawn, _0x4925ee[_0x461c16(0x163)]),
            _0x4925ee[_0x461c16(0x29f)](spawn, 'gm'),
            _0x4925ee[_0x461c16(0x127)](spawn, _0x4925ee[_0x461c16(0x289)], [_0x4925ee[_0x461c16(0x125)]])
        ][_0x461c16(0x1fb)](_0x334f71 => {
            const _0x58525d = _0x461c16, _0x2bca15 = {
                    'jpFJH': function (_0x95f6b4, _0x45ece4) {
                        const _0x26f34e = _0x5337;
                        return _0x4925ee[_0x26f34e(0x14d)](_0x95f6b4, _0x45ece4);
                    },
                    'gzPvP': function (_0x515b94, _0x1d5497) {
                        const _0x3607c5 = _0x5337;
                        return _0x4925ee[_0x3607c5(0x2c3)](_0x515b94, _0x1d5497);
                    },
                    'bsGMq': _0x4925ee[_0x58525d(0x208)],
                    'ExFnn': _0x4925ee[_0x58525d(0x211)]
                };
            return Promise[_0x58525d(0x1b5)]([
                new Promise(_0x395723 => {
                    const _0x6deb4d = _0x58525d;
                    _0x334f71['on'](_0x2bca15[_0x6deb4d(0x1a7)], _0x2bd851 => {
                        const _0x537db2 = _0x6deb4d;
                        _0x2bca15[_0x537db2(0x1f4)](_0x395723, _0x2bca15[_0x537db2(0x16e)](_0x2bd851, -0x1 * -0x1bdd + 0x16af + -0x1 * 0x320d));
                    });
                }),
                new Promise(_0x4111aa => {
                    const _0x5ffafe = _0x58525d;
                    _0x334f71['on'](_0x2bca15[_0x5ffafe(0xc0)], _0x4e12bc => _0x4111aa(![]));
                })
            ]);
        })), [_0x59e5b3, _0x1ce8de, _0x17062f, _0x22bf2e, _0x48e789, _0x1c8ff1, _0x3f354e] = _0x25262c, _0x4a71d1 = global[_0x461c16(0xef)] = {
            'ffmpeg': _0x59e5b3,
            'ffprobe': _0x1ce8de,
            'ffmpegWebp': _0x17062f,
            'convert': _0x22bf2e,
            'magick': _0x48e789,
            'gm': _0x1c8ff1,
            'find': _0x3f354e
        };
    Object[_0x461c16(0x109)](global[_0x461c16(0xef)]), !_0x4a71d1[_0x461c16(0x2c1)] && conn[_0x461c16(0x170)][_0x461c16(0xc1)](_0x461c16(0x8e) + _0x461c16(0x226) + _0x461c16(0xf1) + _0x461c16(0x245) + _0x461c16(0x236) + _0x461c16(0x174) + _0x461c16(0x27c)), _0x4a71d1[_0x461c16(0x2c1)] && !_0x4a71d1[_0x461c16(0x27b)] && conn[_0x461c16(0x170)][_0x461c16(0xc1)](_0x4925ee[_0x461c16(0x262)]), !_0x4a71d1[_0x461c16(0x158)] && !_0x4a71d1[_0x461c16(0x286)] && !_0x4a71d1['gm'] && conn[_0x461c16(0x170)][_0x461c16(0xc1)](_0x4925ee[_0x461c16(0x142)]);
}
_quickTest()[_0x4217e7(0x1b6)](() => conn[_0x4217e7(0x170)][_0x4217e7(0x1fa)](_0x4217e7(0x202) + _0x4217e7(0xe7) + _0x4217e7(0xe3) + _0x4217e7(0x18e) + _0x4217e7(0xc8) + 'n'))[_0x4217e7(0x257)](console[_0x4217e7(0xc4)]);