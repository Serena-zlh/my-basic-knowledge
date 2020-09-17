const canvas = document.getElementById('J_myTime');
const ctx = canvas.getContext('2d');

let t = 0;
let x = 100;
let y = 0;
let r = 10;

let g = 10;
let v = 20;

// 重力加速度 
function drawBall(x,y) {
    
    ctx.beginPath();
    ctx.fillStyle = '#f46';
    ctx.arc(x,y,r, 0, 2 * Math.PI);
    ctx.fill()
}
function updateBall() {
    
}
window.onload = function () {
    
    // setInterval(() => {
        t += 1;
        
        x = v * t;
        y += g * t;
        // if (y >= ctx.canvas.height) {
        //     y = ctx.canvas.height/ 2;
        // }
        console.log(y)
        drawBall(x, y)
    // }, 1000)
    
}