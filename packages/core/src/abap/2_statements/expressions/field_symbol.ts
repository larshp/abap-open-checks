import {regex as reg, Expression, altPrios, tok, seqs} from "../combi";
import {Dash} from "../../1_lexer/tokens";
import {IStatementRunnable} from "../statement_runnable";

export class FieldSymbol extends Expression {
  public getRunnable(): IStatementRunnable {
// todo, this only allows one dash in the name
    const dashes = seqs(reg(/^<[\w\/%$\*]+$/), tok(Dash), reg(/^[\w\/%$\*]+>$/));

    return altPrios(reg(/^<[\w\/%$\*]+>$/), dashes);
  }
}