var dts = require('dts-bundle');

dts.bundle({
	name: 'mask',
	main: './ts-temp/src/mask.d.ts',
	out: './out/index.d.ts'
});

io.File.copyTo('./ts-temp/src/out/index.d.ts', './lib/mask.d.ts');