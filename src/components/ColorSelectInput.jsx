import plusIcon from "../assets/icon--plus.png";
import editIcon from "../assets/icon--edit.png";
import signOutIcon from "../assets/icon--signout.png";
import PropTypes from "prop-types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CustomModal from "./CustomModal";

ColorSelectInput.propTypes = {
  todo: PropTypes.string.isRequired,
  setTodo: PropTypes.func.isRequired,
  setAllowEdit: PropTypes.func.isRequired,
  allowEdit: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool.isRequired,
  writeToDatabase: PropTypes.func.isRequired,
  selectedColor: PropTypes.string.isRequired,
  setSelectedColor: PropTypes.func.isRequired,
  handleEditConfirm: PropTypes.func.isRequired,
};

function ColorSelectInput({
  todo,
  setTodo,
  setAllowEdit,
  allowEdit,
  isEdit,
  writeToDatabase,
  selectedColor,
  setSelectedColor,
  handleEditConfirm,
}) {
  const navigate = useNavigate(); /// Hook for programmatic navigation
  const [modalVisible, setModalVisible] = useState(false);
  /// 🚀 Function to handle user sign-out

  const showModalForConfirmation = () => {
    setModalVisible(true);
  };

  function handleToggleModal() {
    setModalVisible(!modalVisible);
  }

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  return (
    <div className={`todo-input-wrap todo-input__color--${selectedColor}`}>
      {modalVisible && (
        <div className="signout-modal">
          <CustomModal
            heading={"👋Signing Out"}
            body={"Are you sure you want to procede??"}
            footer={""}
            deleteText={"Sign Out"}
            keepText={"Stay"}
            handleClose={() => handleToggleModal}
            handleDelete={() => handleSignOut()}
          />
        </div>
      )}
      <input
        className={`todo-input todo-input__color--${todo.color}`}
        type="text"
        placeholder="Add to notes...."
        value={todo}
        onChange={(e) => {
          setTodo(e.target.value);
        }}
      />
      {!isEdit && todo !== "" ? (
        /// ➕ Add Todo Button
        <>
          <button
            className="btn-add"
            onClick={() => {
              writeToDatabase();
            }}
          >
            <img src={plusIcon} alt="add" />
          </button>
        </>
      ) : isEdit ? (
        /// 👍 Confirm Edit Button
        <>
          <button
            className="btn-confirm"
            onClick={() => handleEditConfirm(todo.uidd)}
          >
            👍
          </button>
        </>
      ) : null}
      <div className="color-selection-wrap">
        {/* 🚪 Sign Out Button */}
        <button
          className="btn-signout"
          onClick={() => {
            showModalForConfirmation();
          }}
        >
          <img src={signOutIcon} alt="sign out" />
        </button>
        <div className="btn-add-wrap">
          <button
            className="btn btn-add btn-add__red"
            onClick={() => {
              setSelectedColor("red");
            }}
          >
            Red
          </button>
          <button
            className="btn btn-add btn-add__orange"
            onClick={() => {
              setSelectedColor("orange");
            }}
          >
            <p>Orange</p>
          </button>
          <button
            className="btn btn-add btn-add__green"
            onClick={() => {
              setSelectedColor("green");
            }}
          >
            <p>Green</p>
          </button>
          <button
            className="btn btn-add btn-add__blue"
            onClick={() => {
              setSelectedColor("blue");
            }}
          >
            <p>Blue</p>
          </button>
          <button
            className="btn btn-add btn-add__section"
            onClick={() => {
              setSelectedColor("section");
            }}
          >
            <p>Section</p>
          </button>
        </div>
        <div className="btn-edit-wrap">
          <button
            className="btn btn-edit "
            onClick={() => {
              setAllowEdit(!allowEdit);
            }}
          >
            <img src={editIcon} alt="add" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ColorSelectInput;
