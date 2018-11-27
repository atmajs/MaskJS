let files = io.Directory.readFiles('./src/', '**.js').files;

files.forEach(file => {
    let path = file.uri.toLocalFile();
    let content = file.read({ skipHooks: true });

 
    var header = /var ([\w\d_$,\s]+);\s*\(function\s*\(\)\s*{/;
    if (header.test(content)) {
        content = content.replace(header, () => '');
        content = content.replace(/}\(\)\)[;\s]*$/, () => '');        
        content = content.replace(/^[\t ]*([\w_\$]+) = function/gm, (full, name) => {
            return `export function ${name} `
        });
    }
    
    path = path.replace('.js', () => '.ts');
    io.File.write(path, content, { skipHooks: true });    
});
