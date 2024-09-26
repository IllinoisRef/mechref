$(document).ready(function(){
    rfb_xzf_f = new PrairieDraw("rfb-xzf-f", function() {
        this.setUnits(6, 4);

        this.addOption("stage", 0);
        this.addOption("FBD", false);

        var stage = Number(this.getOption("stage"));
        
        var label;

        switch(stage) {
            case 0:
                label = "TEX:\\sf Initial truss";
                break;
            case 1:
                label = "TEX:\\sf Inspect $G$";
                break;
            case 2:
                label = "TEX:\\sf Inspect $C$";
                break;
            case 3:
                label = "TEX:\\sf Inspect $F$";
                break;
            case 4:
                label = "TEX:\\sf Inspect $B$";
                break;
            case 5:
                label = "TEX:\\sf Inspect $G$, $F$, $C$, $B$"
                break;
            case 6:
                label = "TEX:\\sf Simplified truss";
                break;
        };

        var optB = 0;
        var optD = 1;
        var optG = 0;

        var a = 1;

        var O = $V([0, 0]);
        var ei = $V([1, 0]);
        var ej = $V([0, 1]);
        
        var rA = $V([0, 0]);  
		var rB = $V([-a, 0]);
		var rC = $V([-2*a, 0]); 
		var rD = $V([-3*a, 0]); 
		var rE = $V([-4*a, 0]); 
		var rF = $V([-a, a]); 
		var rG = $V([-3*a, a]); 
		var rH = $V([-2*a, 2*a]);
		var rb = rB.add(this.vector2DAtAngle(-Math.PI/4).x(.5));
		var rd = rD.add(ej.x(-.5));
		var rg = rG.add(ei.x(-.5));
		var rh = rH.add(ej.x(.5));
		
		// ghost points for bounding box
		
        var bbox = PrairieGeom.boundingBox2D([rA,rh,rE,rd]);	
		var scale = 1;
        var scale = Math.min(6 / bbox.extent.e(1), 6 / this.goldenRatio / bbox.extent.e(2));
        rA = rA.x(scale);
		rB = rB.x(scale);
        rC = rC.x(scale);
		rD = rD.x(scale);
		rE = rE.x(scale);
		rF = rF.x(scale);
		rG = rG.x(scale);
		rH = rH.x(scale);
		rb = rb.x(scale);
		rd = rd.x(scale);
		rg = rg.x(scale);
		rh = rh.x(scale);
		
        var bbox = PrairieGeom.boundingBox2D([rA,rh,rE,rd]);
       
        this.save();
        this.translate(bbox.center.x(-1));

        w = 0.1;

        switch(stage) {
            case 0:
                this.rod(rH, rF, w);
                this.rod(rH, rB, w);
                this.rod(rH, rC, w);
                this.rod(rH, rD, w);
                this.rod(rH, rG, w);

                this.rod(rA, rF, w);
                this.rod(rB, rF, w);
                this.rod(rD, rG, w);
                this.rod(rE, rG, w);
                
                this.rod(rA, rB, w);
                this.rod(rB, rC, w);
                this.rod(rC, rD, w);
                this.rod(rD, rE, w);
                break;
            case 1:
                this.save();
                this.setProp("shapeOutlineColor", "rgba(0, 0, 0, 0.3)");
                this.setProp("shapeInsideColor", "rgba(255, 255, 255, 0.3)");
                this.rod(rH, rF, w);
                this.rod(rH, rB, w);
                this.rod(rH, rC, w);
                this.rod(rH, rD, w);
                this.rod(rH, rG, w);

                this.rod(rA, rF, w);
                this.rod(rB, rF, w);
                this.rod(rE, rG, w);
                
                this.rod(rA, rB, w);
                this.rod(rB, rC, w);
                this.rod(rC, rD, w);
                this.rod(rD, rE, w);
                this.restore();
                this.rod(rD, rG, w);
                this.save();
                this.setProp("shapeOutlineColor", "rgb(255, 0, 0)");
                this.circle(rG, 0.2, false);
                this.restore();
                break;
            case 2:
                this.save();
                this.setProp("shapeOutlineColor", "rgba(0, 0, 0, 0.3)");
                this.setProp("shapeInsideColor", "rgba(255, 255, 255, 0.3)");
                this.rod(rH, rF, w);
                this.rod(rH, rB, w);
                this.rod(rH, rD, w);
                this.rod(rH, rG, w);

                this.rod(rA, rF, w);
                this.rod(rB, rF, w);
                this.rod(rE, rG, w);
                
                this.rod(rA, rB, w);
                this.rod(rB, rC, w);
                this.rod(rC, rD, w);
                this.rod(rD, rE, w);
                this.restore();
                this.rod(rH, rC, w);
                this.save();
                this.setProp("shapeOutlineColor", "rgb(255, 0, 0)");
                this.circle(rC, 0.2, false);
                this.restore();
                break;
            case 3:
                this.save();
                this.setProp("shapeOutlineColor", "rgba(0, 0, 0, 0.3)");
                this.setProp("shapeInsideColor", "rgba(255, 255, 255, 0.3)");
                this.rod(rH, rF, w);
                this.rod(rH, rB, w);
                this.rod(rH, rD, w);
                this.rod(rH, rG, w);

                this.rod(rA, rF, w);
                this.rod(rE, rG, w);
                
                this.rod(rA, rB, w);
                this.rod(rB, rC, w);
                this.rod(rC, rD, w);
                this.rod(rD, rE, w);
                this.restore();
                this.rod(rB, rF, w);
                this.save();
                this.setProp("shapeOutlineColor", "rgb(255, 0, 0)");
                this.circle(rF, 0.2, false);
                this.restore();
                break;
            case 4:
                this.save();
                this.setProp("shapeOutlineColor", "rgba(0, 0, 0, 0.3)");
                this.setProp("shapeInsideColor", "rgba(255, 255, 255, 0.3)");
                this.rod(rH, rF, w);
                this.rod(rH, rD, w);
                this.rod(rH, rG, w);

                this.rod(rA, rF, w);
                this.rod(rE, rG, w);
                
                this.rod(rA, rB, w);
                this.rod(rB, rC, w);
                this.rod(rC, rD, w);
                this.rod(rD, rE, w);
                this.restore();
                this.rod(rH, rB, w);
                this.save();
                this.setProp("shapeOutlineColor", "rgb(255, 0, 0)");
                this.circle(rB, 0.2, false);
                this.restore();
                break;
            case 5:
                this.rod(rH, rF, w);
                this.rod(rH, rD, w);
                this.rod(rH, rG, w);

                this.rod(rA, rF, w);
                this.rod(rE, rG, w);
                
                this.rod(rA, rB, w);
                this.rod(rB, rC, w);
                this.rod(rC, rD, w);
                this.rod(rD, rE, w);

                this.save();
                this.setProp("shapeOutlineColor", "rgb(255, 0, 0)");
                this.circle(rG, 0.2, false);
                this.circle(rF, 0.2, false);
                this.circle(rC, 0.2, false);
                this.circle(rB, 0.2, false);
                this.restore();
                break;
            case 6:
                this.rod(rH, rA, w);
                this.rod(rH, rD, w);
                this.rod(rH, rE, w);

                this.rod(rA, rD, w);
                
                this.rod(rD, rE, w);
                break;
        };
        this.save();
	
		z = .2;
		w = z/4;
		var baseA = rA.add(ej.x(-.25));
		var baseE = rE.add(ej.x(-.25));
        if ((stage === 0 || stage === 6) && !this.getOption("FBD")) {
            this.pivot(baseA, rA, z);		
            this.pivot(baseE, rE, z);
            this.restore();
            
            this.ground(baseA, ej, .4);
            this.ground(baseE, ej, .4);
        };
		
		// force vectors
		this.save();
		
		////////////////////////////////////
		if ( optB == 1 ) {
			this.arrow(rb, rB, "force");
			this.text(rb, $V([-1, -1]), "TEX:$P$"); 
		};
		
		//////////////////////////////////////
		if ( optD == 1 ) {
			this.arrow(rd, rD, "force");
			this.text(rd, $V([-1, 0]), "TEX:$P$");
		};

		//////////////////////////////////////
		if ( optG == 1 ) {
			this.arrow(rg, rG, "force");
			this.text(rg, $V([1, 1]), "TEX:$P$");
		};
		
		//////////////////////////////////////
		// force at H
		this.arrow(rH, rh, "force");
		this.text(rh, $V([1, 0]), "TEX:$P$");
		this.restore();

        if (this.getOption("FBD")) {
            var thetaReaction = Math.PI/4;
            this.arrow(rE, rE.add($V([Math.cos(thetaReaction), Math.sin(thetaReaction)])), "force");
            this.arrow(rA, rA.add($V([-Math.cos(thetaReaction), Math.sin(thetaReaction)])), "force");

            this.labelLine(rE, rE.add($V([Math.cos(thetaReaction), Math.sin(thetaReaction)])), ej.x(2), "TEX:$F_E$");
            this.labelLine(rA, rA.add($V([-Math.cos(thetaReaction), Math.sin(thetaReaction)])), ej.x(-2), "TEX:$F_A$");
        };
		
        if (stage <= 5) {
            this.point(rA);
            this.point(rB);
            this.point(rC);
            this.point(rD);
            this.point(rE);
            this.point(rF);
            this.point(rG);
            this.point(rH);

            this.text(rA, $V([-2.5, 0]), "TEX:$A$");  
            this.text(rB, $V([1.5, 1.5]), "TEX:$B$");
            this.text(rC, $V([1.5, 1.5]), "TEX:$C$");
            this.text(rD, $V([1.5, 1.5]), "TEX:$D$");
            this.text(rE, $V([1, -2]), "TEX:$E$");  
            this.text(rF, $V([-1, -1.5]), "TEX:$F$");
            this.text(rG, $V([1, -1.5]), "TEX:$G$");
            this.text(rH, $V([2, 0]), "TEX:$H$");
        } else {
            this.point(rA);
            this.point(rD);
            this.point(rE);
            this.point(rH);

            this.text(rA, $V([-2.5, 0]), "TEX:$A$");  
            this.text(rD, $V([1.5, 1.5]), "TEX:$D$");
            this.text(rE, $V([1, -2]), "TEX:$E$");  
            this.text(rH, $V([2, 0]), "TEX:$H$");
        };
        
        this.text(O.add(ej.x(2.5)).add(ei.x(-4.5)), O, label);		
        
        this.restore();

    });

    $( window ).on( "resize", function() {
        rfb_xzf_f.redraw();
    })
})
