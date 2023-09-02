import { assertEquals } from "testing/asserts.ts";
import { afterAll, beforeAll, describe, it } from "testing/bdd.ts";

import { Kyber768 } from "../mod.ts";

import { hexToDec, testVectorPath } from "./utils.ts";

describe("Kyber768", () => {
  let count: number;
  let sk: Array<Uint8Array>;
  let ct: Array<Uint8Array>;
  let ss: Array<Uint8Array>;

  beforeAll(async () => {
    count = 0;
    sk = new Array<Uint8Array>(100);
    ct = new Array<Uint8Array>(100);
    ss = new Array<Uint8Array>(100);

    const data = await Deno.readTextFile(
      testVectorPath() + "/PQCkemKAT_2400.rsp",
    );
    const textByLine = data.split("\n");

    let skCount = 0;
    let ctCount = 0;
    let ssCount = 0;
    for (let i = 0; i < textByLine.length; i++) {
      if (textByLine[i][0] == "c" && textByLine[i][1] == "t") {
        const tmp = new Uint8Array(1088);
        for (let j = 0; j < 1088; j++) {
          tmp[j] = hexToDec(
            textByLine[i][2 * j + 5] + textByLine[i][2 * j + 1 + 5],
          );
        }
        ct[ctCount++] = tmp;
      } else if (textByLine[i][0] == "s" && textByLine[i][1] == "s") {
        const tmp = new Uint8Array(32);
        for (let j = 0; j < 32; j++) {
          tmp[j] = hexToDec(
            textByLine[i][2 * j + 5] + textByLine[i][2 * j + 1 + 5],
          );
        }
        ss[ssCount++] = tmp;
      } else if (textByLine[i][0] == "s" && textByLine[i][1] == "k") {
        const tmp = new Uint8Array(2400);
        for (let j = 0; j < 2400; j++) {
          tmp[j] = hexToDec(
            textByLine[i][2 * j + 5] + textByLine[i][2 * j + 1 + 5],
          );
        }
        sk[skCount++] = tmp;
      }
    }
  });

  afterAll(() => {
    console.log(`passed/total: ${count}/${sk.length}`);
  });

  describe("PQCkemKAT_2400.rsp", () => {
    it("should match demonstrated values", async () => {
      const kyber = new Kyber768();
      for (let i = 0; i < 100; i++) {
        const res = await kyber.decap(sk[i], ct[i]);
        assertEquals(res, ss[i]);
        count++;
      }
    });
  });
});
