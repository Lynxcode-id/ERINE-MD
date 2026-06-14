import { resolve, dirname as _dirname } from 'path';
import _fs, { existsSync, readFileSync, copyFileSync } from 'fs';
const { promises: fs } = _fs;

class Database {
    /**
     * Create new Database
     * @param {String} filepath Path to specified JSON database
     * @param  {...any} args JSON.stringify arguments
     */
    constructor(filepath, ...args) {
        this.file = resolve(filepath);
        this.backupFile = this.file + '.bak';
        this.logger = console;
        this._data = {};
        this._jsonargs = args;
        this._state = false;
        this._queue = [];
        this._maxQueue = 100;
        this._saving = false;
        this._loadSync();
        this._processQueue();
    }

    _loadSync() {
        try {
            if (existsSync(this.file)) {
                const raw = readFileSync(this.file, 'utf-8');
                if (raw.trim()) {
                    this._data = JSON.parse(raw);
                    return;
                }
            }
        } catch (e) {
            this.logger.error(`[DB] File utama corrupt ${this.file}: ${e.message}`);
        }

        try {
            if (existsSync(this.backupFile)) {
                this.logger.warn('[DB] Restoring data dari backup...');
                this._data = JSON.parse(readFileSync(this.backupFile, 'utf-8'));
                copyFileSync(this.backupFile, this.file);
                return;
            }
        } catch (e) {
            this.logger.error(`[DB] File backup juga corrupt: ${e.message}`);
        }

        this._data = this._data || {};
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
        this._queuePush('_load');
    }

    /**
     * Queue Save
     */
    save() {
        this._queuePush('_save');
    }

    _queuePush(method) {
        if (this._queue.length >= this._maxQueue) {
            this._queue.shift(); 
        }
        this._queue.push(method);
        this._processQueue();
    }

    async _processQueue() {
        if (this._state || !this._queue.length) return;
        this._state = true;

        while (this._queue.length) {
            const method = this._queue.shift();
            try {
                await this[method]();
            } catch (error) {
                this.logger.error(`Error processing ${method}: ${error.message}`);
            }
        }
        this._state = false;
    }

    /**
     * Load data dari JSON file
     */
    async _load() {
        this._loadSync();
    }

    /**
     * Save data ke JSON file (Atomic + Backup + Anti-Circular Reference)
     */
    async _save() {
        if (this._saving) return; 
        this._saving = true;

        try {
            const dirname = _dirname(this.file);
            if (!existsSync(dirname)) await fs.mkdir(dirname, { recursive: true });

            let jsonStr;
            try {
                jsonStr = JSON.stringify(this._data, ...this._jsonargs);
            } catch (e) {
                this.logger.error(`[DB] Stringify failed (mungkin ada Circular Reference): ${e.message}`);
                return;
            }

            const tmpFile = `${this.file}.tmp`;
            await fs.writeFile(tmpFile, jsonStr);
            if (existsSync(this.file)) {
                await fs.copyFile(this.file, this.backupFile);
            }
            
            await fs.rename(tmpFile, this.file);
            
            return this.file;
        } catch (error) {
            this.logger.error(`Failed to save data: ${error.message}`);
            if (existsSync(this.backupFile)) {
                await fs.copyFile(this.backupFile, this.file).catch(() => {});
            }
            throw new Error('Save operation failed');
        } finally {
            this._saving = false;
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

    async flush() {
        if (this._state) {
            await new Promise(r => {
                const check = () => this._state ? setTimeout(check, 50) : r();
                check();
            });
        }
        if (this._saving) {
            await new Promise(r => {
                const check = () => this._saving ? setTimeout(check, 50) : r();
                check();
            });
        }
    }
}

export default Database;
