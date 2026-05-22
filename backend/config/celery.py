import os
import sys
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('pygen')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Windows не поддерживает prefork — используем solo-пул для разработки
if sys.platform == 'win32':
    app.conf.worker_pool = 'solo'
