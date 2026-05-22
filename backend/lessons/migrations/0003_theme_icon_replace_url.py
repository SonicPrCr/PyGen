from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lessons', '0002_remove_test_lesson_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='theme',
            name='icon_url',
        ),
        migrations.AddField(
            model_name='theme',
            name='icon',
            field=models.ImageField(blank=True, null=True, upload_to='theme_icons/', verbose_name='Иконка'),
        ),
    ]
