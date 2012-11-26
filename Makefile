compile:
	cat  \
	./src/1.scope-vars.js  \
	./src/2.Helper.js  \
	./src/3.Template.js  \
	./src/4.CustomTags.js  \
	./src/5.ValueUtilities.js  \
	./src/6.Parser.js  \
	./src/7.Builder.js  \
	./src/8.export.js  \
	>  \
	./lib/mask.test.js

	cat  \
	./src/wrap-open.js.txt  \
	./src/1.scope-vars.js  \
	./src/2.Helper.js  \
	./src/3.Template.js  \
	./src/4.CustomTags.js  \
	./src/5.ValueUtilities.js  \
	./src/6.Parser.js  \
	./src/7.Builder.js  \
	./src/8.export.js  \
	./src/wrap-close.js.txt  \
	>  \
	./lib/mask.js