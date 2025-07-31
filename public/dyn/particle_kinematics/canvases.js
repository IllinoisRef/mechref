
$(document).ready(function() {

    rkr_fc_c = new PrairieDrawAnim("rkr-fc-c", function(t) {
        this.setUnits(4.5, 3);

        this.addOption("showLabels", true);
        this.addOption("showAngVel", true);
        this.addOption("axis", "k");
        this.addOption("showVectors", false);

        var O = $V([0, 0, 0]);
        var rX = $V([1, 0, 0]);
        var rY = $V([0, 1, 0]);
        var rZ = $V([0, 0, 1]);
        var gS = 2; // ground size

        var theta = t - 0.5 * Math.sin(t);
        var omega = 1 - 0.5 * Math.cos(t);

        var axis;
        if (this.getOption("axis") === "i") {
            axis = Vector.i;
        } else if (this.getOption("axis") === "j") {
            axis = Vector.j;
        } else if (this.getOption("axis") === "k") {
            axis = Vector.k;
        } else if (this.getOption("axis") === "ij") {
            axis = Vector.i.add(Vector.j);
        } else if (this.getOption("axis") === "ijk") {
            axis = Vector.i.add(Vector.j).add(Vector.k);
        }

        var omegaVec = axis.toUnitVector().x(omega);

        var splitLine = function(p1, p2, type, drawAbove) {
            var above = [], below = [];
            if (p1.e(3) >= 0 && p2.e(3) >= 0) {
                above = [p1, p2];
            } else if (p1.e(3) <= 0 && p2.e(3) <= 0) {
                below = [p1, p2];
            } else {
                var alpha = p1.e(3) / (p1.e(3) - p2.e(3));
                var p3 = p1.x(1 - alpha).add(p2.x(alpha));
                if (p1.e(3) >= 0) {
                    above = [p1, p3];
                    below = [p3, p2];
                } else {
                    above = [p3, p2];
                    below = [p1, p3];
                }
            }
            if (drawAbove) {
                if (above.length === 2) {
                    this.line(above[0], above[1], type);
                }
            } else {
                if (below.length === 2) {
                    this.line(below[0], below[1], type);
                }
            }
        }.bind(this);

        var cube = {};
        cube["000"] = $V([-1, -1, -1]).rotate(theta, $L(O, axis));
        cube["001"] = $V([-1, -1,  1]).rotate(theta, $L(O, axis));
        cube["010"] = $V([-1,  1, -1]).rotate(theta, $L(O, axis));
        cube["011"] = $V([-1,  1,  1]).rotate(theta, $L(O, axis));
        cube["100"] = $V([ 1, -1, -1]).rotate(theta, $L(O, axis));
        cube["101"] = $V([ 1, -1,  1]).rotate(theta, $L(O, axis));
        cube["110"] = $V([ 1,  1, -1]).rotate(theta, $L(O, axis));
        cube["111"] = $V([ 1,  1,  1]).rotate(theta, $L(O, axis));

        if (this.getOption("showVectors")) {
            for (var c in cube) {
                if (cube[c].e(3) < 0) {
                    this.arrow(O, cube[c], "position");
                }
            }
        }

        splitLine(cube["000"], cube["001"], undefined, false);
        splitLine(cube["010"], cube["011"], undefined, false);
        splitLine(cube["100"], cube["101"], undefined, false);
        splitLine(cube["110"], cube["111"], undefined, false);
        splitLine(cube["000"], cube["010"], undefined, false);
        splitLine(cube["010"], cube["110"], undefined, false);
        splitLine(cube["110"], cube["100"], undefined, false);
        splitLine(cube["100"], cube["000"], undefined, false);
        splitLine(cube["001"], cube["011"], undefined, false);
        splitLine(cube["011"], cube["111"], undefined, false);
        splitLine(cube["111"], cube["101"], undefined, false);
        splitLine(cube["101"], cube["001"], undefined, false);

        var groundBorder = [$V([-gS, -gS, 0]), $V([-gS, gS, 0]), $V([gS, gS, 0]), $V([gS, -gS, 0])];
        var groundAlpha = 0.8;
        this.save();
        this.setProp("shapeInsideColor", "rgba(255, 255, 255, " + groundAlpha + ")");
        this.polyLine(groundBorder, true, true);
        this.restore();

        var nGrid = 3;
        for (var i = -nGrid; i <= nGrid; i++) {
            this.line($V([i / nGrid * gS, -gS, 0]), $V([i / nGrid * gS, gS, 0]), "grid");
            this.line($V([-gS, i / nGrid * gS, 0]), $V([gS, i / nGrid * gS, 0]), "grid");
        }
        var faceLine = function(points) {
            var line = [];
            var lastPoint = points[3];
            var lastAbove = (lastPoint.e(3) > 0);
            for (var i = 0; i < 4; i++) {
                var above = (points[i].e(3) > 0);
                if (above !== lastAbove) {
                    var alpha = this.linearDeinterp(points[i].e(3), lastPoint.e(3), 0);
                    line.push(this.linearInterpVector(points[i], lastPoint, alpha));
                }
                lastPoint = points[i];
                lastAbove = above;
            }
            if (line.length === 2) {
                this.line(line[0], line[1], "grid");
            }
        }.bind(this);

        faceLine([cube["000"], cube["001"], cube["011"], cube["010"]]);
        faceLine([cube["100"], cube["101"], cube["111"], cube["110"]]);
        faceLine([cube["000"], cube["001"], cube["101"], cube["100"]]);
        faceLine([cube["010"], cube["011"], cube["111"], cube["110"]]);
        faceLine([cube["000"], cube["010"], cube["110"], cube["100"]]);
        faceLine([cube["001"], cube["011"], cube["111"], cube["101"]]);

        this.polyLine(groundBorder, true, false);
        this.arrow(O, rX);
        this.arrow(O, rY);
        this.arrow(O, rZ);
        if (this.getOption("showLabels")) {
            this.labelLine(O, rX, $V([1, -1]), "TEX:$x$");
            this.labelLine(O, rY, $V([1, 1]), "TEX:$y$");
            this.labelLine(O, rZ, $V([1, 1]), "TEX:$z$");
        }

        if (this.getOption("showVectors")) {
            for (var c in cube) {
                if (cube[c].e(3) >= 0) {
                    this.arrow(O, cube[c], "position");
                }
            }
        }

        splitLine(cube["000"], cube["001"], undefined, true);
        splitLine(cube["010"], cube["011"], undefined, true);
        splitLine(cube["100"], cube["101"], undefined, true);
        splitLine(cube["110"], cube["111"], undefined, true);
        splitLine(cube["000"], cube["010"], undefined, true);
        splitLine(cube["010"], cube["110"], undefined, true);
        splitLine(cube["110"], cube["100"], undefined, true);
        splitLine(cube["100"], cube["000"], undefined, true);
        splitLine(cube["001"], cube["011"], undefined, true);
        splitLine(cube["011"], cube["111"], undefined, true);
        splitLine(cube["111"], cube["101"], undefined, true);
        splitLine(cube["101"], cube["001"], undefined, true);

        if (this.getOption("showAngVel")) {
            this.arrow(O, omegaVec, "angVel");
            if (this.getOption("showLabels")) {
                this.labelLine(O, omegaVec, $V([1, 1]), "TEX:$\\vec{\\omega}$");
            }
        }

    });

    rkr_fc_c.activate3DControl();

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
        this.text(rP, $V([0, -1]), "TEX:$P$");
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

    rkr_fe_c = new PrairieDrawAnim("rkr-fe-c", function(t) {
        this.setUnits(4.5, 3);

        this.addOption("showLabels", true);
        this.addOption("showVelocity", false);

        var O = $V([0, 0, 0]);
        var rX = $V([1, 0, 0]);
        var rY = $V([0, 1, 0]);
        var rZ = $V([0, 0, 1]);
        var gS = 2; // ground size

        var theta = 1.2 * Math.sin(t);
        var omega = 1.2 * Math.cos(t);
        var omegaVec = $V([0, 0, omega]);

        var p = $V([1.2, 0, 0]).rotate(theta, $L(O, Vector.k));
        var v = omegaVec.cross(p);

        if (omegaVec.e(3) < 0) {
            this.arrow(O, omegaVec, "angVel");
            this.labelLine(O, omegaVec, $V([1, 1]), "TEX:$\\vec{\\omega}$");
        }

        var groundBorder = [$V([-gS, -gS, 0]), $V([-gS, gS, 0]), $V([gS, gS, 0]), $V([gS, -gS, 0])];
        var groundAlpha = 0.8;
        this.save();
        this.setProp("shapeInsideColor", "rgba(255, 255, 255, " + groundAlpha + ")");
        this.polyLine(groundBorder, true, true);
        this.restore();

        var nGrid = 3;
        for (var i = -nGrid; i <= nGrid; i++) {
            this.line($V([i / nGrid * gS, -gS, 0]), $V([i / nGrid * gS, gS, 0]), "grid");
            this.line($V([-gS, i / nGrid * gS, 0]), $V([gS, i / nGrid * gS, 0]), "grid");
        }
        this.polyLine(groundBorder, true, false);
        this.arrow(O, rX);
        this.arrow(O, rY);
        this.arrow(O, rZ);
        if (this.getOption("showLabels")) {
            this.labelLine(O, rX, $V([1, -1]), "TEX:$x$");
            this.labelLine(O, rY, $V([1, 1]), "TEX:$y$");
            this.labelLine(O, rZ, $V([1, 1]), "TEX:$z$");
        }

        if (omegaVec.e(3) >= 0) {
            this.arrow(O, omegaVec, "angVel");
            this.labelLine(O, omegaVec, $V([1, 1]), "TEX:$\\vec{\\omega}$");
        }

        this.arrow(O, p, "position");
        this.labelLine(O, p, $V([1, 0]), "TEX:$\\hat{a}$");

        if (this.getOption("showVelocity")) {
            this.arrow(p, p.add(v), "velocity");
            this.labelLine(p, p.add(v), $V([1, 0]), "TEX:$\\dot{\\hat{a}}$");
        }

        this.circleArrow3D(O, 0.7, Vector.k, Vector.i, -omega / 2, omega / 2, "angVel");
        var omegaText = (omega >= 0) ? "TEX:$\\omega$" : "TEX:$-\\omega$";
        this.labelCircleLine3D(omegaText, $V([1, 1]), O, 0.7, Vector.k, Vector.i, -omega / 2, omega / 2);

        this.circleArrow3D(O, 0.5, Vector.k, Vector.i, 0, theta, "angle");
        var thetaText = (theta >= 0) ? "TEX:$\\theta$" : "TEX:$-\\theta$";
        this.labelCircleLine3D(thetaText, $V([0, -1]), O, 0.5, Vector.k, Vector.i, 0, theta);
    });

    rkr_fe_c.activate3DControl();

    rkr_fg_c = new PrairieDrawAnim("rkr-fg-c", function(t) {
        this.setUnits(9, 6);

        this.addOption("showLabels", true);
        this.addOption("showMoving", true);
        this.addOption("showRigid", false);
        this.addOption("showFixed", false);
        this.addOption("showDerivatives", false);

        var O = $V([0, 0]);
        var theta = t - 1.5 * Math.cos(t) + Math.PI / 2;
        var omega = 1 + 1.5 * Math.sin(t);

        var bases = [
            $V([-0.7, -0.7]).rotate(theta, O),
            $V([0.7, 0.2]).rotate(theta, O),
            $V([-0.3, 0.5]).rotate(theta, O),
            $V([0.4, -0.9]).rotate(theta, O),
        ];

        var moveBases = [
            $V([0.4 * Math.sin(0.4 * t), Math.sin(0.9 * t + 0.5)]),
            $V([0.4 * Math.cos(0.6 * t), Math.sin(1.5 * t)]),
            $V([0.4 * Math.sin(0.7 * t + 3), Math.cos(1.3 * t + 3)]),
            $V([0.4 * Math.sin(1.2 * t + 0.8), Math.cos(0.2 * t + 1.2)]),
        ];

        var vecs = [
            $V([0.7, 0.7]).rotate(theta, O),
            $V([0.2, -0.5]).rotate(theta, O),
            $V([-0.6, 0.8]).rotate(theta, O),
            $V([-0.5, -0.4]).rotate(theta, O),
        ];

        var derivatives = [
            vecs[0].rotate(Math.PI / 2, O).x(omega),
            vecs[1].rotate(Math.PI / 2, O).x(omega),
            vecs[2].rotate(Math.PI / 2, O).x(omega),
            vecs[3].rotate(Math.PI / 2, O).x(omega),
        ];

        var offset = $V([0.3 * Math.sin(0.8 * t), Math.sin(2 * 0.8 * t)]);

        var omegaText = (omega >= 0) ? "TEX:$\\omega$" : "TEX:$-\\omega$";

        if (this.getOption("showMoving")) {
            this.save();
            this.translate($V([-3, 0]));
            this.arrow(moveBases[0], moveBases[0].add(vecs[0]), "position");
            this.arrow(moveBases[1], moveBases[1].add(vecs[1]), "acceleration");
            this.arrow(moveBases[2], moveBases[2].add(vecs[2]), "angMom");
            this.arrow(moveBases[3], moveBases[3].add(vecs[3]));
            /*if (this.getOption("showLabels")) {
                this.labelLine(moveBases[0], moveBases[0].add(vecs[0]), $V([1, 0]), "TEX:$\\vec{a}$");
                this.labelLine(moveBases[1], moveBases[1].add(vecs[1]), $V([1, 0]), "TEX:$\\vec{b}$");
                this.labelLine(moveBases[2], moveBases[2].add(vecs[2]), $V([1, 0]), "TEX:$\\vec{c}$");
                this.labelLine(moveBases[3], moveBases[3].add(vecs[3]), $V([1, 0]), "TEX:$\\vec{d}$");
            }*/
            if (this.getOption("showDerivatives")) {
                this.arrow(moveBases[0].add(vecs[0]), moveBases[0].add(vecs[0]).add(derivatives[0]), "velocity");
                this.arrow(moveBases[1].add(vecs[1]), moveBases[1].add(vecs[1]).add(derivatives[1]), "velocity");
                this.arrow(moveBases[2].add(vecs[2]), moveBases[2].add(vecs[2]).add(derivatives[2]), "velocity");
                this.arrow(moveBases[3].add(vecs[3]), moveBases[3].add(vecs[3]).add(derivatives[3]), "velocity");
            }
            this.circleArrow(O, 1, Math.PI / 2 - omega / 2, Math.PI / 2 + omega / 2, "angVel", true, 0.1);
            this.labelCircleLine(O, 1, Math.PI / 2 - omega / 2, Math.PI / 2 + omega / 2, $V([0, 1]), omegaText, true);
            this.restore();
        }

        if (this.getOption("showRigid")) {
            this.save();
            this.translate($V([0, 0]));
            this.translate(offset);
            this.arrow(bases[0], bases[0].add(vecs[0]), "position");
            this.arrow(bases[1], bases[1].add(vecs[1]), "acceleration");
            this.arrow(bases[2], bases[2].add(vecs[2]), "angMom");
            this.arrow(bases[3], bases[3].add(vecs[3]));
            /*if (this.getOption("showLabels")) {
                this.labelLine(bases[0], bases[0].add(vecs[0]), $V([1, 0]), "TEX:$\\vec{a}$");
                this.labelLine(bases[1], bases[1].add(vecs[1]), $V([1, 0]), "TEX:$\\vec{b}$");
                this.labelLine(bases[2], bases[2].add(vecs[2]), $V([1, 0]), "TEX:$\\vec{c}$");
                this.labelLine(bases[3], bases[3].add(vecs[3]), $V([1, 0]), "TEX:$\\vec{d}$");
            }*/
            if (this.getOption("showDerivatives")) {
                this.arrow(bases[0].add(vecs[0]), bases[0].add(vecs[0]).add(derivatives[0]), "velocity");
                this.arrow(bases[1].add(vecs[1]), bases[1].add(vecs[1]).add(derivatives[1]), "velocity");
                this.arrow(bases[2].add(vecs[2]), bases[2].add(vecs[2]).add(derivatives[2]), "velocity");
                this.arrow(bases[3].add(vecs[3]), bases[3].add(vecs[3]).add(derivatives[3]), "velocity");
            }
            this.circleArrow(O, 1, theta + Math.PI / 2 - omega / 2, theta + Math.PI / 2 + omega / 2, "angVel", true, 0.1);
            this.labelCircleLine(O, 1, theta + Math.PI / 2 - omega / 2, theta + Math.PI / 2 + omega / 2, $V([0, 1]), omegaText, true);
            this.restore();
        }

        if (this.getOption("showFixed")) {
            this.save();
            this.translate($V([3, 0]));
            this.arrow(O, vecs[0], "position");
            this.arrow(O, vecs[1], "acceleration");
            this.arrow(O, vecs[2], "angMom");
            this.arrow(O, vecs[3]);
            /*if (this.getOption("showLabels")) {
                this.labelLine(O, vecs[0], $V([1, 0]), "TEX:$\\vec{a}$");
                this.labelLine(O, vecs[1], $V([1, 0]), "TEX:$\\vec{b}$");
                this.labelLine(O, vecs[2], $V([1, 0]), "TEX:$\\vec{c}$");
                this.labelLine(O, vecs[3], $V([1, 0]), "TEX:$\\vec{d}$");
            }*/
            if (this.getOption("showDerivatives")) {
                this.arrow(vecs[0], vecs[0].add(derivatives[0]), "velocity");
                this.arrow(vecs[1], vecs[1].add(derivatives[1]), "velocity");
                this.arrow(vecs[2], vecs[2].add(derivatives[2]), "velocity");
                this.arrow(vecs[3], vecs[3].add(derivatives[3]), "velocity");
            }
            this.circleArrow(O, 1, Math.PI / 2 - omega / 2, Math.PI / 2 + omega / 2, "angVel", true, 0.1);
            this.labelCircleLine(O, 1, Math.PI / 2 - omega / 2, Math.PI / 2 + omega / 2, $V([0, 1]), omegaText, true);
            this.restore();
        }
    });

    rkt_fb_c = new PrairieDrawAnim("rkt-fb-c", function(t) {
        this.setUnits(6.6, 4.4);

        this.addOption("showLabels", true);
        this.addOption("showPosition", true);
        this.addOption("showVelocity", false);
        this.addOption("showAcceleration", false);
        this.addOption("showAccDecomp", false);
        this.addOption("showCenter", false);
        this.addOption("showCircle", false);
        this.addOption("showAngVel", false);
        this.addOption("showAngVelDecomp", false);

        var label = this.getOption("showLabels") ? true : undefined;

        var O = $V([0, 0, 0]);
        var rX = $V([1, 0, 0]);
        var rY = $V([0, 1, 0]);
        var rZ = $V([0, 0, 1]);
        var gS = 2; // ground size

        var groundBorder = [$V([-gS, -gS, 0]), $V([-gS, gS, 0]), $V([gS, gS, 0]), $V([gS, -gS, 0])];
        var nGrid = 3;
        for (var i = -nGrid; i <= nGrid; i++) {
            this.line($V([i / nGrid * gS, -gS, 0]), $V([i / nGrid * gS, gS, 0]), "grid");
            this.line($V([-gS, i / nGrid * gS, 0]), $V([gS, i / nGrid * gS, 0]), "grid");
        }
        this.polyLine(groundBorder, true, false);
        this.arrow(O, rX);
        this.arrow(O, rY);
        this.arrow(O, rZ);
        if (this.getOption("showLabels")) {
            this.labelLine(O, rX, $V([1, -1]), "TEX:$x$");
            this.labelLine(O, rY, $V([1, 1]), "TEX:$y$");
            this.labelLine(O, rZ, $V([1, 1]), "TEX:$z$");
        }

        var f = function(t) {
            return {
                P: $V([1.8 * Math.cos(t / 2), 1.8 * Math.sin(t / 2), 1 - 0.9 * Math.cos(t)])
            };
        }

        var basis = function(t) {
            var val = this.numDiff(f, t);

            var b = {};
            b.r = val.P;
            b.v = val.diff.P;
            b.a = val.ddiff.P;

            b.et = b.v.toUnitVector();
            b.en = this.orthComp(b.a, b.v).toUnitVector();
            b.eb = b.et.cross(b.en);
            return b;
        }.bind(this);

        var b = this.numDiff(basis, t);
        var r = b.r;
        var v = b.v;
        var a = b.a;
        var et = b.et;
        var en = b.en;
        var eb = b.eb;

        var at = this.orthProj(a, et);
        var an = this.orthProj(a, en);

        var rho = Math.pow(v.modulus(), 2) / an.modulus();
        var kappa = 1 / rho;
        var C = r.add(en.x(rho));

        var ebDot = b.diff.eb;
        var tau = -ebDot.dot(en) / v.modulus();
        var omega = et.x(tau * v.modulus()).add(eb.x(kappa * v.modulus()));
        var omegat = this.orthProj(omega, et);
        var omegab = this.orthProj(omega, eb);

        var path = [];
        var nPoints = 100;
        for (var i = 0; i < nPoints; i++) {
            var tTemp = i / nPoints * 4 * Math.PI;
            path.push(f(tTemp).P);
        }
        this.polyLine(path, true, false);

        this.point(r);
        this.arrow(r, r.add(et));
        this.arrow(r, r.add(en));
        this.arrow(r, r.add(eb));
        this.labelLine(r, r.add(et), $V([1, 0]), label && "TEX:$\\hat{e}_t$");
        this.labelLine(r, r.add(en), $V([1, 0]), label && "TEX:$\\hat{e}_n$");
        this.labelLine(r, r.add(eb), $V([1, 0]), label && "TEX:$\\hat{e}_b$");
        if (this.getOption("showCircle")) {
            this.save();
            this.setProp("shapeOutlineColor", this.getProp("rotationColor"));
            this.arc3D(C, rho, eb);
            this.restore();
        }
        if (this.getOption("showCenter")) {
            this.save();
            this.setProp("shapeOutlineColor", this.getProp("rotationColor"));
            this.line(C, r);
            this.labelLine(C, r, $V([0, 1]), label && "TEX:$\\rho$");
            this.point(C);
            this.labelIntersection(C, [r], label && "TEX:$C$");
            this.restore();
        }

        if (this.getOption("showPosition")) {
            this.arrow(O, r, "position");
            this.labelLine(O, r, $V([0, 1]), label && "TEX:$\\vec{r}$");
        }
        if (this.getOption("showVelocity")) {
            this.arrow(r, r.add(v), "velocity");
            this.labelLine(r, r.add(v), $V([0, 1]), label && "TEX:$\\vec{v}$");
        }
        if (this.getOption("showAcceleration")) {
            this.arrow(r, r.add(a), "acceleration");
            this.labelLine(r, r.add(a), $V([0, 1]), label && "TEX:$\\vec{a}$");
        }
        if (this.getOption("showAccDecomp")) {
            this.arrow(r, r.add(at), "acceleration");
            this.arrow(r, r.add(an), "acceleration");
            this.labelLine(r, r.add(at), $V([0, 1]), label && "TEX:$\\vec{a}_t$");
            this.labelLine(r, r.add(an), $V([0, 1]), label && "TEX:$\\vec{a}_n$");
        }
        if (this.getOption("showAngVel")) {
            this.arrow(r, r.add(omega), "angVel");
            this.labelLine(r, r.add(omega), $V([0, 1]), label && "TEX:$\\vec\\omega$");
        }
        if (this.getOption("showAngVelDecomp")) {
            this.arrow(r, r.add(omegat), "angVel");
            this.arrow(r, r.add(omegab), "angVel");
            this.labelLine(r, r.add(omegat), $V([0, 1]), label && "TEX:$\\vec\\omega_t$");
            this.labelLine(r, r.add(omegab), $V([0, 1]), label && "TEX:$\\vec\\omega_b$");
        }
    });

    rkt_fb_c.activate3DControl();

    rkt_ft_c = new PrairieDrawAnim("rkt-ft-c", function(t) {
        this.setUnits(12, 8);

        this.addOption("movement", "circle");
        this.addOption("showLabels", true);
        this.addOption("showPath", false);
        this.addOption("showCenter", false);
        this.addOption("showCircle", false);
        this.addOption("showPosition", true);
        this.addOption("showVelocity", false);
        this.addOption("showAcceleration", false);
        this.addOption("showAccDecomp", false);
        this.addOption("showAngVel", false);
        this.addOption("origin", "O1");

        var f;
        if (this.getOption("movement") === "arc") {
            f = function(t) {
                t = -t;
                t += 5;
                return {
                    "period": 2 * Math.PI / 0.5,
                    "P": this.polarToRect($V([2 - 0.5 * Math.cos(0.5 * t) - 0.5 * Math.cos(t), Math.PI / 2 + 2.5 * Math.sin(0.5 * t)]))
                };
            };
        } else if (this.getOption("movement") === "circle") {
            f = function(t) {
                return {
                    "period": 2 * Math.PI / 0.5,
                    "P": this.polarToRect($V([2.5, 0.5 * t]))
                };
            };
        } else if (this.getOption("movement") === "varCircle") {
            f = function(t) {
                return {
                    "period": 2 * Math.PI / 0.5,
                    "P": this.polarToRect($V([2.5, -0.5 * t + 0.2 * Math.sin(t)]))
                };
            };
        } else if (this.getOption("movement") === "ellipse") {
            f = function(t) {
                t += 3;
                return {
                    "period": 2 * Math.PI / 0.7,
                    "P": $V([Math.cos(0.7 * t), 3 * Math.sin(0.7 * t)])
                };
            };
        } else if (this.getOption("movement") === "trefoil") {
            f = function(t) {
                t += 4;
                return {
                    "period": 2 * Math.PI / 0.4,
                    "P": $V([Math.cos(0.4 * t) - 2 * Math.cos(2 * 0.4 * t), Math.sin(0.4 * t) + 2 * Math.sin(2 * 0.4 * t)])
                };
            };
        } else if (this.getOption("movement") === "eight") {
            f = function(t) {
                t += 2.5 * Math.PI;
                return {
                    "period": 2 * Math.PI / 0.5,
                    "P": this.polarToRect($V([3 * Math.cos(0.5 * t), Math.sin(0.5 * t)]))
                };
            };
        } else if (this.getOption("movement") === "comet") {
            f = function(t) {
                t += 1;
                var T = 2 * Math.PI / 0.7; // period
                var a = 2; // semi-major axis
                var e = 0.5; // eccentricity
                var b = a * Math.sqrt(1 - e*e); // semi-minor axis
                var M = 2 * Math.PI * t / T; // mean anomaly
                var E = M; // eccentric anomaly
                // solve M = E - e * sin(E) for E with Newton's method
                for (var i = 0; i < 5; i++) {
                    E = E + (M - (E - e * Math.sin(E))) / (1 - e * Math.cos(E));
                }
                return {
                "period": T,
                "P": $V([a * (Math.cos(E) - e), b * Math.sin(E)])
            };};
        } else if (this.getOption("movement") === "pendulum") {
            f = function(t) {
                t -= 1.5;
                return {
                    "period": 2 * Math.PI / 0.6,
                    "P": this.polarToRect($V([2.5, -Math.PI / 2 + Math.cos(0.6 * t)]))
                };
            };
        }
        f = f.bind(this);

        var O1 = $V([0, 0]);
        var O2 = $V([-3, -2]);

        var O;
        if (this.getOption("origin") === "O1") {
            O = O1;
        } else {
            O = O2;
        }

        var val = this.numDiff(f, t);
        var period = val.period;
        var r = val.P;
        var v = val.diff.P;
        var a = val.ddiff.P;

        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        var et = v.toUnitVector();
        var en = this.orthComp(a, v).toUnitVector();

        var vt = this.orthProj(v, et);
        var vn = this.orthProj(v, en);
        var at = this.orthProj(a, et);
        var an = this.orthProj(a, en);

        var label = this.getOption("showLabels") ? true : undefined;

        var rho = Math.pow(v.modulus(), 2) / an.modulus();
        var C = r.add(en.x(rho));

        var kappa = 1 / rho;
        var omega = v.modulus() * kappa;

        if (this.getOption("showPath")) {
            var n = 200;
            var path = [], s;
            for (var i = 0; i < n; i++) {
                s = i / n * period;
                path.push(f(s).P);
            }
            this.polyLine(path, true, false);
        }
        this.point(O1);
        this.text(O1, $V([1, 1]), label && "TEX:$O_1$");
        this.point(O2);
        this.text(O2, $V([1, 1]), label && "TEX:$O_2$");
        this.point(r);
        this.labelIntersection(r, [O, r.add(et), r.add(en)], label && "TEX:$P$");
        if (this.getOption("showCircle")) {
            this.save();
            this.setProp("shapeOutlineColor", this.getProp("rotationColor"));
            this.arc(C, rho);
            this.restore();
        }
        if (this.getOption("showCenter")) {
            this.save();
            this.setProp("shapeOutlineColor", this.getProp("rotationColor"));
            this.line(C, r);
            this.labelLine(C, r, $V([0, 1]), label && "TEX:$\\rho$");
            this.point(C);
            this.labelIntersection(C, [r], label && "TEX:$C$");
            this.restore();
        }
        if (this.getOption("showPosition")) {
            this.arrow(O, r, "position");
            this.labelLine(O, r, $V([0, 1]), label && "TEX:$\\vec{r}$");
        }
        this.arrow(r, r.add(et));
        this.arrow(r, r.add(en));
        this.labelLine(r, r.add(et), $V([1, 1]), label && "TEX:$\\hat{e}_t$");
        this.labelLine(r, r.add(en), $V([1, 1]), label && "TEX:$\\hat{e}_n$");
        if (this.getOption("showVelocity")) {
            this.arrow(r, r.add(v), "velocity");
            this.labelLine(r, r.add(v), $V([0, -1]), label && "TEX:$\\vec{v}$");
        }
        if (this.getOption("showAcceleration")) {
            this.arrow(r, r.add(a), "acceleration");
            this.labelLine(r, r.add(a), $V([1, 0]), label && "TEX:$\\vec{a}$");
        }
        if (this.getOption("showAccDecomp") && at.modulus() > 1e-3) {
            this.arrow(r, r.add(at), "acceleration");
            this.labelLine(r, r.add(at), $V([1, 1]), label && "TEX:$\\vec{a}_t$");
        }
        if (this.getOption("showAccDecomp") && an.modulus() > 1e-3) {
            this.arrow(r, r.add(an), "acceleration");
            this.labelLine(r, r.add(an), $V([1, 1]), label && "TEX:$\\vec{a}_n$");
        }
        if (this.getOption("showAngVel") && Math.abs(omega) > 1e-3) {
            var ebSign = et.to3D().cross(en.to3D()).dot(Vector.k);
            var avOffset = (this.getOption("showPath") || this.getOption("showCircle")) ? Math.PI / 2 : 3 * Math.PI / 4;
            var a0 = this.angleOf(et) - ebSign * omega - ebSign * avOffset;
            var a1 = this.angleOf(et) + ebSign * omega - ebSign * avOffset;
            var omegaLabel = (ebSign > 0) ? "TEX:$\\omega$" : "TEX:$-\\omega$";
            this.circleArrow(r, 0.6, a0, a1, "angVel");
            this.labelCircleLine(r, 0.6, a0, a1, $V([0, 1]), label && omegaLabel);
        }
    });

    rkt_ft_c.registerOptionCallback("movement", function (value) {
        rkt_ft_c.resetTime(false);
        rkt_ft_c.resetOptionValue("showPath");
        rkt_ft_c.resetOptionValue("showVelocity");
        rkt_ft_c.resetOptionValue("showAcceleration");
        rkt_ft_c.resetOptionValue("showAccDecomp");
        rkt_ft_c.resetOptionValue("showCenter");
        rkt_ft_c.resetOptionValue("showCircle");
    });

    rkt_ft_c.registerOptionCallback("origin", function (value) {
        rkt_ft_c.setOption("showPosition", true);
    });

    aov_fe_c = new PrairieDrawAnim("aov-fe-c", function(t) {
        this.setUnits(40, 20);

        var daysInYear = 8; // solar days
        var omega = 0.5; // orbital angular velocity
        var orbitRad = 8;
        var earthRad = 1;
        var sunRad = 2;
        var starRad = 0.8;
        var sunColor = "rgb(200, 150, 0)";
        var starColor = "rgb(0, 100, 150)";

        var states = [];
        var transTimes = [];
        var holdTimes = [];
        var interps = {};
        var names = [];
        var i, theta0, theta1;
        var that = this;
        var thetaOfState = function(iState) {
            if (iState % 2 === 0) {
                // solar day
                return that.linearInterp(0, 2 * Math.PI, iState / 2 / daysInYear);
            } else {
                // sidereal day
                return that.linearInterp(0, 2 * Math.PI, (iState + 1) / 2 / (daysInYear + 1));
            }
        };
        for (i = 0; i <= 2 * daysInYear; i++) {
            theta0 = thetaOfState(i);
            theta1 = thetaOfState(i + 1);
            states.push({"theta": theta0});
            transTimes.push((theta1 - theta0) / omega);
            if (i === 0) {
                holdTimes.push(0);
            } else if (i === 2 * daysInYear) {
                holdTimes.push(1);
            } else {
                holdTimes.push(0.2);
            }
            names.push("");
        }

        var state = this.newSequence("motion", states, transTimes, holdTimes, interps, names, t);
        i = state.index;
        theta = state.theta;
        var earthTheta = theta * (daysInYear + 1);

        var O = $V([0, 0]);
        var P = $V([Math.cos(theta), Math.sin(theta)]).x(orbitRad);

        // stars
        var drawStar = function(pos) {
            that.save();
            that.translate(pos);
            that.setProp("shapeOutlineColor", starColor);
            that.line($V([-starRad, 0]), $V([starRad, 0]));
            that.line($V([0, -starRad]), $V([0, starRad]));
            that.line($V([-starRad * 0.7, -starRad * 0.7]), $V([starRad * 0.7, starRad * 0.7]));
            that.line($V([starRad * 0.7, -starRad * 0.7]), $V([-starRad * 0.7, starRad * 0.7]));
            that.restore();
        }
        drawStar($V([-18, 5]));
        drawStar($V([-16, 8]));
        drawStar($V([-17, -8]));
        drawStar($V([-15, 2]));
        drawStar($V([-16.5, -1]));
        drawStar($V([-15.5, 4]));
        drawStar($V([-17.5, 7]));
        drawStar($V([-15.2, -6]));
        drawStar($V([-16.3, -3]));
        drawStar($V([-17.4, -7]));

        // earth-sun system
        this.save();
        this.translate($V([10, 0]));

        // line to sun
        if (!state.inTransition && i % 2 === 0 && i > 0) {
            this.save();
            if (i === 2 * daysInYear) {
                this.setProp("shapeOutlineColor", starColor);
                this.line(P, $V([-40, P.e(2)]));
            }
            this.setProp("shapeOutlineColor", sunColor);
            this.line(O, P);
            this.restore();
        }

        // line to stars
        if (!state.inTransition && i % 2 === 1) {
            this.save();
            this.setProp("shapeOutlineColor", starColor);
            this.line(P, $V([-40, P.e(2)]));
            this.restore();
        }

        // sun
        this.save();
        this.setProp("pointRadiusPx", 20);
        this.setProp("shapeInsideColor", "rgb(255, 255, 0)");
        this.setProp("shapeOutlineColor", sunColor);
        this.arc(O, sunRad, undefined, undefined, true);
        this.restore();

        // earth
        this.save();
        this.translate(P);
        this.rotate(earthTheta);
        this.arc(O, earthRad);
        this.arrow(O, $V([-2.2 * earthRad, 0]));
        this.restore();

        this.restore(); // end of earth-sun system

        var iSolar = Math.floor(i / 2);
        var iSidereal = Math.floor((i + 1) / 2) + Math.floor(i / 2 / daysInYear);
        this.save();
        this._ctx.font = "16px sans-serif";
        this.text($V([-12, 7.5]), $V([-1,-1]), "Solar days: " + iSolar.toFixed());
        this.text($V([-12, 6]), $V([-1,-1]), "Sidereal days: " + iSidereal.toFixed());
        this.restore();
    });

    aov_fd_c = new PrairieDrawAnim("aov-fd-c", function(t) {
        this.setUnits(40, 20);

        var daysInYear = 8; // solar days
        var orbitRad = 16;
        var earthRad = 1;
        var sunRad = 2;
        var starRad = 0.8;
        var sunColor = "rgb(200, 150, 0)";
        var starColor = "rgb(0, 100, 150)";

        var theta0 = 0;
        var theta1 = Math.PI / 8;
        var theta2 = Math.PI / 5;

        var earthTheta0 = 0;
        var earthTheta1 = 0;
        var earthTheta2 = theta2;

        var O = $V([0, 0]);
        var P0 = $V([1, 0]).x(orbitRad);
        var P1 = $V([Math.cos(theta1), Math.sin(theta1)]).x(orbitRad);
        var P2 = $V([Math.cos(theta2), Math.sin(theta2)]).x(orbitRad);

        // earth-sun system
        this.save();
        this.translate($V([-11, -5]));

        // line to stars
        this.save();
        this.setProp("shapeOutlineColor", starColor);
        this.line(P0, $V([-40, P0.e(2)]));
        this.line(P1, $V([-40, P1.e(2)]));
        this.setProp("shapeOutlineColor", "black");
        this.setProp("shapeStrokePattern", "dashed");
        this.line(P2, $V([-40, P2.e(2)]));
        this.restore();

        // line to sun
        this.save();
        this.setProp("shapeOutlineColor", sunColor);
        this.line(O, P0);
        this.line(O, P2);
        this.setProp("shapeOutlineColor", "black");
        this.setProp("shapeStrokePattern", "dashed");
        this.line(O, P1);
        this.line(P0, P0.add(P0.toUnitVector().x(6 * earthRad)));
        this.line(P1, P1.add(P1.toUnitVector().x(6 * earthRad)));
        this.line(P2, P2.add(P2.toUnitVector().x(6 * earthRad)));
        this.restore();

        // sun
        this.save();
        this.setProp("pointRadiusPx", 20);
        this.setProp("shapeInsideColor", "rgb(255, 255, 0)");
        this.setProp("shapeOutlineColor", sunColor);
        this.arc(O, sunRad, undefined, undefined, true);
        this.restore();

        // earths
        var Ps = [P0, P1, P2];
        var thetas = [theta0, theta1, theta2];
        var earthThetas = [earthTheta0, earthTheta1, earthTheta2];
        for (i = 0; i < 3; i++) {
            this.save();
            this.translate(Ps[i]);
            this.arc(O, earthRad, undefined, undefined, true);
            this.save();
            this.rotate(earthThetas[i]);
            this.arrow(O, $V([-2.2 * earthRad, 0]));
            this.restore();
            this.save();
            this.rotate(thetas[i]);
            this.circleArrow(O, 2 * earthRad, -1, 1, "angVel", true);
            if (i === 0) {
                this.labelCircleLine(O, 2 * earthRad, -1, 1, $V([-1, 1]), "TEX:$\\omega_{\\rm E}$", true);
            }
            this.restore();
            this.restore();
        }

        // days
        this.circleArrow(O, orbitRad + 4 * earthRad, 0, theta2, undefined, true, 0.02);
        this.labelCircleLine(O, orbitRad + 4 * earthRad, 0, theta2, $V([0.6, 1.3]), "TEX:solar day", true);
        this.circleArrow(O, orbitRad + 5 * earthRad, 0, theta1, undefined, true, 0.02);
        this.labelCircleLine(O, orbitRad + 5 * earthRad, 0, theta1, $V([0, 1.1]), "TEX:sidereal day", true);

        // orbital velocity
        this.circleArrow(O, 3 * sunRad, -0.3, 1, "angVel", true, 0.05);
        this.labelCircleLine(O, 3 * sunRad, -0.3, 1, $V([-1, 0]), "TEX:$\\omega_{\\rm S}$", true);

        this.restore(); // end of earth-sun system
    });

    rkv_fp_c = new PrairieDrawAnim("rkv-fp-c", function(t) {
        this.setUnits(8, 4);

        var O = $V([0, 0]);
        var P = $V([3, 2.5]).add($V([2 * Math.sin(t - 0.7), 0.5 * Math.cos(t - 0.7)]));
        var Q = $V([5, 0.6]).add($V([1.4 * Math.cos(0.7 * t), 0.5 * Math.cos(0.7 * 2 * t)]));

        var e1 = $V([1, 0]);
        var e2 = $V([0, 1]);

        this.translate($V([-3.5, -1.5]));

        this.arrow(O, O.add(e1));
        this.arrow(O, O.add(e2));
        this.labelLine(O, O.add(e1), $V([1, -1]), "TEX:$\\hat\\imath$");
        this.labelLine(O, O.add(e2), $V([1, 1]), "TEX:$\\hat\\jmath$");
        this.text(O, $V([0.5, 1]), "TEX:$O$");

        this.arrow(O, P, "position");
        this.point(P);
        this.text(P, $V([-1, -1]), "TEX:$P$");

        this.arrow(O, Q, "position");
        this.point(Q);
        this.text(Q, $V([-1, 1]), "TEX:$Q$");

        this.arrow(P, Q, "position");
        this.labelLine(O, P, $V([0, 1]), "TEX:$\\vec{r}_{P}$");
        this.labelLine(O, Q, $V([0, -1]), "TEX:$\\vec{r}_{Q}$");
        this.labelLine(P, Q, $V([0, 1]), "TEX:$\\vec{r}_{PQ}$");
    });

    rkv_fo_c = new PrairieDrawAnim("rkv-fo-c", function(t) {
        this.setUnits(8, 4);

        this.addOption("showLabels", true);
        this.addOption("r1Basis", "none");
        this.addOption("r2Basis", "none");

        var O1 = $V([-2.5, -1.1]);
        var O2 = $V([2, -1.5]);
        var P = $V([Math.sin(t), 0.8 + 0.5 * Math.sin(2 * t)]);

        var r1 = P.subtract(O1);
        var r2 = P.subtract(O2);

        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        var eu = ei.rotate(Math.PI / 6, $V([0, 0]));
        var ev = ej.rotate(Math.PI / 6, $V([0, 0]));

        var e11, e12, e21, e22;
        var r11Label, r21Label, r21Label, r22Label;
        if (this.getOption("r1Basis") === "ij") {
            e11 = ei;
            e12 = ej;
            r11Label = "TEX:$r_{1i} \\hat\\imath$";
            r12Label = "TEX:$r_{1j} \\hat\\jmath$";
        } else {
            e11 = eu;
            e12 = ev;
            r11Label = "TEX:$r_{1u} \\hat{u}$";
            r12Label = "TEX:$r_{1v} \\hat{v}$";
        }
        if (this.getOption("r2Basis") === "ij") {
            e21 = ei;
            e22 = ej;
            r21Label = "TEX:$r_{2i} \\hat\\imath$";
            r22Label = "TEX:$r_{2j} \\hat\\jmath$";
        } else {
            e21 = eu;
            e22 = ev;
            r21Label = "TEX:$r_{2u} \\hat{u}$";
            r22Label = "TEX:$r_{2v} \\hat{v}$";
        }

        var r11c = r1.dot(e11);
        var r12c = r1.dot(e12);
        var r21c = r2.dot(e21);
        var r22c = r2.dot(e22);
        var r11 = e11.x(r11c);
        var r12 = e12.x(r12c);
        var r21 = e21.x(r21c);
        var r22 = e22.x(r22c);

        this.arrow(O1, O1.add(ei));
        this.arrow(O1, O1.add(ej));
        if (this.getOption("showLabels")) {
            this.labelLine(O1, O1.add(ei), $V([1, 1]), "TEX:$\\hat\\imath$");
            this.labelLine(O1, O1.add(ej), $V([1, -1]), "TEX:$\\hat\\jmath$");
            this.text(O1, $V([0.5, 1]), "TEX:$O_1$");
        }

        this.arrow(O2, O2.add(eu));
        this.arrow(O2, O2.add(ev));
        if (this.getOption("showLabels")) {
            this.labelLine(O2, O2.add(eu), $V([1, -1]), "TEX:$\\hat{u}$");
            this.labelLine(O2, O2.add(ev), $V([1, -1]), "TEX:$\\hat{v}$");
            this.text(O2, $V([-0.5, 1]), "TEX:$O_2$");
        }

        this.point(P);
        this.arrow(O1, P, "position");
        this.arrow(O2, P, "position");
        this.arrow(O1, O2, "position");
        if (this.getOption("showLabels")) {
            this.text(P, $V([0, -1]), "TEX:$P$");
            this.labelLine(O1, P, $V([0, -1]), "TEX:$\\vec{r}_{O_1P}$");
            this.labelLine(O2, P, $V([0, 1]), "TEX:$\\vec{r}_{O_2P}$");
            this.labelLine(O1, O2, $V([0, -1]), "TEX:$\\vec{r}_{O_1O_2}$");
        }

        if (this.getOption("r1Basis") !== "none") {
            this.arrow(O1, O1.add(r12), "position");
            this.arrow(O1.add(r12), P, "position");
            if (this.getOption("showLabels")) {
                this.labelLine(O1, O1.add(r12), $V([0, this.sign(r12c)]), r12Label);
                this.labelLine(O1.add(r12), P, $V([0, 1]), r11Label);
            }
        }
        if (this.getOption("r2Basis") !== "none") {
            this.arrow(O2, O2.add(r22), "position");
            this.arrow(O2.add(r22), P, "position");
            if (this.getOption("showLabels")) {
                this.labelLine(O2, O2.add(r22), $V([0, -1]), r22Label);
                this.labelLine(O2.add(r22), P, $V([0, this.sign(r21c)]), r21Label);
            }
        }
    });

    rkv_fa_c = new PrairieDrawAnim("rkv-fa-c", function(t) {
        this.setUnits(12, 8);

        this.addOption("movement", "circle");
        this.addOption("showLabels", true);
        this.addOption("showZeroTime", false);
        this.addOption("showPath", false);
        this.addOption("showVelocity", false);
        this.addOption("showAcceleration", false);
        this.addOption("showAnchoredVelocity", false);
        this.addOption("showVelDecomp", false);
        this.addOption("showAccDecomp", false);

        var O = $V([0, 0]);
        var f;
        if (this.getOption("movement") === "arc") {
            f = function(t) {
                t = -t;
                t += 5;
                return {
                    "period": 2 * Math.PI / 0.5,
                    "P": this.polarToRect($V([2 - 0.5 * Math.cos(0.5 * t) - 0.5 * Math.cos(t), Math.PI / 2 + 2.5 * Math.sin(0.5 * t)]))
                };
            };
        } else if (this.getOption("movement") === "circle") {
            f = function(t) {
                t += 2.5;
                return {
                    "period": 2 * Math.PI / 0.5,
                    "P": this.polarToRect($V([3, 0.5 * t]))
                };
            };
        } else if (this.getOption("movement") === "varCircle") {
            f = function(t) {
                t += 1.8;
                return {
                    "period": 2 * Math.PI / 0.5,
                    "P": this.polarToRect($V([3, -0.5 * t + 0.2 * Math.sin(t)]))
                };
            };
        } else if (this.getOption("movement") === "ellipse") {
            f = function(t) {
                t += 3;
                return {
                    "period": 2 * Math.PI / 0.7,
                    "P": $V([Math.cos(0.7 * t), 3 * Math.sin(0.7 * t)])
                };
            };
        } else if (this.getOption("movement") === "trefoil") {
            f = function(t) {
                t += 4;
                return {
                    "period": 2 * Math.PI / 0.4,
                    "P": $V([Math.cos(0.4 * t) - 2 * Math.cos(2 * 0.4 * t), Math.sin(0.4 * t) + 2 * Math.sin(2 * 0.4 * t)])
                };
            };
        } else if (this.getOption("movement") === "eight") {
            f = function(t) {
                t += 2.5 * Math.PI;
                return {
                    "period": 2 * Math.PI / 0.5,
                    "P": this.polarToRect($V([3 * Math.cos(0.5 * t), Math.sin(0.5 * t)]))
                };
            };
        } else if (this.getOption("movement") === "comet") {
            f = function(t) {
                t += 1;
                var T = 2 * Math.PI / 0.7; // period
                var a = 2; // semi-major axis
                var e = 0.5; // eccentricity
                var b = a * Math.sqrt(1 - e*e); // semi-minor axis
                var M = 2 * Math.PI * t / T; // mean anomaly
                var E = M; // eccentric anomaly
                // solve M = E - e * sin(E) for E with Newton's method
                for (var i = 0; i < 5; i++) {
                    E = E + (M - (E - e * Math.sin(E))) / (1 - e * Math.cos(E));
                }
                return {
                "period": T,
                "P": $V([a * (Math.cos(E) - e), b * Math.sin(E)])
            };};
        } else if (this.getOption("movement") === "pendulum") {
            f = function(t) {
                t -= 1.5;
                return {
                    "period": 2 * Math.PI / 0.6,
                    "P": this.polarToRect($V([3, -Math.PI / 2 + Math.cos(0.6 * t)]))
                };
            };
        }
        f = f.bind(this);

        var display = function(t, zeroTime) {
            var val = this.numDiff(f, t);
            var period = val.period;
            var r = val.P;
            var v = val.diff.P;
            var a = val.ddiff.P;

            var vp = this.orthProj(v, r);
            var vc = this.orthComp(v, r);
            var ap = this.orthProj(a, v);
            var ac = this.orthComp(a, v);

            var OLabel, PLabel, rLabel, vLabel, aLabel, vProjLabel, vCompLabel, aProjLabel, aCompLabel;
            if (this.getOption("showLabels")) {
                if (zeroTime) {
                    PLabel = "TEX:$P(0)$";
                    rLabel = "TEX:$\\vec{r}(0)$";
                    vLabel = "TEX:$\\vec{v}(0)$";
                    aLabel = "TEX:$\\vec{a}(0)$";
                    vProjLabel = "TEX:$\\vec{v}_\\text{proj}(0)$";
                    vCompLabel = "TEX:$\\vec{v}_\\text{comp}(0)$";
                    aProjLabel = "TEX:$\\vec{a}_\\text{proj}(0)$";
                    aCompLabel = "TEX:$\\vec{a}_\\text{comp}(0)$";
                } else {
                    OLabel = "TEX:$O$";
                    PLabel = "TEX:$P$";
                    rLabel = "TEX:$\\vec{r}$";
                    vLabel = "TEX:$\\vec{v}$";
                    aLabel = "TEX:$\\vec{a}$";
                    vProjLabel = "TEX:$\\vec{v}_\\text{proj}$";
                    vCompLabel = "TEX:$\\vec{v}_\\text{comp}$";
                    aProjLabel = "TEX:$\\vec{a}_\\text{proj}$";
                    aCompLabel = "TEX:$\\vec{a}_\\text{comp}$";
                }
            }

            this.save();
            this.translate($V([-2, 0]));
            if (this.getOption("showPath") && !zeroTime) {
                var n = 200;
                var path = [], s;
                for (var i = 0; i < n; i++) {
                    s = i / n * period;
                    path.push(f(s).P);
                }
                this.polyLine(path, true, false);
            }
            this.point(O);
            this.text(O, $V([1, 1]), OLabel);
            this.point(r);
            this.labelIntersection(r, [O, r.add(v)], PLabel);
            this.arrow(O, r, "position");
            this.labelLine(O, r, $V([0, 1]), rLabel);
            if (this.getOption("showVelocity")) {
                this.arrow(r, r.add(v), "velocity");
                this.labelLine(r, r.add(v), $V([0, -1]), vLabel);
            }
            if (this.getOption("showAcceleration")) {
                this.arrow(r.add(v), r.add(v).add(a), "acceleration");
                this.labelLine(r.add(v), r.add(v).add(a), $V([1, 0]), aLabel);
            }
            if (this.getOption("showVelDecomp")) {
                this.arrow(r, r.add(vp), "velocity");
                this.arrow(r, r.add(vc), "velocity");
                this.labelLine(r, r.add(vp), $V([1, 1]), vProjLabel);
                this.labelLine(r, r.add(vc), $V([1, 1]), vCompLabel);
            }
            if (this.getOption("showAccDecomp")) {
                this.arrow(r.add(v), r.add(v).add(ap), "acceleration");
                this.arrow(r.add(v), r.add(v).add(ac), "acceleration");
                this.labelLine(r.add(v), r.add(v).add(ap), $V([1, 1]), aProjLabel);
                this.labelLine(r.add(v), r.add(v).add(ac), $V([1, 1]), aCompLabel);
            }
            this.restore();

            if (this.getOption("showAnchoredVelocity")) {
                this.save();
                this.translate($V([4, 0]));
                if (this.getOption("showPath") && !zeroTime) {
                    var n = 200;
                    var path = [], s;
                    for (var i = 0; i < n; i++) {
                        s = i / n * period;
                        path.push(this.numDiff(f, s).diff.P);
                    }
                    this.save();
                    this.setProp("shapeOutlineColor", "rgb(0, 100, 0)");
                    this.polyLine(path, true, false);
                    this.restore();
                }
                this.arrow(O, v, "velocity");
                this.labelLine(O, v, $V([0, -1]), vLabel);
                if (this.getOption("showAcceleration")) {
                    this.arrow(v, v.add(a), "acceleration");
                    this.labelLine(v, v.add(a), $V([1, 0]), aLabel);
                }
                if (this.getOption("showAccDecomp")) {
                    this.arrow(v, v.add(ap), "acceleration");
                    this.arrow(v, v.add(ac), "acceleration");
                    this.labelLine(v, v.add(ap), $V([1, 1]), aProjLabel);
                    this.labelLine(v, v.add(ac), $V([1, 1]), aCompLabel);
                }
                this.restore();
            }
        }.bind(this);

        if (this.getOption("showZeroTime")) {
            display(0, true);
        }
        display(t, false);

    });

    rkv_fa_c.registerOptionCallback("movement", function (value) {
        rkv_fa_c.resetTime(false);
        rkv_fa_c.resetOptionValue("showPath");
        rkv_fa_c.resetOptionValue("showVelocity");
        rkv_fa_c.resetOptionValue("showAcceleration");
        rkv_fa_c.resetOptionValue("showAnchoredVelocity");
        rkv_fa_c.resetOptionValue("showVelDecomp");
        rkv_fa_c.resetOptionValue("showAccDecomp");
    });

    rkv_fa_c.registerOptionCallback("showAcceleration", function (value) {
        if (value) {
            rkv_fa_c.setOption("showVelocity", true);
        }
    });

    rkv_fa_c.registerOptionCallback("showAccDecomp", function (value) {
        if (value) {
            rkv_fa_c.setOption("showVelocity", true);
        }
    });

    rkv_fr_c = new PrairieDrawAnim("rkv-fr-c", function(t) {
        this.setUnits(12, 8);

        this.addOption("movement", "circle");
        this.addOption("showLabels", true);
        this.addOption("showPath", false);
        this.addOption("showVelocity", false);
        this.addOption("showAcceleration", false);
        this.addOption("showVelDecomp", false);
        this.addOption("showAccDecomp", false);
        this.addOption("origin", "O1");

        var f;
        if (this.getOption("movement") === "arc") {
            f = function(t) {
                t = -t;
                t += 5;
                return {
                    "period": 2 * Math.PI / 0.5,
                    "P": this.polarToRect($V([2 - 0.5 * Math.cos(0.5 * t) - 0.5 * Math.cos(t), Math.PI / 2 + 2.5 * Math.sin(0.5 * t)]))
                };
            };
        } else if (this.getOption("movement") === "circle") {
            f = function(t) {
                return {
                    "period": 2 * Math.PI / 0.5,
                    "P": this.polarToRect($V([2.5, 0.5 * t]))
                };
            };
        } else if (this.getOption("movement") === "varCircle") {
            f = function(t) {
                return {
                    "period": 2 * Math.PI / 0.5,
                    "P": this.polarToRect($V([2.5, -0.5 * t + 0.2 * Math.sin(t)]))
                };
            };
        } else if (this.getOption("movement") === "ellipse") {
            f = function(t) {
                t += 3;
                return {
                    "period": 2 * Math.PI / 0.7,
                    "P": $V([Math.cos(0.7 * t), 3 * Math.sin(0.7 * t)])
                };
            };
        } else if (this.getOption("movement") === "trefoil") {
            f = function(t) {
                t += 4;
                return {
                    "period": 2 * Math.PI / 0.4,
                    "P": $V([Math.cos(0.4 * t) - 2 * Math.cos(2 * 0.4 * t), Math.sin(0.4 * t) + 2 * Math.sin(2 * 0.4 * t)])
                };
            };
        } else if (this.getOption("movement") === "eight") {
            f = function(t) {
                t += 2.5 * Math.PI;
                return {
                    "period": 2 * Math.PI / 0.5,
                    "P": this.polarToRect($V([3 * Math.cos(0.5 * t), Math.sin(0.5 * t)]))
                };
            };
        } else if (this.getOption("movement") === "comet") {
            f = function(t) {
                t += 1;
                var T = 2 * Math.PI / 0.7; // period
                var a = 2; // semi-major axis
                var e = 0.5; // eccentricity
                var b = a * Math.sqrt(1 - e*e); // semi-minor axis
                var M = 2 * Math.PI * t / T; // mean anomaly
                var E = M; // eccentric anomaly
                // solve M = E - e * sin(E) for E with Newton's method
                for (var i = 0; i < 5; i++) {
                    E = E + (M - (E - e * Math.sin(E))) / (1 - e * Math.cos(E));
                }
                return {
                "period": T,
                "P": $V([a * (Math.cos(E) - e), b * Math.sin(E)])
            };};
        } else if (this.getOption("movement") === "pendulum") {
            f = function(t) {
                t -= 1.5;
                return {
                    "period": 2 * Math.PI / 0.6,
                    "P": this.polarToRect($V([2.5, -Math.PI / 2 + Math.cos(0.6 * t)]))
                };
            };
        }
        f = f.bind(this);

        var O1 = $V([0, 0]);
        var O2 = $V([-3, -2]);

        var O;
        if (this.getOption("origin") === "O1") {
            O = O1;
        } else {
            O = O2;
        }

        var val = this.numDiff(f, t);
        var period = val.period;
        var r = val.P;
        var v = val.diff.P;
        var a = val.ddiff.P;

        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        var er = r.subtract(O).toUnitVector();
        var et = er.rotate(Math.PI / 2, $V([0, 0]));

        var vr = this.orthProj(v, er);
        var vt = this.orthProj(v, et);
        var ar = this.orthProj(a, er);
        var at = this.orthProj(a, et);

        var label = this.getOption("showLabels") ? true : undefined;

        if (this.getOption("showPath")) {
            var n = 200;
            var path = [], s;
            for (var i = 0; i < n; i++) {
                s = i / n * period;
                path.push(f(s).P);
            }
            this.polyLine(path, true, false);
        }
        this.point(O1);
        this.text(O1, $V([1, 1]), label && "TEX:$O_1$");
        this.point(O2);
        this.text(O2, $V([1, 1]), label && "TEX:$O_2$");
        this.point(r);
        this.labelIntersection(r, [O, r.add(er), r.add(et)], label && "TEX:$P$");
        this.arrow(O, r, "position");
        this.labelLine(O, r, $V([0, 1]), label && "TEX:$\\vec{r}$");
        this.arrow(r, r.add(er));
        this.arrow(r, r.add(et));
        this.labelLine(r, r.add(er), $V([1, 1]), label && "TEX:$\\hat{e}_r$");
        this.labelLine(r, r.add(et), $V([1, 1]), label && "TEX:$\\hat{e}_\\theta$");
        if (this.getOption("showVelocity")) {
            this.arrow(r, r.add(v), "velocity");
            this.labelLine(r, r.add(v), $V([0, -1]), label && "TEX:$\\vec{v}$");
        }
        if (this.getOption("showAcceleration")) {
            this.arrow(r, r.add(a), "acceleration");
            this.labelLine(r, r.add(a), $V([1, 0]), label && "TEX:$\\vec{a}$");
        }
        if (this.getOption("showVelDecomp") && vr.modulus() > 1e-3) {
            this.arrow(r, r.add(vr), "velocity");
            this.labelLine(r, r.add(vr), $V([1, 1]), label && "TEX:$\\vec{v}_r$");
        }
        if (this.getOption("showVelDecomp") && vt.modulus() > 1e-3) {
            this.arrow(r, r.add(vt), "velocity");
            this.labelLine(r, r.add(vt), $V([1, 1]), label && "TEX:$\\vec{v}_\\theta$");
        }
        if (this.getOption("showAccDecomp") && ar.modulus() > 1e-3) {
            this.arrow(r, r.add(ar), "acceleration");
            this.labelLine(r, r.add(ar), $V([1, 1]), label && "TEX:$\\vec{a}_r$");
        }
        if (this.getOption("showAccDecomp") && at.modulus() > 1e-3) {
            this.arrow(r, r.add(at), "acceleration");
            this.labelLine(r, r.add(at), $V([1, 1]), label && "TEX:$\\vec{a}_\\theta$");
        }

    });

    rkv_fr_c.registerOptionCallback("movement", function (value) {
        rkv_fr_c.resetTime(false);
        rkv_fr_c.resetOptionValue("showPath");
        rkv_fr_c.resetOptionValue("showVelocity");
        rkv_fr_c.resetOptionValue("showAcceleration");
        rkv_fr_c.resetOptionValue("showVelDecomp");
        rkv_fr_c.resetOptionValue("showAccDecomp");
    });

    rkt_fo_c = new PrairieDrawAnim("rkt-fo-c", function(t) {
        this.setUnits(12, 8);

        this.addOption("showLabels", true);
        this.addOption("showPath", true);
        this.addOption("showLine", false);
        this.addOption("showCircle", false);
        this.addOption("showPosition", true);
        this.addOption("showVelocity", false);
        this.addOption("showAcceleration", false);
        this.addOption("showAccDecomp", false);
        this.addOption("matchPhasePercent", 0);

        var label = this.getOption("showLabels") ? true : undefined;

        var f = function(t) {
            var T = 2 * Math.PI / 0.7;
            var theta = 0.7 * t - 0.4 * Math.sin(0.7 * t);
            return {
                "period": T,
                "P": $V([3 * Math.cos(theta), 2.5 * Math.sin(theta)])
            };
        };

        var O = $V([0, 0]);

        var val = this.numDiff(f, t);
        var period = val.period;
        var r = val.P;
        var v = val.diff.P;
        var a = val.ddiff.P;

        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        var et = v.toUnitVector();
        var en = this.orthComp(a, v).toUnitVector();

        var vt = this.orthProj(v, et);
        var vn = this.orthProj(v, en);
        var at = this.orthProj(a, et);
        var an = this.orthProj(a, en);

        var tMatch = this.getOption("matchPhasePercent") / 100 * period;
        var valMatch = this.numDiff(f, tMatch);
        var rM = valMatch.P;
        var vM = valMatch.diff.P;
        var aM = valMatch.ddiff.P;

        var etM = vM.toUnitVector();
        var enM = this.orthComp(aM, vM).toUnitVector();

        var vtM = this.orthProj(vM, etM);
        var vnM = this.orthProj(vM, enM);
        var atM = this.orthProj(aM, etM);
        var anM = this.orthProj(aM, enM);

        var rhoM = Math.pow(vM.modulus(), 2) / anM.modulus();
        var CM = rM.add(enM.x(rhoM));

        // interpolate [0,1] -> [0,1] with first derivative d1 and second derivative d2 at {0,1}
        var zoInterp = function(u, d1, d2) {
            var u2 = u * u;
            var u3 = u * u2;
            var u4 = u * u3;
            return u * (20 * u2 - 30 * u3 + 12 * u4) / 2
                + d1 * u * (2 - 20 * u2 + 30 * u3 - 12 * u4) / 2
                + d2 * u * (u - 2 * u2 + u3) / 2;
        };

        var fCircle = function(t) {
            var d1 = vtM.dot(etM) * period / (2 * Math.PI * rhoM);
            var d2 = atM.dot(etM) * period * period / (2 * Math.PI * rhoM);
            var theta = 2 * Math.PI * zoInterp(this.fixedMod(t - tMatch, period) / period, d1, d2);
            var theta0 = this.angleOf(enM.x(-1));
            return {P: CM.add(this.vector2DAtAngle(theta0 + theta).x(rhoM))};
        }.bind(this);

        var valCircle = this.numDiff(fCircle, t);
        var rQ = valCircle.P;
        var vQ = valCircle.diff.P;
        var aQ = valCircle.ddiff.P;

        var etQ = vQ.toUnitVector();
        var enQ = this.orthComp(aQ, vQ).toUnitVector();

        var vtQ = this.orthProj(vQ, etQ);
        var vnQ = this.orthProj(vQ, enQ);
        var atQ = this.orthProj(aQ, etQ);
        var anQ = this.orthProj(aQ, enQ);

        var fLine = function(t) {
            var tL = this.fixedMod(this.fixedMod(t - tMatch, period) + period / 2, period) - period / 2;
            var dL = tL * vtM.dot(etM);
            return {P: rM.add(etM.x(dL))};
        }.bind(this);

        var valLine = this.numDiff(fLine, t);
        var rR = valLine.P;
        var vR = valLine.diff.P;
        var aR = valLine.ddiff.P;

        var etR = vR.toUnitVector();
        var enR = etR.rotate(Math.PI / 2, $V([0, 0]));

        var vtR = this.orthProj(vR, etR);
        var vnR = this.orthProj(vR, enR);
        var atR = this.orthProj(aR, etR);
        var anR = this.orthProj(aR, enR);


        if (this.getOption("showPath")) {
            var n = 200;
            var path = [], s;
            for (var i = 0; i < n; i++) {
                s = i / n * period;
                path.push(f(s).P);
            }
            this.polyLine(path, true, false);
        }
        this.point(O);
        this.text(O, $V([1, 1]), label && "TEX:$O$");
        this.point(r);
        this.labelIntersection(r, [O, r.add(et), r.add(et.x(-1)), r.add(en)], label && "TEX:$P$");
        if (this.getOption("showLine")) {
            this.save();
            this.setProp("shapeOutlineColor", "rgb(0, 100, 0)");
            this.line(rM.add(etM.x(-20)), rM.add(etM.x(20)));
            this.restore();
            this.arrow(rR, rR.add(etR));
            this.arrow(rR, rR.add(enR));
            this.labelIntersection(rR.add(etR), [rR.add(etR.x(2)), rR.add(etR).add(enR), rR], label && "TEX:$\\hat{e}_{R,t}$");
            this.labelLine(rR, rR.add(enR), $V([1, 1]), label && "TEX:$\\hat{e}_{R,n}$");
            if (!this.getOption("showCircle")) {
                this.point(rM);
                this.labelIntersection(rM, [rM.add(etM), rM.subtract(enM), rM.subtract(etM)], label && "TEX:$M$");
            }
            this.point(rR);
            this.labelIntersection(rR, [rR.add(etR), rR.add(enR), rR.subtract(etR)], label && "TEX:$R$");
            if (this.getOption("showVelocity")) {
                this.arrow(rR, rR.add(vR), "velocity");
                this.labelLine(rR, rR.add(vR), $V([0, -1]), label && "TEX:$\\vec{v}_R$");
            }
        }
        if (this.getOption("showCircle")) {
            this.save();
            this.setProp("shapeOutlineColor", this.getProp("rotationColor"));
            this.arc(CM, rhoM);
            this.restore();
            this.point(CM);
            this.text(CM, $V([1, 1]), label && "TEX:$C$");
            this.point(rM);
            this.labelIntersection(rM, [rM.add(etM), rM.subtract(enM), rM.subtract(etM)], label && "TEX:$M$");
            this.point(rQ);
            this.labelIntersection(rQ, [rQ.add(etQ), rQ.add(enQ), rQ.subtract(etQ)], label && "TEX:$Q$");
            this.arrow(rQ, rQ.add(etQ));
            this.arrow(rQ, rQ.add(enQ));
            this.labelLine(rQ, rQ.add(etQ), $V([1, -1]), label && "TEX:$\\hat{e}_{Q,t}$");
            this.labelLine(rQ, rQ.add(enQ), $V([1, 1]), label && "TEX:$\\hat{e}_{Q,n}$");
            if (this.getOption("showPosition")) {
                this.arrow(CM, rQ, "position");
                this.labelLine(CM, rQ, $V([0, 1]), label && "TEX:$\\vec{r}_{CQ}$");
            }
            if (this.getOption("showVelocity")) {
                this.arrow(rQ, rQ.add(vQ), "velocity");
                this.labelLine(rQ, rQ.add(vQ), $V([0, -1]), label && "TEX:$\\vec{v}_Q$");
            }
            if (this.getOption("showAcceleration")) {
                this.arrow(rQ, rQ.add(aQ), "acceleration");
                this.labelLine(rQ, rQ.add(aQ), $V([1, 0]), label && "TEX:$\\vec{a}_Q$");
            }
            if (this.getOption("showAccDecomp") && at.modulus() > 1e-3) {
                this.arrow(rQ, rQ.add(atQ), "acceleration");
                this.labelLine(rQ, rQ.add(atQ), $V([1, 1]), label && "TEX:$\\vec{a}_{Q,\\theta}$");
            }
            if (this.getOption("showAccDecomp") && an.modulus() > 1e-3) {
                this.arrow(rQ, rQ.add(anQ), "acceleration");
                this.labelLine(rQ, rQ.add(anQ), $V([1, 1]), label && "TEX:$\\vec{a}_{Q,r}$");
            }
        }
        if (this.getOption("showPosition")) {
            this.arrow(O, r, "position");
            this.labelLine(O, r, $V([0, 1]), label && "TEX:$\\vec{r}_P$");
        }
        this.arrow(r, r.add(et));
        this.arrow(r, r.add(en));
        this.labelLine(r, r.add(et), $V([1, -1]), label && "TEX:$\\hat{e}_{P,t}$");
        this.labelLine(r, r.add(en), $V([1, 1]), label && "TEX:$\\hat{e}_{P,n}$");
        if (this.getOption("showVelocity")) {
            this.arrow(r, r.add(v), "velocity");
            this.labelLine(r, r.add(v), $V([0, -1]), label && "TEX:$\\vec{v}_P$");
        }
        if (this.getOption("showAcceleration")) {
            this.arrow(r, r.add(a), "acceleration");
            this.labelLine(r, r.add(a), $V([1, 0]), label && "TEX:$\\vec{a}_P$");
        }
        if (this.getOption("showAccDecomp") && at.modulus() > 1e-3) {
            this.arrow(r, r.add(at), "acceleration");
            this.labelLine(r, r.add(at), $V([1, 1]), label && "TEX:$\\vec{a}_{P,t}$");
        }
        if (this.getOption("showAccDecomp") && an.modulus() > 1e-3) {
            this.arrow(r, r.add(an), "acceleration");
            this.labelLine(r, r.add(an), $V([1, 1]), label && "TEX:$\\vec{a}_{P,n}$");
        }
    });

    avt_fc_c = new PrairieDrawAnim("avt-fc-c", function(t) {
        this.setUnits(11, 11 / this.goldenRatio);
            this.translate($V([0, 1]));
    
            var d = 4;
            var h = 4;
            var w = 1;
    
            var r = (h - w) / 2; // radius of track center
            var l1 = d; // top horizontal center length
            var l2 = Math.PI * r; // right curve center length
            var l3 = d; // bottom horizontal center length
            var l4 = Math.PI * r; // left curve center length
            var l = l1 + l2 + l3 + l4; // total length of track center
            var v = 1; // velocity of vehicle
    
            var computePos = function(t) {
                var dataNow = {};
                // dataNow.P = position of vechicle
                var s = (t * v) % l; // distance along track
                var theta; // angle of normal
                if (s < l1) {
                    // top horizontal
                    dataNow.P = $V([-d/2 + s, r]);
                } else if (s < l1 + l2) {
                    // right curve
                    dataNow.theta = Math.PI/2 - (s - l1) / r;
                    dataNow.P = $V([d/2 + r * Math.cos(dataNow.theta), r * Math.sin(dataNow.theta)]);
                } else if (s < l1 + l2 + l3) {
                    // bottom horizontal
                    dataNow.P = $V([d/2 - (s - l1 - l2), -r]);
                } else {
                    // left curve
                    theta = -Math.PI/2 - (s - l1 - l2 - l3) / r;
                    dataNow.P = $V([-d/2 + r * Math.cos(theta), r * Math.sin(theta)]);
                }
                return dataNow;
            };
    
            this.rod($V([-d/2, 0]), $V([d/2, 0]), h - w);
    
            var data = this.numDiff(computePos, t);
    
            var accTime = 1.5 * l / v;
            var accMax = v * v / r;
            var accHistory = this.history("a", 0.05, accTime, t, data.ddiff.P.modulus());
            this.plotHistory($V([-5, -3.9]), $V([10, 1.8]), $V([accTime, 1.8 * accMax]), Math.min(t, 0.95 * accTime), "TEX:$a$", accHistory, "acceleration");
    
            this.save();
            this.translate(data.P);
            this.rotate(this.angleOf(data.diff.P));
            this.rectangle(0.4, 0.2);
            this.restore();
    
            this.arrowFrom(data.P, data.diff.P.x(2 / v), "velocity");
            this.arrowFrom(data.P, data.ddiff.P.x(2 / (v * v)), "acceleration");
        });
        
        /********************************************************************************/
    
        avt_fe_c = new PrairieDrawAnim("avt-fe-c", function(t) {
            this.setUnits(11, 11 / this.goldenRatio);
                this.translate($V([0, 1]));
        
                // power series expansions accurate to 2e-4 on [0, 1]
                var fresnelC = function(z) {
                    return z
                        - Math.pow(Math.PI, 2) * Math.pow(z, 5) / 40
                        + Math.pow(Math.PI, 4) * Math.pow(z, 9) / 3456
                        - Math.pow(Math.PI, 6) * Math.pow(z, 13) / 599040;
                };
                var fresnelS = function(z) {
                    return Math.PI * Math.pow(z, 3) / 6
                        - Math.pow(Math.PI, 3) * Math.pow(z, 7) / 336
                        + Math.pow(Math.PI, 5) * Math.pow(z, 11) / 42240;
                };
        
                var d = 4;
                var h = 4;
                var w = 1;
                var r = (h - w) / 2; // radius of track center
                var lq = r / fresnelS(1); // length of quarter turn
                var f = (fresnelC(1) / fresnelS(1) - 1) * r;
        
                var l1 = d - f; // top horizontal center length
                var l20 = lq; // right curve top center length
                var l21 = lq; // right curve bottom center length
                var l2 = l20 + l21;
                var l3 = d - f; // bottom horizontal center length
                var l4 = Math.PI * r; // left curve center length
                var l = l1 + l2 + l3 + l4; // total length of track center
                var v = 1; // velocity of vehicle
        
                this.save();
                this.setProp("shapeOutlineColor", "rgb(255, 0, 0)");
                this.line($V([d/2 - f, r]), $V([d/2, r]));
                this.line($V([d/2 - f, -r]), $V([d/2, -r]));
                this.arc($V([d/2, 0]), r, - Math.PI / 2, Math.PI / 2);
                this.restore();
        
                var computePos = function(t) {
                    var dataNow = {};
                    // dataNow.P = position of vechicle
                    var s = (t * v) % l; // distance along track
                    var theta; // angle of normal
                    if (s < l1) {
                        // top horizontal
                        dataNow.P = $V([-d/2 + s, r]);
                    } else if (s < l1 + l20) {
                        // right curve top segment
                        sProp = (s - l1) / lq;
                        dataNow.P = $V([d/2 - f + lq * fresnelC(sProp), r - lq * fresnelS(sProp)]);
                    } else if (s < l1 + l2) {
                        // right curve bottom segment
                        sProp = (lq - (s - l1 - l20)) / lq;
                        dataNow.P = $V([d/2 - f + lq * fresnelC(sProp), -r + lq * fresnelS(sProp)]);
                    } else if (s < l1 + l2 + l3) {
                        // bottom horizontal
                        dataNow.P = $V([d/2 - f - (s - l1 - l2), -r]);
                    } else {
                        // left curve
                        theta = -Math.PI/2 - (s - l1 - l2 - l3) / r;
                        dataNow.P = $V([-d/2 + r * Math.cos(theta), r * Math.sin(theta)]);
                    }
                    return dataNow;
                };
        
                var N = 40;
                var points = [];
                var timePlot, dataPlot;
                for (var i = 0; i <= N; i++) {
                    timePlot = i / N * l2 / v + l1 / v;
                    dataPlot = computePos(timePlot);
                    points.push(dataPlot.P);
                }
                this.polyLine(points, false);
                this.line($V([-d/2, r]), $V([d/2 - f, r]));
                this.line($V([-d/2, -r]), $V([d/2 - f, -r]));
                this.arc($V([-d/2, 0]), r, Math.PI / 2, Math.PI * 3 / 2);
        
                var data = this.numDiff(computePos, t);
        
                var accTime = 1.5 * l / v;
                var accMax = v * v / r;
                var accHistory = this.history("a", 0.05, accTime, t, data.ddiff.P.modulus());
                this.plotHistory($V([-5, -3.9]), $V([10, 1.8]), $V([accTime, 1.8 * accMax]), Math.min(t, 0.95 * accTime), "TEX:$a$", accHistory, "acceleration");
        
                this.save();
                this.translate(data.P);
                this.rotate(this.angleOf(data.diff.P));
                this.rectangle(0.4, 0.2);
                this.restore();
        
                this.arrowFrom(data.P, data.diff.P.x(2 / v), "velocity");
                this.arrowFrom(data.P, data.ddiff.P.x(2 / (v * v)), "acceleration");
            });

        
    
        avt_ee_c = new PrairieDrawAnim("avt-ee-c", function(t) {
        this.setUnits(4, 4 / this.goldenRatio);
            this.translate($V([-1.7, -0.9]));
    
            var sx = 3.4;
            var sy = 2.0;
            this.save();
            this.setProp("arrowLineWidthPx", 1);
            this.setProp("arrowheadLengthRatio", 11);
            this.arrow($V([0, 0]), $V([sx, 0]));
            this.arrow($V([0, 0]), $V([0, sy]));
            this.text($V([sx, 0]), $V([1, 1.5]), "TEX:$x$");
            this.text($V([0, sy]), $V([1.5, 1]), "TEX:$y$");
            this.restore();
    
            var points = [];
            for (var x = 0; x <= 2.5; x += 0.01) {
                points.push($V([x, 0.25 * x * x]));
            }
            this.save();
            this.setProp("shapeOutlineColor", "rgb(0, 0, 255)");
            this.polyLine(points, false);
            this.restore();
    
            var x = 1.3;
            var y = 0.25 * x * x;
            var p = $V([x, y]);
            var et = $V([1, 0.5 * x]).toUnitVector();
            var en = $V([-et.e(2), et.e(1)]);
            this.arrow(p, p.add(et));
            this.arrow(p, p.add(en));
            this.save();
            this.setProp("shapeStrokeWidthPx", 1);
            this.line(p, p.add($V([1, 0])));
            this.restore();
    
            this.text(p.add(et), $V([-1, 0]), "TEX:$\\hat{e}_t$");
            this.text(p.add(en), $V([-1, -1]), "TEX:$\\hat{e}_n$");
            this.text(p, $V([-4, -1]), "TEX:$\\theta$");
        });

    /********************************************************************************/
    
    avt_fs_c = new PrairieDraw("avt-fs-c", function() {
        this.setUnits(1, 0.82);
            this.translate($V([-0.45, -0.36]));
    
            var sx = 0.9;
            var sy = 0.76;
            this.save();
            this.setProp("arrowLineWidthPx", 1);
            this.setProp("arrowheadLengthRatio", 11);
            this.arrow($V([0, 0]), $V([sx, 0]));
            this.arrow($V([0, 0]), $V([0, sy]));
            this.text($V([sx, 0]), $V([1, 1.5]), "TEX:$x$");
            this.text($V([0, sy]), $V([1.5, 1]), "TEX:$y$");
            this.restore();
    
            var points = [$V([0, 0])];
            var ds = 0.01;
            var N = 1000;
            var s, C = 0, S = 0;
            for (var i = 0; i < N; i++) {
                s = i * ds;
                C += Math.cos(0.5 * Math.PI * s * s) * ds;
                S += Math.sin(0.5 * Math.PI * s * s) * ds;
                points.push($V([C, S]));
            }
            this.save();
            this.setProp("shapeStrokeWidthPx", 1.2);
            this.setProp("shapeOutlineColor", "rgb(0, 0, 255)");
            this.polyLine(points, false);
            this.restore();
        });
    
        
    
        /********************************************************************************/

    $( window ).on( "resize", function() {
        rkv_fp_c.redraw();
        rkg_fr_c.redraw();
        rkv_fo_c.redraw();
        rkv_fa_c.redraw();
        rkv_fr_c.redraw();
        rkr_fc_c.redraw();
        rkr_fe_c.redraw();
        rkr_fg_c.redraw();
        rkt_fb_c.redraw();
        rkt_ft_c.redraw();
        rkt_fo_c.redraw();
        aov_fe_c.redraw();
        aov_fd_c.redraw();
        avt_fc_c.redraw();
        avt_fe_c.redraw();
        avt_ee_c.redraw();
        avt_fs_c.redraw();
    } );

}); // end of document.ready()
