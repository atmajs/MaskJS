var arr_pushMany,
	arr_remove;

(function(){
	
	arr_pushMany = function(arr, arrSource){
		if (arrSource == null || arr == null) 
			return;
		
		var il = arr.length,
			jl = arrSource.length,
			j = -1
			;
		while( ++j < jl ){
			arr[il + j] = arrSource[j];
		}
	};
	arr_remove = function(arr, item){
		if (arr == null) 
			return;
		var imax = arr.length,
			i = -1;
		while( ++i < imax ){
			if (arr[i] === item) {
				arr.splice(i, 1);
				return;
			}
		}
	};
}());