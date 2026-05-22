import time

from django.core.management.base import BaseCommand, CommandError

from lessons.models import Theme
from tasks.models import Task
from tasks import ai_service


class Command(BaseCommand):
    help = 'Наполняет пул заданий через DeepSeek AI'

    def add_arguments(self, parser):
        group = parser.add_mutually_exclusive_group(required=True)
        group.add_argument('--theme', type=int, metavar='ID', help='ID конкретной темы')
        group.add_argument('--all', action='store_true', help='Все темы')
        parser.add_argument('--count', type=int, default=3, metavar='N', help='Заданий на тему (по умолчанию 3)')

    def handle(self, *args, **options):
        count = options['count']

        if options['all']:
            themes = list(Theme.objects.all())
            if not themes:
                raise CommandError('Темы не найдены в базе данных')
        else:
            try:
                themes = [Theme.objects.get(pk=options['theme'])]
            except Theme.DoesNotExist:
                raise CommandError(f"Тема с ID={options['theme']} не найдена")

        created = 0
        failed = 0

        for theme in themes:
            self.stdout.write(f'\n── Тема: {theme.title} (id={theme.id}) ──')
            for i in range(count):
                data = ai_service.generate_task_data(theme)
                if data is None:
                    self.stdout.write(self.style.ERROR(f'  FAIL [{i+1}/{count}]: theme={theme.id}'))
                    failed += 1
                else:
                    Task.objects.create(
                        theme=theme,
                        title=data['title'],
                        description=data['description'],
                        starter_code=data['starter_code'],
                        test_cases=data['test_cases'],
                        is_pregenerated=True,
                        created_by_user=None,
                    )
                    self.stdout.write(
                        self.style.SUCCESS(f"  OK  [{i+1}/{count}]: theme={theme.id} title='{data['title']}'")
                    )
                    created += 1

                if i < count - 1:
                    time.sleep(1)

        self.stdout.write(f'\n{"="*50}')
        self.stdout.write(self.style.SUCCESS(f'Создано заданий: {created}'))
        if failed:
            self.stdout.write(self.style.ERROR(f'Ошибок: {failed}'))
