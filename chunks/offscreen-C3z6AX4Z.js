import { n as init_asyncToGenerator, r as __commonJSMin, t as _asyncToGenerator } from "./asyncToGenerator-HxMCLN5T.js";
import { t as _objectSpread2 } from "./objectSpread2-YiwCHUSe.js";
import { i as SendMessageType, n as MessageTarget, r as OFFSCREEN_MESSAGE_TYPES, t as BACKGROUND_MESSAGE_TYPES } from "./message-types-Byobwm5R.js";
import { n as SemanticSimilarityEngine } from "./semantic-similarity-engine-Obh75jju.js";
//#endregion
//#region entrypoints/offscreen/gif-encoder.ts
var import_gifenc = (/* @__PURE__ */ __commonJSMin(((exports) => {
	var __defProp = Object.defineProperty;
	var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
	var __export = (target, all) => {
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	};
	__markAsModule(exports);
	__export(exports, {
		GIFEncoder: () => GIFEncoder,
		applyPalette: () => applyPalette,
		default: () => src_default,
		nearestColor: () => nearestColor,
		nearestColorIndex: () => nearestColorIndex,
		nearestColorIndexWithDistance: () => nearestColorIndexWithDistance,
		prequantize: () => prequantize,
		quantize: () => quantize,
		snapColorsToPalette: () => snapColorsToPalette
	});
	var constants_default = {
		signature: "GIF",
		version: "89a",
		trailer: 59,
		extensionIntroducer: 33,
		applicationExtensionLabel: 255,
		graphicControlExtensionLabel: 249,
		imageSeparator: 44,
		signatureSize: 3,
		versionSize: 3,
		globalColorTableFlagMask: 128,
		colorResolutionMask: 112,
		sortFlagMask: 8,
		globalColorTableSizeMask: 7,
		applicationIdentifierSize: 8,
		applicationAuthCodeSize: 3,
		disposalMethodMask: 28,
		userInputFlagMask: 2,
		transparentColorFlagMask: 1,
		localColorTableFlagMask: 128,
		interlaceFlagMask: 64,
		idSortFlagMask: 32,
		localColorTableSizeMask: 7
	};
	function createStream(initialCapacity = 256) {
		let cursor = 0;
		let contents = new Uint8Array(initialCapacity);
		return {
			get buffer() {
				return contents.buffer;
			},
			reset() {
				cursor = 0;
			},
			bytesView() {
				return contents.subarray(0, cursor);
			},
			bytes() {
				return contents.slice(0, cursor);
			},
			writeByte(byte) {
				expand(cursor + 1);
				contents[cursor] = byte;
				cursor++;
			},
			writeBytes(data, offset = 0, byteLength = data.length) {
				expand(cursor + byteLength);
				for (let i = 0; i < byteLength; i++) contents[cursor++] = data[i + offset];
			},
			writeBytesView(data, offset = 0, byteLength = data.byteLength) {
				expand(cursor + byteLength);
				contents.set(data.subarray(offset, offset + byteLength), cursor);
				cursor += byteLength;
			}
		};
		function expand(newCapacity) {
			var prevCapacity = contents.length;
			if (prevCapacity >= newCapacity) return;
			newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < 1048576 ? 2 : 1.125) >>> 0);
			if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
			const oldContents = contents;
			contents = new Uint8Array(newCapacity);
			if (cursor > 0) contents.set(oldContents.subarray(0, cursor), 0);
		}
	}
	var BITS = 12;
	var DEFAULT_HSIZE = 5003;
	var MASKS = [
		0,
		1,
		3,
		7,
		15,
		31,
		63,
		127,
		255,
		511,
		1023,
		2047,
		4095,
		8191,
		16383,
		32767,
		65535
	];
	function lzwEncode(width, height, pixels, colorDepth, outStream = createStream(512), accum = /* @__PURE__ */ new Uint8Array(256), htab = new Int32Array(DEFAULT_HSIZE), codetab = new Int32Array(DEFAULT_HSIZE)) {
		const hsize = htab.length;
		const initCodeSize = Math.max(2, colorDepth);
		accum.fill(0);
		codetab.fill(0);
		htab.fill(-1);
		let cur_accum = 0;
		let cur_bits = 0;
		const init_bits = initCodeSize + 1;
		const g_init_bits = init_bits;
		let clear_flg = false;
		let n_bits = g_init_bits;
		let maxcode = (1 << n_bits) - 1;
		const ClearCode = 1 << init_bits - 1;
		const EOFCode = ClearCode + 1;
		let free_ent = ClearCode + 2;
		let a_count = 0;
		let ent = pixels[0];
		let hshift = 0;
		for (let fcode = hsize; fcode < 65536; fcode *= 2) ++hshift;
		hshift = 8 - hshift;
		outStream.writeByte(initCodeSize);
		output(ClearCode);
		const length = pixels.length;
		for (let idx = 1; idx < length; idx++) next_block: {
			const c = pixels[idx];
			const fcode = (c << BITS) + ent;
			let i = c << hshift ^ ent;
			if (htab[i] === fcode) {
				ent = codetab[i];
				break next_block;
			}
			const disp = i === 0 ? 1 : hsize - i;
			while (htab[i] >= 0) {
				i -= disp;
				if (i < 0) i += hsize;
				if (htab[i] === fcode) {
					ent = codetab[i];
					break next_block;
				}
			}
			output(ent);
			ent = c;
			if (free_ent < 1 << BITS) {
				codetab[i] = free_ent++;
				htab[i] = fcode;
			} else {
				htab.fill(-1);
				free_ent = ClearCode + 2;
				clear_flg = true;
				output(ClearCode);
			}
		}
		output(ent);
		output(EOFCode);
		outStream.writeByte(0);
		return outStream.bytesView();
		function output(code) {
			cur_accum &= MASKS[cur_bits];
			if (cur_bits > 0) cur_accum |= code << cur_bits;
			else cur_accum = code;
			cur_bits += n_bits;
			while (cur_bits >= 8) {
				accum[a_count++] = cur_accum & 255;
				if (a_count >= 254) {
					outStream.writeByte(a_count);
					outStream.writeBytesView(accum, 0, a_count);
					a_count = 0;
				}
				cur_accum >>= 8;
				cur_bits -= 8;
			}
			if (free_ent > maxcode || clear_flg) {
				if (clear_flg) {
					n_bits = g_init_bits;
					maxcode = (1 << n_bits) - 1;
					clear_flg = false;
				} else {
					++n_bits;
					maxcode = n_bits === BITS ? 1 << n_bits : (1 << n_bits) - 1;
				}
			}
			if (code == EOFCode) {
				while (cur_bits > 0) {
					accum[a_count++] = cur_accum & 255;
					if (a_count >= 254) {
						outStream.writeByte(a_count);
						outStream.writeBytesView(accum, 0, a_count);
						a_count = 0;
					}
					cur_accum >>= 8;
					cur_bits -= 8;
				}
				if (a_count > 0) {
					outStream.writeByte(a_count);
					outStream.writeBytesView(accum, 0, a_count);
					a_count = 0;
				}
			}
		}
	}
	var lzwEncode_default = lzwEncode;
	function rgb888_to_rgb565(r, g, b) {
		return r << 8 & 63488 | g << 2 & 992 | b >> 3;
	}
	function rgba8888_to_rgba4444(r, g, b, a) {
		return r >> 4 | g & 240 | (b & 240) << 4 | (a & 240) << 8;
	}
	function rgb888_to_rgb444(r, g, b) {
		return r >> 4 << 8 | g & 240 | b >> 4;
	}
	function clamp(value, min, max) {
		return value < min ? min : value > max ? max : value;
	}
	function sqr(value) {
		return value * value;
	}
	function find_nn(bins, idx, hasAlpha) {
		var nn = 0;
		var err = 1e100;
		const bin1 = bins[idx];
		const n1 = bin1.cnt;
		const wa = bin1.ac;
		const wr = bin1.rc;
		const wg = bin1.gc;
		const wb = bin1.bc;
		for (var i = bin1.fw; i != 0; i = bins[i].fw) {
			const bin = bins[i];
			const n2 = bin.cnt;
			const nerr2 = n1 * n2 / (n1 + n2);
			if (nerr2 >= err) continue;
			var nerr = 0;
			if (hasAlpha) {
				nerr += nerr2 * sqr(bin.ac - wa);
				if (nerr >= err) continue;
			}
			nerr += nerr2 * sqr(bin.rc - wr);
			if (nerr >= err) continue;
			nerr += nerr2 * sqr(bin.gc - wg);
			if (nerr >= err) continue;
			nerr += nerr2 * sqr(bin.bc - wb);
			if (nerr >= err) continue;
			err = nerr;
			nn = i;
		}
		bin1.err = err;
		bin1.nn = nn;
	}
	function create_bin() {
		return {
			ac: 0,
			rc: 0,
			gc: 0,
			bc: 0,
			cnt: 0,
			nn: 0,
			fw: 0,
			bk: 0,
			tm: 0,
			mtm: 0,
			err: 0
		};
	}
	function create_bin_list(data, format) {
		const bins = new Array(format === "rgb444" ? 4096 : 65536);
		const size = data.length;
		if (format === "rgba4444") for (let i = 0; i < size; ++i) {
			const color = data[i];
			const a = color >> 24 & 255;
			const b = color >> 16 & 255;
			const g = color >> 8 & 255;
			const r = color & 255;
			const index = rgba8888_to_rgba4444(r, g, b, a);
			let bin = index in bins ? bins[index] : bins[index] = create_bin();
			bin.rc += r;
			bin.gc += g;
			bin.bc += b;
			bin.ac += a;
			bin.cnt++;
		}
		else if (format === "rgb444") for (let i = 0; i < size; ++i) {
			const color = data[i];
			const b = color >> 16 & 255;
			const g = color >> 8 & 255;
			const r = color & 255;
			const index = rgb888_to_rgb444(r, g, b);
			let bin = index in bins ? bins[index] : bins[index] = create_bin();
			bin.rc += r;
			bin.gc += g;
			bin.bc += b;
			bin.cnt++;
		}
		else for (let i = 0; i < size; ++i) {
			const color = data[i];
			const b = color >> 16 & 255;
			const g = color >> 8 & 255;
			const r = color & 255;
			const index = rgb888_to_rgb565(r, g, b);
			let bin = index in bins ? bins[index] : bins[index] = create_bin();
			bin.rc += r;
			bin.gc += g;
			bin.bc += b;
			bin.cnt++;
		}
		return bins;
	}
	function quantize(rgba, maxColors, opts = {}) {
		const { format = "rgb565", clearAlpha = true, clearAlphaColor = 0, clearAlphaThreshold = 0, oneBitAlpha = false } = opts;
		if (!rgba || !rgba.buffer) throw new Error("quantize() expected RGBA Uint8Array data");
		if (!(rgba instanceof Uint8Array) && !(rgba instanceof Uint8ClampedArray)) throw new Error("quantize() expected RGBA Uint8Array data");
		const data = new Uint32Array(rgba.buffer);
		let useSqrt = opts.useSqrt !== false;
		const hasAlpha = format === "rgba4444";
		const bins = create_bin_list(data, format);
		const bincount = bins.length;
		const bincountMinusOne = bincount - 1;
		const heap = new Uint32Array(bincount + 1);
		var maxbins = 0;
		for (var i = 0; i < bincount; ++i) {
			const bin = bins[i];
			if (bin != null) {
				var d = 1 / bin.cnt;
				if (hasAlpha) bin.ac *= d;
				bin.rc *= d;
				bin.gc *= d;
				bin.bc *= d;
				bins[maxbins++] = bin;
			}
		}
		if (sqr(maxColors) / maxbins < .022) useSqrt = false;
		var i = 0;
		for (; i < maxbins - 1; ++i) {
			bins[i].fw = i + 1;
			bins[i + 1].bk = i;
			if (useSqrt) bins[i].cnt = Math.sqrt(bins[i].cnt);
		}
		if (useSqrt) bins[i].cnt = Math.sqrt(bins[i].cnt);
		var h, l, l2;
		for (i = 0; i < maxbins; ++i) {
			find_nn(bins, i, false);
			var err = bins[i].err;
			for (l = ++heap[0]; l > 1; l = l2) {
				l2 = l >> 1;
				if (bins[h = heap[l2]].err <= err) break;
				heap[l] = h;
			}
			heap[l] = i;
		}
		var extbins = maxbins - maxColors;
		for (i = 0; i < extbins;) {
			var tb;
			for (;;) {
				var b1 = heap[1];
				tb = bins[b1];
				if (tb.tm >= tb.mtm && bins[tb.nn].mtm <= tb.tm) break;
				if (tb.mtm == bincountMinusOne) b1 = heap[1] = heap[heap[0]--];
				else {
					find_nn(bins, b1, false);
					tb.tm = i;
				}
				var err = bins[b1].err;
				for (l = 1; (l2 = l + l) <= heap[0]; l = l2) {
					if (l2 < heap[0] && bins[heap[l2]].err > bins[heap[l2 + 1]].err) l2++;
					if (err <= bins[h = heap[l2]].err) break;
					heap[l] = h;
				}
				heap[l] = b1;
			}
			var nb = bins[tb.nn];
			var n1 = tb.cnt;
			var n2 = nb.cnt;
			var d = 1 / (n1 + n2);
			if (hasAlpha) tb.ac = d * (n1 * tb.ac + n2 * nb.ac);
			tb.rc = d * (n1 * tb.rc + n2 * nb.rc);
			tb.gc = d * (n1 * tb.gc + n2 * nb.gc);
			tb.bc = d * (n1 * tb.bc + n2 * nb.bc);
			tb.cnt += nb.cnt;
			tb.mtm = ++i;
			bins[nb.bk].fw = nb.fw;
			bins[nb.fw].bk = nb.bk;
			nb.mtm = bincountMinusOne;
		}
		let palette = [];
		var k = 0;
		for (i = 0;; ++k) {
			let r = clamp(Math.round(bins[i].rc), 0, 255);
			let g = clamp(Math.round(bins[i].gc), 0, 255);
			let b = clamp(Math.round(bins[i].bc), 0, 255);
			let a = 255;
			if (hasAlpha) {
				a = clamp(Math.round(bins[i].ac), 0, 255);
				if (oneBitAlpha) a = a <= (typeof oneBitAlpha === "number" ? oneBitAlpha : 127) ? 0 : 255;
				if (clearAlpha && a <= clearAlphaThreshold) {
					r = g = b = clearAlphaColor;
					a = 0;
				}
			}
			const color = hasAlpha ? [
				r,
				g,
				b,
				a
			] : [
				r,
				g,
				b
			];
			if (!existsInPalette(palette, color)) palette.push(color);
			if ((i = bins[i].fw) == 0) break;
		}
		return palette;
	}
	function existsInPalette(palette, color) {
		for (let i = 0; i < palette.length; i++) {
			const p = palette[i];
			let matchesRGB = p[0] === color[0] && p[1] === color[1] && p[2] === color[2];
			let matchesAlpha = p.length >= 4 && color.length >= 4 ? p[3] === color[3] : true;
			if (matchesRGB && matchesAlpha) return true;
		}
		return false;
	}
	function euclideanDistanceSquared(a, b) {
		var sum = 0;
		var n;
		for (n = 0; n < a.length; n++) {
			const dx = a[n] - b[n];
			sum += dx * dx;
		}
		return sum;
	}
	function roundStep(byte, step) {
		return step > 1 ? Math.round(byte / step) * step : byte;
	}
	function prequantize(rgba, { roundRGB = 5, roundAlpha = 10, oneBitAlpha = null } = {}) {
		const data = new Uint32Array(rgba.buffer);
		for (let i = 0; i < data.length; i++) {
			const color = data[i];
			let a = color >> 24 & 255;
			let b = color >> 16 & 255;
			let g = color >> 8 & 255;
			let r = color & 255;
			a = roundStep(a, roundAlpha);
			if (oneBitAlpha) a = a <= (typeof oneBitAlpha === "number" ? oneBitAlpha : 127) ? 0 : 255;
			r = roundStep(r, roundRGB);
			g = roundStep(g, roundRGB);
			b = roundStep(b, roundRGB);
			data[i] = a << 24 | b << 16 | g << 8 | r << 0;
		}
	}
	function applyPalette(rgba, palette, format = "rgb565") {
		if (!rgba || !rgba.buffer) throw new Error("quantize() expected RGBA Uint8Array data");
		if (!(rgba instanceof Uint8Array) && !(rgba instanceof Uint8ClampedArray)) throw new Error("quantize() expected RGBA Uint8Array data");
		if (palette.length > 256) throw new Error("applyPalette() only works with 256 colors or less");
		const data = new Uint32Array(rgba.buffer);
		const length = data.length;
		const bincount = format === "rgb444" ? 4096 : 65536;
		const index = new Uint8Array(length);
		const cache = new Array(bincount);
		if (format === "rgba4444") for (let i = 0; i < length; i++) {
			const color = data[i];
			const a = color >> 24 & 255;
			const b = color >> 16 & 255;
			const g = color >> 8 & 255;
			const r = color & 255;
			const key = rgba8888_to_rgba4444(r, g, b, a);
			const idx = key in cache ? cache[key] : cache[key] = nearestColorIndexRGBA(r, g, b, a, palette);
			index[i] = idx;
		}
		else {
			const rgb888_to_key = format === "rgb444" ? rgb888_to_rgb444 : rgb888_to_rgb565;
			for (let i = 0; i < length; i++) {
				const color = data[i];
				const b = color >> 16 & 255;
				const g = color >> 8 & 255;
				const r = color & 255;
				const key = rgb888_to_key(r, g, b);
				const idx = key in cache ? cache[key] : cache[key] = nearestColorIndexRGB(r, g, b, palette);
				index[i] = idx;
			}
		}
		return index;
	}
	function nearestColorIndexRGBA(r, g, b, a, palette) {
		let k = 0;
		let mindist = 1e100;
		for (let i = 0; i < palette.length; i++) {
			const px2 = palette[i];
			const a2 = px2[3];
			let curdist = sqr2(a2 - a);
			if (curdist > mindist) continue;
			const r2 = px2[0];
			curdist += sqr2(r2 - r);
			if (curdist > mindist) continue;
			const g2 = px2[1];
			curdist += sqr2(g2 - g);
			if (curdist > mindist) continue;
			const b2 = px2[2];
			curdist += sqr2(b2 - b);
			if (curdist > mindist) continue;
			mindist = curdist;
			k = i;
		}
		return k;
	}
	function nearestColorIndexRGB(r, g, b, palette) {
		let k = 0;
		let mindist = 1e100;
		for (let i = 0; i < palette.length; i++) {
			const px2 = palette[i];
			const r2 = px2[0];
			let curdist = sqr2(r2 - r);
			if (curdist > mindist) continue;
			const g2 = px2[1];
			curdist += sqr2(g2 - g);
			if (curdist > mindist) continue;
			const b2 = px2[2];
			curdist += sqr2(b2 - b);
			if (curdist > mindist) continue;
			mindist = curdist;
			k = i;
		}
		return k;
	}
	function snapColorsToPalette(palette, knownColors, threshold = 5) {
		if (!palette.length || !knownColors.length) return;
		const paletteRGB = palette.map((p) => p.slice(0, 3));
		const thresholdSq = threshold * threshold;
		const dim = palette[0].length;
		for (let i = 0; i < knownColors.length; i++) {
			let color = knownColors[i];
			if (color.length < dim) color = [
				color[0],
				color[1],
				color[2],
				255
			];
			else if (color.length > dim) color = color.slice(0, 3);
			else color = color.slice();
			const r = nearestColorIndexWithDistance(paletteRGB, color.slice(0, 3), euclideanDistanceSquared);
			const idx = r[0];
			const distanceSq = r[1];
			if (distanceSq > 0 && distanceSq <= thresholdSq) palette[idx] = color;
		}
	}
	function sqr2(a) {
		return a * a;
	}
	function nearestColorIndex(colors, pixel, distanceFn = euclideanDistanceSquared) {
		let minDist = Infinity;
		let minDistIndex = -1;
		for (let j = 0; j < colors.length; j++) {
			const paletteColor = colors[j];
			const dist = distanceFn(pixel, paletteColor);
			if (dist < minDist) {
				minDist = dist;
				minDistIndex = j;
			}
		}
		return minDistIndex;
	}
	function nearestColorIndexWithDistance(colors, pixel, distanceFn = euclideanDistanceSquared) {
		let minDist = Infinity;
		let minDistIndex = -1;
		for (let j = 0; j < colors.length; j++) {
			const paletteColor = colors[j];
			const dist = distanceFn(pixel, paletteColor);
			if (dist < minDist) {
				minDist = dist;
				minDistIndex = j;
			}
		}
		return [minDistIndex, minDist];
	}
	function nearestColor(colors, pixel, distanceFn = euclideanDistanceSquared) {
		return colors[nearestColorIndex(colors, pixel, distanceFn)];
	}
	function GIFEncoder(opt = {}) {
		const { initialCapacity = 4096, auto = true } = opt;
		const stream = createStream(initialCapacity);
		const HSIZE = 5003;
		const accum = /* @__PURE__ */ new Uint8Array(256);
		const htab = new Int32Array(HSIZE);
		const codetab = new Int32Array(HSIZE);
		let hasInit = false;
		return {
			reset() {
				stream.reset();
				hasInit = false;
			},
			finish() {
				stream.writeByte(constants_default.trailer);
			},
			bytes() {
				return stream.bytes();
			},
			bytesView() {
				return stream.bytesView();
			},
			get buffer() {
				return stream.buffer;
			},
			get stream() {
				return stream;
			},
			writeHeader,
			writeFrame(index, width, height, opts = {}) {
				const { transparent = false, transparentIndex = 0, delay = 0, palette = null, repeat = 0, colorDepth = 8, dispose = -1 } = opts;
				let first = false;
				if (auto) {
					if (!hasInit) {
						first = true;
						writeHeader();
						hasInit = true;
					}
				} else first = Boolean(opts.first);
				width = Math.max(0, Math.floor(width));
				height = Math.max(0, Math.floor(height));
				if (first) {
					if (!palette) throw new Error("First frame must include a { palette } option");
					encodeLogicalScreenDescriptor(stream, width, height, palette, colorDepth);
					encodeColorTable(stream, palette);
					if (repeat >= 0) encodeNetscapeExt(stream, repeat);
				}
				const delayTime = Math.round(delay / 10);
				encodeGraphicControlExt(stream, dispose, delayTime, transparent, transparentIndex);
				const useLocalColorTable = Boolean(palette) && !first;
				encodeImageDescriptor(stream, width, height, useLocalColorTable ? palette : null);
				if (useLocalColorTable) encodeColorTable(stream, palette);
				encodePixels(stream, index, width, height, colorDepth, accum, htab, codetab);
			}
		};
		function writeHeader() {
			writeUTFBytes(stream, "GIF89a");
		}
	}
	function encodeGraphicControlExt(stream, dispose, delay, transparent, transparentIndex) {
		stream.writeByte(33);
		stream.writeByte(249);
		stream.writeByte(4);
		if (transparentIndex < 0) {
			transparentIndex = 0;
			transparent = false;
		}
		var transp, disp;
		if (!transparent) {
			transp = 0;
			disp = 0;
		} else {
			transp = 1;
			disp = 2;
		}
		if (dispose >= 0) disp = dispose & 7;
		disp <<= 2;
		stream.writeByte(disp | 0 | transp);
		writeUInt16(stream, delay);
		stream.writeByte(transparentIndex || 0);
		stream.writeByte(0);
	}
	function encodeLogicalScreenDescriptor(stream, width, height, palette, colorDepth = 8) {
		const globalColorTableSize = colorTableSize(palette.length) - 1;
		const fields = colorDepth - 1 << 4 | 128 | globalColorTableSize;
		const backgroundColorIndex = 0;
		const pixelAspectRatio = 0;
		writeUInt16(stream, width);
		writeUInt16(stream, height);
		stream.writeBytes([
			fields,
			backgroundColorIndex,
			pixelAspectRatio
		]);
	}
	function encodeNetscapeExt(stream, repeat) {
		stream.writeByte(33);
		stream.writeByte(255);
		stream.writeByte(11);
		writeUTFBytes(stream, "NETSCAPE2.0");
		stream.writeByte(3);
		stream.writeByte(1);
		writeUInt16(stream, repeat);
		stream.writeByte(0);
	}
	function encodeColorTable(stream, palette) {
		const colorTableLength = 1 << colorTableSize(palette.length);
		for (let i = 0; i < colorTableLength; i++) {
			let color = [
				0,
				0,
				0
			];
			if (i < palette.length) color = palette[i];
			stream.writeByte(color[0]);
			stream.writeByte(color[1]);
			stream.writeByte(color[2]);
		}
	}
	function encodeImageDescriptor(stream, width, height, localPalette) {
		stream.writeByte(44);
		writeUInt16(stream, 0);
		writeUInt16(stream, 0);
		writeUInt16(stream, width);
		writeUInt16(stream, height);
		if (localPalette) {
			const palSize = colorTableSize(localPalette.length) - 1;
			stream.writeByte(128 | palSize);
		} else stream.writeByte(0);
	}
	function encodePixels(stream, index, width, height, colorDepth = 8, accum, htab, codetab) {
		lzwEncode_default(width, height, index, colorDepth, stream, accum, htab, codetab);
	}
	function writeUInt16(stream, short) {
		stream.writeByte(short & 255);
		stream.writeByte(short >> 8 & 255);
	}
	function writeUTFBytes(stream, text) {
		for (var i = 0; i < text.length; i++) stream.writeByte(text.charCodeAt(i));
	}
	function colorTableSize(length) {
		return Math.max(Math.ceil(Math.log2(length)), 1);
	}
	var src_default = GIFEncoder;
})))();
var state = {
	encoder: null,
	width: 0,
	height: 0,
	frameCount: 0,
	isInitialized: false
};
function initializeEncoder(width, height) {
	state.encoder = (0, import_gifenc.GIFEncoder)();
	state.width = width;
	state.height = height;
	state.frameCount = 0;
	state.isInitialized = true;
}
function addFrame(imageData, width, height, delay, maxColors = 256) {
	if (!state.isInitialized || state.width !== width || state.height !== height) initializeEncoder(width, height);
	if (!state.encoder) throw new Error("GIF encoder not initialized");
	const palette = (0, import_gifenc.quantize)(imageData, maxColors, { format: "rgb444" });
	const indexedPixels = (0, import_gifenc.applyPalette)(imageData, palette, "rgb444");
	state.encoder.writeFrame(indexedPixels, width, height, {
		palette,
		delay,
		dispose: 2
	});
	state.frameCount++;
}
function finishEncoding() {
	if (!state.encoder) throw new Error("GIF encoder not initialized");
	state.encoder.finish();
	const bytes = state.encoder.bytes();
	resetEncoder();
	return bytes;
}
function resetEncoder() {
	if (state.encoder) state.encoder.reset();
	state.encoder = null;
	state.width = 0;
	state.height = 0;
	state.frameCount = 0;
	state.isInitialized = false;
}
function isGifMessage(message) {
	if (!message || typeof message !== "object") return false;
	const msg = message;
	if (msg.target !== MessageTarget.Offscreen) return false;
	return [
		OFFSCREEN_MESSAGE_TYPES.GIF_ADD_FRAME,
		OFFSCREEN_MESSAGE_TYPES.GIF_FINISH,
		OFFSCREEN_MESSAGE_TYPES.GIF_RESET
	].includes(msg.type);
}
function handleGifMessage(message, sendResponse) {
	if (!isGifMessage(message)) return false;
	try {
		switch (message.type) {
			case OFFSCREEN_MESSAGE_TYPES.GIF_ADD_FRAME: {
				const { imageData, width, height, delay, maxColors } = message;
				addFrame(new Uint8ClampedArray(imageData), width, height, delay, maxColors);
				sendResponse({
					success: true,
					frameCount: state.frameCount
				});
				break;
			}
			case OFFSCREEN_MESSAGE_TYPES.GIF_FINISH: {
				const gifBytes = finishEncoding();
				sendResponse({
					success: true,
					gifData: Array.from(gifBytes),
					byteLength: gifBytes.byteLength
				});
				break;
			}
			case OFFSCREEN_MESSAGE_TYPES.GIF_RESET:
				resetEncoder();
				sendResponse({ success: true });
				break;
			default: sendResponse({
				success: false,
				error: `Unknown GIF message type`
			});
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error("GIF encoder error:", errorMessage);
		sendResponse({
			success: false,
			error: errorMessage
		});
	}
	return true;
}
console.log("GIF encoder module loaded");
//#endregion
//#region common/rr-v3-keepalive-protocol.ts
/**
* @fileoverview RR V3 Keepalive Protocol Constants
* @description Shared protocol constants for Background-Offscreen keepalive communication
*/
/** Keepalive Port 名称 */
var RR_V3_KEEPALIVE_PORT_NAME = "rr_v3_keepalive";
/** 默认心跳间隔（毫秒） - Offscreen 每隔这个间隔发送 ping */
var DEFAULT_KEEPALIVE_PING_INTERVAL_MS = 2e4;
//#endregion
//#region entrypoints/offscreen/rr-keepalive.ts
/**
* @fileoverview Offscreen Keepalive
* @description Keeps the MV3 service worker alive using an Offscreen Document + Port heartbeat.
*
* Architecture:
* - Offscreen connects to Background (Service Worker) via a named Port.
* - Offscreen sends periodic `keepalive.ping` messages while keepalive is enabled.
* - Background replies with `keepalive.pong` to confirm the channel is alive.
*
* Contract:
* - After `stop`, keepalive must fully stop: no ping loop, no Port, and no reconnection attempts.
* - After `start`, keepalive must (re)connect if needed and resume the ping loop.
*/
var KEEPALIVE_CONTROL_MESSAGE_TYPE = "rr_v3_keepalive.control";
function isKeepaliveControlMessage(value) {
	if (!value || typeof value !== "object") return false;
	const v = value;
	if (v.type !== KEEPALIVE_CONTROL_MESSAGE_TYPE) return false;
	return v.command === "start" || v.command === "stop";
}
var initialized = false;
var keepalivePort = null;
var pingTimer = null;
/** Whether keepalive is desired (set by start/stop commands from Background) */
var keepaliveDesired = false;
var reconnectTimer = null;
/**
* Type guard for KeepaliveMessage.
*/
function isKeepaliveMessage(value) {
	if (!value || typeof value !== "object") return false;
	const v = value;
	const type = v.type;
	if (type !== "keepalive.ping" && type !== "keepalive.pong" && type !== "keepalive.start" && type !== "keepalive.stop") return false;
	return typeof v.timestamp === "number" && Number.isFinite(v.timestamp);
}
/**
* Schedule a reconnect attempt to maintain the Port connection.
* Only reconnect while keepalive is desired.
*/
function scheduleReconnect(delayMs = 1e3) {
	if (!initialized) return;
	if (!keepaliveDesired) return;
	if (reconnectTimer) return;
	reconnectTimer = setTimeout(() => {
		reconnectTimer = null;
		if (!initialized) return;
		if (!keepaliveDesired) return;
		if (!keepalivePort) {
			console.log("[rr-keepalive] Attempting scheduled reconnect...");
			keepalivePort = connectToBackground();
		}
	}, delayMs);
}
/**
* Create a Port connection to Background.
*/
function connectToBackground() {
	var _chrome$runtime;
	if (typeof chrome === "undefined" || !((_chrome$runtime = chrome.runtime) === null || _chrome$runtime === void 0 ? void 0 : _chrome$runtime.connect)) {
		console.warn("[rr-keepalive] chrome.runtime.connect not available");
		return null;
	}
	try {
		const port = chrome.runtime.connect({ name: RR_V3_KEEPALIVE_PORT_NAME });
		port.onMessage.addListener((msg) => {
			if (!isKeepaliveMessage(msg)) return;
			if (msg.type === "keepalive.start") {
				console.log("[rr-keepalive] Received start command via Port");
				startPingLoop();
			} else if (msg.type === "keepalive.stop") {
				console.log("[rr-keepalive] Received stop command via Port");
				stopPingLoop();
			} else if (msg.type === "keepalive.pong") console.debug("[rr-keepalive] Received pong");
		});
		port.onDisconnect.addListener(() => {
			console.log("[rr-keepalive] Port disconnected");
			keepalivePort = null;
			scheduleReconnect(1e3);
		});
		console.log("[rr-keepalive] Connected to background");
		return port;
	} catch (e) {
		console.warn("[rr-keepalive] Failed to connect:", e);
		return null;
	}
}
/**
* Send a ping message to Background.
*/
function sendPing() {
	if (!keepalivePort) keepalivePort = connectToBackground();
	if (!keepalivePort) return;
	const msg = {
		type: "keepalive.ping",
		timestamp: Date.now()
	};
	try {
		keepalivePort.postMessage(msg);
		console.debug("[rr-keepalive] Sent ping");
	} catch (e) {
		console.warn("[rr-keepalive] Failed to send ping:", e);
		keepalivePort = null;
		scheduleReconnect(1e3);
	}
}
/**
* Start the ping loop.
*/
function startPingLoop() {
	if (pingTimer) return;
	keepaliveDesired = true;
	if (!keepalivePort) keepalivePort = connectToBackground();
	sendPing();
	pingTimer = setInterval(() => {
		sendPing();
	}, DEFAULT_KEEPALIVE_PING_INTERVAL_MS);
	console.log(`[rr-keepalive] Ping loop started (interval=${DEFAULT_KEEPALIVE_PING_INTERVAL_MS}ms)`);
}
/**
* Stop the ping loop.
* This must fully stop keepalive: no timer, no Port, and no reconnection attempts.
*/
function stopPingLoop() {
	keepaliveDesired = false;
	if (pingTimer) {
		clearInterval(pingTimer);
		pingTimer = null;
	}
	if (reconnectTimer) {
		clearTimeout(reconnectTimer);
		reconnectTimer = null;
	}
	if (keepalivePort) {
		try {
			keepalivePort.disconnect();
		} catch (_unused) {}
		keepalivePort = null;
	}
	console.log("[rr-keepalive] Ping loop stopped");
}
/**
* Initialize keepalive control handlers.
* @description Registers the runtime control listener and waits for start/stop commands.
*/
function initKeepalive() {
	var _chrome$runtime2, _chrome$runtime3;
	if (initialized) return;
	initialized = true;
	if (typeof chrome === "undefined" || !((_chrome$runtime2 = chrome.runtime) === null || _chrome$runtime2 === void 0 ? void 0 : _chrome$runtime2.onMessage)) {
		console.warn("[rr-keepalive] chrome.runtime.onMessage not available");
		return;
	}
	chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
		if (!isKeepaliveControlMessage(msg)) return;
		if (msg.command === "start") {
			console.log("[rr-keepalive] Received runtime start command");
			startPingLoop();
		} else {
			console.log("[rr-keepalive] Received runtime stop command");
			stopPingLoop();
		}
		try {
			sendResponse({ ok: true });
		} catch (_unused2) {}
	});
	if ((_chrome$runtime3 = chrome.runtime) === null || _chrome$runtime3 === void 0 ? void 0 : _chrome$runtime3.connect) keepalivePort = connectToBackground();
	console.log("[rr-keepalive] Keepalive initialized");
}
//#endregion
//#region entrypoints/offscreen/main.ts
init_asyncToGenerator();
initKeepalive();
var similarityEngine = null;
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
	if (message.target !== MessageTarget.Offscreen) return;
	if (handleGifMessage(message, sendResponse)) return true;
	try {
		switch (message.type) {
			case SendMessageType.SimilarityEngineInit:
			case OFFSCREEN_MESSAGE_TYPES.SIMILARITY_ENGINE_INIT: {
				const initMsg = message;
				console.log("Offscreen: Received similarity engine init message:", message.type);
				handleSimilarityEngineInit(initMsg.config).then(() => sendResponse({ success: true })).catch((error) => sendResponse({
					success: false,
					error: error.message
				}));
				break;
			}
			case SendMessageType.SimilarityEngineComputeBatch: {
				const computeMsg = message;
				handleComputeSimilarityBatch(computeMsg.pairs, computeMsg.options).then((similarities) => sendResponse({
					success: true,
					similarities
				})).catch((error) => sendResponse({
					success: false,
					error: error.message
				}));
				break;
			}
			case OFFSCREEN_MESSAGE_TYPES.SIMILARITY_ENGINE_COMPUTE: {
				const embeddingMsg = message;
				handleGetEmbedding(embeddingMsg.text, embeddingMsg.options).then((embedding) => {
					console.log("Offscreen: Sending embedding response:", {
						length: embedding.length,
						type: typeof embedding,
						constructor: embedding.constructor.name,
						isFloat32Array: embedding instanceof Float32Array,
						firstFewValues: Array.from(embedding.slice(0, 5))
					});
					const embeddingArray = Array.from(embedding);
					console.log("Offscreen: Converted to array:", {
						length: embeddingArray.length,
						type: typeof embeddingArray,
						isArray: Array.isArray(embeddingArray),
						firstFewValues: embeddingArray.slice(0, 5)
					});
					sendResponse({
						success: true,
						embedding: embeddingArray
					});
				}).catch((error) => sendResponse({
					success: false,
					error: error.message
				}));
				break;
			}
			case OFFSCREEN_MESSAGE_TYPES.SIMILARITY_ENGINE_BATCH_COMPUTE: {
				const batchMsg = message;
				handleGetEmbeddingsBatch(batchMsg.texts, batchMsg.options).then((embeddings) => sendResponse({
					success: true,
					embeddings: embeddings.map((emb) => Array.from(emb))
				})).catch((error) => sendResponse({
					success: false,
					error: error.message
				}));
				break;
			}
			case OFFSCREEN_MESSAGE_TYPES.SIMILARITY_ENGINE_STATUS:
				handleGetEngineStatus().then((status) => sendResponse(_objectSpread2({ success: true }, status))).catch((error) => sendResponse({
					success: false,
					error: error.message
				}));
				break;
			default: sendResponse({ error: `Unknown message type: ${message.type}` });
		}
	} catch (error) {
		if (error instanceof Error) sendResponse({ error: error.message });
		else sendResponse({ error: "Unknown error occurred" });
	}
	return true;
});
var currentModelConfig = null;
/**
* Check if engine reinitialization is needed
*/
function needsReinitialization(newConfig) {
	if (!similarityEngine || !currentModelConfig) return true;
	for (const field of [
		"modelPreset",
		"modelVersion",
		"modelIdentifier",
		"dimension"
	]) if (newConfig[field] !== currentModelConfig[field]) {
		console.log(`Offscreen: ${field} changed from ${currentModelConfig[field]} to ${newConfig[field]}`);
		return true;
	}
	return false;
}
/**
* Initialize semantic similarity engine
*/
function handleSimilarityEngineInit(_x2) {
	return _handleSimilarityEngineInit.apply(this, arguments);
}
function _handleSimilarityEngineInit() {
	_handleSimilarityEngineInit = _asyncToGenerator(function* (config) {
		console.log("Offscreen: Initializing semantic similarity engine with config:", config);
		console.log("Offscreen: Config useLocalFiles:", config.useLocalFiles);
		console.log("Offscreen: Config modelPreset:", config.modelPreset);
		console.log("Offscreen: Config modelVersion:", config.modelVersion);
		console.log("Offscreen: Config modelDimension:", config.modelDimension);
		console.log("Offscreen: Config modelIdentifier:", config.modelIdentifier);
		const needsReinit = needsReinitialization(config);
		console.log("Offscreen: Needs reinitialization:", needsReinit);
		if (!needsReinit) {
			console.log("Offscreen: Using existing engine (no changes detected)");
			yield updateModelStatus("ready", 100);
			return;
		}
		if (similarityEngine) {
			console.log("Offscreen: Cleaning up existing engine for model switch...");
			try {
				yield similarityEngine.dispose();
				console.log("Offscreen: Previous engine disposed successfully");
			} catch (error) {
				console.warn("Offscreen: Failed to dispose previous engine:", error);
			}
			similarityEngine = null;
			currentModelConfig = null;
			try {
				console.log("Offscreen: Clearing IndexedDB vector data for model switch...");
				yield clearVectorIndexedDB();
				console.log("Offscreen: IndexedDB vector data cleared successfully");
			} catch (error) {
				console.warn("Offscreen: Failed to clear IndexedDB vector data:", error);
			}
		}
		try {
			yield updateModelStatus("initializing", 10);
			const progressCallback = function() {
				var _ref = _asyncToGenerator(function* (progress) {
					console.log("Offscreen: Progress update:", progress);
					yield updateModelStatus(progress.status, progress.progress);
				});
				return function progressCallback(_x) {
					return _ref.apply(this, arguments);
				};
			}();
			similarityEngine = new SemanticSimilarityEngine(config);
			console.log("Offscreen: Starting engine initialization with progress tracking...");
			if (typeof similarityEngine.initializeWithProgress === "function") yield similarityEngine.initializeWithProgress(progressCallback);
			else {
				console.log("Offscreen: Using standard initialization (no progress callback support)");
				yield updateModelStatus("downloading", 30);
				yield similarityEngine.initialize();
				yield updateModelStatus("ready", 100);
			}
			currentModelConfig = _objectSpread2({}, config);
			console.log("Offscreen: Semantic similarity engine initialized successfully");
		} catch (error) {
			console.error("Offscreen: Failed to initialize semantic similarity engine:", error);
			const errorMessage = error instanceof Error ? error.message : "Unknown initialization error";
			yield updateModelStatus("error", 0, errorMessage, analyzeErrorType(errorMessage));
			similarityEngine = null;
			currentModelConfig = null;
			throw error;
		}
	});
	return _handleSimilarityEngineInit.apply(this, arguments);
}
/**
* Clear vector data in IndexedDB
*/
function clearVectorIndexedDB() {
	return _clearVectorIndexedDB.apply(this, arguments);
}
function _clearVectorIndexedDB() {
	_clearVectorIndexedDB = _asyncToGenerator(function* () {
		try {
			for (const dbName of [
				"VectorSearchDB",
				"ContentIndexerDB",
				"SemanticSimilarityDB"
			]) try {
				const deleteRequest = indexedDB.deleteDatabase(dbName);
				yield new Promise((resolve, _reject) => {
					deleteRequest.onsuccess = () => {
						console.log(`Offscreen: Successfully deleted database: ${dbName}`);
						resolve();
					};
					deleteRequest.onerror = () => {
						console.warn(`Offscreen: Failed to delete database: ${dbName}`, deleteRequest.error);
						resolve();
					};
					deleteRequest.onblocked = () => {
						console.warn(`Offscreen: Database deletion blocked: ${dbName}`);
						resolve();
					};
				});
			} catch (error) {
				console.warn(`Offscreen: Error deleting database ${dbName}:`, error);
			}
		} catch (error) {
			console.error("Offscreen: Failed to clear vector IndexedDB:", error);
			throw error;
		}
	});
	return _clearVectorIndexedDB.apply(this, arguments);
}
function analyzeErrorType(errorMessage) {
	const message = errorMessage.toLowerCase();
	if (message.includes("network") || message.includes("fetch") || message.includes("timeout") || message.includes("connection") || message.includes("cors") || message.includes("failed to fetch")) return "network";
	if (message.includes("corrupt") || message.includes("invalid") || message.includes("format") || message.includes("parse") || message.includes("decode") || message.includes("onnx")) return "file";
	return "unknown";
}
function updateModelStatus(_x3, _x4, _x5, _x6) {
	return _updateModelStatus.apply(this, arguments);
}
function _updateModelStatus() {
	_updateModelStatus = _asyncToGenerator(function* (status, progress, errorMessage, errorType) {
		try {
			const modelState = {
				status,
				downloadProgress: progress,
				isDownloading: status === "downloading" || status === "initializing",
				lastUpdated: Date.now(),
				errorMessage: errorMessage || "",
				errorType: errorType || ""
			};
			if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) yield chrome.storage.local.set({ modelState });
			else {
				console.log("Offscreen: chrome.storage not available, sending message to background");
				try {
					yield chrome.runtime.sendMessage({
						type: BACKGROUND_MESSAGE_TYPES.UPDATE_MODEL_STATUS,
						modelState
					});
				} catch (messageError) {
					console.error("Offscreen: Failed to send status update message:", messageError);
				}
			}
		} catch (error) {
			console.error("Offscreen: Failed to update model status:", error);
		}
	});
	return _updateModelStatus.apply(this, arguments);
}
/**
* Batch compute semantic similarity
*/
function handleComputeSimilarityBatch(_x7) {
	return _handleComputeSimilarityBatch.apply(this, arguments);
}
function _handleComputeSimilarityBatch() {
	_handleComputeSimilarityBatch = _asyncToGenerator(function* (pairs, options = {}) {
		if (!similarityEngine) throw new Error("Similarity engine not initialized. Please reinitialize the engine.");
		console.log(`Offscreen: Computing similarities for ${pairs.length} pairs`);
		const similarities = yield similarityEngine.computeSimilarityBatch(pairs, options);
		console.log("Offscreen: Similarity computation completed");
		return similarities;
	});
	return _handleComputeSimilarityBatch.apply(this, arguments);
}
/**
* Get embedding vector for single text
*/
function handleGetEmbedding(_x8) {
	return _handleGetEmbedding.apply(this, arguments);
}
function _handleGetEmbedding() {
	_handleGetEmbedding = _asyncToGenerator(function* (text, options = {}) {
		if (!similarityEngine) throw new Error("Similarity engine not initialized. Please reinitialize the engine.");
		console.log(`Offscreen: Getting embedding for text: "${text.substring(0, 50)}..."`);
		const embedding = yield similarityEngine.getEmbedding(text, options);
		console.log("Offscreen: Embedding computation completed");
		return embedding;
	});
	return _handleGetEmbedding.apply(this, arguments);
}
/**
* Batch get embedding vectors for texts
*/
function handleGetEmbeddingsBatch(_x9) {
	return _handleGetEmbeddingsBatch.apply(this, arguments);
}
function _handleGetEmbeddingsBatch() {
	_handleGetEmbeddingsBatch = _asyncToGenerator(function* (texts, options = {}) {
		if (!similarityEngine) throw new Error("Similarity engine not initialized. Please reinitialize the engine.");
		console.log(`Offscreen: Getting embeddings for ${texts.length} texts`);
		const embeddings = yield similarityEngine.getEmbeddingsBatch(texts, options);
		console.log("Offscreen: Batch embedding computation completed");
		return embeddings;
	});
	return _handleGetEmbeddingsBatch.apply(this, arguments);
}
/**
* Get engine status
*/
function handleGetEngineStatus() {
	return _handleGetEngineStatus.apply(this, arguments);
}
function _handleGetEngineStatus() {
	_handleGetEngineStatus = _asyncToGenerator(function* () {
		return {
			isInitialized: !!similarityEngine,
			currentConfig: currentModelConfig
		};
	});
	return _handleGetEngineStatus.apply(this, arguments);
}
console.log("Offscreen: Semantic similarity engine handler loaded");
//#endregion
