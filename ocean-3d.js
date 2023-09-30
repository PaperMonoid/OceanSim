let camera, scene, renderer;
let geometry, material, mesh;
let startTime;
let oceanTexture;
let lastUpdateTime;

init();
animate();

function init() {
    // initialize animation timer
    lastUpdateTime = Date.now();

    // Camera and scene setup
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.set(-1, -1, 0.1);
    camera.rotation.set(1, 0, 0);
    //camera.lookAt(new THREE.Vector3(0, 0, 0)); // Make the camera look at the center of the scene
    scene = new THREE.Scene();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White directional light
    directionalLight.position.set(1, 2, 4);
    scene.add(directionalLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x0000ff, 0.6);
    scene.add(hemisphereLight);

    // Create a subdivided plane
    geometry = new THREE.PlaneGeometry(5, 5, SIZE - 1, SIZE - 1); // One less subdivision than the texture size

    // Blue material for the mesh0x007d73
    // Use a basic default texture first.
    const initialTextureData = new Uint8Array(SIZE * SIZE * 4).fill(255); // RGBA white for starters.
    oceanTexture = new THREE.DataTexture(initialTextureData, SIZE, SIZE, THREE.RGBAFormat);
    material = new THREE.MeshStandardMaterial({ map: oceanTexture });

    // Create and add the mesh to the scene
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
    });

    startTime = Date.now();

}

function fixTexture(buffer) {
    const heights = new Float32Array(buffer);
    const color = new Float32Array(SIZE * SIZE * 4);

    const deepColor = [0, 74, 68];
    const shallowColor = [214, 234, 255];

    for(let i = 0; i < SIZE; i++) {
	for(let j = 0; j < SIZE; j++) {
	    const index = i * SIZE + j;
	    const height = buffer[index];

	    // Aumentar contraste
	    const contrastedHeight = enhanceContrast((height + 1) / 2); // Convertir a rango [0,1] y aplicar contraste

	    // Interpolar colores
	    const [r, g, b] = lerpColor(deepColor, shallowColor, contrastedHeight);

	    // Asignar el color al pixel en imgData
	    color[index * 4] = r;   // R
	    color[index * 4 + 1] = g; // G
	    color[index * 4 + 2] = b; // B
	    color[index * 4 + 3] = 255; // A is set to max value 255
	}
    }

    return [heights, color];
}

function animate() {
    requestAnimationFrame(animate);

    const currentTime = Date.now();
    const deltaTime = currentTime - lastUpdateTime;

    if (deltaTime >= 42) {
        const t = Date.now() / 1000;
        const [heightData, colorData] = fixTexture(generateOceanTexture(t));

        oceanTexture.image.data.set(colorData);
        oceanTexture.needsUpdate = true;

        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i + 2] = heightData[i / 3] * 1; // Adjust the 0.1 value to control the displacement magnitude
        }
        geometry.attributes.position.needsUpdate = true;
	lastUpdateTime = currentTime; // Update the last update time
    }

    renderer.render(scene, camera);
}
