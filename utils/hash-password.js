import crypto from "crypto";

export default (code) => {
  return crypto.createHash("sha256").update(code).digest("hex");
};
