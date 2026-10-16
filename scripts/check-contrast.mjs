// Fails when a text role falls below WCAG AA (4.5:1) on a surface, in light or
// dark. Reads the palette and both role sets from src/styles/tokens.css.
import { readFileSync } from 'node:fs';

const TOKENS = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
const TEXT_ROLES = ['--text-strong', '--text-muted', '--accent', '--accent-strong'];
const SURFACES = ['--surface-0', '--surface-1'];
const PAIRS = [
  ...TEXT_ROLES.flatMap((text) => SURFACES.map((surface) => [text, surface])),
  ['--accent-text', '--accent'],
];
const MINIMUM = 4.5;

function readBlock(selector) {
  const start = TOKENS.indexOf(selector);
  return TOKENS.slice(start, TOKENS.indexOf('}', start));
}

function readDeclarations(block) {
  return Object.fromEntries([...block.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]));
}

function resolveColour(value, palette) {
  const reference = value.match(/^var\((--[\w-]+)\)$/);
  return reference ? palette[reference[1]] : value;
}

function measureLuminance(hex) {
  const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255);
  const linear = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function computeContrast(a, b) {
  const [light, dark] = [measureLuminance(a), measureLuminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

const light = readDeclarations(readBlock(':root {'));
const dark = { ...light, ...readDeclarations(readBlock(':root[data-theme="dark"]')) };
const failures = [];
for (const [mode, roles] of [['light', light], ['dark', dark]]) {
  for (const [text, surface] of PAIRS) {
    const ratio = computeContrast(resolveColour(roles[text], light), resolveColour(roles[surface], light));
    const line = `${mode.padEnd(5)} ${text} on ${surface}: ${ratio.toFixed(2)}`;
    console.log(line);
    if (ratio < MINIMUM) failures.push(line);
  }
}
if (failures.length > 0) {
  console.error(`\n${failures.length} pair(s) below ${MINIMUM}:1`);
  process.exit(1);
}
