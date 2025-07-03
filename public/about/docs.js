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
        this.text($V([0.3, -0.16]), $V([0, 0]), "TEX:$\\mathcal{B}_1$");
        this.restore();

        this.save();
        this.translate(rP2);
        this.rotate(theta2);
        this.rectangle(0.8, 0.8 / this.goldenRatio, O, 0, true);
        this.text($V([0.3, -0.16]), $V([0, 0]), "TEX:$\\mathcal{B}_2$");
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

    rcm_er_c = new PrairieDraw("rcm-er-c", function() {
        this.setUnits(5, 5 / this.goldenRatio);
    
        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);
    
        var P1 = ei.x(-1);
        var P2 = ei;
        var P3 = ei.add(ej);
        var P4 = ei.x(-1).add(ej);
    
        this.save();
        this.translate(ej.x(-1));
        this.scale($V([2, 2]));
        this.polyLine([P1, P2, P3, P4], true, true);
        this.setProp("pointRadiusPx", 2.5);
        this.point(P1);
        this.setProp("arrowLineWidthPx", 2.5);
        // this.arrow(P1, P1.add(ei.x(0.5)));
        // this.arrow(P1, P1.add(ej.x(0.5)));
        this.text(P1, ei.add(ej), "TEX:$O$");
        // this.labelLine(P1, P1.add(ei.x(0.5)), $V([0.5, -1.5]), "TEX:$\\hat{\\imath}$");
        // this.labelLine(P1, P1.add(ej.x(0.5)), $V([0.5, 1.5]), "TEX:$\\hat{\\jmath}$");
        this.restore();
        this.centerOfMass(O);
        this.text(ej, $V([0, -1.5]), "TEX:$\\ell_x$");
        this.text(ei.x(2), $V([-1.5, 0]), "TEX:$\\ell_y$");
    });

    $(window).on("resize", function(){
        rkg_fw_c.redraw();
        rcm_er_c.redraw();
    });
})