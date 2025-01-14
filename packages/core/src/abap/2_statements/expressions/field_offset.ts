import {seq, tok, altPrio, regex as reg, Expression, optPrio} from "../combi";
import {Plus} from "../../1_lexer/tokens";
import {SimpleFieldChain2} from ".";
import {IStatementRunnable} from "../statement_runnable";

export class FieldOffset extends Expression {
  public getRunnable(): IStatementRunnable {
    const offset = seq(tok(Plus),
                       optPrio(altPrio(reg(/^\d+$/), SimpleFieldChain2)));

    return offset;
  }
}