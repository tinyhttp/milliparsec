# Benchmark

Below are benchmarks of body-parser vs milliparsec and formidable vs
milliparsec. Please take into account that these benchmarks are not entirely
accurate, since they are taken on a regular desktop computer in usual
conditions.

## Environment

- Node.js v24.4.0
- System: Linux 6.18.5-arch1-1 x86_64
- CPU: 13th Gen Intel Core i9-13900H

## JSON parsing

### Benchmark command:

```sh
oha -m POST -d '{"users":[{"id":1,"name":"John Doe","email":"john@example.com","age":30},{"id":2,"name":"Jane Smith","email":"jane@example.com","age":25},{"id":3,"name":"Bob Wilson","email":"bob@example.com","age":35}],"metadata":{"total":3,"page":1,"limit":10}}' -H "Content-Type: application/json" http://localhost:3002 # or 3003
```

### Results

body-parser result:

```
Summary:
  Success rate: 100.00%
  Total:        191.6330 ms
  Slowest:      91.3146 ms
  Fastest:      0.4701 ms
  Average:      1.7468 ms
  Requests/sec: 26091.5338

Response time distribution:
  50.00% in 0.9710 ms
  75.00% in 1.3368 ms
  90.00% in 1.5377 ms
  95.00% in 1.8421 ms
  99.00% in 22.9819 ms
```

milliparsec result:

```
Summary:
  Success rate: 100.00%
  Total:        165.0403 ms
  Slowest:      71.9029 ms
  Fastest:      0.3468 ms
  Average:      1.4746 ms
  Requests/sec: 30295.6248

Response time distribution:
  50.00% in 0.8826 ms
  75.00% in 1.0639 ms
  90.00% in 1.3825 ms
  95.00% in 1.7194 ms
  99.00% in 21.7783 ms
```

### Verdict

milliparsec is ~15% faster than body-parser.

## Multipart with files

### Benchmark command:

```sh
oha -m POST -D multipart-body.txt -H "Content-Type: multipart/form-data; boundary=boundary" http://localhost:3004 # or 3005
```

### Results

formidable result:

```
Summary:
  Success rate: 100.00%
  Total:        1422.2900 ms
  Slowest:      44.6496 ms
  Fastest:      5.8879 ms
  Average:      14.1115 ms
  Requests/sec: 3515.4575

Response time distribution:
  50.00% in 12.6502 ms
  75.00% in 17.0997 ms
  90.00% in 22.0758 ms
  95.00% in 25.4200 ms
  99.00% in 43.0136 ms
```

milliparsec result:

```
Summary:
  Success rate: 100.00%
  Total:        326.6692 ms
  Slowest:      130.7160 ms
  Fastest:      0.9807 ms
  Average:      3.1070 ms
  Requests/sec: 15306.0027

Response time distribution:
  50.00% in 2.2335 ms
  75.00% in 2.7158 ms
  90.00% in 3.0508 ms
  95.00% in 3.6600 ms
  99.00% in 20.3887 ms
```

### Verdict

milliparsec is ~4x faster than formidable.
