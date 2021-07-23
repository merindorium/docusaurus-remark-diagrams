import { Plugin, Transformer } from 'unified';
import { Node } from 'unist';
import visit = require("unist-util-visit");

interface MDASTCode extends Node {
    lang?: string;
    meta: null | string;
    value: string;
}

const attacher: Plugin = (options) => {

    const transformer: Transformer = async (tree, _file) => {

        visit.visit<MDASTCode>(tree, 'code', code);

        return tree;
    };

    return transformer;
};

function code(node: MDASTCode) {
    console.log(node);
}

export = attacher;