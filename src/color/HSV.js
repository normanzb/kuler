define(['../lib/COGS/cogs', './const', './HSL'], function(cogs, cnst, HSL){
    var Ctor = cogs.ctor(function(){
        this._h = null;
        this._s = 0;
        this._v = 0;
    });

    cogs.mixin(Ctor, {
        get hue(){
            return this._h;
        },
        set hue(value){
            this._h = value;
        },
        get value(){
            return this._v;
        },
        set value(val){
            this._v = Math.max(0, val);
        },
        get saturation(){
            return this._s;
        },
        set saturation(value){
            this._s = Math.min(1, Math.max(0, value));
        },
        from: function (obj){
            // duck typing to avoid circle ref
            if ('red' in obj && 'blue' in obj && 'green' in obj){
                
                var hsl = new HSL();

                hsl.from(obj);
                this.from(hsl);
            }
            else if ('lightness' in obj){
                // HSL
                this.hue = obj.hue;

                var l = 2 * obj.lightness;
                var s = obj.saturation * ( (l <= 1) ? l : 2 - 1 );

                this.value = ( l + s ) / 2 ;
                this.saturation = ( ( 2 * s ) / ( l + s ) ) || 0;
            }

            
        }
    });

    return Ctor;
});