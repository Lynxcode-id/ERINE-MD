/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✦ *Nama Plugin:* AiCoder
✦ *Tipe:* Plugin Esm
✦ *Author:* kyzz masih pemula
✦ *Saluran:* https://whatsapp.com/channel/0029Vb7gcbuLdQelWzrTzD3D
★ scrape by : defan
★ source scrape : https://whatsapp.com/channel/0029VbCWturICVfd01iF0y47
✦ *Note:* Sesuaikan dengan sc bot mu aja
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`*📝 CONTOH PENGGUNAAN AICODER*

${usedPrefix + command} buat landing page portfolio modern
${usedPrefix + command} buat website toko online sederhana
${usedPrefix + command} buat aplikasi todo list dengan html css js
${usedPrefix + command} buat komponen button dengan tailwind

*💡 TIPS:*
- Gunakan bahasa Indonesia atau Inggris
- Spesifikkan framework (React, Vue, Tailwind dll)
- Sebutkan warna atau tema yang diinginkan
- Jelaskan fungsi yang dibutuhkan

*⚠️ NOTE:*
Hasil berupa file ZIP berisi kode lengkap
Proses butuh waktu 30–60 detik`)
  }

  await m.reply('⏳ Generating kode...')

  const { writeFile, mkdir, readFile } = await import('fs/promises')
  const { exec } = await import('child_process')
  const { promisify } = await import('util')
  const path = await import('path')
  const execAsync = promisify(exec)

  const MODELS = ['zai-org/GLM-5', 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8']
  const BASE_URL = 'https://llamacoder.together.ai/api'
  const TIMEOUT_MS = 90_000

  const fetchWithTimeout = (url, opts = {}) => {
    const controller = new AbortController()
    const tid = setTimeout(() => controller.abort(), TIMEOUT_MS)
    return fetch(url, { ...opts, signal: controller.signal }).finally(() => clearTimeout(tid))
  }

  let chatId = null
  let lastMessageId = null
  let usedModel = null

  for (const model of MODELS) {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/create-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, model, quality: 'low' })
      })

      if (!res.ok) continue
      const data = await res.json()

      if (data?.chatId) {
        chatId = data.chatId
        lastMessageId = data.lastMessageId
        usedModel = model
        break
      }
    } catch {
      continue
    }
  }

  if (!chatId) throw '❌ Gagal membuat session. Coba lagi nanti.'

  let streamRes
  try {
    streamRes = await fetchWithTimeout(`${BASE_URL}/get-next-completion-stream-promise`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId: lastMessageId, model: usedModel })
    })
  } catch (e) {
    throw `❌ Gagal stream output: ${e.message}`
  }

  if (!streamRes.ok) throw `❌ Stream error: ${streamRes.status}`

  let fullOutput = ''
  let buffer = ''

  try {
    const reader = streamRes.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop()

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue
        try {
          const j = JSON.parse(trimmed)
          const content = j?.choices?.[0]?.delta?.content
          if (content) fullOutput += content
        } catch {}
      }
    }

    if (buffer.trim()) {
      try {
        const j = JSON.parse(buffer.trim())
        const content = j?.choices?.[0]?.delta?.content
        if (content) fullOutput += content
      } catch {}
    }
  } catch (e) {
    throw `❌ Error baca stream: ${e.message}`
  }

  if (!fullOutput) throw '❌ Model tidak menghasilkan output apapun.'

  const files = []
  const regex = /```(?:tsx?|jsx?|css|scss|json|html?|md|env|toml|yaml|yml)\{path=([^}]+)\}\n([\s\S]*?)```/g
  let match
  while ((match = regex.exec(fullOutput)) !== null) {
    const filePath = match[1].replace(/^\//, '')
    const content = match[2]
    if (filePath && content) files.push({ path: filePath, content })
  }

  if (files.length === 0) throw '❌ Tidak ada file yang dihasilkan. Coba prompt yang lebih spesifik.'

  const slug = text.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 30)
  const tempDir = path.join(process.cwd(), `tmp_aicoder_${Date.now()}`)
  const zipName = `aicoder-${slug}.zip`
  const zipPath = path.join(process.cwd(), zipName)

  try {
    await mkdir(tempDir, { recursive: true })

    for (const file of files) {
      const filePath = path.join(tempDir, file.path)
      const fileDir = path.dirname(filePath)
      await mkdir(fileDir, { recursive: true })
      await writeFile(filePath, file.content, 'utf8')
    }

    await execAsync(`cd "${tempDir}" && zip -r "${zipPath}" .`)

    const zipBuffer = await readFile(zipPath)

    const caption = `✅ *Selesai!*
📁 ${files.length} file dibuat
🤖 Model: ${usedModel?.split('/').pop() ?? 'unknown'}
📝 Prompt: ${text.slice(0, 60)}${text.length > 60 ? '...' : ''}

*Files:*
${files.map(f => `• \`${f.path}\``).join('\n')}`

    await conn.sendMessage(m.chat, {
      document: zipBuffer,
      mimetype: 'application/zip',
      fileName: zipName,
      caption
    }, { quoted: m })

  } finally {
    execAsync(`rm -rf "${tempDir}" "${zipPath}"`).catch(() => {})
  }
}

handler.help = ['aicoder <prompt>']
handler.tags = ['tools']
handler.command = /^(aicoder|aicode|gencode)$/i
handler.premium = false
handler.register = true
handler.limit = true

export default handler