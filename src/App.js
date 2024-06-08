
import './App.css';
import { Fragment, useEffect, useState } from 'react';
import TodoItem from './components/todoItem.jsx';
import React from 'react';


function App() {
  const [todoItems, setTodoItems] = useState(null);

  useEffect(() => {
    // do something on load
    console.log ("Hey, i've loaded up");

    if (!todoItems) {
      fetch('http://localhost:8080/find-all-todos')
              .then((response) => response.json())
              .then (data => {
                    console.log ("Todo items list: ",data);
                    setTodoItems(data);
      });
    }

  }, [todoItems]);

  function addNewTodoItem () {
    const todoData = {
      "text": '',
    };

    fetch('http://localhost:8080/create-todo', {
      headers: {
        'content-type':'application/json'
      },
      method: 'POST',
      body: JSON.stringify(todoData),
    }).then ((response) => response.json() ).then ((data) => {
      setTodoItems([...todoItems, data]);
      hideContainer();
    });
  }

  function HandleDeleteTodoItem (item) {
    const updatedTodoItems = todoItems.filter((aTodoItem) => aTodoItem.id !== item.id );
    console.log('updated todo items', updatedTodoItems);
    setTodoItems ([...updatedTodoItems]);
  }

  const [isContainerVisible, setContainerVisible] = useState(true);

  const hideContainer = () => {
    setContainerVisible(false);
  };


  //ternary operator
  return ( <div className='container'>
      <div className='containerHeader'> 
        <p className='headerText'> Заметки </p>
      </div>
      <div className='todoContainer'>
        <div className='theList'>
          <button className= "addItemButton" onClick={addNewTodoItem} >
          <span style={{ verticalAlign: 'middle' }}>
          <svg className='plus' width="13" height="13">
            <path fill="currentColor" fillRule="evenodd" d="M6 6V.5a.5.5 0 0 1 1 0V6h5.5a.5.5 0 1 1 0 1H7v5.5a.5.5 0 1 1-1 0V7H.5a.5.5 0 0 1 0-1H6z"></path>
          </svg>
          </span> 
            Добавить задачу
          </button>
          {isContainerVisible && (
                  <div className='itemsEmptiness'>
                    {todoItems && todoItems.length === 0 ? (
                      <>
                        <div className='greenLeafContainer'>
                          <img /*src="/path/to/your/image.png" alt="green leaf"*/ />🍃
                        </div>
                        <div className='textMessage'>Список дел пуст</div>
                      </>
                    ) : null}
                  </div>
                )}
          <div className='newTodoItem'>
          {todoItems 
            ? todoItems.map((todoItem) => {
              return <TodoItem 
                key={todoItem.id} 
                data = {todoItem} 
                emitDeleteTodoItem={HandleDeleteTodoItem}/>;
            })
            :<div className='loadingMessage'>
              loading data...
              </div> 
            }
          </div> 
        </div>
      </div>
   </div>
  );
}

export default App;
