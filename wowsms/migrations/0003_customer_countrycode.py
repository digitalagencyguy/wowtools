# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-07-30 04:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wowsms', '0002_auto_20170729_1735'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='countryCode',
            field=models.IntegerField(default=61),
        ),
    ]
