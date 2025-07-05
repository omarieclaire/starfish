class DynRescale {

    constructor() {
        this.min = false;
        this.max = false;
        this.name = false;
    }

    
    scale(inval, outmin, outmax){
       console.log("scaling " + this.name + " " + inval);
       console.log(this.min +" , "+this.max);
        // do thje math
        if(this.min === false || inval < this.min){
           console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< setting min " + inval);
            this.min = inval;
        }
        if(this.max === false || inval > this.max){
           console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> setting max " + inval);
            this.max = inval;
        }
       console.log(this.min +" , "+this.max);
        let mapped = this.floatMap(inval, this.min, this.max, outmin, outmax);
       console.log("mapped " + mapped);
        return mapped;
    }

    reset(){
        this.min = false;
        this.max = false;

    }

    constrain(inval, min, max){
        if(inval < min){
            inval = min;
        }
        if(inval > max){
            inval = max;
        }
        return inval;
    }

    floatMap(inValue, inMin, inMax, outMin, outMax){
       console.log("floatMap : " + inValue + " : " + inMin + " : " + inMax);
        // assume all values are 0-1
        let inRange = inMax - inMin;
       console.log(inRange);
        if(inRange == 0){
           console.log("0 range, returning outMin " +outMin);
            //bad division, just return the outMin
            return outMin;
        }
        let outRange = outMax - outMin;
        let ratio = outRange / inRange; 
        let inFlat = inValue - inMin;
        let outFlat = inFlat * ratio;
        let out = outMin + outFlat;
        return out;
      }

}

module.exports = DynRescale;