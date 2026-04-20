import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).argv;

import cfonts from 'cfonts';
import chalk from 'chalk'; // 🔥 Tambahin chalk buat warna warni teks console
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { createRequire } from 'module';
import { createInterface } from 'readline';
import cluster from 'cluster';
import { watchFile, unwatchFile } from 'fs';
import { checkVersionUpdate } from './lib/plugin-utils.js';

const { say } = cfonts;
const rl = createInterface(process.stdin, process.stdout);
const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);
const { name, author } = require(join(__dirname, './package.json'));

console.clear(); // Bersihin terminal dulu biar rapi pas start

// 🔥 Tampilan Judul Super Neon & Futuristic
say('ERINE-MD\nPROJECT', { 
    font: 'block', 
    align: 'center', 
    gradient: ['#00FFFF', '#FF00FF'], // Neon Cyan ke Neon Magenta
    transitionGradient: true 
});

say(`🚀 CORE SYSTEM INITIALIZATION 🚀\nBy: @${author.name || author}`, { 
    font: 'console', 
    align: 'center', 
    gradient: ['#00FFCC', '#b92b27'] 
});

console.log(chalk.cyanBright('╭───────────────────────────────────────────────────────╮'));
console.log(chalk.cyanBright('│ ') + chalk.bold.hex('#FF00FF')('⚡ BOOT SEQUENCE INITIATED...') + ' '.repeat(26) + chalk.cyanBright('│'));
console.log(chalk.cyanBright('╰───────────────────────────────────────────────────────╯\n'));

await checkVersionUpdate();

var isRunning = false;

/**
 * Start a js file
 * @param {String} file `path/to/file`
 */
function start(file) {
  if (isRunning) return;
  isRunning = true;

  let args = [join(__dirname, file), ...process.argv.slice(2)];
  
  // Custom log pas ngebuka main.js
  console.log(chalk.hex('#00FFCC')(`[ 💻 ] Spawning Node Worker: `) + chalk.white(args.join(' ')));
  
  cluster.setupPrimary({ exec: args[0], args: args.slice(1) });
  let p = cluster.fork();

  p.on('message', data => {
    switch (data) {
      case 'reset':
        console.log(chalk.bgRed.white.bold('\n 🔄 SYSTEM RESET INITIATED 🔄 '));
        p.kill();
        isRunning = false;
        start(file);
        break;
      case 'uptime':
        p.send(process.uptime());
        break;
      default:
        console.log(chalk.bgHex('#9b5cff').white.bold(' 📨 SIGNAL ') + ' ' + chalk.cyan(data));
    }
  });

  p.on('exit', (_, code) => {
    isRunning = false;
    console.error(chalk.bgRed.white.bold(`\n ❗ WORKER DOWN (CODE: ${code}) ❗ `));
    if (code !== 0) {
      console.log(chalk.yellowBright('⚠️  Auto-Reviving System in progress...'));
      return start(file);
    }
    
    watchFile(args[0], () => {
      unwatchFile(args[0]);
      start(file);
    });
  });

  let opts = yargs(process.argv.slice(2)).exitProcess(false).parse();
  
  if (!opts['test']) {
    if (!rl.listenerCount()) {
      rl.on('line', line => {
        p.emit('message', line.trim());
      });
    }
  }
}

start('main.js');
