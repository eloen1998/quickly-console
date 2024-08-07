// 这里使用import语法会导致在使用traverse时出现问题：在执行测试用例时需要使用traverse.default，而在运行插件时需要使用traverse。
// import traverse from "@babel/traverse";
const traverse = require("@babel/traverse");
import { parse } from "../parse";
import {
    IfStatement,
    ObjectMethod,
    ForInStatement,
    ForOfStatement,
    SwitchStatement,
    UpdateExpression,
    ImportDeclaration,
    FunctionDeclaration,
    VariableDeclaration,
    ExpressionStatement,
    AssignmentExpression,
    ArrowFunctionExpression,
    ClassMethod
} from "@babel/types";
import {
    isContain,
    getLValVariables,
    getParamsVariables,
    getExpressionVariables,
    getVariableDeclarationVariables
} from "./handleNode";
import type { NodePath } from "@babel/traverse";

export function getVariableJs(code: string, offset: number): ConsoleVariable {
    const consoleVariable: ConsoleVariable = {};
    const ast = parse(code);

    traverse.default(ast, {
        VariableDeclaration(path: NodePath<VariableDeclaration>) {
            const node = path.node;
            if (isContain(node, offset)) {
                delete consoleVariable.funcName;
                consoleVariable.variables =
                    getVariableDeclarationVariables(node);
            } else {
                path.skip();
            }
        },
        AssignmentExpression(path: NodePath<AssignmentExpression>) {
            const node = path.node;
            if (isContain(node, offset)) {
                delete consoleVariable.funcName;
                consoleVariable.variables = getLValVariables(node.left);
            } else {
                path.skip();
            }
        },
        UpdateExpression(path: NodePath<UpdateExpression>) {
            const node = path.node;
            if (isContain(node, offset)) {
                delete consoleVariable.funcName;
                consoleVariable.variables = getExpressionVariables(
                    node.argument
                );
            } else {
                path.skip();
            }
        },
        FunctionDeclaration(path: NodePath<FunctionDeclaration>) {
            const node = path.node;
            if (isContain(node, offset)) {
                consoleVariable.funcName = node.id?.name;
                consoleVariable.variables = getParamsVariables(node.params);
            } else {
                path.skip();
            }
        },
        ClassMethod(path: NodePath<ClassMethod>) {
            const node = path.node;
            if (isContain(node, offset)) {
                if (node.key.type === "Identifier") {
                    consoleVariable.funcName = node.key.name;
                }
                if (node.key.type === "StringLiteral") {
                    consoleVariable.funcName = node.key.value;
                }
                consoleVariable.variables = getParamsVariables(node.params);
            } else {
                path.skip();
            }
        },
        ExpressionStatement(path: NodePath<ExpressionStatement>) {
            const node = path.node;
            if (isContain(node, offset)) {
                delete consoleVariable.funcName;
                const expression = node.expression;
                consoleVariable.variables = getExpressionVariables(expression);
            } else {
                path.skip();
            }
        },
        ObjectMethod(path: NodePath<ObjectMethod>) {
            const node = path.node;
            if (isContain(node, offset)) {
                if (node.key.type === "Identifier") {
                    consoleVariable.funcName = node.key.name;
                }
                if (node.key.type === "StringLiteral") {
                    consoleVariable.funcName = node.key.value;
                }
                consoleVariable.variables = getParamsVariables(node.params);
            } else {
                path.skip();
            }
        },
        ArrowFunctionExpression(path: NodePath<ArrowFunctionExpression>) {
            const node = path.node;
            if (isContain(node, offset)) {
                delete consoleVariable.funcName;
                consoleVariable.variables = getParamsVariables(node.params);
            } else {
                path.skip();
            }
        },
        IfStatement(path: NodePath<IfStatement>) {
            const node = path.node;
            if (isContain(node, offset)) {
                delete consoleVariable.funcName;
                consoleVariable.variables = getExpressionVariables(node.test);
            } else {
                path.skip();
            }
        },
        ImportDeclaration(path: NodePath<ImportDeclaration>) {
            const node = path.node;
            if (isContain(node, offset)) {
                delete consoleVariable.funcName;
                consoleVariable.variables = node.specifiers.map(
                    (specifiers) => {
                        return specifiers.local.name;
                    }
                ) as string[];
            } else {
                path.skip();
            }
        },
        ForInStatement(path: NodePath<ForInStatement>) {
            const node = path.node;
            if (isContain(node, offset)) {
                consoleVariable.funcName = 'for in';
                if (node.left.type === "VariableDeclaration") {
                    consoleVariable.variables = getVariableDeclarationVariables(
                        node.left
                    );
                } else {
                    consoleVariable.variables = getLValVariables(node.left);
                }
            } else {
                path.skip();
            }
        },
        ForOfStatement(path: NodePath<ForOfStatement>) {
            const node = path.node;
            if (isContain(node, offset)) {
                consoleVariable.funcName = 'for of';
                if (node.left.type === "VariableDeclaration") {
                    consoleVariable.variables = getVariableDeclarationVariables(
                        node.left
                    );
                } else {
                    consoleVariable.variables = getLValVariables(node.left);
                }
            } else {
                path.skip();
            }
        },
        SwitchStatement(path: NodePath<SwitchStatement>) {
            const node = path.node;
            if (isContain(node, offset)) {
                consoleVariable.funcName = 'switch';
                consoleVariable.variables = getExpressionVariables(node.discriminant);
            } else {
                path.skip();
            }
        }
    });

    return consoleVariable;
}

export function getConsoleRangeJs(code: string, offset: number = 0) {
    const ast = parse(code);
    const rangeList: ConsoleRange[] = [];
    traverse.default(ast, {
        ExpressionStatement(path: NodePath<ExpressionStatement>) {
            const node = path.node;
            const { start, end, expression } = node;
            if (
                start &&
                end &&
                expression.type === "CallExpression" &&
                expression.callee.type === "MemberExpression"
            ) {
                const memberExpression = expression.callee;
                if (
                    memberExpression.object.type === "Identifier" &&
                    memberExpression.object.name === "console" &&
                    memberExpression.property.type === "Identifier"
                ) {
                    rangeList.push({
                        name: memberExpression.property.name,
                        range: [start + offset, end + offset]
                    });
                }
            }
        }
    });
    return rangeList;
}
