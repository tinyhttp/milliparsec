# Migrating from body-parser

| API                                              | body-parser | milliparsec                        |
| ------------------------------------------------ | ----------- | ---------------------------------- |
| `inflate` option                                 | ✅          | ❌                                 |
| `limit` option                                   | ✅          | ✅ (`payloadLimit` in milliparsec) |
| `verify` option                                  | ✅          | ❌                                 |
| `type` option                                    | ✅          | ✅ (`type` in milliparsec)*        |
| `raw()`                                          | ✅          | ✅                                 |
| `json()`                                         | ✅          | ✅                                 |
| `json()` `reviver` option                        | ✅          | ✅                                 |
| `urlencoded()`                                   | ✅          | ✅                                 |
| `urlencoded()` `parameterLimit` option           | ✅          | ❌                                 |
| `urlencoded()` `extended` option                 | ✅          | ❌                                 |
| `urlencoded()` `defaultCharset` option           | ✅          | ❌                                 |
| `urlencoded()` `charsetSentinel` option          | ✅          | ❌                                 |
| `urlencoded()` `interpretNumericEntities` option | ✅          | ❌                                 |
| `urlencoded()` `depth` option                    | ✅          | ❌                                 |

\* The `type` option can only be a function. `milliparsec` does not depend on
the `type-is` package and does not support wildcard MIME strings (for example
`*/json`). Unlike body-parser, milliparsec does not set default `type` on
parsers.
