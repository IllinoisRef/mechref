$(document).ready(function(){
    rvv_fc_c = new PrairieDrawAnim("rvv-fc-c", function(t) {
        this.setUnits(8, 4);
    
            this.addOption("otherLength", false);
            this.addOption("otherDir", false);
    
            var O1 = $V([1.96 * Math.sin(1.6 * t - 0.7), 0.97 * Math.cos(0.9 * t + 1)]);
            var O2 = $V([2.4 * Math.sin(t + 1), 0.94 * Math.cos(0.6 * t + 2)]);
            var V1 = $V([1.5, 0.7]);
            var V2 = $V([1.5, 0.7]);
    
            var sameVecs = true;
    
            if (this.getOption("otherDir")) {
                sameVecs = false;
                V1 = V1.rotate(-Math.PI/6, $V([0, 0]));
                V2 = V2.rotate(Math.PI/6, $V([0, 0]));
            }
            if (this.getOption("otherLength")) {
                sameVecs = false;
                V1 = V1.x(1.4);
                V2 = V2.x(0.8);
            }
            this.translate($V([-0.9, -0.3]));
            this.arrow(O1, O1.add(V1), "position");
            this.labelLine(O1, O1.add(V1), $V([0, 1]), "TEX:$\\vec{a}$");
            this.arrow(O2, O2.add(V2), "angMom");
            this.labelLine(O2, O2.add(V2), $V([0, -1]), "TEX:$\\vec{b}$");
            
            var msg;
            if (sameVecs) {
                msg = "TEX:\\vec{a} \\text{ is the same as } $\\vec{b}$";
            } else {
                msg = "TEX:\\vec{a} \\text{ is different to } \\vec{b}$";
            }
            var T = this.posNm2Dw($V([0.5, 0]));
            this.text(T, $V([0, -1]), msg);
        });

        rvp_fc_c = new PrairieDraw("rvp-fc-c", function() {
            this.setUnits(8, 8);
    
            var d = 3;
            var e = 0.6;
    
            var i;
            for (i = -d; i <= d; i++) {
                this.line($V([-d, i]), $V([d, i]), "grid");
                this.line($V([i, -d]), $V([i, d]), "grid");
            }
    
            this.arrow($V([-d - e, 0]), $V([d + e, 0]));
            this.arrow($V([0, -d - e]), $V([0, d + e]));
            this.labelLine($V([-d - e, 0]), $V([d + e, 0]), $V([1, -1]), "TEX:$x$");
            this.labelLine($V([0, -d - e]), $V([0, d + e]), $V([1, 1]), "TEX:$y$");
    
            this.text($V([0, 0]), $V([1, 1]), "TEX:$O$")
    
            this.save();
            this.setProp("shapeOutlineColor", "green");
            this.setProp("pointRadiusPx", 4);
            this.line($V([0, 0]), $V([2, 0]));
            this.line($V([2, 0]), $V([2, 1]));
            this.point($V([2, 1]));
            this.text($V([2, 1]), $V([-1.2, 0]), "TEX: $x = 2$ \\\\ $y = 1$");
            this.restore();
    
            this.save();
            this.setProp("shapeOutlineColor", "blue");
            this.setProp("pointRadiusPx", 4);
            this.line($V([0, 0]), $V([-3, 0]));
            this.line($V([-3, 0]), $V([-3, 2]));
            this.point($V([-3, 2]));
            this.text($V([-3, 2]), $V([-1.2, 0]), "TEX: $x = -3$ \\\\ $y = 2$");
            this.restore();
    
            this.save();
            this.setProp("shapeOutlineColor", "red");
            this.setProp("pointRadiusPx", 4);
            this.line($V([0, 0]), $V([0, -2]));
            this.point($V([0, -2]));
            this.text($V([0, -2]), $V([-1.2, 0]), "TEX: $x = 0$ \\\\ $y = -2$");
            this.restore();
        });

        rvp_fp_c = new PrairieDraw("rvp-fp-c", function() {
            this.setUnits(8, 8);
    
            var d = 3;
            var e = 0.6;
            var O = $V([0, 0]);
            var P;
    
            var i;
            this.save();
            this.setProp("shapeOutlineColor", this.getProp("gridColor"));
            for (i = 1; i <= d; i++) {
                this.arc(O, i);
            }
            var n = 12;
            for (i = 0; i < n; i++) {
                this.line(O, this.vector2DAtAngle(i / n * 2 * Math.PI).x(d));
            }
            this.restore();
    
            this.arrow(O, $V([3.7, 0]));
            this.labelLine(O, $V([3.5, 0]), $V([1, -1.4]), "TEX:$r$");
            this.circleArrow(O, 3.2, 0, 1.2, undefined, true, 0.1);
            this.labelCircleLine(O, 3.2, 0, 1.2, $V([0.7, 1.3]), "TEX:$\\theta$");
    
            this.text(O, $V([1, 1]), "TEX:$O$")
    
            this.save();
            this.setProp("shapeOutlineColor", "green");
            this.setProp("pointRadiusPx", 4);
            P = this.vector2DAtAngle(Math.PI / 6).x(2);
            this.arc(O, 1.6, 0, Math.PI / 6);
            this.line(O, P);
            this.point(P);
            this.text(P, $V([0, -1.2]), "TEX: $r = 2$ \\\\ $\\theta = \\frac{\\pi}{6}$");
            this.restore();
    
            this.save();
            this.setProp("shapeOutlineColor", "blue");
            this.setProp("pointRadiusPx", 4);
            P = this.vector2DAtAngle(Math.PI).x(3);
            this.arc(O, 1.2, 0, Math.PI);
            this.line(O, P);
            this.point(P);
            this.text(P, $V([0, -1.2]), "TEX: $r = 3$ \\\\ $\\theta = \\pi$");
            this.restore();
    
            this.save();
            this.setProp("shapeOutlineColor", "red");
            this.setProp("pointRadiusPx", 4);
            P = this.vector2DAtAngle(-Math.PI / 4).x(2);
            this.arc(O, 1.4, -Math.PI / 4, 0);
            this.line(O, P);
            this.point(P);
            this.text(P, $V([0, 1.2]), "TEX: $r = 2$ \\\\ $\\theta = -\\frac{\\pi}{4}$");
            this.restore();
        });
    
        rvv_fu_c = new PrairieDraw("rvv-fu-c", function() {
	this.setUnits(8, 4);

        var O = $V([0, 0]);

        var a = $V([0.6, -1]);
        var b = $V([1.5, 1.5]);
        var c = $V([-0.5, 0.4]);

        var aHat = a.toUnitVector();
        var bHat = b.toUnitVector();
        var cHat = c.toUnitVector();

        this.save();
        this.translate($V([-3, 0]));
        this.arrow(O, a, "red");
        this.arrow(O, b, "blue");
        this.arrow(O, c, "darkgreen");
        this.labelLine(O, a, $V([1, -1]), "TEX:$\\vec{a}$");
        this.labelLine(O, b, $V([1, -1]), "TEX:$\\vec{b}$");
        this.labelLine(O, c, $V([1, 1]), "TEX:$\\vec{c}$");
        this.restore();

        this.save();
        this.translate($V([-0.2, -0.7]));
        var d = 0.4;
        this.line(O, $V([0, a.modulus()]), "red");
        this.text($V([0, -0.4]), $V([0, -1]), "TEX:$a$");
        this.translate($V([d, 0]));
        this.line(O, $V([0, b.modulus()]), "blue");
        this.text($V([0, -0.4]), $V([0, -1]), "TEX:$b$");
        this.translate($V([d, 0]));
        this.line(O, $V([0, c.modulus()]), "darkgreen");
        this.text($V([0, -0.4]), $V([0, -1]), "TEX:$c$");
        this.restore();

        this.save();
        this.translate($V([2.5, 0]));
        this.arrow(O, aHat, "red");
        this.arrow(O, bHat, "blue");
        this.arrow(O, cHat, "darkgreen");
        this.labelLine(O, aHat, $V([1, -1]), "TEX:$\\hat{a}$");
        this.labelLine(O, bHat, $V([1, -1]), "TEX:$\\hat{b}$");
        this.labelLine(O, cHat, $V([1, -1]), "TEX:$\\hat{c}$");
        this.restore();

        this.text($V([0.3, -2]), $V([0, -1]), "TEX:vectors\\qquad$=$\\qquad lengths\\qquad$\\times$\\qquad directions");

    });

    rvv_fb_c = new PrairieDraw("rvv-fb-c", function() {
	    this.setUnits(6, 4);

        var O = $V([0, 0]);
        var a = $V([3, 2]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        this.translate($V([-2.3, -1.3]));

        this.arrow(O, ei);
        this.arrow(O, ej);
        this.labelLine(O, ei, $V([1, -1]), "TEX:$\\hat\\imath$");
        this.labelLine(O, ej, $V([1, 1]), "TEX:$\\hat\\jmath$");

        this.translate($V([1.3, 0.5]));

        this.arrow(O, a, "red");
        this.labelLine(O, a, $V([0, -1]), "TEX:$\\vec{a}$");

        this.arrow(O, ei.x(a.e(1)));
        this.labelLine(O, ei.x(a.e(1)), $V([0, -1]), "TEX:$3\\hat\\imath$");

        this.arrow(ei.x(a.e(1)), a);
        this.labelLine(ei.x(a.e(1)), a, $V([0, -1]), "TEX:$2\\hat\\jmath$");

    });
    
    rvv_f3_c = new PrairieDraw("rvv-f3-c", function() {
        this.setUnits(6, 3);

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        this.save();
        this.translate($V([-2, -0.5]));
        this.arrow(O, ei);
        this.arrow(O, ej);
        this.arrowOutOfPage(O);
        this.labelLine(O, ei, $V([1, -1]), "TEX:$\\hat\\imath$");
        this.labelLine(O, ej, $V([1, 1]), "TEX:$\\hat\\jmath$");
        this.text(O, $V([1.4, 1.2]), "TEX:$\\hat{k}$");
        this.restore();

        this.save();
        this.translate($V([1, -0.5]));
        this.arrow(O, ei);
        this.arrow(O, ej);
        this.arrowIntoPage(O);
        this.labelLine(O, ei, $V([1, -1]), "TEX:$\\hat\\imath$");
        this.labelLine(O, ej, $V([1, 1]), "TEX:$\\hat{k}$");
        this.text(O, $V([1.4, 1.4]), "TEX:$\\hat\\jmath$");
        this.restore();
    });

    rvv_fy_c = new PrairieDrawAnim("rvv-fy-c", function(t) {
        this.setUnits(6.1, 6.1);
    
        var a = 4;
        var b = 2;
        var d = (a + b) / 2;

        var states = [{"theta": 0},
                        {"theta": Math.PI / 2},
                        {"theta": 0}];
        var transTimes = [2, 2, 0];
        var holdTimes = [0, 1, 1];
        var interps = {};
        var names = ["c", "ab", "c2"];
        var state = this.newSequence(name, states, transTimes, holdTimes, interps, names, t);
        var theta = state.theta;

        var p1 = $V([0, 0]);
        var p2 = $V([0, b]);
        var p3 = $V([-a, 0]);
        var drawTri = function(m) {
            var tp1 = this.transformPos(m, p1);
            var tp2 = this.transformPos(m, p2);
            var tp3 = this.transformPos(m, p3);
            this.polyLine([tp1, tp2, tp3], true);
            this.labelLine(tp1, tp2, $V([0, 1]), "TEX:$b$");
            this.labelLine(tp2, tp3, $V([0, 1]), "TEX:$c$");
            this.labelLine(tp3, tp1, $V([0, 1]), "TEX:$a$");
        }.bind(this);

        this.save();
        this.setProp("shapeInsideColor", "rgb(200, 200, 200)");
        this.rectangle(2 * d, 2 * d);
        this.restore();

        var m;

        m = this.identityTransform();
        m = this.translateTransform(m, $V([d, -d]));
        m = this.translateTransform(m, $V([-a, 0]));
        m = this.rotateTransform(m, theta);
        m = this.translateTransform(m, $V([a, 0]));
        drawTri(m);

        this.save();
        m = this.identityTransform();
        m = this.translateTransform(m, $V([d, d]));
        m = this.translateTransform(m, $V([-b, 0]));
        m = this.rotateTransform(m, -theta);
        m = this.translateTransform(m, $V([b, 0]));
        m = this.rotateTransform(m, Math.PI / 2);
        drawTri(m);

        m = this.identityTransform();
        m = this.translateTransform(m, $V([-d, d]));
        m = this.rotateTransform(m, Math.PI);
        drawTri(m);

        m = this.identityTransform();
        m = this.translateTransform(m, $V([-d, -d]));
        m = this.rotateTransform(m, -Math.PI / 2);
        drawTri(m);

        if (!state.inTransition && (state.index === 0 || state.index === 2)) {
            this.text($V([0, 0]), $V([0, 0]), "TEX:$c^2$", true);
        }
        if (!state.inTransition && state.index === 1) {
            this.line($V([b / 2, b / 2]), $V([d, b / 2]));
            this.text($V([a / 2, a / 2]), $V([0, 0]), "TEX:$b^2$", true);
            this.text($V([b / 2, -b / 2]), $V([0, 0]), "TEX:$a^2$", true);
        }
    });

    rvv_fr_c = new PrairieDrawAnim("rvv-fr-c", function(t) {
        this.setUnits(2.4, 2.4);
    
        var O = $V([0, 0, 0]);
        var ei = $V([1, 0, 0]);
        var ej = $V([0, 1, 0]);
        var ek = $V([0, 0, 1]);

        var a = $V([0.7, 0.8, 0.9]);
        var ax = $V([a.e(1), 0, 0]);
        var axy = $V([a.e(1), a.e(2), 0]);

        this.arrow(O, ei);
        this.arrow(O, ej);
        this.arrow(O, ek);
        this.labelLine(O, ei, $V([1, -1]), "TEX:$\\hat\\imath$");
        this.labelLine(O, ej, $V([1, -1]), "TEX:$\\hat\\jmath$");
        this.labelLine(O, ek, $V([1, 1]), "TEX:$\\hat{k}$");

        this.line(O, ax);
        this.labelLine(O, ax, $V([0, -1]), "TEX:$a_1$");

        this.rightAngle(ax, ej, ei.x(-1));
        this.line(ax, axy);
        this.labelLine(ax, axy, $V([0, -1]), "TEX:$a_2$");

        this.line(O, axy);
        this.labelLine(O, axy, $V([0.2, 1]), "TEX:$\\ell$");

        this.rightAngle(axy, axy.x(-1), ek);
        this.line(axy, a);
        this.labelLine(axy, a, $V([0, -1]), "TEX:$a_3$");

        this.arrow(O, a, "position");
        this.labelLine(O, a, $V([-0.2, 1]), "TEX:$a$");
    });

    rvv_fr_c.activate3DControl();

    rvv_fl_c = new PrairieDraw("rvv-fl-c", function() {
        this.setUnits(6, 4);

        var O = $V([0, 0]);
        var a = $V([4, 3]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        this.translate($V([-2, -1.5]));

        this.arrow(O, a, "red");
        this.labelLine(O, a, $V([0, 1.4]), "TEX:$a = \\sqrt{4^2 + 3^2} = 5$");

        this.arrow(O, ei.x(a.e(1)));
        this.labelLine(O, ei.x(a.e(1)), $V([0, -1]), "TEX:$4\\hat\\imath$");

        this.arrow(ei.x(a.e(1)), a);
        this.labelLine(ei.x(a.e(1)), a, $V([0, -1]), "TEX:$3\\hat\\jmath$");
    });
    
    rvv_ft_c = new PrairieDraw("rvv-ft-c", function() {
        this.setUnits(1.4, 1.4);
    
        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        this.translate($V([-0.5, -0.5]));

        this.arrow(O, ei.x(1.1));
        this.arrow(O, ej.x(1.1));

        this.save();
        this.setProp("shapeStrokeWidthPx", 1);
        var d = 0.03;

        this.line($V([0, -d]), $V([0, 0]));
        this.text($V([0, -d]), $V([0, 1]), "TEX:$0$");

        this.line($V([1, -d]), $V([1, 0]));
        this.text($V([1, -d]), $V([0, 1]), "TEX:$2000$");

        this.line($V([-d, 0]), $V([0, 0]));
        this.text($V([-d, 0]), $V([1, 0]), "TEX:$0$");

        this.line($V([-d, 1]), $V([0, 1]));
        //this.text($V([-d, 1]), $V([1, 0]), "TEX:$2000$");

        this.labelLine(O, ei, $V([0, -2]), "TEX:$a$");
        this.labelLine(O, ej, $V([0, 2]), "TEX:$b$");

        this.restore();

        this.save();
        this.setProp("pointRadiusPx", 0.5);
        this.scale($V([0.0005, 0.0005]));
        var i, p;
        for (i = 0; i < py_triples.length; i++) {
            p = py_triples[i];
            this.point(p);
            this.point($V([p.e(2), p.e(1)]));
        }
        this.restore();

    });

    rvv_xn_c = new PrairieDraw("rvv-xn-c", function() {
        this.setUnits(6, 4);

        var O = $V([0, 0]);
        var a = $V([3, 2]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);
        var eu = $V([1, 1]).toUnitVector();
        var ev = $V([-1, 1]).toUnitVector();

        var ai = a.dot(ei);
        var aj = a.dot(ej);
        var au = a.dot(eu);
        var av = a.dot(ev);

        this.save();
        this.translate($V([-0.7, -1.5]));
        this.arrow(O, a, "red");
        this.labelLine(O, a, $V([0, -1]), "TEX:$\\vec{a}$");
        this.arrow(O, ei.x(ai));
        this.arrow(ei.x(ai), a);
        this.labelLine(O, ei.x(ai), $V([0, -1]), "TEX:$3 \\hat\\imath$");
        this.labelLine(ei.x(ai), a, $V([0, -1]), "TEX:$2 \\hat\\jmath$");
        this.arrow(O, eu.x(au), "blue");
        this.arrow(eu.x(au), a, "blue");
        this.labelLine(O, eu.x(au), $V([0, 1.2]), "TEX:?$\\hat{u}$");
        this.labelLine(eu.x(au), a, $V([0, 1]), "TEX:?$\\hat{v}$");
        this.restore();

        this.save();
        this.translate($V([-1.8, 0.5]));
        this.arrow(O, ei);
        this.arrow(O, ej);
        this.labelLine(O, ei, $V([1, -1]), "TEX:$\\hat\\imath$");
        this.labelLine(O, ej, $V([1, 1]), "TEX:$\\hat\\jmath$");
        this.arrow(O, eu, "blue");
        this.arrow(O, ev, "blue");
        this.labelLine(O, eu, $V([1, -1]), "TEX:$\\hat{u}$");
        this.labelLine(O, ev, $V([1, 1]), "TEX:$\\hat{v}$");
        this.text(O, $V([-2, -1]), "TEX:$45^\\circ$");
        this.restore();
    });

    rvv_e2_c = new PrairieDraw("rvv-e2-c", function() {
        this.setUnits(4, 1.7);

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);
        var eu = this.vector2DAtAngle(Math.PI / 3);
        var ev = this.vector2DAtAngle(Math.PI * 5 / 6);

        this.translate($V([0, -0.5]));
        this.arrow(O, ei);
        this.arrow(O, ej);
        this.labelLine(O, ei, $V([1, -1]), "TEX:$\\hat\\imath$");
        this.labelLine(O, ej, $V([1, 1]), "TEX:$\\hat\\jmath$");
        this.arrow(O, eu, "blue");
        this.arrow(O, ev, "blue");
        this.labelLine(O, eu, $V([1, -1]), "TEX:$\\hat{u}$");
        this.labelLine(O, ev, $V([1, 1]), "TEX:$\\hat{v}$");
        this.text(O, $V([-2, -1]), "TEX:$\\theta$");
    });

    rvv_xa_c = new PrairieDraw("rvv-xa-c", function() {
        this.setUnits(10, 6);

        this.addOption("showBasis", "none");

        var O = $V([0, 0]);
        var a = $V([3, 2]);
        var b = $V([3, -1]);
        var c = a.add(b);

        var ei = $V([1, 0]);
        var ej = $V([0, 1]);
        var eu = $V([1, 1]).toUnitVector();
        var ev = $V([-1, 1]).toUnitVector();

        var ai = ei.x(a.dot(ei));
        var aj = ej.x(a.dot(ej));
        var au = eu.x(a.dot(eu));
        var av = ev.x(a.dot(ev));

        var bi = ei.x(b.dot(ei));
        var bj = ej.x(b.dot(ej));
        var bu = eu.x(b.dot(eu));
        var bv = ev.x(b.dot(ev));

        var ci = ei.x(c.dot(ei));
        var cj = ej.x(c.dot(ej));
        var cu = eu.x(c.dot(eu));
        var cv = ev.x(c.dot(ev));

        // console.log(au, av, bu, bv, cu, cv);
        // 3.5355339059327373 -0.7071067811865475 1.414213562373095 -2.82842712474619 4.949747468305832 -3.5355339059327373

        this.save();
        this.translate($V([-2, -0.3]));
        this.arrow(O, a, "red");
        this.labelLine(O, a, $V([0, -1]), "TEX:$\\vec{a}$");
        if (this.getOption("showBasis") === "ij" || this.getOption("showBasis") === "mixed") {
            this.arrow(O, aj);
            this.arrow(aj, a);
            this.labelLine(O, aj, $V([0, 1]), "TEX:$2 \\hat\\jmath$");
            this.labelLine(aj, a, $V([0, 1]), "TEX:$3 \\hat\\imath$");
        }
        if (this.getOption("showBasis") === "uv") {
            this.arrow(O, au);
            this.arrow(au, a);
            this.labelLine(O, au, $V([0, 1.2]), "TEX:$3.5 \\hat{u}$");
            this.labelLine(au, a, $V([-1, 1]), "TEX:$-0.7 \\hat{v}$");
        }

        this.arrow(O, c, "darkgreen");
        this.labelLine(O, c, $V([0, -1]), "TEX:$\\vec{c}$");
        if (this.getOption("showBasis") === "ij") {
            this.arrow(O, ci);
            this.arrow(ci, c);
            this.labelLine(O, ci, $V([0, -1]), "TEX:$6 \\hat\\imath$");
            this.labelLine(ci, c, $V([0, -1]), "TEX:$\\hat\\jmath$");
        }
        if (this.getOption("showBasis") === "uv") {
            this.arrow(O, cv);
            this.arrow(cv, c);
            this.labelLine(O, cv, $V([0, -1.2]), "TEX:$-3.5 \\hat{v}$");
            this.labelLine(cv, c, $V([0, -1.2]), "TEX:$4.9 \\hat{u}$");
        }
        if (this.getOption("showBasis") === "mixed") {
            this.arrow(O, ai);
            this.arrow(ai, ai.add(bv));
            this.arrow(ai.add(bv), ai.add(bv).add(aj));
            this.arrow(ai.add(bv).add(aj), c);
            this.labelLine(O, ai, $V([0, -1.2]), "TEX:$3 \\hat\\imath$");
            this.labelLine(ai, ai.add(bv), $V([0, -1.2]), "TEX:$-2.8 \\hat{v}$");
            this.labelLine(ai.add(bv), ai.add(bv).add(aj), $V([0, -1.2]), "TEX:$2 \\hat\\jmath$");
            this.labelLine(ai.add(bv).add(aj), c, $V([0, -1.2]), "TEX:$1.4 \\hat{u}$");
        }

        this.translate(a);
        this.arrow(O, b, "blue");
        this.labelLine(O, b, $V([0, -1]), "TEX:$\\vec{b}$");
        if (this.getOption("showBasis") === "ij") {
            this.arrow(O, bi);
            this.arrow(bi, b);
            this.labelLine(O, bi, $V([0, 1]), "TEX:$3 \\hat\\imath$");
            this.labelLine(bi, b, $V([0, 1]), "TEX:$- \\hat\\jmath$");
        }
        if (this.getOption("showBasis") === "uv" || this.getOption("showBasis") === "mixed") {
            this.arrow(O, bu);
            this.arrow(bu, b);
            this.labelLine(O, bu, $V([0.5, 1.5]), "TEX:$1.4 \\hat{u}$");
            this.labelLine(bu, b, $V([0, 1.2]), "TEX:$-2.8 \\hat{v}$");
        }
        this.restore();

        this.save();
        this.translate($V([-3.5, -2]));
        this.arrow(O, ei);
        this.arrow(O, ej);
        this.labelLine(O, ei, $V([1, -1]), "TEX:$\\hat\\imath$");
        this.labelLine(O, ej, $V([1, 1]), "TEX:$\\hat\\jmath$");
        this.arrow(O, eu);
        this.arrow(O, ev);
        this.labelLine(O, eu, $V([1, -1]), "TEX:$\\hat{u}$");
        this.labelLine(O, ev, $V([1, 1]), "TEX:$\\hat{v}$");
        this.text(O, $V([-2, -1]), "TEX:$45^\\circ$");
        this.restore();
    });

    rvv_xx_c = new PrairieDraw("rvv-xx-c", function() {
        this.setUnits(8, 6);

        this.addOption("showBasis", "none");

        var O = $V([0, 0]);
        var a = $V([3, 2]);
        var b = $V([3, -1]);

        var ei = $V([1, 0]);
        var ej = $V([0, 1]);
        var eu = $V([1, 1]).toUnitVector();
        var ev = $V([-1, 1]).toUnitVector();

        var ai = ei.x(a.dot(ei));
        var aj = ej.x(a.dot(ej));
        var au = eu.x(a.dot(eu));
        var av = ev.x(a.dot(ev));

        var bi = ei.x(b.dot(ei));
        var bj = ej.x(b.dot(ej));
        var bu = eu.x(b.dot(eu));
        var bv = ev.x(b.dot(ev));

        this.save();
        this.translate($V([0, -0.3]));
        this.arrow(O, a, "red");
        this.labelLine(O, a, $V([0, 1]), "TEX:$\\vec{a}$");
        if (this.getOption("showBasis") === "ij") {
            this.arrow(O, aj);
            this.arrow(aj, a);
            this.labelLine(O, aj, $V([0, 1]), "TEX:$2 \\hat\\jmath$");
            this.labelLine(aj, a, $V([0, 1]), "TEX:$3 \\hat\\imath$");
        }
        if (this.getOption("showBasis") === "uv") {
            this.arrow(O, au);
            this.arrow(au, a);
            this.labelLine(O, au, $V([0, 1.2]), "TEX:$3.5 \\hat{u}$");
            this.labelLine(au, a, $V([0, 1]), "TEX:$-0.7 \\hat{v}$");
        }

        this.arrow(O, b, "blue");
        this.labelLine(O, b, $V([0, 1]), "TEX:$\\vec{b}$");
        if (this.getOption("showBasis") === "ij") {
            this.arrow(O, bj);
            this.arrow(bj, b);
            this.labelLine(O, bj, $V([0, -1]), "TEX:$- \\hat\\jmath$");
            this.labelLine(bj, b, $V([0, -1]), "TEX:$3 \\hat\\imath$");
        }
        if (this.getOption("showBasis") === "uv") {
            this.arrow(O, bv);
            this.arrow(bv, b);
            this.labelLine(O, bv, $V([0, -1.2]), "TEX:$1.4 \\hat{u}$");
            this.labelLine(bv, b, $V([0, -1.2]), "TEX:$-2.8 \\hat{v}$");
        }

        this.text(O, $V([-3, -0.5]), "TEX:$\\theta$");
        this.restore();

        this.save();
        this.translate($V([-2.5, -1]));
        this.arrow(O, ei);
        this.arrow(O, ej);
        this.labelLine(O, ei, $V([1, -1]), "TEX:$\\hat\\imath$");
        this.labelLine(O, ej, $V([1, 1]), "TEX:$\\hat\\jmath$");
        this.arrow(O, eu);
        this.arrow(O, ev);
        this.labelLine(O, eu, $V([1, -1]), "TEX:$\\hat{u}$");
        this.labelLine(O, ev, $V([1, 1]), "TEX:$\\hat{v}$");
        this.text(O, $V([-2, -1]), "TEX:$45^\\circ$");
        this.restore();
    });

    rvv_fm_c = new PrairieDraw("rvv-fm-c", function() {
        this.setUnits(8, 4);

        var O = $V([0, 0]);
        var a = $V([1.7, 2.8]);
        var b = $V([5, 3]);
        var ap = b.toUnitVector().x(a.dot(b) / b.modulus());
        var ac = a.subtract(ap);
        var aColor = "red";
        var bColor = "blue";

        this.translate($V([-2, -1.5]));

        this.arrow(O, a, aColor);
        this.labelLine(O, a, $V([0, 1]), "TEX:$\\vec{a}$");

        this.arrow(O, b, bColor);
        this.labelLine(O, b, $V([0.7, -1.4]), "TEX:$\\vec{b}$");

        this.text(O, $V([-3.5, -2.5]), "TEX:$\\theta$");

        this.arrow(O, ap, "darkred");
        this.labelLine(O, ap, $V([0, -1.2]), "TEX:$\\operatorname{Proj}(\\vec{a},\\vec{b})$");

        this.arrow(O, ac, "darkgreen");
        this.arrow(ap, a, "darkgreen");
        this.labelLine(O, ac, $V([1, -1]), "TEX:$\\operatorname{Comp}(\\vec{a},\\vec{b})$");

        this.rightAngle(O, b);
        this.rightAngle(ap, ac);
    });

    rvc_fm_c = new PrairieDrawAnim("rvc-fm-c", function(t) {
        this.setUnits(12, 6);

        this.addOption("showLabels", true);
        this.addOption("showVelocity", false);
        this.addOption("showVelocityDecomp", false);

        var O = $V([0, 0]);

        var f = function(t) {
            var m = 2;
            var length = m * (2 + Math.sin(1.3 * t)) / 3;
            var angle = 0.3 * t + Math.sin(t);
            return {
                a: this.polarToRect($V([length, angle])),
            };
        }.bind(this);

        var val = this.numDiff(f, t);

        var a = val.a;
        var v = val.diff.a;

        var aLen = a.modulus();
        var vLen = v.modulus();

        var aHat = a.toUnitVector();
        var vProj = this.orthProj(v, a);
        var vComp = this.orthComp(v, a);
        var aLenDot = v.dot(aHat);
        var aHatDot = vComp.x(1 / aLen);

        var direction = this.sign(aHatDot.to3D().cross(aHat.to3D()).dot(Vector.k));

        this.save();
        this.translate($V([-2.5, 0]));
        this.arrow(O, a, "position");
        if (this.getOption("showLabels")) {
            this.labelLine(O, a, $V([0, 1]), "TEX:$\\vec{a}$");
        }
        if (this.getOption("showVelocity")) {
            this.arrow(a, a.add(v), "velocity");
            if (this.getOption("showLabels")) {
                this.labelLine(a, a.add(v), $V([1, 0]), "TEX:$\\dot{\\vec{a}}$");
            }
        }
        if (this.getOption("showVelocityDecomp")) {
            this.arrow(a, a.add(vProj), "velocity");
            if (this.getOption("showLabels")) {
                this.labelLine(a, a.add(vProj), $V([0, -this.sign(aLenDot)]), "TEX:$\\dot{a}\\hat{a}$");
            }
            this.arrow(a, a.add(vComp), "velocity");
            if (this.getOption("showLabels")) {
                this.labelLine(a, a.add(vComp), $V([0, -direction]), "TEX:$a\\dot{\\hat{a}}$");
            }
        }
        this.restore();

        this.save();
        this.translate($V([1, 0]));
        var d = 0.1;
        this.line(O, $V([0, aLen]), "position");
        if (this.getOption("showLabels")) {
            this.labelLine(O, $V([0, aLen]), $V([0, 1]), "TEX:$a$");
        }
        if (this.getOption("showVelocityDecomp")) {
            this.line($V([d, aLen]), $V([d, aLen + aLenDot]), "velocity");
            if (this.getOption("showLabels")) {
                this.labelLine($V([d, aLen]), $V([d, aLen + aLenDot]), $V([0, -this.sign(aLenDot)]), "TEX:$\\dot{a}$");
            }
        }
        this.restore();

        this.save();
        this.translate($V([4, 0]));
        this.arrow(O, aHat, "position");
        if (this.getOption("showLabels")) {
            this.labelLine(O, aHat, $V([0, 1]), "TEX:$\\hat{a}$");
        }
        if (this.getOption("showVelocityDecomp")) {
            this.arrow(aHat, aHat.add(aHatDot), "velocity");
            if (this.getOption("showLabels")) {
                this.labelLine(aHat, aHat.add(aHatDot), $V([0, direction]), "TEX:$\\dot{\\hat{a}}$");
            }
        }
        this.restore();

        this.text($V([1, -2.7]), $V([0, -1]),
                  "TEX:vector\\qquad\\qquad$=$\\qquad\\qquad length\\qquad\\quad$\\times$\\quad\\qquad direction");
    });

    rvs_fd_c = new PrairieDraw("rvs-fd-c", function() {
        this.setUnits(11, 11);

        this.addOption("r", 4);
        this.addOption("thetaDeg", 45);
        this.addOption("phiDeg", 45);

        this.addOption("showLabels", true);
        this.addOption("showCoords", true);
        this.addOption("showBasis", false);

        this.addOption("showCoordLineR", false);
        this.addOption("showCoordLineTheta", false);
        this.addOption("showCoordLinePhi", false);

        var O = $V([0, 0, 0]);
        var rX = $V([5, 0, 0]);
        var rY = $V([0, 5, 0]);
        var rZ = $V([0, 0, 5]);
        this.arrow(O, rX);
        this.arrow(O, rY);
        this.arrow(O, rZ);
        if (this.getOption("showLabels")) {
            this.labelLine(O, rX, $V([1, -1]), "TEX:$x$");
            this.labelLine(O, rY, $V([1, 1]), "TEX:$y$");
            this.labelLine(O, rZ, $V([1, 1]), "TEX:$z$");
        }

        var r = this.getOption("r");
        var theta = this.degToRad(this.getOption("thetaDeg"));
        var phiDeg = this.getOption("phiDeg");
        var phi = this.degToRad(phiDeg);

        var p = this.sphericalToRect($V([r, theta, phi]));
        var rXY = $V([p.e(1), p.e(2), 0]);
        var rXY_mod = rXY.modulus();
        var nXY = rXY.cross(Vector.k);
        var pZ = $V([0, 0, r]);

        if (this.getOption("showLabels")) {
            this.labelIntersection(O, [rX, rY, rZ, p, rXY], "TEX:$O$");
            this.labelIntersection(p, [O, rXY, pZ], "TEX:$P$");
        }

        if (this.getOption("showCoordLineR")) {
            var pExt = this.sphericalToRect($V([7, theta, phi]));
            this.save();
            this.setProp("shapeStrokePattern", "dashed");
            this.line(pExt, p);
            this.restore();
        }

        if (this.getOption("showCoordLineTheta")) {
            var pTheta = $V([0, 0, r * Math.cos(phi)]);
            var rTheta = r * Math.sin(phi);
            this.save();
            this.setProp("shapeStrokePattern", "dashed");
            this.arc3D(pTheta, rTheta, Vector.k);
            this.restore();
        }

        if (this.getOption("showCoordLinePhi")) {
            this.save();
            this.setProp("shapeStrokePattern", "dashed");
            this.arc3D(O, r, nXY, Vector.k, -Math.PI, 0);
            this.restore();
        }

        this.arrow(O, p, "position");
        if (this.getOption("showLabels")) {
            this.labelLine(O, p, $V([0, 1]), "TEX:$\\vec{r}$");
        }

        if (this.getOption("showCoords")) {
            this.save();
            this.setProp("shapeStrokePattern", "dashed");
            this.setProp("arrowLinePattern", "dashed");
            if (phiDeg !== 90) {
                this.line(O, rXY);
            }

            if (!(this.getOption("showCoordLineTheta") && phiDeg === 90)) {
                this.circleArrow3D(O, rXY_mod, Vector.k, Vector.i, 0, theta);
                if (phiDeg !== 90) {
                    this.line(rXY, p);
                    this.rightAngle(rXY, $V([0, 0, p.e(3)]), rXY.x(-1));
                }
            }
            if (this.getOption("showLabels")) {
                var thetaText = undefined;
                if (theta > 0) {
                    thetaText = "TEX:$\\theta$";
                } else if (theta < 0) {
                    thetaText = "TEX:$-\\theta$";
                }
                this.labelCircleLine3D(thetaText, $V([0, 1]), O, rXY_mod, Vector.k, Vector.i, 0, theta);
            }

            if (!this.getOption("showCoordLinePhi")) {
                this.circleArrow3D(O, r, nXY, pZ, 0, -phi);
            }
            if (this.getOption("showLabels")) {
                this.labelCircleLine3D("TEX:$\\phi$", $V([0, 1]), O, r, nXY, pZ, 0, -phi);
            }
            this.restore();
        }

        if (this.getOption("showBasis")) {
            var sBasis = this.sphericalBasis($V([r, theta, phi]));

            var eR = sBasis[0];
            var eTheta = sBasis[1];
            var ePhi = sBasis[2];
            this.arrow(p, p.add(eR));
            this.arrow(p, p.add(eTheta));
            this.arrow(p, p.add(ePhi));
            if (this.getOption("showLabels")) {
                this.labelLine(p, p.add(eR), $V([1, 0]), "TEX:$\\hat{e}_r$");
                this.labelLine(p, p.add(eTheta), $V([1, 0]), "TEX:$\\hat{e}_\\theta$");
                this.labelLine(p, p.add(ePhi), $V([1, 0]), "TEX:$\\hat{e}_\\phi$");
            }
        }
    });

    rvs_fd_c.activate3DControl();

    rvs_ec_c = new PrairieDraw("rvs-ec-c", function() {
        this.setUnits(11, 11);

        var O = $V([0, 0, 0]);
        var rX = $V([5, 0, 0]);
        var rY = $V([0, 5, 0]);
        var rZ = $V([0, 0, 5]);
        this.arrow(O, rX);
        this.arrow(O, rY);
        this.arrow(O, rZ);

        var r = 7;
        var theta = Math.PI / 4;
        var phi = 1.2 * Math.PI / 4;

        var p = this.sphericalToRect($V([r, theta, phi]));
        var pXY = $V([p.e(1), p.e(2), 0]);
        var pX = $V([p.e(1), 0, 0]);
        var pZ = $V([0, 0, p.e(3)]);

        this.arrow(O, p, "position");
        this.labelLine(O, p, $V([0, 1]), "TEX:$r$");

        this.save();
        this.setProp("shapeStrokePattern", "dashed");

        this.line(O, pXY);
        this.labelLine(O, pXY, $V([0.3, 1]), "TEX:$\\ell$");

        this.line(pXY, p);
        this.labelLine(pXY, p, $V([0, -1]), "TEX:$z$");

        this.line(pX, pXY);
        this.labelLine(pX, pXY, $V([0, -1]), "TEX:$y$");

        this.labelLine(O, pX, $V([0, -1]), "TEX:$x$");

        this.labelAngle(O, p, pZ, "TEX:$\\phi$");
        this.labelAngle(O, pX, pXY, "TEX:$\\theta$");

        this.restore();
    });

    rvs_ec_c.activate3DControl();

    var compressMap = function(data) {
        var smoothTol = 1; // degrees
        var patchTol = 1; // degrees

        var mapSize = function(d) {
            var n = 0;
            for (var i = 0; i < d.length; i++) {
                n += d[i].length;
            }
            return n;
        }

        var dist = function(p1, p2) {
            return $V(p1).subtract($V(p2)).modulus();
        };

        var compressLine = function(points) {
            if (points.length < 1) {
                return points;
            }
            var newPoints = [points[0]];
            for (var i = 1; i < points.length - 1; i++) {
                if (dist(newPoints[newPoints.length - 1], points[i + 1]) > smoothTol) {
                    newPoints.push(points[i]);
                }
            }
            newPoints.push(points[points.length - 1]);
            return newPoints;
        };

        var compressAllLines = function(d) {
            var newD = [];
            for (var i = 0; i < d.length; i++) {
                newD.push(compressLine(d[i]));
            }
            return newD;
        };

        var joinSegments = function(d) {
            if (d.length < 1) {
                return d;
            }
            var newD = [d[0]];
            for (var i = 1; i < d.length; i++) {
                var found = false;
                var addLine = d[i];
                var joinedLine;
                for (var j = 0; j < newD.length; j++) {
                    var oldLine = newD[j];
                    if (dist(oldLine[0], addLine[0]) < patchTol) {
                        addLine.reverse();
                        joinedLine = addLine.concat(oldLine);
                        found = true;
                    } else if (dist(oldLine[0], addLine[addLine.length - 1]) < patchTol) {
                        joinedLine = addLine.concat(oldLine);
                        found = true;
                    } else if (dist(oldLine[oldLine.length - 1], addLine[0]) < patchTol) {
                        joinedLine = oldLine.concat(addLine);
                        found = true;
                    } else if (dist(oldLine[oldLine.length - 1], addLine[addLine.length - 1]) < patchTol) {
                        addLine.reverse();
                        joinedLine = oldLine.concat(addLine);
                        found = true;
                    }
                    if (found) {
                        break;
                    }
                }
                if (found) {
                    newD.splice(j, 1, joinedLine);
                } else {
                    newD.push(addLine);
                }
            }
            return newD;
        };

        console.log("original number of segments", data.length);
        console.log("original size", mapSize(data));

        var data2 = joinSegments(data);
        console.log("new number of segments", data2.length);

        var data3 = compressAllLines(data2);
        console.log("new size", mapSize(data3));

        return data3;
    };

    var logMap = function(name, data, prec) {
        console.log(name + " = [");
        for (var i = 0; i < data.length; i++) {
            console.log("    [");
            for (var j = 0; j < data[i].length; j++) {
                console.log("        ["
                            + data[i][j][0].toFixed(prec) + ", "
                            + data[i][j][1].toFixed(prec) + "],");
            }
            console.log("    ],");
        }
        console.log("];")
    }

    //var compressedWorldCoastline = compressMap(worldCoastline);
    //logMap("worldCoastline", compressedWorldCoastline, 1);

    aos_fm_c = new PrairieDraw("aos-fm-c", function() {
        this.setUnits(360, 180);

        this.addOption("showMapPath", false);
        this.addOption("showShortestPath", false);

        this.save();
        this.setProp("shapeStrokeWidthPx", 1);
        this.setProp("shapeOutlineColor", "rgb(200, 200, 200)");
        var i;
        for (i = -170; i <= 170; i += 10) {
            this.line($V([i, -90]), $V([i, 90]));
        }
        for (i = -80; i <= 80; i += 10) {
            this.line($V([-180, i]), $V([180, i]));
        }
        this.restore();

        this.save();
        this.setProp("shapeStrokeWidthPx", 1);
        for (i = 0; i < worldCoastline.length; i++) {
            this.polyLine(this.pairsToVectors(worldCoastline[i]));
        }
        this.restore();

        var greatCircleWidthPx = 4;
        var greatCircleColor = "rgb(0, 255, 0)";
        var cityRadiusPx = 6;
        var cityColor1 = "rgb(255, 0, 0)";
        var cityColor2 = "rgb(0, 0, 255)";

        var aLat = 40 + 6 / 60 + 35 / 3600;       // Urbana
        var aLong = -(88 + 12 / 60 + 15 / 3600);
        var bLat = 28 + 36 / 60 + 36 / 3600;      // Delhi
        var bLong = 77 + 13 / 60 + 48 / 3600;

        var aP = $V([aLong, aLat]);
        var bP = $V([bLong, bLat]);

        var aS = $V([1, this.degToRad(aLong), Math.PI/2 - this.degToRad(aLat)]);
        var bS = $V([1, this.degToRad(bLong), Math.PI/2 - this.degToRad(bLat)]);

        var aR = this.sphericalToRect(aS);
        var bR = this.sphericalToRect(bS);

        var earthRad = 6.371e6;
        var shortestDist = earthRad * Math.acos(aR.dot(bR));
        var shortestDistStr = (shortestDist / 1000).toFixed(0) + " km";

        var mapDist = 0;
        var nSegments = 100;
        var lastR = aR;
        var vR;
        for (i = 1; i <= nSegments; i++) {
            vR = this.sphericalToRect(this.linearInterpVector(aS, bS, i / nSegments));
            mapDist += vR.subtract(lastR).modulus() * earthRad;
            lastR = vR;
        }
        var mapDistStr = (mapDist / 1000).toFixed(0) + " km";

        if (this.getOption("showMapPath")) {
            this.text(this.linearInterpVector(aP, bP, 0.5), $V([0, 1]), mapDistStr, true);
            this.save();
            this.setProp("shapeOutlineColor", "rgb(255, 0, 255)");
            this.setProp("shapeStrokeWidthPx", greatCircleWidthPx);
            this.line(aP, bP);
            this.restore();
        }

        if (this.getOption("showShortestPath")) {
            var points = [];
            var vS;
            for (i = 0; i <= nSegments; i++) {
                vR = this.linearInterpVector(aR, bR, i / nSegments);
                vS = this.rectToSpherical(vR);
                points.push($V([this.radToDeg(vS.e(2)), this.radToDeg(Math.PI/2 - vS.e(3))]));
            }

            var labelPoint = points[Math.floor(nSegments / 2)];
            this.text(labelPoint, $V([0, 1]), shortestDistStr, true);
            this.save();
            this.setProp("shapeOutlineColor", greatCircleColor);
            this.setProp("shapeStrokeWidthPx", greatCircleWidthPx);
            this.polyLine(points);
            this.restore();
        }

        this.save();
        this.setProp("pointRadiusPx", cityRadiusPx);
        this.setProp("shapeOutlineColor", cityColor1);
        this.text(aP, $V([1.2, 0]), "TEX:Urbana", true);
        this.point(aP);
        this.setProp("shapeOutlineColor", cityColor2);
        this.text(bP, $V([-1.2, 0]), "TEX:Delhi", true);
        this.point(bP);
        this.restore();

        if (false) {
            // solutions to worksheet
            aR = aR.x(earthRad);
            bR = bR.x(earthRad);
            aS = $V([earthRad, aS.e(2), aS.e(3)]);
            bS = $V([earthRad, bS.e(2), bS.e(3)]);
            console.log("**************************************************");
            console.log("Urbana spherical", aS.inspect());
            console.log("Delhi spherical", bS.inspect());
            console.log("Urbana rect", aR.inspect());
            console.log("Delhi rect", bR.inspect());
            console.log("straight line distance", aR.subtract(bR).modulus());
            var theta = Math.acos(aR.dot(bR) / (aR.modulus() * bR.modulus()));
            console.log("great circle distance", earthRad * theta);
            var norm = aR.cross(bR);
            console.log("max latitude (deg)", this.radToDeg(norm.angleFrom(Vector.k)));
            var abHat = bR.subtract(aR).toUnitVector();
            console.log("unit vector U->D", abHat.inspect());
            var tang = this.orthComp(abHat, aR).toUnitVector();
            console.log("tangent", tang.inspect());
            var sBasis = this.sphericalBasis(aS);
            var eR = sBasis[0];
            var eTheta = sBasis[1];
            var ePhi = sBasis[2];
            console.log("eR", eR.inspect());
            console.log("eTheta", eTheta.inspect());
            console.log("ePhi", ePhi.inspect());
            console.log("tang bearing (deg)", this.radToDeg(tang.angleFrom(ePhi.x(-1))));
            // Mercator projection
            aM = $V([aS.e(2), Math.log(Math.tan(Math.PI / 2 - aS.e(3) / 2))]);
            bM = $V([bS.e(2), Math.log(Math.tan(Math.PI / 2 - bS.e(3) / 2))]);
            console.log("mercator bearing (deg)", this.radToDeg(bM.subtract(aM).angleFrom($V([0, 1]))));
        }
    });

    aos_fd_c = new PrairieDraw("aos-fd-c", function() {
        this.setUnits(2.5, 2.5);

        this.addOption("showLabels", true);
        this.addOption("showLatLongLines", true);
        this.addOption("showCityGreatCircle", false);
        this.addOption("showCityGreatCircleNormal", false);
        this.addOption("showCityPositionVectors", false);
        this.addOption("showCityLatLong", true);

        this.addOption("sphereTransPerc", 20);
        
        this.addOption("longitudeDeg1", -20);
        this.addOption("latitudeDeg1", 50);
        this.addOption("longitudeDeg2", 65);
        this.addOption("latitudeDeg2", -20);
        
        this.setProp("hiddenLinePattern", "solid");

        var O = $V([0, 0, 0]);
        var rX = $V([1.2, 0, 0]);
        var rY = $V([0, 1.2, 0]);
        var rZ = $V([0, 0, 1.2]);

        var longDeg1 = this.getOption("longitudeDeg1");
        var longDeg2 = this.getOption("longitudeDeg2");
        var latDeg1 = this.getOption("latitudeDeg1")
        var latDeg2 = this.getOption("latitudeDeg2")
        var theta1 = this.degToRad(longDeg1);
        var theta2 = this.degToRad(longDeg2);
        var phi1 = Math.PI/2 - this.degToRad(latDeg1);
        var phi2 = Math.PI/2 - this.degToRad(latDeg2);

        var p1 = this.sphericalToRect($V([1, theta1, phi1]));
        var p2 = this.sphericalToRect($V([1, theta2, phi2]));
        var p12Norm = p1.cross(p2);
        if (p12Norm.modulus() < 1e-10) {
            p12Norm = p1.cross(Vector.i);
            if (p12Norm.modulus() < 1e-10) {
                p12Norm = p1.cross(Vector.j);
            }
        }
        p12Norm = p12Norm.toUnitVector();

        var cityRadiusPx = 6;
        var cityColor1 = "rgb(255, 0, 0)";
        var cityColor2 = "rgb(0, 0, 255)";
        var greatCircleWidthPx = 4;
        var greatCircleColor = "rgb(0, 255, 0)";

        var rXS = $V([1, 0, 0]);
        var rYS = $V([0, 1, 0]);
        var rZS = $V([0, 0, 1]);
        var rXVw = this.posDwToVw(rX);
        var rYVw = this.posDwToVw(rY);
        var rZVw = this.posDwToVw(rZ);
        var rXBack = (rXVw.e(3) < 0);
        var rYBack = (rYVw.e(3) < 0);
        var rZBack = (rZVw.e(3) < 0);

        /***********************************************************/
        // back lines

        // cities
        var p1Vw = this.posDwToVw(p1);
        var p2Vw = this.posDwToVw(p2);
        var p1Back = (p1Vw.e(3) < 0);
        var p2Back = (p2Vw.e(3) < 0);
        if (p1Back) {
            this.save();
            this.setProp("pointRadiusPx", cityRadiusPx);
            this.setProp("shapeOutlineColor", cityColor1);
            this.point(p1);
            this.restore();
            if (this.getOption("showLabels")) {
                this.text(p1, $V([1.2, -1.2]), "TEX:$A$");
            }
        }
        if (p2Back) {
            this.save();
            this.setProp("pointRadiusPx", cityRadiusPx);
            this.setProp("shapeOutlineColor", cityColor2);
            this.point(p2);
            this.restore();
            if (this.getOption("showLabels")) {
                this.text(p2, $V([-1.2, -1.2]), "TEX:$B$");
            }
        }

        // great circle between cities
        if (this.getOption("showCityGreatCircle")) {
            this.save();
            this.setProp("hiddenLineWidthPx", greatCircleWidthPx);
            this.setProp("hiddenLineColor", greatCircleColor);
            this.sphereSlice(O, 1, p12Norm, 0, true, false);
            this.restore();
        }

        // city lat/long
        if (this.getOption("showCityLatLong")) {
            this.save();
            this.setProp("hiddenLineWidthPx", greatCircleWidthPx);
            this.setProp("hiddenLineColor", cityColor1);
            if (longDeg1 !== 0) {
                this.sphereSlice(O, 1, Vector.k, 0, true, false, Vector.i, 0, theta1);
            }
            if (latDeg1 !== 0) {
                var norm = $V([-Math.sin(theta1), Math.cos(theta1), 0]);
                this.sphereSlice(O, 1, norm, 0, true, false, p1, Math.PI/2 - phi1, 0);
            }
            this.setProp("hiddenLineColor", cityColor2);
            if (longDeg2 !== 0) {
                this.sphereSlice(O, 1, Vector.k, 0, true, false, Vector.i, 0, theta2);
            }
            if (latDeg2 !== 0) {
                var norm = $V([-Math.sin(theta2), Math.cos(theta2), 0]);
                this.sphereSlice(O, 1, norm, 0, true, false, p2, Math.PI/2 - phi2, 0);
            }
            this.restore();
        }

        // coordinate axes
        if (rXBack) {
            this.arrow(O, rX);
            if (this.getOption("showLabels")) {
                this.labelLine(O, rX, $V([1, -1]), "TEX:$x$");
            }
        } else {
            this.line(O, rXS);
        }
        if (rYBack) {
            this.arrow(O, rY);
            if (this.getOption("showLabels")) {
                this.labelLine(O, rY, $V([1, -1]), "TEX:$y$");
            }
        } else {
            this.line(O, rYS);
        }
        if (rZBack) {
            this.arrow(O, rZ);
            if (this.getOption("showLabels")) {
                this.labelLine(O, rZ, $V([1, -1]), "TEX:$z$");
            }
        } else {
            this.line(O, rZS);
        }
        if (this.getOption("showLabels")) {
            this.labelIntersection(O, [rX, rY, rZ], "TEX:$O$");
        }

        var i, norm, theta;
        var n_lat = 2;
        var n_long = 4;
        if (this.getOption("showLatLongLines")) {
            for (i = 0; i < n_long; i++) {
                theta = i / n_long * Math.PI;
                norm = $V([-Math.sin(theta), Math.cos(theta), 0]);
                this.sphereSlice(O, 1, norm, 0, true, false);
            }
            for (i = -n_lat; i <= n_lat; i++) {
                this.sphereSlice(O, 1, Vector.k, Math.sin(i * Math.PI / (2 * n_lat + 2)), true, false);
            }
        }

        // city position vectors
        if (this.getOption("showCityPositionVectors")) {
            this.save();
            this.setProp("arrowLineWidthPx", greatCircleWidthPx);
            this.arrow(O, p1, cityColor1);
            this.arrow(O, p2, cityColor2);
            this.restore();
        }

        /***********************************************************/
        // sphere with alpha

        this.save();
        var sphereAlpha = 1 - this.getOption("sphereTransPerc") / 100;
        this.setProp("shapeInsideColor", "rgba(255, 255, 255, " + sphereAlpha + ")");
        this.sphere(O, 1, true);
        this.restore();

        /***********************************************************/
        // front lines

        if (this.getOption("showLatLongLines")) {
            for (i = 0; i < n_long; i++) {
                theta = i / n_long * Math.PI;
                norm = $V([-Math.sin(theta), Math.cos(theta), 0]);
                this.sphereSlice(O, 1, norm, 0, false, true);
            }
            for (i = -n_lat; i <= n_lat; i++) {
                this.sphereSlice(O, 1, Vector.k, Math.sin(i * Math.PI / (2 * n_lat + 2)), false, true);
            }
        }

        // city lat/long
        if (this.getOption("showCityLatLong")) {
            this.save();
            this.setProp("shapeStrokeWidthPx", greatCircleWidthPx);
            this.setProp("shapeOutlineColor", cityColor1);
            if (longDeg1 !== 0) {
                this.sphereSlice(O, 1, Vector.k, 0, false, true, Vector.i, 0, theta1);
            }
            if (latDeg1 !== 0) {
                var norm = $V([-Math.sin(theta1), Math.cos(theta1), 0]);
                this.sphereSlice(O, 1, norm, 0, false, true, p1, Math.PI/2 - phi1, 0);
            }
            this.setProp("shapeOutlineColor", cityColor2);
            if (longDeg2 !== 0) {
                this.sphereSlice(O, 1, Vector.k, 0, false, true, Vector.i, 0, theta2);
            }
            if (latDeg2 !== 0) {
                var norm = $V([-Math.sin(theta2), Math.cos(theta2), 0]);
                this.sphereSlice(O, 1, norm, 0, false, true, p2, Math.PI/2 - phi2, 0);
            }
            this.restore();
        }

        // great circle between cities
        if (this.getOption("showCityGreatCircle")) {
            this.save();
            this.setProp("shapeStrokeWidthPx", greatCircleWidthPx);
            this.setProp("shapeOutlineColor", greatCircleColor)
            this.sphereSlice(O, 1, p12Norm, 0, false, true);
            this.restore();
        }

        // cities
        if (!p1Back) {
            this.save();
            this.setProp("pointRadiusPx", cityRadiusPx);
            this.setProp("shapeOutlineColor", cityColor1);
            this.point(p1);
            this.restore();
            if (this.getOption("showLabels")) {
                this.text(p1, $V([1.2, -1.2]), "TEX:$A$");
            }
        }
        if (!p2Back) {
            this.save();
            this.setProp("pointRadiusPx", cityRadiusPx);
            this.setProp("shapeOutlineColor", cityColor2);
            this.point(p2);
            this.restore();
            if (this.getOption("showLabels")) {
                this.text(p2, $V([-1.2, -1.2]), "TEX:$B$");
            }
        }

        // coordinate axes
        if (!rXBack) {
            this.arrow(rXS, rX);
            if (this.getOption("showLabels")) {
                this.labelLine(O, rX, $V([1, -1]), "TEX:$x$");
            }
        }
        if (!rYBack) {
            this.arrow(rYS, rY);
            if (this.getOption("showLabels")) {
                this.labelLine(O, rY, $V([1, -1]), "TEX:$y$");
            }
        }
        if (!rZBack) {
            this.arrow(rZS, rZ);
            if (this.getOption("showLabels")) {
                this.labelLine(O, rZ, $V([1, -1]), "TEX:$z$");
            }
        }
    });

    aos_fd_c.activate3DControl();

    aos_fp_c = new PrairieDraw("aos-fp-c", function() {
        this.setUnits(360, 360);

        this.addOption("projection", "equirectangular");

        var projFunc;
        if (this.getOption("projection") === "mercator") {
            projFunc = function(p) {
                var phi = Math.max(-89, Math.min(89, p[1])) / 180 * Math.PI
                return $V([p[0], Math.log(Math.tan(Math.PI / 4 + phi / 2)) * 180 / Math.PI]);
            };
        } else if (this.getOption("projection") === "hobo-dyer") {
            projFunc = function(p) {
                return $V([p[0], Math.sin(p[1] / 180 * Math.PI) / Math.pow(Math.cos(37.5 / 180 * Math.PI), 2) * 180 / Math.PI]);
            };
        } else if (this.getOption("projection") === "winkel") {
            projFunc = function(p) {
                var lambda = p[0] / 180 * Math.PI;
                var phi = p[1] / 180 * Math.PI;
                var phi1 = Math.acos(2 / Math.PI);
                var alpha = Math.acos(Math.cos(phi) * Math.cos(lambda / 2));
                var x = 0.5 * (lambda * Math.cos(phi1) + 2 * Math.cos(phi) * Math.sin(lambda / 2) / (Math.sin(alpha) / alpha));
                var y = 0.5 * (phi + Math.sin(phi) / (Math.sin(alpha) / alpha));
                return $V([x * 68, y * 68]);
            };
        } else {
            // equirectangular
            projFunc = function(p) {
                return $V([p[0], p[1]]);
            };
        }

        this.save();
        this.setProp("shapeStrokeWidthPx", 1);
        this.setProp("shapeOutlineColor", "rgb(200, 200, 200)");
        var i, j, p;
        for (i = -180; i <= 180; i += 10) {
            p = [];
            for (j = -90; j <= 90; j += 10) {
                p.push([i, j]);
            }
            this.polyLine(p.map(projFunc));
        }
        for (j = -90; j <= 90; j += 10) {
            p = [];
            for (i = -180; i <= 180; i+= 10) {
                p.push([i, j]);
            }
            this.polyLine(p.map(projFunc));
        }
        this.restore();

        this.save();
        this.setProp("shapeStrokeWidthPx", 1);
        for (i = 0; i < worldCoastline.length; i++) {
            this.polyLine(worldCoastline[i].map(projFunc));
        }
        this.restore();
    });

    rvy_fd_c = new PrairieDraw("rvy-fd-c", function() {
        this.setUnits(11, 11);

        this.addOption("r", 4);
        this.addOption("thetaDeg", 45);
        this.addOption("z", 4);

        this.addOption("showLabels", true);
        this.addOption("showCoords", true);
        this.addOption("showBasis", false);

        this.addOption("showCoordLineR", false);
        this.addOption("showCoordLineTheta", false);
        this.addOption("showCoordLineZ", false);

        var O = $V([0, 0, 0]);
        var rX = $V([5, 0, 0]);
        var rY = $V([0, 5, 0]);
        var rZ = $V([0, 0, 5]);
        this.arrow(O, rX);
        this.arrow(O, rY);
        this.arrow(O, rZ);
        if (this.getOption("showLabels")) {
            this.labelLine(O, rX, $V([1, -1]), "TEX:$x$");
            this.labelLine(O, rY, $V([1, 1]), "TEX:$y$");
            this.labelLine(O, rZ, $V([1, 1]), "TEX:$z$");
        }

        var r = this.getOption("r");
        var theta = this.degToRad(this.getOption("thetaDeg"));
        var z = this.getOption("z");

        var p = this.cylindricalToRect($V([r, theta, z]));
        var pXY = this.cylindricalToRect($V([r, theta, 0]));
        var pZ = this.cylindricalToRect($V([0, 0, z]));
        var pX = this.cylindricalToRect($V([r, 0, 0]));
        var pXZ = this.cylindricalToRect($V([r, 0, z]));

        if (this.getOption("showLabels")) {
            this.labelIntersection(O, [rX, rY, rZ, p, pXY], "TEX:$O$");
            this.labelIntersection(p, [O, pXY], "TEX:$P$");
        }

        if (this.getOption("showCoordLineR")) {
            var pZExt = this.cylindricalToRect($V([6, theta, z]));
            this.save();
            this.setProp("shapeStrokePattern", "dashed");
            this.line(pZ, pZExt);
            this.restore();
        }

        if (this.getOption("showCoordLineTheta")) {
            this.save();
            this.setProp("shapeStrokePattern", "dashed");
            this.arc3D(pZ, r, Vector.k);
            this.restore();
        }

        if (this.getOption("showCoordLineZ")) {
            var pZ1 = this.cylindricalToRect($V([r, theta, -5]));
            var pZ2 = this.cylindricalToRect($V([r, theta, 5]));
            this.save();
            this.setProp("shapeStrokePattern", "dashed");
            this.line(pZ1, pZ2);
            this.restore();
        }

        this.arrow(O, p, "position");
        if (this.getOption("showLabels")) {
            this.labelLine(O, p, $V([0, 1]), "TEX:$\\vec{\\rho}$");
        }

        if (this.getOption("showCoords")) {
            this.save();
            this.setProp("shapeStrokePattern", "dashed");
            this.setProp("arrowLinePattern", "dashed");
            if (z !== 0 && theta !== 0) {
                this.arrow(O, pXY);
            }
            if (this.getOption("showLabels")) {
                this.labelLine(O, pXY, $V([0, -1]), "TEX:$r$");
            }
            if (z !== 0) {
                this.line(pZ, p);
            }
            if (z !== 0 && theta !== 0) {
                this.line(pZ, pXZ);
            }

            if (!(this.getOption("showCoordLineTheta") && z === 0)) {
                this.circleArrow3D(O, r, Vector.k, Vector.i, 0, theta);
            }
            if (!this.getOption("showCoordLineTheta")) {
                this.arc3D(pZ, r, Vector.k, Vector.i, 0, theta);
            }
            if (this.getOption("showLabels")) {
                var thetaText = undefined;
                if (theta > 0) {
                    thetaText = "TEX:$\\theta$";
                } else if (theta < 0) {
                    thetaText = "TEX:$-\\theta$";
                }
                this.labelCircleLine3D(thetaText, $V([0, 1]), O, r, Vector.k, Vector.i, 0, theta);
            }

            if (!this.getOption("showCoordLineZ")) {
                this.arrow(pXY, p);
            }
            if (theta !== 0) {
                this.line(pX, pXZ);
            };
            if (z < 0) {
                this.line(O, pZ);
            }
            if (this.getOption("showLabels")) {
                if (z > 0) {
                    this.labelLine(pXY, p, $V([0, -1]), "TEX:$z$");
                } else if (z < 0) {
                    this.labelLine(pXY, p, $V([0, 1]), "TEX:$-z$");
                }
            }
            this.restore();
        }

        if (this.getOption("showBasis")) {
            var eR = this.cylindricalToRect($V([1, theta, 0]));
            var eTheta = $V([-Math.sin(theta), Math.cos(theta), 0]);
            var eZ = $V([0, 0, 1]);
            this.arrow(p, p.add(eR));
            this.arrow(p, p.add(eTheta));
            this.arrow(p, p.add(eZ));
            if (this.getOption("showLabels")) {
                this.labelLine(p, p.add(eR), $V([1, 0]), "TEX:$\\hat{e}_r$");
                this.labelLine(p, p.add(eTheta), $V([1, 0]), "TEX:$\\hat{e}_\\theta$");
                this.labelLine(p, p.add(eZ), $V([1, 0]), "TEX:$\\hat{e}_z$");
            }
        }
    });

    rvy_fd_c.activate3DControl();

    $( window ).on( "resize", function() {
        rvv_fc_c.redraw();
        rvp_fc_c.redraw();
        rvp_fp_c.redraw();
        rvv_fu_c.redraw();
        rvv_fb_c.redraw();
        rvv_f3_c.redraw();
        rvv_fy_c.redraw();
        rvv_fr_c.redraw();
        rvv_fl_c.redraw();
        rvv_ft_c.redraw();
        rvv_xn_c.redraw();
        rvv_e2_c.redraw();
        rvv_xa_c.redraw();
        rvv_xx_c.redraw();
        rvv_fm_c.redraw();
        rvc_fm_c.redraw();
        rvs_fd_c.redraw();
        rvs_ec_c.redraw();
        rvy_fd_c.redraw();
        aos_fm_c.redraw();
        aos_fd_c.redraw();
        aos_fp_c.redraw();
    } );
})