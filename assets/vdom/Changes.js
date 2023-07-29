import { render } from "./Render.js";

function changes($parentNode, vOldNode, vNewNode) {

    if (($parentNode === undefined || $parentNode === null) ||
        !($parentNode instanceof Node) ||
        (vOldNode === undefined && vNewNode === undefined) ||
        (vOldNode === null && vNewNode === null) ||
        compararNodos(vOldNode, vNewNode)) {
        return;
    }

    if (vNewNode === undefined || vNewNode === null) {

        $parentNode.remove();

    } else if (vOldNode === undefined || vOldNode === null) {

        const $ref = render(vNewNode);

        if (Array.isArray($ref)) {
            for (let i = 0; i < $ref.length; i++) {
                $parentNode.appendChild($ref[i]);
                reff(vNewNode[i], $ref[i]);
            }
        } else {
            $parentNode.appendChild($ref);
            reff(vNewNode, $ref);
        }


    } else if ((typeof vOldNode === 'string' || typeof vNewNode === 'string') &&
        (vOldNode !== vNewNode) || vOldNode.type !== vNewNode.type) {

        const $ref = render(vNewNode);
        $parentNode.replaceWith($ref);
        reff(vNewNode, $ref);

    } else {

        setAttributes($parentNode, vOldNode, vNewNode);

        let on = vOldNode.children?.length ?? 0;
        let nn = vNewNode.children?.length ?? 0;
        let max = Math.max(on, nn);
        let $n = null;
        let chOld, chNew;

        for (let i = 0; i < max; i++) {

            chNew = vNewNode.children[i];
            chOld = vOldNode.children[i];

            $n = $parentNode.childNodes[i] ?? $parentNode;

            let cond1 = (chNew !== undefined && chOld !== undefined);
            let cond2 = chNew?.key !== null && chOld?.key !== null;
            let cond3 = chNew?.key !== chOld?.key;

            if (!cond1) {
                cond1 = (chNew === undefined && chOld !== undefined) || (chNew !== undefined && chOld === undefined)
            }

            if (cond1 && cond2) {

                if (cond3) {

                    if (nn > on) {
                        const index = i + 1 === nn ? i + 1 : i;

                        const $ref = render(chNew);

                        $parentNode.insertBefore($ref, $parentNode.children[index]);

                        reff(chNew, $ref);

                        vOldNode.children.splice(i, 0, chNew);

                        on = vOldNode.children?.length ?? 0;
                        nn = vNewNode.children?.length ?? 0;
                        max = Math.max(on, nn);

                    } else if (nn < on) {
                        $n.remove();

                        vOldNode.children.splice(i, 1);

                        on = vOldNode.children?.length ?? 0;
                        nn = vNewNode.children?.length ?? 0;
                        max = Math.max(on, nn);
                        i--;
                    } else {
                        equalKeys($n, chNew);
                        vOldNode.children.splice(i, 1);
                        vOldNode.children.splice(i, 0, chNew);
                    }
                } else if (!compararNodos(chOld, chNew)) {
                    equalKeys($n, chNew);
                    vOldNode.children.splice(i, 1);
                    vOldNode.children.splice(i, 0, chNew);
                }

            } else {
                changes($n, chOld, chNew);
            }

        }
    }

}

function reff(vNewNode, $ref) {

    if (vNewNode === undefined || vNewNode === null) {
        return;
    }

    if (vNewNode.construido !== undefined &&
        typeof vNewNode.construido === "function") {

        vNewNode.construido($ref);

    }

}

function equalKeys($n, vNewNode) {
    if (vNewNode === undefined || vNewNode === null) {
        return;
    }
    const $ref = render(vNewNode);
    $n.replaceWith($ref);
    reff(vNewNode, $ref);
}

/**
 * 
 * @param {HTMLElement} $node 
 * @param {Object} vOldNode 
 * @param {Object} vNewNode 
 * @returns 
 */
function setAttributes($node, vOldNode, vNewNode) {


    if (!vOldNode || !vNewNode) {
        return;
    }

    for (let att in vOldNode.props) {
        if ((!vNewNode.props) || !(att in vNewNode.props)) {

            $node.removeAttribute(att);

            if (att === "value" && $node.tagName === "INPUT" || $node.tagName === "SELECT") {
                $node.value = "";
            }

        }
    }

    for (let prop in vNewNode.props) {
        if (!vOldNode?.props || !(prop in vOldNode?.props) ||
            vNewNode.props[prop] !== vOldNode.props[prop]) {

            if (prop !== "$ref") {
                $node[prop] = vNewNode.props[prop];
            } else {
                vNewNode.$element = $node;
            }

            if ($node.type === 'checkbox') {
                $node.checked = vNewNode.props[prop];
            }

        }
    }

    if (vNewNode.props && vNewNode.props["$ref"]) {
        vNewNode.$element = $node;
    }

}

function compararNodos(vOldNode, vNewNode) {

    if (vOldNode === undefined || vNewNode === undefined) {
        return false;
    }

    if (vOldNode.type !== vNewNode.type) {
        return false;
    }

    if ((typeof vOldNode === 'string' || typeof vNewNode === 'string') && (vNewNode !== vOldNode)) {
        return false;
    } else if ((typeof vOldNode === 'string' || typeof vNewNode === 'string') && (vNewNode === vOldNode)) {
        return true;
    }

    const oldProps = vOldNode.props ?? {};
    const newProps = vNewNode.props ?? {};

    if (Object.keys(oldProps).length !== Object.keys(newProps).length) {
        return false;
    }

    if (Object.keys(vNewNode?.props ?? {}).length > 0) {
        for (const prop in newProps) {

            if (prop.startsWith("on") && newProps[prop]?.toString() !== oldProps[prop]?.toString()) {
                return false;
            } else if (prop.startsWith("on")) {
                continue;
            }

            if (newProps[prop] !== oldProps[prop]) {
                return false;
            }
        }
    }

    const oldChildren = vOldNode.children ?? [];
    const newChildren = vNewNode.children ?? [];

    if (oldChildren.length !== newChildren.length) {
        return false;
    }

    for (let i = 0; i < Math.max(oldChildren.length, newChildren.length); i++) {
        if (!compararNodos(oldChildren[i], newChildren[i])) {
            return false;
        }
    }

    return true;
}

export default changes;