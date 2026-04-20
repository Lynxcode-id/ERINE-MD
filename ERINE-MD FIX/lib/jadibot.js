const _0x57527b = _0x5ce8;
function _0x5ce8(_0x3d568a, _0x5d270e) {
    _0x3d568a = _0x3d568a - (0x1849 * 0x1 + 0x204f + -0x1 * 0x3717);
    const _0x475d8b = _0x40f7();
    let _0x365de3 = _0x475d8b[_0x3d568a];
    return _0x365de3;
}
(function (_0x595b12, _0x2ced2c) {
    const _0x44c8ec = _0x5ce8, _0x13ddb6 = _0x595b12();
    while (!![]) {
        try {
            const _0x22f388 = -parseInt(_0x44c8ec(0x1b4)) / (-0x1ec3 + 0x1a * 0x67 + 0x144e) * (-parseInt(_0x44c8ec(0x192)) / (-0x226c * 0x1 + 0xf0f + -0x135f * -0x1)) + -parseInt(_0x44c8ec(0x1ec)) / (0x1b31 + 0x1a2b + -0x3559) * (parseInt(_0x44c8ec(0x1e9)) / (-0x3a * 0x77 + -0x25b5 + 0x40af)) + -parseInt(_0x44c8ec(0x1f9)) / (-0xb44 + 0x1b73 * -0x1 + 0x26bc) * (parseInt(_0x44c8ec(0x1da)) / (0x15d * -0x10 + -0xa9f * -0x2 + 0x98)) + parseInt(_0x44c8ec(0x23d)) / (0x78d + 0x741 + -0xec7) * (-parseInt(_0x44c8ec(0x1f6)) / (0x1f4 + 0x2fc * -0x1 + -0x22 * -0x8)) + parseInt(_0x44c8ec(0x1a9)) / (0x1e91 + -0x11 * -0x18f + -0x3907) * (parseInt(_0x44c8ec(0x210)) / (0x8 * 0xa4 + 0x569 * -0x2 + 0x5bc)) + -parseInt(_0x44c8ec(0x18f)) / (0xfee + -0x11b * -0x8 + -0x18bb) * (parseInt(_0x44c8ec(0x20a)) / (0x16ca * 0x1 + -0x4 * -0x13d + -0xdd9 * 0x2)) + parseInt(_0x44c8ec(0x244)) / (-0x2c * -0x85 + 0x15 * 0xc1 + -0x26a4);
            if (_0x22f388 === _0x2ced2c)
                break;
            else
                _0x13ddb6['push'](_0x13ddb6['shift']());
        } catch (_0x3baaef) {
            _0x13ddb6['push'](_0x13ddb6['shift']());
        }
    }
}(_0x40f7, 0x94ddc + -0x84141 + 0x3f1fb));
import _0x3011c0 from 'path';
import _0x4340c4 from 'fs';
import _0x2f9756 from 'pino';
import { makeWASocket } from '../lib/simple.js';
import _0x165573 from '@wishkeysocket/baileys';
const {fetchLatestBaileysVersion, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, jidNormalizedUser, makeInMemoryStore} = _0x165573, delay = _0xc747fd => new Promise(_0x560a50 => setTimeout(_0x560a50, _0xc747fd)), ROOT = _0x3011c0[_0x57527b(0x1b0)](process[_0x57527b(0x1a5)](), _0x57527b(0x1d4), _0x57527b(0x1ab)), sessions = global[_0x57527b(0x233) + _0x57527b(0x194)] ??= new Map(), reconnect = new Map();
if (!_0x4340c4[_0x57527b(0x187)](ROOT))
    _0x4340c4[_0x57527b(0x195)](ROOT, { 'recursive': !![] });
function getJid(_0x1356e0) {
    const _0x311da9 = _0x57527b;
    return _0x1356e0 ? _0x1356e0[_0x311da9(0x1e1)]('@')[0x36b + 0xf * -0x1d6 + 0x1 * 0x181f] : '';
}
function getPath(_0x2611f7) {
    const _0x39f315 = _0x57527b, _0x47163d = {
            'swXyT': function (_0x2a54d7, _0x1ae4f5) {
                return _0x2a54d7(_0x1ae4f5);
            }
        };
    return _0x3011c0[_0x39f315(0x1b0)](ROOT, _0x47163d[_0x39f315(0x19a)](getJid, _0x2611f7));
}
export function isActive(_0x3ff302) {
    const _0x364616 = _0x57527b, _0x5022fa = {
            'huaHy': function (_0x336bea, _0x30a217) {
                return _0x336bea(_0x30a217);
            }
        };
    return sessions[_0x364616(0x21d)](_0x5022fa[_0x364616(0x205)](getJid, _0x3ff302));
}
export async function startJadibot(_0x3aef8e, _0x86e7d4, _0x533c3d, _0x3733bf = ![]) {
    const _0x1c0392 = _0x57527b, _0x19d5b4 = {
            'dVLvW': _0x1c0392(0x203) + _0x1c0392(0x1b5) + _0x1c0392(0x18e),
            'PTCVB': _0x1c0392(0x218) + _0x1c0392(0x23e) + _0x1c0392(0x1cd),
            'VYnvX': _0x1c0392(0x1e6),
            'cFWPg': function (_0x32328a, _0x4af67a) {
                return _0x32328a(_0x4af67a);
            },
            'arTFh': function (_0x5a85f4, _0x2ae302) {
                return _0x5a85f4 === _0x2ae302;
            },
            'gTQxw': _0x1c0392(0x1b1),
            'OlgXz': function (_0x508b66, _0x40a96f) {
                return _0x508b66(_0x40a96f);
            },
            'ImMWz': _0x1c0392(0x1fd) + _0x1c0392(0x1df) + _0x1c0392(0x1e3),
            'VCMcN': function (_0x1edf05, _0x154c41) {
                return _0x1edf05 === _0x154c41;
            },
            'WsnDV': _0x1c0392(0x1ac),
            'GVYfD': function (_0x1afae, _0x29e271) {
                return _0x1afae(_0x29e271);
            },
            'WYjYI': function (_0x39305b, _0x4fda3f) {
                return _0x39305b === _0x4fda3f;
            },
            'QIrXI': function (_0x368259, _0x3cedac) {
                return _0x368259 < _0x3cedac;
            },
            'Llksa': function (_0x4bdd2c, _0x3f67f) {
                return _0x4bdd2c + _0x3f67f;
            },
            'blsQT': function (_0x287caf, _0x5c8823, _0x570078) {
                return _0x287caf(_0x5c8823, _0x570078);
            },
            'GyvPv': _0x1c0392(0x196) + _0x1c0392(0x1f7) + _0x1c0392(0x240) + _0x1c0392(0x1bc),
            'GBWXL': _0x1c0392(0x1d8) + _0x1c0392(0x1f8) + _0x1c0392(0x1c7),
            'JEAgS': function (_0x45f2cf, _0x432ba6) {
                return _0x45f2cf !== _0x432ba6;
            },
            'EjFdR': _0x1c0392(0x202),
            'tOvpW': _0x1c0392(0x204) + _0x1c0392(0x1e5) + _0x1c0392(0x1bc),
            'KviYA': function (_0x21b596, _0x278a93) {
                return _0x21b596(_0x278a93);
            },
            'gEeth': _0x1c0392(0x1cc) + _0x1c0392(0x236) + _0x1c0392(0x1b8),
            'VNGOL': function (_0xbb03c9, _0x1f627a) {
                return _0xbb03c9(_0x1f627a);
            },
            'DkGjn': function (_0x37af38) {
                return _0x37af38();
            },
            'zmBwF': _0x1c0392(0x209),
            'ndQoE': _0x1c0392(0x222),
            'SQCKX': function (_0xc8ce53, _0x3caa42) {
                return _0xc8ce53(_0x3caa42);
            },
            'VqtJF': function (_0x7348ee, _0x599022) {
                return _0x7348ee(_0x599022);
            },
            'FplQF': _0x1c0392(0x23c),
            'YrGYg': _0x1c0392(0x22e),
            'pEOMw': _0x1c0392(0x1f5),
            'luBKu': _0x1c0392(0x230) + _0x1c0392(0x21c) + 'n',
            'bsyyo': function (_0x479d2f, _0x416d92) {
                return _0x479d2f * _0x416d92;
            },
            'qYKTp': function (_0x45ada8, _0x109027) {
                return _0x45ada8(_0x109027);
            },
            'iZGIK': function (_0x1b60ed, _0x323ad4) {
                return _0x1b60ed + _0x323ad4;
            },
            'YFDod': _0x1c0392(0x1ea) + 'te',
            'tjqTq': _0x1c0392(0x18a) + _0x1c0392(0x239),
            'PYIps': _0x1c0392(0x20c) + _0x1c0392(0x1d2) + _0x1c0392(0x1f2),
            'Uzyrs': _0x1c0392(0x234) + _0x1c0392(0x23a),
            'tkHYq': _0x1c0392(0x1c0) + _0x1c0392(0x1e2)
        }, _0x382aed = _0x19d5b4[_0x1c0392(0x1d5)](getJid, _0x533c3d);
    if (sessions[_0x1c0392(0x21d)](_0x382aed) && !_0x3733bf)
        throw _0x19d5b4[_0x1c0392(0x1a0)];
    const _0x4b0c15 = _0x19d5b4[_0x1c0392(0x1fa)](getPath, _0x533c3d);
    if (!_0x4340c4[_0x1c0392(0x187)](_0x4b0c15))
        _0x4340c4[_0x1c0392(0x195)](_0x4b0c15, { 'recursive': !![] });
    const {
            state: _0x49b399,
            saveCreds: _0x48e08e
        } = await _0x19d5b4[_0x1c0392(0x18b)](useMultiFileAuthState, _0x4b0c15), {version: _0x5ab40f} = await _0x19d5b4[_0x1c0392(0x227)](fetchLatestBaileysVersion), _0x46a856 = _0x19d5b4[_0x1c0392(0x1ff)](makeInMemoryStore, {
            'logger': _0x19d5b4[_0x1c0392(0x227)](_0x2f9756)[_0x1c0392(0x245)]({
                'level': _0x19d5b4[_0x1c0392(0x1cb)],
                'stream': _0x19d5b4[_0x1c0392(0x1cf)]
            })
        }), _0x12c933 = _0x19d5b4[_0x1c0392(0x225)](makeWASocket, {
            'version': _0x5ab40f,
            'logger': _0x19d5b4[_0x1c0392(0x185)](_0x2f9756, { 'level': _0x19d5b4[_0x1c0392(0x1cb)] }),
            'printQRInTerminal': ![],
            'browser': [
                _0x19d5b4[_0x1c0392(0x206)],
                _0x19d5b4[_0x1c0392(0x1f4)],
                _0x19d5b4[_0x1c0392(0x1ad)]
            ],
            'markOnlineOnConnect': !![],
            'auth': {
                'creds': _0x49b399[_0x1c0392(0x1eb)],
                'keys': _0x19d5b4[_0x1c0392(0x220)](makeCacheableSignalKeyStore, _0x49b399[_0x1c0392(0x1dc)], _0x19d5b4[_0x1c0392(0x1c4)](_0x2f9756, { 'level': _0x19d5b4[_0x1c0392(0x1cb)] }))
            },
            'patchMessageBeforeSending': _0x5598c0 => {
                const _0x422e0a = _0x1c0392, _0x4b48c3 = !!(_0x5598c0[_0x422e0a(0x1d3) + _0x422e0a(0x18e)] || _0x5598c0[_0x422e0a(0x1f1) + _0x422e0a(0x1de)] || _0x5598c0[_0x422e0a(0x208) + 'e'] || _0x5598c0[_0x422e0a(0x241) + _0x422e0a(0x190)]);
                return _0x4b48c3 && (_0x5598c0 = {
                    'viewOnceMessage': {
                        'message': {
                            'messageContextInfo': {
                                'deviceListMetadataVersion': 0x2,
                                'deviceListMetadata': {}
                            },
                            ..._0x5598c0
                        }
                    }
                }), _0x5598c0;
            },
            'getMessage': async _0x55fca3 => {
                const _0x562c8b = _0x1c0392;
                if (_0x46a856) {
                    const _0x31867e = await _0x46a856[_0x562c8b(0x184) + 'e'](_0x55fca3[_0x562c8b(0x1f3)], _0x55fca3['id']);
                    return _0x31867e?.[_0x562c8b(0x19d)] || undefined;
                }
                return { 'conversation': _0x19d5b4[_0x562c8b(0x228)] };
            }
        });
    _0x46a856[_0x1c0392(0x235)](_0x12c933['ev']), _0x12c933[_0x1c0392(0x1bf)] = !![], _0x12c933[_0x1c0392(0x229)] = !![], _0x12c933[_0x1c0392(0x19b)] = ![];
    const _0x33a4e5 = _0x3011c0[_0x1c0392(0x1b0)](_0x4b0c15, _0x19d5b4[_0x1c0392(0x1fc)]);
    if (!_0x4340c4[_0x1c0392(0x187)](_0x33a4e5)) {
        const _0x47357a = {
            'users': {},
            'chats': {},
            'settings': {},
            'msgs': {},
            'sticker': {},
            'game': {}
        };
        _0x4340c4[_0x1c0392(0x21b) + _0x1c0392(0x19f)](_0x33a4e5, JSON[_0x1c0392(0x1ae)](_0x47357a, null, -0x3 * -0x6bc + 0xeb * 0x13 + 0xeb * -0x29));
    }
    _0x12c933['db'] = {
        'data': JSON[_0x1c0392(0x224)](_0x4340c4[_0x1c0392(0x21e) + 'nc'](_0x33a4e5)),
        'write': async () => {
            const _0x3fdc30 = _0x1c0392;
            try {
                await _0x4340c4[_0x3fdc30(0x1ee)][_0x3fdc30(0x22f)](_0x33a4e5, JSON[_0x3fdc30(0x1ae)](_0x12c933['db'][_0x3fdc30(0x1bb)], null, 0x2058 + -0x3 * 0x5d4 + -0xeda * 0x1));
            } catch (_0x4b0e18) {
                console[_0x3fdc30(0x242)](_0x19d5b4[_0x3fdc30(0x18c)], _0x4b0e18);
            }
        }
    };
    const _0x550905 = _0x19d5b4[_0x1c0392(0x220)](setInterval, async () => {
        const _0x505d49 = _0x1c0392;
        if (sessions[_0x505d49(0x21d)](_0x382aed) && _0x12c933['db']) {
            await _0x12c933['db'][_0x505d49(0x197)]();
            try {
                await _0x12c933[_0x505d49(0x20d) + _0x505d49(0x198)](_0x19d5b4[_0x505d49(0x22a)]);
            } catch (_0x339fdb) {
            }
        } else
            _0x19d5b4[_0x505d49(0x1c4)](clearInterval, _0x550905);
    }, _0x19d5b4[_0x1c0392(0x1b2)](0x1 * 0xb05 + 0xaf * 0x2f + 0x727 * -0x6, 0x9d * 0xe + 0x1e8f + -0x233d));
    if (!_0x49b399[_0x1c0392(0x1eb)][_0x1c0392(0x1c9)] && !_0x3733bf) {
        if (_0x12c933[_0x1c0392(0x1db) + _0x1c0392(0x21f)]) {
            await _0x19d5b4[_0x1c0392(0x189)](delay, 0x22c * -0x2 + 0x2069 * 0x1 + -0x3 * 0x573);
            const _0x4c616b = await _0x12c933[_0x1c0392(0x1db) + _0x1c0392(0x21f)](_0x382aed), _0x5b37a6 = _0x4c616b?.[_0x1c0392(0x219)](/.{1,4}/g)?.[_0x1c0392(0x1b0)]('-') || _0x4c616b;
            await _0x3aef8e[_0x1c0392(0x188) + 'e'](_0x86e7d4[_0x1c0392(0x1d9)], { 'text': _0x19d5b4[_0x1c0392(0x1b9)](_0x19d5b4[_0x1c0392(0x226)](_0x19d5b4[_0x1c0392(0x1b9)](_0x1c0392(0x232) + _0x1c0392(0x214) + _0x1c0392(0x201), _0x1c0392(0x1ce) + _0x1c0392(0x217) + _0x1c0392(0x1a4) + _0x1c0392(0x22d) + _0x1c0392(0x1ba) + _0x1c0392(0x183) + _0x1c0392(0x1e8) + _0x1c0392(0x1c3) + _0x1c0392(0x213)), _0x1c0392(0x193) + _0x5b37a6 + _0x1c0392(0x1d7)), _0x1c0392(0x1be) + _0x1c0392(0x19c) + _0x1c0392(0x1a6) + _0x1c0392(0x200) + _0x1c0392(0x1fe)) }, { 'quoted': _0x86e7d4 });
        }
    }
    _0x12c933['ev']['on'](_0x19d5b4[_0x1c0392(0x237)], _0x48e08e), _0x12c933['ev']['on'](_0x19d5b4[_0x1c0392(0x1b3)], async ({
        connection: _0x3fa233,
        lastDisconnect: _0x3c9505
    }) => {
        const _0x35e10b = _0x1c0392;
        if (_0x19d5b4[_0x35e10b(0x238)](_0x3fa233, _0x19d5b4[_0x35e10b(0x231)])) {
            sessions[_0x35e10b(0x212)](_0x382aed, _0x12c933);
            const _0x399047 = _0x19d5b4[_0x35e10b(0x1fa)](jidNormalizedUser, _0x12c933[_0x35e10b(0x21a)]['id']);
            try {
                await _0x12c933[_0x35e10b(0x20d) + _0x35e10b(0x198)](_0x19d5b4[_0x35e10b(0x22a)]);
            } catch (_0x2706be) {
            }
            !_0x3733bf && _0x86e7d4?.[_0x35e10b(0x1d9)] && await _0x3aef8e[_0x35e10b(0x188) + 'e'](_0x86e7d4[_0x35e10b(0x1d9)], {
                'text': _0x35e10b(0x1b6) + _0x35e10b(0x215) + _0x35e10b(0x23f) + _0x35e10b(0x1aa) + _0x382aed + _0x35e10b(0x20f) + _0x399047,
                'mentions': [_0x533c3d]
            }, { 'quoted': _0x86e7d4 });
            const _0x567ccb = _0x19d5b4[_0x35e10b(0x1a8)];
            await _0x12c933[_0x35e10b(0x188) + 'e'](_0x567ccb, { 'text': _0x35e10b(0x1c1) + _0x35e10b(0x20b) + _0x35e10b(0x1f0) + _0x382aed + (_0x35e10b(0x22c) + _0x35e10b(0x223) + _0x35e10b(0x1d1) + _0x35e10b(0x1c8) + _0x35e10b(0x246)) }, { 'mentions': [_0x533c3d] });
        }
        if (_0x19d5b4[_0x35e10b(0x1c6)](_0x3fa233, _0x19d5b4[_0x35e10b(0x1ca)])) {
            const _0x309b41 = _0x3c9505?.[_0x35e10b(0x242)]?.[_0x35e10b(0x181)]?.[_0x35e10b(0x1a1)];
            sessions[_0x35e10b(0x199)](_0x382aed), _0x19d5b4[_0x35e10b(0x1ff)](clearInterval, _0x550905);
            if (_0x19d5b4[_0x35e10b(0x1dd)](_0x309b41, DisconnectReason[_0x35e10b(0x186)])) {
                _0x4340c4[_0x35e10b(0x1a2)](_0x4b0c15, {
                    'recursive': !![],
                    'force': !![]
                }), reconnect[_0x35e10b(0x199)](_0x382aed);
                return;
            }
            const _0xcd917c = reconnect[_0x35e10b(0x1e0)](_0x382aed) || 0x138f * 0x1 + -0x2 * 0x122b + 0x35b * 0x5;
            _0x19d5b4[_0x35e10b(0x1e7)](_0xcd917c, 0x244 * -0x4 + -0x6 * 0x503 + 0x2725) ? (reconnect[_0x35e10b(0x212)](_0x382aed, _0x19d5b4[_0x35e10b(0x1b9)](_0xcd917c, 0x29 * -0x29 + -0x1 * 0x2ed + 0x1 * 0x97f)), _0x19d5b4[_0x35e10b(0x220)](setTimeout, () => startJadibot(_0x3aef8e, _0x86e7d4, _0x533c3d, !![]), -0x4b69 * 0x1 + -0x45eb * -0x1 + 0x2c8e)) : reconnect[_0x35e10b(0x199)](_0x382aed);
        }
    }), _0x12c933['ev']['on'](_0x19d5b4[_0x1c0392(0x1a7)], async _0x4bc2b4 => {
        const _0x51b4e3 = _0x1c0392;
        try {
            const {handler: _0x2fbed8} = await import(_0x51b4e3(0x221) + _0x51b4e3(0x211) + '=' + Date[_0x51b4e3(0x19e)]());
            _0x2fbed8[_0x51b4e3(0x18d) + _0x51b4e3(0x191)] && await _0x2fbed8[_0x51b4e3(0x18d) + _0x51b4e3(0x191)][_0x51b4e3(0x1d0)](_0x12c933, _0x4bc2b4, { 'sessions': sessions });
        } catch (_0x1459b0) {
            console[_0x51b4e3(0x242)](_0x19d5b4[_0x51b4e3(0x216)], _0x1459b0);
        }
    }), _0x12c933['ev']['on'](_0x19d5b4[_0x1c0392(0x1c5)], async _0x1ab36c => {
        const _0x446542 = _0x1c0392;
        try {
            const {handler: _0x11d2ce} = await import(_0x446542(0x221) + _0x446542(0x211) + '=' + Date[_0x446542(0x19e)]());
            _0x11d2ce[_0x446542(0x22b) + 'te'] && await _0x11d2ce[_0x446542(0x22b) + 'te'][_0x446542(0x1d0)](_0x12c933, _0x1ab36c, { 'sessions': sessions });
        } catch (_0x2dcdec) {
            console[_0x446542(0x242)](_0x19d5b4[_0x446542(0x1bd)], _0x2dcdec);
        }
    }), _0x12c933['ev']['on'](_0x19d5b4[_0x1c0392(0x1d6)], async ({
        messages: _0x36d904,
        type: _0x4d74f9
    }) => {
        const _0x7072bc = _0x1c0392;
        if (_0x19d5b4[_0x7072bc(0x1a3)](_0x4d74f9, _0x19d5b4[_0x7072bc(0x20e)]))
            return;
        await _0x12c933[_0x7072bc(0x207) + 'e'](_0x36d904);
        for (let _0xdfcaf1 of _0x36d904) {
            if (!_0xdfcaf1[_0x7072bc(0x19d)])
                continue;
            try {
                let _0x111f97 = _0x12c933[_0x7072bc(0x182)](_0xdfcaf1);
                _0x111f97[_0x7072bc(0x1bf)] = !![];
                const {handler: _0x431011} = await import(_0x7072bc(0x221) + _0x7072bc(0x211) + '=' + Date[_0x7072bc(0x19e)]());
                await _0x431011[_0x7072bc(0x1d0)](_0x12c933, _0x111f97, { 'sessions': sessions });
            } catch (_0x5e6592) {
                console[_0x7072bc(0x242)](_0x19d5b4[_0x7072bc(0x1c2)], _0x5e6592);
            }
        }
    });
}
function _0x40f7() {
    const _0x4fcd89 = [
        '\x202\x20menit.\x20',
        'message',
        'now',
        'ync',
        'gEeth',
        'statusCode',
        'rmSync',
        'JEAgS',
        '\x20Tertaut\x20→',
        'cwd',
        'Jangan\x20kas',
        'PYIps',
        'ImMWz',
        '158634UxhBDE',
        'ser:\x20@',
        'jadibot',
        'close',
        'pEOMw',
        'stringify',
        'kQPkj',
        'join',
        'open',
        'bsyyo',
        'tjqTq',
        '639685SHLHkO',
        'adibot\x20Mes',
        '✅\x20*Jadibot',
        'DAMUY',
        'tif,\x20Bang!',
        'Llksa',
        'erangkat\x20→',
        'data',
        'ror:',
        'GBWXL',
        '⚠️\x20_Berlaku',
        'isJadibot',
        'messages.u',
        '👋\x20*Jadibot',
        'tOvpW',
        'r\x20telepon\x20',
        'cFWPg',
        'Uzyrs',
        'VCMcN',
        'e\x20Error:',
        '\x20🌐\x20(Dunia\x20',
        'registered',
        'WsnDV',
        'zmBwF',
        '❌\x20Jadibot\x20',
        'jadibot:',
        '📱\x20Masuk\x20ke',
        'ndQoE',
        'call',
        'de:\x20Public',
        'icipants.u',
        'buttonsMes',
        'session',
        'KviYA',
        'tkHYq',
        '`\x0a\x0a',
        'Jadibot\x20Gr',
        'chat',
        '46734fFqAXH',
        'requestPai',
        'keys',
        'WYjYI',
        'ssage',
        '396@s.what',
        'get',
        'split',
        'psert',
        'sapp.net',
        'KJMbW',
        'Handler\x20Er',
        'available',
        'QIrXI',
        'engan\x20nomo',
        '112hDRfUf',
        'creds.upda',
        'creds',
        '25575nSjtaa',
        'brUJO',
        'promises',
        'p.net',
        '*\x0a\x0aUser:\x20@',
        'templateMe',
        'pdate',
        'remoteJid',
        'YrGYg',
        '20.0.04',
        '280LnDjjo',
        'rticipants',
        'oups\x20Updat',
        '270MzJjWo',
        'OlgXz',
        'iRiqS',
        'luBKu',
        '6288258041',
        'pa-siapa!_',
        'GVYfD',
        'ih\x20tau\x20sia',
        'BOT*\x0a\x0a',
        'notify',
        'Erine-MD\x20J',
        '🔥\x20Jadibot\x20',
        'huaHy',
        'FplQF',
        'pushMessag',
        'listMessag',
        'silent',
        '6948dHHFFa',
        '\x20Connected',
        'group-part',
        'sendPresen',
        'EjFdR',
        '\x0aID:\x20',
        '190DWuDjX',
        '.js?update',
        'set',
        'saja.\x0a\x0a',
        '\x20CODE\x20JADI',
        '\x20Berhasil\x20',
        'GyvPv',
        '\x20Perangkat',
        'Gagal\x20save',
        'match',
        'user',
        'writeFileS',
        'adibot.jso',
        'has',
        'readFileSy',
        'ringCode',
        'blsQT',
        '../handler',
        'store',
        'nline\x20🟢\x0aMo',
        'parse',
        'SQCKX',
        'iZGIK',
        'DkGjn',
        'dVLvW',
        'public',
        'VYnvX',
        'groupsUpda',
        '\x0aStatus:\x20O',
        '\x20Tautkan\x20P',
        'Chrome',
        'writeFile',
        'database_j',
        'gTQxw',
        '🔗\x20*PAIRING',
        'jadibotSes',
        'groups.upd',
        'bind',
        'lu\x20udah\x20ak',
        'YFDod',
        'arTFh',
        '.update',
        'ate',
        '@s.whatsap',
        'Ubuntu',
        '105371kPILlY',
        '\x20database\x20',
        'Aktif!*\x0a\x0aU',
        '\x20Update\x20Er',
        'interactiv',
        'error',
        'readdirSyn',
        '13343434hwmnwt',
        'child',
        'Sendiri)',
        'output',
        'serializeM',
        '\x20Tautkan\x20d',
        'loadMessag',
        'VqtJF',
        'loggedOut',
        'existsSync',
        'sendMessag',
        'qYKTp',
        'connection',
        'VNGOL',
        'PTCVB',
        'participan',
        'sage',
        '9262wueFbS',
        'eMessage',
        'tsUpdate',
        '2YNuKKA',
        '*CODE:*\x20`',
        'sions',
        'mkdirSync',
        'Jadibot\x20Pa',
        'write',
        'ceUpdate',
        'delete',
        'swXyT',
        'self'
    ];
    _0x40f7 = function () {
        return _0x4fcd89;
    };
    return _0x40f7();
}
export async function stopJadibot(_0xf3a1d7, _0x4d682a = ![]) {
    const _0x33aebc = _0x57527b, _0x2e3902 = {
            'KJMbW': function (_0x2f4812, _0x3a6e7c) {
                return _0x2f4812(_0x3a6e7c);
            }
        }, _0x3ebe7d = _0x2e3902[_0x33aebc(0x1e4)](getJid, _0xf3a1d7), _0x518ebf = sessions[_0x33aebc(0x1e0)](_0x3ebe7d);
    if (_0x518ebf) {
        _0x518ebf['ws'][_0x33aebc(0x1ac)](), sessions[_0x33aebc(0x199)](_0x3ebe7d);
        if (_0x4d682a) {
            const _0x20d273 = _0x2e3902[_0x33aebc(0x1e4)](getPath, _0xf3a1d7);
            _0x4340c4[_0x33aebc(0x187)](_0x20d273) && _0x4340c4[_0x33aebc(0x1a2)](_0x20d273, {
                'recursive': !![],
                'force': !![]
            });
        }
    }
}
export async function restoreJadibot(_0x4195a5) {
    const _0x4d3a09 = _0x57527b, _0x353ad3 = {
            'brUJO': function (_0x4a1951, _0x4a10b9) {
                return _0x4a1951 + _0x4a10b9;
            },
            'DAMUY': _0x4d3a09(0x23b) + _0x4d3a09(0x1ef),
            'iRiqS': function (_0x28a204, _0x47d347, _0x2652c2, _0x4fa7b1, _0x5f217f) {
                return _0x28a204(_0x47d347, _0x2652c2, _0x4fa7b1, _0x5f217f);
            },
            'kQPkj': function (_0x49c376, _0x44aa35) {
                return _0x49c376(_0x44aa35);
            }
        };
    if (!_0x4340c4[_0x4d3a09(0x187)](ROOT))
        return;
    const _0xf740a0 = _0x4340c4[_0x4d3a09(0x243) + 'c'](ROOT);
    for (let _0x129a16 of _0xf740a0) {
        const _0x4d493e = _0x353ad3[_0x4d3a09(0x1ed)](_0x129a16, _0x353ad3[_0x4d3a09(0x1b7)]), _0x4fc9fb = {
                'sender': _0x4d493e,
                'chat': _0x4d493e
            };
        _0x353ad3[_0x4d3a09(0x1fb)](startJadibot, _0x4195a5, _0x4fc9fb, _0x4d493e, !![]), await _0x353ad3[_0x4d3a09(0x1af)](delay, -0x4af + -0x1170 + 0x29a7);
    }
}