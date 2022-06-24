const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const settings = {
    dimensions: [2048, 2048]
};


const velocity = 1;
const gridcolumns = 20;
const renderInterval = 1000 / 60;

const sketch = () => {
    const density = 1;
    const createGrid = (count) => {
        const points = []
        // const count = 30;
        for (let x = 0; x < count; x++) {
            for (let y = 0; y < count; y++) {
                const u = count <= 1 ? 0.5 : x / (count - 1);
                const v = count <= 1 ? 0.5 : y / (count - 1);

                posx = lerp(margin, settings.dimensions[0] - margin, u);
                posy = lerp(margin, settings.dimensions[1] - margin, v);

                const p = [posx, posy];
                // const radius = random.value() * 100;
                const radius = 30;
                points.push({
                    position: p,
                    radius: radius,
                    color:
                        random.pick(['#7209b7', '#4ea8de', '#6930c3', '#480ca8', '#3f37c9', '#4361ee', '#560bad', '#4cc9f0', '#70d6ff']),
                    factorx: random.pick([-velocity, velocity]),

                    factory: random.pick([-velocity, velocity]),
                    mass: 1 * density,
                    type: random.pick(['solid', 'hollow'])
                });
            }
        }
        // console.log(points)
        return points
    }
    const margin = 100;
    let points = createGrid(gridcolumns);
    // random.setSeed(512)
    return ({ context, width, height }) => {

        context.fillStyle = 'white';
        context.fillRect(0, 0, width, height);


        for (let k = 0; k < points.length; k++) {
            point = points[k]

            context.beginPath();
            context.arc(point.position[0], point.position[1], point.radius, 0, Math.PI * 2, false);
            context.fillStyle = '#333';
            context.fill()
        }

        setInterval(() => {
            // console.log(points)
            // reset canvas
            context.fillStyle = 'white';
            context.fillRect(0, 0, width, height);

            for (let k = 0; k < points.length; k++) {
                point = points[k]
                let collision = false
                
                const newX = point.position[0] + point.factorx
                const newY = point.position[1] + point.factory

                point.position[0] = newX
                point.position[1] = newY

                if (newX < margin || newX > settings.dimensions[0] - margin) {
                    point.factorx = -point.factorx
                }
                if (newY < margin || newY > settings.dimensions[1] - margin) {
                    point.factory = -point.factory
                }

                // context.beginPath();
                // context.arc(newX, newY, point.radius, 0, Math.PI * 2, false);
                // context.fillStyle = '#333';
                // context.fill()

                // console.log('------')
                // console.log('Previous X : ', point.position[0])
                // console.log('New X :',newX)
                // console.log('------')
                let angle = 0
                for (let l = 0; l < points.length; l++) {
                    if (k !== l) {
                        point2 = points[l]
                        dx = newX - point2.position[0]
                        dy = newY - point2.position[1]
                        dist = Math.sqrt(dx * dx + dy * dy)

                        if (dist < point.radius + point2.radius) {
                            collision = true
                            angle = Math.atan2(dy, dx)
                            break
                        }
                    }
                }
                if (collision) {

                    // Elastic Collision with Convervation of momentum

                    const vx1 = point.factorx
                    const vy1 = point.factory
                    const vx2 = point2.factorx
                    const vy2 = point2.factory

                    const vx1f = vx1 * (point.mass - point2.mass) / (point.mass + point2.mass) + vx2 * 2 * point2.mass / (point.mass + point2.mass)
                    const vy1f = vy1 * (point.mass - point2.mass) / (point.mass + point2.mass) + vy2 * 2 * point2.mass / (point.mass + point2.mass)

                    const vx2f = vx2 * (point2.mass - point.mass) / (point2.mass + point.mass) + vx1 * 2 * point.mass / (point2.mass + point.mass)
                    const vy2f = vy2 * (point2.mass - point.mass) / (point2.mass + point.mass) + vy1 * 2 * point.mass / (point2.mass + point.mass)

                    point.factorx = vx1f
                    point.factory = vy1f
                    point2.factorx = vx2f
                    point2.factory = vy2f   

                    // points[k].factorx = -point.factorx
                    // points[k].factory = -point.factory

                    context.beginPath();
                    context.arc(point.position[0], point.position[1], point.radius, 0, Math.PI * 2, false);
                    context.fillStyle = '#333';
                    context.fill()
                }
                else {
                    context.beginPath();
                    context.arc(newX, newY, point.radius, 0, Math.PI * 2, false);
                    context.fillStyle = '#333';
                    context.fill()
                }
            }
        }, renderInterval)

        // setInterval(() => {
        //     // reset canvas
        //     context.fillStyle = 'white';
        //     context.fillRect(0, 0, width, height);
        //     // add one pixel to each point
        //     for (let i = 0; i < 1; i++) {
        //         // for (let i = 0; i < points.length; i++) {
        //         //     const point = points[i];
        //         //     const { position, radius, color, factorx, factory } = point;
        //         //     position[0] = position[0] + 1 * factorx;
        //         //     position[1] = position[1] + 1 * factory;
        //         //     const x = lerp(margin, width - margin, position[0]);
        //         //     const y = lerp(margin, height - margin, position[1]);

        //         //     // check if point is in collision with other points

        //         // }
        //         context.fillStyle = "white";
        //         context.fillRect(0, 0, width, height);
        //         // for loop for points
        //         for (let i = 0; i < points.length; i++) {
        //             const point = points[i];
        //             const { position, radius, color, factorx, factory, mass, type } = point;

        //             const x = position[0];
        //             const y = position[1];

        //             const x1 = x + width * factorx;
        //             const y1 = x + height * factory;

        //             let collision = false;
        //             // check if point is in collision with other points
        //             for (let j = 0; j < points.length; j++) {
        //                 const other = points[j];
        //                 const { position: otherPosition, radius: otherRadius, color: otherColor, factorx: otherFactorx, factory: otherFactory, mass: otherMass, type: otherType } = other;

        //                 x2 = position[0];
        //                 y2 = position[1];

        //                 const dx = x2 - x1;
        //                 const dy = y2 - y1;
        //                 const distance = Math.sqrt(dx * dx + dy * dy);
        //                 if (distance < radius + otherRadius) {
        //                     console.log('collision');
        //                     // resolve collision
        //                     point.factorx = -1 * point.factorx;
        //                     point.factory = -1 * point.factory;
        //                     other.factorx = -1 * other.factorx;
        //                     other.factory = -1 * other.factory;
        //                     collision = true;
        //                     break
        //                 }
        //             }

        //             if (collision){
        //                 context.beginPath();
        //                     context.arc(x, y, radius, 0, Math.PI * 2, false);
        //                     // context.fillStyle = '#333';

        //                     context.fillStyle = color;
        //                     context.fill();
        //             }
        //             else{
        //                 context.beginPath();
        //                     context.arc(x1, y1, radius, 0, Math.PI * 2, false);
        //                     // context.fillStyle = '#333';

        //                     context.fillStyle = color;
        //                     context.fill();
        //             }

        //         }

        //     }
        // }
        //     , 333)
        // console.log(points);
    };
};

canvasSketch(sketch, settings);
