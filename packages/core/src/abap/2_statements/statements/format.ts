import {IStatement} from "./_statement";
import {verNot, pers, alt, seq, opts, altPrio} from "../combi";
import {Source, Color} from "../expressions";
import {Version} from "../../../version";
import {IStatementRunnable} from "../statement_runnable";

export class Format implements IStatement {

  public getMatcher(): IStatementRunnable {
    const eq = seq("=", Source);
    const value = alt(eq, altPrio("ON", "OFF", Source));

    const options = pers("RESET",
                         seq("INTENSIFIED", opts(value)),
                         seq("INVERSE", opts(value)),
                         seq("HOTSPOT", opts(value)),
                         seq("FRAMES", value),
                         seq("INPUT", value),
                         Color);

    const ret = seq("FORMAT", options);

    return verNot(Version.Cloud, ret);
  }

}