from django.contrib import admin
from .models import ManagerTodo_List, ManagerNotes_List


@admin.register(ManagerTodo_List)
class ManagerTodoAdmin(admin.ModelAdmin):
    list_display = ('manager', 'shortened_todo', 'is_complete')

    def shortened_todo(self, obj):
        
        max_length = 50
        if len(obj.todo) <= max_length:
            return obj.todo
        return f"{obj.todo[:max_length]}..."

    shortened_todo.short_description = 'Shortened Todo'


@admin.register(ManagerNotes_List)
class NotesAdmin(admin.ModelAdmin):
    list_display = ('manager', 'shortened_todo', 'is_complete')

    def shortened_todo(self, obj):
        
        max_length = 50
        if len(obj.notes) <= max_length:
            return obj.notes
        return f"{obj.notes[:max_length]}..."

    shortened_todo.short_description = 'Shortened Todo'

# admin.site.register([ManagerTodo_List, ManagerNotes_List])
