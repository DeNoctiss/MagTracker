from django.shortcuts import render
from django.http import HttpResponse
from .models import Route, DataFlight
import json

def index(request):
	
	#race_list = AirPlane.objects.order_by('id')
	return render(request, 'tracker/list.html')

def getDates(request):
	date_list = Route.objects.values('date')
	dct = list()
	for date in date_list:
		dct.append(str(date['date']))
	return HttpResponse(json.dumps({'start':dct[-1],'last':dct[0],'disableDates':[]}))

def getRoutes(request, data):
	route_list = Route.objects.filter(date = data)
	routes = list()
	for route in route_list:
		routes.append({'id':route.id,'race':route.race, 'from':route.takeoff, 'to':route.landing, 'date':str(route.date)})
	return HttpResponse(json.dumps(routes))

def getDataFlight(request, routeId):
	dataFlight = DataFlight.objects.filter(route_id = routeId)
	datas = list()
	for data in dataFlight:
		datas.append({'longitude':str(data.longitude),'latitude':str(data.latitude), 'total_intensity':data.total, 'Bx':data.Bx, 'By':data.By, 'Bz':data.Bz, 'time':data.time, 'direction':data.dirction, 'altitude':data.altitude})
	return HttpResponse(json.dumps(datas))
