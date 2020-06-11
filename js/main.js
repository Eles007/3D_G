window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

window.onload = function () {
    const WINDOW = {
        LEFT: -10,
        BOTTOM: -10,
        WIDTH: 20,
        HEIGHT: 20,
        P1: new Point(-10, 10, -30), // левый верхний угол
        P2: new Point(-10, -10, -30), // левый нижний угол
        P3: new Point(10, -10, -30), // правый нижний угол
        CENTER: new Point(0, 0, -30), // центр окошка, через которое видим мир
        CAMERA: new Point(0, 0, -50) // точка, из которой смотрим на мир
    };
    const ZOOM_OUT = 1.1;
    const ZOOM_IN = 0.9;

    const sur = new Surfaces;
    const canvas = new Canvas({ width: 800, height: 800, WINDOW, callbacks: { wheel, mousemove, mouseup, mousedown } });
    const graph3D = new Graph3D({ WINDOW });
    const ui = new UI({ callbacks: { move, printPoints, printEdges, printPolygons } });



    const SCENE = [
        //солнце
        sur.sphera(
            30,
            10,
            new Point(0, 0, 0),
            '#FFD700',
            { rotateOz: new Point }
        ),
        
        //меркурий
        sur.sphera(
            30,
            0.5,
            new Point(-15, 0, 0),
            '#808080',
            { rotateOz: new Point(0, 0, 0) }
        ),
        //венера
        sur.sphera(
            30,
            1,
            new Point(25, 0, 0),
            '#FFFFF0',
            { rotateOz: new Point(0, 0, 0) }
        ),
        //земля
        sur.sphera(
            30,
            2,
            new Point(0, 25, 0),
            '#4169E1',
            { rotateOz: new Point(0, 0, 0) }
        ),
        //марс
        sur.sphera(
            30,
            0.75,
            new Point(20, 30, 0),
            '#FF6347',
            { rotateOz: new Point(0, 0, 0) }
        ),
        //юпитер
        sur.sphera(
            30,
            7,
            new Point(-35, 40, 0),
            '#F0E68C',
            { rotateOz: new Point(0, 0, 0) }
        ),
        //кольцо
        sur.bublik(
            30,
            12,
            new Point(41, -64),
            '#8B4513',
            { rotateOz: new Point(0, 0) }
        ),
        //сатурн
        sur.sphera(
            30,
            5,
            new Point(41, -64, 0),
            '#FFEFD5',
            { rotateOz: new Point(0, 0, 0) }
        ),
        //уран
        sur.sphera(
            30,
            4,
            new Point(-62, -87, 0),
            '#1E90FF',
            { rotateOz: new Point(0, 0, 0) }
        ),
        //нептун
        sur.sphera(
            30,
            3.5,
            new Point(97, -14, 0),
            '#0000FF',
            { rotateOz: new Point(0, 0, 0) }
        ),
        //луна
        sur.sphera(
            30,
            0.2,
            new Point(1, 27, -3),
            '#4169E1',
            { rotateOz: new Point(0, 0, 0)}
        )
        
    ];
    const LIGHT = new Light(-100, 2, -10, 150000); //источник света

    let canRotate = 0;
    let canPrint = {
        points: false,
        edges: false,
        polygons: false
    }

    // about callbacks
    function wheel(event) {
        const delta = (event.wheelDelta > 0) ? ZOOM_IN : ZOOM_OUT;
        graph3D.zoomMatrix(delta);
        SCENE.forEach(subject => {
            subject.points.forEach(point => graph3D.transform(point));
            if (subject.animation) {
                for (let key in subject.animation) {
                    graph3D.transform(subject.animation[key]);
                }
            }
        });
    }

    function mouseup() {
        canRotate = false;
    }

    function mousedown() {
        canRotate = true;
    }

    function mousemove(event) {
        if (canRotate) {
            if (event.movementX) { // вращение вокруг Oy
                const alpha = canvas.sx(event.movementX) / WINDOW.CAMERA.z;
                graph3D.rotateOyMatrix(alpha)
                SCENE.forEach(subject => {
                    subject.points.forEach(point => graph3D.transform(point));
                    if (subject.animation) {
                        for (let key in subject.animation) {
                            graph3D.transform(subject.animation[key]);
                        }
                    }
                });
            }
           if (event.movementY) { // вращение вокруг Ox
                 const alpha = canvas.sy(event.movementY) / -WINDOW.CAMERA.z;                
                graph3D.rotateOxMatrix(alpha);
                SCENE.forEach(subject => {
                    subject.points.forEach(point => graph3D.transform(point));
                    if (subject.animation) {
                        for (let key in subject.animation) {
                            graph3D.transform(subject.animation[key]);
                        }
                    }
                });
            }
        }
    }

    function printPoints(value) {
        canPrint.points = value;
    }
    function printEdges(value) {
        canPrint.edges = value;
    }
    function printPolygons(value) {
        canPrint.polygons = value;
    }

    function move(direction) {
        switch (direction) {
            case 'up': graph3D.rotateOxMatrix(Math.PI / 180); break;
            case 'down': graph3D.rotateOxMatrix(-Math.PI / 180); break;
            case 'left': graph3D.rotateOyMatrix(Math.PI / 180); break;
            case 'right': graph3D.rotateOyMatrix-(Math.PI / 180); break;
        }
        graph3D.transform(WINDOW.CAMERA);
        graph3D.transform(WINDOW.CENTER);
        graph3D.transform(WINDOW.P1);
        graph3D.transform(WINDOW.P2);
        graph3D.transform(WINDOW.P3);
    }

    function printAllPolygons() {
        if (canPrint.polygons) {

            const polygons = [];

            SCENE.forEach(subject => {
                graph3D.calcGorner(subject, WINDOW.CAMERA);
                graph3D.calcCenters(subject);
                graph3D.calcDistance(subject, WINDOW.CAMERA, 'distance');
                graph3D.calcDistance(subject, LIGHT, 'lumen');           
            });

            SCENE.forEach(subject => {
                for (let i = 0; i < subject.polygons.length; i++) {
                    if (subject.polygons[i].visible) {
                        const polygon = subject.polygons[i];
                        const point1 = graph3D.getProection(subject.points[polygon.points[0]]);       
                        const point2 = graph3D.getProection(subject.points[polygon.points[1]]);
                        const point3 = graph3D.getProection(subject.points[polygon.points[2]]);
                        const point4 = graph3D.getProection(subject.points[polygon.points[3]]);
                        let { r, g, b } = polygon.color;
                        const {isShadow, dark} = graph3D.calcShadow(polygon, subject, SCENE, LIGHT);
                        const lumen = (isShadow) ? dark : graph3D.calcIllumination(polygon.lumen, LIGHT.lumen);
                        r = Math.round(r * lumen);
                        g = Math.round(g * lumen);
                        b = Math.round(b * lumen);
                        polygons.push({
                            points: [point1, point2, point3, point4],
                            color: polygon.rgbToHex(r, g, b),
                            distance: polygon.distance
                        });
                    }
                }
            });
            //отрисовка всех полигонов
            polygons.sort((a, b) => b.distance - a.distance);
            polygons.forEach(polygon => canvas.polygon(polygon.points, polygon.color));

        }
    }

    function printSubject(subject) {
        // print edges
        if (canPrint.edges) {
            for (let i = 0; i < subject.edges.length; i++) {
                const edges = subject.edges[i];
                const point1 = subject.points[edges.p1];
                const point2 = subject.points[edges.p2];
                canvas.line(graph3D.xs(point1), graph3D.ys(point1), graph3D.xs(point2), graph3D.ys(point2));
            }
        }
        // print points
        if (canPrint.points) {
            for (let i = 0; i < subject.points.length; i++) {
                const points = subject.points[i];
                canvas.point(graph3D.xs(points), graph3D.ys(points));
            }
        }
    }

    function render() {
        canvas.clear();
        printAllPolygons();
        SCENE.forEach(subject => printSubject(subject));
        canvas.text(WINDOW.LEFT + 1, WINDOW.HEIGHT + WINDOW.BOTTOM - 1, `FPS: ${FPSout}`);
        canvas.render();
    }

    function animation() {
        //закрутим фигуру
        SCENE.forEach(subject => {
            if (subject.animation) {
                for (let key in subject.animation) {
                    const { x, y, z } = subject.animation[key];
                    const xn = WINDOW.CENTER.x - x;
                    const yn = WINDOW.CENTER.y - y;
                    const zn = WINDOW.CENTER.z - z;
                    const alpha = Math.PI / 180;
                    graph3D.animateMatrix(xn, yn, zn, key, alpha, -xn, -yn, -zn);
                    subject.points.forEach(point => graph3D.transform(point));
                }
            }
        });
    }


    setInterval(animation, 10);

    let FPS = 0;
    let FPSout = 0;
    let timestemp = (new Date()).getTime();
    (function animloop() {
        // вывод FPS
        FPS++;
        const currentTimestemp = (new Date()).getTime();
        if (currentTimestemp - timestemp >= 1000) {
            timestemp = currentTimestemp;
            FPSout = FPS;
            FPS = 0;
        }

        graph3D.calcPlaneEqution(); //получить и записать плоскость экрана
        graph3D.calcWindowVectors(); //вычислить вектора экрана
        render();  // отрисовка сцены
        requestAnimFrame(animloop);
    })();

}; 