import { Plugin, Transformer } from 'unified';
import { Node, Parent, Data } from 'unist';
import visit = require("unist-util-visit");
import { spawnSync } from 'child_process';
import { Image, HTML } from 'mdast';

interface MDASTCode extends Node {
    lang?: string;
    meta: null | string;
    value: string;
}

enum GNUPlotTerminal {
    PNG = "png",
    GIF = "gif",
    SVG = "svg"
}

const attacher: Plugin = (options) => {

    const transformer: Transformer = async (tree, _file) => {

        visit<MDASTCode>(tree, 'code', parseCodeBlock);

        return tree;
    };

    return transformer;
};

const parseCodeBlock: visit.Visitor<MDASTCode> = (node: MDASTCode, index: number, parent) => {
    console.log("ASDSd");
    switch (node.lang) {
        case "gnuplot":
            let commands = node.value.split("\n").join("; ")
            let buffer = spawnSync('gnuplot', ['-e', `${commands}`]);

            let terminal = <GNUPlotTerminal>node.meta

            console.log(buffer.stderr.toString())

            let dataType: string

            switch (terminal) {
                case GNUPlotTerminal.PNG, GNUPlotTerminal.GIF:
                    dataType = terminal
                    break
                case GNUPlotTerminal.SVG:
                    dataType = "svg+xml"
                    break
                default:
                    dataType = "unknown"
                    break
            }

            let img: Image = {
                type: "image",
                url: `data:image/${dataType};base64,${Buffer.from(buffer.stdout).toString("base64")}`
            };

            parent?.children.splice(index, 1, img)
            break
        default:
            break
    }
}

export = attacher;
