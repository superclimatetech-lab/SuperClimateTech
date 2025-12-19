from django.core.management.base import BaseCommand
from weather_api.models import Location


class Command(BaseCommand):
    help = 'Load initial African locations into the database'

    def handle(self, *args, **options):
        locations_data = [
            {'name': 'Cairo', 'country': 'Egypt', 'latitude': 30.0444, 'longitude': 31.2357, 'is_featured': True},
            {'name': 'Lagos', 'country': 'Nigeria', 'latitude': 6.5244, 'longitude': 3.3792, 'is_featured': True},
            {'name': 'Johannesburg', 'country': 'South Africa', 'latitude': -26.2023, 'longitude': 28.0436, 'is_featured': True},
            {'name': 'Nairobi', 'country': 'Kenya', 'latitude': -1.2921, 'longitude': 36.8219, 'is_featured': True},
            {'name': 'Addis Ababa', 'country': 'Ethiopia', 'latitude': 9.0320, 'longitude': 38.7469, 'is_featured': True},
            {'name': 'Accra', 'country': 'Ghana', 'latitude': 5.6037, 'longitude': -0.1870, 'is_featured': True},
            {'name': 'Algiers', 'country': 'Algeria', 'latitude': 36.7538, 'longitude': 3.0588, 'is_featured': True},
            {'name': 'Cape Town', 'country': 'South Africa', 'latitude': -33.9249, 'longitude': 18.4241, 'is_featured': True},
            {'name': 'Casablanca', 'country': 'Morocco', 'latitude': 33.5731, 'longitude': -7.5898, 'is_featured': True},
            {'name': 'Dakar', 'country': 'Senegal', 'latitude': 14.6928, 'longitude': -17.0467, 'is_featured': True},
            {'name': 'Khartoum', 'country': 'Sudan', 'latitude': 15.5007, 'longitude': 32.5599, 'is_featured': False},
            {'name': 'Douala', 'country': 'Cameroon', 'latitude': 4.0511, 'longitude': 9.7679, 'is_featured': False},
            {'name': 'Kinshasa', 'country': 'Democratic Republic of Congo', 'latitude': -4.3276, 'longitude': 15.3136, 'is_featured': False},
            {'name': 'Luanda', 'country': 'Angola', 'latitude': -8.8383, 'longitude': 13.2344, 'is_featured': False},
            {'name': 'Dar es Salaam', 'country': 'Tanzania', 'latitude': -6.8000, 'longitude': 39.2833, 'is_featured': False},
            {'name': 'Maputo', 'country': 'Mozambique', 'latitude': -23.8646, 'longitude': 35.3477, 'is_featured': False},
            {'name': 'Harare', 'country': 'Zimbabwe', 'latitude': -17.8252, 'longitude': 31.0335, 'is_featured': False},
            {'name': 'Botswana', 'country': 'Gaborone', 'latitude': -24.6282, 'longitude': 25.9165, 'is_featured': False},
            {'name': 'Antananarivo', 'country': 'Madagascar', 'latitude': -18.8792, 'longitude': 47.5079, 'is_featured': False},
            {'name': 'Abuja', 'country': 'Nigeria', 'latitude': 9.0765, 'longitude': 7.3986, 'is_featured': False},
        ]

        created_count = 0
        for loc_data in locations_data:
            location, created = Location.objects.get_or_create(**loc_data)
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully loaded {created_count} new locations. '
                f'Total locations: {Location.objects.count()}'
            )
        )
