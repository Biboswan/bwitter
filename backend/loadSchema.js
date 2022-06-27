import axios from "axios";
import { DGRAPH_ADMIN_API_KEY, DGRAPH_ALPHA_URL } from "./config.js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const loadSchema = async () => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const path = join(__dirname, "schema", "schema.graphql");
  const schema = readFileSync(path, "utf-8");

  const headers = {};
  if (DGRAPH_ADMIN_API_KEY?.length) {
    headers["Dg-Auth"] = DGRAPH_ADMIN_API_KEY;
  }

  const { data } = await axios({
    method: "POST",
    url: `${DGRAPH_ALPHA_URL}/admin/schema`,
    data: schema,
    headers,
  }).catch((err) => {
    console.log(err);
    process.exit(1);
  });

  console.log("Dgraph Schema Updated", data);
};

export default loadSchema;
