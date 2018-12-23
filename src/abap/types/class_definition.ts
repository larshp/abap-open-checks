import {StructureNode} from "../../abap/nodes";
import {MethodDefinitions} from "./method_definitions";
import {SuperClassName} from "../../abap/expressions";
import * as Statements from "../../abap/statements";
import * as Structures from "../../abap/structures";
import * as Expressions from "../../abap/expressions";
import {ClassAttributes} from "./class_attributes";
import {Token} from "../tokens/_token";

// todo, is this the same as an InterfaceDefinition?
export class ClassDefinition {
  private node: StructureNode;

  constructor(node: StructureNode) {
    if (!(node.get() instanceof Structures.ClassDefinition)) {
      throw new Error("ClassDefinition, unexpected node type");
    }
    this.node = node;
  }

  public getMethodDefinitions(): MethodDefinitions | undefined {
    if (!this.node) { return undefined; }
    return new MethodDefinitions(this.node);
  }

  public getSuperClass(): string | undefined {
    if (!this.node) { return undefined; }
    const found = this.node.findFirstStatement(Statements.ClassDefinition);
    const token = found ? found.findFirstExpression(SuperClassName) : undefined;
    return token ? token.getFirstToken().getStr() : undefined;
  }

  public getAttributes(): ClassAttributes | undefined {
    if (!this.node) { return undefined; }
    return new ClassAttributes(this.node);
  }

  public getName(): Token {
    return this.node.findFirstStatement(Statements.ClassDefinition)!.findFirstExpression(Expressions.ClassName)!.getFirstToken();
  }

  public getFirstToken(): Token {
    return this.node.getFirstToken();
  }

  public getLastToken(): Token {
    return this.node.getLastToken();
  }

  public isException(): boolean {
    const superClass = this.getSuperClass();
    // todo, this logic is not correct
    if (superClass && superClass.match(/^.?cx_.*$/i)) {
      return true;
    } else {
      return false;
    }
  }

  /*
  public getFriends()

  public isAbstract(): boolean {
// todo
    return false;
  }

  public isFinal(): boolean {
// todo
    return false;
  }

  public isForTesting(): boolean {
// todo
    return false;
  }

  public isLocal(): boolean {
// todo
    return false;
  }

  public isGlobal(): boolean {
// todo
    return false;
  }

  public getEvents() {

  public getImplementing() {

*/

}