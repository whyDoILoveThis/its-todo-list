/// 📦 Import React hooks and Firebase functions
import { useEffect, useState, useRef } from "react";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";

/// 🌈 Import icons and stylesheet
import plusIcon from "../../assets/icon--plus.png";
import editIcon from "../../assets/icon--edit.png";
import trashIcon from "../../assets/icon--trash.png";
import iconDown from "../../assets/icon--down.png";
import iconUp from "../../assets/icon--up.png";
import "./homepage.css";
import ColorSelectInput from "../ColorSelectInput";
import CustomModal from "../CustomModal";
import CodeBox from "../CodeBox";

/// 🚀 Functional component for the Homepage
const Homepage = () => {
  /// 📝 State variables for todo functionality
  const [todo, setTodo] = useState(""); /// State to manage the input field for adding todos
  const [allTodos, setAllTodos] = useState([]); /// State to store all todos
  const [selectedColor, setSelectedColor] = useState("blue");
  const [allowEdit, setAllowEdit] = useState(false);
  const [isEdit, setIsEdit] = useState(false); /// State to track if user is editing a todo
  const [tempUidd, setTempUidd] = useState(""); /// Temporary state to store the unique ID of a todo being edited
  const [isAdded, setIsAdded] = useState(false); /// State to trigger scrolling when a new todo is added

  /// 🤖 Refs for DOM elements and navigation
  const todoWrapRef = useRef(null); /// Reference to the container of all todos
  const bottomRef = useRef(null); /// Reference to the top of the page
  const updatedTodoRef = useRef(null); /// Reference to the updated todo after editing
  const navigate = useNavigate(); /// Hook for programmatic navigation
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isModalVisisble, setModalVisible] = useState(false);
  const [possibleDeleteUidd, setPossibleDeleteUidd] = useState("");
  const [loading, setLoading] = useState(false);
  const [getTodo, setGetTodo] = useState(null);

  useEffect(() => {
    setLoading(true);
    /// 🔒 Check if the user is authenticated
    auth.onAuthStateChanged((user) => {
      if (user) {
        /// 🔄 Listen for changes in user's todos
        onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
          setAllTodos([]);
          const data = snapshot.val();
          if (data !== null) {
            /// 🚀 Update allTodos state with the fetched todos
            Object.values(data).map((todo) => {
              setAllTodos((oldArray) => [...oldArray, todo]);
            });
            setLoading(false);
          } else {
            setLoading(false);
          }
        });
      } else if (!user) {
        /// 🚪 Redirect to the login page if not authenticated
        navigate("/");
      }
    });
  }, [navigate]);

  const grabTodo = (todo) => {
    setGetTodo(todo);
  };

  const passUidd = (uid) => {
    showModalForConfirmation(uid);
  };

  const showModalForConfirmation = (uid) => {
    setModalVisible(true);
    setPossibleDeleteUidd(uid);
  };

  function handleToggleModal() {
    setModalVisible(!isModalVisisble);
    setPossibleDeleteUidd("");
  }

  const modalBody = () => {
    return (
      <div style={{ color: "#fbacac" }}>
        <p className="modal-you-are">
          You are trying to DELETE:{" "}
          <span className="modal-todo-text">{getTodo}</span>
        </p>
      </div>
    );
  };

  /// 📖 Read, 📝 Add - Function to write a new todo to the database
  const writeToDatabase = () => {
    allTodos.sort((a, b) => a.order - b.order);
    const nextOrder = allTodos.length + 2;

    if (todo !== "") {
      /// 🔑 Generate unique ID and timestamp for the todo
      const uidd = uid();
      const timestamp = new Date().getTime();
      /// 📥 Write the todo to the database
      set(ref(db, `/${auth.currentUser.uid}/${uidd}`), {
        todo: todo,
        uidd: uidd,
        timestamp: timestamp,
        color: selectedColor,
        order: nextOrder,
      });
      /// 🎉 Set flag to indicate a successful addition and reset input
      setIsAdded(true);
      setTodo("");
      setSelectedColor("blue");
    }
  };

  /// ✏️ Update - Function to handle updating a todo
  const handleUpdate = (todo) => {
    /// 🚀 Enable edit mode, set todo text, and scroll to the top
    if (todo.uidd) {
      setIsEdit(true);
      setTodo(todo.todo);
      setTempUidd(todo.uidd);
      setSelectedColor(todo.color);
      setCurrentOrder(todo.order);
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }
  };
  /// 👍 Confirm Edit - Function to confirm the edit and update the database
  const handleEditConfirm = async (uid) => {
    if (todo.uidd === uid) {
      /// 🔄 Update the todo in the database, scroll to the updated todo, and reset state
      update(ref(db, `/${auth.currentUser.uid}/${tempUidd}`), {
        todo: todo,
        color: selectedColor,
        uidd: tempUidd,
        order: currentOrder,
      });
    }
    if (updatedTodoRef.current) {
      updatedTodoRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
    setTodo("");
    setIsEdit(false);
  };
  /// 🗑️ Delete - Function to handle deleting a todo
  const handleDelete = (uid) => {
    /// 🗑️ Remove the todo from the database
    console.log("delete button pressed");
    if (!isEdit) {
      showModalForConfirmation(uid);
    }
    if (isModalVisisble) {
      remove(ref(db, `/${auth.currentUser.uid}/${uid}`));
      setTempUidd("");
      setModalVisible(false);
    }
    handleDuplicateOrders(allTodos);
    navigate("/");
  };

  const updateOrder = (uidd, newOrder) => {
    // Update the order in the database
    update(ref(db, `/${auth.currentUser.uid}/${uidd}`), { order: newOrder });

    // Update the order in the local state
    setAllTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.uidd === uidd ? { ...todo, order: newOrder } : todo
      )
    );
    console.log(newOrder);
  };

  const handleMoveDown = (todo) => {
    handleDuplicateOrders(allTodos);
    const currentIndex = sortedTodos.findIndex((t) => t.uidd === todo.uidd);

    if (currentIndex < sortedTodos.length - 1) {
      const currentOrder = todo.order;
      const nextTodo = sortedTodos[currentIndex + 1];

      // Calculate the new order values
      const newOrderCurrent = nextTodo.order;
      const newOrderNext = currentOrder;

      // Update the order in the database and local state
      updateOrder(todo.uidd, newOrderCurrent);

      updateOrder(nextTodo.uidd, newOrderNext);
    }
  };

  const handleMoveUp = (todo) => {
    handleDuplicateOrders(allTodos);

    const currentIndex = sortedTodos.findIndex((t) => t.uidd === todo.uidd);

    if (currentIndex > 0) {
      const currentOrder = todo.order;
      const prevTodo = sortedTodos[currentIndex - 1];

      // Calculate the new order values
      const newOrderCurrent = prevTodo.order;
      const newOrderPrev = currentOrder;

      // Update the order in the database and local state
      updateOrder(todo.uidd, newOrderCurrent);

      updateOrder(prevTodo.uidd, newOrderPrev);
    }
  };

  function handleDuplicateOrders(todos) {
    // Step 2: Handle duplicates
    todos.forEach((todo, index) => {
      todos.forEach((todo, index) => {
        todo.order = 0;
        todo.order = index;
        todo.order = 0;
        todo.order = index;
      });
      todo.order = 0;
      todo.order = index;
      todo.order = 0;
      todo.order = index;
    });

    // Step 3: Update state
    // Assuming you have a state update function like setTodos
    setAllTodos(todos);
    writeToDatabase();
  }

  /// ⏬ Scroll to the bottom of the container when todos change
  useEffect(() => {
    if (isAdded) {
      handleDuplicateOrders(allTodos);
      if (todoWrapRef.current) {
        /// 🔄 Scroll to the end of the todo container
        todoWrapRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
      /// 🔄 Reset the flag after scrolling
      setIsAdded(false);
    }
  }, [allTodos, isAdded]);

  /// 🌟 Sort the Data - Sort todos by timestamp
  const sortedTodos = allTodos.sort((a, b) => a.order - b.order);

  console.log(sortedTodos);

  /// 🎨 Return the JSX for the Homepage component
  return (
    <div className="todo" ref={todoWrapRef}>
      {isModalVisisble && (
        <CustomModal
          heading="❗❗Irreversible❗❗"
          body={modalBody()}
          deleteText={"delete"}
          keepText={"keep"}
          handleClose={() => handleToggleModal}
          handleDelete={() => handleDelete(possibleDeleteUidd)}
        />
      )}
      {/* 📌 Todo List Header */}
      <h1>Todo List</h1>
      {/* 📋 Todo List */}
      {loading ? (
        <>
          <div className="skeleton"></div>
          <div className=" skeleton"></div>
          <div className=" skeleton"></div>
          <div className=" skeleton"></div>
        </>
      ) : (
        sortedTodos.map((todo, index) => (
          <div
            className={`todo-wrap color-text color__${todo.color}`}
            key={index}
            ref={todo.uidd === tempUidd ? updatedTodoRef : null}
          >
            {todo.color !== "code" ? (
              <p>{todo.todo}</p>
            ) : (
              <CodeBox language="jsx" code={todo.todo} />
            )}
            {/* 🛠️ Todo Controls */}

            <div
              className={`todo-controls ${
                allowEdit
                  ? "todo-controls-visible"
                  : "todo-controls-not-visible"
              }`}
            >
              <button
                disabled={isEdit}
                className={`btn btn-move-up ${isEdit ? "btn-disabled" : null}`}
                onClick={() => handleMoveUp(todo)}
              >
                <img src={iconUp} alt="up" />
              </button>
              <button
                disabled={isEdit}
                className={`btn btn-move-down ${
                  isEdit ? "btn-disabled" : null
                }`}
                onClick={() => handleMoveDown(todo)}
              >
                <img src={iconDown} alt="down" />
              </button>
              {/* ✏️ Edit Todo Button */}
              <button
                className="btn btn-update"
                onClick={() => handleUpdate(todo)}
              >
                <img src={editIcon} alt="edit" />
              </button>
              {/* 🗑️ Delete Todo Button */}

              <button
                className={`btn btn-delete ${isEdit ? "btn-disabled" : null}`}
                disabled={isEdit}
                onClick={() => {
                  grabTodo(todo.todo);
                  passUidd(todo.uidd);
                }}
              >
                <img src={trashIcon} alt="delete" />
              </button>
            </div>
          </div>
        ))
      )}
      {/* 📝 Todo Input Section */}
      <ColorSelectInput
        todo={todo}
        setTodo={setTodo}
        setAllowEdit={setAllowEdit}
        allowEdit={allowEdit}
        isEdit={isEdit}
        writeToDatabase={writeToDatabase}
        plusIcon={plusIcon}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        handleEditConfirm={handleEditConfirm}
      />

      <div ref={bottomRef} style={{ marginTop: "8rem" }}></div>
    </div>
  );
};

export default Homepage;
