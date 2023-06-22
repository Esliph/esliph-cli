import { Result } from "@esliph/util";
import fs from "node:fs";

export interface LiphModel {}

export function getLiphConfig() {
  const filePath = "../../package.json";

  fs.readFile(filePath, "utf8", (err, data) => {
    // if (err) {
    //   return Result.failure<LiphModel>(
    //     {
    //       title: "Liph Config",
    //       message: [
    //         { message: "Cannot read liph config", origin: "liph-config" },
    //       ],
    //     },
    //     400
    //   );
    // }

    console.log(data);

    const config: LiphModel = JSON.parse(data);

    console.log(config);

    // return Result.success<LiphModel>(config);
  });
}
