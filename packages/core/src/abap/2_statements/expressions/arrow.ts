import {altPrios, tok, Expression} from "../combi";
import {InstanceArrow, StaticArrow} from "../../1_lexer/tokens";
import {IStatementRunnable} from "../statement_runnable";

export class Arrow extends Expression {
  public getRunnable(): IStatementRunnable {
    return altPrios(tok(InstanceArrow), tok(StaticArrow));
  }
}