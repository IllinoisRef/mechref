$(document).ready(function(){
    var ren_xgp_c = new PrairieDraw("ren-xgp-c", function() {

        this.setUnits(6, 4);

        var O = $V([0, 0]);

        this.rectangle(1, 1, O);
        this.text(O, O, "TEX:$m$");
        this.arrow($V([-1.5, 0.5]), $V([-1.5, -0.5]), "acceleration");
        this.labelLine($V([-1.5, 0.5]), $V([-1.5, -0.5]), $V([1, 0]), "TEX:$g$");      
    });

    var ren_xsp_c = new PrairieDraw("ren-xsp-c", function() {

        this.setUnits(6, 4);

        var O = $V([0, 0]);
        var springStart = $V([-2.8, -1.3]);
        var segmentNumber = 20;
        var spacing = 0.08;
        var segmentStart = springStart.add($V([0.2, 0]));
        var xStart = segmentStart.e(1);
        var yStart = segmentStart.e(2);

        this.ground(O.add($V([0.2, -1.8])), $V([0, 1]), 6);
        this.ground(O.add($V([-2.8, 0.2])), $V([1, 0]), 4);
        this.line(springStart, segmentStart);

        for (var n = 0; n < segmentNumber; n++) {
            var x = xStart + spacing;
            var y;

            if (n % 2 == 0) {
                y = yStart - 0.15;
            }
            else {
                y = springStart.e(2);
            };

            this.line($V([xStart, yStart]), $V([x, y]));
            xStart = x;
            yStart = y;
        };

        this.line($V([xStart, yStart]), $V([xStart + 0.2, yStart]));
        this.rectangle(1, 1, O.subtract($V([0.28, 1.3])));
        this.text(O.subtract($V([0.28, 1.3])), O, "TEX:$m$");
    });

    var ren_cf_c = new PrairieDraw("ren-cf-c", function() {

        this.setUnits(8, 4);

        var O = $V([0, 0]);

        var A = $V([-3, -1]);
        var B = A.x(-1);

        this.save();
        this.text(A, O.subtract($V([-1, -1])), "TEX:$A$");
        this.text(B, O.subtract($V([1, 1])), "TEX:$B$");
        this.setProp('shapeOutlineColor', "rgb(0, 0, 255)");
        this.line(A, B);
        this.restore();
        this.setProp('shapeOutlineColor', "rgb(255, 0, 0)");
        this.cubicBezier(A, O, O.add($V([-2, 2])), B);
        this.restore();
        this.setProp('shapeOutlineColor', "rgb(0, 200, 0)");
        this.cubicBezier(A, O, O.add($V([-2, -3])), B);
        this.setProp("pointRadiusPx", 4);
        this.setProp('shapeOutlineColor', "rgb(0, 0, 0)");
        this.point(A);
        this.point(B);
    });

    var rec_xlm_c = new PrairieDraw("rec-xlm-c", function() {

        this.setUnits(6, 4);

        var O = $V([0, 0]);

        this.rectangle(1, 1, O);
        this.text(O, O, "TEX:$m$");
        this.arrow($V([-1.5, 0.5]), $V([-1.5, -0.5]), "acceleration");
        this.labelLine($V([-1.5, 0.5]), $V([-1.5, -0.5]), $V([1, 0]), "TEX:$g$");      
    });

    var rec_xlm_f = new PrairieDraw("rec-xlm-f", function() {
        this.setUnits(6, 4);

        var O = $V([0, 0]);

        this.rectangle(1, 1, O, undefined, false);
        this.arrow(O, O.add($V([0, -1])), "force");
        this.labelLine(O, O.add($V([0, -1])), $V([1, 0]), "TEX:$mg$");
    });

    var rec_xam_c = new PrairieDraw("rec-xam-c", function() {

        this.setUnits(6, 4);

        var O = $V([0, 0]);
        var sat = this.vector2DAtAngle(Math.PI/6).x(1.5)

        this.circle(O, 1.5, false);
        this.circle(O, 0.8);
        this.circle(sat, 0.1)
        this.arrow(O, sat, "position");
        this.labelLine(O, sat, $V([0.3, 1]), "TEX:$r$");
        this.text(sat, $V([-1.5, -1]), "TEX:$m$");
    });

    var rec_xam_f = new PrairieDraw("rec-xam-f", function() {

        this.setUnits(6, 4);

        var O = $V([0, 0]);
        var sat = this.vector2DAtAngle(Math.PI/6).x(1.5)
        var sat2 = this.vector2DAtAngle(Math.PI/6).x(0.75)

        this.circle(O, 0.8, false);
        this.circle(sat, 0.1, false);
        this.arrow(sat, sat2, "force");
        this.arrow(O, sat2, "force");
        this.text(sat, $V([-1.5, -1]), "TEX:$m$");
        this.labelLine(sat, sat2, $V([0, -1]), "TEX:$mg$");
        this.labelLine(O, sat2, $V([0, -1.5]), "TEX:$mg$");
    });

    var rec_xr_c = new PrairieDraw("rec-xr-c", function() {

        this.setUnits(12, 4);
        
        var O = $V([0,0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);
        var O_P = $V([-5.5, -1.5]);

        // Drawing the origin and basis vectors
        this.text(O_P.add($V([-0.2, -0.2])), $V([-1, 0]), "TEX:$O$");
        this.arrow(O_P, O_P.add(ei));
        this.arrow(O_P, O_P.add(ej));
        this.labelLine(O_P, O_P.add(ei), $V([1, 0]), "TEX:$\\hat\\imath$");
        this.labelLine(O_P, O_P.add(ej), $V([1, 0]), "TEX:$\\hat\\jmath$");

        // Drawing rocket body
        this.line(ei.x(-1), O.add(ei));
        this.line(ei.x(-1), ei.x(-1).add(ej));
        this.line(ei.x(-1).add(ej), $V([1, 1]));

        // Drawing rocket nose
        this.line($V([1, 1]), $V([1.2, 0.8]));
        this.line(ei, $V([1.2, 0.2]));

        this.line($V([1.2, 0.8]), $V([2.2, 0.8]));
        this.line($V([1.2, 0.2]), $V([2.2, 0.2]));

        this.line($V([2.2, 0.8]), $V([2.5, 0.5]));
        this.line($V([2.2, 0.2]), $V([2.5, 0.5]));

        // Drawing rocket nozzle
        this.setProp("shapeInsideColor", "rgb(0,0,0)");
        this.polyLine([$V([-1.4, 0.1]), $V([-1, 0.3]), $V([-1, 0.7]), $V([-1.4, 0.9])], true, true);

        // Drawing rocket burn
        this.setProp("shapeInsideColor", "rgb(230,230,230");
        this.polyLine([$V([-3, -0.2]), $V([-1.4, 0.1]), $V([-1.4, 0.9]), $V([-3, 1.2])], true, true);

        // Drawing effective exhaust velocity and velocity of the rocket vectors
        this.text($V([0, 0.5]), $V([-1, 0]), "TEX:$m$");
        this.arrow($V([2.7, 0.5]), $V([4, 0.5]), "velocity");
        this.labelLine($V([2.7, 0.5]), $V([4, 0.5]), $V([0, 1]), "TEX:$\\vec{v}$");
        this.arrow($V([-1.6, 0.5]), $V([-2.6, 0.5]), "velocity");
        this.labelLine($V([-1.6, 0.5]), $V([-2.6, 0.5]), $V([0, -1]), "TEX:$\\vec{c}$");
    });

    rec_eco_c = new PrairieDrawAnim("rec-eco-c", function(t) {

        var xViewMax = 6;
        var yViewMax = 2;
        var xWorldMax = xViewMax * 1.1;
        var yWorldMax = yViewMax * 1.1;

        var groundX = -5.6;

        var O = $V([0,0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        var P1 = $V([-5.8, r1y]);
        var P2 = $V([5.8, r1y]);

        dt = this.deltaTime();

        this.setUnits(2*xViewMax, 2*yViewMax);

        this.addOption("v1x", 1);
        this.addOption("v2x", -1);
        this.addOption("r1x", -2);
        this.addOption("r2x", 2);
        this.addOption("m1", 1);
        this.addOption("m2", 1);
        this.addOption("movement", "translate");

        

        var r1x = this.getOption("r1x");
        var r2x = this.getOption("r2x");
        var v1x = Number(this.getOption("v1x"));
        var v2x = Number(this.getOption("v2x"));
        var m1 = this.getOption("m1");
        var m2 = this.getOption("m2");



        var width_m1 = 0.49 + 0.01*m1;
        var width_m2 = 0.49 + 0.01*m2;
        var height_m1 = width_m1;
        var height_m2 = width_m2;

        var r1y = -1.8 + width_m1/2;
        var r2y = -1.8 + width_m2/2;

        if (dt > 0 && dt < 0.1) {
            // Check wall collision
            if (r1x - width_m1/2 <= P1.e(1)) {
                v1x = -v1x;
            };

            if (r2x + width_m2/2 >= P2.e(1)) {
                v2x = -v2x;
            };
            // Check blocks collision
            if (r1x + width_m1/2 >= r2x-width_m2/2) {

                p1 = m1*v1x + m2*v2x;

                v2fx = (m1 * v2x - m1 * v1x - p1)/(-1 * m2 - m1);
                v1fx = v2x + v2fx - v1x;

                v1x = v1fx;
                v2x = v2fx;
            };
            r1x = r1x + v1x * dt;
            r2x = r2x + v2x * dt;
            this.setOption("r1x", r1x, false);
            this.setOption("v1x", v1x, false);
            this.setOption("r2x", r2x, false);
            this.setOption("v2x", v2x, false);
        };
        
        this.save();
        this.ground($V([0, -1.8]), ej, 12);
        this.ground($V([-5.8, 0.2]), ei, 4);
        this.ground($V([5.8, 0.2]), ei.x(-1), 4);
        this.rectangle(width_m1, height_m1, $V([r1x, r1y]));
        this.rectangle(width_m2, height_m2, $V([r2x, r2y]));
        if (Math.abs(v1x) > 0) {
            this.arrow($V([r1x, r1y]), $V([r1x, r1y]).add($V([v1x, 0])), "velocity");
            this.labelLine($V([r1x, r1y]), $V([r1x, r1y]).add($V([v1x, 0])), ei, "TEX:$\\vec{v}_1$");
        }

        if (Math.abs(v2x) > 0) {
            this.arrow($V([r2x, r2y]), $V([r2x, r2y]).add($V([v2x, 0])), "velocity");
            this.labelLine($V([r2x, r2y]), $V([r2x, r2y]).add($V([v2x, 0])), ei, "TEX:$\\vec{v}_2$");
        }
        this.text($V([r1x, r1y]), $V([0, r1y - 2.5*width_m1]), "TEX:$m_1$");
        this.text($V([r2x, r2y]), $V([0, r2y - 2.5*width_m2]), "TEX:$m_2$");
    });

    rec_ico_c = new PrairieDrawAnim("rec-ico-c", function(t) {

        var xViewMax = 6;
        var yViewMax = 2;
        var xWorldMax = xViewMax * 1.1;
        var yWorldMax = yViewMax * 1.1;

        var groundX = -5.6;

        var O = $V([0,0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);

        var P1 = $V([-5.8, r1y]);
        var P2 = $V([5.8, r1y]);

        dt = this.deltaTime();
        var coll = false;

        this.setUnits(2*xViewMax, 2*yViewMax);

        this.addOption("v1x", 1);
        this.addOption("v2x", -1);
        this.addOption("r1x", -2);
        this.addOption("r2x", 2);
        this.addOption("m1", 1);
        this.addOption("m2", 1);
        this.addOption("movement", "translate");

        var r1x = this.getOption("r1x");
        var r2x = this.getOption("r2x");
        var v1x = Number(this.getOption("v1x"));
        var v2x = Number(this.getOption("v2x"));
        var m1 = this.getOption("m1");
        var m2 = this.getOption("m2");

        var width_m1 = 0.49 + 0.01*m1;
        var width_m2 = 0.49 + 0.01*m2;
        var height_m1 = width_m1;
        var height_m2 = width_m2;

        var r1y = -1.8 + width_m1/2;
        var r2y = -1.8 + width_m2/2;

        if (dt > 0 && dt < 0.1) {
            // Check wall collision
            if (r1x - width_m1/2 <= P1.e(1)) {
                v1x = -v1x;
            };

            if (r2x + width_m2/2 >= P2.e(1)) {
                v2x = -v2x;
            };
            // Check blocks collision
            if (r1x + width_m1/2 >= r2x-width_m2/2) {
                coll = true;

                p1 = m1*v1x + m2*v2x;

                vf = p1/(m1 + m2)

                v1x = vf;
                v2x = vf;
            };
            r1x = r1x + v1x * dt;
            r2x = r2x + v2x * dt;
            this.setOption("r1x", r1x, false);
            this.setOption("v1x", v1x, false);
            this.setOption("r2x", r2x, false);
            this.setOption("v2x", v2x, false);
        };
        
        this.save();
        this.ground($V([0, -1.8]), ej, 12);
        this.ground($V([-5.8, 0.2]), ei, 4);
        this.ground($V([5.8, 0.2]), ei.x(-1), 4);
        this.rectangle(width_m1, height_m1, $V([r1x, r1y]));
        this.rectangle(width_m2, height_m2, $V([r2x, r2y]));
        if (Math.abs(v1x) > 0 && coll === false) {
            this.arrow($V([r1x, r1y]), $V([r1x, r1y]).add($V([v1x, 0])), "velocity");
            this.labelLine($V([r1x, r1y]), $V([r1x, r1y]).add($V([v1x, 0])), ei, "TEX:$\\vec{v}_1$");
        } else if (v1x > 0 && coll === true) {
            this.arrow($V([r2x, r2y]), $V([r2x, r2y]).add($V([v2x, 0])), "velocity");
            this.labelLine($V([r2x, r2y]), $V([r2x, r2y]).add($V([v2x, 0])), ei, "TEX:$\\vec{v}_f$");
        } else if (v1x < 0 && coll === true) {
            this.arrow($V([r1x, r1y]), $V([r1x, r1y]).add($V([v1x, 0])), "velocity");
            this.labelLine($V([r1x, r1y]), $V([r1x, r1y]).add($V([v1x, 0])), ei, "TEX:$\\vec{v}_f$");
        }

        if (Math.abs(v2x) > 0 && coll === false) {
            this.arrow($V([r2x, r2y]), $V([r2x, r2y]).add($V([v2x, 0])), "velocity");
            this.labelLine($V([r2x, r2y]), $V([r2x, r2y]).add($V([v2x, 0])), ei, "TEX:$\\vec{v}_2$");
        }
        this.text($V([r1x, r1y]), $V([0, r1y - 2.5*width_m1]), "TEX:$m_1$");
        this.text($V([r2x, r2y]), $V([0, r2y - 2.5*width_m2]), "TEX:$m_2$");
    });

    $(window).on("resize", function(){
        ren_xgp_c.redraw();
        ren_xsp_c.redraw();
        ren_cf_c.redraw();
        rec_xlm_c.redraw();
        rec_xlm_f.redraw();
        rec_xam_c.redraw();
        rec_xam_f.redraw();
        rec_xr_c.redraw();
        rec_eco_c.redraw();
        rec_ico_c.redraw();
    });
})