import sys

if len(sys.argv) != 2:
    print("Usage: script.py <number>")
    sys.exit(1)

try:
    number = float(sys.argv[1])
    result = number * 2
    print(result)
except ValueError:
    print("Invalid number provided.")
    sys.exit(1)
