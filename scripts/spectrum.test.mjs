// Unit tests for the spectrum model. Run: node scripts/spectrum.test.mjs
import assert from 'node:assert/strict';
import { createSpectrum, GUARD } from '../src/lib/spectrumModel.js';

const cfg = { seed: 0x5a17, channels: 96, faultChannel: 61 };
const m = createSpectrum(cfg);
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log('ok  ' + name); };

test('nearestChannel inverts channelX for all 96 channels', () => {
  for (let i = 0; i < 96; i++) assert.equal(m.nearestChannel(m.channelX(i)), i, 'channel ' + i);
});

test('nearestChannel snaps to the closest channel just off centre', () => {
  const s = m.spacing * 0.45;
  for (let i = 0; i < 96; i++) {
    const x = m.channelX(i);
    if (i !== 47 && i !== 95) assert.equal(m.nearestChannel(x + s), i, 'right of ' + i);
    if (i !== 0 && i !== 48) assert.equal(m.nearestChannel(x - s), i, 'left of ' + i);
  }
});

test('the guard gap returns null', () => {
  assert.equal(m.nearestChannel(0.5), null);
  assert.equal(m.nearestChannel(0.5 - GUARD / 2 + 1e-6), null);
  assert.equal(m.nearestChannel(0.5 + GUARD / 2 - 1e-6), null);
  assert.equal(m.nearestChannel(m.gapLeft), 47);
  assert.equal(m.nearestChannel(m.gapRight), 48);
});

test('edges clamp to 0 and 95', () => {
  assert.equal(m.nearestChannel(-0.2), 0);
  assert.equal(m.nearestChannel(1.2), 95);
});

test('sample is deterministic for a seed', () => {
  const a = createSpectrum(cfg), b = createSpectrum(cfg);
  for (let s = 0; s <= 400; s++) {
    const x = s / 400;
    assert.equal(a.sample(x, 3.2, 0.25, { introStart: 1, breathing: true }), b.sample(x, 3.2, 0.25, { introStart: 1, breathing: true }));
    assert.equal(a.sample(x, 0, 0), b.sample(x, 0, 0));
  }
  const c = createSpectrum({ ...cfg, seed: 0x1234 });
  let diff = 0;
  for (let s = 0; s <= 400; s++) if (c.sample(s / 400, 0, 0) !== a.sample(s / 400, 0, 0)) diff++;
  assert.ok(diff > 300, 'a different seed gives a different trace');
});

test('fault channel is depressed', () => {
  const f = m.faultIndex;
  assert.equal(f, 60);
  const vf = m.sample(m.channelX(f), 0, 0);
  const vl = m.sample(m.channelX(f - 1), 0, 0);
  const vr = m.sample(m.channelX(f + 1), 0, 0);
  assert.ok(vf < vl - 0.3 && vf < vr - 0.3, `fault ${vf} vs ${vl} ${vr}`);
  assert.ok(vf > 0.2, 'fault peak still above the floor');
});

test('trace values stay within 0..1 and peaks sit above the floor', () => {
  for (let s = 0; s <= 1200; s++) {
    const v = m.sample(s / 1200, 0, 0);
    assert.ok(v >= 0 && v <= 1.08, 'v=' + v + ' at ' + s / 1200);
  }
  for (let i = 0; i < 96; i++) {
    if (i === m.faultIndex) continue;
    assert.ok(m.sample(m.channelX(i), 0, 0) > 0.6, 'peak ' + i);
  }
  assert.ok(m.sample(0.5, 0, 0) < 0.2, 'guard gap is near the floor');
});

test('tilt: the C band rises left to right, the L band falls', () => {
  const avg = (a, b) => { let s = 0; for (let i = a; i <= b; i++) s += m.sample(m.channelX(i), 0, 0); return s / (b - a + 1); };
  assert.ok(avg(40, 47) > avg(0, 7), 'C tilt');
  assert.ok(avg(48, 55) > avg(88, 95), 'L tilt');
});

test('intro: channels rise in order and finish at the resting trace', () => {
  const x0 = m.channelX(0), x95 = m.channelX(95);
  const rest0 = m.sample(x0, 12, 0), rest95 = m.sample(x95, 12, 0);
  const o = { introStart: 10 };
  assert.ok(m.sample(x0, 10, 0, o) < 0.2 && m.sample(x95, 10, 0, o) < 0.2, 'nothing at the start');
  assert.ok(m.sample(x0, 10.2, 0, o) > m.sample(x95, 10.2, 0, o) + 0.2, 'channel 1 leads channel 96');
  assert.ok(Math.abs(m.sample(x0, 12, 0, o) - rest0) < 1e-9 && Math.abs(m.sample(x95, 12, 0, o) - rest95) < 1e-9, 'settles');
});

test('collapse: trailing edge and a flat trace at p = 1', () => {
  const x0 = m.channelX(0), x95 = m.channelX(95);
  assert.ok(m.sample(x0, 0, 0.3) < m.sample(x95, 0, 0.3) - 0.2, 'channel 1 collapses before channel 96');
  for (let i = 0; i < 96; i++) assert.ok(m.sample(m.channelX(i), 0, 1) < 0.2, 'flat at p=1, channel ' + i);
});

test('breathing is small and off when disabled', () => {
  const x = m.channelX(10);
  const off = m.sample(x, 5, 0, { breathing: false });
  const on = m.sample(x, 5, 0, { breathing: true });
  assert.equal(off, m.sample(x, 5, 0));
  assert.ok(Math.abs(on - off) <= 0.013 && on !== off);
});

console.log(`\n${passed} tests passed`);
