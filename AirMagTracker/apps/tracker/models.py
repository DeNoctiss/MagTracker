from django.db import models

#class AirPlane(models.Model):
#	race = models.CharField('рейс', max_length = 10)

class Route(models.Model):
	date = models.DateField('Дата')
	race = models.CharField('Рейс', max_length = 10)
	takeoff = models.CharField('Взлет', max_length = 50)
	landing = models.CharField('Посадка', max_length = 50)
	
class DataFlight(models.Model):
	route = models.ForeignKey(Route, on_delete = models.CASCADE)
	latitude = models.DecimalField('Широта', max_digits=8, decimal_places=4)
	longitude = models.DecimalField('Долгота', max_digits=8, decimal_places=4)
	altitude = models.IntegerField('Высота')
	dirction = models.IntegerField('Направление', default=0)
	time = models.CharField('Время', max_length = 50, default='')
	total = models.IntegerField('Глобальная интенсивность')
	Bx = models.IntegerField('Bx')
	By = models.IntegerField('By')
	Bz = models.IntegerField('Bz')