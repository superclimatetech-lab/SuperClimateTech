"""
Initial migration for weather_api app
"""
from django.db import migrations, models
import django.db.models.deletion
import django.core.validators


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('country', models.CharField(max_length=255)),
                ('latitude', models.FloatField(validators=[django.core.validators.MinValueValidator(-90), django.core.validators.MaxValueValidator(90)])),
                ('longitude', models.FloatField(validators=[django.core.validators.MinValueValidator(-180), django.core.validators.MaxValueValidator(180)])),
                ('is_featured', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['country', 'name'],
            },
        ),
        migrations.CreateModel(
            name='Alert',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('alert_type', models.CharField(choices=[('heat_wave', 'Heat Wave'), ('cold_wave', 'Cold Wave')], max_length=20)),
                ('severity', models.CharField(choices=[('warning', 'Warning'), ('severe', 'Severe'), ('extreme', 'Extreme')], max_length=20)),
                ('description', models.TextField()),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField(blank=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('temperature_value', models.FloatField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='alerts', to='weather_api.location')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='CurrentWeather',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('temperature', models.FloatField()),
                ('feels_like', models.FloatField()),
                ('humidity', models.IntegerField(validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)])),
                ('pressure', models.IntegerField()),
                ('wind_speed', models.FloatField()),
                ('condition', models.CharField(choices=[('clear', 'Clear'), ('cloudy', 'Cloudy'), ('rainy', 'Rainy'), ('stormy', 'Stormy'), ('snowy', 'Snowy')], max_length=20)),
                ('description', models.TextField(blank=True)),
                ('timestamp', models.DateTimeField(auto_now=True)),
                ('location', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='current_weather', to='weather_api.location')),
            ],
            options={
                'ordering': ['-timestamp'],
            },
        ),
        migrations.CreateModel(
            name='HistoricalData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('max_temperature', models.FloatField()),
                ('min_temperature', models.FloatField()),
                ('avg_temperature', models.FloatField()),
                ('precipitation', models.FloatField(blank=True, null=True)),
                ('humidity', models.IntegerField()),
                ('wind_speed', models.FloatField()),
                ('condition', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='historical_data', to='weather_api.location')),
            ],
            options={
                'ordering': ['-date'],
                'unique_together': {('location', 'date')},
            },
        ),
        migrations.CreateModel(
            name='Forecast',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('forecast_type', models.CharField(choices=[('short_term', '1-7 Days'), ('long_term', '8-30 Days')], max_length=20)),
                ('forecast_date', models.DateField()),
                ('max_temperature', models.FloatField()),
                ('min_temperature', models.FloatField()),
                ('avg_temperature', models.FloatField()),
                ('condition', models.CharField(max_length=255)),
                ('precipitation_chance', models.IntegerField(validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)])),
                ('wind_speed', models.FloatField()),
                ('humidity', models.IntegerField(validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)])),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='forecasts', to='weather_api.location')),
            ],
            options={
                'ordering': ['forecast_date'],
            },
        ),
        migrations.AddIndex(
            model_name='location',
            index=models.Index(fields=['country'], name='weather_api_country_idx'),
        ),
        migrations.AddIndex(
            model_name='location',
            index=models.Index(fields=['latitude', 'longitude'], name='weather_api_lat_lng_idx'),
        ),
        migrations.AddIndex(
            model_name='currentweather',
            index=models.Index(fields=['-timestamp'], name='weather_api_timestamp_idx'),
        ),
        migrations.AddIndex(
            model_name='currentweather',
            index=models.Index(fields=['location'], name='weather_api_location_idx'),
        ),
        migrations.AddIndex(
            model_name='forecast',
            index=models.Index(fields=['location', 'forecast_date'], name='weather_api_loc_date_idx'),
        ),
        migrations.AddIndex(
            model_name='forecast',
            index=models.Index(fields=['forecast_type', 'forecast_date'], name='weather_api_type_date_idx'),
        ),
        migrations.AddIndex(
            model_name='alert',
            index=models.Index(fields=['location', 'is_active'], name='weather_api_loc_active_idx'),
        ),
        migrations.AddIndex(
            model_name='alert',
            index=models.Index(fields=['alert_type', 'is_active'], name='weather_api_type_active_idx'),
        ),
        migrations.AddIndex(
            model_name='historicaldata',
            index=models.Index(fields=['location', 'date'], name='weather_api_loc_date_hist_idx'),
        ),
        migrations.AddIndex(
            model_name='historicaldata',
            index=models.Index(fields=['date'], name='weather_api_date_idx'),
        ),
    ]
