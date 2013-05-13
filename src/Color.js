define(['./lib/COGS/cogs', './color/const', './color/RGB', './color/RGBA'], 
function(cogs, cnst, RGB, RGBA){

    function parseFromImageData(imgData){
        var data = imgData.data;
        var rgbs = [];
        var rgb;
        
        // convert to rgb aray
        for(var i = 0; i < data.length; i++){

            var mod = i % 4;

            switch(mod){
                case 0:
                    rgb = new RGB();
                    rgb.red = data[i]
                    break;
                case 1:
                    rgb.green = data[i]
                    break;
                case 2:
                    rgb.blue = data[i]
                    break;
                case 3:
                default:
                    //reserved byte
                    rgbs.push(rgb);
                    break;
            }

        }

        return rgbs;
    }

    function parseNumber(num, hasAlpha){
        var ret;

        var byte0 = num & 255;
        var byte1 = (num & 255 << 8) >> 8;
        var byte2 = (num & 255 << 16) >> 16;
        var byte3 = (num & 255 << 24) >> 24;

        if (hasAlpha || num > (RGB.WHITE * 1)){
            ret = new RGBA();

            ret.alpha = byte0;
            ret.blue = byte1;
            ret.green = byte2;
            ret.red = byte3;
        }
        else{
            ret = new RGB();

            ret.blue = byte0;
            ret.green = byte1;
            ret.red = byte2;
        }
        
        //console.log(num, byte0, byte1, byte2, byte3, ret * 1, ret.toString())        

        return ret;
    }

    var Ctor = cogs.ctor(function(){

    });

    for(var key in cnst){
        if (!cnst.hasOwnProperty(key)){
            continue;
        }

        Ctor[key] = cnst[key];
    }

    Ctor.parse = function(obj, hasAlpha){
        if (
            (Object(obj) === obj) && 
            'width' in obj && 'height' in obj && 
            obj.data instanceof Uint8Array
        ){
            return parseFromImageData(obj)
        }
        else {
            var num = obj * 1;

            return parseNumber(num, hasAlpha);
        }

        throw "Not supported object";
    };

    return Ctor;
});