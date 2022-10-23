// query utilities:
import { getByText } from "@testing-library/dom";
// adds special assertions like toHaveTextContent
import "@testing-library/jest-dom";

import {
  createDateReviser,
  formatDate,
  isAfterDate,
  isBeforeDate,
  isBetweenDate,
  parseDate,
  styleInject,
} from "../src";

test("formatDate()", () => {
  const d = new Date("2022-12-12 12:12:05");
  expect(formatDate(d)).toBe("2022-12-12 12:12:05");
  expect(formatDate(d, "YYYY-MM-DD")).toBe("2022-12-12");
  expect(formatDate(d, "HH-mm-ss")).toBe("12-12-05");
  expect(formatDate("abcd", "HH-mm-ss")).toBe("");
});

test("isAfterDate() & isBeforeDate()", () => {
  expect(
    isAfterDate({
      date: "2022-12-12 00:00:00",
      targetDate: "2022-12-11 00:00:00",
    })
  ).toBe(true);

  expect(
    isAfterDate({
      date: "2022-12-12 00:00:00",
      targetDate: "2022-12-13 00:00:00",
    })
  ).toBe(false);

  expect(
    isAfterDate({
      date: "2022-12-12 00:00:00",
      targetDate: "2022-12-12 00:00:00",
      same: true,
    })
  ).toBe(true);

  expect(
    isBeforeDate({
      date: "2022-12-10 00:00:00",
      targetDate: "2022-12-11 00:00:00",
    })
  ).toBe(true);
});

test("isBetweenDate()", () => {
  expect(
    isBetweenDate({
      startDate: "2022-12-12 00:00:00",
      endDate: "2022-12-14 00:00:00",
      targetDate: "2022-12-13 00:00:00",
    })
  ).toBe(true);
  expect(
    isBetweenDate({
      startDate: "2022-12-12 00:00:00",
      endDate: "2022-12-13 00:00:00",
      targetDate: "2022-12-14 00:00:00",
    })
  ).toBe(false);
  expect(
    isBetweenDate({
      startDate: "2022-12-12 00:00:00",
      endDate: "2022-12-12 00:00:00",
      targetDate: "2022-12-12 00:00:00",
      startSame: false,
    })
  ).toBe(false);
});

test("createDateReviser()", () => {
  const serverTime = parseDate(new Date());
  serverTime.setSeconds(serverTime.getSeconds() + 5);

  const reviser = createDateReviser(serverTime);

  expect(reviser.diff).toBe(5000);
  expect(formatDate(reviser.getReviseDate("2022-12-18 00:00:00"))).toBe(
    "2022-12-18 00:00:05"
  );
});
