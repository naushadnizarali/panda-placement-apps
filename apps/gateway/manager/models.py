from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.conf import settings


class ManagerTodo_List(models.Model):
    manager = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    todo = models.TextField(default="Default")
    is_complete = models.BooleanField(default=False)

    # def __str__(self) -> str:
    #     return self.manager.email +" > " +self.todo[0:20]+"..."

class ManagerNotes_List(models.Model):
    manager = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    notes = models.TextField(default="Default")
    is_complete = models.BooleanField(default=False)

    # def __str__(self) -> str:
    #     return self.manager.email +" > "+ self.notes[0:20]+"..."