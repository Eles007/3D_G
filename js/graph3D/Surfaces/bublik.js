Surfaces.prototype.bublik = (count = 20, R = 6, point = new Point(0, 0), color = 'ff0000', animation) => {
    let points = [];
    let edges = [];
    let polygons = [];


    //расставить точки
    const delta = Math.PI * 2 / count;
    for (let i = 1 / 2; i <= Math.PI / 3; i += delta) {
        for (let j = 0; j < Math.PI * 2; j += delta) {
            const x = point.x + R * Math.sin(i) * Math.cos(j);
            const y = point.y + R * Math.sin(i) * Math.sin(j);
            points.push(new Point(x, y));
        }
    }
    //ребра
    for (let i = 0; i < points.length; i++) {
        //вдоль
        if (i + 1 < points.length && (i + 1) % count !== 0) {
            edges.push(new Edge(i, i + 1));
        } else if ((i + 1) % count === 0) {
            edges.push(new Edge(i, i + 1 - count));
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
    return new Subject(points, edges, polygons, animation);
}