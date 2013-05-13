define(['../lib/COGS/cogs', './RGB', './const'], function(cogs, RGB, constants) {
    
    var Ctor = cogs.ctor(function(r, g, b, a){

        this._a = 1;
        
        if (arguments.length > 1 || Object(r) !== r){
            this.alpha = a;
        }

    }, RGB);

    Ctor.rand = function(randomAlpha){

        if (arguments.length <= 0){
            randomAlpha = true;
        }

        var r = ~~(Math.random() * 255);
        var g = ~~(Math.random() * 255);
        var b = ~~(Math.random() * 255);
        var a = randomAlpha?~~(Math.random() * 255) : 255;

        return new Ctor(r, g, b, a);
    };

    cogs.mixin(Ctor, {
        get alpha(){
            return this._a;
        },
        set alpha(value){
            this._a = this._fitToRange(value);
        },
        valueOf: function(){
            var me = this;
            var ret = RGB.prototype.valueOf.call(me);

            ret |= (me._a << 24);

            return ret;
        },
        normalize: function(){

            this.red = this.red * this.alpha / 255;
            this.green = this.green * this.alpha / 255;
            this.blue = this.blue * this.alpha / 255;

            this.alpha = 0;
        },
        alphaInverse: function () {
            this.alpha = constants.MAX - this.alpha;
        },
        toString: function(type){
            var me = this;
            var hash = (me.valueOf() & 0xFFFFFFFF).toString(16);
            hash = getZeroCompliment(8 - hash.length) + hash;

            if (!type){
                type = 'css3';
            }

            type = type.toLowerCase();

            switch(type){
                case 'rgba':
                case 'css3':
                    return 'rgba(' + 
                        ~~me._r + ',' + 
                        ~~me._g + ',' + 
                        ~~me._b + ',' + 
                        (me._a / 255).toFixed(3) + ')';
                case 'css2':
                    return RGB.prototype.toString.call(this, type);
                case 'hex': 
                default: 
                    return hash;
            }
        }
    });

    Ctor.WHITE = new Ctor(255, 255, 255, 255);
    Ctor.BLACK = new Ctor(0, 0, 0, 255);
    Ctor.RED = new Ctor(255, 0 , 0, 255);
    Ctor.GREEN = new Ctor(0, 255 , 0, 255);
    Ctor.BLUE = new Ctor(0, 0 , 255, 255);
    Ctor.YELLOW = new Ctor(255, 255, 0, 255);

    return Ctor;
});