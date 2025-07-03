$(document).ready(function(){
    rkg_fw_c = new PrairieDrawAnim("rkg-fw-c", function(t) {
        this.setUnits(3, 3 / this.goldenRatio);

        var height = 3 / this.goldenRatio;
        var width = 3;

        var frequency = 2;

        this.translate($V([-1.2, -0.7]));

        this.setProp("shapeOutlineColor", "rgb(230, 230, 230)");
        
        // /// VERTICAL LINES
        // for (let i = 0; i < width*frequency; i++){
        //     this.line($V([i/frequency, -height]), $V([i/frequency, height]));
        // }
        
        // /// HORIZONTAL LINES
        // for (let i = 0; i < height*frequency; i++){
        //     this.line($V([-width, i/frequency]), $V([width, i/frequency]));
        // }
        
        this.setProp("shapeOutlineColor", "rgb(0, 0, 0)");

        this.addOption("showAngles", false);
        this.addOption("showAngVels", false);

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        this.arrow(O, ei);
        this.arrow(O, ej);
        this.text(O, $V([1, 1]), "TEX:$O$");
        this.labelLine(O, ei, $V([1, -1]), "TEX:$\\hat{\\imath}$");
        this.labelLine(O, ej, $V([1, 1]), "TEX:$\\hat{\\jmath}$");

        var omega1 = 0.4;
        var omega2 = 0.2;

        var theta1 = omega1 * t;
        var theta2 = omega2 * t;

        var rP1 = $V([0.7, 0.7]);
        var rP1Q1rel = $V([-0.35, -0.2]);
        var rQ1 = rP1.add(rP1Q1rel.rotate(theta1, $V([0, 0])));

        var rP2 = $V([2, 0.7 + 0.3 * Math.sin(t)]);
        var rP2Q2rel = $V([-0.2, 0]);
        var rQ2 = rP2.add(rP2Q2rel.rotate(theta2, $V([0, 0])));
        var rP2Q3rel = $V([0.2, 0]);
        var rQ3 = rP2.add(rP2Q3rel.rotate(theta2, $V([0, 0])));

        var ra = 0.15;
        var rc = 0.15;
        var rw = 0.32;

        var drawAxes = function(p, theta, label) {
            this.save();
            this.translate(p);
            this.save();
            this.rotate(theta);
            this.polyLine([ei.x(ra), O, ej.x(ra)]);
            this.restore();
            if (this.getOption("showAngles")) {
                this.save();
                this.setProp("shapeStrokePattern", "dashed");
                this.line(O, ei.x(2 * ra));
                this.restore();
                var modTheta = this.fixedMod(theta, 2 * Math.PI);
                this.circleArrow(O, rc, 0, modTheta, "angle", true);
                this.labelCircleLine(O, rc, 0, modTheta, $V([0, 1]), label, true);
            }
            this.restore();
        }.bind(this);

        var drawOmega = function(p, theta, omega, label) {
            this.save();
            this.translate(p);
            var a1 = theta + Math.PI / 2 - 3 * omega;
            var a2 = theta + Math.PI / 2 + 3 * omega;
            this.circleArrow(O, rw, a1, a2, "angVel", true);
            this.labelCircleLine(O, rw, a1, a2, $V([0, 1]), label, true);
            this.restore();
        }.bind(this);
        this.setProp("shapeInsideColor", "#FFF1DB");

        this.save();
        this.translate(rP1);
        this.rotate(theta1);
        this.rectangle(0.8, 0.8 / this.goldenRatio, O, 0, true);
        this.text($V([0.33, -0.18]), $V([0, 0]), "TEX:$\\mathcal{B}_1$");
        this.restore();

        this.save();
        this.translate(rP2);
        this.rotate(theta2);
        this.rectangle(0.8, 0.8 / this.goldenRatio, O, 0, true);
        this.text($V([0.33, -0.18]), $V([0, 0]), "TEX:$\\mathcal{B}_2$");
        this.restore();

        this.setProp("shapeInsideColor", "rgb(255, 255, 255)");

        drawAxes(rP1, theta1, "TEX:$\\theta_1$");
        drawAxes(rQ1, theta1, "TEX:$\\theta_1$");
        drawAxes(rQ2, theta2, "TEX:$\\theta_2$");
        drawAxes(rQ3, theta2, "TEX:$\\theta_2$");

        if (this.getOption("showAngVels")) {
            drawOmega(rP1, theta1, omega1, "TEX:$\\omega_1$");
            drawOmega(rP2, theta2, omega2, "TEX:$\\omega_2$");
        }
    });

    rkg_fr_c = new PrairieDraw("rkg-fr-c", function() {
        this.setUnits(3, 3 / this.goldenRatio);

        this.addOption("showType", "none");

        this.translate($V([-1.2, -0.7]));

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);
        var rP = $V([1.5, 0.4]);
        var rQ = $V([1.7, 1.2]);
        var vP = $V([0.3, -0.2]);
        var omega = 0.8;
        var rPQ = rQ.subtract(rP);
        var vQRel = this.perp(rPQ).x(omega);
        var vQ = vP.add(vQRel);
        var alpha = 1.1;
        var aP = $V([0.6, 0.2]);
        var aQAlpha = this.perp(rPQ).x(alpha);
        var aQCent = rPQ.x(-omega * omega);
        var aQ = aP.add(aQAlpha).add(aQCent);

        this.arrow(O, ei);
        this.arrow(O, ej);
        this.text(O, $V([1, 1]), "TEX:$O$");
        this.labelLine(O, ei, $V([1, -1]), "TEX:$\\hat{\\imath}$");
        this.labelLine(O, ej, $V([1, 1]), "TEX:$\\hat{\\jmath}$");

        this.save();
        this.translate($V([1.6, 0.8]));
        this.rotate(0.7);
        this.rectangle(1.2, 1.2 / this.goldenRatio);
        this.restore();

        this.point(rP);
        this.point(rQ);
        this.text(rP, $V([0, 1.2]), "TEX:$P$");
        this.text(rQ, $V([-1.2, 0]), "TEX:$Q$");

        if (this.getOption("showType") === "position") {
            this.arrow(O, rP, "position");
            this.arrow(O, rQ, "position");
            this.labelLine(O, rP, $V([0, -1.1]), "TEX:$\\vec{r}_P$");
            this.labelLine(O, rQ, $V([0, 1.1]), "TEX:$\\vec{r}_Q$");

            this.arrow(rP, rQ);
            this.labelLine(rP, rQ, $V([0, -1.1]), "TEX:$\\vec{r}_{PQ}$");
        }

        if (this.getOption("showType") === "velocity") {
            this.arrowFrom(rP, vP, "velocity");
            this.arrowFrom(rQ, vQ, "velocity");
            this.labelLine(rP, rP.add(vP), $V([1, 0]), "TEX:$\\vec{v}_P$");
            this.labelLine(rQ, rQ.add(vQ), $V([1, 0]), "TEX:$\\vec{v}_Q$");

            this.arrowFrom(rQ, vQRel);
            this.labelLine(rQ, rQ.add(vQRel), $V([1, 0]), "TEX:$\\vec{\\omega} \\times \\vec{r}_{PQ}$");
        }

        if (this.getOption("showType") === "velocity"
            || this.getOption("showType") === "acceleration") {
            var omegaRad = 0.2;
            this.circleArrow(rP, omegaRad, Math.PI / 2 - omega, Math.PI / 2 + omega, "angVel", true);
            this.labelCircleLine(rP, omegaRad, Math.PI / 2 - omega, Math.PI / 2 + omega, $V([0, -1]),
                                 "TEX:$\\vec{\\omega}$", true);
        }

        if (this.getOption("showType") === "acceleration") {
            var alphaRad = 0.25;
            this.circleArrow(rP, alphaRad, Math.PI / 2 - alpha, Math.PI / 2 + alpha, "angAcc", true);
            this.labelCircleLine(rP, alphaRad, Math.PI / 2 - alpha, Math.PI / 2 + alpha, $V([0, 1]),
                                 "TEX:$\\vec{\\alpha}$", true);

            this.arrowFrom(rQ, aQAlpha);
            this.labelLine(rQ, rQ.add(aQAlpha), $V([0, -1.1]), "TEX:$\\vec{\\alpha} \\times \\vec{r}_{PQ}$");

            this.arrowFrom(rQ, aQCent);
            this.labelLine(rQ, rQ.add(aQCent), $V([0, 1.1]), "TEX:$\\vec{\\omega} \\times (\\vec{\\omega} \\times \\vec{r}_{PQ})$");

            this.arrowFrom(rP, aP, "acceleration");
            this.arrowFrom(rQ, aQ, "acceleration");
            this.labelLine(rP, rP.add(aP), $V([1, 0]), "TEX:$\\vec{a}_P$");
            this.labelLine(rQ, rQ.add(aQ), $V([1, 0]), "TEX:$\\vec{a}_Q$");
        }
        
    });

    rkg_xp_c = new PrairieDraw("rkg-xp-c", function() {
        this.setUnits(4, 4 / this.goldenRatio);

        var P = $V([-0.8, -0.8]);
        var Q = P.add($V([2, 0]).rotate(0.5, $V([0, 0])));
        var h = 1;
        var d = this.perp(Q.subtract(P)).toUnitVector().x(h);
        var Pd = P.add(d);
        var Qd = Q.add(d);

        this.groundHashed(P, $V([0, 1]), 6);

        this.rectangleGeneric(P, Q, h);

        this.point(P);
        this.text(P, $V([-0.3, -1.4]), "TEX:$P$");

        this.point(Q);
        this.text(Q, $V([-1, 0]), "TEX:$Q$");

        this.labelLine(Pd, Qd, $V([0, 1.2]), "TEX:$2\\rm\\ m$");
        this.labelLine(Qd, Q, $V([0, 1.2]), "TEX:$1\\rm\\ m$");
    });

    rkg_xc_c = new PrairieDraw("rkg-xc-c", function() {
        this.setUnits(12, 6);

        var O = $V([0, 0]);
        var P = $V([3, 3]);
        var Q = $V([7, 0]);
        var G = $V([0, -1]);

        this.translate($V([-4, -1]));
        this.groundHashed(G, $V([0, 1]), 24);
        this.rectangle(3, 2, Q);
        this.rod(O, P, 1);
        this.pivot(G, O, 0.5);
        this.rod(P, Q, 0.5);
        this.point(O);
        this.point(P);
        this.point(Q);
        this.text(O, $V([-1.2, -1.2]), "TEX:$O$");
        this.text(P, $V([1.2, 1.2]), "TEX:$P$");
        this.text(Q, $V([-1.6, 0]), "TEX:$Q$");
        this.labelLine(O, P, $V([-0.3, 2.3]), "TEX:$\\mathcal{B}_1$");
        this.labelLine(P, Q, $V([0.2, 1.7]), "TEX:$\\mathcal{B}_2$");
        this.text(Q.add($V([1.5, 0])), $V([-1, 0]), "TEX:$\\mathcal{B}_3$");
        this.save();
        this.setProp("shapeStrokePattern", "dashed");
        this.line(O.add($V([1, 0])), O.add($V([3, 0])));
        this.restore();
        this.circleArrow(O, 2, 0, Math.PI / 4, "angle", true);
        this.labelCircleLine(O, 2, 0, Math.PI / 4, $V([-0.3, 1]), "TEX:$\\theta_1$", true);

        var theta1 = Math.PI / 4;
        var theta2 = this.angleOf(P.subtract(Q));
        this.circleArrow(O, 3, theta1 - 0.5, theta1 + 0.5, "angVel", true);
        this.circleArrow(Q, 3, theta2 - 0.5, theta2 + 0.5, "angVel", true);
        this.labelCircleLine(O, 3, theta1 - 0.5, theta1 + 0.5, $V([1, 0]), "TEX:$\\omega_1$", true);
        this.labelCircleLine(Q, 3, theta2 - 0.5, theta2 + 0.5, $V([-1, 0]), "TEX:$\\omega_2$", true);
    });

    rkg_fd_c = new PrairieDrawAnim("rkg-fd-c", function(t) {
        this.setUnits(6, 4);

        this.addOption("showLabels", true);
        this.addOption("movement", "translate");
        this.addOption("PAtCorner", false);
        this.addOption("showPVel", false);
        this.addOption("showPAcc", false);
        this.addOption("showPAngVel", false);
        this.addOption("showPAngAcc", false);
        this.addOption("showAngVel", false);
        this.addOption("showAngAcc", false);
        this.addOption("velField", "none");
        this.addOption("accField", "none");
        this.addOption("showInstRot", false);
        this.addOption("showPPath", false);
        this.addOption("showQPath", false);
        this.addOption("showVelField", false);
        this.addOption("showAccField", false);

        var O = $V([0, 0]);

        var label = this.getOption("showLabels") ? true : undefined;

        var width = 2;
        var height = 1;
        var n1 = 7, n2 = 4;

        var f;
        if (this.getOption("movement") === "translate") {
            f = function(t) {
                return {
                    theta: Math.PI / 2,
                    rC: $V([this.intervalMod(t, -3.7, 3.7), 0]),
                    pathStart: 0,
                    pathPeriod: 2 * 3.7,
                    closePath: true,
                };
            };
        } else if (this.getOption("movement") === "varTranslate") {
            f = function(t) {
                return {
                    theta: Math.PI / 2,
                    rC: $V([2 * Math.sin(t / 2), 0.6 * Math.sin(t)]),
                    pathStart: 0,
                    pathPeriod: 4 * Math.PI,
                    closePath: true,
                };
            };
        } else if (this.getOption("movement") === "rotate") {
            f = function(t) {
                return {
                    theta: t / 2 + Math.PI / 2,
                    rC: $V([0, 0]),
                    pathStart: 0,
                    pathPeriod: 4 * Math.PI,
                    closePath: true,
                };
            };
        } else if (this.getOption("movement") === "varRotate") {
            f = function(t) {
                return {
                    theta: 0.3 * t + 1 - Math.cos(0.6 * t) + Math.PI / 2,
                    rC: $V([0, 0]),
                    pathStart: 0,
                    pathPeriod: 2 * Math.PI / 0.3,
                    closePath: true,
                };
            };
        } else if (this.getOption("movement") === "slide") {
            f = function(t) {
                return {
                    theta: t / 1.5 + Math.PI / 2,
                    rC: $V([this.intervalMod(t, -1.5 * Math.PI, 1.5 * Math.PI), 0]),
                    pathStart: -1.5 * Math.PI + 1e-8,
                    pathPeriod: 2 * Math.PI * 1.5 - 2e-8,
                    closePath: false,
                };
            };
        } else if (this.getOption("movement") === "hinge") {
            f = function(t) {
                var theta = 0.5 * (1 - Math.cos(t / 2)) * Math.PI; 
                return {
                    theta: theta,
                    rC: $V([width / 2, height / 2]).rotate(theta, O).add($V([0, -0.6])),
                    pathStart: 0,
                    pathPeriod: 4 * Math.PI,
                    closePath: true,
                };
            };
        } else if (this.getOption("movement") === "circle") {
            f = function(t) {
                var theta = t / 2;
                return {
                    theta: theta + Math.PI / 2,
                    rC: $V([height, 0]).rotate(theta, O),
                    pathStart: 0,
                    pathPeriod: 4 * Math.PI,
                    closePath: true,
                };
            };
        } else if (this.getOption("movement") === "spin") {
            f = function(t) {
                var theta = t / 2.5;
                return {
                    theta: 2 * theta + Math.PI / 2,
                    rC: $V([height, 0]).rotate(theta, O),
                    pathStart: 0,
                    pathPeriod: 2 * Math.PI * 2.5,
                    closePath: true,
                };
            };
        } else if (this.getOption("movement") === "reverse") {
            f = function(t) {
                var theta = t / 2.5;
                return {
                    theta: -2 * theta + Math.PI / 2,
                    rC: $V([height, 0]).rotate(theta, O),
                    pathStart: 0,
                    pathPeriod: 2 * Math.PI * 2.5,
                    closePath: true,
                };
            };
        } else if (this.getOption("movement") === "osc") {
            f = function(t) {
                return {
                    theta: t / 4 + 1 - Math.cos(t / 2) + Math.PI / 2,
                    rC: $V([1.7 * Math.sin(t / 2), 0.6 * Math.sin(t)]),
                    pathStart: 0,
                    pathPeriod: 8 * Math.PI,
                    closePath: true,
                };
            };
        }
        f = f.bind(this);

        var val = this.numDiff(f, t);
        var pathStart = val.pathStart;
        var pathPeriod = val.pathPeriod;
        var closePath = val.closePath;

        var theta = val.theta;
        var omega = val.diff.theta;
        var alpha = val.ddiff.theta;

        var rC = val.rC;
        var vC = val.diff.rC;
        var aC = val.ddiff.rC;

        var e1 = $V([1, 0]).rotate(theta, O);
        var e2 = $V([0, 1]).rotate(theta, O);

        var Qs = [];
        for (var i1 = 0; i1 < n1; i1++) {
            for (var i2 = 0; i2 < n2; i2++) {
                var s1 = (i1 / (n1 - 1) - 0.5) * width;
                var s2 = (i2 / (n2 - 1) - 0.5) * height;
                Qs.push(rC.add(e1.x(s1)).add(e2.x(s2)));
            }
        }

        var rCM = this.cross2D(omega, vC).x(1 / (omega * omega));
        var rM = rC.add(rCM);

        var rPLoc;
        if (this.getOption("PAtCorner")) {
            rPLoc = $V([-width / 2, -height / 2]);
        } else {
            rPLoc = $V([0, 0]);
        }

        var rP = rC.add(e1.x(rPLoc.e(1))).add(e2.x(rPLoc.e(2)));
        var rCP = rP.subtract(rC);
        var vP = vC.add(this.cross2D(omega, rCP));
        var aP = aC.add(this.cross2D(alpha, rCP)).add(this.cross2D(omega, this.cross2D(omega, rCP)));

        var fPQ = function(t) {
            var val = f(t);
            var theta = val.theta;
            var rC = val.rC;
            var e1 = $V([1, 0]).rotate(theta, O);
            var e2 = $V([0, 1]).rotate(theta, O);
            var rP = rC.add(e1.x(rPLoc.e(1))).add(e2.x(rPLoc.e(2)));
            var rQ = rC.add(e1.x(width / 2)).add(e2.x(height / 2));
            return [rP, rQ];
        };

        var nPath = 150;

        var QPath = [], PPath = [];
        for (var i = 0; i < nPath; i++) {
            var tau = i / nPath * pathPeriod + pathStart;
            var rPrQ = fPQ(tau);
            PPath.push(rPrQ[0]);
            QPath.push(rPrQ[1]);
        }

        if (this.getOption("showPPath")) {
            this.save();
            this.setProp("shapeOutlineColor", "rgb(150, 150, 150)");
            this.polyLine(PPath, closePath, false);
            this.restore();
        }

        if (this.getOption("showQPath")) {
            this.save();
            this.setProp("shapeOutlineColor", "rgb(200, 200, 200)");
            this.polyLine(QPath, closePath, false);
            this.restore();
        }

        if (this.getOption("showInstRot")) {
            Qs.forEach(function(Q) {
                this.save();
                this.setProp("shapeOutlineColor", "rgb(255, 200, 255)");
                this.line(rM, Q);
                this.restore();
            }, this);

            if (this.getOption("velField") === "total") {
                Qs.forEach(function(Q) {
                    var PQ = Q.subtract(rP);
                    var QVR = this.cross2D(omega, PQ);
                    var QV = vP.add(QVR);
                    this.rightAngle(Q, QV, rM.subtract(Q));
                }, this);
            }

            this.point(rM);
            this.labelIntersection(rM, [rC], label && "TEX:$M$");
        }

        this.rectangle(width, height, rC, theta, false);

        this.save();
        this.setProp("pointRadiusPx", 4);
        this.point(rP);
        this.restore();
        this.labelIntersection(rP, [rP.add(e1), rP.add(e2)], label && "TEX:$P$");
        if (this.getOption("showPVel")) {
            this.arrow(rP, rP.add(vP), "velocity");
            this.labelLine(rP, rP.add(vP), $V([1, 0]), label && "TEX:$\\vec{v}_P$");
        }
        if (this.getOption("showPAcc")) {
            this.arrow(rP, rP.add(aP), "acceleration");
            this.labelLine(rP, rP.add(aP), $V([1, 0]), label && "TEX:$\\vec{a}_P$");
        }
        var omegaLabel = (omega >= 0) ? "TEX:$\\omega$" : "TEX:$-\\omega$";
        var alphaLabel = (alpha >= 0) ? "TEX:$\\alpha$" : "TEX:$-\\alpha$";
        if (this.getOption("showPAngVel")) {
            this.circleArrow(rP, 0.2, theta - 3 * omega, theta + 3 * omega, "angVel");
            this.labelCircleLine(rP, 0.2, theta - 3 * omega, theta + 3 * omega, $V([0, 1]), label && omegaLabel);
        }
        if (this.getOption("showAngVel")) {
            this.circleArrow(rC, 0.75, -Math.PI / 2 + theta - 3 * omega / 3.75, -Math.PI / 2 + theta + 3 * omega / 3.75, "angVel");
            this.labelCircleLine(rC, 0.75, -Math.PI / 2 + theta - 3 * omega / 3.75, -Math.PI / 2 + theta + 3 * omega / 3.75, $V([0, 1]), label && omegaLabel);
        }
        if (this.getOption("showPAngAcc")) {
            this.circleArrow(rP, 0.2, Math.PI + theta - 3 * alpha, Math.PI + theta + 3 * alpha, "angAcc");
            this.labelCircleLine(rP, 0.2, Math.PI + theta - 3 * alpha, Math.PI + theta + 3 * alpha, $V([0, 1]), label && alphaLabel);
        }
        if (this.getOption("showAngAcc")) {
            this.circleArrow(rC, 0.75, Math.PI / 2 + theta - 3 * alpha / 3.75, Math.PI / 2 + theta + 3 * alpha / 3.75, "angAcc");
            this.labelCircleLine(rC, 0.75, Math.PI / 2 + theta - 3 * alpha / 3.75, Math.PI / 2 + theta + 3 * alpha / 3.75, $V([0, 1]), label && alphaLabel);
        }

        var iQShow = Qs.length - 1;
        this.labelIntersection(Qs[iQShow], [rC], label && "TEX:$Q$");

        var i;
        Qs.forEach(function(Q, i) {
            var rPQ = Q.subtract(rP);
            var vQR = this.cross2D(omega, rPQ);
            var vQ = vP.add(vQR);
            var aQR = this.cross2D(alpha, rPQ);
            var aQC = this.cross2D(omega, vQR);
            var aQ = aP.add(aQR).add(aQC);
            this.point(Q);
            qLabel = (i == iQShow) ? label : undefined;
            if (this.getOption("showVelField") || i === iQShow) {
                if (this.getOption("velField") === "base") {
                    this.arrow(Q, Q.add(vP), "velocity");
                    this.labelLine(Q, Q.add(vP), $V([1, 0]), qLabel && "TEX:$\\vec{v}_P$");
                } else if (this.getOption("velField") === "omega") {
                    this.arrow(Q, Q.add(vQR), "velocity");
                    this.labelLine(Q, Q.add(vQR), $V([1, 0]), qLabel && "TEX:$\\vec{\\omega} \\times \\vec{r}_{PQ}$");
                } else if (this.getOption("velField") === "total") {
                    this.arrow(Q, Q.add(vQ), "velocity");
                    this.labelLine(Q, Q.add(vQ), $V([1, 0]), qLabel && "TEX:$\\vec{v}_Q$");
                }
            }
            if (this.getOption("showAccField") || i === iQShow) {
                if (this.getOption("accField") === "base") {
                    this.arrow(Q, Q.add(aP), "acceleration");
                    this.labelLine(Q, Q.add(aP), $V([1, 0]), qLabel && "TEX:$\\vec{a}_P$");
                } else if (this.getOption("accField") === "alpha") {
                    this.arrow(Q, Q.add(aQR), "acceleration");
                    this.labelLine(Q, Q.add(aQR), $V([1, 0]), qLabel && "TEX:$\\vec{\\alpha} \\times \\vec{r}_{PQ}$");
                } else if (this.getOption("accField") === "cent") {
                    this.arrow(Q, Q.add(aQC), "acceleration");
                    this.labelLine(Q, Q.add(aQC), $V([1, 0]), qLabel && "TEX:$\\vec{\\omega} \\times (\\vec{\\omega} \\times \\vec{r}_{PQ})$");
                } else if (this.getOption("accField") === "total") {
                    this.arrow(Q, Q.add(aQ), "acceleration");
                    this.labelLine(Q, Q.add(aQ), $V([1, 0]), qLabel && "TEX:$\\vec{a}_Q$");
                }
            }
        }, this);
    });

    rkc_cm_c = new PrairieDrawAnim("rkc-cm-c", function(t) {
        this.setUnits(6, 6)

        this.addOption("showLabels", true);
        this.addOption("movement", "rodCircle");
        this.addOption("showVelocity", false);
        this.addOption("showBPath", false);
        this.addOption("showBTrace", true);
        this.addOption("flipSystem", false);
        this.addOption("showQTrace", true);

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        dt = this.deltaTime();

        if (this.getOption("movement") === "sliderCrank") {
            this.addOption("vC", $V([0.5, 0]));
            this.addOption("rC", $V([2, -0.3/2]));
            this.addOption("rB", $V([-1, 0.5]));
            
            if (this.getOption("flipSystem")) {
                this.rotate(Math.PI/2)
            }
            var wC = 0.5;
            var hC = 0.3;
            var rC = this.getOption("rC");
            var vC = this.getOption("vC");
            var rB = this.getOption("rB");
            var rA = $V([-1.5, -0.4]);
            var rBC = rC.subtract(rB);
            var rAB = rB.subtract(rA);
            var r = (rA.subtract(rB)).modulus();

            this.addOption("vB", $V([vC.e(1)*(-rA.e(2) * rB.e(1) + rA.e(2) * rC.e(1) + rB.e(1) * rB.e(2) - rB.e(2) * rC.e(1))/(rA.e(1) * rB.e(2) - rA.e(1) * rC.e(2) - rA.e(2) * rB.e(1) + rA.e(2) * rC.e(1) + rB.e(1) * rC.e(2) - rB.e(2) * rC.e(1)), 
            vC.e(1)*(rA.e(1) * rB.e(1) - rA.e(1) * rC.e(1) - rB.e(1) * rB.e(1) + rB.e(1) * rC.e(1))/(rA.e(1) * rB.e(2) - rA.e(1) * rC.e(2) - rA.e(2) * rB.e(1) + rA.e(2) * rC.e(1) + rB.e(1) * rC.e(2) - rB.e(2) * rC.e(1))]));
            var vB = this.getOption("vB");

            this.ground($V([2, 0]), ej.x(-1), 1.2);
            this.ground($V([2, -0.3]), ej, 1.2);
            this.rectangle(wC, hC, $V([rC.e(1), rC.e(2)]));
            this.ground(rA.subtract($V([0, 0.15])), ej, 0.3);
            this.pivot(rA.subtract($V([0, 0.15])), rA, 0.15);
            this.rod(rA, rB, 0.1);
            this.rod(rB, rC, 0.1);
            this.point(rA);
            this.point(rB);
            this.point(rC);

            if (this.getOption("showLabels")) {
                this.text(rA, ei.x(1.5), "TEX:$A$");
                var tang = this.perp(rAB);
                this.labelIntersection(rB, [rA, rC, rB.add(tang), rB.subtract(tang), rB.add(vB)], "TEX:$B$", 1.4);
                this.labelIntersection(rC, [rB, rC.add(ej), rC.subtract(ej), rC.add(vC)], "TEX:$C$", 1.6);
            }

            if (this.getOption("showBTrace")) {
                rBHistory = this.history("rB", 0.05, 4*Math.PI + 0.05, t, rB);
                rBTrace = this.historyToTrace(rBHistory);
                this.save();
                this.setProp("shapeOutlineColor", "rgb(0, 0, 255)");
                this.polyLine(rBTrace);
                this.restore();
            }

            if (this.getOption("showBPath")) {
                this.save();
                this.setProp("shapeStrokeWidthPx", 1);
                this.setProp("shapeOutlineColor", "rgb(200, 200, 200)");
                this.circle(rA, r, false);
                this.restore();
            }

            if (this.getOption("showVelocity")){
                this.arrow(rB, rB.add(vB), "velocity");
                this.arrow(rC, rC.add(vC), "velocity");
                if (this.getOption("showLabels")) {
                    this.labelLine(rB, rB.add(vB), ei, "TEX:$\\vec{v}_B$");
                    this.labelLine(rC, rC.add(vC), ei, "TEX:$\\vec{v}_C$");
                }
            }
        } else if (this.getOption("movement") === "rodCircle") {
            var omegaRod = 0.8;
            var omegaP = 1/2;
            var rodLength = 1;

            var PAngle = omegaP*t + Math.PI/4;
            var rodAngle = omegaRod*t - Math.PI/6;

            var rP = $V([1.45, 0]).rotate(PAngle, O);
            var vP = this.perp(rP).x(omegaP);

            var rPQ = $V([rodLength, 0]).rotate(rodAngle, O);
            var rQ = rPQ.add(rP);
            var vQ = vP.add(this.cross2D(omegaRod, rPQ));
            
            this.circle(O, 1.5);
            this.circle(O, 1.4);
            this.pivot(O.subtract($V([0, 0.15])), O, 0.15);
            this.ground(O.subtract($V([0, 0.15])), ej, 0.3);
            this.rod(rP, rQ, 0.1);
            this.point(O);
            this.point(rP);
            this.point(rQ);

            if (this.getOption("showVelocity")) {
                this.arrow(rP, rP.add(vP), "velocity");
                this.arrow(rQ, rQ.add(vQ), "velocity");
                if (this.getOption("showLabels")) {
                    this.labelLine(rP, rP.add(vP), ei, "TEX:$\\vec{v}_P$");
                    this.labelLine(rQ, rQ.add(vQ), ei, "TEX:$\\vec{v}_Q$");
                }
            }

            if (this.getOption("showLabels")) {
                this.text(O, $V([1, -1]), "TEX:$O$");
                this.labelIntersection(rP, [rQ, rP.add(vP)], "TEX:$P$", 1.5);
                this.labelIntersection(rQ, [rP, rQ.add(vQ)], "TEX:$Q$", 1.5);
            }

            if (this.getOption("showQTrace")) {
                rQHistory = this.history("rQ", 0.05, 4*Math.PI + 0.05, t, rQ);
                rQTrace = this.historyToTrace(rQHistory);
                this.save();
                this.setProp("shapeOutlineColor", "rgb(0, 0, 255)");
                this.polyLine(rQTrace);
                this.restore(); 
            }
        }

        if (dt > 0 && dt < 0.1) {
            if (this.getOption("movement") === "sliderCrank") {
                if (rC.e(1) + wC/2 > 2 + 1.2/2 || rC.e(1) - wC/2 < 2 - 1.2/2) {
                    vC = vC.x(-1)
                }
                rC = rC.add(vC.x(dt));
                vB = $V([vC.e(1)*(-rA.e(2) * rB.e(1) + rA.e(2) * rC.e(1) + rB.e(1) * rB.e(2) - rB.e(2) * rC.e(1))/(rA.e(1) * rB.e(2) - rA.e(1) * rC.e(2) - rA.e(2) * rB.e(1) + rA.e(2) * rC.e(1) + rB.e(1) * rC.e(2) - rB.e(2) * rC.e(1)), 
                vC.e(1)*(rA.e(1) * rB.e(1) - rA.e(1) * rC.e(1) - rB.e(1) * rB.e(1) + rB.e(1) * rC.e(1))/(rA.e(1) * rB.e(2) - rA.e(1) * rC.e(2) - rA.e(2) * rB.e(1) + rA.e(2) * rC.e(1) + rB.e(1) * rC.e(2) - rB.e(2) * rC.e(1))])
                rB = rB.add(vB.x(dt));
                this.setOption("rC", rC, false);
                this.setOption("vC", vC, false);
                this.setOption("rB", rB, false);
                this.setOption("vB", vB, false);

            }
        }
    });

    var rkc_xcl_c = new PrairieDraw("rkc-xcl-c", function() {

        this.setUnits(6, 4);

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        this.ground(O.subtract($V([0, 1])), ej, 4);
        this.ground(O.subtract($V([2, 0])), ei, 2);
        this.rod(O.subtract($V([0, 0.9])), O.subtract($V([1.9, 0])), 0.2);
        this.point(O.subtract($V([0, 0.9])));
        this.point(O.subtract($V([1.9, 0])));
        this.point($V([-2, -1]));
        this.text(O.subtract($V([0, 0.9])), $V([-1, -1]), "TEX:$P$");
        this.text(O.subtract($V([1.9, 0])), $V([-1, -1]), "TEX:$Q$");
        this.text($V([-2, -1]), $V([1, 1]), "TEX:$O$");
        this.labelLine(O.subtract($V([0, 0.9])), O.subtract($V([1.9, 0])), $V([0, -1.5]), "TEX:$\\ell$");  
    });

    var rkc_xcp_c = new PrairieDraw("rkc-xcp-c", function() {
        
        this.setUnits(6, 4);

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        this.ground(O.add(ej.x(1.5)), ej.x(-1), 4);
        this.circle(O.add($V([1, 0.8])), 0.4);
        this.circle(O.add($V([0.2, -0.35])), 0.35);
        this.save();
        this.setProp("shapeOutlineColor", this.getProp("positionColor"));
        this.setProp("shapeStrokeWidthPx", 3.5);
        this.arc(O.add($V([1, 0.8])), 0.4, 0, Math.PI);
        this.line(O.add($V([1.4, 0.8])), O.add($V([1.4, 0])));
        this.line(O.add($V([-0.2, 1.5])), O.add([-0.2, -0.3]));
        this.arc(O.add($V([0.2, -0.3])), 0.4, Math.PI, 0);
        this.line(O.add($V([0.6, -0.3])), O.add($V([0.6, 0.8])));
        this.restore();
        this.pivot(O.add($V([1, 1.5])), O.add($V([1, 0.8])), 0.2);
        this.line(O.add($V([0.2, -0.35])), O.add($V([0.2, -1])));
        this.rectangle(0.5, 0.5, O.add($V([0.2, -1.25])));
        this.rectangle(0.7, 0.7, O.add($V([1.4, -0.35])));
        this.text(O.add($V([0.2, -1.25])), O, "TEX:$m_1$");
        this.text(O.add($V([1.4, -0.35])), O, "TEX:$m_2$");
        this.text(O.add($V([0.2, -0.35])), ej.x(-2.7), "TEX:$A$");
        this.text(O.add($V([1, 0.8])), $V([1/2, -Math.sqrt(3)/2]).x(3), "TEX:$B$");
    });

    var rkc_xcp_cs = new PrairieDraw("rkc-xcp-cs", function() {
        
        this.setUnits(6, 4);

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        this.ground(O.add(ej.x(1.5)), ej.x(-1), 4);
        this.circle(O.add($V([1, 0.8])), 0.4);
        this.circle(O.add($V([0.2, -0.35])), 0.35);
        this.save();
        this.setProp("shapeOutlineColor", this.getProp("positionColor"));
        this.setProp("shapeStrokeWidthPx", 3.5);
        this.arc(O.add($V([1, 0.8])), 0.4, 0, Math.PI);
        this.line(O.add($V([1.4, 0.8])), O.add($V([1.4, 0])));
        this.line(O.add($V([-0.2, 1.5])), O.add([-0.2, -0.3]));
        this.arc(O.add($V([0.2, -0.3])), 0.4, Math.PI, 0);
        this.line(O.add($V([0.6, -0.3])), O.add($V([0.6, 0.8])));
        this.restore();
        this.pivot(O.add($V([1, 1.5])), O.add($V([1, 0.8])), 0.2);
        this.line(O.add($V([0.2, -0.35])), O.add($V([0.2, -1])));
        this.rectangle(0.5, 0.5, O.add($V([0.2, -1.25])));
        this.rectangle(0.7, 0.7, O.add($V([1.4, -0.35])));
        this.text(O.add($V([0.2, -1.25])), O, "TEX:$m_1$");
        this.text(O.add($V([1.4, -0.35])), O, "TEX:$m_2$");
        this.save();
        this.setProp("shapeStrokePattern", 'dashed');
        this.line(O.add($V([-2.5, 1.2])), O.add($V([2.5, 1.2])));
        this.restore();
        this.arrow(O.add($V([-0.6,1.2])), O.add($V([-0.6, -0.35])));
        this.arrow(O.add($V([2, 1.2])), O.add($V([2, -0.35])));
        this.labelLine(O.add($V([-0.6,1.2])), O.add($V([-0.6, -0.35])), ej.x(-1.2), "TEX:$y_1$");
        this.labelLine(O.add($V([2, 1.2])), O.add($V([2, -0.35])), ej.x(1.2), "TEX:$y_2$");
    });

    var rkc_xcf_c = new PrairieDraw("rkc-xcf-c", function() {

        this.setUnits(6, 4);

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);
        var phi = 2*Math.PI - Math.atan(1.9, 0.9);

        this.ground(O.subtract($V([0, 1])), ej, 4);
        this.ground(O.subtract($V([2, 0])), ei, 2);
        this.rod(O.subtract($V([0, 0.9])), O.subtract($V([1.9, 0])), 0.2);
        this.arrow($V([2, 1]), $V([2, 0]), "acceleration");
        this.circleArrow($V([-1.9, 0]), 0.4, 3*Math.PI/2 - 0.2, phi + 0.3);
        this.point(O.subtract($V([0, 0.9])));
        this.point(O.subtract($V([1.9, 0])));
        this.point($V([-1.9/2, -0.9/2]));
        this.point($V([-2, -1]));
        this.text(O.subtract($V([0, 0.9])), $V([-1, -1]), "TEX:$P$");
        this.text(O.subtract($V([1.9, 0])), $V([-1, -1]), "TEX:$Q$");
        this.text($V([-2, -1]), $V([1, 1]), "TEX:$O$");
        this.text($V([-1.9/2, -0.9/2]), ej.x(1.5), "TEX:$C$");
        this.labelLine($V([2, 1]), $V([2, 0]), ei, "TEX:$\\vec{g}$");
        this.labelLine(O.subtract($V([0, 0.9])), O.subtract($V([1.9, 0])), $V([0, -1.5]), "TEX:$\\ell$");
        this.labelCircleLine($V([-1.9, 0]), 0.4, 3*Math.PI/2 - 0.2, phi + 0.3, ej, "TEX:$\\phi$");
    });

    var rkc_xcf_s = new PrairieDraw("rkc-xcf-s", function() {

        this.setUnits(6, 4);

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);
        var phi = Math.PI/2 - Math.atan(1.9, 0.9);
        var l = Math.sqrt(0.9*0.9 + 1.9*1.9);

        rP = $V([l/2*Math.cos(phi), -l/2*Math.sin(phi)]);
        rQ = $V([-l/2*Math.cos(phi), l/2*Math.sin(phi)]);

        this.rod(rP, rQ, 0.2);
        this.point(rP);
        this.point(rQ);
        this.point(rP.add(rQ).x(0.5));
        this.arrow(rP, rP.add(ej), "force");
        this.arrow(rQ, rQ.add(ei), "force");
        this.arrow(O, O.subtract(ej), "force");
        this.labelLine(rP, rP.add(ej), ei, "TEX:$\\vec{F}_P$");
        this.labelLine(rQ, rQ.add(ei), ei, "TEX:$\\vec{F}_Q$");
        this.labelLine(O, O.subtract(ej), ei, "TEX:$m\\vec{g}$");
    });

    var rkc_xlc_c = new PrairieDraw("rkc-xlc-c", function() {

        this.setUnits(6, 4);

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);
        var phi = 2*Math.PI - Math.atan(1.9, 0.9);

        this.ground(O.subtract($V([0, 1])), ej, 4);
        this.ground(O.subtract($V([2, 0])), ei, 2);
        this.rod(O.subtract($V([0, 0.9])), O.subtract($V([1.9, 0])), 0.2);
        this.arrow($V([2, 1]), $V([2, 0]), "acceleration");
        this.circleArrow($V([-1.9, 0]), 0.4, 3*Math.PI/2 - 0.2, phi + 0.3);
        this.point(O.subtract($V([0, 0.9])));
        this.point(O.subtract($V([1.9, 0])));
        this.point($V([-1.9/2, -0.9/2]));
        this.point($V([-2, -1]));
        this.text(O.subtract($V([0, 0.9])), $V([-1, -1]), "TEX:$P$");
        this.text(O.subtract($V([1.9, 0])), $V([-1, -1]), "TEX:$Q$");
        this.text($V([-2, -1]), $V([1, 1]), "TEX:$O$");
        this.text($V([-1.9/2, -0.9/2]), ej.x(1.5), "TEX:$C$");
        this.labelLine($V([2, 1]), $V([2, 0]), ei, "TEX:$\\vec{g}$");
        this.labelLine(O.subtract($V([0, 0.9])), O.subtract($V([1.9, 0])), $V([0, -1.5]), "TEX:$\\ell$");
        this.labelCircleLine($V([-1.9, 0]), 0.4, 3*Math.PI/2 - 0.2, phi + 0.3, ej, "TEX:$\\phi$");
    });

    var rkc_xtp_c = new PrairieDraw("rkc-xtp-c", function() {
        
        this.setUnits(6, 4);

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        this.ground(O.add(ej.x(1.5)), ej.x(-1), 4);
        this.circle(O.add($V([1, 0.8])), 0.4);
        this.circle(O.add($V([0.2, -0.35])), 0.35);
        this.save();
        this.setProp("shapeOutlineColor", this.getProp("positionColor"));
        this.setProp("shapeStrokeWidthPx", 3.5);
        this.arc(O.add($V([1, 0.8])), 0.4, 0, Math.PI);
        this.line(O.add($V([1.4, 0.8])), O.add($V([1.4, 0])));
        this.line(O.add($V([-0.2, 1.5])), O.add([-0.2, -0.3]));
        this.arc(O.add($V([0.2, -0.3])), 0.4, Math.PI, 0);
        this.line(O.add($V([0.6, -0.3])), O.add($V([0.6, 0.8])));
        this.restore();
        this.pivot(O.add($V([1, 1.5])), O.add($V([1, 0.8])), 0.2);
        this.line(O.add($V([0.2, -0.35])), O.add($V([0.2, -1])));
        this.rectangle(0.5, 0.5, O.add($V([0.2, -1.25])));
        this.rectangle(0.7, 0.7, O.add($V([1.4, -0.35])));
        this.arrow($V([-1, 1]), $V([-1, 0]), "acceleration");
        this.text(O.add($V([0.2, -1.25])), O, "TEX:$m_1$");
        this.text(O.add($V([1.4, -0.35])), O, "TEX:$m_2$");
        this.text(O.add($V([0.2, -0.35])), ej.x(-2.7), "TEX:$A$");
        this.text(O.add($V([1, 0.8])), $V([1/2, -Math.sqrt(3)/2]).x(3), "TEX:$B$");
        this.labelLine($V([-1, 1]), $V([-1, 0]), ei, "TEX:$\\vec{g}$");
    });

    var rkc_xtp_sa = new PrairieDraw("rkc-xtp-sa", function() {
        
        this.setUnits(6, 4);

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        this.circle(O, 0.4, false);
        this.arrow($V([0.4, 0]), $V([0.4, 1]), "force");
        this.arrow($V([-0.4, 0]), $V([-0.4, 1]), "force");
        this.arrow($V([0, -0.4]), $V([0, -1.4]), "force");
        this.labelLine($V([0.4, 0]), $V([0.4, 1]), ei, "TEX:$\\vec{T}$");
        this.labelLine($V([-0.4, 0]), $V([-0.4, 1]), ei, "TEX:$\\vec{T}$");
        this.labelLine($V([0, -0.4]), $V([0, -1.4]), ei, "TEX:$\\vec{T}_2$");
    });

    var rkc_xtp_s1 = new PrairieDraw("rkc-xtp-s1", function() {
        
        this.setUnits(6, 4);

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        this.rectangle(0.5, 0.5, O, false, false);
        this.arrow(O, O.add(ej), "force");
        this.arrow(O, O.add(ej.x(-1)), "force");
        this.labelLine(O, O.add(ej), ei, "TEX:$\\vec{T}_2$");
        this.labelLine(O, O.add(ej.x(-1)), ei, "TEX:$m\\vec{g}$");
    });

    var rkc_xtp_s2 = new PrairieDraw("rkc-xtp-s2", function() {
        
        this.setUnits(6, 4);

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        this.rectangle(0.5, 0.5, O, false, false);
        this.arrow(O, O.add(ej), "force");
        this.arrow(O, O.add(ej.x(-1)), "force");
        this.labelLine(O, O.add(ej), ei, "TEX:$\\vec{T}$");
        this.labelLine(O, O.add(ej.x(-1)), ei, "TEX:$m\\vec{g}$");
    });

    avs_ft_c = new PrairieDrawAnim("avs-ft-c", function(t) {
        this.setUnits(26, 26 / this.goldenRatio);
    
            var width = 2;
            var length = 4;
            
            this.addOption("radius", 5);
            this.addOption("offset", 0);
            this.addOption("showLabels", true);
            this.addOption("showCornerVelocities", false);
            this.addOption("showRadialLines", false);

            var theta = 0.5 * t;
            var velocityScale = 0.55;
            var r = Number(this.getOption("radius"));
            var dPerc = Number(this.getOption("offset"));
            var d = length / 2 * dPerc / 100;
    
            var rP = $V([r, 0]).rotate(theta, $V([0, 0]));
            var vP = rP.rotate(Math.PI / 2, $V([0, 0])).x(velocityScale);
    
            // car
            this.save();
            this.rotate(theta);
            this.translate($V([r, d]));
            this.rectangle(width, length);
            this.restore();
    
            // center point
            this.save();
            this.setProp("pointRadiusPx", 6);
            this.point($V([0, 0]));
            if (this.getOption("showLabels")) {
                this.text($V([0, 0]), $V([1.2, 1.2]), "TEX:$O$");
            }
            this.restore();
    
            // P
            this.save();
            this.setProp("pointRadiusPx", 3);
            this.point(rP);
            if (this.getOption("showLabels")) {
                this.text(rP, vP.toUnitVector().x(1.5), "TEX:$P$");
            }
            this.arrow(rP, rP.add(vP), "velocity");
            if (this.getOption("showLabels")) {
                this.labelLine(rP, rP.add(vP), $V([1, 0]), "TEX:$\\vec{v}$");
            }
            var rad = 1.2;
            this.circleArrow(rP, rad, theta - 2.2, theta + 2.2 , "angVel", true);
            if (this.getOption("showLabels")) {
                this.labelCircleLine(rP, rad, theta - 2.2, theta + 2.2, $V([0, 1]), "TEX:$\\omega$", true);
            }
            this.restore();
    
            var rFL = $V([-width / 2 + r, length / 2 + d]).rotate(theta, $V([0, 0]));
            var rFR = $V([width / 2 + r, length / 2 + d]).rotate(theta, $V([0, 0]));
            var rRL = $V([-width / 2 + r, -length / 2 + d]).rotate(theta, $V([0, 0]));
            var rRR = $V([width / 2 + r, -length / 2 + d]).rotate(theta, $V([0, 0]));
            var vFL = rFL.rotate(Math.PI / 2, $V([0, 0])).x(velocityScale);
            var vFR = rFR.rotate(Math.PI / 2, $V([0, 0])).x(velocityScale);
            var vRL = rRL.rotate(Math.PI / 2, $V([0, 0])).x(velocityScale);
            var vRR = rRR.rotate(Math.PI / 2, $V([0, 0])).x(velocityScale);
    
            if (this.getOption("showCornerVelocities")) {
                this.arrow(rFL, rFL.add(vFL), "velocity");
                this.arrow(rFR, rFR.add(vFR), "velocity");
                this.arrow(rRL, rRL.add(vRL), "velocity");
                this.arrow(rRR, rRR.add(vRR), "velocity");
            }
            if (this.getOption("showRadialLines")) {
                this.save();
                this.setProp("shapeStrokePattern", "dashed");
                this.line($V([0, 0]), rP);
                this.rightAngle(rP, vP);
                this.line($V([0, 0]), rFL);
                this.line($V([0, 0]), rFR);
                this.line($V([0, 0]), rRL);
                this.line($V([0, 0]), rRR);
                this.restore();
                if (this.getOption("showCornerVelocities")) {
                    this.rightAngle(rFL, vFL);
                    this.rightAngle(rFR, vFR);
                    this.rightAngle(rRL, vRL);
                    this.rightAngle(rRR, vRR);
                }
            }
        });
        var f1car = {
            width: 2, // m
            length: 4, // m
            wheelWidth: 0.4, // m
            wheelLength: 1, // m
            wheelOffset: 0.3, // m
            trackRodOffset: 0.6, // m
            connectWidth: 0.2, // m
            connectExtension: 0.1, // m
        };
    
        f1car.drawFrontWheel = function(pd, trackRodShorten) {
            var theta = Math.atan2(trackRodShorten, this.trackRodOffset);
            var d = this.connectWidth/2 / Math.tan((Math.PI/2 + theta)/2);
            var p = $V([trackRodShorten, -this.trackRodOffset]);
            var pe = p.toUnitVector().x(p.modulus() + this.connectExtension);
            var v = p.rotate(Math.PI/2, $V([0,0])).toUnitVector();
            var points = [
                $V([-this.wheelOffset, this.connectWidth/2]),
                $V([d, this.connectWidth/2]),
                pe.add(v.x(this.connectWidth/2)),
                pe.add(v.x(-this.connectWidth/2)),
                $V([-d, -this.connectWidth/2]),
                $V([-this.wheelOffset, -this.connectWidth/2])
                ];
            pd.polyLine(points, true);
            pd.point($V([0, 0]));
            pd.point(p);
            pd.save();
            pd.translate($V([-this.wheelOffset - this.wheelWidth/2, 0]));
            pd.rectangle(this.wheelWidth, this.wheelLength);
            pd.restore();
        };
    
        f1car.findAngles = function(pd, w, a, h, d) {
            var cosMaxAngle = (w * w + h * h - a * a) / (2 * w * h);
            var maxD = a + h * cosMaxAngle / 2 - w / 2;
            if (Math.abs(d) >= maxD) {
                return [NaN, NaN];
            }
    
            // bisection method
            var alpha0 = 0;
            var alpha1 = Math.PI;
            var i, alpha, beta, dTest;
            for (i = 0; i < 10; i++) {
                // 10 iterations starting from pi, so tolerance of pi/1024
                alpha = (alpha0 + alpha1) / 2;
                beta = pd.solveFourBar(w, h, a, a, alpha, false);
                dTest = (a * Math.cos(alpha) + a * Math.cos(beta)) / 2;
                if (dTest - d > 0) {
                    alpha0 = alpha;
                } else {
                    alpha1 = alpha;
                }
            }
            alpha = (alpha0 + alpha1) / 2;
            beta = pd.solveFourBar(w, h, a, a, alpha, false);
            return [alpha, Math.PI - beta];
        };
    
        f1car.findRadii = function(pd, w, l, a, d, trackRodShorten, alpha1, alpha2) {
            var r1, r2;
            var trackRodAngle = Math.asin(trackRodShorten / a);
            if (d === 0) {
                r1 = -Infinity;
                r2 = Infinity;
            } else {
                var theta1 = alpha1 + trackRodAngle - Math.PI / 2;
                var theta2 = -alpha2 - trackRodAngle + Math.PI / 2;
                if (d > 0) {
                    theta1 = Math.min(theta1, 0);
                    theta2 = Math.min(theta2, 0);
                } else {
                    theta1 = Math.max(theta1, 0);
                    theta2 = Math.max(theta2, 0);
                }
                r1 = -w / 2 + l / Math.tan(theta1);
                r2 = w / 2 + l / Math.tan(theta2);
            }
            return [r1, r2]
        };
    
        f1car.draw = function(pd, trackRodShorten, rackOffset, showRadii, showArmLines, showLabels) {
            var t = $V([trackRodShorten, this.trackRodOffset])
            var theta = Math.PI/2 - pd.angleOf(t);
            var a = t.modulus();
            var h = this.width - 2 * trackRodShorten;
            var angles = this.findAngles(pd, this.width, a, h, rackOffset);
            var alpha1 = angles[0];
            var alpha2 = angles[1];
            var frontLeft = $V([-this.width/2, this.length/2]);
            var frontRight = $V([this.width/2, this.length/2]);
            var p1 = frontLeft.add($V([a, 0]).rotate(-alpha1, $V([0, 0])));
            var p2 = frontRight.add($V([-a, 0]).rotate(alpha2, $V([0, 0])));
    
            // front wheels
            pd.rectangle(this.width, this.length);
            pd.save();
            pd.translate(frontLeft);
            pd.rotate(Math.PI/2 - alpha1 - theta);
            this.drawFrontWheel(pd, trackRodShorten);
            pd.restore();
            pd.save();
            pd.translate(frontRight);
            pd.scale($V([-1, 1]));
            pd.rotate(Math.PI/2 - alpha2 - theta);
            this.drawFrontWheel(pd, trackRodShorten);
            pd.restore();
            pd.line(p1, p2);
            var mid = p1.add(p2).x(0.5);
            pd.point(mid);
            var arrowY = frontLeft.e(2) - this.trackRodOffset - 0.1;
            pd.arrow($V([0, arrowY]), $V([mid.e(1), arrowY]), 'position');
            if (showLabels) {
                pd.text($V([mid.e(1) / 2, arrowY]), $V([0, 1]), "TEX:$d$");
                pd.text(frontLeft, $V([0, -2]), "TEX:$A$");
                pd.text(frontRight, $V([0, -2]), "TEX:$B$");
                pd.text(p2, $V([1, 1.5]), "TEX:$C$");
                pd.text(p1, $V([-1, 1.5]), "TEX:$D$");
            }
    
            // rear wheels
            pd.save();
            pd.translate($V([0, -this.length/2]));
            var d = -this.width/2 - this.wheelOffset - this.wheelWidth/2;
            pd.rectangle(2 * d, this.connectWidth);
            pd.point($V([-this.width/2, 0]));
            pd.point($V([this.width/2, 0]));
            pd.save();
            pd.translate($V([-d, 0]));
            pd.rectangle(this.wheelWidth, this.wheelLength);
            pd.restore();
            pd.save();
            pd.translate($V([d, 0]));
            pd.rectangle(this.wheelWidth, this.wheelLength);
            pd.restore();
            pd.restore();
    
            // radii
            var rVec = this.findRadii(pd, this.width, this.length, a, rackOffset, trackRodShorten, alpha1, alpha2);
            var r1 = rVec[0];
            var r2 = rVec[1];
            if (showRadii) {
                pd.save();
                pd.setProp("shapeStrokePattern", "dashed");
                pd.setProp("shapeOutlineColor", "blue");
                if (isFinite(r1)) {
                    pd.line(frontLeft, $V([r1, -this.length / 2]));
                } else {
                    pd.line(frontLeft, $V([-this.width * 5, this.length / 2]));
                }
                pd.setProp("shapeOutlineColor", "red");
                if (isFinite(r2)) {
                    pd.line(frontRight, $V([r2, -this.length / 2]));
                } else {
                    pd.line(frontRight, $V([-this.width * 5, this.length / 2]));
                }
                pd.setProp("shapeOutlineColor", "black");
                pd.line($V([0, -this.length / 2]), $V([-this.width * 5, -this.length / 2]));
                pd.restore();
    
                if (showLabels) {
                    var r1MeasX = isFinite(r1) ? r1 : -100;
                    var r1MeasY = -this.length / 2 + this.wheelLength / 2;
                    pd.measurement($V([0, r1MeasY]), $V([r1MeasX, r1MeasY]), "TEX:$r_1$");
                    var r2MeasX = isFinite(r2) ? r2 : -100;
                    var r2MeasY = -this.length / 2 + this.wheelLength / 2 + 0.4;
                    pd.measurement($V([0, r2MeasY]), $V([r2MeasX, r2MeasY]), "TEX:$r_2$");
                }
            }
            if (showArmLines) {
                pd.save();
                pd.setProp("shapeStrokePattern", "dashed");
                if (trackRodShorten === 0 && rackOffset === 0) {
                    pd.line(frontLeft, frontLeft.add($V([0, -this.trackRodOffset - this.connectExtension])));
                    pd.line(frontRight, frontRight.add($V([0, -this.trackRodOffset - this.connectExtension])));
                } else {
                    pd.line(frontLeft, frontLeft.add($V([this.length * Math.tan(Math.PI/2 - alpha1), -this.length])));
                    pd.line(frontRight, frontRight.add($V([-this.length * Math.tan(Math.PI/2 - alpha2), -this.length])));
                }
                pd.restore();
    
                if (showLabels && trackRodShorten !== 0) {
                    var angleRad = 2.5;
                    var refLineRad = 2.7;
                    pd.save();
                    pd.setProp("shapeStrokePattern", "dashed");
                    var leftRefLineUnit = $V([1, 0]).rotate(-alpha1 - theta, $V([0, 0]));
                    var rightRefLineUnit = $V([1, 0]).rotate(alpha2 + theta - Math.PI, $V([0, 0]));
                    pd.line(frontLeft, frontLeft.add(leftRefLineUnit.x(refLineRad)));
                    pd.line(frontRight, frontRight.add(rightRefLineUnit.x(refLineRad)));
                    pd.restore();
                    pd.circleArrow(frontLeft, angleRad, -alpha1 - theta, -alpha1, undefined, true);
                    pd.circleArrow(frontRight, angleRad, alpha2 + theta - Math.PI, alpha2 - Math.PI, undefined, true);
                    if (trackRodShorten > 0) {
                        pd.text(frontLeft.add(leftRefLineUnit.x(angleRad)),
                                leftRefLineUnit.rotate(Math.PI / 2, $V([0, 0])), "TEX:$\\theta$");
                        pd.text(frontRight.add(rightRefLineUnit.x(angleRad)),
                                rightRefLineUnit.rotate(-Math.PI / 2, $V([0, 0])), "TEX:$\\theta$");
                    } else if (trackRodShorten < 0) {
                        pd.text(frontLeft.add(leftRefLineUnit.x(angleRad)),
                                leftRefLineUnit.rotate(-Math.PI / 2, $V([0, 0])), "TEX:$-\\theta$");
                        pd.text(frontRight.add(rightRefLineUnit.x(angleRad)),
                                rightRefLineUnit.rotate(Math.PI / 2, $V([0, 0])), "TEX:$-\\theta$");
                    }
                }
            }
            return rVec;
        };
        avs_fr_c = new PrairieDrawAnim("avs-fr-c", function(t) {
            this.addOption("pivotAngleDeg", 0);
            this.addOption("showLabels", true);
            
        this.setUnits(11, 10);
    
            var trackRodShorten = Math.atan2(this.degToRad(this.getOption("pivotAngleDeg")), f1car.trackRodOffset);
    
            var dMax = 0.38;
            var d = dMax * 0.5 * (1 - Math.cos(t));
            this.save();
            this.translate($V([3, 2]));
            var showLabels = this.getOption("showLabels");
            var rVec = f1car.draw(this, trackRodShorten, d, true, true, showLabels);
            this.restore();
            var r1 = rVec[0];
            var r2 = rVec[1];
    
            var ir1History = this.history("ir1", 0.05, 2 * Math.PI + 0.05, t, $V([d, -1 / r1]));
            var ir2History = this.history("ir2", 0.05, 2 * Math.PI + 0.05, t, $V([d, -1 / r2]));
                
            var ir1Trace = this.historyToTrace(ir1History);
            var ir2Trace = this.historyToTrace(ir2History);
    
            var origin = $V([-4.4, -4.1]);
            var size = $V([9.2, 3]);
            var pointLabel = undefined;
            var pointAnchor = undefined;
            if (this.getOption("showLabels")) {
                pointLabel = "TEX:$\\displaystyle \\frac{1}{r_1}$";
                pointAnchor = $V([-1, 1]);
            }
            this.plot(ir1Trace, origin, size, $V([0, 0]), $V([dMax * 1.2, 0.3]),
                      "TEX:$d$", "TEX:$\\displaystyle \\frac{1}{r}$",
                      "blue", true, true, pointLabel, pointAnchor);
            if (this.getOption("showLabels")) {
                pointLabel = "TEX:$\\displaystyle \\frac{1}{r_2}$";
                pointAnchor = $V([1, -1]);
            }
            this.plot(ir2Trace, origin, size, $V([0, 0]), $V([dMax * 1.2, 0.3]), "", "",
                      "red", false, true, pointLabel, pointAnchor);
        });
    
        avs_fr_c.registerOptionCallback("pivotAngleDeg", function(value) {this.clearAllHistory();});    

        var drawLinkage = function(pd, t, pivots, links, flipped, alphaMax, pivotPosFcn, symmetricOsc) {
            var pivotA = pivots[0];
            var pivotB = pivots[1];
            var pivotC = pivots[2];
            var pivotD = pivots[3];
    
            var alphaMin = pd.angleFrom(pivotB.subtract(pivotA), pivotD.subtract(pivotA));
            var alpha;
    
            if (alphaMax === undefined) {
                alpha = alphaMin + t;
            } else {
                if (symmetricOsc !== undefined && symmetricOsc === true) {
                    var v = (1 + Math.sin(t)) / 2;
                    alpha = pd.linearInterp(2 * alphaMin - alphaMax, alphaMax, v);
                } else {
                    var v = (1 - Math.cos(t)) / 2;            
                    alpha = pd.linearInterp(alphaMin, alphaMax, v);
                }
            }
            
            var a = pivotD.subtract(pivotA).modulus();
            var b = pivotC.subtract(pivotB).modulus();
            var g = pivotB.subtract(pivotA).modulus();
            var f = pivotC.subtract(pivotD).modulus();
            var beta = pd.solveFourBar(g, f, a, b, alpha, flipped);
            var newPivotA, newPivotB;
            if (pivotPosFcn === undefined) {
                newPivotA = pivotA;
                newPivotB = pivotB;
            } else {
                var newBasePos = pivotPosFcn(pivotA, pivotB, t, alpha, alphaMin, alphaMax, beta);
                newPivotA = newBasePos[0];
                newPivotB = newBasePos[1];
            }
            var unitAB = newPivotB.subtract(newPivotA).toUnitVector();
            var newPivotC = newPivotB.add(unitAB.rotate(beta, $V([0, 0])).x(b));
            var newPivotD = newPivotA.add(unitAB.rotate(alpha, $V([0, 0])).x(a));
            var newPivots = [newPivotA, newPivotB, newPivotC, newPivotD];
            
            // fade out the image
            pd.save();
            pd.setProp("shapeInsideColor", "rgba(0, 0, 0, 0.5)");
            pd.rectangle(700, 600);
            pd.restore();
            
            pd.save();
            var i, j, base, trans, u, v, coupler, history;
            for (i = 0; i < links.length; i++) {
                link = links[i];
                // shapes
                pd.save();
                pd.transformByPoints(pivots[link.startPivot], pivots[link.endPivot],
                                       newPivots[link.startPivot], newPivots[link.endPivot]);
                pd.setProp("shapeOutlineColor", link.outlineColor);
                pd.setProp("shapeInsideColor", link.insideColor);
                pd.polyLine(link.outlineData, true, true);
                pd.restore();
    
                if (link.forces !== undefined
                    && pd.getOption("showForces")
                    && link.forcesActive(t)) {
                    trans = pd.identityTransform();
                    trans = pd.transformByPointsTransform(trans,
                                                          pivots[link.startPivot], pivots[link.endPivot],
                                                          newPivots[link.startPivot], newPivots[link.endPivot]);
                    pd.setProp("shapeOutlineColor", link.outlineColor);
                    for (j = 0; j < link.forces.length; j++) {
                        base = pd.transformPos(trans, link.forces[j][0]);
                        pd.arrow(base, base.add(link.forces[j][1]));
                    }
                }
            }
            for (i = 0; i < links.length; i++) {
                link = links[i];
                // linkage rods
                pd.save();
                pd.transformByPoints(pivots[link.startPivot], pivots[link.endPivot],
                                       newPivots[link.startPivot], newPivots[link.endPivot]);
                pd.setProp("shapeOutlineColor", "rgb(0, 0, 0)");
                pd.setProp("shapeStrokeWidthPx", 6);
                pd.line(pivots[link.startPivot], pivots[link.endPivot]);
                pd.setProp("shapeOutlineColor", link.outlineColor);
                pd.setProp("shapeStrokeWidthPx", 2);
                pd.line(pivots[link.startPivot], pivots[link.endPivot]);
                pd.restore();
            }
            for (i = 0; i < links.length; i++) {
                link = links[i];
                // link labels
                if (link.label !== undefined) {
                    trans = pd.identityTransform();
                    trans = pd.transformByPointsTransform(trans,
                                                          pivots[link.startPivot], pivots[link.endPivot],
                                                          newPivots[link.startPivot], newPivots[link.endPivot]);
                    pd.text(pd.transformPos(trans, link.labelPos), link.labelAnchor, link.label, true);
                }
                // coupler
                if (link.couplerPosition !== undefined) {
                    u = newPivots[link.endPivot].subtract(newPivots[link.startPivot]);
                    v = u.rotate(Math.PI / 2, $V([0, 0]));
                    coupler = newPivots[link.startPivot].add(u.x((link.couplerPosition + 1) / 2)).add(v.x(link.couplerOffset));
                    pd.save();
                    pd.setProp("shapeOutlineColor", link.outlineColor);
                    pd.setProp("pointRadiusPx", 5);
                    pd.setProp("shapeStrokeWidthPx", 3);
                    pd.point(coupler);
                    if (link.couplerLabel !== undefined) {
                        pd.text(coupler, link.couplerAnchor, link.couplerLabel, true);
                    }
                    if (link.couplerHistory !== undefined && link.couplerHistory === true) {
                        history = pd.history("coupler" + i, 0.05, Math.PI * 4 + 0.05, t, coupler);
                        pd.polyLine(pd.historyToTrace(history));
                    }
                    pd.restore();
                }
            }
            
            pd.setProp("shapeOutlineColor", "rgb(0, 0, 0)");
            pd.setProp("pointRadiusPx", 5);
            for (i = 0; i < pivots.length; i++) {
                // linkage pivots
                pd.point(newPivots[i]);
            }
            
            pd.restore();
        };

        var kneeLinkCD = [
            $V([-75, 760]), $V([-101, 296]), $V([-114, 64]), $V([-118, 55]),
            $V([-99, 7]), $V([-70, -20]), $V([-37, -34]), $V([-5, -26]),
            $V([1, -25]), $V([32, 0]), $V([53, 28]), $V([54, 46]),
            $V([63, 61]), $V([58, 91]), $V([45, 106]), $V([27, 160]),
            $V([19, 220]), $V([10, 296]), $V([-44, 752])
        ];
    
        var kneeLinkAB = [
            $V([24, -530]), $V([72, -302]), $V([84, -245]), $V([98, -203]),
            $V([117, -174]), $V([129, -160]), $V([136, -146]), $V([128, -129]),
            $V([107, -113]), $V([86, -97]), $V([82, -76]), $V([49, -74]),
            $V([29, -79]), $V([13, -83]), $V([-40, -82]), $V([-54, -84]),
            $V([-85, -91]), $V([-89, -95]), $V([-97, -182]), $V([-92, -200]),
            $V([-80, -217]), $V([-71, -253]), $V([-65, -280]), $V([-62, -301]),
            $V([-32, -511])
        ];
    
        var kneeLinkDA = [
            $V([-9, -58]), $V([-32, -79]), $V([-32, -84]), $V([-29, -88]),
            $V([-19, -90]), $V([-8, -90]), $V([4, -90]), $V([13, -86]),
            $V([19, -82]), $V([23, -71]), $V([41, -50]), $V([60, -30]),
            $V([68, -14]), $V([77, 20]), $V([82, 44]), $V([75, 66]),
            $V([65, 71]), $V([61, 66]), $V([55, 57]), $V([55, 42]),
            $V([54, 31]), $V([44, 15]), $V([34, -1]), $V([17, -27])
        ];
    
        var kneeLinkBC = [
            $V([16, -2]), $V([4, -12]), $V([8, -27]), $V([21, -27]),
            $V([37, -27]), $V([57, -21]), $V([79, -36]), $V([84, -48]),
            $V([88, -93]), $V([93, -105]), $V([100, -116]), $V([112, -124]),
            $V([121, -130]), $V([138, -130]), $V([130, -103]), $V([118, -75]),
            $V([105, -43]), $V([86, -15]), $V([65, -3]), $V([42, -1]),
            $V([28, -1])
        ];
    
        var kneePivotA = $V([-30, -82]);
        var kneePivotB = $V([110, -80]);
        var kneePivotC = $V([13, -6]);
        var kneePivotD = $V([70, 52]);
    
        var kneePivots = [kneePivotA, kneePivotB, kneePivotC, kneePivotD];
        var kneeLinks = [
            {outlineData: kneeLinkAB,
             startPivot: 0,
             endPivot: 1,
             outlineColor: "rgb(0, 255, 255)",
             insideColor: "rgba(0, 255, 255, 0.3)",
             label: "TEX:tibia",
             labelPos: $V([0, -200]),
             labelAnchor: $V([0, 0])
            },
            {outlineData: kneeLinkBC,
             startPivot: 1,
             endPivot: 2,
             outlineColor: "rgb(255, 0, 255)",
             insideColor: "rgba(255, 0, 255, 0.3)",
             label: "TEX:PCL",
             labelPos: $V([140, -100]),
             labelAnchor: $V([-1, 0])
            },
            {outlineData: kneeLinkCD,
             startPivot: 2,
             endPivot: 3,
             outlineColor: "rgb(0, 255, 0)",
             insideColor: "rgba(0, 255, 0, 0.3)",
             label: "TEX:femur",
             labelPos: $V([-30, 80]),
             labelAnchor: $V([0, 0])
            },
            {outlineData: kneeLinkDA,
             startPivot: 3,
             endPivot: 0,
             outlineColor: "rgb(255, 0, 0)",
             insideColor: "rgba(255, 0, 0, 0.3)",
             label: "TEX:ACL",
             labelPos: $V([90, 60]),
             labelAnchor: $V([-1, 0])
            }
        ];
    
        var kneePivotPosFcn = function(pivotA, pivotB, t, alpha, alphaMin, alphaMax, beta) {
            var theta = -1.3 * (alpha - alphaMin);
            var mid = pivotA.add(pivotB).x(0.5);
            var newPivotB = pivotB.rotate(theta, mid);
            var newPivotA = pivotA.rotate(theta, mid);
            return [newPivotA, newPivotB];
        };
    
        aml_fk_c = new PrairieDrawAnim("aml-fk-c", function(t) {
            this.addOption("showLinkage", false);
    
        this.setUnits(600, 596);
            this.drawImage("aml_MRT_ACL_PCL_01_small.jpg", $V([0, 0]), $V([0, 0]));
    
            if (this.getOption("showLinkage")) {
                drawLinkage(this, t, kneePivots, kneeLinks, true, 0.25, kneePivotPosFcn);
            }
        });
    
        $('button[class~="reset-time:aml-fk-c"]').click(function() {
            aml_fk_c.stopAnim();
            aml_fk_c.resetTime();
        });
    
        aml_fk_c.registerOptionCallback("showLinkage", function(value) {
            if (value) {
                this.stopAnim();
                this.resetTime();
                $('button[class~="anim-toggle:aml-fk-c"]').css("visibility", "visible");
                $('button[class~="reset-time:aml-fk-c"]').css("visibility", "visible");
            } else {
                this.stopAnim();
                this.resetTime(false);
                $('button[class~="anim-toggle:aml-fk-c"]').css("visibility", "hidden");
                $('button[class~="reset-time:aml-fk-c"]').css("visibility", "hidden");
            }
        });

        aml_fs_c = new PrairieDraw("aml-fs-c", function() {
            this.addOption("showPivot", false);
    
        this.setUnits(250, 155);
            this.drawImage("aml_Blaireau_small.jpg", $V([0, 0]), $V([0, 0]));
    
            if (this.getOption("showPivot")) {
                this.setProp("shapeOutlineColor", "rgb(255, 0, 0)");
                this.setProp("shapeStrokeWidthPx", 5);
                this.arc($V([26, -28]), 7, 0, 2 * Math.PI);
            }
        });
    
        var wattLinkAB = [
            $V([-219, 119]), $V([-166, 67]), $V([-166, 33]), $V([-161, 26]),
            $V([-151, 24]), $V([-138, 60]), $V([-127, 88]), $V([126, 80]),
            $V([139, 14]), $V([148, 16]), $V([155, -9]), $V([165, -11]),
            $V([170, -5]), $V([171, 67]), $V([200, 119]),
        ];
    
        var wattPivotA = $V([-160, 35]);
        var wattPivotD = $V([12, 16]);
        var wattPivotC = $V([-9, -19]);
        var wattPivotB = $V([163, 0]);
    
        var linkFromPivots = function(p1, p2, r) {
            var u = p2.subtract(p1).toUnitVector();
            var v = u.rotate(Math.PI / 2, $V([0, 0]));
            return [p1.add(v.x(r)),
                    p1.add(v.x(0.7 * r)).add(u.x(-0.7 * r)),
                    p1.add(u.x(-r)),
                    p1.add(v.x(-0.7 * r)).add(u.x(-0.7 * r)),
                    p1.add(v.x(-r)),
                    p2.add(v.x(-r)),
                    p2.add(v.x(-0.7 * r)).add(u.x(0.7 * r)),
                    p2.add(u.x(r)),
                    p2.add(v.x(0.7 * r)).add(u.x(0.7 * r)),
                    p2.add(v.x(r))];
        }
    
        var wattLinkBC = linkFromPivots(wattPivotB, wattPivotC, 5);
        var wattLinkCD = linkFromPivots(wattPivotC, wattPivotD, 10);
        var wattLinkDA = linkFromPivots(wattPivotD, wattPivotA, 5);
    
        var wattPivots = [wattPivotA, wattPivotB, wattPivotC, wattPivotD];
        var wattLinks = [
            {outlineData: wattLinkAB,
             startPivot: 0,
             endPivot: 1,
             outlineColor: "rgb(0, 255, 255)",
             insideColor: "rgba(0, 255, 255, 0.3)"
            },
            {outlineData: wattLinkBC,
             startPivot: 1,
             endPivot: 2,
             outlineColor: "rgb(255, 0, 255)",
             insideColor: "rgba(255, 0, 255, 0.3)"
            },
            {outlineData: wattLinkCD,
             startPivot: 2,
             endPivot: 3,
             outlineColor: "rgb(0, 255, 0)",
             insideColor: "rgba(0, 255, 0, 0.3)",
             couplerPosition: 0,
             couplerOffset: 0,
             //couplerLabel: "TEX:$P$",
             //couplerAnchor: $V([1, 1]),
             couplerHistory: true
            },
            {outlineData: wattLinkDA,
             startPivot: 3,
             endPivot: 0,
             outlineColor: "rgb(255, 0, 0)",
             insideColor: "rgba(255, 0, 0, 0.3)"
            }
        ];
    
        aml_fw_c = new PrairieDrawAnim("aml-fw-c", function(t) {
            this.addOption("showLinkage", false);
    
        this.setUnits(600, 288);
            this.drawImage("aml_GSFRRearViewUnderCropped_small.jpg", $V([0, 0]), $V([0, 0]));
    
            if (this.getOption("showLinkage")) {
                drawLinkage(this, t, wattPivots, wattLinks, true, 0.15, undefined, true);
            }
        });
    
        $('button[class~="reset-time:aml-fw-c"]').click(function() {
            aml_fw_c.stopAnim();
            aml_fw_c.clearAllHistory();
            aml_fw_c.resetTime();
        });
    
        aml_fw_c.registerOptionCallback("showLinkage", function(value) {
            if (value) {
                this.stopAnim();
                this.clearAllHistory();
                this.resetTime();
                $('button[class~="anim-toggle:aml-fw-c"]').css("visibility", "visible");
                $('button[class~="reset-time:aml-fw-c"]').css("visibility", "visible");
            } else {
                this.stopAnim();
                this.resetTime(false);
                $('button[class~="anim-toggle:aml-fw-c"]').css("visibility", "hidden");
                $('button[class~="reset-time:aml-fw-c"]').css("visibility", "hidden");
            }
        });

        $(window).on("resize", function(){
            rkg_fw_c.redraw();
            rkg_fr_c.redraw();
            rkg_xp_c.redraw();
            rkg_xc_c.redraw();
            rkg_fd_c.redraw();
            rkc_cm_c.redraw();
            rkc_xcl_c.redraw();
            rkc_xcp_c.redraw();
            rkc_xcp_cs.redraw();
            rkc_xcf_c.redraw();
            rkc_xcf_s.redraw();
            rkc_xlc_c.redraw();
            rkc_xtp_c.redraw();
            rkc_xtp_sa.redraw();
            rkc_xtp_s1.redraw();
            rkc_xtp_s2.redraw();
            avs_ft_c.redraw();
            avs_fr_c.redraw();
            aml_fk_c.redraw();
            aml_fs_c.redraw();
            aml_fw_c.redraw();
        });
})
