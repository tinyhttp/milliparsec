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

\* The `type` option can be a string or a function. `milliparsec` does not
depend on the `type-is` package and does not support wildcard MIME strings (for
example `*/json`). It only does a simple string comparisong of the first part of
the `Content-Type` header. Unlike body-parser, milliparsec does not set default
`type` on parsers.
