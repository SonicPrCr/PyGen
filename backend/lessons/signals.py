from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver


# pre_save: запоминаем было ли completed ДО сохранения
@receiver(pre_save, sender='lessons.UserProgress')
def remember_previous_completed(sender, instance, **kwargs):
    if instance.pk:
        try:
            instance._prev_completed = sender.objects.get(pk=instance.pk).completed
        except sender.DoesNotExist:
            instance._prev_completed = False
    else:
        instance._prev_completed = False


# post_save: если completed только что стал True — начисляем награду
@receiver(post_save, sender='lessons.UserProgress')
def on_lesson_completed(sender, instance, **kwargs):
    was_completed = getattr(instance, '_prev_completed', False)
    if instance.completed and not was_completed:
        from lessons.services import complete_lesson
        complete_lesson(instance.user, instance.lesson, instance.stars_earned)
