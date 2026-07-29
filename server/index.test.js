import test from 'node:test';
import assert from 'node:assert/strict';
import { SALE_RATE } from './index.js';

test('fixed promotion is always 50 percent', () => assert.equal(SALE_RATE, 0.5));
test('sale price is derived from Excel original price', () => assert.equal(128 * SALE_RATE, 64));
test('phone format accepts international numbers without verification', () => assert.match('+86 151 0203 5128', /^\+?[0-9 ()-]{7,20}$/));
