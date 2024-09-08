# Generated by Django 4.2.16 on 2024-09-07 16:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AppUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('private_key', models.CharField(blank=True, max_length=100, null=True, unique=True)),
                ('address', models.CharField(blank=True, max_length=100, null=True, unique=True)),
                ('telegram_id', models.CharField(blank=True, max_length=100, null=True, unique=True)),
            ],
        ),
    ]