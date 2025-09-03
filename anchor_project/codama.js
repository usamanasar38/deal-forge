import { createCodamaConfig } from "gill";

export default createCodamaConfig({
  clientJs: "anchor_project/src/client/js/generated",
  idl: "target/idl/dealforge.json",
});
