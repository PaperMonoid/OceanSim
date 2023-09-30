const canvas = document.getElementById('oceanCanvas');
const ctx = canvas.getContext('2d');

function lerpColor(color1, color2, factor) { // linear interpolation to change the colormap
    const r = color1[0] + factor * (color2[0] - color1[0]);
    const g = color1[1] + factor * (color2[1] - color1[1]);
    const b = color1[2] + factor * (color2[2] - color1[2]);
    return [r, g, b];
}

function enhanceContrast(value) { // sigmoid function
    return 1.0 / (1.0 + Math.exp(-100 * (value - 0.5)));
}

canvas.width = SIZE;
canvas.height = SIZE;

let t = 0;

function drawTexture() {
    const buffer = generateOceanTexture(t);
    const heights = new Float32Array(buffer);
    const imgData = ctx.createImageData(SIZE, SIZE);

    const deepColor = [0, 42, 110];
    const shallowColor = [219, 233, 255];

    for(let i = 0; i < SIZE; i++) {
	for(let j = 0; j < SIZE; j++) {
	    const index = i * SIZE + j;
	    const height = heights[index];

	    // Aumentar contraste
	    const contrastedHeight = enhanceContrast((height + 1) / 2); // Convertir a rango [0,1] y aplicar contraste

	    // Interpolar colores
	    const [r, g, b] = lerpColor(deepColor, shallowColor, contrastedHeight);

	    // Asignar el color al pixel en imgData
	    imgData.data[index * 4] = r;
	    imgData.data[index * 4 + 1] = g;
	    imgData.data[index * 4 + 2] = b;
	    imgData.data[index * 4 + 3] = 255; // A
	}
    }

    ctx.putImageData(imgData, 0, 0);

    t += 0.05;
}

setInterval(drawTexture, 20); // Actualiza el canvas cada 100ms
