UTest({
	'sync': {
		'should walk through the nodes' () {
			RunSync(
				` div { em; i }; span; h4; `
				, 'div,em,i,span,h4'
			);
		},
		'modifiers': {
			'should skip children' () {
				RunSync(
					` div { section { em; i }}; span; h4; `
					, 'div,section,span,h4'
					, (node) => {
						if (node.tagName === 'section') 
							return { deep: false };
					}
				);
			},
			'should replace node' () {
				var dom = RunSync(
					` div; section { em; i }; span; h4; `
					, 'div,section,span,h4'
					, (node) => {
						if (node.tagName === 'section') 
							return { replace: mask.parse('menu') };
					}
				);
				
				eq_(dom.nodes[1].tagName, 'menu');
			}
		}
	},
	'async': {
		'should walk through the nodes' (done) {
			RunAsync(
				` div { em; i }; span; h4; `
				, 'div,em,i,span,h4'
				, null
				, done
			);
		},
		'modifiers': {
			'should skip children' (done) {
				RunAsync(
					` div { section { em; i }}; span; h4; `
					, 'div,section,span,h4'
					, (node, next) => {
						if (node.tagName === 'section') 
							return next({ deep: false });
						next();
					}
					, done
				);
			},
			'should replace node' (done) {
				RunAsync(
					` div; section { em; i }; span; h4; `
					, 'div,section,span,h4'
					, (node, next) => {
						if (node.tagName === 'section') 
							return next({ replace: mask.parse('menu') });
						next();
					}
					, (dom) => {
						eq_(dom.nodes[1].tagName, 'menu');
						done();
					}
				);
				
			}
		}
	},
	'should map tree': {
		'should map nodes tree' () {
			var ast = mask.TreeWalker.map(mask.parse('div > span'), node => {
				return { tagName: node.tagName.toUpperCase() };
			});
			deepEq_(ast, {
				tagName: 'DIV',
				nodes: [
					{ tagName: 'SPAN' }
				]
			});
		},
		'should map components tree' () {
			mask.registerHandler('Foo', mask.Compo({
				serialize () {
					return 'iFoo'
				},
			}));
			mask.define('Bar', mask.Compo({
				serialize () {
					return 'iBar'
				}
			}));
			var root = mask.Compo.initialize('Foo > Bar');
			var foo = Compo.find(root, 'Foo');
			var tree = mask.TreeWalker.map(foo, compo => {
				return { text: compo.serialize() };
			});
			deepEq_(tree, {
				text: 'iFoo',
				components: [
					{ text: 'iBar' }
				]
			});
		}
	},
	'should superpose trees': {
		'should copy id attributes from one tree to another' () {
			var treeA = mask.parse('div > span');
			var treeB = mask.parse('div #foo > span #bar');
			var tree = mask.TreeWalker.superpose(treeA, treeB, (nodeA, nodeB) => {
				nodeA.attr.id = nodeB.attr.id.toUpperCase();
			});

			var str = mask.stringify(tree);
			eq_(str, '#FOO>span#BAR;');
		},
		'should serialize and restore the components properties' () {
			mask.registerHandler('Foo', mask.Compo({
				constructor () {
					this.random = (Math.random() * 1000000) | 0;
				},
			}));
			var root = mask.Compo.initialize('Foo > Foo');
			var foo = Compo.find(root, 'Foo');
			var tree = mask.TreeWalker.map(foo, compo => {
				return { compoName: compo.compoName, random: compo.random };
			});
			has_(tree, {
				compoName: 'Foo',
				random: null,
				components: [
					{ 
						compoName: 'Foo',
						random: null 
					}
				]
			});

			var root = mask.Compo.initialize('Foo > Foo');
			var otherFoo = Compo.find(root, 'Foo');
			notEq_(otherFoo.random, foo.random);

			mask.TreeWalker.superpose(otherFoo, foo, (nodeA, nodeB) => {
				nodeA.random = nodeB.random;
			});
			var otherTree = mask.TreeWalker.map(otherFoo, compo => {
				return { compoName: compo.compoName, random: compo.random };
			});
			deepEq_(tree, otherTree);
		}
	}
});

function RunSync(...args) {
	return Run(mask.TreeWalker.walk, args);
}
function RunAsync(...args) {
	return Run(mask.TreeWalker.walkAsync, args);
}
function Run(walk, args) {
	var [ template, expectNodes, fn, done ] = args;
	
	var dom    = mask.parse(template);
	var expect = expectNodes.split(',');
	var root   = walk(dom, function(node, next){
		eq_(node.tagName, expect.shift());
		
		if (fn) 
			return fn.apply(null, arguments);
		
		if (next) next();
	}, done);
	
	eq_(expect.length, 0);
	return root;
}

// vim: set ft=js: