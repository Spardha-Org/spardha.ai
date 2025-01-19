import os
import csv
from uuid import UUID
from django.core.management.base import BaseCommand
from core.models import Agent, Prompt
from datetime import datetime


class Command(BaseCommand):
    help = "Import data from CSV files into the database."

    def handle(self, *args, **kwargs):
        base_dir = os.path.dirname(os.path.abspath(__file__))  # Get current script directory
        data_dir = os.path.join(base_dir, "../../data")  # Navigate to the `data` directory

        self.import_agents(os.path.join(data_dir, "agents.csv"))
        self.import_prompts(os.path.join(data_dir, "prompts.csv"))

    def parse_datetime(self, datetime_str):
        """ Helper function to parse datetime in various formats """
        try:
            # Try ISO format first
            return datetime.fromisoformat(datetime_str)
        except ValueError:
            # If the format doesn't match, handle formats like '2024-12-22 23:55:07.858 +0530'
            return datetime.strptime(datetime_str, "%Y-%m-%d %H:%M:%S.%f %z")

    def import_agents(self, file_path):
        try:
            with open(file_path, newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    Agent.objects.update_or_create(
                        id=UUID(row['id']),
                        defaults={
                            'specialization_name': row['specialization_name'],
                            'description': row.get('description', ''),
                            'created_at': self.parse_datetime(row['created_at']),
                            'updated_at': self.parse_datetime(row['updated_at']),
                            'is_active': row['is_active'].lower() == 'true'
                        }
                    )
                    self.stdout.write(f"Agent {row['specialization_name']} imported successfully.")
        except Exception as e:
            self.stderr.write(f"Error importing agents: {e}")

    def import_prompts(self, file_path):
        try:
            with open(file_path, newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    try:
                        agent = Agent.objects.get(id=UUID(row['agent_id']))
                    except Agent.DoesNotExist:
                        self.stderr.write(f"Agent with ID {row['agent_id']} does not exist. Skipping this prompt.")
                        continue  # Skip this prompt and continue to the next one

                    Prompt.objects.update_or_create(
                        id=UUID(row['id']),
                        defaults={
                            'agent': agent,
                            'language': row['language'],
                            'primary_prompt': row.get('primary_prompt', ''),
                            'suggestion_prompt': row.get('suggestion_prompt', ''),
                            'summary_prompt': row.get('summary_prompt', '')
                        }
                    )
                    self.stdout.write(f"Prompt for agent {agent.specialization_name} imported successfully.")
        except Exception as e:
            self.stderr.write(f"Error importing prompts: {e}")
