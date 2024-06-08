import React, { useEffect, useState } from 'react'

const TodoItem = (props) => {
    const {emitDeleteTodoItem} = props;
    const [todoItem, setTodoItem] = useState(props.data);
    const [isDirty, setDirty] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Состояние для отслеживания режима редактирования


    useEffect(()=>{
      if (isDirty) {
        fetch(`http://localhost:8080/update-todo-by-id/${todoItem.id}`,{
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(todoItem),
        }).then (response => response.json()).then(data => {
          setDirty(false);
          setTodoItem(data);
        });
      }
    },[todoItem, isDirty])

    function updateIsDone () {
      setTodoItem({...todoItem, isDone: !todoItem.isDone})
      
    }

    function updateTask (e) {
      setDirty(true);
      setTodoItem ({...todoItem, text: e.target.value});
    }

    function deleteTodoItem () {
      fetch(`http://localhost:8080/delete-todo-by-id/${todoItem.id}`,{
          method: 'DELETE',
          headers: {
            'content-type': 'application/json',
          },
        }).then (response => emitDeleteTodoItem(todoItem));
    }

    const saveTodoItem = () => {
      // Здесь можно выполнить сохранение задачи, например, отправив запрос на сервер или обновив список задач в родительском компоненте
      console.log('Сохранение задачи:', todoItem);
      // Например:
      fetch(`http://localhost:8080/update-todo-by-id/${todoItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoItem),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Задача успешно сохранена:', data);
      })
      .catch(error => {
        console.error('Ошибка при сохранении задачи:', error);
      });
  
      // После успешного сохранения, можно сбросить флаг dirty
      setDirty(false);
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Предотвратить стандартное действие Enter в форме
        setDirty(true);
        // Здесь можно вызвать функцию для сохранения задачи или выполнения других действий по завершению редактирования
        // Например:
        setIsEditing(false);
        saveTodoItem();
        e.target.blur();
        // или
        // updateTaskTitle(todoItem.text);
      }
    };

  return (
    <div className='newTodoForm'>
      <input type="checkbox"
             className='checkbox'
             value={todoItem} 
             checked= {todoItem.isDone} 
             onChange= {() => {
        setDirty(true);
        setTodoItem({...todoItem, isDone: !todoItem.isDone});}}
      />
      {
        todoItem.isDone ? 
          // (<span /*style = {{textDecoration: "line-through"}}*/>{todoItem.text}</span>) 
          (<input className='inputField' value={todoItem.text} />):
          (<input 
              type="text"
              className='inputField'
              placeholder="Название задачи" 
              value={todoItem.text} 
              onChange={updateTask}
              onKeyDown={handleKeyPress}/>)
      }
      <span className='trashbin'
        style={{marginLeft: "2rem", cursor: 'pointer'}} 
        onClick={deleteTodoItem}>🗑️</span>
    </div>  
  );
};

export default TodoItem;