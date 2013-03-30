(function(){

	if (typeof String.prototype.trim === 'undefined'){

		String.prototype.trim = function(){
			var start = -1,
				end = this.length,
				code;
			if (end === 0) {
				return this;
			}

			while(++start < end){
				code = this.charCodeAt(start);
				if (code > 32){
					break;
				}
			}

			while(--end !== 0){
				code = this.charCodeAt(end);
				if (code > 32){
					break;
				}
			}

			return start !== 0 && end !== length - 1 ? this.substring(start, end + 1) : this;
		}

	}

}());
