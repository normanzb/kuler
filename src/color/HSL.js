define(['../lib/COGS/cogs', './const'], function(cogs, cnst){
    var Ctor = cogs.ctor(function(){
        this._h = null;
        this._c = null;
        this._s = 0;
        this._l = 0;
    });

    cogs.mixin(Ctor, {
        get hue(){
            return this._h;
        },
        set hue(value){
            this._h = value;
        },
        get chroma(){
            return this._c;
        },
        set chroma(value){
            this._c = value;
        },
        get lightness(){
            return this._l;
        },
        set lightness(value){
            this._l = value;
        },
        get saturation(){
            return this._s;
        },
        set saturation(value){
            this._s = value;
        },
        from: function (obj){
            // duck typing to avoid circle ref
            if (!('red' in obj && 'blue' in obj && 'green' in obj)){
                throw "Not supported object"
            }

            var r = obj.red / cnst.MAX;
            var g = obj.green / cnst.MAX;
            var b = obj.blue / cnst.MAX;

            var max = Math.max(r, g, b);
            var min = Math.min(r, g, b);

            this.lightness = (max + min) / 2;

            if (max == min){
                this.hue = null;
                this.saturation = null;
                this.chroma = null;
            }
            else{

                this.chroma = max - min;
                this.saturation = this.lightness == 0 ? 0: this.chroma / (1 - Math.abs(2 * this.lightness - 1)) 

                switch(max){
                    case r:
                        this.hue = ( g - b ) / this.chroma + ( g < b ? 6 : 0 );
                        break;
                    case g:
                        this.hue = ( b - r ) / this.chroma + 2;
                        break;
                    case b:
                    default:
                        this.hue = ( r - g ) / this.chroma + 4;
                        break;
                }

                this.hue = this.hue / 6 ;
            }
        }
    });

    return Ctor;
});