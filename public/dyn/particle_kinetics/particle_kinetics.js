

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

    var afp_ff_c = new PrairieDraw("afp-ff-c", function(t) {
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

    var afp_ft_c = new PrairieDraw("afp-ft-c", function() {
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
    var rep_ff_c = new PrairieDrawAnim("rep-ff-c", function(t) {

        var xViewMax = 3;
        var yViewMax = 2;
        var xWorldMax = xViewMax * 1.1;
        var yWorldMax = yViewMax * 1.1;

        this.setUnits(2 * xViewMax, 2 * yViewMax);

        this.addOption("r", $V([0, 0]));
        this.addOption("v", $V([1, 0]));

        this.addOption("showLabels", true);
        this.addOption("showPath", true);

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

    new PrairieDrawAnim("ava-fp-c", function(t) {
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
}); // end of document.ready()