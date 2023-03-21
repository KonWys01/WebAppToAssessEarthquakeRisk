import requests
from time import sleep
from datetime import timedelta, date, datetime
import glob
import os


def get_latest_date():
    path = f'{os.getcwd()}\\downloaded_data\\'
    extension = f'.geojson'
    files = glob.glob(path + '*' + extension)
    dates = []
    for file in files:
        file_name = file.replace(path, '').replace(extension, '')
        dates.append(datetime.strptime(file_name, '%d-%m-%Y').date())
    youngest_date = min(dates)
    return youngest_date


def daterange(start_date, end_date, step=1):
    if step == 1:
        for n in range(int((end_date - start_date).days)):
            yield start_date + timedelta(n)
    else:
        for n in range(int((start_date - end_date).days)):
            yield start_date - timedelta(n)


def download_data(url: str):
    starting_date = get_latest_date()

    for single_date in daterange(starting_date, starting_date - timedelta(days=365), -1):
        try:
            earthquake = requests.get(url + f'&starttime={single_date}&endtime={single_date + timedelta(1)}')
            print(f'earthquake for {single_date} was downloaded')
            data = earthquake.content
            with open(f'downloaded_data/{single_date.day}-{single_date.month}-{single_date.year}.geojson', 'wb') as f:
                # geojson.dump(earthquake, f)
                f.write(data)
            sleep(10)
        except:
            print(f'{single_date}')
            continue


if __name__ == '__main__':
    base_url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson"
    download_data(base_url)
