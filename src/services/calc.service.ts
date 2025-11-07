type OpName = "add" | "sub" | "mul" | "div";

/* =======================
   Bitwise integer helpers
   ======================= */

function addBitwise(a: number, b: number): number {
  a |= 0; b |= 0;
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = a ^ b;
    b = carry;
  }
  return a | 0;
}

function subBitwise(a: number, b: number): number {
  a |= 0; b |= 0;
  while (b !== 0) {
    const borrow = (~a) & b;
    a = a ^ b;
    b = borrow << 1;
  }
  return a | 0;
}

function mulBitwise(a: number, b: number): number {
  const neg = (a < 0) !== (b < 0);
  a = Math.abs(a) | 0; b = Math.abs(b) | 0;
  let res = 0 | 0;
  while (b !== 0) {
    if ((b & 1) === 1) res = addBitwise(res, a);
    a = a << 1;
    b = b >>> 1;
  }
  return neg ? subBitwise(0, res) : res;
}

function divBitwise(a: number, b: number): number {
  if (b === 0) throw new Error("División por cero no permitida");
  const neg = (a < 0) !== (b < 0);
  let dividend = Math.abs(a) | 0;
  const divisor = Math.abs(b) | 0;

  let q = 0 | 0;
  let power = 31;
  let divShift = divisor << power;

  while ((divShift >>> 0) > (dividend >>> 0) && power > 0) {
    power = subBitwise(power, 1);
    divShift = divisor << power;
  }

  while (power >= 0) {
    if ((dividend >>> 0) >= (divShift >>> 0)) {
      dividend = subBitwise(dividend, divShift);
      q = q | (1 << power);
    }
    power = subBitwise(power, 1);
    divShift = divisor << power;
  }
  return neg ? subBitwise(0, q) : q;
}

/* =======================
   Decimal helpers
   ======================= */

type Dec = { m: number; s: number; neg: boolean }; // mantisa, escala (decimals), signo

// Convierte número JS a {mantisa, escala} sin usar * /
// Usa string para separar parte decimal. Evita notación exponencial en inputs típicos.
function toDec(x: number): Dec {
  if (!Number.isFinite(x)) throw new Error("Valor no finito");
  const neg = x < 0;
  const s = String(Math.abs(x)); // e.g. "12.34"
  const dot = s.indexOf(".");
  if (dot === -1) {
    // entero
    const m = parseInt(s || "0", 10) | 0;
    return { m, s: 0, neg };
  } else {
    const frac = s.slice(dot + 1);
    const intp = s.slice(0, dot) || "0";
    const digits = (intp + frac).replace(/^0+(?!$)/, "");
    const mant = parseInt(digits || "0", 10) | 0;
    return { m: mant, s: frac.length, neg };
  }
}

// 10^k como entero, sin usar ** ni *
function pow10(k: number): number {
  let r = 1 | 0;
  let ten = 10 | 0;
  while (k-- > 0) r = mulBitwise(r, ten);
  return r | 0;
}

// Normaliza dos Dec a una misma escala (la mayor)
function alignScales(a: Dec, b: Dec): { a2: Dec; b2: Dec; s: number } {
  if (a.s === b.s) return { a2: a, b2: b, s: a.s };
  if (a.s > b.s) {
    const diff = subBitwise(a.s | 0, b.s | 0);
    const mul = pow10(diff);
    const b2 = { ...b, m: mulBitwise(b.m, mul), s: a.s };
    return { a2: a, b2, s: a.s };
  } else {
    const diff = subBitwise(b.s | 0, a.s | 0);
    const mul = pow10(diff);
    const a2 = { ...a, m: mulBitwise(a.m, mul), s: b.s };
    return { a2, b2: b, s: b.s };
  }
}

// Aplica signo a una mantisa
function applySign(m: number, neg: boolean) {
  return neg ? subBitwise(0, m) : m;
}

// Convierte {mantisa, escala, signo} a Number sin usar /
// Se arma como string e interpreta con parseFloat (permitido).
function decToNumber({ m, s, neg }: Dec): number {
  const absM = Math.abs(m);
  const sign = (neg && absM !== 0) ? "-" : "";
  const str = String(absM);
  if (s === 0) return parseFloat(sign + str);
  const pad = s - str.length;
  if (pad >= 0) {
    // 0.xyz...
    const zeros = "0".repeat(pad);
    return parseFloat(`${sign}0.${zeros}${str}`);
  } else {
    // abcdef with decimal point
    const split = str.length - s;
    return parseFloat(`${sign}${str.slice(0, split)}.${str.slice(split)}`);
  }
}

/* =======================
   Operaciones decimales
   ======================= */

function addDec(a: number, b: number): number {
  const A = toDec(a), B = toDec(b);
  const { a2, b2, s } = alignScales(A, B);
  const am = applySign(a2.m, A.neg);
  const bm = applySign(b2.m, B.neg);
  const rm = addBitwise(am, bm); // suma de mantisas con signo
  const R: Dec = { m: Math.abs(rm), s, neg: rm < 0 };
  return decToNumber(R);
}

function subDec(a: number, b: number): number {
  // a - b = a + (-b)
  return addDec(a, -b);
}

function mulDec(a: number, b: number): number {
  const A = toDec(a), B = toDec(b);
  // mantisa = m1 * m2 ; escala = s1 + s2
  const m = mulBitwise(applySign(A.m, A.neg), applySign(B.m, B.neg));
  const s = addBitwise(A.s | 0, B.s | 0);
  const R: Dec = { m: Math.abs(m), s, neg: m < 0 };
  return decToNumber(R);
}

function divDec(a: number, b: number, precision: number): number {
  if (b === 0) throw new Error("División por cero no permitida");
  const A = toDec(a), B = toDec(b);

  // Queremos: (m1 * 10^(precision + s2 - s1)) / m2
  const exp = addBitwise(precision | 0, subBitwise(B.s | 0, A.s | 0));
  const factor = pow10(Math.max(exp, 0));
  const signA = applySign(A.m, A.neg);
  const signB = applySign(B.m, B.neg);

  let num = mulBitwise(signA, factor); // escala el dividendo para obtener decimales
  const den = signB;

  const q = divBitwise(num, den); // cociente entero ya escalado a 'precision'
  const neg = q < 0;

  // El resultado final tiene 'precision' decimales6
  const R: Dec = { m: Math.abs(q), s: precision, neg };
  return decToNumber(R);
}

export function computeDecimal(op: OpName, a: number, b: number, divPrecision = 8): number {
  switch (op) {
    case "add": return addDec(a, b);
    case "sub": return subDec(a, b);
    case "mul": return mulDec(a, b);
    case "div": return divDec(a, b, divPrecision);
    default: throw new Error("Operación no soportada");
  }
}
