Surfaces.prototype.conus = (count = 10, point = new Point(0, 0, 0), color = 'ff0000') => {
    let points = [];
    let edges = [];
    let polygons = [];


    //расставить точки
    const delta = Math.PI * 2 / count;
    for (let i = 0; i <= Math.PI; i += delta) {
        for (let j = 0; j < Math.PI * 2; j += delta) {
            const x = point.x + 2 * i * Math.cos(j);
            const y = point.y + 2 * i * Math.sin(j);
            const z = point.z + 4 * i;
            points.push(new Point(x, y, z));
        }
    }
    for (let i = 0; i <= Math.PI; i += delta) {
        for (let j = 0; j < Math.PI * 2; j += delta) {
            const x = -point.x + 2 * i * Math.cos(j);
            const y = -point.y + 2 * i * Math.sin(j);
            const z = point.z + 4 * -i;
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
            edges.push(new Edge(i, i + count));

        }
    }
    //полигоны
    for (let i = 0; i < points.length; i++) {

        if (i + 1 + count < points.length && (i + 1) % count !== 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count], color));
        } else if ((i + count) < points.length && (i + 1) % count === 0) {
            polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count], color));
        }
    }

    return new Subject(points, edges, polygons);
}
