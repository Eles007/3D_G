Surfaces.prototype.odnopolostgiperParaboloid = (count = 10, point = new Point(0, 0, 0), color = 'ff0000') => {
    let points = [];
    let edges = [];
    let polygons = [];

    //расставить точки
    const delta = Math.PI * 2 / count;
    for (let i = 3 / 2; i <= Math.PI; i += delta) {
        for (let j = 0; j < Math.PI * 2; j += delta) {
            const x = point.x + 3 * Math.cosh(i) * Math.cos(j);
            const y = point.y + 2 * Math.sinh(i) * Math.sin(j);
            const z = point.z + 3 * Math.sinh(i);
            points.push(new Point(x, y, z));
        }
    }
    for (let i = 3 / 2; i <= Math.PI; i += delta) {
        for (let j = 0; j < Math.PI * 2; j += delta) {
            const x = point.x + 3 * Math.cosh(i) * Math.cos(j);
            const y = point.y + 2 * Math.sinh(i) * Math.sin(j);
            const z = point.z - 3 * Math.sinh(i);
            points.push(new Point(x, y, z));
        }
    }
    //ребра
    for (let i = 0; i < points.length; i++) {
        //вдоль
        if (i + 1 < points.length && (i + 1) % count !== 0) {
            edges.push(new Edge(i + 1, i));
        } else if ((i + 1) % count === 0) {
            edges.push(new Edge(i + 1 - count, i));
        }

        //поверек
        if (i + count < points.length) {
            if (i < count && i < points.length / 2) {
                edges.push(new Edge(i, i + points.length / 2));
            }
            if (i + count < points.length / 2) {
                edges.push(new Edge(i, i + count));
            }
            if (i > points.length / 2) {
                edges.push(new Edge(i, i + count));
            }
        }
    }
    //полигоны
    for (let i = 0; i < points.length; i++) {
        if (i + count < points.length / 2) {
            if (i + 1 + count < points.length && (i + 1) % count !== 0) {
                polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count], color));
            } else if ((i + count) < points.length && (i + 1) % count === 0) {
                polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count], color));
            }
        }
        if (i + 1 > points.length / 2) {
            if (i + 1 + count < points.length && (i + 1) % count !== 0) {
                polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count], color));
            } else if ((i + count) < points.length && (i + 1) % count === 0) {
                polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count], color));
            }
        }
        if (i < count - 1) {
            polygons.push(new Polygon([i + 1 + points.length / 2, i + 1, i, i + points.length / 2], color));
        } else if (i >= count - 1 && i < count) {
            polygons.push(new Polygon([points.length / 2, count - 1 - i, i, i + points.length / 2], color));
        }
    }
    return new Subject(points, edges, polygons);
}