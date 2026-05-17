import { describe, it, expect } from "vitest";
import { user, calculateTotal, isEven } from "../src/Components/About";

describe("About Tests", () => {

  // Test 1: 
  it("checks user name", () => {
    expect(user.name).toBe("Rima");
  });

  //  Test 2
  it("calculates total expenses", () => {
    expect(calculateTotal([10, 20, 30, 40])).toBe(100);
  });

  //  Test 3: even number
  it("checks even number", () => {
    expect(isEven(4)).toBe(true);
    expect(isEven(7)).toBe(false);
  });

});