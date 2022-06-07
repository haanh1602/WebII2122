import React, { Component , useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/font-awesome/css/font-awesome.min.css'; 
import '../App.css';
import { Switch, Route } from "react-router-dom";

import CertificateService from "../services/certificate.service";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";
import AreaService from "../services/area.service";
import BusinessService from "../services/business.service";
import MyDatePicker from "./date-picker.component";

import {QuanOption, PhuongOption} from "./area-option.component";
import BusinessOption from "./business-type-option.component";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

var tableHeader = ["Series", "Loại hình kinh doanh", "Ngày kiểm tra", "Ngày hết hạn"];

export default class Certificate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      showAdd: false,
      showEdit: false,
      edittingObj: undefined,
    };
  }

  componentWillMount() {
    if (!AuthService.getCurrentUser())  window.location.href = "/login";
    if (CertificateService.auth().displayAction && !tableHeader.includes("Sửa/Xóa")) tableHeader.push("Sửa/Xóa");
  }

  componentDidMount() {
    CertificateService.getCertificates().then(
      response => {
        this.setState({
          content: response.statusText
        });
        this.setState({
          data: response.data
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
    CertificateService.deleteCertificate(id).then((res) => {
      this.componentDidMount();
    });
  }

  remove = (certificate) => {
    console.log(certificate);
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Đồng ý xóa?</h1>
            <p>Bạn muốn xóa chứng nhận này?</p>
            <div style={{display: 'flex', justifyContent: 'space-around'}}>
              <button className = "btn btn-primary" onClick={() => {this.handleClickDelete(certificate.id); onClose();}}>Có</button>
              <button className = "btn btn-danger" onClick={onClose}>Không</button>
            </div>
          </div>
        );
      }
    });
  }

  actions(p) {
    return CertificateService.auth().displayAction? (
      <td>
        <button
              className="btn btn-warning my-btn-action" style={{padding: '5px'}}
              onClick={() => {
                this.setState({edittingObj: p});
                this.setState({showEdit: true});
              }}
            >
              <span className="fa fa-pencil"></span> {/* Button edit */}
            </button>
            &nbsp;
            <button
              className="btn btn-danger my-btn-action" style={{padding: '5px'}}
              onClick={() => this.remove(p)}
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
                this.state.data.map((d, index) => {
                  var {id, id_business_type, issued_date, expired_date, series} = d;
                  return <tr key = {id}>
                    <td>{series}</td>
                    <td>{BusinessService.getBusiness(id_business_type)}</td>
                    <td>{issued_date}</td>
                    <td>{expired_date}</td>
                    {this.actions(d)}
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
      {(this.state.data && this.state.data.length > 0)? this.renderContent() : 
        <div className="jumbotron">
          <div>Không có chứng nhận nào!</div>
          <div>Network: {this.state.content} </div>
        </div>}
        <div className="add-field">
          <button className="btn btn-success" onClick={() => {this.setState({showAdd: true})}}><span className="fa fa-plus"/> Thêm</button>
        </div>
      </>
    )
  }

  addView = () => {
    console.log("Add view")
    return (
      <AddView cancelAdd={() => {this.setState({showAdd: false}); this.componentDidMount()}}/>
    )
  }

  editView = () => {
    console.log(this.state.edittingObj);
    return (
      <EditView old = {this.state.edittingObj} cancelEdit={() => {this.setState({showEdit: false}); this.componentDidMount();}} />
    )
  }

  render() {
    return (
      <div className="container">
        {this.state.showAdd? this.addView() : null}
        {this.state.showEdit? this.editView() : null}
        {!(this.state.showAdd || this.state.showEdit)? this.mainView() : null}
        {/* <PhuongOption areaId="1023"/> */}
      </div>
    );
  }
}

function AddView(props){
  const [id_business_type, setId_business_type] = useState('');
  const [issued_date, setIssued_date] = useState('');
  const [expired_date, setExpired_date] = useState('');
  const [series, setSeries] = useState('');
  const [adding, setAdding] = useState(false);
  const [note, setNote] = useState(undefined);

  const randomSeries = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  } 

  const accept = () => {
    const obj = {
      id_business_type: id_business_type,
      issued_date: issued_date,
      expired_date: expired_date,
      series: randomSeries(10)
    }
    console.log(obj);
    setAdding(true);
    CertificateService.createCertificate(obj).then((res) => {
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
      <h3 style={{textAlign: 'center'}}>THÊM CƠ SỞ</h3>
      <form className="form">
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Kinh doanh</div>
          <BusinessOption choose={(businessTypeId) => {setId_business_type(businessTypeId)}} />
          {note? <div className="tiny-alert" role="alert">{note.id_business_type}</div> : null}
        </div>
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className=" mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Ngày kiểm tra</div>
          <MyDatePicker onChange={(date) => setIssued_date(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate())}/>
          {note? <div className="tiny-alert" role="alert">{note.issued_date}</div> : null}
        </div>
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Hiệu lực</div>
          <MyDatePicker onChange={(date) => setExpired_date(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate())}/>
          {note? <div className="tiny-alert" role="alert">{note.expired_date}</div> : null}
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
  // const [name, setName] = useState('');
  // const [area, setArea] = useState('');
  // const [address, setAddress] = useState('');
  // const [business, setBusiness] = useState('');
  // const [certificate, setCertificate] = useState('');
  // const [phone, setPhone] = useState('');
  // const [editting, setEditting] = useState(false);
  // const [note, setNote] = useState(undefined);
  // const [quan, setQuan] = useState('');
  // const [phuong, setPhuong] = useState('');

  // const save = () => {
  //   const obj = {
  //     name: name? name : props.old.name,
  //     address: address? address : props.old.address,
  //     phone_number: phone? phone : props.old.phone_number,
  //     id_area: (quan && phuong)? AreaService.areaId(quan, phuong) : parseInt(props.old.id_area),
  //     id_business_type: business? parseInt(business) : parseInt(props.old.id_business_type),
  //     id_certificate: parseInt(certificate),
  //   }
  //   console.log(obj);
  //   setEditting(true);
  //   CertificateService.deleteCertificate(props.old.id).then((res) => {
  //     setEditting(false);
  //     if (!editting) {
  //       CertificateService.createCertificate(obj).then((res) => {
  //         props.cancelEdit();
  //       })
  //     }
  //   }).catch((err) => {
  //     console.log(err);
  //     setNote(err.response.data);
  //     console.log(err.response.data);
  //     setEditting(false);
  //   })
  // }

  return (
    <div className="jumbotron" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      {/* <h3 style={{textAlign: 'center'}}>CẬP NHẬT CƠ SỞ</h3>
      <div style={{display: 'flex'}}>
        <div>
          <form className="form">
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Tên</div>
              <input type="text" className="form-control form-input" value={props.old.name} disabled/>
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <div className=" mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Khu vực</div>
              <input type="text" className="form-control form-input" value={AreaService.idToArea(props.old.id_area)} disabled/>
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Địa chỉ</div>
              <input type="text" className="form-control form-input"  value={props.old.address} disabled/>
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Kinh doanh</div>
              <input type="text" className="form-control form-input" value={props.old.id_business_type} disabled/>
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Chứng nhận</div>
              <input type="text" className="form-control form-input" value={props.old.id_certificate? props.old.id_certificate : "None"} disabled/>
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Điện thoại</div>
              <input type="text" className="form-control form-input" value={props.old.phone_number} disabled/>
            </div>
          </form>
        </div>
        <div className="into">
          <span className="fa fa-arrow-right"/>
        </div>
        <div>
          <form className="form">
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <input type="text" className="form-control form-input" placeholder={props.old.name} value={name} onChange={(e) => setName(e.target.value)}/>
              {note? <div className="tiny-alert" role="alert">{note.name}</div> : null}
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
                <QuanOption choose={(quanId) => {
                  setQuan(quanId);
                  console.log(quanId);
                }}/>
                <PhuongOption areaId = {quan} choose={(phuongId) => {setPhuong(phuongId); console.log(phuongId);}}/>
              {note? <div className="tiny-alert" role="alert">{note.id_area}</div> : null}
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <input type="text" className="form-control form-input" placeholder={props.old.address} value={address} onChange={(e) => setAddress(e.target.value)}/>
              {note? <div className="tiny-alert" role="alert">{note.address}</div> : null}
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <BusinessOption choose={(businessTypeId) => {
                setBusiness(businessTypeId);
              }}/>
              {note? <div className="tiny-alert" role="alert">{note.id_business_type}</div> : null}
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <input type="text" className="form-control form-input" placeholder={props.old.certificate} value={certificate} onChange={(e) => setCertificate(e.target.value)}/>
              {note? <div className="tiny-alert" role="alert">{note.certificate}</div> : null}
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <input type="text" className="form-control form-input" placeholder={props.old.phone_number} value={phone} onChange={(e) => setPhone(e.target.value)}/>
              {note? <div className="tiny-alert" role="alert">{note.phone_number}</div> : null}
            </div>
          </form>
        </div>
      </div>
      <div className="form-group my-form-group " style={{display: 'flex', justifyContent: 'space-around'}}>
        <button className = "btn btn-success" onClick={save}>Lưu</button>
        <button className = "btn btn-danger" onClick={props.cancelEdit}>Hủy</button>
      </div> */}
    </div>
  );
}

