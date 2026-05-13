from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lessons', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lesson',
            name='lesson_type',
            field=models.CharField(
                choices=[('theory', 'Теория'), ('practice', 'Практика')],
                max_length=20,
                verbose_name='Тип урока',
            ),
        ),
    ]
