import React, { Component , useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/font-awesome/css/font-awesome.min.css'; 
import '../App.css';
import { Switch, Route } from "react-router-dom";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";
import AreaService from "../services/area.service";
import BusinessService from "../services/business.service";

import {QuanOption, PhuongOption} from "./area-option.component";
import BusinessOption from "./business-type-option.component";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

var tableHeader = ["Tài khoản", "Họ tên", "Khu vực", "Email"];

export default class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      showAdd: false,
      showEdit: false,
      edittingUser: undefined,
    };
  }

  componentWillMount() {
    if (!AuthService.getCurrentUser())  window.location.href = "/login";
    if (UserService.auth().displayAction && !tableHeader.includes("Sửa/Xóa")) tableHeader.push("Sửa/Xóa");
  }

  componentDidMount() {
    UserService.getUsers().then(
      response => {
        this.setState({
          content: response.statusText
        });
        this.setState({
          data: response.data.filter(u => parseInt(u.id_area / 100000) == parseInt(AuthService.getCurrentUser().id_area / 100000)).filter(u1 => !u1.is_manager)
        });
        console.log(response.data);
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });

        // if (error.response && error.response.status === 401) {
        //   EventBus.dispatch("logout");
        // }
      }
    );
  }

  handleClickDelete = (id) => {
    console.log(id);
    UserService.deleteUser(id).then((res) => {
      this.componentDidMount();
    });
  }

  remove = (user) => {
    console.log(user);
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Đồng ý xóa?</h1>
            <p>Bạn muốn xóa tài khoản này?</p>
            <div style={{display: 'flex', justifyContent: 'space-around'}}>
              <button className = "btn btn-primary" onClick={() => {this.handleClickDelete(user.username); onClose();}}>Có</button>
              <button className = "btn btn-danger" onClick={onClose}>Không</button>
            </div>
          </div>
        );
      }
    });
  }

  actions(user) {
    return UserService.auth().displayAction? (
      <td>
        <button
              className="btn btn-warning my-btn-action" style={{padding: '5px'}}
              onClick={() => {
                this.setState({edittingUser: user});
                this.setState({showEdit: true});
              }}
            >
              <span className="fa fa-pencil"></span> {/* Button edit */}
            </button>
            &nbsp;
            <button
              className="btn btn-danger my-btn-action" style={{padding: '5px'}}
              onClick={() => this.remove(user)}
            >
              <span className="fa fa-trash"></span>
            </button>
      </td>
    ) : null;
  }

  renderContent() {
    return (
      <div className="container">
        <table className="table table-bordered table-striped table-responsive-stack app-table"  id="tableOne">
          <thead className="thead-dark">
            <tr>{tableHeader.map((h, i) => {
              return <th key={i} className = "header-table">{h}</th> 
            })}
            </tr>
          </thead>
          <tbody>
            {
              this.state.data.map((user, index) => {
                const {username, password, last_name, first_name, is_manager, id_area, email} = user;
                return <tr key = {username}>
                  <td>{username}</td>
                  <td>{last_name} {first_name}</td>
                  <td>{AreaService.idToArea(id_area)}</td>
                  <td>{email}</td>
                  {this.actions(user)}
                </tr>
              })
            }
          </tbody>
        </table>
        <div className=""></div>
      </div>
    );
  }

  mainView = () => {
    console.log(this.state.data);
    return (
      <>
      <h3 style={{textAlign: 'center'}}>QUẢN LÝ CHUYÊN VIÊN</h3>
      {(this.state.data && this.state.data.length > 0)? this.renderContent() : 
        <div className="jumbotron">
          <div>Không có tài khoản chuyên viên nào!</div>
          <div>Network: {this.state.content} </div>
        </div>}
        <div className="add-field">
          <button className="btn btn-success" onClick={() => {this.setState({showAdd: true})}}><span className="fa fa-plus"/> Thêm</button>
        </div>
      </>
    )
  }

  addView = () => {
    return (
      <AddView quan={parseInt(AuthService.getCurrentUser().id_area / 100000)} cancelAdd={() => {this.setState({showAdd: false}); this.componentDidMount()}}/>
    )
  }

  editView = () => {
    console.log(this.state.edittingUser);
    return (
      <EditView quan={parseInt(AuthService.getCurrentUser().id_area / 100000)} old={this.state.edittingUser} cancelEdit={() => {this.setState({showEdit: false}); this.componentDidMount();}} />
    )
  }

  render() {
    return (
      <div className="container">
        {this.state.showAdd? this.addView() : null}
        {this.state.showEdit? this.editView() : null}
        {!(this.state.showAdd || this.state.showEdit)? this.mainView() : null}
      </div>
    );
  }
}

function AddView(props){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [last_name, setLastName] = useState('');
  const [first_name, setFirstName] = useState('');
  const [id_area, setIDArea] = useState('');
  const [email, setEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [note, setNote] = useState(undefined);
  const [phuong, setPhuong] = useState('');

  const accept = () => {
    const user = {
      username: username,
      password: password,
      password2: password,
      last_name: last_name,
      first_name: first_name,
      is_manager: false,
      id_area: parseInt(props.quan) * 100000 + parseInt(phuong),
      email: email,
    }
    console.log(user);
    setAdding(true);
    UserService.createUser(user).then((res) => {
      console.log(res);
      setAdding(false);
      props.cancelAdd();
      //window.location.reload();
    }).catch((err) => {
      console.log(err);
      setNote(err.response.data);
      console.log(err.response.data);
      setAdding(false);
    })
  }

  return (
    <div className="jumbotron" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <h3 style={{textAlign: 'center'}}>THÊM TÀI KHOẢN</h3>
      <form className="form">
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Tài khoản</div>
          <input type="text" className="form-control form-input" placeholder="Tài khoản" value={username} onChange={(e) => setUsername(e.target.value)}/>
          {note? <div className="tiny-alert" role="alert">{note.username}</div> : null}
        </div>
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Mật khẩu</div>
          <input type="text" className="form-control form-input" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)}/>
          {note? <div className="tiny-alert" role="alert">{note.password}</div> : null}
        </div>
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className=" mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Khu vực</div>
          <PhuongOption areaId = {props.quan} choose={(phuongId) => {setPhuong(phuongId); console.log(phuongId);}}/>
          {note? <div className="tiny-alert" role="alert">{note.id_area}</div> : null}
        </div>
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Họ</div>
          <input type="text" className="form-control form-input" placeholder="Họ" value={last_name} onChange={(e) => setLastName(e.target.value)}/>
          {note? <div className="tiny-alert" role="alert">{note.last_name}</div> : null}
        </div>
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Tên</div>
          <input type="text" className="form-control form-input" placeholder="Tên" value={first_name} onChange={(e) => setFirstName(e.target.value)}/>
          {note? <div className="tiny-alert" role="alert">{note.first_name}</div> : null}
        </div>
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Email</div>
          <input type="text" className="form-control form-input" placeholder="Email" value={email} onChange={(e) => setEmail (e.target.value)}/>
          {note? <div className="tiny-alert" role="alert">{note.email}</div> : null}
        </div>
      </form>
      <div className="form-group my-form-group " style={{display: 'flex', justifyContent: 'space-around'}}>
        <button className = "btn btn-success" onClick={accept}>Đồng ý</button>
        <button className = "btn btn-danger" onClick={props.cancelAdd}>Hủy</button>
      </div>
    </div>
  );
}

function EditView(props){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [last_name, setLastName] = useState('');
  const [first_name, setFirstName] = useState('');
  const [id_area, setIDArea] = useState('');
  const [email, setEmail] = useState('');
  const [editting, setEditting] = useState(false);
  const [note, setNote] = useState(undefined);
  const [phuong, setPhuong] = useState('');

  const save = () => {
    const user = {
      username: username? username : props.old.username,
      password: password? password : props.old.password,
      password2: password? password : props.old.password,
      last_name: last_name? last_name : props.old.last_name,
      first_name: first_name? first_name : props.old.first_name,
      is_manager: false,
      id_area: (props.quan && phuong)? AreaService.areaId(props.quan, phuong) : parseInt(props.old.id_area),
      email: email? email: props.old.email,
    }
    console.log(user);
    setEditting(true);
    UserService.updateUser(user).then((res) => {
      setEditting(false);
      props.cancelEdit();
    }).catch((err) => {
      console.log(err);
    })
    // UserService.deleteUser(props.old.username).then((res) => {
    //   console.log(res);
    //   console.log(user);
    //   setEditting(false);
    //   if (!editting) {
    //     UserService.createUser(user).then((res) => {
    //       console.log(res);
    //       props.cancelEdit();
    //     }).error((err) => {
    //       console.log(err);
    //       setNote(err.response.data);
    //     })
    //   }
    // }).catch((err) => {
    //   console.log(err);
    //   //setNote(err.response.data);
    //   // console.log(err.response.data);
    //   setEditting(false);
    // })
  }

  return (
    <div className="jumbotron" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <h3 style={{textAlign: 'center'}}>CẬP NHẬT TÀI KHOẢN</h3>
      <div style={{display: 'flex'}}>
        <form className="form">
          <div className="form-group my-form-group form flex-row sp-between input-div div-center">
            <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Tài khoản</div>
            <input type="text" className="form-control form-input" placeholder={props.old.username} disabled/>
          </div>
          <div className="form-group my-form-group form flex-row sp-between input-div div-center">
            <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Mật khẩu</div>
            <input type="text" className="form-control form-input" placeholder="********" disabled/>
          </div>
          <div className="form-group my-form-group form flex-row sp-between input-div div-center">
            <div className=" mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Khu vực</div>
            <input type="text" className="form-control form-input" placeholder={AreaService.idToArea(props.old.id_area)} disabled/>
          </div>
          <div className="form-group my-form-group form flex-row sp-between input-div div-center">
            <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Họ</div>
            <input type="text" className="form-control form-input" placeholder={props.old.last_name} disabled/>
          </div>
          <div className="form-group my-form-group form flex-row sp-between input-div div-center">
            <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Tên</div>
            <input type="text" className="form-control form-input" placeholder={props.old.first_name} disabled/>
          </div>
          <div className="form-group my-form-group form flex-row sp-between input-div div-center">
            <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Email</div>
            <input type="text" className="form-control form-input" placeholder={props.old.email} disabled/>
          </div>
        </form>
        <div className="into">
          <span className="fa fa-arrow-right"/>
        </div>
        <div>
          <form className="form">
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <input type="text" className="form-control form-input" placeholder={props.old.username} value={props.old.username} disabled/>
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <input type="text" className="form-control form-input" placeholder="Mật khẩu mới" value={password} onChange={(e) => setPassword(e.target.value)}/>
              {note? <div className="tiny-alert" role="alert">{note.password}</div> : null}
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <PhuongOption areaId = {props.quan} choose={(phuongId) => {setPhuong(phuongId); console.log(phuongId);}}/>
              {note? <div className="tiny-alert" role="alert">{note.id_area}</div> : null}
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <input type="text" className="form-control form-input" placeholder={props.old.last_name} value={last_name} onChange={(e) => setLastName(e.target.value)}/>
              {note? <div className="tiny-alert" role="alert">{note.last_name}</div> : null}
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <input type="text" className="form-control form-input" placeholder={props.old.first_name} value={first_name} onChange={(e) => setFirstName(e.target.value)}/>
              {note? <div className="tiny-alert" role="alert">{note.first_name}</div> : null}
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <input type="text" className="form-control form-input" placeholder={props.old.email} value={email} onChange={(e) => setEmail(e.target.value)}/>
              {note? <div className="tiny-alert" role="alert">{note.email}</div> : null}
            </div>
          </form>
        </div>
      </div>
      <div className="form-group my-form-group " style={{display: 'flex', justifyContent: 'space-around'}}>
        <button className = "btn btn-success" onClick={save}>Lưu</button>
        <button className = "btn btn-danger" onClick={props.cancelEdit}>Hủy</button>
      </div>
    </div>
  );
}

