import os
import re
import random
from datetime import datetime, timedelta

# Regex to match variations of date field (with/without quotes, possibly empty)
date_pattern = re.compile(r"^(date:\s*)(['\"]?\d{4}-\d{2}-\d{2}['\"]?|['\"]?['\"]?)", re.MULTILINE)

# Regex to match "tag:" field and replace with "tags:"
tag_pattern = re.compile(r"^tag:", re.MULTILINE)

# Function to generate a random date within a given year range
def random_date(start_year=2025, end_year=2025):
    start = datetime(start_year, 1, 1)
    end = datetime(end_year, 12, 31)
    delta = end - start
    return start + timedelta(days=random.randint(0, delta.days))

# Walk through all .mdx files
for root, dirs, files in os.walk("."):
    for fname in files:
        if fname.endswith(".mdx"):
            path = os.path.join(root, fname)

            with open(path, "r", encoding="utf-8") as f:
                content = f.read()

            updated = False

            # Normalize and randomize date
            match = date_pattern.search(content)
            if match:
                new_date = random_date().strftime("%Y-%m-%d")
                content = date_pattern.sub(rf"\1'{new_date}'", content)
                updated = True

            # Fix "tag:" -> "tags:"
            if tag_pattern.search(content):
                content = tag_pattern.sub("tags:", content)
                updated = True

            if updated:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Updated {path}")
            else:
                print(f"No changes needed in {path}")

