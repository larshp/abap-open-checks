import {IStatement} from "./_statement";
import {seq, alt, opt, pers, optPrios} from "../combi";
import {Type, Value, Length, Decimals, ConstantFieldLength, DefinitionName} from "../expressions";
import {IStatementRunnable} from "../statement_runnable";

export class Constant implements IStatement {

  public getMatcher(): IStatementRunnable {
    const def = seq(DefinitionName,
                    opt(ConstantFieldLength),
                    pers(Type, Value, Decimals, Length));

    const ret = seq(alt("CONSTANT", "CONSTANTS"), def, optPrios("%_PREDEFINED"));

    return ret;
  }

}