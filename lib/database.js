import { resolve, dirname as _dirname } from 'path';
import _fs, { existsSync, readFileSync } from 'fs';
const { promises: fs } = _fs;

class Database {
    /**
     * Create new Database
     * @param {String} filepath Path to specified JSON database
     * @param  {...any} args JSON.stringify arguments
     */
    constructor(filepath, ...args) {
        this.file = resolve(filepath);
        this.logger = console;
        this._load();
        this._jsonargs = args;
        this._state = false;
        this._queue = [];

        // Use a timeout instead of interval for better efficiency
        this._processQueue();
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
        this.save();
    }

    /**
     * Queue Load
     */
    load() {
        this._queue.push('_load');
        this._processQueue(); 
    }

    /**
     * Queue Save
     */
    save() {
        this._queue.push('_save');
        this._processQueue(); 
    }

    async _processQueue() {
        if (this._state || !this._queue.length) return;

        this._state = true;
        const method = this._queue.shift();

        try {
            await this[method]();
        } catch (error) {
            this.logger.error(`Error processing ${method}: ${error.message}`);
        } finally {
            this._state = false;
            // Continue processing the queue
            this._processQueue();
        }
    }

    /**
     * Load data from the JSON file
     */
    _load() {
        try {
            this._data = existsSync(this.file) ? JSON.parse(readFileSync(this.file)) : {};
        } catch (error) {
            this.logger.error(`Failed to load data: ${error.message}. Mencegah reset amnesia...`);
            // 🔥 FIX: Kalau JSON tiba-tiba corrupt, JANGAN langsung diganti {}.
            // Kita pertahankan _data yang ada di memori RAM bot lu.
            this._data = this._data || {}; 
        }
    }

    /**
     * Save data to the JSON file
     */
    async _save() {
        try {
            const dirname = _dirname(this.file);
            if (!existsSync(dirname)) await fs.mkdir(dirname, { recursive: true });
            
            // 🔥 FIX: ATOMIC WRITING
            // Tulis ke file sementara (.tmp) dulu biar aman kalau server mati di tengah jalan
            const tmpFile = `${this.file}.tmp`;
            await fs.writeFile(tmpFile, JSON.stringify(this._data, ...this._jsonargs));
            
            // Kalau nulis ke file .tmp sukses 100%, baru kita rename numpuk file asli
            // fs.rename itu atomic process, jadi data lu aman dari korupsi 0 bytes.
            await fs.rename(tmpFile, this.file);
            
            // Gua matiin logger ini biar terminal lu nggak dispam "Data saved to..." tiap 60 detik
            // this.logger.info(`Data saved to ${this.file}`);
            
            return this.file;
        } catch (error) {
            this.logger.error(`Failed to save data: ${error.message}`);
            throw new Error('Save operation failed'); 
        }
    }

    /**
     * Delete a key from the database
     * @param {String} key The key to be deleted
     */
    delete(key) {
        if (this._data[key]) {
            delete this._data[key];
            this.save();
        } else {
            this.logger.warn(`Key "${key}" not found in data.`);
        }
    }
}

export default Database;
