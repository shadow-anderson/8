import json
import requests
from pathlib import Path

def download_and_combine(url_file, output_file):
    # Load URLs from JSON array in txt file
    with open(url_file, 'r', encoding='utf-8') as f:
        urls = json.load(f)

    if not isinstance(urls, list):
        raise ValueError("Input file must contain a JSON array of URLs.")

    print(f"Found {len(urls)} URLs. Starting download...")

    # Create the output file (binary mode for mixed content)
    with open(output_file, 'wb') as out_file:
        for i, url in enumerate(urls, 1):
            try:
                print(f"[{i}/{len(urls)}] Downloading: {url}")
                response = requests.get(url, timeout=30)
                response.raise_for_status()

                # Write separator + file content
                out_file.write(f"\n\n===== FILE {i}: {url} =====\n\n".encode('utf-8'))
                out_file.write(response.content)
                out_file.write(b"\n\n")

            except Exception as e:
                print(f"❌ Failed to download {url}: {e}")

    print(f"\n✅ Done! Combined content saved to: {output_file}")

if __name__ == "__main__":
    input_txt = "urls.txt"              # file containing the JSON array
    output_file = "combined_output.txt" # output file
    download_and_combine(input_txt, output_file)
