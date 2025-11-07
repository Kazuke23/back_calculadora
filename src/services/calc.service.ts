import type { OpName } from "../models/Record.js";

const ALLOWED = new Set<OpName>([
  "add","sub","mul","div","pow","sqrt","percent","fact"
]);

function assertAllowed(op: string): asserts op is OpName {
  if (!ALLOWED.has(op as OpName)) {
    throw new Error(`Operación no soportada. Use: ${Array.from(ALLOWED).join(", ")}`);
  }
}

function assertNumber(n: unknown, name = "valor"): asserts n is number {
  if (typeof n !== "number" || Number.isNaN(n) || !Number.isFinite(n)) {
    throw new Error(`'${name}' debe ser un número válido`);
  }
}

function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("Factorial requiere entero >= 0");
  }
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

export function compute(op: string, a: unknown, b?: unknown): number {
  assertAllowed(op);

  switch (op) {
    case "add":
    case "sub":
    case "mul":
    case "div":
    case "pow":
    case "percent": {
      assertNumber(a, "a");
      assertNumber(b, "b");
      break;
    }
    case "sqrt":
    case "fact": {
      assertNumber(a, "a");
      break;
    }
  }

  switch (op) {
    case "add": return (a as number) + (b as number);
    case "sub": return (a as number) - (b as number);
    case "mul": return (a as number) * (b as number);
    case "div": {
      if ((b as number) === 0) throw new Error("División por cero no permitida");
      return (a as number) / (b as number);
    }
    case "pow": return Math.pow(a as number, b as number);
    case "sqrt": {
      if ((a as number) < 0) throw new Error("Raíz cuadrada requiere a >= 0");
      return Math.sqrt(a as number);
    }
    case "percent": return ((a as number) / 100) * (b as number);
    case "fact":   return factorial(Math.trunc(a as number));
  }
}
