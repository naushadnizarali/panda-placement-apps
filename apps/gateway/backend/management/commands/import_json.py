import json
from django.core.management.base import BaseCommand
from django.http import JsonResponse
from django.utils.translation import gettext as _
from django.db import transaction
from django.db.utils import IntegrityError
from backend.models import Countries, Country_State, State_City  # Update with your actual models

class Command(BaseCommand):
    help = 'Import state data from JSON file into the model'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting data import...'))

        try:
            with open('cities.json', 'r', encoding='utf-8') as file:
                data = json.load(file)

            with transaction.atomic():
                for state_data in data:
                    try:
                        state_model = Country_State.objects.get(name=state_data.get('state_name'),country__name=state_data.get('country_name'))
                    except Country_State.DoesNotExist:
                        self.stdout.write(self.style.ERROR(f"State not found for: {state_data}"))
                        continue

                    try:

                        State_City.objects.create(
                            state=state_model,
                            name=state_data.get('name')
                        )
                    except IntegrityError as e:
                        self.stdout.write(self.style.ERROR(f"Error creating city: {e}"))
                        continue

            self.stdout.write(self.style.SUCCESS('Cities imported successfully'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error during data import: {e}'))
            raise
