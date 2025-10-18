import pandas as pd
import csv

schools = pd.read_csv("Rus_schools_final.csv", encoding='cp1251') 

data_schools = list()

with open('nvkz_schools.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.DictWriter(file, fieldnames=['','name','struct','addr','lat','lon'])
    writer.writeheader()
    for idx, row in schools.iterrows(): 
        if 'г. Новокузнецк' in row['addr']:
            writer.writerow({'':idx, 'name': row['name'], 'struct':row['struct'], 'addr': row['addr'], 'lat': row['lat'], 'lon': row['lon']})


