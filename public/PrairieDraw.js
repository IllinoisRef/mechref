/*****************************************************************************/

/** Creates a PrairieDraw object.

    @constructor
    @this {PrairieDraw}
    @param {HTMLCanvasElement or string} canvas The canvas element to draw on or the ID of the canvas elemnt.
    @param {Function} drawfcn An optional function that draws on the canvas.
*/
function PrairieDraw(canvas, drawFcn) {
    if (canvas) {
        if (canvas instanceof HTMLCanvasElement) {
            /** @private */ this._canvas = canvas;
        } else if (canvas instanceof String || typeof canvas == "string") {
            /** @private */ this._canvas = document.getElementById(canvas);
        } else {
            throw new Error("PrairieDraw: unknown object type for constructor")
        }
        this._canvas.prairieDraw = this;

        /** @private */ this._ctx = this._canvas.getContext('2d');
        if (this._ctx.setLineDash === undefined) {
            this._ctx.setLineDash = function() {};
        }
        /** @private */ this._width = this._canvas.width;
        /** @private */ this._height = this._canvas.height;

        /** @private */ this._trans = Matrix.I(3);
        /** @private */ this._transStack = [];

        /** @private */ this._initViewAngleX3D = -Math.PI / 2 * 0.75;
        /** @private */ this._initViewAngleY3D = 0;
        /** @private */ this._initViewAngleZ3D = -Math.PI / 2 * 1.25;
        /** @private */ this._viewAngleX3D = this._initViewAngleX3D;
        /** @private */ this._viewAngleY3D = this._initViewAngleY3D;
        /** @private */ this._viewAngleZ3D = this._initViewAngleZ3D;
        /** @private */ this._trans3D = this.rotateTransform3D(Matrix.I(4),
                                                               this._initViewAngleX3D,
                                                               this._initViewAngleY3D,
                                                               this._initViewAngleZ3D);
        /** @private */ this._trans3DStack = [];

        /** @private */ this._props = {};
        this._initProps();
        /** @private */ this._propStack = [];

        /** @private */ this._options = {};

        /** @private */ this._history = {};

        /** @private */ this._images = {};

        if (drawFcn) {
            this.draw = drawFcn.bind(this);
        }
        this.save();
        this.draw();
        this.restoreAll();
    }
}

/** Creates a new PrairieDraw from a canvas ID.

    @param {string} id The ID of the canvas element to draw on.
    @return {PrairieDraw} The new PrairieDraw object.
*/
PrairieDraw.fromCanvasId = function(id) {
    var canvas = document.getElementById(id);
    if (!canvas) {
        throw new Error("PrairieDraw: unable to find canvas ID: " + id);
    }
    return new PrairieDraw(canvas);
}

/** Prototype function to draw on the canvas, should be implemented by children.
*/
PrairieDraw.prototype.draw = function() {
}

/** Redraw the drawing.
*/
PrairieDraw.prototype.redraw = function() {
    this.save();
    this.draw();
    this.restoreAll();
}

/** @private Initialize properties.
*/
PrairieDraw.prototype._initProps = function() {

    this._props.viewAngleXMin = -Math.PI / 2 + 1e-6;
    this._props.viewAngleXMax = -1e-6;
    this._props.viewAngleYMin = -Infinity;
    this._props.viewAngleYMax = Infinity;
    this._props.viewAngleZMin = -Infinity;
    this._props.viewAngleZMax = Infinity;

    this._props.arrowLineWidthPx = 2;
    this._props.arrowLinePattern = 'solid';
    this._props.arrowheadLengthRatio = 7; // arrowheadLength / arrowLineWidth
    this._props.arrowheadWidthRatio = 0.3; // arrowheadWidth / arrowheadLength
    this._props.arrowheadOffsetRatio = 0.3; // arrowheadOffset / arrowheadLength
    this._props.circleArrowWrapOffsetRatio = 1.5;
    this._props.arrowOutOfPageRadiusPx = 5;

    this._props.textOffsetPx = 4;

    this._props.pointRadiusPx = 2;

    this._props.shapeStrokeWidthPx = 2;
    this._props.shapeStrokePattern = 'solid';
    this._props.shapeOutlineColor = "rgb(0, 0, 0)";
    this._props.shapeInsideColor = "rgb(255, 255, 255)";

    this._props.hiddenLineDraw = true;
    this._props.hiddenLineWidthPx = 2;
    this._props.hiddenLinePattern = "dashed";
    this._props.hiddenLineColor = "rgb(0, 0, 0)";

    this._props.centerOfMassStrokeWidthPx = 2;
    this._props.centerOfMassColor = "rgb(180, 49, 4)";
    this._props.centerOfMassRadiusPx = 5;

    this._props.rightAngleSizePx = 10;
    this._props.rightAngleStrokeWidthPx = 1;
    this._props.rightAngleColor = "rgb(0, 0, 0)";

    this._props.measurementStrokeWidthPx = 1;
    this._props.measurementStrokePattern = 'solid';
    this._props.measurementEndLengthPx = 10;
    this._props.measurementOffsetPx = 3;
    this._props.measurementColor = "rgb(0, 0, 0)";

    this._props.groundDepthPx = 10;
    this._props.groundWidthPx = 10;
    this._props.groundSpacingPx = 10;
    this._props.groundOutlineColor = "rgb(0, 0, 0)";
    this._props.groundInsideColor = "rgb(220, 220, 220)";

    this._props.gridColor = "rgb(200, 200, 200)";
    this._props.positionColor = "rgb(0, 0, 255)";
    this._props.angleColor = "rgb(0, 100, 180)";
    this._props.velocityColor = "rgb(0, 200, 0)";
    this._props.angVelColor = "rgb(100, 180, 0)";
    this._props.accelerationColor = "rgb(255, 0, 255)";
    this._props.rotationColor = "rgb(150, 0, 150)";
    this._props.angAccColor = "rgb(100, 0, 180)";
    this._props.angMomColor = "rgb(255, 0, 0)";
    this._props.forceColor = "rgb(210, 105, 30)";
    this._props.momentColor = "rgb(255, 102, 80)";
}

/*****************************************************************************/

/** The golden ratio.
*/
PrairieDraw.prototype.goldenRatio = (1 + Math.sqrt(5)) / 2;

/** Get the canvas width.

    @return {number} The canvas width in Px.
*/
PrairieDraw.prototype.widthPx = function() {
    return this._width;
}

/** Get the canvas height.

    @return {number} The canvas height in Px.
*/
PrairieDraw.prototype.heightPx = function() {
    return this._height;
}

/*****************************************************************************/

/** Conversion constants.
*/
PrairieDraw.prototype.milesPerKilometer = 0.621371;

/** Convert degrees to radians.

    @param {number} degrees The angle in degrees.
    @return {number} The angle in radians.
*/
PrairieDraw.prototype.degToRad = function(degrees) {
    return degrees * Math.PI / 180;
};

/** Convert radians to degrees.

    @param {number} radians The angle in radians.
    @return {number} The angle in degrees.
*/
PrairieDraw.prototype.radToDeg = function(radians) {
    return radians * 180 / Math.PI;
};

/** Fixed modulus function (handles negatives correctly).

    @param {number} value The number to convert.
    @param {number} modulus The modulus.
    @return {number} value mod modulus.
*/
PrairieDraw.prototype.fixedMod = function(value, modulus) {
    return ((value % modulus) + modulus) % modulus;
};

/** Interval modulus function.

    @param {number} x The number to convert.
    @param {number} a Lower interval end.
    @param {number} b Upper interval end.
    @return {number} The value modded to within [a,b].
*/
PrairieDraw.prototype.intervalMod = function(x, a, b) {
    return this.fixedMod(x - a, b - a) + a;
};

/** Interval divide function.

    @param {number} x The number to convert.
    @param {number} a Lower interval end.
    @param {number} b Upper interval end.
    @return {number} The value divided into the interval within [a,b].
*/
PrairieDraw.prototype.intervalDiv = function(x, a, b) {
    return Math.floor((x - a) / (b - a));
};

/** Vector interval modulus function.

    @param {Vector} x The vector to convert.
    @param {Vector} a Lower interval ends.
    @param {Vector} b Upper interval ends.
    @return {Vector} The vector modded to within [a,b].
*/
PrairieDraw.prototype.vectorIntervalMod = function(x, a, b) {
    var r = [];
    for (var i = 1; i <= x.elements.length; i++) {
        r.push(this.intervalMod(x.e(i), a.e(i), b.e(i)));
    }
    return $V(r);
};

/** Clip a value x to the given interval [a, b].

    @param {number} x Value to clip.
    @param {number} a Lower interval end.
    @param {number} b Upper interval end.
*/
PrairieDraw.prototype.clip = function(x, a, b) {
    return Math.max(a, Math.min(b, x));
};

/** Intersection of two intervals.

    @param {Array} int1 First interval (two entries giving start and end).
    @param {Array} int2 Second interval (two entries giving start and end).
    @return {Array} Intersected interval (two entries giving start and end), or an empty array.
*/
PrairieDraw.prototype.intersectIntervals = function(int1, int2) {
    var result = [Math.max(int1[0], int2[0]),
                  Math.min(int1[1], int2[1])]
    if (result[1] < result[0]) {
        result = [];
    }
    return result;
};

/** Intersection of two angle ranges modulo 2 pi.

    @param {Array} r1 First range (two entries giving start and end), or an empty array.
    @param {Array} r2 Second range (two entries giving start and end), or an empty array.
    @return {Array} Intersected range (two entries giving start and end), or an empty array.
*/
PrairieDraw.prototype.intersectAngleRanges = function(r1, r2) {
    if (r1.length === 0 || r2.length === 0) {
        return [];
    }
    if (r1[0] > r1[1]) {
        r1 = [r1[1], r1[0]];
    }
    if (r2[0] > r2[1]) {
        r2 = [r2[1], r2[0]];
    }
    var TWOPI = 2 * Math.PI
    var start1 = this.fixedMod(r1[0], TWOPI);
    var end1 = this.fixedMod(r1[1], TWOPI);
    var start2 = this.fixedMod(r2[0], TWOPI);
    var end2 = this.fixedMod(r2[1], TWOPI);
    var r1List;
    if (end1 > start1) {
        r1List = [[start1, end1]]
    } else {
        r1List = [[start1 - TWOPI, end1],
               [start1, end1 + TWOPI]];
    }
    var r2Use;
    if (end2 > start2) {
        r2Use = [start2, end2];
    } else {
        r2Use = [start2, end2 + TWOPI];
    }
    var i, r1Use, r12;
    var result = [];
    for (i = 0; i < r1List.length; i++) {
        r1Use = r1List[i];
        r12 = this.intersectIntervals(r1Use, r2Use);
        if (r12.length > 0) {
            result.push(r12);
        }
    }
    return result;
};

/** Convert polar to rectangular coordinates.

    @param {Vector} pP Polar coordinates (r, theta).
    @return {Vector} The position in rectangular coordinates (x, y).
*/
PrairieDraw.prototype.polarToRect = function(pP) {
    var pR = $V([pP.e(1) * Math.cos(pP.e(2)),
                 pP.e(1) * Math.sin(pP.e(2))
                ]);
    return pR;
};

/** Convert rectangular to polar coordintes.

    @param {Vector} pR Rectangular coordinates (x, y).
    @return {Vector} Polar coordinates (r, theta).
*/
PrairieDraw.prototype.rectToPolar = function(pR) {
    var x = pR.e(1);
    var y = pR.e(2);
    var r = Math.sqrt(x*x + y*y);
    var theta = Math.atan2(y, x);
    var pP = $V([r, theta]);
    return pP;
};

/** Find the polar basis vectors at a given point.

    @param {Vector} pP Polar coordinates (r, theta) of the point.
    @return {Array} The basis vectors [eR, eTheta] at pP.
*/
PrairieDraw.prototype.polarBasis = function(pP) {
    var theta = pP.e(2);
    var eR = $V([Math.cos(theta), Math.sin(theta)]);
    var eTheta = $V([-Math.sin(theta), Math.cos(theta)]);
    return [eR, eTheta];
};

/** Convert a vector in a polar basis to a rectangular basis.

    @param {Vector} vP Vector in polar basis (eR, eTheta).
    @param {Vector} pP Position to convert at (r, theta).
    @return {Vector} The vector vR in rectangular coordinates.
*/
PrairieDraw.prototype.vecPolarToRect = function(vP, pP) {
    var basis = this.polarBasis(pP);
    var eR = basis[0];
    var eTheta = basis[1];
    var vR = eR.x(vP.e(1)).add(eTheta.x(vP.e(2)));
    return vR;
};

/** Convert spherical to rectangular coordintes.

    @param {Vector} pS Spherical coordinates (r, theta, phi).
    @return {Vector} The position in rectangular coordinates (x, y, z).
*/
PrairieDraw.prototype.sphericalToRect = function(pS) {
    var pR = $V([pS.e(1) * Math.cos(pS.e(2)) * Math.sin(pS.e(3)),
                 pS.e(1) * Math.sin(pS.e(2)) * Math.sin(pS.e(3)),
                 pS.e(1) * Math.cos(pS.e(3))
                ]);
    return pR;
};

/** Convert rectangular to spherical coordintes.

    @param {Vector} pR Rectangular coordinates (x, y, z).
    @return {Vector} Spherical coordinates (r, theta, phi).
*/
PrairieDraw.prototype.rectToSpherical = function(pR) {
    var x = pR.e(1);
    var y = pR.e(2);
    var z = pR.e(3);
    var r = Math.sqrt(x*x + y*y + z*z);
    var theta = Math.atan2(y, x);
    var phi = Math.acos(z / r);
    var pS = $V([r, theta, phi]);
    return pS;
};

/** Find the spherical basis vectors at a given point.

    @param {Vector} pS Spherical coordinates (r, theta, phi) of the point.
    @return {Array} The basis vectors [eR, eTheta, ePhi] at pS.
*/
PrairieDraw.prototype.sphericalBasis = function(pS) {
    var theta = pS.e(2);
    var phi = pS.e(3);
    var eR = this.sphericalToRect($V([1, theta, phi]));
    var eTheta = $V([-Math.sin(theta), Math.cos(theta), 0]);
    var ePhi = $V([Math.cos(theta) * Math.cos(phi),
                   Math.sin(theta) * Math.cos(phi),
                   -Math.sin(phi)]);
    return [eR, eTheta, ePhi];
};

/** Convert cylindrical to rectangular coordintes.

    @param {Vector} pC Cylindrical coordinates (r, theta, z).
    @return {Vector} The position in rectangular coordinates (x, y, z).
*/
PrairieDraw.prototype.cylindricalToRect = function(pC) {
    var pR = $V([pC.e(1) * Math.cos(pC.e(2)),
                 pC.e(1) * Math.sin(pC.e(2)),
                 pC.e(3)]);
    return pR;
};

/** Convert rectangular to cylindrical coordintes.

    @param {Vector} pR Rectangular coordinates (x, y, z).
    @return {Vector} Cylindrical coordinates (r, theta, z).
*/
PrairieDraw.prototype.rectToCylindrical = function(pR) {
    var x = pR.e(1);
    var y = pR.e(2);
    var z = pR.e(3);
    var r = Math.sqrt(x*x + y*y);
    var theta = Math.atan2(y, x);
    var pC = $V([r, theta, z]);
    return pC;
};

/** Perpendicular vector in 2D.

    @param {Vector} v A 2D vector.
    @return {Vector} The counter-clockwise perpendicular vector to v.
*/
PrairieDraw.prototype.perp = function(v) {
    return $V([-v.e(2), v.e(1)]);
};

/** Orthogonal projection.

    @param {Vector} u Vector to project.
    @param {Vector} v Vector to project onto.
    @return {Vector} The orthogonal projection of u onto v.
*/
PrairieDraw.prototype.orthProj = function(u, v) {
    if (v.modulus() < 1e-30) {
        return $V([0, 0, 0]);
    } else {
        return v.x(u.dot(v) / Math.pow(v.modulus(), 2));
    }
};

/** Orthogonal complement.

    @param {Vector} u Vector to project.
    @param {Vector} v Vector to complement against.
    @return {Vector} The orthogonal complement of u with respect to v.
*/
PrairieDraw.prototype.orthComp = function(u, v) {
    return u.subtract(this.orthProj(u, v));
};

/** Choose a 3D unit vector orthogonal to the given vector.

    @param {Vector} v The base vector.
    @return {Vector} A unit vector n that is orthogonal to v.
*/
PrairieDraw.prototype.chooseNormVec = function(v) {
    var e1 = Math.abs(v.e(1));
    var e2 = Math.abs(v.e(2));
    var e3 = Math.abs(v.e(3));
    var n;
    if (e1 <= Math.min(e2, e3)) {
        n = Vector.i;
    }
    if (e2 <= Math.min(e3, e1)) {
        n = Vector.j;
    }
    if (e3 <= Math.min(e1, e2)) {
        n = Vector.k;
    }
    n = this.orthComp(n, v).toUnitVector();
    return n;
}

/*****************************************************************************/

/** Return an identity transformation matrix.

    @return {Matrix} An identity transformation.
*/
PrairieDraw.prototype.identityTransform = function() {
    return Matrix.I(3);
};

/** Scale a transformation matrix.

    @param {Matrix} transform The original transformation.
    @param {Vector} factor Scale factors.
    @return {Matrix} The new transformation.
*/
PrairieDraw.prototype.scaleTransform = function(transform, factor) {
    return transform.x($M([[factor.e(1), 0, 0], [0, factor.e(2), 0], [0, 0, 1]]));
}

/** Translate a transformation matrix.

    @param {Matrix} transform The original transformation.
    @param {Vector} offset Translation offset (drawing coords).
    @return {Matrix} The new transformation.
*/
PrairieDraw.prototype.translateTransform = function(transform, offset) {
    return transform.x($M([[1, 0, offset.e(1)], [0, 1, offset.e(2)], [0, 0, 1]]));
}

/** Rotate a transformation matrix.

    @param {Matrix} transform The original transformation.
    @param {number} angle Angle to rotate by (radians).
    @return {Matrix} The new transformation.
*/
PrairieDraw.prototype.rotateTransform = function(transform, angle) {
    return transform.x(Matrix.RotationZ(angle));
}

/** Transform a transformation matrix (scale, translate, rotate) to
    match old points to new. Drawing at the old locations will result
    in points at the new locations.

    @param {Matrix} transform The original transformation.
    @param {Vector} old1 The old location of point 1.
    @param {Vector} old2 The old location of point 2.
    @param {Vector} new1 The new location of point 1.
    @param {Vector} new2 The new location of point 2.
    @return {Matrix} The new transformation.
*/
PrairieDraw.prototype.transformByPointsTransform = function(transform, old1, old2, new1, new2) {
    var oldMid = old1.add(old2).x(0.5);
    var newMid = new1.add(new2).x(0.5);
    var oldDelta = old2.subtract(old1);
    var newDelta = new2.subtract(new1);

    var offset = newMid.subtract(oldMid);
    var factor = newDelta.modulus() / oldDelta.modulus();
    var angle = this.angleFrom(oldDelta, newDelta);

    var newTransform = transform;
    newTransform = this.translateTransform(newTransform, newMid);
    newTransform = this.rotateTransform(newTransform, angle);
    newTransform = this.scaleTransform(newTransform, $V([factor, factor]));
    newTransform = this.translateTransform(newTransform, oldMid.x(-1));
    return newTransform;
}

/*****************************************************************************/

/** Transform a vector by a transformation matrix.

    @param {Matrix} transform The transformation matrix.
    @param {Vector} vec The vector.
    @return {Vector} The transformed vector.
*/
PrairieDraw.prototype.transformVec = function(transform, vec) {
    var v3 = transform.x($V([vec.e(1), vec.e(2), 0]))
    return $V([v3.e(1), v3.e(2)]);
}

/** Transform a position by a transformation matrix.

    @param {Matrix} transform The transformation matrix.
    @param {Vector} pos The position.
    @return {Vector} The transformed position.
*/
PrairieDraw.prototype.transformPos = function(transform, pos) {
    var p3 = transform.x($V([pos.e(1), pos.e(2), 1]))
    return $V([p3.e(1), p3.e(2)]);
}

/*****************************************************************************/

/** Scale the coordinate system.

    @param {Vector} factor Scale factors.
*/
PrairieDraw.prototype.scale = function(factor) {
    this._trans = this.scaleTransform(this._trans, factor);
}

/** Translate the coordinate system.

    @param {Vector} offset Translation offset (drawing coords).
*/
PrairieDraw.prototype.translate = function(offset) {
    this._trans = this.translateTransform(this._trans, offset);
}

/** Rotate the coordinate system.

    @param {number} angle Angle to rotate by (radians).
*/
PrairieDraw.prototype.rotate = function(angle) {
    this._trans = this.rotateTransform(this._trans, angle);
}

/** Transform the coordinate system (scale, translate, rotate) to
    match old points to new. Drawing at the old locations will result
    in points at the new locations.

    @param {Vector} old1 The old location of point 1.
    @param {Vector} old2 The old location of point 2.
    @param {Vector} new1 The new location of point 1.
    @param {Vector} new2 The new location of point 2.
*/
PrairieDraw.prototype.transformByPoints = function(old1, old2, new1, new2) {
    this._trans = this.transformByPointsTransform(this._trans, old1, old2, new1, new2);
}

/*****************************************************************************/

/** Transform a vector from drawing to pixel coords.

    @param {Vector} vDw Vector in drawing coords.
    @return {Vector} Vector in pixel coords.
*/
PrairieDraw.prototype.vec2Px = function(vDw) {
    return this.transformVec(this._trans, vDw);
}

/** Transform a position from drawing to pixel coords.

    @param {Vector} pDw Position in drawing coords.
    @return {Vector} Position in pixel coords.
*/
PrairieDraw.prototype.pos2Px = function(pDw) {
    return this.transformPos(this._trans, pDw);
}

/** Transform a vector from pixel to drawing coords.

    @param {Vector} vPx Vector in pixel coords.
    @return {Vector} Vector in drawing coords.
*/
PrairieDraw.prototype.vec2Dw = function(vPx) {
    return this.transformVec(this._trans.inverse(), vPx);
}

/** Transform a position from pixel to drawing coords.

    @param {Vector} pPx Position in pixel coords.
    @return {Vector} Position in drawing coords.
*/
PrairieDraw.prototype.pos2Dw = function(pPx) {
    return this.transformPos(this._trans.inverse(), pPx);
}

/** @private Returns true if the current transformation is a reflection.

    @return {bool} Whether the current transformation is a reflection.
*/
PrairieDraw.prototype._transIsReflection = function() {
    var det = this._trans.e(1, 1) * this._trans.e(2, 2) - this._trans.e(1, 2) * this._trans.e(2, 1);
    if (det < 0) {
        return true;
    } else {
        return false;
    }
}

/** Transform a position from normalized viewport [0,1] to drawing coords.

    @param {Vector} pNm Position in normalized viewport coordinates.
    @return {Vector} Position in drawing coordinates.
*/
PrairieDraw.prototype.posNm2Dw = function(pNm) {
    var pPx = this.posNm2Px(pNm);
    return this.pos2Dw(pPx);
}

/** Transform a position from normalized viewport [0,1] to pixel coords.

    @param {Vector} pNm Position in normalized viewport coords.
    @return {Vector} Position in pixel coords.
*/
PrairieDraw.prototype.posNm2Px = function(pNm) {
    return $V([pNm.e(1) * this._width, (1 - pNm.e(2)) * this._height]);
}

/*****************************************************************************/

/** Return a 3D identity transformation matrix.

    @return {Matrix} A 3D identity transformation.
*/
PrairieDraw.prototype.identityTransform3D = function() {
    return Matrix.I(4);
};

/** Scale a 3D transformation matrix.

    @param {Matrix} transform The original 3D transformation.
    @param {Vector} factor Scale factor.
    @return {Matrix} The new 3D transformation.
*/
PrairieDraw.prototype.scaleTransform3D = function(transform, factor) {
    return transform.x($M([[factor, 0, 0, 0], [0, factor, 0, 0], [0, 0, factor, 0], [0, 0, 1]]));
}

/** Translate a 3D transformation matrix.

    @param {Matrix} transform The original 3D transformation.
    @param {Vector} offset Translation 3D offset.
    @return {Matrix} The new 3D transformation.
*/
PrairieDraw.prototype.translateTransform3D = function(transform, offset) {
    return transform.x($M([[1, 0, 0, offset.e(1)], [0, 1, 0, offset.e(2)], [0, 0, 1, offset.e(3)], [0, 0, 0, 1]]));
}

/** @private Extend a 3D matrix to a 4D matrix.

    @param {Matrix} mat3D The 3D matrix.
    @return {Matrix} mat4D The augmented 4D matrix.
*/
PrairieDraw.prototype._toM4 = function(mat3D) {
    var r1 = mat3D.row(1).elements;
    var r2 = mat3D.row(2).elements;
    var r3 = mat3D.row(3).elements;
    r1.push(0);
    r2.push(0);
    r3.push(0);
    var r4 = [0, 0, 0, 1];
    return $M([r1, r2, r3, r4]);
};

/** Rotate a 3D transformation matrix about the X axis.

    @param {Matrix} transform The original 3D transformation.
    @param {number} angleX Angle to rotate by around the X axis (radians).
    @return {Matrix} The new 3D transformation.
*/
PrairieDraw.prototype.rotateTransform3DX = function(transform, angleX) {
    return transform.x(this._toM4(Matrix.RotationX(angleX)));
}

/** Rotate a 3D transformation matrix about the Y axis.

    @param {Matrix} transform The original 3D transformation.
    @param {number} angleY Angle to rotate by around the Y axis (radians).
    @return {Matrix} The new 3D transformation.
*/
PrairieDraw.prototype.rotateTransform3DY = function(transform, angleY) {
    return transform.x(this._toM4(Matrix.RotationY(angleY)));
}

/** Rotate a 3D transformation matrix about the Z axis.

    @param {Matrix} transform The original 3D transformation.
    @param {number} angleZ Angle to rotate by around the Z axis (radians).
    @return {Matrix} The new 3D transformation.
*/
PrairieDraw.prototype.rotateTransform3DZ = function(transform, angleZ) {
    return transform.x(this._toM4(Matrix.RotationZ(angleZ)));
}

/** Rotate a 3D transformation matrix.

    @param {Matrix} transform The original 3D transformation.
    @param {number} angleX Angle to rotate by around the X axis (radians).
    @param {number} angleY Angle to rotate by around the Y axis (radians).
    @param {number} angleZ Angle to rotate by around the Z axis (radians).
    @return {Matrix} The new 3D transformation.
*/
PrairieDraw.prototype.rotateTransform3D = function(transform, angleX, angleY, angleZ) {
    return this.rotateTransform3DZ(this.rotateTransform3DY(this.rotateTransform3DX(transform, angleX), angleY), angleZ);
}

/*****************************************************************************/

/** Transform a 3D vector by a 3D transformation matrix.

    @param {Matrix} transform The 3D transformation matrix.
    @param {Vector} vec The 3D vector.
    @return {Vector} The transformed 3D vector.
*/
PrairieDraw.prototype.transformVec3D = function(transform, vec) {
    var v4 = transform.x($V([vec.e(1), vec.e(2), vec.e(3), 0]))
    return $V([v4.e(1), v4.e(2), v4.e(3)]);
}

/** Transform a 3D position by a 3D transformation matrix.

    @param {Matrix} transform The 3D transformation matrix.
    @param {Vector} pos The 3D position.
    @return {Vector} The transformed 3D position.
*/
PrairieDraw.prototype.transformPos3D = function(transform, pos) {
    var p4 = transform.x($V([pos.e(1), pos.e(2), pos.e(3), 1]))
    return $V([p4.e(1), p4.e(2), p4.e(3)]);
}

/** Transform a 3D position to a 2D position by an orthographic projection.

    @param {Vector} pos The 3D position.
    @return {Vector} The transformed 3D position.
*/
PrairieDraw.prototype.orthProjPos3D = function(pos) {
    return $V([pos.e(1), pos.e(2)]);
}

/*****************************************************************************/

/** Set the 3D view to the given angles.

    @param {number} angleX The rotation angle about the X axis.
    @param {number} angleY The rotation angle about the Y axis.
    @param {number} angleZ The rotation angle about the Z axis.
    @param {bool} clip (Optional) Whether to clip to max/min range (default: true).
    @param {bool} redraw (Optional) Whether to redraw (default: true).
*/
PrairieDraw.prototype.setView3D = function(angleX, angleY, angleZ, clip, redraw) {
    clip = (clip === undefined) ? true : clip;
    redraw = (redraw === undefined) ? true : redraw;
    this._viewAngleX3D = angleX;
    this._viewAngleY3D = angleY;
    this._viewAngleZ3D = angleZ;
    if (clip) {
        this._viewAngleX3D = this.clip(this._viewAngleX3D, this._props.viewAngleXMin, this._props.viewAngleXMax);
        this._viewAngleY3D = this.clip(this._viewAngleY3D, this._props.viewAngleYMin, this._props.viewAngleYMax);
        this._viewAngleZ3D = this.clip(this._viewAngleZ3D, this._props.viewAngleZMin, this._props.viewAngleZMax);
    }
    this._trans3D = this.rotateTransform3D(Matrix.I(4), this._viewAngleX3D, this._viewAngleY3D, this._viewAngleZ3D);
    if (redraw) {
        this.redraw();
    }
};

/** Reset the 3D view to default.

    @param {bool} redraw (Optional) Whether to redraw (default: true).
*/
PrairieDraw.prototype.resetView3D = function(redraw) {
    this.setView3D(this._initViewAngleX3D, this._initViewAngleY3D, this._initViewAngleZ3D, undefined, redraw);
};

/** Increment the 3D view by the given angles.

    @param {number} deltaAngleX The incremental rotation angle about the X axis.
    @param {number} deltaAngleY The incremental rotation angle about the Y axis.
    @param {number} deltaAngleZ The incremental rotation angle about the Z axis.
    @param {bool} clip (Optional) Whether to clip to max/min range (default: true).
*/
PrairieDraw.prototype.incrementView3D = function(deltaAngleX, deltaAngleY, deltaAngleZ, clip) {
    this.setView3D(this._viewAngleX3D + deltaAngleX,
                   this._viewAngleY3D + deltaAngleY,
                   this._viewAngleZ3D + deltaAngleZ);
};

/*****************************************************************************/

/** Scale the 3D coordinate system.

    @param {Vector} factor Scale factor.
*/
PrairieDraw.prototype.scale3D = function(factor) {
    this._trans3D = this.scaleTransform3D(this._trans3D, factor);
}

/** Translate the 3D coordinate system.

    @param {Vector} offset Translation offset.
*/
PrairieDraw.prototype.translate3D = function(offset) {
    this._trans3D = this.translateTransform3D(this._trans3D, offset);
}

/** Rotate the 3D coordinate system.

    @param {number} angleX Angle to rotate by around the X axis (radians).
    @param {number} angleY Angle to rotate by around the Y axis (radians).
    @param {number} angleZ Angle to rotate by around the Z axis (radians).
*/
PrairieDraw.prototype.rotate3D = function(angleX, angleY, angleZ) {
    this._trans3D = this.rotateTransform3D(this._trans3D, angleX, angleY, angleZ);
}

/*****************************************************************************/

/** Transform a position to the view coordinates in 3D.

    @param {Vector} pDw Position in 3D drawing coords.
    @return {Vector} Position in 3D viewing coords.
*/
PrairieDraw.prototype.posDwToVw = function(pDw) {
    var pVw = this.transformPos3D(this._trans3D, pDw);
    return pVw;
};

/** Transform a position from the view coordinates in 3D.

    @param {Vector} pVw Position in 3D viewing coords.
    @return {Vector} Position in 3D drawing coords.
*/
PrairieDraw.prototype.posVwToDw = function(pVw) {
    var pDw = this.transformPos3D(this._trans3D.inverse(), pVw);
    return pDw;
};

/** Transform a vector to the view coordinates in 3D.

    @param {Vector} vDw Vector in 3D drawing coords.
    @return {Vector} Vector in 3D viewing coords.
*/
PrairieDraw.prototype.vecDwToVw = function(vDw) {
    var vVw = this.transformVec3D(this._trans3D, vDw);
    return vVw;
};

/** Transform a vector from the view coordinates in 3D.

    @param {Vector} vVw Vector in 3D viewing coords.
    @return {Vector} Vector in 3D drawing coords.
*/
PrairieDraw.prototype.vecVwToDw = function(vVw) {
    var vDw = this.transformVec3D(this._trans3D.inverse(), vVw);
    return vDw;
};

/** Transform a position from 3D to 2D drawing coords if necessary.

    @param {Vector} pDw Position in 2D or 3D drawing coords.
    @return {Vector} Position in 2D drawing coords.
*/
PrairieDraw.prototype.pos3To2 = function(pDw) {
    if (pDw.elements.length === 3) {
        return this.orthProjPos3D(this.posDwToVw(pDw));
    } else {
        return pDw;
    }
}

/** Transform a vector from 3D to 2D drawing coords if necessary.

    @param {Vector} vDw Vector in 2D or 3D drawing coords.
    @param {Vector} pDw Base point of vector (if in 3D).
    @return {Vector} Vector in 2D drawing coords.
*/
PrairieDraw.prototype.vec3To2 = function(vDw, pDw) {
    if (vDw.elements.length === 3) {
        var qDw = pDw.add(vDw);
        var p2Dw = this.pos3To2(pDw);
        var q2Dw = this.pos3To2(qDw);
        var vDw = q2Dw.subtract(p2Dw);
        return vDw;
    } else {
        return vDw;
    }
}

/** Transform a position from 2D to 3D drawing coords if necessary (adding z = 0).

    @param {Vector} pDw Position in 2D or 3D drawing coords.
    @return {Vector} Position in 3D drawing coords.
*/
PrairieDraw.prototype.pos2To3 = function(pDw) {
    if (pDw.elements.length === 2) {
        return $V([pDw.e(1), pDw.e(2), 0]);
    } else {
        return pDw;
    }
}

/** Transform a vector from 2D to 3D drawing coords if necessary (adding z = 0).

    @param {Vector} vDw Vector in 2D or 3D drawing coords.
    @return {Vector} Vector in 3D drawing coords.
*/
PrairieDraw.prototype.vec2To3 = function(vDw) {
    if (vDw.elements.length === 2) {
        return $V([vDw.e(1), vDw.e(2), 0]);
    } else {
        return vDw;
    }
}

/*****************************************************************************/

/** Set a property.

    @param {string} name The name of the property.
    @param {number} value The value to set the property to.
*/
PrairieDraw.prototype.setProp = function(name, value) {
    if (!(name in this._props)) {
        throw new Error("PrairieDraw: unknown property name: " + name);
    }
    this._props[name] = value;
}

/** Get a property.

    @param {string} name The name of the property.
    @return {number} The current value of the property.
*/
PrairieDraw.prototype.getProp = function(name) {
    if (!(name in this._props)) {
        throw new Error("PrairieDraw: unknown property name: " + name);
    }
    return this._props[name];
}

/** @private Colors.
*/
PrairieDraw._colors = {
    "black": "rgb(0, 0, 0)",
    "white": "rgb(255, 255, 255)",
    "red": "rgb(255, 0, 0)",
    "green": "rgb(0, 255, 0)",
    "blue": "rgb(0, 0, 255)",
    "cyan": "rgb(0, 255, 255)",
    "magenta": "rgb(255, 0, 255)",
    "yellow": "rgb(255, 255, 0)",
};

/** @private Get a color property for a given type.

    @param {string} type Optional type to find the color for.
*/
PrairieDraw.prototype._getColorProp = function(type) {
    if (type === undefined) {
        return this._props.shapeOutlineColor;
    }
    var col = type + "Color";
    if (col in this._props) {
        var c = this._props[col];
        if (c in PrairieDraw._colors) {
            return PrairieDraw._colors[c];
        } else {
            return c;
        }
    } else if (type in PrairieDraw._colors) {
        return PrairieDraw._colors[type];
    } else {
        return type;
    }
}

/** @private Set shape drawing properties for drawing hidden lines.
*/

PrairieDraw.prototype.setShapeDrawHidden = function() {
    this._props.shapeStrokeWidthPx = this._props.hiddenLineWidthPx;
    this._props.shapeStrokePattern = this._props.hiddenLinePattern;
    this._props.shapeOutlineColor = this._props.hiddenLineColor;
};

/*****************************************************************************/

/** Add an external option for this drawing.

    @param {string} name The option name.
    @param {object} value The default initial value.
*/
PrairieDraw.prototype.addOption = function(name, value, triggerRedraw) {
    if (!(name in this._options)) {
        this._options[name] = {
            value: value,
            resetValue: value,
            callbacks: {},
            triggerRedraw: ((triggerRedraw === undefined) ? true : triggerRedraw)
        };
    } else if (!("value" in this._options[name])) {
        var option = this._options[name];
        option.value = value;
        option.resetValue = value;
        for (var p in option.callbacks) {
            option.callbacks[p](option.value);
        }
    }
}

/** Set an option to a given value.

    @param {string} name The option name.
    @param {object} value The new value for the option.
    @param {bool} redraw (Optional) Whether to trigger a redraw() (default: true).
    @param {Object} trigger (Optional) The object that triggered the change.
    @param {bool} setReset (Optional) Also set this value to be the new reset value (default: false).
*/
PrairieDraw.prototype.setOption = function(name, value, redraw, trigger, setReset) {
    redraw = (redraw === undefined) ? true : redraw;
    setReset = (setReset === undefined) ? false : setReset;
    if (!(name in this._options)) {
        throw new Error("PrairieDraw: unknown option: " + name);
    }
    var option = this._options[name];
    option.value = value;
    if (setReset) {
        option.resetValue = value;
    }
    for (var p in option.callbacks) {
        option.callbacks[p](option.value, trigger);
    }
    if (redraw) {
        this.redraw();
    }
}

/** Get the value of an option.

    @param {string} name The option name.
    @return {object} The current value for the option.
*/
PrairieDraw.prototype.getOption = function(name) {
    if (!(name in this._options)) {
        throw new Error("PrairieDraw: unknown option: " + name);
    }
    if (!("value" in this._options[name])) {
        throw new Error("PrairieDraw: option has no value: " + name);
    }
    return this._options[name].value;
}

/** Set an option to the logical negation of its current value.

    @param {string} name The option name.
*/
PrairieDraw.prototype.toggleOption = function(name) {
    if (!(name in this._options)) {
        throw new Error("PrairieDraw: unknown option: " + name);
    }
    if (!("value" in this._options[name])) {
        throw new Error("PrairieDraw: option has no value: " + name);
    }
    var option = this._options[name];
    option.value = !option.value;
    for (var p in option.callbacks) {
        option.callbacks[p](option.value);
    }
    this.redraw();
}

/** Register a callback on option changes.

    @param {string} name The option to register on.
    @param {Function} callback The callback(value) function.
    @param {string} callbackID (Optional) The ID of the callback. If omitted, a new unique ID will be generated.
*/
PrairieDraw.prototype.registerOptionCallback = function(name, callback, callbackID) {
    if (!(name in this._options)) {
        throw new Error("PrairieDraw: unknown option: " + name);
    }
    var option = this._options[name];
    var useID;
    if (callbackID === undefined) {
        var nextIDNumber = 0, curIDNumber;
        for (var p in option.callbacks) {
            curIDNumber = parseInt(p);
            if (isFinite(curIDNumber)) {
                nextIDNumber = Math.max(nextIDNumber, curIDNumber + 1);
            }
        }
        useID = nextIDNumber.toString();
    } else {
        useID = callbackID;
    }
    option.callbacks[useID] = callback.bind(this);
    option.callbacks[useID](option.value);
}

/** Clear the value for the given option.

    @param {string} name The option to clear.
*/
PrairieDraw.prototype.clearOptionValue = function(name) {
    if (!(name in this._options)) {
        throw new Error("PrairieDraw: unknown option: " + name);
    }
    if ("value" in this._options[name]) {
        delete this._options[name].value;
    }
    this.redraw();
};

/** Reset the value for the given option.

    @param {string} name The option to reset.
*/
PrairieDraw.prototype.resetOptionValue = function(name) {
    if (!(name in this._options)) {
        throw new Error("PrairieDraw: unknown option: " + name);
    }
    var option = this._options[name];
    if (!("resetValue" in option)) {
        throw new Error("PrairieDraw: option has no resetValue: " + name);
    }
    option.value = option.resetValue;
    for (var p in option.callbacks) {
        option.callbacks[p](option.value);
    }
};

/*****************************************************************************/

/** Save the graphics state (properties, options, and transformations).

    @see restore().
*/
PrairieDraw.prototype.save = function() {
    this._ctx.save();
    var oldProps = {};
    for (p in this._props) {
        oldProps[p] = this._props[p];
    }
    this._propStack.push(oldProps);
    this._transStack.push(this._trans.dup());
    this._trans3DStack.push(this._trans3D.dup());
}

/** Restore the graphics state (properties, options, and transformations).

    @see save().
*/
PrairieDraw.prototype.restore = function() {
    this._ctx.restore();
    if (this._propStack.length == 0) {
        throw new Error("PrairieDraw: tried to restore() without corresponding save()");
    }
    if (this._propStack.length != this._transStack.length) {
        throw new Error("PrairieDraw: incompatible save stack lengths");
    }
    if (this._propStack.length != this._trans3DStack.length) {
        throw new Error("PrairieDraw: incompatible save stack lengths");
    }
    this._props = this._propStack.pop();
    this._trans = this._transStack.pop();
    this._trans3D = this._trans3DStack.pop();
}

/** Restore all outstanding saves.
*/
PrairieDraw.prototype.restoreAll = function() {
    while (this._propStack.length > 0) {
        this.restore();
    }
    if (this._saveTrans !== undefined) {
        this._trans = this._saveTrans;
    }
};

/*****************************************************************************/

/** Reset the canvas image and drawing context.
*/
PrairieDraw.prototype.clearDrawing = function() {
    this._ctx.clearRect(0, 0, this._width, this._height);
}

/** Reset everything to the intial state.
*/
PrairieDraw.prototype.reset = function() {
    for (optionName in this._options) {
        this.resetOptionValue(optionName)
    }
    this.resetView3D(false);
    this.redraw();
}

/** Stop all action and computation.
*/
PrairieDraw.prototype.stop = function() {
}

/*****************************************************************************/

/** Set the visable coordinate sizes.

    @param {number} xSize The horizontal size of the drawing area in coordinate units.
    @param {number} ySize The vertical size of the drawing area in coordinate units.
    @param {number} canvasWidth (Optional) The width of the canvas in px.
    @param {bool} preserveCanvasSize (Optional) If true, do not resize the canvas to match the coordinate ratio.
*/
PrairieDraw.prototype.setUnits = function(xSize, ySize, canvasWidth, preserveCanvasSize) {
    this.clearDrawing();
    this._trans = Matrix.I(3);
    if (canvasWidth !== undefined) {
        var canvasHeight = Math.floor(ySize / xSize * canvasWidth);
        if ((this._width != canvasWidth) || (this._height != canvasHeight)) {
            this._canvas.width = canvasWidth;
            this._canvas.height = canvasHeight;
            this._width = canvasWidth;
            this._height = canvasHeight;
        }
        preserveCanvasSize = true;
    }
    var xScale = this._width / xSize;
    var yScale = this._height / ySize
    if (xScale < yScale) {
        /** @private */ this._scale = xScale;
        if ((!preserveCanvasSize) && (xScale != yScale)) {
            var newHeight = xScale * ySize;
            this._canvas.height = newHeight;
            this._height = newHeight;
        }
        this.translate($V([this._width / 2, this._height / 2]));
        this.scale($V([1, -1]));
        this.scale($V([xScale, xScale]));
    } else {
        /** @private */ this._scale = yScale;
        if ((!preserveCanvasSize) && (xScale != yScale)) {
            var newWidth = yScale * xSize;
            this._canvas.width = newWidth;
            this._width = newWidth;
        }
        this.translate($V([this._width / 2, this._height / 2]));
        this.scale($V([1, -1]));
        this.scale($V([yScale, yScale]));
    }
    this._saveTrans = this._trans;

}

/*****************************************************************************/

/** Compute the sup-norm of a vector.

    @param {Vector} vector The vector to find the norm of.
    @return {number} The sup-norm.
*/
PrairieDraw.prototype.supNorm = function(vector) {
    return Math.abs(vector.max());
};

/** Take a cross product between an out-of-plane vector and a 2D vector.

    @param {Number} v1k Out-of-plane component of the first vector.
    @param {Vector} v2ij In-plane components of the second vector.
    @return {Vector} A 2D vector given by v1 x v2.
*/
PrairieDraw.prototype.cross2D = function(v1k, v2ij) {
    return $V([- v1k * v2ij.e(2), v1k * v2ij.e(1)]);
};

/** Create a 2D unit vector pointing at a given angle.

    @param {number} angle The counterclockwise angle from the positive x axis (radians).
    @return {Vector} A unit vector in direction angle.
*/
PrairieDraw.prototype.vector2DAtAngle = function(angle) {
    return $V([Math.cos(angle), Math.sin(angle)]);
}

/** Find the counterclockwise angle of the vector from the x axis.

    @param {Vector} vec The vector to find the angle of.
    @return {number} The counterclockwise angle of vec from the x axis.
*/
PrairieDraw.prototype.angleOf = function(vec) {
    var a = Math.atan2(vec.e(2), vec.e(1));
    if (a < 0) {
        a = a + 2 * Math.PI;
    }
    return a;
}

/** Find the counterclockwise angle from the vector vFrom to the vector vTo.

    @param {Vector} vFrom The starting vector.
    @param {Vector} vTo The ending vector.
    @return {number} The counterclockwise angle from vFrom to vTo.
*/
PrairieDraw.prototype.angleFrom = function(vFrom, vTo) {
    return this.angleOf(vTo) - this.angleOf(vFrom);
};

/** Determine a triangle angle from the three side lengths.

    @param {number} a First adjacent side length.
    @param {number} b Second adjacent side length.
    @param {number} c Opposite side length.
    @return {number} The angle C opposite to side c.
*/
PrairieDraw.prototype.cosLawAngle = function(a, b, c) {
    if (a > 0 && b > 0) {
        var C = Math.acos((a * a + b * b - c * c) / (2 * a * b));
        return C;
    } else {
        return 0;
    }
}

/** Determine a triangle side length from two side lengths and the included angle.

    @param {number} a First adjacent side length.
    @param {number} b Second adjacent side length.
    @param {number} C Angle between sides a and b.
    @return {number} The side length c opposite to angle C.
*/
PrairieDraw.prototype.cosLawLength = function(a, b, C) {
    var c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C));
    return c;
}

/** Return the sign of the argument.

    @param {number} x The argument to find the sign of.
    @return {number} Either -1/0/+1 if x is negative/zero/positive.
*/
PrairieDraw.prototype.sign = function(x) {
    if (x > 0) {
        return 1;
    } else if (x < 0) {
        return -1;
    } else {
        return 0;
    }
}

/** Linearly interpolate between two numbers.

    @param {number} x0 The first number.
    @param {number} x1 The second number.
    @param {number} alpha The proportion of x1 versus x0 (between 0 and 1).
    @return {number} The quanity (1 - alpha) * x0 + alpha * x1.
*/
PrairieDraw.prototype.linearInterp = function(x0, x1, alpha) {
    return (1 - alpha) * x0 + alpha * x1;
}

/** Linearly de-interpolate between two numbers.

    @param {number} x0 The first number.
    @param {number} x1 The second number.
    @param {number} x The value to be de-interpolated.
    @return {number} The value alpha so that x = linearInterp(x0, x1, alpha).
*/
PrairieDraw.prototype.linearDeinterp = function(x0, x1, x) {
    return (x - x0) / (x1 - x0);
}

/** Linearly map based on two points.

    @param {number} x0 The first number.
    @param {number} x1 The second number.
    @param {number} y0 The image of x0.
    @param {number} y1 The image of y1.
    @param {number} x The value to be mapped.
    @param {number} The value y that x maps to.
*/
PrairieDraw.prototype.linearMap = function(x0, x1, y0, y1, x) {
    return this.linearInterp(y0, y1, this.linearDeinterp(x0, x1, x));
}

/** Linearly interpolate between two vectors.

    @param {Vector} x0 The first vector.
    @param {Vector} x1 The second vector.
    @param {number} alpha The proportion of x1 versus x0 (between 0 and 1).
    @return {number} The quanity (1 - alpha) * x0 + alpha * x1.
*/
PrairieDraw.prototype.linearInterpVector = function(x0, x1, alpha) {
    return x0.x(1 - alpha).add(x1.x(alpha));
}

/** Linearly interpolate between two arrays.

    @param {Array} a0 The first array.
    @param {Array} a1 The second array.
    @param {number} alpha The proportion of a1 versus a0 (between 0 and 1).
    @return {Array} The state (1 - alpha) * a0 + alpha * a1.
*/
PrairieDraw.prototype.linearInterpArray = function(a0, a1, alpha) {
    var newArray = [];
    for (var i = 0; i < Math.min(a0.length, a1.length); i++) {
        newArray.push(this.linearInterp(a0[i], a1[i], alpha));
    }
    return newArray;
}

/** Linearly interpolate between two states (objects with scalar members).

    @param {Object} s0 The first state.
    @param {Object} s1 The second state.
    @param {number} alpha The proportion of s1 versus s0 (between 0 and 1).
    @return {Object} The state (1 - alpha) * s0 + alpha * s1.
*/
PrairieDraw.prototype.linearInterpState = function(s0, s1, alpha) {
    var newState = {};
    for (var e in s0) {
        newState[e] = this.linearInterp(s0[e], s1[e], alpha);
    }
    return newState;
}

/** Duplicate a state (object with scalar membes).

    @param {Object} state The state to duplicate.
    @return {number} A copy of the state.
*/
PrairieDraw.prototype.dupState = function(state) {
    var newState = {};
    for (e in state) {
        newState[e] = state[e];
    }
    return newState;
}

/*****************************************************************************/

/** Set options with defaults.

    @param (Object) options The given options.
    @param (Object) defaults The default properties.
*/
PrairieDraw.prototype.defaultedOptions = function(options, defaults) {
    var newOptions = {};
    if (defaults !== undefined) {
        for (e in defaults) {
            newOptions[e] = defaults[e];
        }
    }
    if (options !== undefined) {
        for (e in options) {
            newOptions[e] = options[e];
        }
    }
    return newOptions;
};

/*****************************************************************************/

/** Draw a point.

    @param {Vector} posDw Position of the point (drawing coords).
*/
PrairieDraw.prototype.point = function(posDw) {
    posDw = this.pos3To2(posDw);
    var posPx = this.pos2Px(posDw);
    this._ctx.beginPath();
    this._ctx.arc(posPx.e(1), posPx.e(2), this._props.pointRadiusPx, 0, 2 * Math.PI);
    this._ctx.fillStyle = this._props.shapeOutlineColor;
    this._ctx.fill();
}

/*****************************************************************************/

/** @private Set the stroke/fill styles for drawing lines.

    @param {string} type The type of line being drawn.
*/
PrairieDraw.prototype._setLineStyles = function(type) {
    var col = this._getColorProp(type);
    this._ctx.strokeStyle = col;
    this._ctx.fillStyle = col;
}

/** Return the dash array for the given line pattern.

    @param {string} type The type of the dash pattern ('solid', 'dashed', 'dotted').
    @return {Array} The numerical array of dash segment lengths.
*/
PrairieDraw.prototype._dashPattern = function(type) {
    if (type === 'solid') {
        return [];
    } else if (type === 'dashed') {
        return [6, 6];
    } else if (type === 'dotted') {
        return [2, 2];
    } else {
        throw new Error("PrairieDraw: unknown dash pattern: " + type);
    }
};

/** Draw a single line given start and end positions.

    @param {Vector} startDw Initial point of the line (drawing coords).
    @param {Vector} endDw Final point of the line (drawing coords).
    @param {string} type Optional type of line being drawn.
*/
PrairieDraw.prototype.line = function(startDw, endDw, type) {
    startDw = this.pos3To2(startDw);
    endDw = this.pos3To2(endDw);
    var startPx = this.pos2Px(startDw);
    var endPx = this.pos2Px(endDw);
    this._ctx.save();
    this._setLineStyles(type);
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.beginPath();
    this._ctx.moveTo(startPx.e(1), startPx.e(2));
    this._ctx.lineTo(endPx.e(1), endPx.e(2));
    this._ctx.stroke();
    this._ctx.restore();
}
/*****************************************************************************/

/** Draw a cubic Bezier segment.

    @param {Vector} p0Dw The starting point.
    @param {Vector} p1Dw The first control point.
    @param {Vector} p2Dw The second control point.
    @param {Vector} p3Dw The ending point.
    @param {string} type (Optional) type of line being drawn.
*/
PrairieDraw.prototype.cubicBezier = function(p0Dw, p1Dw, p2Dw, p3Dw, type) {
    var p0Px = this.pos2Px(this.pos3To2(p0Dw));
    var p1Px = this.pos2Px(this.pos3To2(p1Dw));
    var p2Px = this.pos2Px(this.pos3To2(p2Dw));
    var p3Px = this.pos2Px(this.pos3To2(p3Dw));
    this._ctx.save();
    this._setLineStyles(type);
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.beginPath();
    this._ctx.moveTo(p0Px.e(1), p0Px.e(2));
    this._ctx.bezierCurveTo(p1Px.e(1), p1Px.e(2), p2Px.e(1), p2Px.e(2), p3Px.e(1), p3Px.e(2))
    this._ctx.stroke();
    this._ctx.restore();
}

/*****************************************************************************/

/** Draw a quadratic Bezier segment.

    @param {Vector} p0Dw The starting point.
    @param {Vector} p1Dw The control point.
    @param {Vector} p2Dw The ending point.
    @param {string} type (Optional) type of line being drawn.
*/
PrairieDraw.prototype.quadraticBezier = function(p0Dw, p1Dw, p2Dw, type) {
    var p0Px = this.pos2Px(this.pos3To2(p0Dw));
    var p1Px = this.pos2Px(this.pos3To2(p1Dw));
    var p2Px = this.pos2Px(this.pos3To2(p2Dw));
    this._ctx.save();
    this._setLineStyles(type);
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.beginPath();
    this._ctx.moveTo(p0Px.e(1), p0Px.e(2));
    this._ctx.quadraticCurveTo(p1Px.e(1), p1Px.e(2), p2Px.e(1), p2Px.e(2))
    this._ctx.stroke();
    this._ctx.restore();
}

/*****************************************************************************/

/** @private Draw an arrowhead in pixel coords.

    @param {Vector} posPx Position of the tip.
    @param {Vector} dirPx Direction vector that the arrowhead points in.
    @param {number} lenPx Length of the arrowhead.
*/
PrairieDraw.prototype._arrowheadPx = function(posPx, dirPx, lenPx) {
    var dxPx = - (1 - this._props.arrowheadOffsetRatio) * lenPx;
    var dyPx = this._props.arrowheadWidthRatio * lenPx;
    
    this._ctx.save();
    this._ctx.translate(posPx.e(1), posPx.e(2));
    this._ctx.rotate(this.angleOf(dirPx));
    this._ctx.beginPath();
    this._ctx.moveTo(0, 0);
    this._ctx.lineTo(-lenPx, dyPx);
    this._ctx.lineTo(dxPx, 0);
    this._ctx.lineTo(-lenPx, -dyPx);
    this._ctx.closePath();
    this._ctx.fill();
    this._ctx.restore();
}

/** @private Draw an arrowhead.

    @param {Vector} posDw Position of the tip (drawing coords).
    @param {Vector} dirDw Direction vector that the arrowhead point in (drawing coords).
    @param {number} lenPx Length of the arrowhead (pixel coords).
*/
PrairieDraw.prototype._arrowhead = function(posDw, dirDw, lenPx) {
    var posPx = this.pos2Px(posDw);
    var dirPx = this.vec2Px(dirDw);
    this._arrowheadPx(posPx, dirPx, lenPx);
}

/** Draw an arrow given start and end positions.

    @param {Vector} startDw Initial point of the arrow (drawing coords).
    @param {Vector} endDw Final point of the arrow (drawing coords).
    @param {string} type Optional type of vector being drawn.
*/
PrairieDraw.prototype.arrow = function(startDw, endDw, type) {
    startDw = this.pos3To2(startDw);
    endDw = this.pos3To2(endDw);
    var offsetDw = endDw.subtract(startDw);
    var offsetPx = this.vec2Px(offsetDw);
    var arrowLengthPx = offsetPx.modulus();
    var lineEndDw, drawArrowHead, arrowheadLengthPx;
    if (arrowLengthPx < 1) {
        // if too short, just draw a simple line
        lineEndDw = endDw;
        drawArrowHead = false;
    } else {
        var arrowheadMaxLengthPx = this._props.arrowheadLengthRatio * this._props.arrowLineWidthPx;
        arrowheadLengthPx = Math.min(arrowheadMaxLengthPx, arrowLengthPx / 2);
        var arrowheadCenterLengthPx = (1 - this._props.arrowheadOffsetRatio) * arrowheadLengthPx;
        var lineLengthPx = arrowLengthPx - arrowheadCenterLengthPx;
        lineEndDw = startDw.add(offsetDw.x(lineLengthPx / arrowLengthPx));
        drawArrowHead = true;
    }

    var startPx = this.pos2Px(startDw);
    var lineEndPx = this.pos2Px(lineEndDw);
    this.save();
    this._ctx.lineWidth = this._props.arrowLineWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.arrowLinePattern));
    this._setLineStyles(type);
    this._ctx.beginPath();
    this._ctx.moveTo(startPx.e(1), startPx.e(2));
    this._ctx.lineTo(lineEndPx.e(1), lineEndPx.e(2));
    this._ctx.stroke();
    if (drawArrowHead) {
        this._arrowhead(endDw, offsetDw, arrowheadLengthPx);
    }
    this.restore();
}

/** Draw an arrow given the start position and offset.

    @param {Vector} startDw Initial point of the arrow (drawing coords).
    @param {Vector} offsetDw Offset vector of the arrow (drawing coords).
    @param {string} type Optional type of vector being drawn.
*/
PrairieDraw.prototype.arrowFrom = function(startDw, offsetDw, type) {
    var endDw = startDw.add(offsetDw);
    this.arrow(startDw, endDw, type);
}

/** Draw an arrow given the end position and offset.

    @param {Vector} endDw Final point of the arrow (drawing coords).
    @param {Vector} offsetDw Offset vector of the arrow (drawing coords).
    @param {string} type Optional type of vector being drawn.
*/
PrairieDraw.prototype.arrowTo = function(endDw, offsetDw, type) {
    var startDw = endDw.subtract(offsetDw);
    this.arrow(startDw, endDw, type);
}

/** Draw an arrow out of the page (circle with centered dot).

    @param {Vector} posDw The position of the arrow.
    @param {string} type Optional type of vector being drawn.
*/
PrairieDraw.prototype.arrowOutOfPage = function(posDw, type) {
    var posPx = this.pos2Px(posDw);
    var r = this._props.arrowOutOfPageRadiusPx;
    var rs = r / Math.sqrt(2);
    this._ctx.save();
    this._ctx.translate(posPx.e(1), posPx.e(2));

    this._ctx.beginPath();
    this._ctx.arc(0, 0, r, 0, 2 * Math.PI);
    this._ctx.fillStyle = "rgb(255, 255, 255)";
    this._ctx.fill();

    this._ctx.lineWidth = this._props.arrowLineWidthPx;
    this._setLineStyles(type);
    this._ctx.stroke();

    this._ctx.beginPath();
    this._ctx.arc(0, 0, this._props.arrowLineWidthPx * 0.7, 0, 2 * Math.PI);
    this._ctx.fill();

    this._ctx.restore();
}

/** Draw an arrow into the page (circle with times).

    @param {Vector} posDw The position of the arrow.
    @param {string} type Optional type of vector being drawn.
*/
PrairieDraw.prototype.arrowIntoPage = function(posDw, type) {
    var posPx = this.pos2Px(posDw);
    var r = this._props.arrowOutOfPageRadiusPx;
    var rs = r / Math.sqrt(2);
    this._ctx.save();
    this._ctx.lineWidth = this._props.arrowLineWidthPx;
    this._setLineStyles(type);
    this._ctx.translate(posPx.e(1), posPx.e(2));

    this._ctx.beginPath();
    this._ctx.arc(0, 0, r, 0, 2 * Math.PI);
    this._ctx.fillStyle = "rgb(255, 255, 255)";
    this._ctx.fill();
    this._ctx.stroke();

    this._ctx.beginPath();
    this._ctx.moveTo(-rs, -rs);
    this._ctx.lineTo(rs, rs);
    this._ctx.stroke();

    this._ctx.beginPath();
    this._ctx.moveTo(rs, -rs);
    this._ctx.lineTo(-rs, rs);
    this._ctx.stroke();

    this._ctx.restore();
}

/*****************************************************************************/

/** Draw a circle arrow by specifying the center and extent.

    @param {Vector} posDw The center of the circle arrow.
    @param {number} radDw The radius at the mid-angle.
    @param {number} centerAngleDw The center angle (counterclockwise from x axis, in radians).
    @param {number} extentAngleDw The extent of the arrow (counterclockwise, in radians).
    @param {string} type (Optional) The type of the arrow.
    @param {bool} fixedRad (Optional) Whether to use a fixed radius (default: false).
*/
PrairieDraw.prototype.circleArrowCentered = function(posDw, radDw, centerAngleDw, extentAngleDw, type, fixedRad) {
    var startAngleDw = centerAngleDw - extentAngleDw / 2;
    var endAngleDw = centerAngleDw + extentAngleDw / 2;
    this.circleArrow(posDw, radDw, startAngleDw, endAngleDw, type, fixedRad)
}

/** Draw a circle arrow.

    @param {Vector} posDw The center of the circle arrow.
    @param {number} radDw The radius at the mid-angle.
    @param {number} startAngleDw The starting angle (counterclockwise from x axis, in radians).
    @param {number} endAngleDw The ending angle (counterclockwise from x axis, in radians).
    @param {string} type (Optional) The type of the arrow.
    @param {bool} fixedRad (Optional) Whether to use a fixed radius (default: false).
    @param {number} idealSegmentSize (Optional) The ideal linear segment size to use (radians).
*/
PrairieDraw.prototype.circleArrow = function(posDw, radDw, startAngleDw, endAngleDw, type, fixedRad, idealSegmentSize) {
    this.save();
    this._ctx.lineWidth = this._props.arrowLineWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.arrowLinePattern));
    this._setLineStyles(type);

    // convert to Px coordinates
    var startOffsetDw = this.vector2DAtAngle(startAngleDw).x(radDw);
    var posPx = this.pos2Px(posDw);
    var startOffsetPx = this.vec2Px(startOffsetDw);
    var radiusPx = startOffsetPx.modulus();
    var startAnglePx = this.angleOf(startOffsetPx);
    var deltaAngleDw = endAngleDw - startAngleDw;
    // assume a possibly reflected/rotated but equally scaled Dw/Px transformation
    var deltaAnglePx = this._transIsReflection() ? (- deltaAngleDw) : deltaAngleDw;
    var endAnglePx = startAnglePx + deltaAnglePx;

    // compute arrowhead properties
    var startRadiusPx = this._circleArrowRadius(radiusPx, startAnglePx, startAnglePx, endAnglePx, fixedRad);
    var endRadiusPx = this._circleArrowRadius(radiusPx, endAnglePx, startAnglePx, endAnglePx, fixedRad);
    var arrowLengthPx = radiusPx * Math.abs(endAnglePx - startAnglePx);
    var arrowheadMaxLengthPx = this._props.arrowheadLengthRatio * this._props.arrowLineWidthPx;
    var arrowheadLengthPx = Math.min(arrowheadMaxLengthPx, arrowLengthPx / 2);
    var arrowheadCenterLengthPx = (1 - this._props.arrowheadOffsetRatio) * arrowheadLengthPx;
    var arrowheadExtraCenterLengthPx = (1 - this._props.arrowheadOffsetRatio / 3) * arrowheadLengthPx;
    var arrowheadAnglePx = arrowheadCenterLengthPx / endRadiusPx;
    var arrowheadExtraAnglePx = arrowheadExtraCenterLengthPx / endRadiusPx;
    var preEndAnglePx = endAnglePx - this.sign(endAnglePx - startAnglePx) * arrowheadAnglePx;
    var arrowBaseAnglePx = endAnglePx - this.sign(endAnglePx - startAnglePx) * arrowheadExtraAnglePx;

    this._ctx.save();
    this._ctx.translate(posPx.e(1), posPx.e(2));
    var idealSegmentSize = (idealSegmentSize === undefined) ? 0.2 : idealSegmentSize; // radians
    var numSegments = Math.ceil(Math.abs(preEndAnglePx - startAnglePx) / idealSegmentSize);
    var i, anglePx, rPx;
    var offsetPx = this.vector2DAtAngle(startAnglePx).x(startRadiusPx);
    this._ctx.beginPath();
    this._ctx.moveTo(offsetPx.e(1), offsetPx.e(2));
    for (i = 1; i <= numSegments; i++) {
        anglePx = this.linearInterp(startAnglePx, preEndAnglePx, i / numSegments);
        rPx = this._circleArrowRadius(radiusPx, anglePx, startAnglePx, endAnglePx, fixedRad);
        offsetPx = this.vector2DAtAngle(anglePx).x(rPx);
        this._ctx.lineTo(offsetPx.e(1), offsetPx.e(2));
    }
    this._ctx.stroke();
    this._ctx.restore();

    var arrowBaseRadiusPx = this._circleArrowRadius(radiusPx, arrowBaseAnglePx, startAnglePx, endAnglePx, fixedRad);
    var arrowPosPx = posPx.add(this.vector2DAtAngle(endAnglePx).x(endRadiusPx));
    var arrowBasePosPx = posPx.add(this.vector2DAtAngle(arrowBaseAnglePx).x(arrowBaseRadiusPx));
    var arrowDirPx = arrowPosPx.subtract(arrowBasePosPx)
    var arrowPosDw = this.pos2Dw(arrowPosPx);
    var arrowDirDw = this.vec2Dw(arrowDirPx);
    this._arrowhead(arrowPosDw, arrowDirDw, arrowheadLengthPx);

    this.restore();
}

/** @private Compute the radius at a certain angle within a circle arrow.

    @param {number} midRadPx The radius at the midpoint of the circle arrow.
    @param {number} anglePx The angle at which to find the radius.
    @param {number} startAnglePx The starting angle (counterclockwise from x axis, in radians).
    @param {number} endAnglePx The ending angle (counterclockwise from x axis, in radians).
    @return {number} The radius at the given angle (pixel coords).
    @param {bool} fixedRad (Optional) Whether to use a fixed radius (default: false).
*/
PrairieDraw.prototype._circleArrowRadius = function(midRadPx, anglePx, startAnglePx, endAnglePx, fixedRad) {
    if (fixedRad !== undefined && fixedRad === true) {
        return midRadPx;
    }
    if (Math.abs(endAnglePx - startAnglePx) < 1e-4) {
        return midRadPx;
    }
    var arrowheadMaxLengthPx = this._props.arrowheadLengthRatio * this._props.arrowLineWidthPx;
    var spacingPx = arrowheadMaxLengthPx * this._props.arrowheadWidthRatio
        * this._props.circleArrowWrapOffsetRatio;
    var circleArrowWrapDensity = midRadPx * Math.PI * 2 / spacingPx;
    var midAnglePx = (startAnglePx + endAnglePx) / 2;
    var offsetAnglePx = (anglePx - midAnglePx) * this.sign(endAnglePx - startAnglePx);
    if (offsetAnglePx > 0) {
        return midRadPx * (1 + offsetAnglePx / circleArrowWrapDensity);
    } else {
        return midRadPx * Math.exp(offsetAnglePx / circleArrowWrapDensity);
    }
}

/*****************************************************************************/

/** Draw an arc in 3D.

    @param {Vector} posDw The center of the arc.
    @param {number} radDw The radius of the arc.
    @param {Vector} normDw (Optional) The normal vector to the plane containing the arc (default: z axis).
    @param {Vector} refDw (Optional) The reference vector to measure angles from (default: an orthogonal vector to normDw).
    @param {number} startAngleDw (Optional) The starting angle (counterclockwise from refDw about normDw, in radians, default: 0).
    @param {number} endAngleDw (Optional) The ending angle (counterclockwise from refDw about normDw, in radians, default: 2 pi).
    @param {string} type (Optional) The type of the line.
    @param {Object} options (Optional) Various options.
*/
PrairieDraw.prototype.arc3D = function(posDw, radDw, normDw, refDw, startAngleDw, endAngleDw, options) {
    posDw = this.pos2To3(posDw);
    normDw = (normDw === undefined) ? Vector.k : normDw;
    refDw = (refDw === undefined) ? this.chooseNormVec(normDw) : refDw;
    var fullCircle = (startAngleDw === undefined && endAngleDw === undefined);
    startAngleDw = (startAngleDw === undefined) ? 0 : startAngleDw;
    endAngleDw = (endAngleDw === undefined) ? (2 * Math.PI) : endAngleDw;
    var useOptions = (options === undefined) ? {} : options;
    var filled = (useOptions.filled === undefined) ? false : useOptions.filled;
    var stroked = (useOptions.stroked === undefined) ? true : useOptions.stroked;

    options = (options === undefined) ? {} : options;
    var idealSegmentSize = (options.idealSegmentSize === undefined) ? (2 * Math.PI / 40) : options.idealSegmentSize;

    var uDw = this.orthComp(refDw, normDw).toUnitVector();
    var vDw = normDw.toUnitVector().cross(uDw);
    var numSegments = Math.ceil(Math.abs(endAngleDw - startAngleDw) / idealSegmentSize);
    var points = [];
    var theta, p;
    for (var i = 0; i <= numSegments; i++) {
        theta = this.linearInterp(startAngleDw, endAngleDw, i / numSegments);
        p = posDw.add(uDw.x(radDw * Math.cos(theta))).add(vDw.x(radDw * Math.sin(theta)));
        points.push(this.pos3To2(p));
    }
    var closed = fullCircle;
    if (fullCircle) {
        points.pop();
    }
    this.polyLine(points, closed, filled, stroked);
};

/*****************************************************************************/

/** Draw a circle arrow in 3D.

    @param {Vector} posDw The center of the arc.
    @param {number} radDw The radius of the arc.
    @param {Vector} normDw (Optional) The normal vector to the plane containing the arc (default: z axis).
    @param {Vector} refDw (Optional) The reference vector to measure angles from (default: x axis).
    @param {number} startAngleDw (Optional) The starting angle (counterclockwise from refDw about normDw, in radians, default: 0).
    @param {number} endAngleDw (Optional) The ending angle (counterclockwise from refDw about normDw, in radians, default: 2 pi).
    @param {string} type (Optional) The type of the line.
    @param {Object} options (Optional) Various options.
*/
PrairieDraw.prototype.circleArrow3D = function(posDw, radDw, normDw, refDw, startAngleDw, endAngleDw, type, options) {
    posDw = this.pos2To3(posDw);
    normDw = normDw || Vector.k;
    refDw = refDw || Vector.i;
    startAngleDw = (startAngleDw === undefined) ? 0 : startAngleDw;
    endAngleDw = (endAngleDw === undefined) ? (2 * Math.PI) : endAngleDw;

    options = (options === undefined) ? {} : options;
    var fixedRad = (options.fixedRad === undefined) ? true : options.fixedRad;
    // FIXME: implement fixedRad === false
    var idealSegmentSize = (options.idealSegmentSize === undefined) ? (2 * Math.PI / 40) : options.idealSegmentSize;

    var uDw = this.orthComp(refDw, normDw).toUnitVector();
    var vDw = normDw.toUnitVector().cross(uDw);
    var numSegments = Math.ceil(Math.abs(endAngleDw - startAngleDw) / idealSegmentSize);
    var points = [];
    var theta, p;
    for (var i = 0; i <= numSegments; i++) {
        theta = this.linearInterp(startAngleDw, endAngleDw, i / numSegments);
        p = posDw.add(uDw.x(radDw * Math.cos(theta))).add(vDw.x(radDw * Math.sin(theta)));
        points.push(this.pos3To2(p));
    }
    this.polyLineArrow(points, type);
}

/** Label a circle line in 3D.

    @param {string} labelText The label text.
    @param {Vector} labelAnchor The label anchor (first coord -1 to 1 along the line, second -1 to 1 transverse).
    @param {Vector} posDw The center of the arc.
    @param {number} radDw The radius of the arc.
    @param {Vector} normDw (Optional) The normal vector to the plane containing the arc (default: z axis).
    @param {Vector} refDw (Optional) The reference vector to measure angles from (default: x axis).
    @param {number} startAngleDw (Optional) The starting angle (counterclockwise from refDw about normDw, in radians, default: 0).
    @param {number} endAngleDw (Optional) The ending angle (counterclockwise from refDw about normDw, in radians, default: 2 pi).
    @param {Object} options (Optional) Various options.
*/
PrairieDraw.prototype.labelCircleLine3D = function(labelText, labelAnchor, posDw, radDw, normDw, refDw, startAngleDw, endAngleDw, options) {
    if (labelText === undefined) {
        return;
    }
    posDw = this.pos2To3(posDw);
    normDw = normDw || Vector.k;
    refDw = refDw || Vector.i;
    startAngleDw = (startAngleDw === undefined) ? 0 : startAngleDw;
    endAngleDw = (endAngleDw === undefined) ? (2 * Math.PI) : endAngleDw;

    var uDw = this.orthComp(refDw, normDw).toUnitVector();
    var vDw = normDw.toUnitVector().cross(uDw);

    var theta = this.linearInterp(startAngleDw, endAngleDw, (labelAnchor.e(1) + 1) / 2);
    var p = posDw.add(uDw.x(radDw * Math.cos(theta))).add(vDw.x(radDw * Math.sin(theta)));
    var p2Dw = this.pos3To2(p);
    var t3Dw = uDw.x(-Math.sin(theta)).add(vDw.x(Math.cos(theta)));
    var n3Dw = uDw.x(Math.cos(theta)).add(vDw.x(Math.sin(theta)));
    var t2Px = this.vec2Px(this.vec3To2(t3Dw, p));
    var n2Px = this.vec2Px(this.vec3To2(n3Dw, p));
    n2Px = this.orthComp(n2Px, t2Px);
    t2Px = t2Px.toUnitVector();
    n2Px = n2Px.toUnitVector();
    var oPx = t2Px.x(labelAnchor.e(1)).add(n2Px.x(labelAnchor.e(2)));
    var oDw = this.vec2Dw(oPx);
    var aDw = oDw.x(-1).toUnitVector();
    var anchor = aDw.x(1.0 / Math.abs(aDw.max())).x(Math.abs(labelAnchor.max()));
    this.text(p2Dw, anchor, labelText);
};

/*****************************************************************************/

/** Draw a sphere.

    @param {Vector} posDw Position of the sphere center.
    @param {number} radDw Radius of the sphere.
    @param {bool} filled (Optional) Whether to fill the sphere (default: false).
*/
PrairieDraw.prototype.sphere = function(posDw, radDw, filled) {
    filled = (filled === undefined) ? false : filled;
    var posVw = this.posDwToVw(posDw);
    var edgeDw = posDw.add($V([radDw, 0, 0]));
    var edgeVw = this.posDwToVw(edgeDw);
    var radVw = edgeVw.subtract(posVw).modulus();
    var posDw2 = this.orthProjPos3D(posVw);
    this.circle(posDw2, radVw, filled);
};

/** Draw a circular slice on a sphere.

    @param {Vector} posDw Position of the sphere center.
    @param {number} radDw Radius of the sphere.
    @param {Vector} normDw Normal vector to the circle.
    @param {number} distDw Distance from sphere center to circle center along normDw.
    @param {string} drawBack (Optional) Whether to draw the back line (default: true).
    @param {string} drawFront (Optional) Whether to draw the front line (default: true).
    @param {Vector} refDw (Optional) The reference vector to measure angles from (default: an orthogonal vector to normDw).
    @param {number} startAngleDw (Optional) The starting angle (counterclockwise from refDw about normDw, in radians, default: 0).
    @param {number} endAngleDw (Optional) The ending angle (counterclockwise from refDw about normDw, in radians, default: 2 pi).
*/
PrairieDraw.prototype.sphereSlice = function(posDw, radDw, normDw, distDw, drawBack, drawFront, refDw, startAngleDw, endAngleDw) {
    var cRDwSq = radDw * radDw - distDw * distDw;
    if (cRDwSq <= 0) {
        return;
    }
    var cRDw = Math.sqrt(cRDwSq);
    var circlePosDw = posDw.add(normDw.toUnitVector().x(distDw));
    drawBack = (drawBack === undefined) ? true : drawBack;
    drawFront = (drawFront === undefined) ? true : drawFront;

    var normVw = this.vecDwToVw(normDw);
    if (this.orthComp(Vector.k, normVw).modulus() < 1e-10) {
        // looking straight down on the circle
        if (distDw > 0) {
            // front side, completely visible
            this.arc3D(circlePosDw, cRDw, normDw, refDw, startAngleDw, endAngleDw);
        } else if (distDw < 0) {
            // back side, completely invisible
            this.save();
            this.setShapeDrawHidden();
            this.arc3D(circlePosDw, cRDw, normDw, refDw, startAngleDw, endAngleDw);
            this.restore();
        }
        // if distDw == 0 then it's a great circle, don't draw it
        return;
    };
    var refVw;
    if (refDw === undefined) {
        refVw = this.orthComp(Vector.k, normVw);
        refDw = this.vecVwToDw(refVw);
    }
    refVw = this.vecDwToVw(refDw);
    var uVw = refVw.toUnitVector();
    var vVw = normVw.toUnitVector().cross(uVw);
    var dVw = this.vecDwToVw(normDw.toUnitVector().x(distDw));
    var cRVw = this.vecDwToVw(refDw.toUnitVector().x(cRDw)).modulus();
    var A = -dVw.e(3);
    var B = uVw.e(3) * cRVw;
    var C = vVw.e(3) * cRVw;
    var BCMag = Math.sqrt(B * B + C * C);
    var AN = A / BCMag;
    var BN = B / BCMag;
    var CN = C / BCMag;
    var phi = Math.atan2(C, B);
    if (AN <= -1) {
        // only front
        if (drawFront) {
            this.arc3D(circlePosDw, cRDw, normDw, refDw, startAngleDw, endAngleDw);
        }
    } else if (AN >= 1) {
        // only back
        if (drawBack && this._props.hiddenLineDraw) {
            this.save();
            this.setShapeDrawHidden();
            this.arc3D(circlePosDw, cRDw, normDw, refDw, startAngleDw, endAngleDw);
            this.restore();
        }
    } else {
        // front and back
        var acosAN = Math.acos(AN);
        var theta1 = phi + acosAN
        var theta2 = phi + 2 * Math.PI - acosAN;

        var i, intersections, range;
        if (drawBack && this._props.hiddenLineDraw) {
            this.save();
            this.setShapeDrawHidden();
            if (theta2 > theta1) {
                if (startAngleDw === undefined || endAngleDw === undefined) {
                    this.arc3D(circlePosDw, cRDw, normDw, refDw, theta1, theta2);
                } else {
                    intersections = this.intersectAngleRanges([theta1, theta2], [startAngleDw, endAngleDw])
                    for (i = 0; i < intersections.length; i++) {
                        range = intersections[i];
                        this.arc3D(circlePosDw, cRDw, normDw, refDw, range[0], range[1]);
                    }
                }
            }
            this.restore();
        }
        if (drawFront) {
            if (startAngleDw === undefined || endAngleDw === undefined) {
                this.arc3D(circlePosDw, cRDw, normDw, refDw, theta2, theta1 + 2 * Math.PI);
            } else {
                intersections = this.intersectAngleRanges([theta2, theta1 + 2 * Math.PI], [startAngleDw, endAngleDw])
                for (i = 0; i < intersections.length; i++) {
                    range = intersections[i];
                    this.arc3D(circlePosDw, cRDw, normDw, refDw, range[0], range[1]);
                }
            }
        }
    }
}

/*****************************************************************************/

/** Draw a cylinder.

    @param {Vector} baseDw Position of the cylinder base.
    @param {Vector} centerDw Center vector of the cylinder.
    @param {number} radDw Radius of the cylinder.
    @param {Object} options (Optional) Options controlling what to draw and fill (boolean properties: strokeBottomBack, strokeBottomFront, strokeSides, strokeTop, fillFront, fillTop; numeric properties: numSegments, topInnerRadius).
    @return (Vector) The offsetDw radial vector orthogonal to the view direction;
*/
PrairieDraw.prototype.cylinder = function(baseDw, centerDw, radDw, options) {
    options = this.defaultedOptions(options, {strokeBottomBack: true, strokeBottomFront: true, strokeSides: true,
                                              strokeTop: true, fillFront: true, fillTop: true, numSegments: 20, topInnerRadius: 0});
    var centerVw = this.vecDwToVw(centerDw);
    if (centerVw.dot(Vector.k) < 0) {
        // backwards, flip the cylinder
        baseDw = baseDw.add(centerDw);
        centerDw = centerDw.x(-1);
        centerVw = centerVw.x(-1);
    }
    var baseVw = this.posDwToVw(baseDw);
    var topDw = baseDw.add(centerDw);
    var topVw = this.posDwToVw(topDw);
    var edgeDw = baseDw.add(this.chooseNormVec(centerDw).x(radDw));
    var edgeVw = this.posDwToVw(edgeDw);
    var radVw = edgeVw.subtract(baseVw).modulus();
    var offsetVw = centerVw.cross(Vector.k);
    if (offsetVw.modulus() < 1e-10) {
        // top view, looks like a circle
        return;
    }
    offsetVw = offsetVw.toUnitVector().x(radVw);
    var offsetDw = this.vecVwToDw(offsetVw);
    if (Math.abs(centerVw.dot(Vector.k)) < 1e-10) {
        // side view, looks like a rectangle
        return offsetDw;
    }

    var that = this;
    var arcPoints = function(posDw, normDw, refDw, radDw, startAngleDw, endAngleDw) {
        var uDw = that.orthComp(refDw, normDw).toUnitVector();
        var vDw = normDw.toUnitVector().cross(uDw);
        var points = [];
        var theta, p;
        var numSegments = Math.ceil(options.numSegments * Math.abs(endAngleDw - startAngleDw) / Math.PI);
        for (var i = 0; i <= numSegments; i++) {
            theta = that.linearInterp(startAngleDw, endAngleDw, i / numSegments);
            p = posDw.add(uDw.x(radDw * Math.cos(theta))).add(vDw.x(radDw * Math.sin(theta)));
            points.push(that.pos3To2(p));
        }
        return points;
    };
    var bottomBackPoints = arcPoints(baseDw, centerDw, offsetDw, radDw, 0, Math.PI);
    var bottomFrontPoints = arcPoints(baseDw, centerDw, offsetDw, radDw, Math.PI, 2 * Math.PI);
    var topBackPoints = arcPoints(topDw, centerDw, offsetDw, radDw, 0, Math.PI);
    var topFrontPoints = arcPoints(topDw, centerDw, offsetDw, radDw, Math.PI, 2 * Math.PI);
    var topFrontPointsBackwards = arcPoints(topDw, centerDw, offsetDw, radDw, 2 * Math.PI, Math.PI);
    var topPoints = arcPoints(topDw, centerDw, offsetDw, radDw, 0, 2 * Math.PI);
    topPoints.pop();
    var outlinePoints = topBackPoints.concat(bottomFrontPoints);
    var frontOutlinePoints = topFrontPointsBackwards.concat(bottomFrontPoints);
    var topSubPaths = [];
    if (options.topInnerRadius > 0) {
        var topInnerPoints = arcPoints(topDw, centerDw, offsetDw, options.topInnerRadius, 0, 2 * Math.PI);
        topSubPaths = [topInnerPoints];
    }

    if (options.strokeBottomBack) {
        this.polyLine(bottomBackPoints);
    }
    if (options.fillFront && options.fillTop) {
        this.polyLine(outlinePoints, true, true, false, topSubPaths);
    }
    if (options.fillFront && !options.fillTop) {
        this.polyLine(frontOutlinePoints, true, true, false);
    }
    if (!options.fillFront && options.fillTop) {
        this.polyLine(topPoints, true, true, false, topSubPaths);
    }
    if (options.strokeBottomFront) {
        this.polyLine(bottomFrontPoints, false, false, true);
    }
    if (options.strokeTop) {
        this.polyLine(topPoints, true, false, true);
    }
    if (options.strokeSides) {
        this.line(topBackPoints[0], bottomBackPoints[0]);
        this.line(topFrontPoints[0], bottomFrontPoints[0]);
    }

    return offsetDw;
};

/*****************************************************************************/

/** Label an angle with an inset label.

    @param {Vector} pos The corner position.
    @param {Vector} p1 Position of first other point.
    @param {Vector} p2 Position of second other point.
    @param {string} label The label text.
*/
PrairieDraw.prototype.labelAngle = function(pos, p1, p2, label) {
    pos = this.pos3To2(pos);
    p1 = this.pos3To2(p1);
    p2 = this.pos3To2(p2);
    var v1 = p1.subtract(pos);
    var v2 = p2.subtract(pos);
    var vMid = v1.add(v2).x(0.5);
    var anchor = vMid.x(-1.8 / this.supNorm(vMid));
    this.text(pos, anchor, label);
};

/*****************************************************************************/

/** Draw an arc.

    @param {Vector} centerDw The center of the circle.
    @param {Vector} radiusDw The radius of the circle.
    @param {number} startAngle (Optional) The start angle of the arc (radians, default: 0).
    @param {number} endAngle (Optional) The end angle of the arc (radians, default: 2 pi).
    @param {bool} filled (Optional) Whether to fill the arc (default: false).
*/
PrairieDraw.prototype.arc = function(centerDw, radiusDw, startAngle, endAngle, filled) {
    startAngle = (startAngle === undefined) ? 0 : startAngle;
    endAngle = (endAngle === undefined) ? 2 * Math.PI : endAngle;
    filled = (filled === undefined) ? false : filled;
    var centerPx = this.pos2Px(centerDw);
    var offsetDw = $V([radiusDw, 0]);
    var offsetPx = this.vec2Px(offsetDw);
    var radiusPx = offsetPx.modulus();
    this._ctx.save();
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.strokeStyle = this._props.shapeOutlineColor;
    this._ctx.fillStyle = this._props.shapeInsideColor;
    this._ctx.beginPath();
    this._ctx.arc(centerPx.e(1), centerPx.e(2), radiusPx, -endAngle, -startAngle);
    if (filled) {
        this._ctx.fill();
    }
    this._ctx.stroke();
    this._ctx.restore();
}

/*****************************************************************************/

/** Draw a polyLine (closed or open).

    @param {Array} pointsDw A list of drawing coordinates that form the polyLine.
    @param {bool} closed (Optional) Whether the shape should be closed (default: false).
    @param {bool} filled (Optional) Whether the shape should be filled (default: true).
    @param {bool} stroked (Optional) Whether the shape should be stroked (default: true).
    @param (Array) subPaths (Options) A list of additional subpaths to draw (default: []).
*/
PrairieDraw.prototype.polyLine = function(pointsDw, closed, filled, stroked, subPaths) {
    if (pointsDw.length < 2) {
        return;
    }
    this._ctx.save();
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.strokeStyle = this._props.shapeOutlineColor;
    this._ctx.fillStyle = this._props.shapeInsideColor;

    this._ctx.beginPath();
    var allSubPaths = (subPaths === undefined) ? [] : subPaths;
    allSubPaths.unshift(pointsDw);
    for (var iSubPath = 0; iSubPath < allSubPaths.length; iSubPath++) {
        var subPathPointsDw = allSubPaths[iSubPath];
        var pDw = this.pos3To2(subPathPointsDw[0]);
        var pPx = this.pos2Px(pDw);
        this._ctx.moveTo(pPx.e(1), pPx.e(2));
        for (var i = 1; i < subPathPointsDw.length; i++) {
            pDw = this.pos3To2(subPathPointsDw[i]);
            pPx = this.pos2Px(pDw);
            this._ctx.lineTo(pPx.e(1), pPx.e(2));
        }
        if (closed !== undefined && closed === true) {
            this._ctx.closePath();
        }
    }

    if (closed !== undefined && closed === true) {
        if (filled === undefined || filled === true) {
            this._ctx.fill(fillRule="evenodd");
        }
    }
    if (stroked === undefined || stroked === true) {
        this._ctx.stroke();
    }
    this._ctx.restore();
}

/** Draw a polyLine arrow.

    @param {Array} pointsDw A list of drawing coordinates that form the polyLine.
*/
PrairieDraw.prototype.polyLineArrow = function(pointsDw, type) {
    if (pointsDw.length < 2) {
        return;
    }

    // convert the line to pixel coords and find its length
    var pointsPx = [];
    var i;
    var polyLineLengthPx = 0;
    for (i = 0; i < pointsDw.length; i++) {
        pointsPx.push(this.pos2Px(this.pos3To2(pointsDw[i])));
        if (i > 0) {
            polyLineLengthPx += pointsPx[i].subtract(pointsPx[i - 1]).modulus();
        }
    }

    // shorten the line to fit the arrowhead, dropping points and moving the last point
    var drawArrowHead;
    if (polyLineLengthPx < 1) {
        // if too short, don't draw the arrowhead
        drawArrowHead = false;
    } else {
        drawArrowHead = true;
        var arrowheadMaxLengthPx = this._props.arrowheadLengthRatio * this._props.arrowLineWidthPx;
        var arrowheadLengthPx = Math.min(arrowheadMaxLengthPx, polyLineLengthPx / 2);
        var arrowheadCenterLengthPx = (1 - this._props.arrowheadOffsetRatio) * arrowheadLengthPx;
        var lengthToRemovePx = arrowheadCenterLengthPx;
        i = pointsPx.length - 1;
        var arrowheadEndPx = pointsPx[i];
        var segmentLengthPx;
        while (i > 0) {
            segmentLengthPx = pointsPx[i].subtract(pointsPx[i - 1]).modulus();
            if (lengthToRemovePx > segmentLengthPx) {
                lengthToRemovePx -= segmentLengthPx;
                pointsPx.pop();
                i--;
            } else {
                pointsPx[i] = this.linearInterpVector(pointsPx[i], pointsPx[i - 1],
                                                      lengthToRemovePx / segmentLengthPx);
                break;
            }
        }
        var arrowheadBasePx = pointsPx[i];
        var arrowheadOffsetPx = arrowheadEndPx.subtract(arrowheadBasePx);
    }
    
    // draw the line
    this._ctx.save();
    this._ctx.lineWidth = this._props.arrowLineWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.arrowLinePattern));
    this._setLineStyles(type);
    this._ctx.beginPath();
    var pPx = pointsPx[0];
    this._ctx.moveTo(pPx.e(1), pPx.e(2));
    for (var i = 1; i < pointsPx.length; i++) {
        pPx = pointsPx[i];
        this._ctx.lineTo(pPx.e(1), pPx.e(2));
    }
    this._ctx.stroke();

    // draw the arrowhead
    if (drawArrowHead) {
        i = pointsPx[i];
        this._arrowheadPx(arrowheadEndPx, arrowheadOffsetPx, arrowheadLengthPx);
    }
    this._ctx.restore();
}

/** Covert an array of offsets to absolute points.

    @param {Array} offsets A list of offset vectors.
    @return {Array} The corresponding absolute points.
*/
PrairieDraw.prototype.offsets2Points = function(offsets) {
    var points = [];
    if (offsets.length < 1) {
        return;
    }
    points[0] = offsets[0].dup();
    for (var i = 1; i < offsets.length; i++) {
        points[i] = points[i-1].add(offsets[i]);
    }
    return points;
}

/** Rotate a list of points by a given angle.

    @param {Array} points A list of points.
    @param {number} angle The angle to rotate by (radians, counterclockwise).
    @return {Array} A list of rotated points.
*/
PrairieDraw.prototype.rotatePoints = function(points, angle) {
    var rotM = Matrix.RotationZ(angle);
    var newPoints = [], p;
    for (var i = 0; i < points.length; i++) {
        p = rotM.x($V([points[i].e(1), points[i].e(2), 0]));
                newPoints.push($V([p.e(1), p.e(2)]));
    }
    return newPoints;
}

/** Translate a list of points by a given offset.

    @param {Array} points A list of points.
    @param {Vector} offset The offset to translate by.
    @return {Array} A list of translated points.
*/
PrairieDraw.prototype.translatePoints = function(points, offset) {
    var newPoints = [];
    for (var i = 0; i < points.length; i++) {
        newPoints.push(points[i].add(offset));
    }
    return newPoints;
}

/** Scale a list of points by given horizontal and vertical factors.

    @param {Array} points A list of points.
    @param {Vector} scale The scale in each component.
    @return {Array} A list of scaled points.
*/
PrairieDraw.prototype.scalePoints = function(points, scale) {
    var newPoints = [], p;
    for (var i = 0; i < points.length; i++) {
        p = $V([points[i].e(1) * scale.e(1), points[i].e(2) * scale.e(2)]);
        newPoints.push(p);
    }
    return newPoints;
}

/** Print a list of points to the console as an array of vectors.

    @param {string} name The name of the array.
    @param {Array} points A list of points.
    @param {number} numDecPlaces The number of decimal places to print.
*/
PrairieDraw.prototype.printPoints = function(name, points, numDecPlaces) {
    console.log(name + ": [");
    for (var i = 0; i < points.length; i++) {
        console.log("$V([" + points[i].e(1).toFixed(numDecPlaces)
                    + ", " + points[i].e(2).toFixed(numDecPlaces)
                    + "]),");
    }
    console.log("],");
}

/*****************************************************************************/

/** Draw a circle.

    @param {Vector} centerDw The center in drawing coords.
    @param {number} radiusDw the radius in drawing coords.
    @param {bool} filled (Optional) Whether to fill the circle (default: true).
*/
PrairieDraw.prototype.circle = function(centerDw, radiusDw, filled) {
    filled = (filled === undefined) ? true : filled;

    var centerPx = this.pos2Px(centerDw);
    var offsetDw = $V([radiusDw, 0]);
    var offsetPx = this.vec2Px(offsetDw);
    var radiusPx = offsetPx.modulus();

    this._ctx.save();
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.strokeStyle = this._props.shapeOutlineColor;
    this._ctx.fillStyle = this._props.shapeInsideColor;
    this._ctx.beginPath();
    this._ctx.arc(centerPx.e(1),centerPx.e(2), radiusPx, 0, 2 * Math.PI);
    if (filled) {
        this._ctx.fill();
    }
    this._ctx.stroke();
    this._ctx.restore();
}

/** Draw a filled circle.

    @param {Vector} centerDw The center in drawing coords.
    @param {number} radiusDw the radius in drawing coords.
*/
PrairieDraw.prototype.filledCircle = function(centerDw, radiusDw) {
    var centerPx = this.pos2Px(centerDw);
    var offsetDw = $V([radiusDw, 0]);
    var offsetPx = this.vec2Px(offsetDw);
    var radiusPx = offsetPx.modulus();

    this._ctx.save();
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.fillStyle = this._props.shapeOutlineColor;
    this._ctx.beginPath();
    this._ctx.arc(centerPx.e(1),centerPx.e(2), radiusPx, 0, 2 * Math.PI);
    this._ctx.fill();
    this._ctx.restore();
}

/*****************************************************************************/

/** Draw a rod with hinge points at start and end and the given width.

    @param {Vector} startDw The first hinge point (center of circular end) in drawing coordinates.
    @param {Vector} startDw The second hinge point (drawing coordinates).
    @param {number} widthDw The width of the rod (drawing coordinates).
*/
PrairieDraw.prototype.rod = function(startDw, endDw, widthDw) {
    var offsetLengthDw = endDw.subtract(startDw);
    var offsetWidthDw = offsetLengthDw.rotate(Math.PI/2, $V([0,0])).toUnitVector().x(widthDw);

    var startPx = this.pos2Px(startDw);
    var offsetLengthPx = this.vec2Px(offsetLengthDw);
    var offsetWidthPx = this.vec2Px(offsetWidthDw);
    var lengthPx = offsetLengthPx.modulus();
    var rPx = offsetWidthPx.modulus() / 2;

    this._ctx.save();
    this._ctx.translate(startPx.e(1), startPx.e(2));
    this._ctx.rotate(this.angleOf(offsetLengthPx));
    this._ctx.beginPath();
    this._ctx.moveTo(0, rPx);
    this._ctx.arcTo(lengthPx + rPx, rPx, lengthPx + rPx, -rPx, rPx);
    this._ctx.arcTo(lengthPx + rPx, -rPx, 0, -rPx, rPx);
    this._ctx.arcTo(-rPx, -rPx, -rPx, rPx, rPx);
    this._ctx.arcTo(-rPx, rPx, 0, rPx, rPx);
    if (this._props.shapeInsideColor !== "none") {
        this._ctx.fillStyle = this._props.shapeInsideColor;
        this._ctx.fill();
    }
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.strokeStyle = this._props.shapeOutlineColor;
    this._ctx.stroke();
    this._ctx.restore();
}

/*****************************************************************************/

/** Draw a L-shape rod with hinge points at start, center and end, and the given width.
    @param {Vector} startDw The first hinge point (center of circular end) in drawing coordinates.
    @param {Vector} centerDw The second hinge point (drawing coordinates).
    @param {Vector} endDw The third hinge point (drawing coordinates).
    @param {number} widthDw The width of the rod (drawing coordinates).
*/

PrairieDraw.prototype.LshapeRod = function (startDw, centerDw, endDw, widthDw) {
    var offsetLength1Dw = centerDw.subtract(startDw);
    var offsetLength2Dw = endDw.subtract(centerDw);
    var offsetWidthDw = offsetLength1Dw
      .rotate(Math.PI / 2, $V([0, 0]))
      .toUnitVector()
      .x(widthDw);

    var startPx = this.pos2Px(startDw);
    var centerPx = this.pos2Px(centerDw);
    var endPx = this.pos2Px(endDw);
    var offsetLength1Px = this.vec2Px(offsetLength1Dw);
    var offsetLength2Px = this.vec2Px(offsetLength2Dw);
    var offsetWidthPx = this.vec2Px(offsetWidthDw);
    var length1Px = offsetLength1Px.modulus();
    var length2Px = offsetLength2Px.modulus();
    var rPx = offsetWidthPx.modulus() / 2;

    this._ctx.save();
    this._ctx.translate(startPx.e(1), startPx.e(2));
    this._ctx.rotate(PrairieGeom.angleOf(offsetLength1Px));
    this._ctx.beginPath();
    this._ctx.moveTo(0, rPx);

    var beta = -PrairieGeom.angleFrom(offsetLength1Px, offsetLength2Px);
    var x1 = length1Px + rPx / Math.sin(beta) - rPx / Math.tan(beta);
    var y1 = rPx;
    var x2 = length1Px + length2Px * Math.cos(beta);
    var y2 = -length2Px * Math.sin(beta);
    var x3 = x2 + rPx * Math.sin(beta);
    var y3 = y2 + rPx * Math.cos(beta);
    var x4 = x3 + rPx * Math.cos(beta);
    var y4 = y3 - rPx * Math.sin(beta);
    var x5 = x2 + rPx * Math.cos(beta);
    var y5 = y2 - rPx * Math.sin(beta);
    var x6 = x5 - rPx * Math.sin(beta);
    var y6 = y5 - rPx * Math.cos(beta);
    var x7 = length1Px - rPx / Math.sin(beta) + rPx / Math.tan(beta);
    var y7 = -rPx;

    this._ctx.arcTo(x1, y1, x3, y3, rPx);
    this._ctx.arcTo(x4, y4, x5, y5, rPx);
    this._ctx.arcTo(x6, y6, x7, y7, rPx);
    this._ctx.arcTo(x7, y7, 0, -rPx, rPx);
    this._ctx.arcTo(-rPx, -rPx, -rPx, rPx, rPx);
    this._ctx.arcTo(-rPx, rPx, 0, rPx, rPx);

    if (this._props.shapeInsideColor !== 'none') {
      this._ctx.fillStyle = this._props.shapeInsideColor;
      this._ctx.fill();
    }
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.strokeStyle = this._props.shapeOutlineColor;
    this._ctx.stroke();
    this._ctx.restore();
}

/*****************************************************************************/

/** Draw a pivot.

    @param {Vector} baseDw The center of the base (drawing coordinates).
    @param {Vector} hingeDw The hinge point (center of circular end) in drawing coordinates.
    @param {number} widthDw The width of the pivot (drawing coordinates).
*/
PrairieDraw.prototype.pivot = function(baseDw, hingeDw, widthDw) {
    var offsetLengthDw = hingeDw.subtract(baseDw);
    var offsetWidthDw = offsetLengthDw.rotate(Math.PI/2, $V([0,0])).toUnitVector().x(widthDw);

    var basePx = this.pos2Px(baseDw);
    var offsetLengthPx = this.vec2Px(offsetLengthDw);
    var offsetWidthPx = this.vec2Px(offsetWidthDw);
    var lengthPx = offsetLengthPx.modulus();
    var rPx = offsetWidthPx.modulus() / 2;

    this._ctx.save();
    this._ctx.translate(basePx.e(1), basePx.e(2));
    this._ctx.rotate(this.angleOf(offsetLengthPx));
    this._ctx.beginPath();
    this._ctx.moveTo(0, rPx);
    this._ctx.arcTo(lengthPx + rPx, rPx, lengthPx + rPx, -rPx, rPx);
    this._ctx.arcTo(lengthPx + rPx, -rPx, 0, -rPx, rPx);
    this._ctx.lineTo(0, -rPx);
    this._ctx.closePath();
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.strokeStyle = this._props.shapeOutlineColor;
    this._ctx.fillStyle = this._props.shapeInsideColor;
    this._ctx.fill();
    this._ctx.stroke();
    this._ctx.restore();
}

/** Draw a square with a given base point and center.

    @param {Vector} baseDw The mid-point of the base (drawing coordinates).
    @param {Vector} centerDw The center of the square (drawing coordinates).
*/
PrairieDraw.prototype.square = function(baseDw, centerDw) {
    var basePx = this.pos2Px(baseDw);
    var centerPx = this.pos2Px(centerDw);
    var offsetPx = centerPx.subtract(basePx);
    var rPx = offsetPx.modulus();
    this._ctx.save();
    this._ctx.translate(basePx.e(1), basePx.e(2));
    this._ctx.rotate(this.angleOf(offsetPx));
    this._ctx.beginPath();
    this._ctx.rect(0, -rPx, 2 * rPx, 2 * rPx);
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.strokeStyle = this._props.shapeOutlineColor;
    this._ctx.fillStyle = this._props.shapeInsideColor;
    this._ctx.fill();
    this._ctx.stroke();
    this._ctx.restore();
}

/** Draw an axis-aligned rectangle with a given width and height, centered at the origin.

    @param {number} widthDw The width of the rectangle.
    @param {number} heightDw The height of the rectangle.
    @param {number} centerDw Optional: The center of the rectangle (default: the origin).
    @param {number} angleDw Optional: The rotation angle of the rectangle (default: zero).
    @param {bool} filled Optional: Whether to fill the rectangle (default: true).
*/
PrairieDraw.prototype.rectangle = function(widthDw, heightDw, centerDw, angleDw, filled) {
    centerDw = (centerDw === undefined) ? $V([0, 0]) : centerDw;
    angleDw = (angleDw === undefined) ? 0 : angleDw;
    var pointsDw = [
        $V([-widthDw / 2, -heightDw / 2]),
        $V([ widthDw / 2, -heightDw / 2]),
        $V([ widthDw / 2,  heightDw / 2]),
        $V([-widthDw / 2,  heightDw / 2])
    ];
    var closed = true;
    var filled = (filled === undefined) ? true : filled;
    this.save();
    this.translate(centerDw);
    this.rotate(angleDw);
    this.polyLine(pointsDw, closed, filled);
    this.restore();
}

/** Draw a rectangle with the given corners and height.

    @param {Vector} pos1Dw First corner of the rectangle.
    @param {Vector} pos2Dw Second corner of the rectangle.
    @param {number} heightDw The height of the rectangle.
*/
PrairieDraw.prototype.rectangleGeneric = function(pos1Dw, pos2Dw, heightDw) {
    var dDw = this.perp(pos2Dw.subtract(pos1Dw)).toUnitVector().x(heightDw);
    var pointsDw = [pos1Dw, pos2Dw, pos2Dw.add(dDw), pos1Dw.add(dDw)];
    var closed = true;
    this.polyLine(pointsDw, closed);
}

/** Draw a ground element.

    @param {Vector} posDw The position of the ground center (drawing coordinates).
    @param {Vector} normDw The outward normal (drawing coordinates).
    @param (number} lengthDw The total length of the ground segment.
*/
PrairieDraw.prototype.ground = function(posDw, normDw, lengthDw) {
    var tangentDw = normDw.rotate(Math.PI/2, $V([0,0])).toUnitVector().x(lengthDw);
    var posPx = this.pos2Px(posDw);
    var normPx = this.vec2Px(normDw);
    var tangentPx = this.vec2Px(tangentDw);
    var lengthPx = tangentPx.modulus();
    var groundDepthPx = Math.min(lengthPx, this._props.groundDepthPx);

    this._ctx.save();
    this._ctx.translate(posPx.e(1), posPx.e(2));
    this._ctx.rotate(this.angleOf(normPx) - Math.PI/2);
    this._ctx.beginPath();
    this._ctx.rect(-lengthPx / 2, -groundDepthPx,
                   lengthPx, groundDepthPx);
    this._ctx.fillStyle = this._props.groundInsideColor;
    this._ctx.fill();

    this._ctx.beginPath();
    this._ctx.moveTo(- lengthPx / 2, 0);
    this._ctx.lineTo(lengthPx / 2, 0);
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.strokeStyle = this._props.groundOutlineColor;
    this._ctx.stroke();
    this._ctx.restore();
}

/** Draw a ground element with hashed shading.

    @param {Vector} posDw The position of the ground center (drawing coords).
    @param {Vector} normDw The outward normal (drawing coords).
    @param (number} lengthDw The total length of the ground segment (drawing coords).
    @param {number} offsetDw (Optional) The offset of the shading (drawing coords).
*/
PrairieDraw.prototype.groundHashed = function(posDw, normDw, lengthDw, offsetDw) {
    offsetDw = (offsetDw === undefined) ? 0 : offsetDw;
    var tangentDw = normDw.rotate(Math.PI/2, $V([0,0])).toUnitVector().x(lengthDw);
    var offsetVecDw = tangentDw.toUnitVector().x(offsetDw);
    var posPx = this.pos2Px(posDw);
    var normPx = this.vec2Px(normDw);
    var tangentPx = this.vec2Px(tangentDw);
    var lengthPx = tangentPx.modulus();
    var offsetVecPx = this.vec2Px(offsetVecDw);
    var offsetPx = offsetVecPx.modulus() * this.sign(offsetDw);

    this._ctx.save();
    this._ctx.translate(posPx.e(1), posPx.e(2));
    this._ctx.rotate(this.angleOf(normPx) + Math.PI/2);
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.strokeStyle = this._props.groundOutlineColor;

    this._ctx.beginPath();
    this._ctx.moveTo(- lengthPx / 2, 0);
    this._ctx.lineTo(lengthPx / 2, 0);
    this._ctx.stroke();

    var startX = offsetPx % this._props.groundSpacingPx;
    var x = startX;
    while (x < lengthPx / 2) {
        this._ctx.beginPath();
        this._ctx.moveTo(x, 0);
        this._ctx.lineTo(x - this._props.groundWidthPx, this._props.groundDepthPx);
        this._ctx.stroke();
        x += this._props.groundSpacingPx;
    }
    x = startX - this._props.groundSpacingPx;
    while (x > -lengthPx / 2) {
        this._ctx.beginPath();
        this._ctx.moveTo(x, 0);
        this._ctx.lineTo(x - this._props.groundWidthPx, this._props.groundDepthPx);
        this._ctx.stroke();
        x -= this._props.groundSpacingPx;
    }

    this._ctx.restore();
}

/** Draw an arc ground element.

    @param {Vector} centerDw The center of the circle.
    @param {Vector} radiusDw The radius of the circle.
    @param {number} startAngle (Optional) The start angle of the arc (radians, default: 0).
    @param {number} endAngle (Optional) The end angle of the arc (radians, default: 2 pi).
    @param {bool} outside (Optional) Whether to draw the ground outside the curve (default: true).
*/
PrairieDraw.prototype.arcGround = function(centerDw, radiusDw, startAngle, endAngle, outside) {
    startAngle = (startAngle === undefined) ? 0 : startAngle;
    endAngle = (endAngle === undefined) ? 2 * Math.PI : endAngle;
    outside = (outside === undefined) ? true : outside;
    var centerPx = this.pos2Px(centerDw);
    var offsetDw = $V([radiusDw, 0]);
    var offsetPx = this.vec2Px(offsetDw);
    var radiusPx = offsetPx.modulus();
    var groundDepthPx = Math.min(radiusPx, this._props.groundDepthPx);
    var groundOffsetPx = outside ? groundDepthPx : -groundDepthPx;
    this._ctx.save();
    // fill the shaded area
    this._ctx.beginPath();
    this._ctx.arc(centerPx.e(1), centerPx.e(2), radiusPx, -endAngle, -startAngle, false);
    this._ctx.arc(centerPx.e(1), centerPx.e(2), radiusPx + groundOffsetPx, -startAngle, -endAngle, true);
    this._ctx.fillStyle = this._props.groundInsideColor;
    this._ctx.fill();
    // draw the ground surface
    this._ctx.beginPath();
    this._ctx.arc(centerPx.e(1), centerPx.e(2), radiusPx, -endAngle, -startAngle);
    this._ctx.lineWidth = this._props.shapeStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.shapeStrokePattern));
    this._ctx.strokeStyle = this._props.groundOutlineColor;
    this._ctx.stroke();
    this._ctx.restore();
}

/** Draw a center-of-mass object.

    @param {Vector} posDw The position of the center of mass.
*/
PrairieDraw.prototype.centerOfMass = function(posDw) {
    var posPx = this.pos2Px(posDw);
    var r = this._props.centerOfMassRadiusPx;
    this._ctx.save();
    this._ctx.lineWidth = this._props.centerOfMassStrokeWidthPx;
    this._ctx.strokeStyle = this._props.centerOfMassColor;
    this._ctx.translate(posPx.e(1), posPx.e(2));

    this._ctx.beginPath();
    this._ctx.moveTo(-r, 0);
    this._ctx.lineTo(r, 0);
    this._ctx.stroke();

    this._ctx.beginPath();
    this._ctx.moveTo(0, -r);
    this._ctx.lineTo(0, r);
    this._ctx.stroke();

    this._ctx.beginPath();
    this._ctx.arc(0, 0, r, 0, 2 * Math.PI);
    this._ctx.stroke();

    this._ctx.restore();
}

/** Draw a measurement line.

    @param {Vector} startDw The start position of the measurement.
    @param {Vector} endDw The end position of the measurement.
    @param {string} text The measurement label.
    @param {Vector} normDw (Optional) The normal vector to offset along.
*/
PrairieDraw.prototype.measurement = function(startDw, endDw, text, normDw) {
    if (normDw !== undefined) {
        normDw = this.vec3To2(normDw, startDw);
    }
    startDw = this.pos3To2(startDw);
    endDw = this.pos3To2(endDw);
    var startPx = this.pos2Px(startDw);
    var endPx = this.pos2Px(endDw);
    var offsetPx = endPx.subtract(startPx);
    var normPx = (normDw === undefined) ? offsetPx.rotate(Math.PI/2, $V([0, 0])) : this.vec2Px(normDw);
    var h = this._props.measurementEndLengthPx;
    var o = this._props.measurementOffsetPx;
    normPx = normPx.toUnitVector();
    var lineStartPx = startPx.add(normPx.x(o + h/2));
    var lineEndPx = endPx.add(normPx.x(o + h/2));
    this._ctx.save();
    this._ctx.lineWidth = this._props.measurementStrokeWidthPx;
    this._ctx.setLineDash(this._dashPattern(this._props.measurementStrokePattern));
    this._ctx.strokeStyle = this._props.measurementColor;

    this._ctx.beginPath();
    this._ctx.moveTo(lineStartPx.e(1), lineStartPx.e(2));
    this._ctx.lineTo(lineEndPx.e(1), lineEndPx.e(2));
    this._ctx.stroke();

    this._ctx.beginPath();
    this._ctx.moveTo(lineStartPx.e(1) - normPx.e(1) * h/2, lineStartPx.e(2) - normPx.e(2) * h/2);
    this._ctx.lineTo(lineStartPx.e(1) + normPx.e(1) * h/2, lineStartPx.e(2) + normPx.e(2) * h/2);
    this._ctx.stroke();

    this._ctx.beginPath();
    this._ctx.moveTo(lineEndPx.e(1) - normPx.e(1) * h/2, lineEndPx.e(2) - normPx.e(2) * h/2);
    this._ctx.lineTo(lineEndPx.e(1) + normPx.e(1) * h/2, lineEndPx.e(2) + normPx.e(2) * h/2);
    this._ctx.stroke();

    this._ctx.restore();

    var lineStartDw = this.pos2Dw(lineStartPx);
    var lineEndDw = this.pos2Dw(lineEndPx);
    this.labelLine(lineStartDw, lineEndDw, $V([0, -1]), text);
}

/** Draw a right angle.

    @param {Vector} posDw The position angle point.
    @param {Vector} dirDw The baseline direction (angle is counter-clockwise from this direction in 2D).
    @param {Vector} normDw (Optional) The third direction (required for 3D).
*/
PrairieDraw.prototype.rightAngle = function(posDw, dirDw, normDw) {
    if (dirDw.modulus() < 1e-20) {
        return;
    }
    var posPx, dirPx, normPx;
    if (posDw.elements.length === 3) {
        posPx = this.pos2Px(this.pos3To2(posDw));
        var d = this.vec2To3(this.vec2Dw($V([this._props.rightAngleSizePx, 0]))).modulus();
        dirPx = this.vec2Px(this.vec3To2(dirDw.toUnitVector().x(d), posDw));
        normPx = this.vec2Px(this.vec3To2(normDw.toUnitVector().x(d), posDw));
    } else {
        posPx = this.pos2Px(posDw);
        dirPx = this.vec2Px(dirDw).toUnitVector().x(this._props.rightAngleSizePx);
        if (normDw !== undefined) {
            normPx = this.vec2Px(normDw).toUnitVector().x(this._props.rightAngleSizePx);
        } else {
            normPx = dirPx.rotate(-Math.PI / 2, $V([0, 0]));
        }
    }

    this._ctx.save();
    this._ctx.translate(posPx.e(1), posPx.e(2));
    this._ctx.lineWidth = this._props.rightAngleStrokeWidthPx;
    this._ctx.strokeStyle = this._props.rightAngleColor;
    this._ctx.beginPath();
    this._ctx.moveTo(dirPx.e(1), dirPx.e(2));
    this._ctx.lineTo(dirPx.e(1) + normPx.e(1), dirPx.e(2) + normPx.e(2));
    this._ctx.lineTo(normPx.e(1), normPx.e(2));
    this._ctx.stroke();
    this._ctx.restore();
};

/** Draw a right angle (improved version).

    @param {Vector} p0Dw The base point.
    @param {Vector} p1Dw The first other point.
    @param {Vector} p2Dw The second other point.
*/
PrairieDraw.prototype.rightAngleImproved = function(p0Dw, p1Dw, p2Dw) {
    var p0Px = this.pos2Px(this.pos3To2(p0Dw));
    var p1Px = this.pos2Px(this.pos3To2(p1Dw));
    var p2Px = this.pos2Px(this.pos3To2(p2Dw));
    var d1Px = p1Px.subtract(p0Px);
    var d2Px = p2Px.subtract(p0Px);
    var minDLen = Math.min(d1Px.modulus(), d2Px.modulus());
    if (minDLen < 1e-10) {
        return;
    }
    var rightAngleSizePx = Math.min(minDLen / 2, this._props.rightAngleSizePx);
    d1Px = d1Px.toUnitVector().x(rightAngleSizePx);
    d2Px = d2Px.toUnitVector().x(rightAngleSizePx);
    p1Px = p0Px.add(d1Px);
    p2Px = p0Px.add(d2Px);
    p12Px = p1Px.add(d2Px);
    this._ctx.save();
    this._ctx.lineWidth = this._props.rightAngleStrokeWidthPx;
    this._ctx.strokeStyle = this._props.rightAngleColor;
    this._ctx.beginPath();
    this._ctx.moveTo(p1Px.e(1), p1Px.e(2));
    this._ctx.lineTo(p12Px.e(1), p12Px.e(2));
    this._ctx.lineTo(p2Px.e(1), p2Px.e(2));
    this._ctx.stroke();
    this._ctx.restore();
};

/*****************************************************************************/

/** Draw text.

    @param {Vector} posDw The position to draw at.
    @param {Vector} anchor The anchor on the text that will be located at pos (in -1 to 1 local coordinates).
    @param {string} text The text to draw. If text begins with "TEX:" then it is interpreted as LaTeX.
    @param {bool} boxed (Optional) Whether to draw a white box behind the text (default: false).
*/
PrairieDraw.prototype.text = function(posDw, anchor, text, boxed, angle, height, width) {
    if (text === undefined) {
        return;
    }
    boxed = (boxed === undefined) ? false : boxed;
    angle = (angle === undefined) ? 0 : angle;
    var posPx = this.pos2Px(this.pos3To2(posDw));
    if (text.slice(0,4) === "TEX:") {
        var tex_text = text.slice(4).replaceAll("$", "", );
        var hash = Sha1.hash(tex_text);
        this._texts = this._texts || {};
        if (hash in this._texts) {
            var img = this._texts[hash];
            var xPx =  - (anchor.e(1) + 1) / 2 * img.width;
            var yPx = (anchor.e(2) - 1) / 2 * img.height;
            //var offsetPx = anchor.toUnitVector().x(Math.abs(anchor.max()) * this._props.textOffsetPx);
            var offsetPx = anchor.x(this._props.textOffsetPx);
            var textBorderPx = 5;
            this._ctx.save();
            this._ctx.translate(posPx.e(1), posPx.e(2));
            this._ctx.rotate(angle);
            if (boxed) {
                this._ctx.save();
                this._ctx.fillStyle = "white";
                this._ctx.fillRect(xPx - offsetPx.e(1) - textBorderPx,
                                   yPx + offsetPx.e(2) - textBorderPx,
                                   img.width + 2 * textBorderPx,
                                   img.height + 2 * textBorderPx);
                this._ctx.restore();
            }
            this._ctx.drawImage(img, xPx - offsetPx.e(1), yPx + offsetPx.e(2));
            this._ctx.restore();
        } else {
            window.MathJax.tex2svgPromise(tex_text, { display: true}).then((node) => {
                svg = node.firstChild;
                if (height != undefined){
                    svg.setAttribute("height", `${height}px`);
                }

                if (width != undefined){
                    svg.setAttribute("width", `${width}px`);
                }

                
                const xml = new XMLSerializer().serializeToString(svg);
                const svg64 = btoa(unescape(encodeURIComponent(xml)));
                const imgSrc = 'data:image/svg+xml;base64,' + svg64;
                const img = new Image();
                img.onload = this.redraw.bind(this);
                img.src = imgSrc;
                this._texts[hash] = img;
            }
            )
            .catch(error => console.error(error));
            
        }
    } else {
        var align, baseline, bbRelOffset;
        switch (this.sign(anchor.e(1))) {
        case -1: align = "left"; bbRelOffset = 0; break;
        case  0: align = "center"; bbRelOffset = 0.5; break;
        case  1: align = "right"; bbRelOffset = 1; break;
        }
        switch (this.sign(anchor.e(2))) {
        case -1: baseline = "bottom"; break;
        case  0: baseline = "middle"; break;
        case  1: baseline = "top"; break;
        }
        this.save();
        this._ctx.textAlign = align;
        this._ctx.textBaseline = baseline;
        this._ctx.translate(posPx.e(1), posPx.e(2));
        var offsetPx = anchor.toUnitVector().x(Math.abs(anchor.max()) * this._props.textOffsetPx);
        var drawPx = $V([-offsetPx.e(1), offsetPx.e(2)]);
        var metrics = this._ctx.measureText(text);
        var d = this._props.textOffsetPx;
        //var bb0 = drawPx.add($V([-metrics.actualBoundingBoxLeft - d, -metrics.actualBoundingBoxAscent - d]));
        //var bb1 = drawPx.add($V([metrics.actualBoundingBoxRight + d, metrics.actualBoundingBoxDescent + d]));
        var textHeight = 10;
        var bb0 = drawPx.add($V([- bbRelOffset * metrics.width - d, - d]));
        var bb1 = drawPx.add($V([(1 - bbRelOffset) * metrics.width + d, textHeight + d]));
        if (boxed) {
            this._ctx.save();
            this._ctx.fillStyle = "white";
            this._ctx.fillRect(bb0.e(1), bb0.e(2), bb1.e(1) - bb0.e(1), bb1.e(2) - bb0.e(2));
            this._ctx.restore();
        }
        this._ctx.fillText(text, drawPx.e(1), drawPx.e(2));
        this.restore();
    }
}

/** Draw text to label a line.

    @param {Vector} startDw The start position of the line.
    @param {Vector} endDw The end position of the line.
    @param {Vector} pos The position relative to the line (-1 to 1 local coordinates, x along the line, y orthogonal).
    @param {string} text The text to draw.
    @param {Vector} anchor (Optional) The anchor position on the text.
*/
PrairieDraw.prototype.labelLine = function(startDw, endDw, pos, text, anchor) {
    if (text === undefined) {
        return;
    }
    startDw = this.pos3To2(startDw);
    endDw = this.pos3To2(endDw);
    var midpointDw = (startDw.add(endDw)).x(0.5);
    var offsetDw = endDw.subtract(startDw).x(0.5);
    var pDw = midpointDw.add(offsetDw.x(pos.e(1)));
    var u1Dw = offsetDw.toUnitVector();
    var u2Dw = u1Dw.rotate(Math.PI/2, $V([0,0]));
    var oDw = u1Dw.x(pos.e(1)).add(u2Dw.x(pos.e(2)));
    var a = oDw.x(-1).toUnitVector().x(Math.abs(pos.max()));
    if (anchor !== undefined) {
        a = anchor;
    }
    this.text(pDw, a, text);
}

/** Draw text to label a circle line.

    @param {Vector} posDw The center of the circle line.
    @param {number} radDw The radius at the mid-angle.
    @param {number} startAngleDw The starting angle (counterclockwise from x axis, in radians).
    @param {number} endAngleDw The ending angle (counterclockwise from x axis, in radians).
    @param {Vector} pos The position relative to the line (-1 to 1 local coordinates, x along the line, y orthogonal).
    @param {string} text The text to draw.
    @param {bool} fixedRad (Optional) Whether to use a fixed radius (default: false).
*/
PrairieDraw.prototype.labelCircleLine = function(posDw, radDw, startAngleDw, endAngleDw, pos, text, fixedRad) {
    // convert to Px coordinates
    var startOffsetDw = this.vector2DAtAngle(startAngleDw).x(radDw);
    var posPx = this.pos2Px(posDw);
    var startOffsetPx = this.vec2Px(startOffsetDw);
    var radiusPx = startOffsetPx.modulus();
    var startAnglePx = this.angleOf(startOffsetPx);
    var deltaAngleDw = endAngleDw - startAngleDw;
    // assume a possibly reflected/rotated but equally scaled Dw/Px transformation
    var deltaAnglePx = this._transIsReflection() ? (- deltaAngleDw) : deltaAngleDw;
    var endAnglePx = startAnglePx + deltaAnglePx;

    var textAnglePx = (1.0 - pos.e(1)) / 2.0 * startAnglePx + (1.0 + pos.e(1)) / 2.0 * endAnglePx;
    var u1Px = this.vector2DAtAngle(textAnglePx);
    var u2Px = u1Px.rotate(-Math.PI / 2, $V([0, 0]));
    var u1Dw = this.vec2Dw(u1Px).toUnitVector();
    var u2Dw = this.vec2Dw(u2Px).toUnitVector();
    var oDw = u1Dw.x(pos.e(2)).add(u2Dw.x(pos.e(1)));
    var aDw = oDw.x(-1).toUnitVector();
    var a = aDw.x(1.0 / Math.abs(aDw.max())).x(Math.abs(pos.max()));

    var rPx = this._circleArrowRadius(radiusPx, textAnglePx, startAnglePx, endAnglePx, fixedRad);
    var pPx = u1Px.x(rPx).add(posPx);
    var pDw = this.pos2Dw(pPx);
    this.text(pDw, a, text);
};

/** Find the anchor for the intersection of several lines.

    @param {Vector} labelPoint The point to be labeled.
    @param {Array} points The end of the lines that meet at labelPoint.
    @return {Vector} The anchor offset.
*/
PrairieDraw.prototype.findAnchorForIntersection = function(labelPointDw, pointsDw) {
    // find the angles on the unit circle for each of the lines
    var labelPointPx = this.pos2Px(this.pos3To2(labelPointDw));
    var i, v;
    var angles = [];
    for (i = 0; i < pointsDw.length; i++) {
        v = this.pos2Px(this.pos3To2(pointsDw[i])).subtract(labelPointPx);
        v = $V([v.e(1), -v.e(2)]);
        if (v.modulus() > 1e-6) {
            angles.push(this.angleOf(v));
        }
    }
    if (angles.length == 0) {
        return $V([1, 0]);
    }
    // save the first angle to tie-break later
    var tieBreakAngle = angles[0];

    // find the biggest gap between angles (might be multiple)
    angles.sort(function(a, b) {return (a - b);});
    var maxAngleDiff = angles[0] - angles[angles.length - 1] + 2 * Math.PI;
    var maxIs = [0];
    var angleDiff;
    for (i = 1; i < angles.length; i++) {
        angleDiff = angles[i] - angles[i - 1];
        if (angleDiff > maxAngleDiff - 1e-6) {
            if (angleDiff > maxAngleDiff + 1e-6) {
                // we are clearly greater
                maxAngleDiff = angleDiff;
                maxIs = [i];
            } else {
                // we are basically equal
                maxIs.push(i);
            }
        }
    }

    // tie-break by choosing the first angle CCW from the tieBreakAngle
    var minCCWDiff = 2 * Math.PI;
    var angle, bestAngle;
    for (i = 0; i < maxIs.length; i++) {
        angle = angles[maxIs[i]] - maxAngleDiff / 2;
        angleDiff = angle - tieBreakAngle;
        if (angleDiff < 0) {
            angleDiff += 2 * Math.PI;
        }
        if (angleDiff < minCCWDiff) {
            minCCWDiff = angleDiff;
            bestAngle = angle;
        }
    }

    // find anchor from bestAngle
    var dir = this.vector2DAtAngle(bestAngle);
    dir = dir.x(1 / this.supNorm(dir));
    return dir.x(-1);
};

/** Label the intersection of several lines.

    @param {Vector} labelPoint The point to be labeled.
    @param {Array} points The end of the lines that meet at labelPoint.
    @param {string} label The label text.
*/
PrairieDraw.prototype.labelIntersection = function(labelPoint, points, label, scaleOffset=1) {
    var anchor = this.findAnchorForIntersection(labelPoint, points);
    this.text(labelPoint, anchor.x(scaleOffset), label);
};

/*****************************************************************************/

PrairieDraw.prototype.numDiff = function(f, t) {
    var eps = 1e-4;

    var x0 = f(t - eps);
    var x1 = f(t);
    var x2 = f(t + eps);
    var d = {}
    d.diff = {};
    d.ddiff = {};
    for (e in x0) {
        if (x0[e] instanceof Vector) {
            d[e] = x1[e];
            d.diff[e] = x1[e].subtract(x0[e]).x(1 / eps);
            d.ddiff[e] = x2[e].subtract(x1[e].x(2)).add(x0[e]).x(1 / (eps * eps));
        } else {
            d[e] = x1[e];
            d.diff[e] = (x1[e] - x0[e]) / eps;
            d.ddiff[e] = (x2[e] - 2 * x1[e] + x0[e]) / (eps * eps);
        }
    }
    return d;
};

/*****************************************************************************/

PrairieDraw.prototype.clearHistory = function(name) {
    if (name in this._history) {
        delete this._history[name];
    }
}

PrairieDraw.prototype.clearAllHistory = function() {
    this._history = {};
}

/** Save the history of a data value.

    @param {string} name The history variable name.
    @param {number} dt The time resolution to save at.
    @param {number} maxTime The maximum age of history to save.
    @param {number} curTime The current time.
    @param {object} curValue The current data value.
    @return {Array} A history array of vectors of the form [time, value].
*/
PrairieDraw.prototype.history = function(name, dt, maxTime, curTime, curValue) {
    if (!(name in this._history)) {
        this._history[name] = [[curTime, curValue]];
    } else {
        var h = this._history[name];
        if (h.length < 2) {
            h.push([curTime, curValue]);
        } else {
            var prevPrevTime = h[h.length - 2][0];
            if (curTime - prevPrevTime < dt) {
                // new time jump will still be short, replace the last record
                h[h.length - 1] = [curTime, curValue];
            } else {
                // new time jump would be too long, just add the new record
                h.push([curTime, curValue]);
            }
        }

        // discard old values as necessary
        var i = 0;
        while ((curTime - h[i][0] > maxTime) && (i < h.length - 1)) {
            i++;
        }
        if (i > 0) {
            this._history[name] = h.slice(i);
        }
    }
    return this._history[name];
};

PrairieDraw.prototype.pairsToVectors = function(pairArray) {
    var vectorArray = [];
    for (var i = 0; i < pairArray.length; i++) {
        vectorArray.push($V(pairArray[i]));
    }
    return vectorArray;
}

PrairieDraw.prototype.historyToTrace = function(data) {
    var trace = [];
    for (var i = 0; i < data.length; i++) {
        trace.push(data[i][1]);
    }
    return trace;
}

/** Plot a history sequence.

    @param {Vector} originDw The lower-left position of the axes.
    @param {Vector} sizeDw The size of the axes (vector from lower-left to upper-right).
    @param {Vector} sizeData The size of the axes in data coordinates.
    @param {number} timeOffset The horizontal position for the current time.
    @param {string} yLabel The vertical axis label.
    @param {Array} data An array of [time, value] arrays to plot.
    @param {string} type (Optional) The type of line being drawn.
*/
PrairieDraw.prototype.plotHistory = function(originDw, sizeDw, sizeData, timeOffset, yLabel, data, type) {
    var scale = $V([sizeDw.e(1) / sizeData.e(1), sizeDw.e(2) / sizeData.e(2)]);
    var lastTime = data[data.length - 1][0];
    var offset = $V([timeOffset - lastTime, 0]);
    var plotData = this.scalePoints(this.translatePoints(this.pairsToVectors(data), offset), scale);

    this.save();
    this.translate(originDw);
    this.save();
    this.setProp("arrowLineWidthPx", 1);
    this.setProp("arrowheadLengthRatio", 11);
    this.arrow($V([0, 0]), $V([sizeDw.e(1), 0]));
    this.arrow($V([0, 0]), $V([0, sizeDw.e(2)]));
    this.text($V([sizeDw.e(1), 0]), $V([1, 1.5]), "TEX:$t$");
    this.text($V([0, sizeDw.e(2)]), $V([1.5, 1]), yLabel);
    this.restore();
    var col = this._getColorProp(type);
    this.setProp("shapeOutlineColor", col);
    this.setProp("pointRadiusPx", "4");
    this.save();
    this._ctx.beginPath();
    var bottomLeftPx = this.pos2Px($V([0, 0]));
    var topRightPx = this.pos2Px(sizeDw);
    var offsetPx = topRightPx.subtract(bottomLeftPx);
    this._ctx.rect(bottomLeftPx.e(1), 0, offsetPx.e(1), this._height);
    this._ctx.clip();
    this.polyLine(plotData, false);
    this.restore();
    this.point(plotData[plotData.length - 1]);
    this.restore();
};

/** Draw a history of positions as a faded line.

    @param {Array} history History data, array of [time, position] pairs, where position is a vector.
    @param {number} t Current time.
    @param {number} maxT Maximum history time.
    @param {Array} currentRGB RGB triple for current time color.
    @param {Array} oldRGB RGB triple for old time color.
*/
PrairieDraw.prototype.fadeHistoryLine = function(history, t, maxT, currentRGB, oldRGB) {
    if (history.length < 2) {
        return;
    }
    for (var i = history.length - 2; i >= 0; i--) {
        // draw line backwards so newer segments are on top
        var pT = history[i][0];
        var pDw1 = history[i][1];
        var pDw2 = history[i + 1][1];
        var alpha = (t - pT) / maxT;
        var rgb = this.linearInterpArray(currentRGB, oldRGB, alpha);
        var color = "rgb(" + rgb[0].toFixed(0) + ", " + rgb[1].toFixed(0) + ", " + rgb[2].toFixed(0) + ")";
        this.line(pDw1, pDw2, color);
    }
};

/*****************************************************************************/

PrairieDraw.prototype.mouseDown3D = function(event) {
    event.preventDefault();
    this._mouseDown3D = true;
    this._lastMouseX3D = event.clientX;
    this._lastMouseY3D = event.clientY;
};

PrairieDraw.prototype.mouseUp3D = function(event) {
    this._mouseDown3D = false;
};

PrairieDraw.prototype.mouseMove3D = function(event) {
    if (!this._mouseDown3D) {
        return;
    }
    var deltaX = event.clientX - this._lastMouseX3D;
    var deltaY = event.clientY - this._lastMouseY3D;
    this._lastMouseX3D = event.clientX;
    this._lastMouseY3D = event.clientY;
    this.incrementView3D(deltaY * 0.01, 0, deltaX * 0.01);
};

PrairieDraw.prototype.activate3DControl = function() {
    /* Listen just on the canvas for mousedown, but on whole window
     * for move/up. This allows mouseup while off-canvas (and even
     * off-window) to be captured. Ideally we should also listen for
     * mousedown on the whole window and use mouseEventOnCanvas(), but
     * this is broken on Canary for some reason (some areas off-canvas
     * don't work). The advantage of listening for mousedown on the
     * whole window is that we can get the event during the "capture"
     * phase rather than the later "bubble" phase, allowing us to
     * preventDefault() before things like select-drag starts. */
    this._canvas.addEventListener("mousedown", this.mouseDown3D.bind(this), true);
    window.addEventListener("mouseup", this.mouseUp3D.bind(this), true);
    window.addEventListener("mousemove", this.mouseMove3D.bind(this), true);
};

/*****************************************************************************/

PrairieDraw.prototype.mouseDownTracking = function(event) {
    event.preventDefault();
    this._mouseDownTracking = true;
    this._lastMouseXTracking = event.pageX;
    this._lastMouseYTracking = event.pageY;
};

PrairieDraw.prototype.mouseUpTracking = function(event) {
    this._mouseDownTracking = false;
};

PrairieDraw.prototype.mouseMoveTracking = function(event) {
    if (!this._mouseDownTracking) {
        return;
    }
    this._lastMouseXTracking = event.pageX;
    this._lastMouseYTracking = event.pageY;
};

PrairieDraw.prototype.activateMouseTracking = function() {
    this._canvas.addEventListener("mousedown", this.mouseDownTracking.bind(this), true);
    window.addEventListener("mouseup", this.mouseUpTracking.bind(this), true);
    window.addEventListener("mousemove", this.mouseMoveTracking.bind(this), true);
};

PrairieDraw.prototype.mouseDown = function() {
    if (this._mouseDownTracking !== undefined) {
        return this._mouseDownTracking;
    } else {
        return false;
    }
};

PrairieDraw.prototype.mousePositionDw = function() {
    var xPx = this._lastMouseXTracking - this._canvas.offsetLeft;
    var yPx = this._lastMouseYTracking - this._canvas.offsetTop;
    var posPx = $V([xPx, yPx]);
    var posDw = this.pos2Dw(posPx);
    return posDw;
};

/*****************************************************************************/

/** Creates a PrairieDrawAnim object.

    @constructor
    @this {PrairieDraw}
    @param {HTMLCanvasElement or string} canvas The canvas element to draw on or the ID of the canvas elemnt.
    @param {Function} drawfcn An optional function that draws on the canvas at time t.
*/
function PrairieDrawAnim(canvas, drawFcn) {
    PrairieDraw.call(this, canvas, null);
    this._drawTime = 0;
    this._deltaTime = 0;
    this._running = false;
    this._sequences = {};
    this._animStateCallbacks = [];
    this._animStepCallbacks = [];
    if (drawFcn) {
        this.draw = drawFcn.bind(this);
    }
    this.save();
    this.draw(0);
    this.restoreAll();
}
PrairieDrawAnim.prototype = new PrairieDraw;

/** @private Store the appropriate version of requestAnimationFrame.

    Use this like:
    prairieDraw.requestAnimationFrame.call(window, this.callback.bind(this));

    We can't do prairieDraw.requestAnimationFrame(callback), because
    that would run requestAnimationFrame in the context of prairieDraw
    ("this" would be prairieDraw), and requestAnimationFrame needs
    "this" to be "window".

    We need to pass this.callback.bind(this) as the callback function
    rather than just this.callback as otherwise the callback functions
    is called from "window" context, and we want it to be called from
    the context of our own object.
*/
PrairieDrawAnim.prototype._requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame;

/** Prototype function to draw on the canvas, should be implemented by children.

    @param {number} t Current animation time in seconds.
*/
PrairieDrawAnim.prototype.draw = function(t) {
}

/** Start the animation.
*/
PrairieDrawAnim.prototype.startAnim = function() {
    if (!this._running) {
        this._running = true;
        this._startFrame = true;
        this._requestAnimationFrame.call(window, this._callback.bind(this));
        for (var i = 0; i < this._animStateCallbacks.length; i++) {
            this._animStateCallbacks[i](true);
        }
    }
}

/** Stop the animation.
*/
PrairieDrawAnim.prototype.stopAnim = function() {
    this._running = false;
    for (var i = 0; i < this._animStateCallbacks.length; i++) {
        this._animStateCallbacks[i](false);
    }
}

/** Toggle the animation.
*/
PrairieDrawAnim.prototype.toggleAnim = function() {
    if (this._running) {
        this.stopAnim();
    } else {
        this.startAnim();
    }
}

/** Register a callback on animation state changes.

    @param {Function} callback The callback(animated) function.
*/
PrairieDrawAnim.prototype.registerAnimCallback = function(callback) {
    this._animStateCallbacks.push(callback.bind(this));
    callback.apply(this, [this._running]);
}

/** Register a callback on animation steps.

    @param {Function} callback The callback(t) function.
*/
PrairieDrawAnim.prototype.registerAnimStepCallback = function(callback) {
    this._animStepCallbacks.push(callback.bind(this));
}

/** @private Callback function to handle the animationFrame events.
*/
PrairieDrawAnim.prototype._callback = function(t_ms) {
    if (this._startFrame) {
        this._startFrame = false;
        this._timeOffset = t_ms - this._drawTime;
    }
    var animTime = t_ms - this._timeOffset;
    this._deltaTime = (animTime - this._drawTime) / 1000;
    this._drawTime = animTime;
    var t = animTime / 1000;
    for (var i = 0; i < this._animStepCallbacks.length; i++) {
        this._animStepCallbacks[i](t);
    }
    this.save();
    this.draw(t);
    this._deltaTime = 0;
    this.restoreAll();
    if (this._running) {
        this._requestAnimationFrame.call(window, this._callback.bind(this));
    }
}

/** Get the elapsed time since the last redraw.

    return {number} Elapsed time in seconds.
*/
PrairieDrawAnim.prototype.deltaTime = function() {
    return this._deltaTime;
};

/** Redraw the drawing at the current time.
*/
PrairieDrawAnim.prototype.redraw = function() {
    if (!this._running) {
        this.save();
        this.draw(this._drawTime / 1000);
        this.restoreAll();
    }
}

/** Reset the animation time to zero.

    @param {bool} redraw (Optional) Whether to redraw (default: true).
*/
PrairieDrawAnim.prototype.resetTime = function(redraw) {
    this._drawTime = 0;
    for (var i = 0; i < this._animStepCallbacks.length; i++) {
        this._animStepCallbacks[i](0);
    }
    this._startFrame = true;
    if (redraw === undefined || redraw === true) {
        this.redraw();
    }
}

/** Reset everything to the intial state.
*/
PrairieDrawAnim.prototype.reset = function() {
    for (optionName in this._options) {
        this.resetOptionValue(optionName)
    }
    this.resetAllSequences();
    this.clearAllHistory();
    this.stopAnim();
    this.resetView3D(false);
    this.resetTime(false);
    this.redraw();
}

/** Stop all action and computation.
*/
PrairieDrawAnim.prototype.stop = function() {
    this.stopAnim();
}

PrairieDrawAnim.prototype.lastDrawTime = function() {
    return this._drawTime / 1000;
};

/*****************************************************************************/

PrairieDrawAnim.prototype.mouseDownAnimOnClick = function(event) {
    event.preventDefault();
    this.startAnim();
};

PrairieDrawAnim.prototype.activateAnimOnClick = function() {
    this._canvas.addEventListener("mousedown", this.mouseDownAnimOnClick.bind(this), true);
};

/*****************************************************************************/

/** Interpolate between different states in a sequence.

    @param {Array} states An array of objects, each specifying scalar or vector state values.
    @param {Array} transTimes Transition times. transTimes[i] is the transition time from states[i] to states[i+1].
    @param {Array} holdTimes Hold times for the corresponding state.
    @param {Array} t Current time.
    @return Object with state variables set to current values, as well as t being the time within the current transition (0 if holding), index being the current state index (or the next state if transitioning), and alpha being the proportion of the current transition (0 if holding).
*/
PrairieDrawAnim.prototype.sequence = function(states, transTimes, holdTimes, t) {
    var totalTime = 0;
    var i;
    for (i = 0; i < states.length; i++) {
        totalTime += transTimes[i];
        totalTime += holdTimes[i];
    }
    var ts = t % totalTime;
    totalTime = 0;
    var state = {};
    var e, ip;
    var lastTotalTime = 0;
    for (i = 0; i < states.length; i++) {
        ip = i == states.length - 1 ? 0 : i + 1;
        totalTime += transTimes[i];
        if (totalTime > ts) {
            // in transition from i to i+1
            state.t = ts - lastTotalTime;
            state.index = i;
            state.alpha = state.t / (totalTime - lastTotalTime);
            for (e in states[i]) {
                state[e] = this.linearInterp(states[i][e], states[ip][e], state.alpha);
            }
            return state;
        }
        lastTotalTime = totalTime;
        totalTime += holdTimes[i];
        if (totalTime > ts) {
            // holding at i+1
            state.t = 0;
            state.index = ip;
            state.alpha = 0;
            for (e in states[i]) {
                state[e] = states[ip][e];
            }
            return state;
        }
        lastTotalTime = totalTime;
    }
}

/*****************************************************************************/

/** Interpolate between different states in a sequence under external prompting.

    @param {string} name Name of this transition sequence.
    @param {Array} states An array of objects, each specifying scalar or vector state values.
    @param {Array} transTimes Transition times. transTimes[i] is the transition time from states[i] to states[i+1].
    @param {Array} t Current animation time.
    @return Object with state variables set to current values, as well as t being the time within the current transition (0 if holding), index being the current state index (or the next state if transitioning), and alpha being the proportion of the current transition (0 if holding).
*/
PrairieDrawAnim.prototype.controlSequence = function(name, states, transTimes, t) {
    if (!(name in this._sequences)) {
        this._sequences[name] = {
            index: 0,
            inTransition: false,
            startTransition: false,
            indefiniteHold: true,
            callbacks: []
        };
    }
    var seq = this._sequences[name];
    var state;
    var transTime = 0;
    if (seq.startTransition) {
        seq.startTransition = false;
        seq.inTransition = true;
        seq.indefiniteHold = false;
        seq.startTime = t;
    }
    if (seq.inTransition) {
        transTime = t - seq.startTime;
    }
    if ((seq.inTransition) && (transTime >= transTimes[seq.index])) {
        seq.inTransition = false;
        seq.indefiniteHold = true;
        seq.index = (seq.index + 1) % states.length;
        delete seq.startTime;
    }
    if (!seq.inTransition) {
        state = this.dupState(states[seq.index]);
        state.index = seq.index;
        state.t = 0;
        state.alpha = 0;
        state.inTransition = false;
        return state;
    }
    var alpha = transTime / transTimes[seq.index];
    var nextIndex = (seq.index + 1) % states.length;
    state = this.linearInterpState(states[seq.index], states[nextIndex], alpha);
    state.t = transTime;
    state.index = seq.index;
    state.alpha = alpha;
    state.inTransition = true;
    return state;
}

/** Start the next transition for the given sequence.

    @param {string} name Name of the sequence to transition.
    @param {string} stateName (Optional) Only transition if we are currently in stateName.
*/
PrairieDrawAnim.prototype.stepSequence = function(name, stateName) {
    if (!(name in this._sequences)) {
        throw new Error("PrairieDraw: unknown sequence: " + name);
    }
    var seq = this._sequences[name];
    if (!seq.lastState.indefiniteHold) {
        return;
    }
    if (stateName !== undefined) {
        if (seq.lastState.name !== stateName) {
            return;
        }
    }
    seq.startTransition = true;
    this.startAnim();
}

/*****************************************************************************/

/** Interpolate between different states (new version).

    @param {string} name Name of this transition sequence.
    @param {Array} states An array of objects, each specifying scalar or vector state values.
    @param {Array} transTimes Transition times. transTimes[i] is the transition time from states[i] to states[i+1].
    @param {Array} holdtimes Hold times for each state. A negative value means to hold until externally triggered.
    @param {Array} t Current animation time.
    @return Object with state variables set to current values, as well as t being the time within the current transition (0 if holding), index being the current state index (or the next state if transitioning), and alpha being the proportion of the current transition (0 if holding).
*/
PrairieDrawAnim.prototype.newSequence = function(name, states, transTimes, holdTimes, interps, names, t) {
    var seq = this._sequences[name];
    if (seq === undefined) {
        this._sequences[name] = {
            startTransition: false,
            lastState: {},
            callbacks: [],
            initialized: false
        };
        seq = this._sequences[name];
    }
    if (!seq.initialized) {
        seq.initialized = true;
        for (var e in states[0]) {
            if (typeof states[0][e] === "number") {
                seq.lastState[e] = states[0][e];
            } else if (typeof states[0][e] === "function") {
                seq.lastState[e] = states[0][e](null, 0);
            }
        }
        seq.lastState.inTransition = false,
        seq.lastState.indefiniteHold = false,
        seq.lastState.index = 0;
        seq.lastState.name = names[seq.lastState.index];
        seq.lastState.t = 0;
        seq.lastState.realT = t;
        if (holdTimes[0] < 0) {
            seq.lastState.indefiniteHold = true;
        }
        for (var i = 0; i < seq.callbacks.length; i++) {
            seq.callbacks[i]("enter", seq.lastState.index, seq.lastState.name);
        }
    }
    if (seq.startTransition) {
        seq.startTransition = false;
        seq.lastState.inTransition = true;
        seq.lastState.indefiniteHold = false;
        seq.lastState.t = 0;
        seq.lastState.realT = t;
        for (var i = 0; i < seq.callbacks.length; i++) {
            seq.callbacks[i]("exit", seq.lastState.index, seq.lastState.name);
        }
    }
    var alpha, endTime, nextIndex;
    while (true) {
        nextIndex = (seq.lastState.index + 1) % states.length;
        if (seq.lastState.inTransition) {
            endTime = seq.lastState.realT + transTimes[seq.lastState.index];
            if (t >= endTime) {
                seq.lastState = this._interpState(seq.lastState, states[nextIndex], interps, endTime, endTime);
                seq.lastState.inTransition = false;
                seq.lastState.index = nextIndex;
                seq.lastState.name = names[seq.lastState.index];
                if (holdTimes[nextIndex] < 0) {
                    seq.lastState.indefiniteHold = true;
                } else {
                    seq.lastState.indefiniteHold = false;
                }
                for (var i = 0; i < seq.callbacks.length; i++) {
                    seq.callbacks[i]("enter", seq.lastState.index, seq.lastState.name);
                }
            } else {
                return this._interpState(seq.lastState, states[nextIndex], interps, t, endTime);
            }
        } else {
            endTime = seq.lastState.realT + holdTimes[seq.lastState.index];
            if ((holdTimes[seq.lastState.index] >= 0) && (t > endTime)) {
                seq.lastState = this._extrapState(seq.lastState, states[seq.lastState.index], endTime);
                seq.lastState.inTransition = true;
                seq.lastState.indefiniteHold = false;
                for (var i = 0; i < seq.callbacks.length; i++) {
                    seq.callbacks[i]("exit", seq.lastState.index, seq.lastState.name);
                }
            } else {
                return this._extrapState(seq.lastState, states[seq.lastState.index], t);
            }
        }
    }
}

PrairieDrawAnim.prototype._interpState = function(lastState, nextState, interps, t, tFinal) {
    var s1 = this.dupState(nextState);
    s1.realT = tFinal;
    s1.t = tFinal - lastState.realT;

    var s = {};
    var alpha = (t - lastState.realT) / (tFinal - lastState.realT);
    for (e in nextState) {
        if (e in interps) {
            s[e] = interps[e](lastState, s1, t - lastState.realT);
        } else {
            s[e] = this.linearInterp(lastState[e], s1[e], alpha);
        }
    }
    s.realT = t;
    s.t = Math.min(t - lastState.realT, s1.t);
    s.index = lastState.index;
    s.inTransition = lastState.inTransition;
    s.indefiniteHold = lastState.indefiniteHold;
    return s;
}

PrairieDrawAnim.prototype._extrapState = function(lastState, lastStateData, t) {
    var s = {};
    for (e in lastStateData) {
        if (typeof lastStateData[e] === "number") {
            s[e] = lastStateData[e];
        } else if (typeof lastStateData[e] === "function") {
            s[e] = lastStateData[e](lastState, t - lastState.realT);
        }
    }
    s.realT = t;
    s.t = t - lastState.realT;
    s.index = lastState.index;
    s.inTransition = lastState.inTransition;
    s.indefiniteHold = lastState.indefiniteHold;
    return s;
}

/** Register a callback on animation sequence events.

    @param {string} seqName The sequence to register on.
    @param {Function} callback The callback(event, index, stateName) function.
*/
PrairieDrawAnim.prototype.registerSeqCallback = function(seqName, callback) {
    if (!(seqName in this._sequences)) {
        throw new Error("PrairieDraw: unknown sequence: " + seqName);
    }
    var seq = this._sequences[seqName];
    seq.callbacks.push(callback.bind(this));
    if (seq.inTransition) {
        callback.apply(this, ["exit", seq.lastState.index, seq.lastState.name]);
    } else {
        callback.apply(this, ["enter", seq.lastState.index, seq.lastState.name]);
    }
}

/** Make a two-state sequence transitioning to and from 0 and 1.

    @param {string} name The name of the sequence;
    @param {number} transTime The transition time between the two states.
    @return {number} The current state (0 to 1).
*/
PrairieDrawAnim.prototype.activationSequence = function(name, transTime, t) {
    var stateZero = {trans: 0};
    var stateOne = {trans: 1};
    var states = [stateZero, stateOne];
    var transTimes = [transTime, transTime];
    var holdTimes = [-1, -1];
    var interps = {};
    var names = ["zero", "one"];
    var state = this.newSequence(name, states, transTimes, holdTimes, interps, names, t);
    return state.trans;
}

PrairieDrawAnim.prototype.resetSequence = function(name) {
    seq = this._sequences[name];
    if (seq !== undefined) {
        seq.initialized = false;
    }
};

PrairieDrawAnim.prototype.resetAllSequences = function() {
    for (name in this._sequences) {
        this.resetSequence(name);
    }
};

/*****************************************************************************/

PrairieDraw.prototype.drawImage = function(imgSrc, posDw, anchor, widthDw) {
    if (imgSrc in this._images) {
        // FIXME: should check that the image is really loaded, in case we are fired beforehand (also for text images).
        var img = this._images[imgSrc];
        var posPx = this.pos2Px(posDw);
        var scale;
        if (widthDw === undefined) {
            scale = 1;
        } else {
            var offsetDw = $V([widthDw, 0]);
            var offsetPx = this.vec2Px(offsetDw);
            var widthPx = offsetPx.modulus();
            scale = widthPx / img.width;
        }
        var xPx =  - (anchor.e(1) + 1) / 2 * img.width;
        var yPx = (anchor.e(2) - 1) / 2 * img.height;
        this._ctx.save();
        this._ctx.translate(posPx.e(1), posPx.e(2));
        this._ctx.scale(scale, scale);
        this._ctx.translate(xPx, yPx);
        this._ctx.drawImage(img, 0, 0);
        this._ctx.restore();
    } else {
        var img = new Image();
        img.onload = this.redraw.bind(this);
        img.src = imgSrc;
        this._images[imgSrc] = img;
    }
};

/*****************************************************************************/

PrairieDraw.prototype.mouseEventPx = function(event) {
    var xPx = event.pageX - this._canvas.offsetLeft;
    var yPx = event.pageY - this._canvas.offsetTop;
    var posPx = $V([xPx, yPx]);
    return posPx;
};

PrairieDraw.prototype.mouseEventDw = function(event) {
    var posPx = this.mouseEventPx(event);
    var posDw = this.pos2Dw(posPx);
    return posDw;
};

PrairieDraw.prototype.mouseEventOnCanvas = function(event) {
    var posPx = this.mouseEventPx(event);
    console.log(posPx.e(1), posPx.e(2), this._width, this._height);
    if (posPx.e(1) >= 0 && posPx.e(1) <= this._width
        && posPx.e(2) >= 0 && posPx.e(2) <= this._height) {
        console.log(true);
        return true;
    }
    console.log(false);
    return false;
};

PrairieDraw.prototype.reportMouseSample = function(event) {
    var posDw = this.mouseEventDw(event);
    var numDecPlaces = 2;
    console.log("$V([" + posDw.e(1).toFixed(numDecPlaces)
                + ", " + posDw.e(2).toFixed(numDecPlaces)
                + "]),");
}

PrairieDraw.prototype.activateMouseSampling = function() {
    this._canvas.addEventListener('click', this.reportMouseSample.bind(this));
};

/*****************************************************************************/

PrairieDraw.prototype.activateMouseLineDraw = function() {
    if (this._mouseLineDrawActive === true) {
        return;
    }
    this._mouseLineDrawActive = true;
    this.mouseLineDraw = false;
    this.mouseLineDrawing = false;
    if (this._mouseLineDrawInitialized !== true) {
        this._mouseLineDrawInitialized = true;
        if (this._mouseDrawCallbacks === undefined) {
            this._mouseDrawCallbacks = [];
        }
        this._canvas.addEventListener("mousedown", this.mouseLineDrawMousedown.bind(this), true);
        window.addEventListener("mouseup", this.mouseLineDrawMouseup.bind(this), true);
        window.addEventListener("mousemove", this.mouseLineDrawMousemove.bind(this), true);
    }
    for (var i = 0; i < this._mouseDrawCallbacks.length; i++) {
        this._mouseDrawCallbacks[i]();
    }
    this.redraw();
};

PrairieDraw.prototype.deactivateMouseLineDraw = function() {
    this._mouseLineDrawActive = false;
    this.mouseLineDraw = false;
    this.mouseLineDrawing = false;
    this.redraw();
};

PrairieDraw.prototype.mouseLineDrawMousedown = function(event) {
    if (!this._mouseLineDrawActive) {
        return;
    }
    event.preventDefault();

    var posDw = this.mouseEventDw(event);
    this.mouseLineDrawStart = posDw;
    this.mouseLineDrawEnd = posDw;
    this.mouseLineDrawing = true;
    this.mouseLineDraw = true;
    for (var i = 0; i < this._mouseDrawCallbacks.length; i++) {
        this._mouseDrawCallbacks[i]();
    }
    this.redraw();
};

PrairieDraw.prototype.mouseLineDrawMousemove = function(event) {
    if (!this._mouseLineDrawActive) {
        return;
    }
    if (!this.mouseLineDrawing) {
        return;
    }
    this.mouseLineDrawEnd = this.mouseEventDw(event);
    for (var i = 0; i < this._mouseDrawCallbacks.length; i++) {
        this._mouseDrawCallbacks[i]();
    }
    this.redraw(); // FIXME: add rate-limiting
};

PrairieDraw.prototype.mouseLineDrawMouseup = function(event) {
    if (!this._mouseLineDrawActive) {
        return;
    }
    if (!this.mouseLineDrawing) {
        return;
    }
    this.mouseLineDrawing = false;
    for (var i = 0; i < this._mouseDrawCallbacks.length; i++) {
        this._mouseDrawCallbacks[i]();
    }
    this.redraw();
};

PrairieDraw.prototype.mouseLineDrawMouseout = function(event) {
    if (!this._mouseLineDrawActive) {
        return;
    }
    if (!this.mouseLineDrawing) {
        return;
    }
    this.mouseLineDrawEnd = this.mouseEventDw(event);
    this.mouseLineDrawing = false;
    for (var i = 0; i < this._mouseDrawCallbacks.length; i++) {
        this._mouseDrawCallbacks[i]();
    }
    this.redraw();
};

PrairieDraw.prototype.registerMouseLineDrawCallback = function(callback) {
    if (this._mouseDrawCallbacks === undefined) {
        this._mouseDrawCallbacks = [];
    }
    this._mouseDrawCallbacks.push(callback.bind(this));
};

/*****************************************************************************/

/** Find the output angle beta for a four-bar linkage.

 @param {number} g Ground link length.
 @param {number} f Input link length.
 @param {number} a Output link length.
 @param {number} b Floating link length.
 @param {number} alpha Input angle.
 @param {bool} flipped Whether the output-floating triangle is flipped.
 @return {number} Output angle beta.
*/
PrairieDraw.prototype.solveFourBar = function(g, f, a, b, alpha, flipped) {
    var l = this.cosLawLength(a, g, alpha);
    var beta1 = this.cosLawAngle(g, l, a);
    var beta2 = this.cosLawAngle(l, b, f);
    if (Math.sin(alpha) > 0) {
        if (flipped) {
            return Math.PI - beta1 + beta2;
        } else {
            return Math.PI - beta1 - beta2;
        }
    } else {
        if (flipped) {
            return Math.PI + beta1 + beta2;
        } else {
            return Math.PI + beta1 - beta2;
        }
    }
};

/*****************************************************************************/

/** Plot a line graph.

    @param {Array} data Array of vectors to plot.
    @param {Vector} originDw The lower-left position of the axes.
    @param {Vector} sizeDw The size of the axes (vector from lower-left to upper-right).
    @param {Vector} originData The lower-left position of the axes in data coordinates.
    @param {Vector} sizeData The size of the axes in data coordinates.
    @param {string} xLabel The vertical axis label.
    @param {string} yLabel The vertical axis label.
    @param {string} type (Optional) The type of line being drawn.
    @param {string} drawAxes (Optional) Whether to draw the axes (default: true).
    @param {string} drawPoint (Optional) Whether to draw the last point (default: false).
    @param {string} pointLabel (Optional) Label for the last point (default: undefined).
    @param {string} pointAnchor (Optional) Anchor for the last point label (default: $V([0, -1])).
    @param {Object} options (Optional) Plotting options:
                    horizAxisPos: "bottom", "top", or a numerical value in data coordinates (default: "bottom")
                    vertAxisPos: "left", "right", or a numerical value in data coordinates (default: "left")
*/
 PrairieDraw.prototype.plot = function(data, originDw, sizeDw, originData, sizeData, xLabel, yLabel, type, drawAxes, drawPoint, pointLabel, pointAnchor, options) {
        drawAxes = (drawAxes === undefined) ? true : drawAxes;
        drawPoint = (drawPoint === undefined) ? true : drawPoint;
        options = (options === undefined) ? {} : options;
        var horizAxisPos = (options.horizAxisPos === undefined) ? "bottom" : options.horizAxisPos;
        var vertAxisPos = (options.vertAxisPos === undefined) ? "left" : options.vertAxisPos;
        var drawXGrid = (options.drawXGrid === undefined) ? false : options.drawXGrid;
        var drawYGrid = (options.drawYGrid === undefined) ? false : options.drawYGrid;
        var dXGrid = (options.dXGrid === undefined) ? 1 : options.dXGrid;
        var dYGrid = (options.dYGrid === undefined) ? 1 : options.dYGrid;
        var drawXTickLabels = (options.drawXTickLabels === undefined) ? false : options.drawXTickLabels;
        var drawYTickLabels = (options.drawYTickLabels === undefined) ? false : options.drawYTickLabels;
        var xLabelPos = (options.xLabelPos === undefined) ? 1 : options.xLabelPos;
        var yLabelPos = (options.yLabelPos === undefined) ? 1 : options.yLabelPos;
        var xLabelAnchor = (options.xLabelAnchor === undefined) ? $V([1, 1.5]) : options.xLabelAnchor;
        var yLabelAnchor = (options.yLabelAnchor === undefined) ? $V([1.5, 1]) : options.yLabelAnchor;
        var yLabelRotate = (options.yLabelRotate === undefined) ? false : options.yLabelRotate;
        this.save();
        this.translate(originDw);

        // grid
        var ix0 = Math.ceil(originData.e(1) / dXGrid);
        var ix1 = Math.floor((originData.e(1) + sizeData.e(1)) / dXGrid);
        var x0 = 0;
        var x1 = PrairieGeom.linearMap(originData.e(1), originData.e(1) + sizeData.e(1), 0, sizeDw.e(1), ix1 * dXGrid);
        var iy0 = Math.ceil(originData.e(2) / dYGrid);
        var iy1 = Math.floor((originData.e(2) + sizeData.e(2)) / dYGrid);
        var y0 = 0;
        var y1 = PrairieGeom.linearMap(originData.e(2), originData.e(2) + sizeData.e(2), 0, sizeDw.e(2), iy1 * dYGrid);
        var i, x, y;
        if (drawXGrid) {
            for (i = ix0; i <= ix1; i++) {
                x = PrairieGeom.linearMap(originData.e(1), originData.e(1) + sizeData.e(1), 0, sizeDw.e(1), i * dXGrid);
                this.line($V([x, y0]), $V([x, y1]), "grid");
            }
        }
        if (drawYGrid) {
            for (i = iy0; i <= iy1; i++) {
                y = PrairieGeom.linearMap(originData.e(2), originData.e(2) + sizeData.e(2), 0, sizeDw.e(2), i * dYGrid);
                this.line($V([x0, y]), $V([x1, y]), "grid");
            }
        }
        var label;
        if (drawXTickLabels) {
            for (i = ix0; i <= ix1; i++) {
                x = PrairieGeom.linearMap(originData.e(1), originData.e(1) + sizeData.e(1), 0, sizeDw.e(1), i * dXGrid);
                label = String(i * dXGrid);
                this.text($V([x, y0]), $V([0, 1]), label);
            }
        }
        if (drawYTickLabels) {
            for (i = iy0; i <= iy1; i++) {
                y = PrairieGeom.linearMap(originData.e(2), originData.e(2) + sizeData.e(2), 0, sizeDw.e(2), i * dYGrid);
                label = String(i * dYGrid);
                this.text($V([x0, y]), $V([1, 0]), label);
            }
        }

        // axes
        var axisX, axisY;
        if (vertAxisPos === "left") {
            axisX = 0;
        } else if (vertAxisPos === "right") {
            axisX = sizeDw.e(1);
        } else {
            axisX = PrairieGeom.linearMap(originData.e(1), originData.e(1) + sizeData.e(1), 0, sizeDw.e(1), vertAxisPos);
        }
        if (horizAxisPos === "bottom") {
            axisY = 0;
        } else if (horizAxisPos === "top") {
            axisY = sizeDw.e(2);
        } else {
            axisY = PrairieGeom.linearMap(originData.e(2), originData.e(2) + sizeData.e(2), 0, sizeDw.e(2), horizAxisPos);
        }
        if (drawAxes) {
            this.save();
            this.setProp("arrowLineWidthPx", 1);
            this.setProp("arrowheadLengthRatio", 11);
            this.arrow($V([0, axisY]), $V([sizeDw.e(1), axisY]));
            this.arrow($V([axisX, 0]), $V([axisX, sizeDw.e(2)]));
            x = xLabelPos * sizeDw.e(1);
            y = yLabelPos * sizeDw.e(2);
            this.text($V([x, axisY]), xLabelAnchor, xLabel);
            var angle = (yLabelRotate ? -Math.PI / 2 : 0);
            this.text($V([axisX, y]), yLabelAnchor, yLabel, undefined, angle);
            this.restore();
        }

        var col = this._getColorProp(type);
        this.setProp("shapeOutlineColor", col);
        this.setProp("pointRadiusPx", "4");
        var bottomLeftPx = this.pos2Px($V([0, 0]));
        var topRightPx = this.pos2Px(sizeDw);
        var offsetPx = topRightPx.subtract(bottomLeftPx);
        this.save();
        this.scale(sizeDw);
        this.scale($V([1 / sizeData.e(1), 1 / sizeData.e(2)]));
        this.translate(originData.x(-1));
        this.save();
        this._ctx.beginPath();
        this._ctx.rect(bottomLeftPx.e(1), bottomLeftPx.e(2), offsetPx.e(1), offsetPx.e(2));
        this._ctx.clip();
        this.polyLine(data, false);
        this.restore();
        if (drawPoint) {
            this.point(data[data.length - 1]);
            if (pointLabel !== undefined) {
                if (pointAnchor === undefined) {
                    pointAnchor = $V([0, -1]);
                }
                this.text(data[data.length - 1], pointAnchor, pointLabel);
            }
        }
        this.restore();
        this.restore();
    };

/*****************************************************************************/