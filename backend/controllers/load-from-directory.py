import json
import os
from datetime import datetime

import requests


def string_date_to_date(date_str: str) -> datetime.date:
    return datetime.strptime(date_str, '%Y-%m-%d').date()


def load_earthquakes_from_downloaded_files(start_date: str, end_date: str):
    start_date = string_date_to_date(start_date)
    end_date = string_date_to_date(end_date)

    for file in os.listdir('../../downloaded_data/'):
        file_date = file[:10]
        file_date = string_date_to_date(file_date)

        if start_date <= file_date <= end_date:
            try:
                with open(f"../../downloaded_data/{file_date}.geojson", 'r', encoding="utf8") as f:
                    file = json.load(f)
                    resp = requests.post('http://127.0.0.1:9999/earthquake/', json=file)
                    print(file_date, resp.content)
            except Exception as e:
                print(f"failed at {file_date}")
                with open(f"failed.txt", 'a') as f:
                    x = f"{e=}, {file_date=}\n"
                    f.write(x)


if __name__ == '__main__':
    load_earthquakes_from_downloaded_files('1995-01-27', '2023-03-21')
