var config = module.exports;



config["mask.dom"] = {
    env: "browser",
    rootPath: "../",
    sources: [
        "lib/mask.js"
    ],
    tests: [
        "test/*-dom.js"
    ]
};


config["mask.html"] = {
    env: "browser",
    rootPath: "../",
    sources: [
        "lib/mask.node.js"
    ],
    tests: [
        "test/*-html.js"
    ]
};

config["mask.lib"] = {
    env: "node",
    rootPath: "../",
    sources: [
        "lib/mask.node.js"
    ],
    tests: [
        "test/*-node.js"
    ]
};
