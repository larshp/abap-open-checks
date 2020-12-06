import {altPrios, Expression} from "../combi";
import {TypeName} from ".";
import {IStatementRunnable} from "../statement_runnable";

export class TypeNameOrInfer extends Expression {
  public getRunnable(): IStatementRunnable {
    return altPrios("#", TypeName);
  }
}