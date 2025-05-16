var jQ = (function(){



    function jQ(mix) {
        if (this instanceof jQ === false)
            return new jQ(mix);


        if (mix == null)
            return this;

        if (mix instanceof jQ)
            return mix;


        return this.add(mix);
    }


    jQ.prototype = {
        length: 0,

        add: function(){

        }

    }

}());
