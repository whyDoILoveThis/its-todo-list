import React, { useEffect, useState, useRef } from 'react'
import { signOut, } from 'firebase/auth'
import { auth, db } from '../../firebase'
import { useNavigate } from 'react-router-dom'
import { uid } from 'uid'
import { set, ref, onValue, remove, update } from 'firebase/database'
import plusIcon from '../../assets/icon--plus.png'
import editIcon from '../../assets/icon--edit.png'
import trashIcon from '../../assets/icon--trash.png'
import signOutIcon from '../../assets/icon--signout.png'
import './homepage.css'


const Homepage = () => {
  const [todo, setTodo] = useState('');
  const [allTodos, setAllTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUidd, setTempUidd] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const todoWrapRef = useRef(null);
  const topRef  = useRef(null);
  const updatedTodoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if(user) {
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          setAllTodos([]);
          const data = snapshot.val();
          if(data !== null) {
            Object.values(data).map(todo => {
              setAllTodos((oldArray) => [...oldArray, todo]);
            });
           }
        });
      }else if(!user){
        navigate('/')
      }
    });
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate('/');
    }).catch(err => {alert(err.message);});
  }
 
  ///read
  ///add
    const writeToDatabase = () => {
    if(todo !== ''){
      const uidd = uid();
      const timestamp = new Date().getTime();
      set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
        todo: todo,
        uidd: uidd,
        timestamp: timestamp,
      });
      setIsAdded(true);
      setTodo('');
    }
  };
  ///update
  const handleUpdate = (todo) => {
    setIsEdit(true);
    setTodo(todo.todo);
    setTempUidd(todo.uidd);
    if(topRef.current) {
      topRef.current.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    }
  };

  const handleEditConfirm = () => {
    update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`),{
      todo: todo,
      tempUidd: tempUidd,
    });
    if (updatedTodoRef.current) {
      updatedTodoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
    setTodo('');
    setIsEdit(false);
  };
  ///delete
  const handleDelete = (uid) => {
    remove(ref(db, `/${auth.currentUser.uid}/${uid}`))
  };

  /// Scroll to the bottom of the container when todos change
  useEffect(() => {
      if(isAdded) {
      if (todoWrapRef.current) {
        todoWrapRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      }
      setIsAdded(false);
    }
  }, [allTodos]);

  /// 🌟 Sort the Data 🌟
const sortedTodos = allTodos.sort((a, b) => a.timestamp - b.timestamp);

console.log(sortedTodos);
  
  return (
    <div ref={todoWrapRef}> 
    <div ref={topRef}></div>
    <h1>Todo List</h1>
      <div className="todo-input-wrap">
        <input className='todo-input' type='text' placeholder='Add todo...' value={todo} onChange={(e) => {
          setTodo(e.target.value)
        }}/>
         {
            !isEdit &&
            todo!=='' ?
            <button className='btn-add' onClick={writeToDatabase}><img src={plusIcon} alt="add" /></button>
            :
            isEdit ?
            <>
            <button className='btn-confirm' onClick={handleEditConfirm}>👍</button>
            </>
            : null
         }
      </div>
      {
        sortedTodos.map((todo, index) => (
          <div className='todo-wrap' key={index} ref={todo.uidd === tempUidd ? updatedTodoRef : null}>
            <p>{todo.todo}</p>
            <div className='todo-controls'>
            <button className='btn-update' onClick={() => handleUpdate(todo)}><img src={editIcon} alt="add" /></button>
            <button className='btn-delete' onClick={() => handleDelete(todo.uidd)}><img src={trashIcon} alt="add" /></button>
            </div>
          </div> 
        ))
      }
      <button className='btn-signout' onClick={handleSignOut}><img src={signOutIcon} alt="add" /></button>
    </div>
  )
}

export default Homepage