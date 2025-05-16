import { _document } from '@utils/refs'
import { custom_Statements, customTag_register } from '@core/custom/exports';
import { _renderPlaceholder, _compo_initAndBind } from '../utils';
import { builder_build } from '@core/builder/exports';
import { ALoopBoundStatement } from '../base/ALoopBoundStatement';
import type { StatementEach } from '@core/statements/each';
import type { INode } from '@core/dom/INode';



const Each = custom_Statements['each'] as typeof StatementEach;


class ObservableEach extends ALoopBoundStatement {
    compoName = '+each';

    // for expression
    public expression: string

    public attr: Record<string, any>
    public nodes: INode[]

    _beforeRender () {
    }
    _getExpression() {
        return this.expression;
    }
    _bootstrap() {
        this._beforeRender();
    }
    getHandler (name, model){
        return Each.getHandler(name, model);
    }
    _getModel (compo) {
        return compo.model;
    }
    build (array: any[], container: HTMLElement, children = this.children) {
        let fragment = _document.createDocumentFragment();

        let nodes = this.node.nodes;
        let imax = array?.length ?? 0;
        let ctx = {};
        for(let i = 0; i < imax; i++) {
            let model = array[i];
            let node = Each.createEachNode(nodes, model, this.expression, i);
            builder_build(node, model, ctx, fragment, this, children);
        }

        if (container != null) {
            this.append(fragment, container);
        }

        return fragment;
    }
};


// EXPORTS
customTag_register('+each', ObservableEach);
