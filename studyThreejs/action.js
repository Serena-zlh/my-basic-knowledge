let scene;
let camera;
let renderer;

// 正方体
let geometry;
let material;
let cube;

// 画线
let L_material;
let L_geometry;
let line;

// 写字
let T_geometry;

function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set( 0, 0, 100 );
    camera.lookAt( 0, 0, 0 );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

// 正方体
function initBox() {
    geometry = new THREE.BoxGeometry();
    material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 15;
}

// 画线
function initLine() {
    L_material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    var points = [];
    points.push( new THREE.Vector3( - 10, 0, 0 ) );
    points.push( new THREE.Vector3( 0, 10, 0 ) );
    points.push( new THREE.Vector3( 10, 0, 0 ) );
    // points.push( new THREE.Vector3( - 10, 0, 0 ) ); // 加上这行就是一个完整三角形

    L_geometry = new THREE.BufferGeometry().setFromPoints( points );
    line = new THREE.Line( L_geometry, L_material );
    scene.add( line );
}

// 写字
function initText() {
    T_geometry = new THREE.TextGeometry( 'Hello three.js!');
}
function animate() {
    if (cube) {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.05;
    }
    
    renderer.render(scene, camera);
}

function start() {
    initScene();
    initBox();
    
    initLine();

    // 渲染上去
    animate();
    window.scene = scene;
}







start()