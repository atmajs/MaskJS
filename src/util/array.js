var arr_pushMany;

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
}());