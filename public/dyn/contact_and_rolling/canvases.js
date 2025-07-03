
$(document).ready(function() {

    rko_fr_c = new PrairieDrawAnim("rko-fr-c", function(t) {

        var figureWidth = 6;

        this.setUnits(figureWidth, 4);

        this.addOption("showLabels", true);
        this.addOption("movement", "smallFlat");
        this.addOption("showCVel", false);
        this.addOption("showCAcc", false);
        this.addOption("showAngVel", false);
        this.addOption("showAngAcc", false);
        this.addOption("velField", "none");
        this.addOption("accField", "none");
        this.addOption("showInstRot", false);
        this.addOption("showCPath", false);
        this.addOption("showPPath", false);
        this.addOption("showVelField", false);
        this.addOption("showAccField", false);

        var O = $V([0, 0]);
        var i;

        var label = this.getOption("showLabels") ? true : undefined;

        var f;
        if (this.getOption("movement") === "smallFlat") {

            this.ground($V([0, -0.6]), $V([0, 1]), figureWidth * 1.2);

            f = function(t) {
                var radius = 0.6;
                var omega = 0.5;
                var v = radius * omega;
                var rollPeriod = 2 * Math.PI / omega;
                var wavelength = v * rollPeriod;
                var minPathWidth = wavelength + 2 * radius;
                var nPeriod = Math.ceil(minPathWidth / wavelength);
                var pathPeriod = nPeriod * rollPeriod;
                var pathWidth = nPeriod * wavelength;
                return {
                    radius: radius,
                    nr: 3,
                    theta: -omega * t,
                    rC: $V([this.intervalMod(v * t, -pathWidth / 2, pathWidth / 2), 0]),
                    pathStart: -pathPeriod / 2 + 1e-8,
                    pathPeriod: pathPeriod - 2e-8,
                    closePath: false,
                    timeScale: 1,
                };
            };
        } else if (this.getOption("movement") === "bigFlat") {

            this.ground($V([0, -1.5]), $V([0, 1]), figureWidth * 1.2);

            f = function(t) {
                var radius = 1.5;
                var omega = 0.5;
                var v = radius * omega;
                var rollPeriod = 2 * Math.PI / omega;
                var wavelength = v * rollPeriod;
                var minPathWidth = figureWidth + 2 * radius;
                var nPeriod = Math.ceil(minPathWidth / wavelength);
                var pathPeriod = nPeriod * rollPeriod;
                var pathWidth = nPeriod * wavelength;
                return {
                    radius: radius,
                    nr: 3,
                    theta: -omega * t,
                    rC: $V([this.intervalMod(v * t, -pathWidth / 2, pathWidth / 2), 0]),
                    pathStart: -pathPeriod / 2 + 1e-8,
                    pathPeriod: pathPeriod - 2e-8,
                    closePath: false,
                    timeScale: 1,
                };
            };
        } else if (this.getOption("movement") === "rock") {

            this.ground($V([0, -1]), $V([0, 1]), figureWidth * 1.2);

            f = function(t) {
                var radius = 1;
                var theta = -Math.sin(t);
                return {
                    radius: radius,
                    nr: 3,
                    theta: theta,
                    rC: $V([-radius * theta, 0]),
                    pathStart: 0,
                    pathPeriod: 2 * Math.PI,
                    closePath: true,
                    timeScale: 0.5,
                };
            };
        } else if (this.getOption("movement") === "in-2-circle") {

            var radius = 0.9;
            var pathRadius = 1.8;
            var centerRadius = pathRadius - radius;

            this.arcGround(O, pathRadius);

            f = function(t) {
                var theta = -t / 2;
                var pathTheta = -radius / centerRadius * theta;
                return {
                    radius: radius,
                    nr: 3,
                    theta: theta,
                    rC: $V([0, -1]).rotate(pathTheta, O).x(centerRadius),
                    pathStart: 0,
                    pathPeriod: 8 * Math.PI,
                    closePath: true,
                    timeScale: 1,
                };
            };
        } else if (this.getOption("movement") === "in-3-circle") {

            var radius = 0.6;
            var pathRadius = 1.8;
            var centerRadius = pathRadius - radius;

            this.arcGround(O, pathRadius);

            f = function(t) {
                var theta = -t / 2;
                var pathTheta = -radius / centerRadius * theta;
                return {
                    radius: radius,
                    nr: 3,
                    theta: theta,
                    rC: $V([0, -1]).rotate(pathTheta, O).x(centerRadius),
                    pathStart: 0,
                    pathPeriod: 8 * Math.PI,
                    closePath: true,
                    timeScale: 1,
                };
            };
        } else if (this.getOption("movement") === "in-rock") {

            var pathCenter = $V([0, 1.5]);
            var radius = 1;
            var pathRadius = 3;
            var centerRadius = pathRadius - radius;

            this.arcGround(pathCenter, pathRadius, -Math.PI / 2 - 1.2, -Math.PI / 2 + 1.2);

            f = function(t) {
                var theta = -Math.sin(t);
                var pathTheta = -radius / centerRadius * theta;
                return {
                    radius: radius,
                    nr: 3,
                    theta: theta,
                    rC: $V([0, -1]).rotate(pathTheta, O).x(centerRadius).add(pathCenter),
                    pathStart: 0,
                    pathPeriod: 2 * Math.PI,
                    closePath: true,
                    timeScale: 0.5,
                };
            };
        } else if (this.getOption("movement") === "out-1-circle") {

            var radius = 0.6;
            var pathRadius = 0.6;
            var centerRadius = pathRadius + radius;

            this.arcGround(O, pathRadius, undefined, undefined, false);

            f = function(t) {
                var theta = t / 2;
                var pathTheta = radius / centerRadius * theta + Math.PI;
                return {
                    radius: radius,
                    nr: 3,
                    theta: theta,
                    rC: $V([0, -1]).rotate(pathTheta, O).x(centerRadius),
                    pathStart: 0,
                    pathPeriod: 8 * Math.PI,
                    closePath: true,
                    timeScale: 1,
                };
            };
        } else if (this.getOption("movement") === "out-2-circle") {

            var radius = 0.45;
            var pathRadius = 0.9;
            var centerRadius = pathRadius + radius;

            this.arcGround(O, pathRadius, undefined, undefined, false);

            f = function(t) {
                var theta = t / 2;
                var pathTheta = radius / centerRadius * theta + Math.PI;
                return {
                    radius: radius,
                    nr: 3,
                    theta: theta,
                    rC: $V([0, -1]).rotate(pathTheta, O).x(centerRadius),
                    pathStart: 0,
                    pathPeriod: 12 * Math.PI,
                    closePath: true,
                    timeScale: 1,
                };
            };
        } else if (this.getOption("movement") === "out-rock") {

            var pathCenter = $V([0, -4]);
            var radius = 1;
            var pathRadius = 3;
            var centerRadius = pathRadius + radius;

            this.arcGround(pathCenter, pathRadius, Math.PI / 2 - 1.2, Math.PI / 2 + 1.2, false);

            f = function(t) {
                var theta = Math.sin(t);
                var pathTheta = radius / centerRadius * theta + Math.PI;
                return {
                    radius: radius,
                    nr: 3,
                    theta: theta,
                    rC: $V([0, -1]).rotate(pathTheta, O).x(centerRadius).add(pathCenter),
                    pathStart: 0,
                    pathPeriod: 2 * Math.PI,
                    closePath: true,
                    timeScale: 0.5,
                };
            };
        }
        f = f.bind(this);

        var val = this.numDiff(f, t);
        var radius = val.radius;
        var nr = val.nr;
        var pathStart = val.pathStart;
        var pathPeriod = val.pathPeriod;
        var closePath = val.closePath;
        var timeScale = val.timeScale;

        var theta = val.theta;
        var omega = val.diff.theta;
        var alpha = val.ddiff.theta;

        var rC = val.rC;
        var vC = val.diff.rC;
        var aC = val.ddiff.rC;

        var e1 = $V([1, 0]).rotate(theta, O);
        var e2 = $V([0, 1]).rotate(theta, O);

        var iPShow = 0;

        var Ps = [];
        var nTh, r, th;
        var deltaR = radius / nr;
        for (var ir = 1; ir <= nr; ir++) {
            r = ir / nr * radius;
            nTh = Math.round(2 * Math.PI * r / deltaR);
            for (var iTh = 0; iTh < nTh; iTh++) {
                th = Math.PI / 2 + theta + iTh / nTh * 2 * Math.PI;
                Ps.push(rC.add($V([r * Math.cos(th), r * Math.sin(th)])));
                if (ir < nr) {
                    iPShow++;
                }
            }
        }

        var rCM = this.cross2D(omega, vC).x(1 / (omega * omega));
        var rM = rC.add(rCM);

        var fCP = function(t) {
            var val = f(t);
            var theta = val.theta;
            var rC = val.rC;
            var e1 = $V([1, 0]).rotate(theta, O);
            var e2 = $V([0, 1]).rotate(theta, O);
            var rP = rC.add(e2.x(radius));
            return [rC, rP];
        };

        var nPath = 150;

        var PPath = [], CPath = [];
        for (var i = 0; i < nPath; i++) {
            var tau = i / nPath * pathPeriod + pathStart;
            var rCrP = fCP(tau);
            CPath.push(rCrP[0]);
            PPath.push(rCrP[1]);
        }

        var rCrP = this.numDiff(fCP, t);
        var rC = rCrP[0];

        if (this.getOption("showCPath")) {
            this.save();
            this.setProp("shapeOutlineColor", "rgb(150, 150, 150)");
            this.polyLine(CPath, closePath, false);
            this.restore();
        }

        if (this.getOption("showPPath")) {
            this.save();
            this.setProp("shapeOutlineColor", "rgb(200, 200, 200)");
            this.polyLine(PPath, closePath, false);
            this.restore();
        }

        if (this.getOption("showInstRot")) {
            Ps.forEach(function(P) {
                this.save();
                this.setProp("shapeOutlineColor", "rgb(255, 200, 255)");
                this.line(rM, P);
                this.restore();
            }, this);

            if (this.getOption("velField") === "total") {
                Ps.forEach(function(P, i) {
                    if (this.getOption("showVelField") || i === iPShow) {
                        var CP = P.subtract(rC);
                        var PVR = this.cross2D(omega, CP);
                        var PV = vC.add(PVR);
                        this.rightAngleImproved(P, rM, P.add(PV.x(timeScale)));
                    }
                }, this);
            }

            this.point(rM);
            this.labelIntersection(rM, [rC], label && "TEX:$M$");
        }

        this.arc(rC, radius);

        this.save();
        this.setProp("pointRadiusPx", 4);
        this.point(rC);
        this.restore();
        this.labelIntersection(rC, [rC.add(e1), rC.add(e2)], label && "TEX:$C$");
        if (this.getOption("showCVel")) {
            this.arrow(rC, rC.add(vC.x(timeScale)), "velocity");
            this.labelLine(rC, rC.add(vC.x(timeScale)), $V([1, 0]), label && "TEX:$\\vec{v}_C$");
        }
        if (this.getOption("showCAcc")) {
            this.arrow(rC, rC.add(aC.x(timeScale * timeScale)), "acceleration");
            this.labelLine(rC, rC.add(aC.x(timeScale * timeScale)), $V([1, 0]), label && "TEX:$\\vec{a}_C$");
        }
        var omegaLabel = (omega >= 0) ? "TEX:$\\omega$" : "TEX:$-\\omega$";
        var alphaLabel = (alpha >= 0) ? "TEX:$\\alpha$" : "TEX:$-\\alpha$";
        if (this.getOption("showAngVel")) {
            this.circleArrow(rC, radius + 0.15, theta - 3 * omega / 3.75, theta + 3 * omega / 3.75, "angVel", 0.1);
            this.labelCircleLine(rC, radius + 0.15, theta - 3 * omega / 3.75, theta + 3 * omega / 3.75, $V([0, 1]), label && omegaLabel);
        }
        if (this.getOption("showAngAcc")) {
            this.circleArrow(rC, radius + 0.15, Math.PI + theta - 3 * alpha / 3.75, Math.PI + theta + 3 * alpha / 3.75, "angAcc", 0.1);
            this.labelCircleLine(rC, radius + 0.15, Math.PI + theta - 3 * alpha / 3.75, Math.PI + theta + 3 * alpha / 3.75, $V([0, 1]), label && alphaLabel);
        }

        this.labelIntersection(Ps[iPShow], [rC], label && "TEX:$P$");

        Ps.forEach(function(P, i) {
            var rCP = P.subtract(rC);
            var vPR = this.cross2D(omega, rCP);
            var vP = vC.add(vPR);
            var aPR = this.cross2D(alpha, rCP);
            var aPC = this.cross2D(omega, vPR);
            var aP = aC.add(aPR).add(aPC);
            this.point(P);
            pLabel = (i == iPShow) ? label : undefined;
            if (this.getOption("showVelField") || i === iPShow) {
                if (this.getOption("velField") === "base") {
                    this.arrow(P, P.add(vC.x(timeScale)), "velocity");
                    this.labelLine(P, P.add(vC.x(timeScale)), $V([1, 0]), pLabel && "TEX:$\\vec{v}_C$");
                } else if (this.getOption("velField") === "omega") {
                    this.arrow(P, P.add(vPR.x(timeScale)), "velocity");
                    this.labelLine(P, P.add(vPR.x(timeScale)), $V([1, 0]), pLabel && "TEX:$\\vec{\\omega} \\times \\vec{r}_{CP}$");
                } else if (this.getOption("velField") === "total") {
                    this.arrow(P, P.add(vP.x(timeScale)), "velocity");
                    this.labelLine(P, P.add(vP.x(timeScale)), $V([1, 0]), pLabel && "TEX:$\\vec{v}_P$");
                }
            }
            if (this.getOption("showAccField") || i === iPShow) {
                if (this.getOption("accField") === "base") {
                    this.arrow(P, P.add(aC.x(timeScale * timeScale)), "acceleration");
                    this.labelLine(P, P.add(aC.x(timeScale * timeScale)), $V([1, 0]), pLabel && "TEX:$\\vec{a}_C$");
                } else if (this.getOption("accField") === "alpha") {
                    this.arrow(P, P.add(aPR.x(timeScale * timeScale)), "acceleration");
                    this.labelLine(P, P.add(aPR.x(timeScale * timeScale)), $V([1, 0]), pLabel && "TEX:$\\vec{\\alpha} \\times \\vec{r}_{CP}$");
                } else if (this.getOption("accField") === "cent") {
                    this.arrow(P, P.add(aPC.x(timeScale * timeScale)), "acceleration");
                    this.labelLine(P, P.add(aPC.x(timeScale * timeScale)), $V([1, 0]), pLabel && "TEX:$\\vec{\\omega} \\times (\\vec{\\omega} \\times \\vec{r}_{CP})$");
                } else if (this.getOption("accField") === "total") {
                    this.arrow(P, P.add(aP.x(timeScale * timeScale)), "acceleration");
                    this.labelLine(P, P.add(aP.x(timeScale * timeScale)), $V([1, 0]), pLabel && "TEX:$\\vec{a}_P$");
                }
            }
        }, this);
    });

    rko_ff_c = new PrairieDrawAnim("rko-ff-c", function(t) {

        this.setUnits(6, 4);

        this.addOption("reversed", false);
        this.addOption("showPaths", false);

        var O = $V([0, 0]);

        var r = 1;
        var offsetTheta = 7 * Math.PI / 8;
        var offset = r * offsetTheta;

        var et = this.getOption("reversed") ? $V([-0.5, 0]) : $V([0.5, 0]);
        var en = $V([0, 0.5]);
        var basisO = this.getOption("reversed") ? $V([offset, 0]) : $V([0, 0]);

        var C1 = $V([0, r]);
        var C2 = $V([offset, r]);
        var contact1 = $V([0, 0]);
        var contact2 = $V([offset, 0]);
        var A1 = $V([0, -r]).add(C1);
        var A2 = $V([0, -r]).rotate(-offsetTheta, O).add(C2);
        var B1 = $V([0, -r]).rotate(offsetTheta, O).add(C1);
        var B2 = $V([0, -r]).rotate(offsetTheta, O).rotate(-offsetTheta, O).add(C2);

        var vC = this.getOption("reversed") ? $V([-2 * r / 3, 0]) : $V([2 * r / 3, 0]);

        var nPaths = 9;
        var paths = [];
        var nPoints = 30;
        for (var iPath = 0; iPath < nPaths; iPath++) {
            var path = [];
            for (var iPoint = 0; iPoint < nPoints; iPoint++) {
                var pointTheta = iPoint / (nPoints - 1) * offsetTheta;
                var pointOffset = pointTheta * r;
                var pointPos = $V([0, -r]).rotate(iPath / (nPaths - 1) * offsetTheta, O).rotate(-pointTheta, O).add($V([pointOffset, r]));
                path.push(pointPos);
            }
            paths.push(path);
        }

        var states = [{theta: 0}, {theta: offsetTheta}, {theta: 0}];
        var transTimes = [3, 0, 0];
        var holdTimes = [0, 0.2, 0];
        var interps = [];
        var names = ["left", "right"];
        var state = this.newSequence("roll", states, transTimes, holdTimes, interps, names, t);
        var rollTheta = state.theta;

        this.translate($V([-offset / 2, -r]));

        if (this.getOption("showPaths")) {
            this.save();
            this.setProp("shapeOutlineColor", this.getProp("gridColor"));
            for (iPath = 0; iPath < nPaths; iPath++) {
                this.polyLine(paths[iPath], false, false);
            }
            this.restore();
            for (iPath = 1; iPath < nPaths - 1; iPath++) {
                this.point(paths[iPath][0]);
                this.point(paths[iPath][paths[iPath].length - 1]);
            }
        }

        this.ground(O, $V([0, 1]), 12);

        this.line(C1, A1, "grid");
        this.line(C1, B1, "grid");
        this.circle(C1, r, false);
        if (this.getOption("reversed")) {
            this.circleArrow(C1, r / 3, -Math.PI / 2, -Math.PI / 2 + offsetTheta, "angle", true);
            this.labelCircleLine(C1, r / 3, -Math.PI / 2, -Math.PI / 2 + offsetTheta, $V([0, 1]), "TEX:$\\theta$", true);
        } else {
            this.circleArrow(C1, r / 3, -Math.PI / 2 + offsetTheta, -Math.PI / 2, "angle", true);
            this.labelCircleLine(C1, r / 3, -Math.PI / 2 + offsetTheta, -Math.PI / 2, $V([0.3, 1]), "TEX:$\\theta$", true);
        }
        this.arrow(C1, C1.add(vC), "velocity");
        this.labelLine(C1, C1.add(vC), $V([1, -1]), "TEX:$\\vec{v}_C$");
        this.point(C1);
        this.text(C1, $V([1, -1]), "TEX:$C$");
        this.save();
        this.setProp("shapeStrokeWidthPx", 3);
        this.setProp("shapeOutlineColor", "red");
        this.arc(C1, r, -Math.PI / 2, -Math.PI / 2 + offsetTheta, false);
        this.restore();
        if (this.getOption("reversed")) {
            this.circleArrow(C1, r + 0.1, 1.8, 2.8, "angVel", true, 0.1);
            this.circleArrow(C1, r + 0.4, 1.8, 2.8, "angAcc", true, 0.1);
        } else {
            this.circleArrow(C1, r + 0.1, 2.8, 1.8, "angVel", true, 0.1);
            this.circleArrow(C1, r + 0.4, 2.8, 1.8, "angAcc", true, 0.1);
        }
        this.labelCircleLine(C1, r + 0.1, 2.8, 1.8, $V([0, 1]), "TEX:$\\omega$", true);
        this.labelCircleLine(C1, r + 0.4, 2.8, 1.8, $V([0, 1]), "TEX:$\\alpha$", true);
        for (iPath = 0; iPath < nPaths; iPath++) {
            pointPos = $V([0, -r]).rotate(iPath / (nPaths - 1) * offsetTheta, O).add($V([0, r]));
            this.point(pointPos);
        }

        this.line(C2, A2, "grid");
        this.line(C2, B2, "grid");
        this.circle(C2, r, false);
        if (this.getOption("reversed")) {
            this.circleArrow(C2, r / 3, -Math.PI / 2 - offsetTheta, -Math.PI / 2, "angle", true);
            this.labelCircleLine(C2, r / 3, -Math.PI / 2 - offsetTheta, -Math.PI / 2, $V([0.3, 1]), "TEX:$\\theta$", true);
        } else {
            this.circleArrow(C2, r / 3, -Math.PI / 2, -Math.PI / 2 - offsetTheta, "angle", true);
            this.labelCircleLine(C2, r / 3, -Math.PI / 2, -Math.PI / 2 - offsetTheta, $V([0, 1]), "TEX:$\\theta$", true);
        }
        this.arrow(C2, C2.add(vC), "velocity");
        this.labelLine(C2, C2.add(vC), $V([1, -1]), "TEX:$\\vec{v}_C$");
        this.point(C2);
        this.text(C2, $V([-1, -1]), "TEX:$C$");
        this.save();
        this.setProp("shapeStrokeWidthPx", 3);
        this.setProp("shapeOutlineColor", "red");
        this.arc(C2, r, -Math.PI / 2 - offsetTheta, -Math.PI / 2, false);
        this.restore();
        if (this.getOption("reversed")) {
            this.circleArrow(C2, r + 0.1, Math.PI - 2.8, Math.PI - 1.8, "angVel", true, 0.1);
            this.circleArrow(C2, r + 0.4, Math.PI - 2.8, Math.PI - 1.8, "angAcc", true, 0.1);
        } else {
            this.circleArrow(C2, r + 0.1, Math.PI - 1.8, Math.PI - 2.8, "angVel", true, 0.1);
            this.circleArrow(C2, r + 0.4, Math.PI - 1.8, Math.PI - 2.8, "angAcc", true, 0.1);
        }
        this.labelCircleLine(C2, r + 0.1, Math.PI - 1.8, Math.PI - 2.8, $V([0, 1]), "TEX:$\\omega$", true);
        this.labelCircleLine(C2, r + 0.4, Math.PI - 1.8, Math.PI - 2.8, $V([0, 1]), "TEX:$\\alpha$", true);
        for (iPath = 0; iPath < nPaths; iPath++) {
            pointPos = $V([0, -r]).rotate(iPath / (nPaths - 1) * offsetTheta, O).rotate(-offsetTheta, O).add($V([offsetTheta, r]));
            this.point(pointPos);
        }

        if (this.getOption("reversed")) {
            this.arrow($V([offset, -0.3]), $V([0, -0.3]), "position");
        } else {
            this.arrow($V([0, -0.3]), $V([offset, -0.3]), "position");
        }
        this.labelLine($V([0, -0.3]), $V([offset, -0.3]), $V([0, -1]), "TEX:$s$");

        this.save();
        this.setProp("shapeStrokeWidthPx", 3);
        this.setProp("shapeOutlineColor", "red");
        this.line(contact1, contact2);
        this.restore();

        this.point(A1);
        this.labelIntersection(A1, [C1], "TEX:$A$");
        this.point(A2);
        this.labelIntersection(A2, [C2], "TEX:$A$");

        this.point(B1);
        this.labelIntersection(B1, [C1], "TEX:$B$");
        this.point(B2);
        this.labelIntersection(B2, [C2], "TEX:$B$");

        if (this.getOption("reversed")) {
            rollTheta = offsetTheta - rollTheta;
        }
        var rollOffset = rollTheta * r;
        var rollC = C1.add($V([rollOffset, 0]));
        var rollA = A1.subtract(C1).rotate(-rollTheta, O).add(rollC);
        var rollB = B1.subtract(C1).rotate(-rollTheta, O).add(rollC);
        if (state.inTransition) {
            this.line(rollC, rollA);
            this.line(rollC, rollB);
            this.circle(rollC, r, false);
            this.save();
            this.setProp("shapeStrokeWidthPx", 3);
            this.setProp("shapeOutlineColor", "red");
            this.arc(rollC, r, -Math.PI / 2 - rollTheta, -Math.PI / 2 + offsetTheta - rollTheta, false);
            this.restore();
            for (iPath = 0; iPath < nPaths; iPath++) {
                pointPos = $V([0, -r]).rotate(iPath / (nPaths - 1) * offsetTheta, O).rotate(-rollTheta, O).add($V([rollOffset, r]));
                this.point(pointPos);
            }
        }

        this.arrow(basisO, basisO.add(et));
        this.arrow(basisO, basisO.add(en));
        if (this.getOption("reversed")) {
            this.labelLine(basisO, basisO.add(et), $V([0.6, 1.3]), "TEX:$\\hat{e}_t$");
            this.labelLine(basisO, basisO.add(en), $V([0.6, -1.3]), "TEX:$\\hat{e}_n$");
        } else {
            this.labelLine(basisO, basisO.add(et), $V([0.6, -1.3]), "TEX:$\\hat{e}_t$");
            this.labelLine(basisO, basisO.add(en), $V([0.6, 1.3]), "TEX:$\\hat{e}_n$");
        }
    });

    var rko_fc_c = new PrairieDraw("rko-fc-c", function() {

        this.setUnits(12, 8);

        this.addOption("reversed", false);

        var O = $V([0, 0]);
        var r = 1.7;
        var rho = 4;

        this.save();
        this.translate($V([-2.5, 0.6]));
        var C = $V([0, -rho + r]);
        var M = $V([0, -rho]);
        var rhoEnd = M.rotate(-Math.PI / 3.2, O);
        var rEnd = $V([r, 0]).rotate(Math.PI / 2 - Math.PI / 3.2, O).add(C);
        var I = this.getOption("reversed") ? $V([-1, 0]) : $V([1, 0]);
        var J = $V([0, 1]);
        var vC = this.getOption("reversed") ? $V([-1, 0]) : $V([1, 0]);
        this.line(O, rhoEnd, "grid");
        this.labelLine(O, rhoEnd, $V([0, -1]), "TEX:$\\rho$");
        this.line(C, rEnd, "grid");
        this.labelLine(C, rEnd, $V([0, 1]), "TEX:$r$");
        this.line(O, C, "grid");
        this.labelLine(O, C, $V([0, 1]), "TEX:$R$");
        this.arrow(C, C.add(vC), "velocity");
        this.labelLine(C, C.add(vC), $V([1,-1]), "TEX:$\\vec{v}_C$")
        this.arcGround(O, rho, -Math.PI / 2 - 1.2, -Math.PI / 2 + 0.6);
        this.arc(C, r);
        this.point(C);
        var CLabelPos = this.getOption("reversed") ? $V([-1, 1]) : $V([1, 0]);
        this.text(C, CLabelPos, "TEX:$C$");
        this.point(O);
        this.text(O, $V([0,-1]), "TEX:$O$");
        this.point(M);
        var MLabelPos = this.getOption("reversed") ? $V([1, 1]) : $V([-1, 1]);
        this.text(M, MLabelPos, "TEX:$M$");
        var PLabelPos = this.getOption("reversed") ? $V([-1, -1]) : $V([1, -1]);
        this.text(M, PLabelPos, "TEX:$P$");
        this.arrow(M, M.add(I));
        this.arrow(M, M.add(J));
        var ILabelPos = this.getOption("reversed") ? $V([1, 1]) : $V([1, -1]);
        this.labelLine(M, M.add(I), ILabelPos, "TEX:$\\hat{I}$");
        this.labelLine(M, M.add(J), $V([1, 1]), "TEX:$\\hat{J}$");
        if (this.getOption("reversed")) {
            this.circleArrow(C, r + 0.2, 0.1, 0.8, "angVel", true, 0.1);
            this.circleArrow(C, r + 0.8, 0.1, 0.8, "angAcc", true, 0.1);
        } else {
            this.circleArrow(C, r + 0.2, 0.8, 0.1, "angVel", true, 0.1);
            this.circleArrow(C, r + 0.8, 0.8, 0.1, "angAcc", true, 0.1);
        }
        this.labelCircleLine(C, r + 0.2, 0.1, 0.8, $V([0, 1]), "TEX:$\\omega$");
        this.labelCircleLine(C, r + 0.8, 0.1, 0.8, $V([0, 1]), "TEX:$\\alpha$");
        if (this.getOption("reversed")) {
            this.circleArrow(O, rho + 0.3, -Math.PI / 2 + 0.5, -Math.PI / 2, "position", true, 0.1);
            this.labelCircleLine(O, rho + 0.3, -Math.PI / 2 + 0.5, -Math.PI / 2, $V([0, 1]), "TEX:$s$");
        } else {
            this.circleArrow(O, rho + 0.3, -Math.PI / 2 - 0.7, -Math.PI / 2, "position", true, 0.1);
            this.labelCircleLine(O, rho + 0.3, -Math.PI / 2 - 0.7, -Math.PI / 2, $V([0, 1]), "TEX:$s$");
        }
        this.restore();

        this.save();
        this.translate($V([3, -3.7]));
        var C = $V([0, rho + r]);
        var M = $V([0, rho]);
        var rhoEnd = M.rotate(-Math.PI / 6, O);
        var rEnd = $V([r, 0]).rotate(Math.PI / 2 - Math.PI / 3.2, O).add(C);
        var I = this.getOption("reversed") ? $V([-1, 0]) : $V([1, 0]);
        var J = $V([0, 1]);
        var vC = this.getOption("reversed") ? $V([-1, 0]) : $V([1, 0]);
        this.line(O, rhoEnd, "grid");
        this.labelLine(O, rhoEnd, $V([0, 1]), "TEX:$\\rho$");
        this.line(C, rEnd, "grid");
        this.labelLine(C, rEnd, $V([0, 1]), "TEX:$r$");
        this.line(O, C, "grid");
        this.labelLine(O, C, $V([-0.3, 1.1]), "TEX:$R$");
        this.arrow(C, C.add(vC), "velocity");
        this.labelLine(C, C.add(vC), $V([1,-1]), "TEX:$\\vec{v}_C$")
        this.arcGround(O, rho, Math.PI / 2 - 1.2, Math.PI / 2 + 0.6, false);
        this.arc(C, r);
        this.point(C);
        var CLabelPos = this.getOption("reversed") ? $V([-1, 1]) : $V([1, -1]);
        this.text(C, CLabelPos, "TEX:$C$");
        this.point(O);
        this.text(O, $V([1,0]), "TEX:$O$");
        this.point(M);
        var PLabelPos = this.getOption("reversed") ? $V([-1, -1]) : $V([1, -1]);
        this.text(M, PLabelPos, "TEX:$P$");
        var MLabelPos = this.getOption("reversed") ? $V([1, 1]) : $V([-1, 1]);
        this.text(M, MLabelPos, "TEX:$M$");
        this.arrow(M, M.add(I));
        this.arrow(M, M.add(J));
        this.labelLine(M, M.add(I), $V([1, 0.3]), "TEX:$\\hat{I}$");
        this.labelLine(M, M.add(J), $V([0.7, -1.3]), "TEX:$\\hat{J}$");
        if (this.getOption("reversed")) {
            this.circleArrow(C, r + 0.2, 0.1, 0.8, "angVel", true, 0.1);
            this.circleArrow(C, r + 0.8, 0.1, 0.8, "angAcc", true, 0.1);
        } else {
            this.circleArrow(C, r + 0.2, 0.8, 0.1, "angVel", true, 0.1);
            this.circleArrow(C, r + 0.8, 0.8, 0.1, "angAcc", true, 0.1);
        }
        this.labelCircleLine(C, r + 0.2, 0.1, 0.8, $V([0, 1]), "TEX:$\\omega$");
        this.labelCircleLine(C, r + 0.8, 0.1, 0.8, $V([0, 1]), "TEX:$\\alpha$");
        if (this.getOption("reversed")) {
            this.circleArrow(O, rho - 0.3, Math.PI / 2 - 0.7, Math.PI / 2, "position", true, 0.1);
            this.labelCircleLine(O, rho - 0.3, Math.PI / 2 - 0.7, Math.PI / 2, $V([0, -1]), "TEX:$s$");
        } else {
            this.circleArrow(O, rho - 0.3, Math.PI / 2 + 0.5, Math.PI / 2, "position", true, 0.1);
            this.labelCircleLine(O, rho - 0.3, Math.PI / 2 + 0.5, Math.PI / 2, $V([0, -1]), "TEX:$s$");
        }
        this.restore();
    });


    $( window ).on( "resize", function() {
        rko_fr_c.redraw();
        rko_ff_c.redraw();
        rko_fc_c.redraw();
    })
}); // end of document.ready()
