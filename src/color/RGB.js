define(['../lib/COGS/cogs', './Base', './const', './HSV'], function(cogs, BaseColor, constants, HSV) {

    function fitToRange(value){
        value = ~~value;

        if (value > constants.MAX){
            return constants.MAX;
        }
        else if (value < constants.MIN){
            return constants.MIN;
        }

        return value;
    }

    function getZeroCompliment(length){
        var ret = '';

        for(var l = length;l--;){
            ret+='0'
        }

        return ret;
    }
    
    var Ctor = cogs.ctor(function(r, g, b){

        this._r = 0;
        this._g = 0;
        this._b = 0;

        if (arguments.length == 1 && 'red' in r && 'green' in r && 'blue' in r){
            // consider r as rgb object
            this.red = r.red;
            this.green = r.green
            this.blue = r.blue;

            if ('alpha' in r){
                this.alpha = r.alpha;
            }
        }
        else{
            this.red = r;
            this.green = g;
            this.blue = b;
        }

    }, BaseColor);

    Ctor.rand = function(){
        var r = ~~(Math.random() * 255);
        var g = ~~(Math.random() * 255);
        var b = ~~(Math.random() * 255);

        return new Ctor(r, g, b)
    };

    cogs.mixin(Ctor, {
        get red(){
            return this._r;
        },
        set red(value){
            this._r = fitToRange(value);
        },
        get green(){
            return this._g;
        },
        set green(value){
            this._g = fitToRange(value);
        },
        get blue(){
            return this._b;
        },
        set blue(value){
            this._b = fitToRange(value);
        },
        _fitToRange: fitToRange,
        _getZeroCompliment: getZeroCompliment,
        valueOf: function(){
            var me = this;
            var ret = me._b;

            ret |= (me._g << 8);
            ret |= (me._r << 16);

            return ret;
        },
        toString: function(){
            var me = this;
            var type = arguments[0];
            var hash = (me.valueOf() & 0x00FFFFFF).toString(16);
            hash = getZeroCompliment(6 - hash.length) + hash;

            if (!type){
                type = 'css2';
            }

            type = type.toLowerCase();

            switch(type){
                case 'rgb':
                case 'css3':
                    return 'rgb(' + ~~me._r + ',' + ~~me._g + ',' + ~~me._b + ')';
                case 'css2':
                    return '#' + hash;
                case 'hex': 
                    return hash;
                default: 
                    return me.valueOf().toString(16);
            }
        },
        add: function(rgb){

            if (rgb instanceof Ctor){
                return new Ctor(this.red + rgb.red, this.green + rgb.green, this.blue + rgb.blue);
            }
            else{
                var scale = ~~rgb;
                return new Ctor(this.red + scale, this.green + scale, this.blue + scale);
            }
            
        },
        subtract: function(rgb){

            if (rgb instanceof Ctor){
                return new Ctor(this.red - rgb.red, this.green - rgb.green, this.blue - rgb.blue);
            }
            else{
                var scale = ~~rgb;
                return new Ctor(this.red - scale, this.green - scale, this.blue - scale);
            }

        },
        multiply: function(rgb){
            if ((rgb instanceof Ctor)){
                return new Ctor(this.red * rgb.red / 255, this.green * rgb.green / 255, this.blue * rgb.blue / 255);
            }
            else{
                var scale = ~~rgb;
                return new Ctor(this.red * scale, this.green * scale, this.blue * scale);
            }
        },
        divide: function(rgb){

            if ((rgb instanceof Ctor)){
                return new Ctor(this.red / rgb.red * 255, this.green / rgb.green * 255, this.blue / rgb.blue * 255);
            }
            else{
                var scale = ~~rgb;
                return new Ctor(this.red / scale, this.green / scale, this.blue / scale);
            }
            
        },
        from: function(obj){
            if ('lightness' in obj){
                var r, g, b;
                var s = obj.saturation;
                var l = obj.lightness;
                var h = obj.hue;

                if(s == 0){
                    r = g = b = l; // achromatic
                }else{
                    function hue2rgb(p, q, t){
                        if(t < 0) t += 1;
                        if(t > 1) t -= 1;
                        if(t < 1/6) return p + (q - p) * 6 * t;
                        if(t < 1/2) return q;
                        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                        return p;
                    }

                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    var p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1/3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1/3);
                }

                this.red = r * 255;
                this.green = g * 255;
                this.blue = b * 255;
                return;
                var hsv = new HSV();
                hsv.from(obj);
                this.from( hsv );
            }
            else if ('value' in obj){
                var value = obj.value;
                var r, g, b;
                // gray
                if (obj.saturation === 0){
                    r = value;
                    g = value;
                    b = value;
                }
                else{
                    var h = ~~(obj.hue * 360 / 60);
                    var i = Math.floor( h );
                    var f = h - i;
                    var p = value * ( 1 - obj.saturation );
                    var q = value * ( 1 - obj.saturation * f);
                    var t = value * ( 1 - obj.saturation * ( 1 - f ));

                    switch( i ){
                        case 0:
                            r = value;
                            g = t;
                            b = p;
                            break;
                        case 1:
                            r = q;
                            g = value;
                            b = p;
                            break;
                        case 2:
                            r = p;
                            g = value;
                            b = t;
                            break;
                        case 3:
                            r = p;
                            g = q;
                            b = value;
                            break;
                        case 4:
                            r = t;
                            g = p;
                            b = value;
                            break;
                        default:
                            r = value;
                            g = p;
                            b = q;
                            break
                    }
                }

                this.red = r * 255;
                this.green = g * 255;
                this.blue = b * 255;

            }
        }
    });

    Ctor.WHITE = new Ctor(255, 255, 255);

    return Ctor;
});