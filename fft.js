function ifft(x){
    //Interchange real and imaginary parts
    let y = [];
    for(let i = 0; i < x.length; i++){
        y[i] = [ x[i][1], x[i][0] ];
    }

    //Apply fft
    let Y = fft(y);

    //Interchange real and imaginary parts and normalize
    var z = [];
    for(let i = 0; i < Y.length; i++){
        z[i] = [ Y[i][1] / Y.length, Y[i][0] / Y.length ];
    }

    return z;
}


var mapExponent = {};
function exponent(k, N) {
    const x = -2 * Math.PI * (k / N);

    mapExponent[N] = mapExponent[N] || {};
    mapExponent[N][k] = mapExponent[N][k] || [Math.cos(x), Math.sin(x)]; // [Real, Imaginary]

    return mapExponent[N][k];
}

function fft(x) {
    const X = [];
    const N = x.length;

    // Base case is X = x + 0i since our input is assumed to be real only.
    if (N == 1) {
	if (Array.isArray(x[0])) //If input vector contains complex numbers
	    return [[x[0][0], x[0][1]]];
	else
	    return [[x[0], 0]];
    }

    // Recurse: all even samples
    const X_evens = fft(x.filter(even));

    // Recurse: all odd samples
    const X_odds  = fft(x.filter(odd));

    // Now, perform N/2 operations!
    for (var k = 0; k < N / 2; k++) {
	// t is a complex number!
	const t = X_evens[k];
	const e = complexMultiply(exponent(k, N), X_odds[k]);

	X[k] = complexAdd(t, e);
	X[k + (N / 2)] = complexSubtract(t, e);
    }

    function even(__, ix) {
	return ix % 2 == 0;
    }

    function odd(__, ix) {
	return ix % 2 == 1;
    }

    return X;
}
