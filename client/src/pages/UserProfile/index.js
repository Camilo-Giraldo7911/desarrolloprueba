import axios from "axios";
import React, { Component } from "react";
import "./style.scss";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import AddItem from "../../components/AddItems";

class Profile extends Component {
  constructor(props) {
    super();

    this.state = {
      userId: "",
      email: "",
      username: "",
      isLoading: true,
      error: false,
      userType: "",
      firstName: "",
      lastName: "",
      items: [],
      itemId: "",
      showComments: false,
      modalToAddItems: false,
      modalToEditItems: false,

      itemName: "",
      description: "",
      category: "",
      itemPrice: "",
      itemStatus: "",
      itemImg: "",

      loadingAxiosRequest: false,
    };
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    const accessString = localStorage.getItem("JWT");
    if (accessString === null) {
      this.setState({
        isLoading: false,
        error: true,
      });
    } else {
      try {
        await axios
          .get("/auth/users_profile", {
            headers: { Authorization: `JWT ${accessString}` },
          })
          .then((res) => {
            // console.log(res);
            this.setState({
              userId: res.data.id,
              userType: res.data.userType,
              firstName: res.data.firstName,
              lastName: res.data.lastName,
              username: res.data.username,
              items: res.data.Items,
            });
          })
          .catch((err) => console.log(err));

        window.scrollTo(0, 1000);

        this.setState({
          isLoading: false,
          error: false,
        });
      } catch (error) {
        console.error(error.response);
        this.setState({
          error: true,
        });
      }
    }
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  deleteComment = async ({ currentTarget }) => {
    const id = currentTarget.value;
    if (
      window.confirm(
        "Esta seguro que desa borrar este comentario? Tenga en cuenta que esta accion es permanente!"
      )
    ) {
      await axios
        .delete("/auth/comments/" + id)
        .then(() => {
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  };

  modalToAddItemsOpen = async () => {
    this.setState({
      modalToAddItems: true,
    });
    console.log(this.state.userId)
  };
  
  submitChangesItems = async (e) => {
    e.preventDefault();
    const updatedItem = {
      itemName: this.state.itemName,
      description: this.state.description,
      category: this.state.category,
      itemPrice: this.state.itemPrice,
      itemStatus: this.state.itemStatus,
    };
    axios
      .put("/auth/item/" + this.state.itemId, updatedItem)
      .then(() => window.location.reload())
      .catch((err) => console.log(err));
  };

  modalToEditItemsOpen = async ({ currentTarget }) => {
    const itemId = currentTarget.value;
    if (!this.state.modalToEditItems) {
      this.setState({
        itemName: "",
        description: "",
        category: "",
        itemPrice: "",
        itemStatus: "",
        itemImg: "",
      });
    }
    this.setState({
      modalToEditItems: true,
      itemId,
      loadingAxiosRequest: true,
    });
    await axios
      .get("/auth/item/" + itemId)
      .then((res) =>
        this.setState({
          itemId: res.data.id,
          itemName: res.data.itemName,
          description: res.data.description,
          category: res.data.category,
          itemPrice: res.data.itemPrice,
          itemStatus: res.data.itemStatus,
          itemImg: res.data.itemImg,
          loadingAxiosRequest: false,
        })
      )
      .catch((err) => {
        this.setState({
          loadingAxiosRequest: false,
        });
        console.log(err);
      });
  };

  closeModal = async () => {
    await this.setState({
      modalToAddItems: false,
      modalToEditItems: false,
    });
  };

  fileUploadHandler = async () => {
    if (!this.state.itemImg) {
      return;
    }
    const itemId = this.state.itemId;
    const fd = new FormData();
    fd.append("file", this.state.itemImg);
    fd.append("upload_preset", "myswap");
    this.setState({
      loadingAxiosRequest: true,
    });

    await axios
      .post("	https://api.cloudinary.com/v1_1/myswapaplicacion/upload", fd)
      .then(async (res) => {
        let newPetImg = {
          itemImg: res.data.secure_url,
        };
        await axios
          .put("/auth/item/" + itemId, newPetImg)
          .then(() => {
            // console.log(res);
            window.location.reload();
          })
          .catch((error) => {
            console.log(error.response);
            if (error.response.status === 500 || error) {
              console.log(error);
              // this.errorOnPhotoUpload();
              this.setState({
                loadingAxiosRequest: false,
              });
            }
          });
      })
      .catch((err) => {
        this.errorOnPhotoUpload();
        this.setState({
          loadingAxiosRequest: false,
        });
        console.log(err);
      });
  };

  fileSelectedHandler = async (event) => {
    event.preventDefault();
    await this.setState({
      itemImg: event.target.files[0],
    });
    this.fileUploadHandler();
  };

  deleteItem = async ({ currentTarget }) => {
    const UserId = currentTarget.value;
    if (
      window.confirm(
        "Esta seguro que desa borrar este articulo? Tenga en cuenta que esta accion es permanente!"
      )
    ) {
      await axios
        .delete("/auth/item/" + UserId)
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  };

  render() {
    const itemsList =
      this.state.items.length > 0 ? (
        this.state.items.map((item) => {
          const commentsList =
            item.Comments.length > 0 ? (
              item.Comments.map((comment) => {
                return (
                  <div className="comment-section" key={comment.id}>
                    <p>Fecha: {comment.date}</p>
                    <p className="decription-items">
                      Comentario: {comment.comment}
                    </p>
                    <p className="comments-users-container">
                      <button
                        onClick={this.deleteComment}
                        value={comment.id}
                        className="delete-comment-btn"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                      <span className="ml-2 mr-2">{comment.userName}</span>
                      <button>
                        <i className="fas fa-user"></i> Contactar para Profesor
                      </button>
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="no-comments">No hay comentarios todavia</p>
            );
          return (
            <div className="item-container" key={item.id}>
              <button
                onClick={this.deleteItem}
                value={item.id}
                className="btn btn-danger delete-item-btn"
              >
                <i className="fas fa-trash-alt"></i>
              </button>

              <h2 className="item-title">{item.itemName}</h2>
              {item.itemImg === "" ? null : (
                <img
                  className="item-img"
                  src={item.itemImg}
                  alt="item imagen"
                />
              )}
              <p>
                Descricion Curso(s): <b>{item.description}</b>{" "}
              </p>
              <p>
                Valor Curso: <b>${item.itemPrice}</b>{" "}
              </p>
              <hr />
              <div>
                <h4 className="comments-title">Comentarios</h4>
                {commentsList}
              </div>

              <button
                value={item.id}
                onClick={this.modalToEditItemsOpen}
                className="btn edit-item-btn"
              >
                Editar Curso
              </button>
            </div>
          );
        })
      ) : (
        <p>No hay Cursos Cargados en la lista aun </p>
      );

    if (this.state.error) {
      return (
        <div
          style={{
            marginLeft: "10%",
            fontSize: "30px",
            height: "100vh",
            marginTop: "120px",
          }}
        >
          ... Problema al obtener datos de usuario. Por favor ingrese nuevamente
          <span role="img" aria-label="Face With Rolling Eyes Emoji">
            🙄
          </span>
        </div>
      );
    }
    if (this.state.isLoading) {
      return (
        <div
          style={{
            marginTop: "120px",
            marginLeft: "10%",
            fontSize: "30px",
            height: "100vh",
          }}
        >
          Cargando datos sobre los Cursos seleccionados... intente iniciar sesión nuevamente
        </div>
      );
    }

    return (
      <div style={{ marginTop: "10px", marginLeft: "60px" }}>
        <h2> 
          Bienvenido/a          
        </h2>
        <br></br>
        <button onClick={this.modalToAddItemsOpen} className="btn add-item-btn">
          Cargar Informacion <i className="fas fa-plus"></i>
        </button>
        <hr />
        <h1 className="mis-productos-title">Mi(s) Curso(s)</h1>
        <hr />
        <div className="items-wrapper">{itemsList}</div>
        <Modal
          classNames={{
            modal: "customModalToAddItems",
          }}
          open={this.state.modalToAddItems}
          onClose={this.closeModal}
          closeIcon={
            <span className="x-close-modal" onClick={this.closeModal}>
              X
            </span>
          }
        >
          <AddItem userId={this.state.userId} />
        </Modal>
        <Modal
          classNames={{
            modal: "customModalToAddItems",
          }}
          open={this.state.modalToEditItems}
          onClose={this.closeModal}
          closeIcon={
            <span className="x-close-modal" onClick={this.closeModal}>
              X
            </span>
          }
        >
          {this.state.loadingAxiosRequest ? (
            <div>
              Por favor espere... <i className="fas fa-spinner"></i>
            </div>
          ) : (
            <div>
              <img className="img-to-edit" src={this.state.itemImg} alt="" />{" "}
              <div>
                <button
                  className="btn change-photo-btn"
                  onClick={() => {
                    this.fileInput.click();
                  }}
                >
                  Cambiar Curso <i className="fas fa-camera-retro"></i>
                </button>
                <input
                  style={{ display: "none" }}
                  type="file"
                  capture="environment"
                  onChange={this.fileSelectedHandler}
                  ref={(fileInput) => (this.fileInput = fileInput)}
                />
              </div>
              <form
                className="add-items-form"
                onSubmit={this.submitChangesItems}
              >
                <input
                  className="input-add-items"
                  name="itemName"
                  onChange={this.onChangeHandler}
                  type="text"
                  placeholder="Nombre de producto"
                  defaultValue={this.state.itemName}
                />
                <textarea
                  className="input-add-items"
                  name="description"
                  onChange={this.onChangeHandler}
                  type="text"
                  placeholder="Descripcion"
                  defaultValue={this.state.description}
                />
                <input
                  className="input-add-items"
                  name="category"
                  onChange={this.onChangeHandler}
                  type="text"
                  placeholder="Categoria"
                  defaultValue={this.state.category}
                />
                <input
                  className="input-add-items"
                  name="itemPrice"
                  onChange={this.onChangeHandler}
                  type="text"
                  placeholder="Valor Curso"
                  defaultValue={this.state.itemPrice}
                />
                <input
                  className="input-add-items"
                  name="itemStatus"
                  onChange={this.onChangeHandler}
                  type="text"
                  placeholder="Status"
                  defaultValue={this.state.itemStatus}
                />
                <button className="btn-submit-addItems">
                  Modificar Contenido
                </button>
              </form>
            </div>
          )}
        </Modal>
      </div>
    );
  }
}

export default Profile;