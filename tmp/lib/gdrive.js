import { join, dirname } from 'path'
import { promises as fs, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { EventEmitter } from 'events'
import { google } from 'googleapis'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly']
const TOKEN_PATH = join(__dirname, '..', 'token.json')
const PORT = 3000
class GoogleAuth extends EventEmitter {
  constructor() {
    super()
  }

  async authorize(credentials) {
    let token
    const { client_secret, client_id, redirect_uris } = credentials.web || credentials.installed || credentials
    
    const redirectUri = redirect_uris ? redirect_uris[0] : `http://localhost:${PORT}`
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri)

    try {
      if (existsSync(TOKEN_PATH)) {
        token = JSON.parse(await fs.readFile(TOKEN_PATH, 'utf-8'))
      } else {
        throw new Error('Token not found')
      }
    } catch (e) {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
      })
      
      this.emit('auth', authUrl)
      
      const code = await new Promise((resolve) => {
        this.once('token', resolve)
      })
      
      const { tokens } = await oAuth2Client.getToken(code)
      token = tokens
      await fs.writeFile(TOKEN_PATH, JSON.stringify(token, null, 2))
    }
    
    oAuth2Client.setCredentials(token)
    this.client = oAuth2Client
    this.drive = google.drive({ version: 'v3', auth: oAuth2Client })
    return this.drive
  }

  token(code) {
    this.emit('token', code)
  }
}

class GoogleDrive extends GoogleAuth {
  constructor() {
    super()
    this.path = '/drive/api'
  }

  async getFolderID(path) {
  }

  async infoFile(path) {
  }

  async folderList(path) {
  }

  async downloadFile(path) {
  }

  async uploadFile(path) {
  }
}

export {
  GoogleAuth,
  GoogleDrive
}
