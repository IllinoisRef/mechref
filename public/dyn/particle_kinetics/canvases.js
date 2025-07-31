var bus = {
    radius: 50, // m
    mass: 12600, // kg
    gravity: 9.81, // m/s^2

    busScale: 0.4,
    forceScale: 5e-6,
    motionScale: 1e-1,

    width: 2.54,
    totalWidth: 2.90,
    height: 3.11,

    centerOfMass: $V([0, 0.87]),
    leftContact: $V([-0.97, 0]),
    rightContact: $V([0.97, 0]),
    centerContact: $V([0, 0]),
    body: [
        $V([1.13, 3.11]),
        $V([-1.13, 3.11]),
        $V([-1.27, 2.18]),
        $V([-1.24, 0.21]),
        $V([1.24, 0.21]),
        $V([1.27, 2.18]),
    ],
    wheelLeft: [
        $V([-1.10, 0.21]),
        $V([-1.10, 0.00]),
        $V([-0.84, 0.00]),
        $V([-0.84, 0.21]),
    ],
    wheelRight: [
        $V([1.10, 0.21]),
        $V([1.10, 0.00]),
        $V([0.84, 0.00]),
        $V([0.84, 0.21]),
    ],
    mirrorLeft: [
        $V([-1.16, 2.91]),
        $V([-1.45, 2.81]),
        $V([-1.45, 2.31]),
        $V([-1.30, 2.24]),
        $V([-1.22, 2.78]),
        $V([-1.33, 2.79]),
        $V([-1.17, 2.84]),
    ],
    mirrorRight: [
        $V([1.16, 2.91]),
        $V([1.45, 2.81]),
        $V([1.45, 2.31]),
        $V([1.30, 2.24]),
        $V([1.22, 2.78]),
        $V([1.33, 2.79]),
        $V([1.17, 2.84]),
    ],
    stripe: [
        $V([1.20, 1.04]),
        $V([1.04, 0.80]),
        $V([0.00, 0.75]),
        $V([-1.04, 0.80]),
        $V([-1.20, 1.04]),
        $V([-0.81, 1.00]),
        $V([0.00, 0.98]),
        $V([0.81, 1.00]),
    ],
    headlightLeft: [
        $V([-1.20, 1.04]),
        $V([-1.21, 1.15]),
        $V([-0.88, 1.07]),
        $V([-0.76, 0.78]),
    ],
    headlightRight: [
        $V([1.20, 1.04]),
        $V([1.21, 1.15]),
        $V([0.88, 1.07]),
        $V([0.76, 0.78]),
    ],
    license: [
        $V([0.28, 0.44]),
        $V([-0.28, 0.44]),
        $V([-0.28, 0.30]),
        $V([0.28, 0.30]),
    ],
    windshield: [
        $V([1.08, 3.00]),
        $V([-1.08, 3.00]),
        $V([-1.20, 2.18]),
        $V([-1.19, 1.23]),
        $V([1.19, 1.23]),
        $V([1.20, 2.18]),
    ]
};

bus.draw = function(pd) {
    pd.polyLine(bus.body, true);
    pd.polyLine(bus.wheelLeft, false);
    pd.polyLine(bus.wheelRight, false);
    pd.polyLine(bus.mirrorLeft, false);
    pd.polyLine(bus.mirrorRight, false);
    pd.polyLine(bus.stripe, true);
    pd.polyLine(bus.headlightLeft, false);
    pd.polyLine(bus.headlightRight, false);
    pd.polyLine(bus.license, true);
    pd.polyLine(bus.windshield, true);
}

bus.drawForce = function(pd, posDw, f1Dw, f2Dw) {
    if (pd.getOption("components") || f2Dw === undefined) {
        pd.arrowTo(posDw, f1Dw.x(this.forceScale), "force");
        if (f2Dw !== undefined) {
            pd.arrowTo(posDw, f2Dw.x(this.forceScale), "force");
        }
    } else {
        pd.arrowTo(posDw, f1Dw.add(f2Dw).x(this.forceScale), "force");
    }
};

var Car = {
    width: 4.60,
    height: 1.39,
    outline: [$V([1.37, 0.27]), $V([3.49, 0.27]), $V([4.23, 0.35]),
              $V([4.49, 0.35]), $V([4.60, 0.55]), $V([4.49, 0.60]),
              $V([4.56, 0.83]), $V([4.49, 0.89]), $V([4.25, 0.93]),
              $V([3.05, 0.98]), $V([2.55, 1.36]), $V([2.27, 1.39]),
              $V([1.96, 1.38]), $V([1.56, 1.32]), $V([1.16, 1.20]),
              $V([0.57, 0.98]), $V([0.35, 0.95]), $V([0.08, 0.93]),
              $V([0.00, 0.61]), $V([0.22, 0.38]), $V([0.70, 0.35])],
    sideLines: [$V([4.43, 0.75]), $V([3.03, 0.76]), $V([1.44, 0.75]),
                $V([1.56, 0.47]), $V([3.32, 0.46])],
    windowOutline: [$V([2.91, 0.95]), $V([2.48, 1.28]), $V([2.26, 1.30]),
                    $V([1.97, 1.29]), $V([1.69, 1.24]), $V([1.66, 1.20]),
                    $V([1.73, 0.96])],
    rearLine: [$V([1.71, 0.94]), $V([1.57, 0.93]), $V([1.46, 0.98]),
               $V([1.13, 0.98]), $V([0.54, 0.96])],
    rearWheelC: $V([0.98, 0.31]),
    frontWheelC: $V([3.80, 0.31]),
    centerOfMass: $V([2.39, 0.60]),
    rearContact: $V([0.98, 0.00]),
    frontContact: $V([3.80, 0]),
    windContact: $V([4.60, 0.60]),
    wheelR: 0.31,
    rimR: 0.20,
    axleR: 0.07,
    nSpokes: 6,
    wheelMass: 20,
    bodyMass: 1100,
    mass: 1180,
    wheelMomentInertia: 0.961,
    crossSectionArea: 2.2,
    dragCoeff: 0.3,
    airDensity: 1.23e-3,
    forceScale: 1e-4,
    motionScale: 0.05,
    momentScale: 1e-3
};

Car.drawBody = function(pd) {
    pd.polyLine(this.outline, true);
    pd.polyLine(this.sideLines);
    pd.polyLine(this.windowOutline, true);
    pd.polyLine(this.rearLine);
    pd.setProp("pointRadiusPx", 4);
    pd.filledCircle(this.rearWheelC, this.axleR);
    pd.filledCircle(this.frontWheelC, this.axleR);
};

Car.drawWheels = function(pd, wheelAngle) {
    pd.circle(this.rearWheelC, this.wheelR);
    pd.circle(this.rearWheelC, this.rimR);
    pd.circle(this.frontWheelC, this.wheelR);
    pd.circle(this.frontWheelC, this.rimR);
    var theta;
    for (var i = 0; i < this.nSpokes; i++) {
        theta = wheelAngle + 2 * Math.PI * i / this.nSpokes;
        pd.line(this.rearWheelC, this.rearWheelC.add(pd.vector2DAtAngle(theta).x(this.rimR)));
        pd.line(this.frontWheelC, this.frontWheelC.add(pd.vector2DAtAngle(theta).x(this.rimR)));
    }
    pd.filledCircle(this.rearWheelC, this.axleR);
    pd.filledCircle(this.frontWheelC, this.axleR);
};

Car.getMotion = function(pd, t) {
    var xHold = function(s0, dt) {
        if (s0 == null) {
            return 0;
        }
        return s0.x;
    };

    var vExtrap = function(s0, dt) {
        return s0.v + dt * s0.a;
    };

    var xExtrap = function(s0, dt) {
        return s0.x + dt * s0.v + 0.5 * dt * dt * s0.a;
    };

    var vInterp = function(s0, s1, dt) {
        return s0.v + dt * s0.a + 0.5 * dt * dt / (s1.t - s0.t) * (s1.a - s0.a);
    };

    var xInterp = function(s0, s1, dt) {
        return s0.x + dt * s0.v + 0.5 * dt * dt * s0.a + (1/6) * dt * dt * dt / (s1.t - s0.t) * (s1.a - s0.a);
    };

    var stateStationary = {a: 0, v: 0, x: xHold};
    var stateAccelerating = {a: 10, v: vExtrap, x: xExtrap};
    var stateCruising = {a: 0, v: vExtrap, x: xExtrap};
    var stateBraking = {a: -10, v: vExtrap, x: xExtrap};
    var states = [stateStationary, stateAccelerating, stateCruising, stateBraking];

    var interps = {v: vInterp, x: xInterp};
    var transTimes = [1, 1, 1, 1];
    var holdTimes = [-1, 3, -1, 3];
    var names = ["stationary", "accelerating", "cruising", "braking"];

    var motionState = pd.newSequence("motion", states, transTimes, holdTimes, interps, names, t);
    return motionState;
};

Car.fAir = function(v) {
    var fAir = 0.5 * Car.airDensity * Math.pow(v, 2) * Car.dragCoeff * Car.crossSectionArea;
    fAir *= 1e4;
    return fAir;
};

Car.drawForce = function(pd, posDw, fDw) {
    if (pd.getOption("components")) {
        pd.arrowTo(posDw, $V([fDw.e(1), 0]).x(this.forceScale), "force");
        pd.arrowTo(posDw, $V([0, fDw.e(2)]).x(this.forceScale), "force");
    } else {
        pd.arrowTo(posDw, fDw.x(this.forceScale), "force");
    }
};


$(document).ready(function() {

    /********************************************************************************/

    afp_ff_c = new PrairieDraw("afp-ff-c", function(t) {
        this.addOption("vAngleDeg", 30);
        var vAngle = PrairieGeom.degToRad(this.getOption("vAngleDeg"));

	this.setUnits(11, 11 / this.goldenRatio);

        var O = $V([0, 0]);
        this.drawImage("afp_baseball.png", O, O, 1);

        var v = PrairieGeom.vector2DAtAngle(vAngle).x(2.5);
        var Fd = PrairieGeom.vector2DAtAngle(vAngle + Math.PI).x(1.5);
        var Fg = $V([0, -3]);

        this.arrow(O, v, "velocity");
        this.arrow(O, Fd, "force");
        this.arrow(O, Fg, "force");

        this.labelLine(O, v, $V([0, 1]), "TEX:$\\vec{v}$");
        this.labelLine(O, Fd, $V([0, -1]), "TEX:$\\vec{F}_{\\rm D}$");
        this.labelLine(O, Fg, $V([0, 1]), "TEX:$m\\vec{g}$");
    });

    /********************************************************************************/

    afp_ft_c = new PrairieDraw("afp-ft-c", function() {
        this.addOption("v0", 30);
        var v0 = this.getOption("v0");
        this.addOption("v0AngleDeg", 45);
        var v0Angle = PrairieGeom.degToRad(this.getOption("v0AngleDeg"));
        this.addOption("m_g", 145);
        var m = this.getOption("m_g") / 1000;
        this.addOption("D_cm", 7.5);
        var D = this.getOption("D_cm") / 100;

        this.setUnits(10, 6.3);

        var dt = 0.03;
        var nt = 300;

        var rkStep = function(f, x, dt) {
            var x0 = $V(x);
            var k1 = $V(f(x0.elements));
            var k2 = $V(f(x0.add(k1.x(dt/2)).elements));
            var k3 = $V(f(x0.add(k2.x(dt/2)).elements));
            var k4 = $V(f(x0.add(k3.x(dt)).elements));
            var x1 = x0.add(k1.x(dt/6)).add(k2.x(dt/3)).add(k3.x(dt/3)).add(k4.x(dt/6));
            return x1.elements;
        };
        var rk = function(f, x0, dt, nt) {
            var traj = [x0];
            for (var i = 0; i < nt; i++) {
                traj.push(rkStep(f, traj[traj.length - 1], dt));
            }
            return traj;
        };

        var fVacuum = function(x) {
            var rx = x[0];
            var ry = x[1];
            var vx = x[2];
            var vy = x[3];
            return [vx, vy, 0, -9.81];
        }
        var fDrag = function(x) {
            var rx = x[0];
            var ry = x[1];
            var vx = x[2];
            var vy = x[3];
            var v = $V([vx, vy]);
            var rho = 1.225;
            var c = Math.PI / 16 * rho * D*D;
            var aD = v.x(-c / m * v.modulus());
            return [vx, vy, aD.e(1), -9.81 + aD.e(2)];
        }

        var v0 = PrairieGeom.vector2DAtAngle(v0Angle).x(v0);
        var x0 = [0, 1, v0.e(1), v0.e(2)];
        var stateTrajVacuum = rk(fVacuum, x0, dt, nt);
        var stateTrajDrag = rk(fDrag, x0, dt, nt);

        var stateTrajToPosTraj = function(stateTraj) {
            var posTraj = [];
            for (var i = 0; i < stateTraj.length; i++) {
                posTraj.push($V([stateTraj[i][0], stateTraj[i][1]]));
            }
            return posTraj;
        };

        var posTrajVacuum = stateTrajToPosTraj(stateTrajVacuum);
        var posTrajDrag = stateTrajToPosTraj(stateTrajDrag);
        console.log(1)
        var originDw = $V([-4.2, -2.35]);
        var sizeDw = $V([8.8, 5.252]);
        var originData = $V([0, 0]);
        var sizeData = $V([124, 74]);
        var options = {
            drawXGrid: true,
            drawYGrid: true,
            dXGrid: 10,
            dYGrid: 10,
            drawXTickLabels: true,
            drawYTickLabels: true,
            xLabelPos: 0.5,
            yLabelPos: 0.5,
            xLabelAnchor: $V([0, 3]),
            yLabelAnchor: $V([0, -3]),
            yLabelRotate: true,
        };
        console.log(2)
        this.plot(posTrajVacuum, originDw, sizeDw, originData, sizeData, "TEX:horizontal position $x$ / m", "TEX:vertical position $y$ / m", "blue", true, false, null, null, options);
        this.plot(posTrajDrag, originDw, sizeDw, originData, sizeData, null, null, "red", false);

        var findPeak = function(posTraj) {
            var peak = $V([0, 0]);
            for (var i = 0; i < posTraj.length; i++) {
                if (posTraj[i].e(2) > peak.e(2)) {
                    peak = posTraj[i];
                }
            }
            return peak;
        };
        
        var peakVacuum = findPeak(posTrajVacuum);
        var peakDrag = findPeak(posTrajDrag);

        peakVacuum = $V([
            (peakVacuum.e(1) - originData.e(1)) / sizeData.e(1) * sizeDw.e(1) + originDw.e(1),
            (peakVacuum.e(2) - originData.e(2)) / sizeData.e(2) * sizeDw.e(2) + originDw.e(2),
        ]);
        peakDrag = $V([
            (peakDrag.e(1) - originData.e(1)) / sizeData.e(1) * sizeDw.e(1) + originDw.e(1),
            (peakDrag.e(2) - originData.e(2)) / sizeData.e(2) * sizeDw.e(2) + originDw.e(2),
        ]);

        this.text(peakVacuum, $V([0, -1]), "TEX:vacuum");
        this.text(peakDrag, $V([0, 1]), "TEX:drag");
    });

    /********************************************************************************/
    rep_ff_c = new PrairieDrawAnim("rep-ff-c", function(t) {

        var xViewMax = 3;
        var yViewMax = 2;
        var xWorldMax = xViewMax * 1.1;
        var yWorldMax = yViewMax * 1.1;

        this.setUnits(2 * xViewMax, 2 * yViewMax);

        this.addOption("r", $V([0, 0]));
        this.addOption("v", $V([1, 0]));

        this.addOption("showLabels", true);
        this.addOption("showPath", true);
        this.addOption("movement", "translate");

        var label = this.getOption("showLabels") ? true : undefined;

        var r = this.getOption("r");
        var v = this.getOption("v");
        var f = $V([0, 0]);
        if (this.mouseDown()) {
            var rMod = this.vectorIntervalMod(r, $V([-xWorldMax, -yWorldMax]), $V([xWorldMax, yWorldMax]));
            var fr = this.mousePositionDw().subtract(rMod);
            // f = fr.x(1 / Math.pow(fr.modulus(), 2));
            // f = fr;
            f = fr.toUnitVector();
        }

        var dt = this.deltaTime();
        if (dt > 0 && dt < 0.1) {
            r = r.add(v.x(dt / 2));
            v = v.add(f.x(dt / 2));
            this.setOption("r", r, false);
            this.setOption("v", v, false);
        }

        var maxHistoryTime = 3;
        if (this.getOption("showPath")) {
            var rHistory = this.history("r", 0.05, maxHistoryTime, t, r);
        } else {
            this.clearHistory("r");
        }

        var xMin = r.e(1), xMax = r.e(1);
        var yMin = r.e(2), yMax = r.e(2);
        xMin = Math.min(xMin, r.e(1) + v.e(1));
        xMax = Math.max(xMax, r.e(1) + v.e(1));
        yMin = Math.min(yMin, r.e(2) + v.e(2));
        yMax = Math.max(yMax, r.e(2) + v.e(2));
        for (var i = 0; i < rHistory.length; i++) {
            xMin = Math.min(xMin, rHistory[i][1].e(1));
            xMax = Math.max(xMax, rHistory[i][1].e(1));
            yMin = Math.min(yMin, rHistory[i][1].e(2));
            yMax = Math.max(yMax, rHistory[i][1].e(2));
        }
        var nXMin = this.intervalDiv(xMin, -xWorldMax, xWorldMax);
        var nXMax = this.intervalDiv(xMax, -xWorldMax, xWorldMax);
        var nYMin = this.intervalDiv(yMin, -yWorldMax, yWorldMax);
        var nYMax = this.intervalDiv(yMax, -yWorldMax, yWorldMax);

        for (var nX = nXMin; nX <= nXMax; nX++) {
            for (var nY = nYMin; nY <= nYMax; nY++) {
                this.save();
                this.translate($V([-nX * 2 * xWorldMax, -nY * 2 * yWorldMax]));
                if (this.getOption("showPath")) {
                    this.fadeHistoryLine(rHistory, t, maxHistoryTime, [0, 0, 255], [255, 255, 255]);
                }
                this.save();
                this.setProp("pointRadiusPx", 4);
                this.point(r);
                this.restore();
                this.arrow(r, r.add(v), "velocity");
                if (v.modulus() > 1e-2) {
                    this.labelLine(r, r.add(v), $V([1, 0]), label && "TEX:$\\vec{v}$");
                }
                this.arrow(r, r.add(f), "force");
                if (f.modulus() > 1e-2) {
                    this.labelLine(r, r.add(f), $V([1, 0]), label && "TEX:$\\vec{F}$");
                }
                this.restore();
            }
        }
    });

    rep_ff_c.activateMouseTracking();
    rep_ff_c.activateAnimOnClick();

    ava_fp_c = new PrairieDrawAnim("ava-fp-c", function(t) {
        this.addOption("components", true);
        
        var stateTogether = {bodyOffset: 0};
        var stateApart = {bodyOffset: 3};
        var states = [stateTogether, stateApart];
        var transTimes = [0.5, 0.5];
        var holdTimes = [-1, -1];
        var interps = {};
        var names = ["together", "apart"];
        var fbdState = this.newSequence("fbd", states, transTimes, holdTimes, interps, names, t);
        var drawForces = false;
        if ((fbdState.inTransition == false) && (fbdState.index == 1)) {
            drawForces = true;
        }
        
        var motionState = Car.getMotion(this, t);
        
	this.setUnits(16, 3.5 + fbdState.bodyOffset, 600);
        var desiredPos = this.pos2Dw($V([0, this.heightPx() - this.getProp("groundDepthPx") * 3]));
        this.translate($V([-Car.centerOfMass.e(1), desiredPos.e(2)]));

        var fAir = Car.fAir(motionState.v)
        var fDrive = fAir + Car.mass * motionState.a;
        var fg = Car.mass * 9.81;
        
        var groundOffset = - motionState.x * Car.motionScale;
        var centerContact = $V([Car.centerOfMass.e(1), Car.rearContact.e(2)]);
        
        // body and wheels
        this.save();
        this.translate($V([0, fbdState.bodyOffset]));
        Car.drawBody(this);
        Car.drawWheels(this, 0);
        if (drawForces) {
            this.centerOfMass(Car.centerOfMass);
            Car.drawForce(this, Car.centerOfMass, $V([0, -fg]));
            Car.drawForce(this, Car.windContact, $V([-fAir, 0]));
            Car.drawForce(this, centerContact, $V([fDrive, fg]));
            this.arrowFrom(Car.centerOfMass, $V([motionState.a, 0]).x(Car.motionScale), "acceleration");
            this.arrowFrom(Car.centerOfMass, $V([motionState.v, 0]).x(Car.motionScale), "velocity");
        }
        this.restore();
        
        // ground
        this.groundHashed($V([0, 0]), $V([0, 1]), 25, groundOffset);
        if (drawForces) {
            Car.drawForce(this, centerContact, $V([-fDrive, -fg]));
        }
    });

    rep_xl_c = new PrairieDraw("rep-xl-c", function() {

        this.setUnits(6, 4);

        this.addOption("showBases", false);

        var len = 2;
        var theta = Math.PI / 4;
        var O = $V([0, 0]);
        var rP = $V([0, -len]).rotate(theta, O);

        this.translate($V([0, 0.5]));

        this.ground($V([0, 0.5]), $V([0, -1]), 2);
        this.pivot($V([0, 0.5]), O, 0.4);
        this.rod(O, rP, 0.2);
        this.arc(rP, 0.15, undefined, undefined, true);
        this.point(O);
        this.point(rP);
        this.text(rP.add($V([0, -0.15])), $V([0, 1]), "TEX:$m$");
        this.save();
        this.setProp("shapeStrokePattern", "dashed");
        this.line(O.add($V([0, -0.5])), O.add($V([0, -len])));
        this.restore();
        this.circleArrow(O, len * 0.6, -Math.PI / 2, -theta - 0.1, "angle", true);
        this.labelCircleLine(O, len * 0.6, -Math.PI / 2, -theta - 0.1, $V([0, 1]), "TEX:$\\theta$", true);
        this.arrow($V([-2, -0.4]), $V([-2, -1.4]), "acceleration");
        this.labelLine($V([-2, -0.4]), $V([-2, -1.4]), $V([0, 1]), "TEX:$g$");

        if (this.getOption("showBases")) {
            var ei = $V([1, 0]);
            var ej = $V([0, 1]);
            var eR = $V([0, -1]).rotate(theta, O);
            var eTheta = $V([1, 0]).rotate(theta, O);

            this.arrow(O, O.add(ei));
            this.arrow(O, O.add(ej));
            this.labelLine(O, O.add(ei), $V([1, 0]), "TEX:$\\hat\\imath$");
            this.labelLine(O, O.add(ej), $V([1, 0]), "TEX:$\\hat\\jmath$");

            this.arrow(rP, rP.add(eR));
            this.arrow(rP, rP.add(eTheta));
            this.labelLine(rP, rP.add(eR), $V([1, 0]), "TEX:$\\hat{e}_r$");
            this.labelLine(rP, rP.add(eTheta), $V([1, 0]), "TEX:$\\hat{e}_\\theta$");
        }
    });

    rep_xl_f = new PrairieDraw("rep-xl-f", function() {

        this.setUnits(6, 4);

        var theta = Math.PI / 4;
        var O = $V([0, 0]);
        var eR = $V([0, -1]).rotate(theta, O);

        this.arc(O, 0.15, undefined, undefined, true);
        this.point(O);
        this.text(O.add($V([0.15, 0])), $V([-1, 0]), "TEX:$m$");
        this.arrow(O, O.add($V([0, -1.5])), "force");
        this.labelLine(O, O.add($V([0, -1.5])), $V([1, 0]), "TEX:$mg$");
        this.arrow(O, O.add($V([0, 1.5]).rotate(theta, O)), "force");
        this.labelLine(O, O.add($V([0, 1.5]).rotate(theta, O)), $V([1, 0]), "TEX:$T$");
    });

    avb_fg_c = new PrairieDrawAnim("avb-fg-c", function(t) {
        this.addOption("vectors", false);
        
	this.setUnits(11, 11 / this.goldenRatio);

        var d = 4;
        var h = 4;
        var w = 1;

        this.rod($V([-d/2, 0]), $V([d/2, 0]), h);
        this.rod($V([-d/2, 0]), $V([d/2, 0]), h - 2 * w);

        var r = (h - w) / 2; // radius of track center
        var l1 = d; // top horizontal center length
        var l2 = Math.PI * r; // right curve center length
        var l3 = d; // bottom horizontal center length
        var l4 = Math.PI * r; // left curve center length
        var l = l1 + l2 + l3 + l4; // total length of track center
        var v = 2; // velocity of vehicle

        var computePos = function(t) {
            var dataNow = {};
            // dataNow.P = position of vechicle
            // dataNow.theta = angle of normal
            var s = (t * v) % l; // distance along track
            if (s < l1) {
                // top horizontal
                dataNow.P = $V([-d/2 + s, r]);
                dataNow.theta = Math.PI / 2;
            } else if (s < l1 + l2) {
                // right curve
                dataNow.theta = Math.PI/2 - (s - l1) / r;
                dataNow.P = $V([d/2 + r * Math.cos(dataNow.theta), r * Math.sin(dataNow.theta)]);
            } else if (s < l1 + l2 + l3) {
                // bottom horizontal
                dataNow.P = $V([d/2 - (s - l1 - l2), -r]);
                dataNow.theta = -Math.PI/2;
            } else {
                // left curve
                dataNow.theta = -Math.PI/2 - (s - l1 - l2 - l3) / r;
                dataNow.P = $V([-d/2 + r * Math.cos(dataNow.theta), r * Math.sin(dataNow.theta)]);
            }
            return dataNow;
        }
        var data = this.numDiff(computePos, t);

        this.save();
        this.translate(data.P);
        this.rotate(data.theta - Math.PI/2);
        this.rectangle(0.4, 0.2);
        this.restore();

        if (this.getOption("vectors")) {
            this.arrowFrom(data.P, data.diff.P.x(0.4), "velocity");
            this.labelLine(data.P, data.P.add(data.diff.P.x(0.4)), $V([1, 0]), "TEX:$\\vec{v}$");
            if (data.ddiff.P.modulus() > 1e-5) {
                this.arrowFrom(data.P, data.ddiff.P.x(0.4), "acceleration");
                this.labelLine(data.P, data.P.add(data.ddiff.P.x(0.4)), $V([1, 0]), "TEX:$\\vec{a}$");
                this.arrowTo(data.P, data.ddiff.P.x(0.6), "force");
                this.labelLine(data.P, data.P.add(data.ddiff.P.x(-0.6)), $V([1, 0]), "TEX:$\\vec{F}$");
            }
        }
    });

    avb_fp_c = new PrairieDrawAnim("avb-fp-c", function(t) {

        this.addOption("thetaDeg", 45);
        this.addOption("velocity", 30);
        this.addOption("components", true);

	this.setUnits(8, 8 / this.goldenRatio);

        var theta = this.getOption("thetaDeg") / 180 * Math.PI;

        fbdTrans = this.activationSequence("fbd", 0.5, t);
        fbdOffset = fbdTrans * (2 + 2 * Math.sin(theta));
        var drawForces = (fbdTrans == 1);
        
        var velocity = this.getOption("velocity"); // m/s
        var acceleration = Math.pow(velocity, 2) / bus.radius; // m/s^2

        var normal = bus.mass * acceleration * Math.sin(theta) + bus.mass * bus.gravity * Math.cos(theta);
        var friction = - bus.mass * acceleration * Math.cos(theta) + bus.mass * bus.gravity * Math.sin(theta);

        var u = this.vector2DAtAngle(theta);
        var v = this.vector2DAtAngle(theta + Math.PI/2);

        this.translate($V([fbdTrans * 0.5 * Math.sin(theta), -1 + fbdOffset / 4]));

        // ground
        this.save();
        this.translate(v.x(-fbdOffset / 2));
        this.groundHashed($V([0, 0]), v, 10, 0);
        if (drawForces) {
            bus.drawForce(this, $V([0, 0]), u.x(-friction), v.x(-normal));
        }
        this.restore();

        // bus
        this.save();
        this.translate(v.x(fbdOffset / 2));
        var busScale = 0.4;
        var C = v.x(busScale * bus.centerOfMass.e(2));
        this.save();
        this.rotate(this.angleOf(u));
        this.scale($V([busScale, busScale]));
        bus.draw(this);
        this.restore();
        if (drawForces) {
            this.centerOfMass(C);
            if (Math.abs(acceleration) > 1e-5) {
                this.arrowFrom(C, $V([-acceleration, 0]).x(bus.motionScale), "acceleration");
                this.labelLine(C, C.add($V([-acceleration, 0]).x(bus.motionScale)), $V([1,0]), "TEX:$\\vec{a}$");
            }
            bus.drawForce(this, C, $V([0, -bus.mass * bus.gravity]));
            bus.drawForce(this, $V([0, 0]), u.x(friction), v.x(normal));
        }
        this.restore();

    });

    avb_fr_c = new PrairieDrawAnim("avb-fr-c", function(t) {

        this.addOption("thetaDeg", 45);
        this.addOption("velocity", 30);
        this.addOption("components", true);

	this.setUnits(8, 8 / this.goldenRatio);

        var theta = this.getOption("thetaDeg") / 180 * Math.PI;

        fbdTrans = this.activationSequence("fbd", 0.5, t);
        fbdOffset = fbdTrans * (2 + 2 * Math.sin(theta));
        var drawForces = (fbdTrans == 1);

        var velocity = this.getOption("velocity"); // m/s
        var acceleration = Math.pow(velocity, 2) / bus.radius; // m/s^2

        var normal = bus.mass * acceleration * Math.sin(theta) + bus.mass * bus.gravity * Math.cos(theta);
        var friction = - bus.mass * acceleration * Math.cos(theta) + bus.mass * bus.gravity * Math.sin(theta);

        var h = bus.centerOfMass.e(2);
        var dL = bus.centerOfMass.e(1) - bus.leftContact.e(1);
        var dR = bus.rightContact.e(1) - bus.centerOfMass.e(1);
        var normalLeft = normal * dR / (dL + dR) + friction * h / (dL + dR);
        var normalRight = normal * dL / (dL + dR) - friction * h / (dL + dR);

        var frictionLeft = friction / 2;
        var frictionRight = friction / 2;

        var u = this.vector2DAtAngle(theta);
        var v = this.vector2DAtAngle(theta + Math.PI/2);

        this.translate($V([fbdTrans * 0.5 * Math.sin(theta), -1 + fbdOffset / 4]));

        var C = v.x(bus.busScale * bus.centerOfMass.e(2));
        var PL = u.x(bus.busScale * bus.leftContact.e(1));
        var PR = u.x(bus.busScale * bus.rightContact.e(1));

        // ground
        this.save();
        this.translate(v.x(-fbdOffset / 2));
        this.groundHashed($V([0, 0]), v, 10, 0);
        if (drawForces) {
            bus.drawForce(this, PL, u.x(-frictionLeft), v.x(-normalLeft));
            bus.drawForce(this, PR, u.x(-frictionRight), v.x(-normalRight));
        }
        this.restore();

        // bus
        this.save();
        this.translate(v.x(fbdOffset / 2));
        this.save();
        this.rotate(this.angleOf(u));
        this.scale($V([bus.busScale, bus.busScale]));
        bus.draw(this);
        this.restore();
        if (drawForces) {
            this.centerOfMass(C);
            if (Math.abs(acceleration) > 1e-5) {
                this.arrowFrom(C, $V([-acceleration, 0]).x(bus.motionScale), "acceleration");
                this.labelLine(C, C.add($V([-acceleration, 0]).x(bus.motionScale)), $V([1,0]), "TEX:$\\vec{a}$");
            }
            bus.drawForce(this, C, $V([0, -bus.mass * bus.gravity]));
            bus.drawForce(this, PL, u.x(frictionLeft), v.x(normalLeft));
            bus.drawForce(this, PR, u.x(frictionRight), v.x(normalRight));
        }
        this.restore();

    });

    avb_fb_c = new PrairieDrawAnim("avb-fb-c", function(t) {
	this.setUnits(3.5, 3.5);
        this.translate($V([0.1, -bus.height / 2 + 0.15]));
        bus.draw(this);
        this.centerOfMass(bus.centerOfMass);
        var L2 = $V([-bus.width / 2, 0]);
        var L1 = $V([bus.leftContact.e(1), 0]);
        var O = $V([0,0]);
        var R1 = $V([bus.rightContact.e(1), 0]);
        var R2 = $V([bus.width / 2, 0]);
        this.measurement(L2, L1, "TEX:$\\ell_1$");
        this.measurement(L1,  O, "TEX:$\\ell_2$");
        this.measurement( O, R1, "TEX:$\\ell_3$");
        this.measurement(R1, R2, "TEX:$\\ell_4$");
        var Q1 = $V([-bus.totalWidth / 2, 0]);
        var Q2 = $V([-bus.totalWidth / 2, bus.centerOfMass.e(2)]);
        var Q3 = $V([-bus.totalWidth / 2, bus.height]);
        this.measurement(Q2, Q1, "TEX:$h_1$");
        this.measurement(Q3, Q2, "TEX:$h_2$");
    });

    $( window ).on( "resize", function() {
        rep_ff_c.redraw();
        rep_xl_c.redraw();
        rep_xl_f.redraw();
        ava_fp_c.redraw();
        avb_fg_c.redraw();
        avb_fp_c.redraw();
        avb_fr_c.redraw();
        avb_fb_c.redraw();
        afp_ft_c.redraw();
        afp_ff_c.redraw();
    } );
}); // end of document.ready()
