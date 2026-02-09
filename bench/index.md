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
oha -m POST -d '{"a":1}' -H "Content-Type: application/json" http://localhost:3002 # or 3003
```

### Results

body-parser result:

```
Summary:
  Success rate: 100.00%
  Total:        60.2458 ms
  Slowest:      55.2801 ms
  Fastest:      0.5548 ms
  Average:      12.0064 ms
  Requests/sec: 3319.7335

Response time distribution:
  50.00% in 1.3036 ms
  75.00% in 31.2024 ms
  90.00% in 46.0986 ms
  95.00% in 47.2233 ms
  99.00% in 52.1532 ms
```

milliparsec result:

```
Summary:
  Success rate: 100.00%
  Total:        54.7949 ms
  Slowest:      44.1667 ms
  Fastest:      0.6135 ms
  Average:      9.5273 ms
  Requests/sec: 3649.9779

Response time distribution:
  50.00% in 1.1726 ms
  75.00% in 17.3265 ms
  90.00% in 36.4140 ms
  95.00% in 37.4827 ms
  99.00% in 43.6290 ms
```

### Verdict

milliparsec, on average, is ~10% faster.

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
  Total:        108.3334 ms
  Slowest:      71.1838 ms
  Fastest:      8.5817 ms
  Average:      23.8519 ms
  Requests/sec: 1846.1530

Response time distribution:
  50.00% in 16.0338 ms
  75.00% in 56.2787 ms
  90.00% in 56.8965 ms
  95.00% in 69.7132 ms
  99.00% in 71.0121 ms
```

milliparsec result:

```
Summary:
  Success rate: 100.00%
  Total:        79.4623 ms
  Slowest:      67.6478 ms
  Fastest:      1.6161 ms
  Average:      15.9568 ms
  Requests/sec: 2516.9155

Response time distribution:
  50.00% in 2.9719 ms
  75.00% in 24.1332 ms
  90.00% in 62.7090 ms
  95.00% in 65.4033 ms
  99.00% in 67.3112 ms
```

### Verdict

milliparsec, on average, is ~36% faster.
