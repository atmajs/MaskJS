import * as dts from 'dts-bundle';
import { File, Directory, env } from 'atma-io';
import { class_Uri } from 'atma-utils';

async function process () {

    await (async function () {
        // copy src content to the root
        let files = await Directory.readFilesAsync(`./ts-temp/src/`, `**.d.ts`);

        for (let f of files) {
            f.copyTo('ts-temp/', { baseSource: './ts-temp/src/', silent: true });
            f.remove();
        }
    }());

    let files = await Directory.readFilesAsync(`./ts-temp/`, `**.d.ts`);
    
    for (let file of files) {
        await Preprocess.run(file);
    }

    dts.bundle({
        name: 'mask',
        main: './ts-temp/mask.d.ts',
        out: './out/index.d.ts'
    });
    
    File.copyTo('./ts-temp/out/index.d.ts', './lib/mask.d.ts');
    File.copyTo('./ts-temp/out/index.d.ts', './types/mask.d.ts');
}

namespace Preprocess {
    function normalizeGlobalImports (source: string) {
        let importGlobal = /^[ \t]*import ['"][^'"]+['"];?[ \t]*$/gm;
        let str = source.replace(importGlobal, '');
        return {
            source: str,
            modified: source !== str
        };
    }
    function normalizeInterfaceImports (source: string) {
        let importsRgx = /import\("([^"]+)"\)\.([a-zA-Z_$\d]+)/g;
        let handled = {};
        let out = source;
        // extract
        do {
            let match = importsRgx.exec(source);
            if (match == null) {
                break;
            }
            let [_, path, name ] = match;

            let key = `${path}:${name}`;
            if (key in handled) {
                continue;
            }

            out = `import { ${name} } from '${path}'; \n ${out}`;
            handled[key] = 1;
        } while (true);


        if (out === source) {
            return { source: out, modified: false }
        }
        
        // remove
        out = out.replace(importsRgx, '$2');
        return { source: out, modified: true }
    }


    let projects = {
        "core": "",
        "utils": "ref-utils/src/",
        "mask-j": "projects/mask-j/src/jmask/",
        "compo": "projects/mask-compo/src/",
        "binding": "projects/mask-binding/src/",
        "project": "projects/"
    };
    let root = env.currentDir.combine("ts-temp/");

    function normalizeProjectImports (source: string, uri: class_Uri) {
        let rgx = /from\s+['"]@([\w\-]+)([^'"]+)['"]/g;
        let modified = true;

        if (uri.toLocalFile().includes('mask.d.ts')) {
            debugger;
        }

        while (true) {
            let match = rgx.exec(source);
            if (match == null) {
                break;
            }
            
            let project = projects[match[1]];
            let path = match[2];
            let f = root.combine(project).combine(path.replace(/^\//, ''));

            let relPath = f.toRelativeString(uri);
            
            if (relPath.includes('file:')) {
                console.error(`Invalid relative URI`, f.toLocalFile(), uri.toLocalFile());
            }
            if (relPath[0] !== '.' && relPath[0] !== '/') {
                relPath = './' + relPath;
            }
            
            source = source.substring(0, match.index) + `from "${relPath}"` + source.substring(match.index + match[0].length);
            modified = true;
            rgx.lastIndex = match.index + 1;
        }
        return  {
            modified,
            source
        };
    }

    function normalizeComments (source, path) {
        let rgx = /\/\*\*(.|\n|\r)+?\*\//g;
        let changed = source.replace(rgx, '');

        changed = changed.replace('export {};', '');

        changed = changed.replace(/(\.\.\/)+ref\-utils\/src/g, '@utils');
        changed = changed.replace(/(\.\.\/)+projects/g, '@project');

        let modified = changed !== source;
        return {
            source: changed,
            modified
        };
    }

    export async function run (file: InstanceType<typeof File>) {
        let source = await file.readAsync<string>({ skipHooks: true, encoding: 'utf8' });

        let result = { source, modified: false };
        let modified = false;

        result = normalizeComments(result.source, file.uri.toLocalFile());
        modified = result.modified || modified;

        result = normalizeGlobalImports(result.source);
        modified = result.modified || modified;

        
        result = normalizeInterfaceImports(result.source);
        modified = result.modified || modified;

        result = normalizeProjectImports(result.source, file.uri);
        modified = result.modified || modified;
        

        if (modified === false) {
            // no imports
            return;
        }
        await file.writeAsync(result.source, { skipHooks: true });
    }
}

export { process }