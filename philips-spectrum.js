const SIZE = 128;
const GRAVITY = 4 * 9.81;


function getValue(array, i, j, size) {
    return array[i * size + j];
}

function setValue(array, i, j, size, value) {
    array[i * size + j] = value;
}

function ifft2D(complexDataFlat, size) {
    const SIZE = size;
    const spatialData = new Array(SIZE * SIZE);

    // IFFT en las filas
    const row = new Array(SIZE);
    for(let i = 0; i < SIZE; i++) {
        for(let j = 0; j < SIZE; j++) {
            row[j] = complexDataFlat[i * SIZE + j];
        }
        const ifftRow = ifft(row);
        for(let j = 0; j < SIZE; j++) {
            spatialData[i * SIZE + j] = ifftRow[j];
        }
    }

    // IFFT en las columnas
    const col = row;
    for(let j = 0; j < SIZE; j++) {
        for(let i = 0; i < SIZE; i++) {
            col[i] = spatialData[i * SIZE + j];
        }
        const ifftCol = ifft(col);
        for(let i = 0; i < SIZE; i++) {
            spatialData[i * SIZE + j] = ifftCol[i];
        }
    }

    const real = new Array(SIZE * SIZE);
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            const index = i * SIZE + j;
            real[index] = spatialData[index][0];
        }
    }

    return real;
}

function phillipsSpectrum(kx, ky) {
    const kx2 = kx * kx;
    const ky2 = ky * ky;
    const k = Math.sqrt(kx2 + ky2);
    const L = GRAVITY * GRAVITY / (2 * Math.PI);
    const kDotWind = (kx + ky) / Math.sqrt(kx2 + ky2);

    const k2 = k * k;
    const L2 = L * L;

    return Math.exp(-1 / (k2 * L2)) / (k2 * k2) * kDotWind * kDotWind;
}

function generateWaveHeightAtFrequency(kx, ky) {
    const P = phillipsSpectrum(kx, ky);
    const amplitude = Math.sqrt(P);
    const randomPhase = Math.random() * 2 * Math.PI;

    const real = amplitude * Math.cos(randomPhase);
    const imaginary = amplitude * Math.sin(randomPhase);

    return [real, imaginary];
}

function generateInitialWaveHeights() {
    const heights = new Array(SIZE * SIZE);

    for(let i = 1; i <= SIZE; i++) {
        for(let j = 1; j <= SIZE; j++) {
            const kx = (2 * Math.PI * i) / SIZE;
            const ky = (2 * Math.PI * j) / SIZE;
            const index = (i - 1) * SIZE + (j - 1);
            heights[index] = generateWaveHeightAtFrequency(kx, ky);
        }
    }

    return heights;
}

function animateWaveHeights(initialHeights, t) {
    const animatedHeights = new Array(SIZE * SIZE);

    for(let i = 0; i < SIZE; i++) {
        for(let j = 0; j < SIZE; j++) {
            const index = i * SIZE + j;
            const kx = (2 * Math.PI * i) / SIZE;
            const ky = (2 * Math.PI * j) / SIZE;
            const omega = Math.sqrt(GRAVITY * Math.sqrt(kx * kx + ky * ky));

            const height = complexMultiply(
                initialHeights[index],
                [Math.cos(omega * t), Math.sin(omega * t)]
            );

            animatedHeights[index] = height;
        }
    }

    return animatedHeights;
}

const initialHeights = generateInitialWaveHeights();

function generateOceanTexture(t) {
    return ifft2D(animateWaveHeights(initialHeights, t), SIZE);
}
