import { deflateRawSync } from 'node:zlib';

// ZIP32 with UTF-8 names, implemented with Node built-ins so creating the
// transfer files does not depend on zip, Python, or an OS-specific shell.
const table = Uint32Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
const crc32 = buffer => {
  let value = 0xffffffff;
  for (const byte of buffer) value = table[(value ^ byte) & 255] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
};

export function createZip(files) {
  if (files.length > 65535) throw new Error('Demasiados archivos para ZIP32.');
  const localParts = [], centralParts = [];
  let offset = 0;
  for (const file of files) {
    if (file.name.startsWith('/') || file.name.split('/').includes('..')) throw new Error('Ruta de ZIP inválida.');
    const name = Buffer.from(file.name, 'utf8'), raw = Buffer.from(file.data);
    const packed = deflateRawSync(raw, { level: 9 }), crc = crc32(raw);
    if (raw.length > 0xffffffff || packed.length > 0xffffffff || name.length > 65535) throw new Error('Archivo demasiado grande para ZIP32.');
    const date = file.modified || new Date();
    const day = ((Math.max(1980, Math.min(2107, date.getUTCFullYear())) - 1980) << 9) | ((date.getUTCMonth() + 1) << 5) | date.getUTCDate();
    const time = (date.getUTCHours() << 11) | (date.getUTCMinutes() << 5) | Math.floor(date.getUTCSeconds() / 2);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); local.writeUInt16LE(8, 8);
    local.writeUInt16LE(time, 10); local.writeUInt16LE(day, 12);
    local.writeUInt32LE(crc, 14); local.writeUInt32LE(packed.length, 18); local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(name.length, 26);
    localParts.push(local, name, packed);
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8); central.writeUInt16LE(8, 10);
    central.writeUInt16LE(time, 12); central.writeUInt16LE(day, 14);
    central.writeUInt32LE(crc, 16); central.writeUInt32LE(packed.length, 20); central.writeUInt32LE(raw.length, 24);
    central.writeUInt16LE(name.length, 28); central.writeUInt32LE(offset, 42);
    centralParts.push(central, name);
    offset += local.length + name.length + packed.length;
    if (offset > 0xffffffff) throw new Error('Paquete demasiado grande para ZIP32.');
  }
  const directory = Buffer.concat(centralParts), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...localParts, directory, end]);
}
