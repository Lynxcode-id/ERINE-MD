import JavaScriptObfuscator from 'javascript-obfuscator'

const handler = async (m, { conn, text, args }) => {
  if (!text) throw `[!] Masukan textnya\n\nContoh:\n.enc easy console.log("hai")\n\n[!] Pilih level: easy | medium | hard | extreme`

  let level = (args[0] || '').toLowerCase()
  let code = args.slice(1).join(' ')
  if (!code) code = text

  let config = {}

  switch (level) {
    case 'easy':
      config = {
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        renameGlobals: false
      }
      break

    case 'medium':
      config = {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.3,
        deadCodeInjection: false,
        renameGlobals: false
      }
      break

    case 'hard':
      config = {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        renameGlobals: true,
        stringArray: true,
        stringArrayThreshold: 0.75
      }
      break

    case 'extreme':
      config = {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 1,
        renameGlobals: true,
        stringArray: true,
        stringArrayThreshold: 1,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        splitStrings: true,
        splitStringsChunkLength: 3
      }
      break

    default:
      throw `[!] Pilih level: easy | medium | hard | extreme\nContoh: .enc hard console.log("hai")`
  }

  let res = JavaScriptObfuscator.obfuscate(code, config)
  conn.reply(m.chat, res.getObfuscatedCode(), m)
}

handler.help = ['enc3 <level> <code>']
handler.tags = ['tools']
handler.command = /^enc3$/i
handler.premium = true
handler.limit = 20

export default handler