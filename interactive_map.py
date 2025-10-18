import folium
import pandas as pd 
import json


schools = pd.read_csv("nvkz_schools.csv", encoding='utf-8')
edu = pd.read_csv("addition_edu.csv", encoding='utf-8',sep=';') 

map = folium.Map(location=[53.757553, 87.136053], zoom_start=12) 

for idx, row in schools.iterrows(): 
    folium.Marker(class_name="school",location=[row['lat'], row['lon']], popup=row['name'], tooltip=row['addr'] , icon=folium.Icon(color='red', icon='glyphicon glyphicon-pencil')).add_to(map) 

#for idx, row in edu.iterrows(): 
#    folium.Marker(class_name="edu",location=[row['lat'], row['lon']], popup=row['name'], tooltip=row['addr'] , icon=folium.Icon(color='purple', icon='glyphicon glyphicon-book')).add_to(map) 

rows=[]
for idx, row in edu.iterrows():
    rows.append({'name':row['name'], 'addr':row['addr'], 'lat': row['lat'], 'lng': row['lon']})

edu_data_js = "window._edu = JSON.parse('" + json.dumps( rows ) + "');"
map.get_root().script.add_child(folium.elements.Element(edu_data_js))

map.add_js_link(name="custom",url="scripts/custom.js")
#map.show_in_browser()


map.save("interactive_map.html")


