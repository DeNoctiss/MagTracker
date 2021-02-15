import requests
from bs4 import BeautifulSoup
#import psycopg2
import sqlite3
from datetime import datetime
import time
import math
import requests
import json
from requests.exceptions import HTTPError

def readFile(file):
	data = []
	f = open(file,'r')
	for line in f:
		data.append(line.rstrip())
	return data

def getData(race,cursor,conn,urls):
	allData = []
	count = 0
	print(race)
	for race_ in race:
		if count == 100:
			count = 0
			time.sleep(3600)
		historyURL = 'https://uk.flightaware.com/live/flight/'+race_+'/history'
		historySource = requests.get(historyURL)
		historyText = historySource.text
		historySoup = BeautifulSoup(historyText, 'html.parser')

		table = historySoup.find('table', {'class': 'prettyTable'})
		row = table.findAll('tr')[1:-1:]
		if len(row) < 4:
			continue
		for col in row:
			data = col.findAll('td')
			if data[6].text.find(':') == -1:
				continue
			date = datetime.strptime(data[0].text.replace(' ',''),"%d-%b-%Y").date()
			from_ = data[2].text.replace("'",'')
			from_ = from_.replace("`",'')
			to_ = data[3].text.replace("'",'')
			link = data[0].find('a')['href']
			print(race_, ' ', date, ' ', from_, ' ', to_)
			if(chekRoute(date,race_,cursor,conn)):
				continue

			dataFlight = getDataFlight('https://flightaware.com'+link+'/tracklog')
			allData.append((dataFlight,date,from_,to_,race_))
			count = count + 1
	for dataFlight in allData:
		chekData(dataFlight[0],dataFlight[1],dataFlight[2],dataFlight[3],dataFlight[4],cursor,conn,urls)


def getDataFlight(link):
	dataFlight = []
	flightDataUrl = link
	flightDataSource = requests.get(flightDataUrl)
	maintFlightDataText = flightDataSource.text
	flightDataSoup = BeautifulSoup(maintFlightDataText, 'html.parser')
	dataTable = flightDataSoup.find('table', {'id': 'tracklogTable'})
	dataRows = dataTable.findAll('tr')
	dataRows = dataRows[1::]
	number = 1
	for dataRow in dataRows:
		row = []
		tds = dataRow.findAll('td');
		data = dataRow.findAll('span', {'class': 'show-for-medium-up'})
		if len(data) == 5:
			direction = tds[3].text.split(' ')[1]
			direction = direction[:-1:]
			altitude = data[3].text.split(',')
			if len(altitude) == 2:
				altitude = altitude[0]+altitude[1]
			else:
				altitude = altitude[0]
			if altitude == '':
				altitude = 0
			altitude = int(altitude)
			latitude = data[1].text
			longitude = data[2].text
			time_ = data[0].text
			total_intensity = 0
			Bx = 0
			By = 0
			Bz = 0
			#print (latitude + ' ' + longitude + ' ' + altitude + ' ' + str(number) + ' ' + time_)
			#cursor.execute("insert into DataFlight values("+latitude+","+longitude+","+altitude+","+str(total_intensity)+","+direction+","+str(idRoute)+","+str(number)+",'"+time_+"',"+str(Bx)+","+str(By)+","+str(Bz)+");")
			#conn.commit()
			row.append(latitude)
			row.append(longitude)
			row.append(altitude)
			row.append(total_intensity)
			row.append(direction)
			#row.append(number)
			row.append(time_)
			row.append(Bx)
			row.append(By)
			row.append(Bz)
			print(row)
			dataFlight.append(row)
			number = number + 1
	return dataFlight

def chekData(data,date,from_,to_,race,cursor,conn,urls):
	count = 0
	begin = -1
	end = -1
	for i in range(len(data)):
		if data[i][2] == 0:
			if begin == -1:
				begin = i
			count = count + 1
		if (data[i][2] != 0 and begin != -1) or (i == len(data)-1 and begin != -1):
			end = i
			if i == 0:
				endValue = data[end+1][2]
				avgValue = math.floor(endValue/count)
				for j in range(count):
					data[begin+j][2] = avgValue*(j+1)
			if i == len(data)-1:
				beginValue = data[begin-1][2]
				avgValue = math.floor(beginValue/count)
				for j in range(count):
					data[begin+j][2] = data[begin-1][2]+avgValue*(count-j)
			if i != 0 and i != len(data)-1:
				if data[begin-1][2] < data[end+1][2]:
					avgValue = math.floor((data[end+1][2]-data[begin-1][2])/count)
					for j in range(count):
						data[begin+j][2] = data[begin-1][2]+avgValue*(j+1)
				if data[begin-1][2] > data[end+1][2]:
					avgValue = math.floor((data[begin-1][2]-data[end+1][2])/count)
					for j in range(count):
						data[begin+j][2] = data[begin-1][2]+avgValue*(count-j)
				if data[begin-1][2] == data[end+1][2]:
					for j in range(count):
						data[begin+j][2] = data[begin-1][2]
			begin = -1
			end = -1
			count = 0
	insertToDB(cursor,data,date,from_,to_,race,conn,urls)

def chekRoute(date,race,cursor,conn):
	cursor.execute("select id from tracker_route where date = '"+str(date)+"' and race = '"+race+"';")
	idDate = cursor.fetchall()
	if len(idDate) == 0:
		return False
	else:
		return True


	#cursor.execute("select id from date where date = '"+str(date)+"';")
	#idDate = cursor.fetchall()
	#if len(idDate) == 0:
	#	cursor.execute("select max(id) from date;")
	#	idDate = cursor.fetchone()[0]+1
	#	cursor.execute("insert into Date values("+str(idDate)+",'"+str(date)+"');")
	#	#conn.commit()
	#	return False
	#else:
	#	idDate = idDate[0][0]
	#	cursor.execute("select id from Route where race = '"+race+"' and date_id = "+str(idDate)+";")
	#	if len(cursor.fetchall())==0:
	#		return False
	#	else:
	#		return True

def insertToDB(cursor,data,date,from_,to_,race,conn,urls):
	cursor.execute("select max(id) from tracker_route;") #tracker_route  -- Route
	idRoute = cursor.fetchone()[0]
	print(idRoute)
	if idRoute == None:
		idRoute = 1
	else:
		idRoute = idRoute + 1

	cursor.execute("select max(id) from tracker_dataflight;") #tracker_route  -- Route
	idFlight = cursor.fetchone()[0]
	print(idFlight)
	if idFlight == None:
		idFlight = 1
	else:
		idFlight = idFlight + 1
	#cursor.execute("select id from date where date = '"+str(date)+"';")
	#idDate = cursor.fetchone()[0]
	#print('insert Route')
	cursor.execute("insert into tracker_route values("+str(idRoute)+",'"+str(date)+"','"+str(race)+"','"+str(from_)+"','"+str(to_)+"');")
	#conn.commit()
	#print('insert DataFlight')
	for d in data:
		try:
			response = requests.get('http://geomag.bgs.ac.uk/web_service/GMModels/wmm/2020v2?latitude='+str(d[0])+'&longitude='+str(d[1])+'&altitude='+str(d[2]/1000)+'&date='+str(date)+'&format=json')
			response.raise_for_status()
			data = json.loads(response.text)

			total = data["geomagnetic-field-model-result"]['field-value']['total-intensity']['value']
			Bx = data["geomagnetic-field-model-result"]['field-value']['north-intensity']['value']
			By = data["geomagnetic-field-model-result"]['field-value']['east-intensity']['value']
			Bz = data["geomagnetic-field-model-result"]['field-value']['vertical-intensity']['value']
		except HTTPError as http_err:
			print(f'HTTP error occurred: {http_err}')  # Python 3.6
		except Exception as err:
			print(f'Other error occurred: {err}')  # Python 3.6
		else:
			print('Success!')
		cursor.execute("insert into tracker_dataflight values("+str(idFlight)+","+str(d[0])+","+str(d[1])+","+str(d[2])+","+str(total)+","+str(Bx)+","+str(By)+","+str(Bz)+","+str(idRoute)+","+str(d[4])+",'"+str(d[5])+"');")
		idFlight = idFlight + 1


while True:
	print('parse')
	urls = []
	conn = sqlite3.connect ("/home/denoctis/Projects/Django/AirMagTracker/db.sqlite3")
	cursor = conn.cursor()
	cursor.execute('BEGIN')
	getData(readFile('race.txt'),cursor,conn,urls)
	conn.commit()
	conn.close()
	print('end parse')
	time.sleep(86400)