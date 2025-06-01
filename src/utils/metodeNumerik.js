import { compile, derivative } from "mathjs";

function hitungFungsi(expr, x) {
  return compile(expr).evaluate({ x });
}

function cariTitikPotong(x0, x1, fx0, fx1) {
  return (fx1 * x0 - fx0 * x1) / (fx1 - fx0);
}

function selisihError(a, b) {
  return Math.abs(a - b);
}

export function bagidua(xL, xR, fungsiStr, galat) {
  const f = (x) => hitungFungsi(fungsiStr, x);
  let riwayat = [];

  function rekursif(a, b) {
    const fa = f(a),
      fb = f(b);
    if (fa * fb > 0) return [0, riwayat];
    const xm = (a + b) / 2;
    const fm = f(xm);
    const lebar = Math.abs(b - a);
    riwayat.push([a, xm, b, fa, fm, fb, lebar]);
    if (lebar < galat) return [xm, riwayat];
    return fa * fm < 0 ? rekursif(a, xm) : rekursif(xm, b);
  }

  return rekursif(xL, xR);
}

export function regulaFalsi(x0, x1, fungsiStr, galat) {
  const f = (x) => hitungFungsi(fungsiStr, x);
  let riwayat = [];

  function rekursif(a, b) {
    const fa = f(a),
      fb = f(b);
    const c = cariTitikPotong(a, b, fa, fb);
    const fc = f(c);
    const err = Math.abs(fc);
    riwayat.push([a, c, b, fa, fb, fc, err]);
    if (err < galat) return [c, riwayat];
    return fa * fc < 0 ? rekursif(a, c) : rekursif(c, b);
  }

  return rekursif(x0, x1);
}

export function iterasiSederhana(xAwal, gxStr, galat, iterasiMaks = 30) {
  const g = (x) => hitungFungsi(gxStr, x);
  let x = xAwal;
  for (let i = 0; i < iterasiMaks; i++) {
    const xNext = g(x);
    if (!isFinite(xNext)) return [Infinity, []];
    const err = selisihError(xNext, x);
    if (err < galat) return [xNext, []];
    x = xNext;
  }
  return [Infinity, []];
}

export function newtonRaphson(xAwal, fxStr, galat) {
  const f = (x) => hitungFungsi(fxStr, x);
  const df = (x) => derivative(fxStr, "x").evaluate({ x });
  let riwayat = [];

  function rekursif(x) {
    const fx = f(x);
    const dfx = df(x);
    const xBaru = x - fx / dfx;
    const err = selisihError(xBaru, x);
    riwayat.push([x, fx, dfx, xBaru, err]);
    if (err < galat) return [xBaru, riwayat];
    return rekursif(xBaru);
  }

  return rekursif(xAwal);
}

export function secant(x0, x1, fxStr, galat) {
  const f = (x) => hitungFungsi(fxStr, x);
  let riwayat = [];

  function rekursif(a, b) {
    const fa = f(a),
      fb = f(b);
    if (fa === fb) return [Infinity, riwayat];
    const xBaru = b - (fb * (b - a)) / (fb - fa);
    const err = selisihError(xBaru, b);
    riwayat.push([a, b, fa, fb, xBaru, err]);
    if (err < galat) return [xBaru, riwayat];
    return rekursif(b, xBaru);
  }

  return rekursif(x0, x1);
}
