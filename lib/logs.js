const stdouts = [];
const maxLength = 200;

export let isModified = false;

export default () => {
  if (isModified) return { disable: () => {} };

  const oldStdoutWrite = process.stdout.write.bind(process.stdout);
  const oldStderrWrite = process.stderr.write.bind(process.stderr);
  const disable = () => {
    process.stdout.write = oldStdoutWrite;
    process.stderr.write = oldStderrWrite;
    isModified = false;
  };

  const captureWrite = (oldWrite) => (chunk, encoding, callback) => {

    const actualEncoding = typeof encoding === 'string' ? encoding : 'utf8';
    
    const buff = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, actualEncoding);
    stdouts.push(buff);

    if (stdouts.length > maxLength) {
      stdouts.shift();
    }

    return oldWrite(chunk, encoding, callback);
  };

  process.stdout.write = captureWrite(oldStdoutWrite);
  process.stderr.write = captureWrite(oldStderrWrite);

  isModified = true;
  return { disable };
};

export const logs = () => {
  return Buffer.concat(stdouts.length > 0 ? stdouts : [Buffer.from('')]);
};
