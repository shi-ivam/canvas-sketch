const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {
  const createGrid = (count) => {
    const points = []
    // const count = 30;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const p = [u, v];
        points.push({
          position: p,
          radius: random.value() * 100,
          color:
            random.pick(['#7209b7', '#4ea8de', '#6930c3', '#480ca8', '#3f37c9', '#4361ee', '#560bad', '#4cc9f0', '#70d6ff']),
            factorx: random.pick([-0.002, 0.002]),

          factory: random.pick([-0.002, 0.002])
        });
      }
    }
    return points
  }
  const margin = 400;
  let points = createGrid(5);
  // random.setSeed(512)
  return ({ context, width, height }) => {

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);


    points.forEach(({
      position: [u, v],
      radius,
      color
    }) => {
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2, false);
      // context.fillStyle = '#333';

      context.strokeStyle = '#fff';
      context.lineWidth = 4;
      context.stroke();
      context.fillStyle = color;
      context.fill();

    })
    setInterval(() => {
      // reset canvas
      context.fillStyle = 'white';
      context.fillRect(0, 0, width, height);
      // add one pixel to each point
      for (let i = 0; i < 1; i++) {
        for (let i = 0; i < points.length; i++) {
          const point = points[i];
          const { position, radius, color, factorx, factory } = point;
          position[0] = position[0] + position[0] * factorx;
          position[1] = position[1] + position[1] * factory;
          const x = lerp(margin, width - margin, position[0]);
          const y = lerp(margin, height - margin, position[1]);

          // check if point is in collision with other points
          for (let j = 0; j < points.length; j++) {
            if (i !== j) {
              const other = points[j];
              const dx = x - other.position[0];
              const dy = y - other.position[1];
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < radius + other.radius) {
                // collision
                point.position[0] = -point.factorx*1;
                point.position[1] = -point.factorx*1;
                other.position[0] = -other.factorx*1;
                other.position[1] = -other.factorx*1;
              }
            }
          }

          if (x - margin < 0 || x + margin > width) {
            point.factorx = -point.factorx*1;

          }
          if (y - margin < 0 || y + margin > height) {
            point.factory = -point.factory*1;
          }

        }

        points.forEach(({
          position: [u, v],
          radius,
          color
        }) => {
          const x = lerp(margin, width - margin, u);
          const y = lerp(margin, height - margin, v);
          context.beginPath();
          context.arc(x, y, radius, 0, Math.PI * 2, false);
          // context.fillStyle = '#333';

          context.strokeStyle = '#fff';
          context.lineWidth = 10;
          context.stroke();
          context.fillStyle = color;
          context.fill();

        })
      }
    }
      , 10)
    // console.log(points);
  };
};

canvasSketch(sketch, settings);
