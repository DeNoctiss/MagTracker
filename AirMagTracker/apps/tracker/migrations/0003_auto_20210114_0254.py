# Generated by Django 3.1.2 on 2021-01-14 02:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0002_auto_20210114_0240'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dataflight',
            name='latitude',
            field=models.DecimalField(decimal_places=4, max_digits=8, verbose_name='Широта'),
        ),
        migrations.AlterField(
            model_name='dataflight',
            name='longitude',
            field=models.DecimalField(decimal_places=4, max_digits=8, verbose_name='Долгота'),
        ),
    ]
