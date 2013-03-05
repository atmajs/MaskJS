window.DEBUG = true;

include.routes({
     "lib": "/.reference/libjs/{0}/lib/{1}.js",
     "ruqq": "/.reference/libjs/ruqq/lib/{0}.js",
     "compo": "/.reference/libjs/compos/{0}/lib/{1}.js"
});

if (DEBUG){ //&& window.location.hash.indexOf('!watch') > -1
	include.plugin({
			lib: 'include/include.autoreload'
		});
}

if (window.location.href.indexOf('file') != -1){

	include.cfg({
		loader: {
			'coffee': {
				lib: 'include/loader/coffee/loader'
			},
			'less': {
				lib: 'include/loader/less/loader'	
			}
		}
	});
	
}

include = include.instance();