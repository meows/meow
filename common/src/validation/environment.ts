import { integer, maxValue, minValue, nonEmpty, pipe, string, toNumber, url as link } from "valibot"

/** Validate string port and transform to integer. */
export const port = () => pipe(
  string(),
  nonEmpty("Port cannot be empty."),
  toNumber(),
  integer(),
  minValue(1),
  maxValue(65535)
)

/** Validate for non-empty string. */
export const notEmpty = () => pipe(string(), nonEmpty())

/** Validate for non-empty URL. */
export const url = () => pipe(string(), link())
