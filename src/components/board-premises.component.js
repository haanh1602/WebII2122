import React, { Component , useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/font-awesome/css/font-awesome.min.css'; 
import '../App.css';
import { Switch, Route } from "react-router-dom";

import PremisesService from "../services/premises.service";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";
import AreaService from "../services/area.service";
import BusinessService from "../services/business.service";
import InspectionService from "../services/inspection.service";
import CertificateService from "../services/certificate.service";
import MyDatePicker from "./date-picker.component";

import {QuanOption, PhuongOption} from "./area-option.component";
import BusinessOption from "./business-type-option.component";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

var tableHeader = ["Tên cơ sở", "Địa chỉ", "Khu vực", "Kinh doanh", "Chứng nhận", "Điện thoại"];

export default class Premises extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      inspections: [],
      certificates: [],
      showAdd: false,
      showEdit: false,
      showPremise: false,
      selectPremise: undefined,
      edittingPremise: undefined,
    };
  }

  componentWillMount() {
    if (!AuthService.getCurrentUser())  window.location.href = "/login";
    if (PremisesService.auth().displayAction && !tableHeader.includes("Sửa/Xóa")) tableHeader.push("Sửa/Xóa");
  }

  componentDidMount() {
    PremisesService.getPremises().then(
      response => {
        this.setState({
          content: response.statusText
        });
        this.setState({
          data: response.data.filter((p) => 
            AuthService.getCurrentUser().is_manager? 
            parseInt(AuthService.getCurrentUser().id_area / 100000) == parseInt(p.id_area / 100000) :
            parseInt(AuthService.getCurrentUser().id_area % 100000) == parseInt(p.id_area % 100000)
          )
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
        if (error.response.status == 401) {
          AuthService.logout();
          window.location.href = "/login";
          return;
        }
        // if (error.response && error.response.status === 401) {
        //   EventBus.dispatch("logout");
        // }
      }
    );
    InspectionService.getInspections().then((res) => {
      this.setState({inspections: res.data});
    });
    CertificateService.getCertificates().then((res) => {
      this.setState({certificate: res.data});
    })
  }

  handleClickDelete = (id) => {
    console.log(id);
    PremisesService.deletePremise(id).then((res) => {
      this.componentDidMount();
    });
  }

  remove = (premise) => {
    console.log(premise);
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Đồng ý xóa?</h1>
            <p>Bạn muốn xóa cơ sở này?</p>
            <div style={{display: 'flex', justifyContent: 'space-around'}}>
              <button className = "btn btn-primary" onClick={() => {this.handleClickDelete(premise.id); onClose();}}>Có</button>
              <button className = "btn btn-danger" onClick={onClose}>Không</button>
            </div>
          </div>
        );
      }
    });
  }

  actions(premise) {
    return PremisesService.auth().displayAction? (
      <td>
        <button
          className="btn btn-warning my-btn-action" style={{padding: '5px'}}
          onClick={() => {
            this.setState({showPremise: false});
            this.setState({edittingPremise: premise});
            this.setState({showEdit: true});
          }}
        >
          <span className="fa fa-pencil"></span> {/* Button edit */}
        </button>
        &nbsp;
        <button
          className="btn btn-danger my-btn-action" style={{padding: '5px'}}
          onClick={() => {this.setState({showPremise: false});this.remove(premise)}}
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
                this.state.data.map((premise, index) => {
                  premise.phone_number = (premise.phone_number.toString().charAt(0) == '0')? premise.phone_number : "0" + premise.phone_number;
                  var {address, id, id_area, id_business_type, id_certificate, name, phone_number} = premise;
                  return <tr key = {id} className="my-tr">
                    <td onClick={() => {this.setState({selectPremise: premise}); this.setState({showPremise: true})}}>{name}</td>
                    <td onClick={() => {this.setState({selectPremise: premise}); this.setState({showPremise: true})}}>{address}</td>
                    <td onClick={() => {this.setState({selectPremise: premise}); this.setState({showPremise: true})}}>{AreaService.idToPhuong(id_area).name_with_type}</td>
                    <td onClick={() => {this.setState({selectPremise: premise}); this.setState({showPremise: true})}}>{BusinessService.getBusiness(id_business_type)}</td>
                    <td onClick={() => {this.setState({selectPremise: premise}); this.setState({showPremise: true})}}>{id_certificate? id_certificate : "Không có"}</td>
                    <td onClick={() => {this.setState({selectPremise: premise}); this.setState({showPremise: true})}}>{phone_number}</td>
                    {this.actions(premise)}
                  </tr>
                })
              }
            </tbody>
          </table>
          <div className=""></div>
        </div>
      );
  }

  getPremisesHasCert() {

  }

  mainView = () => {
    console.log(this.state.data);
    return (
      <>
      <h3 style={{textAlign: 'center'}}>QUẢN LÝ CƠ SỞ</h3>
      {(this.state.data && this.state.data.length > 0)? this.renderContent() : 
        <div className="jumbotron">
          <div>Không có cơ sở nào!</div>
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
      <AddView quan={AuthService.getCurrentUser().id_area / 100000} cancelAdd={() => {this.setState({showAdd: false}); this.componentDidMount()}}/>
    )
  }

  editView = () => {
    console.log(this.state.edittingPremise);
    return (
      <EditView old = {this.state.edittingPremise} cancelEdit={() => {this.setState({showEdit: false}); this.componentDidMount();}} />
    )
  }

  infoView = () => {
    return (
      <InfoView old = {this.state.selectPremise} inspections = {this.state.inspections} back={() => {this.setState({showPremise: false}); this.componentDidMount();}} />
    )
  }

  render() {
    return (
      <div className="container">
        {this.state.showAdd? this.addView() : null}
        {this.state.showEdit? this.editView() : null}
        {this.state.showPremise? this.infoView() : null}
        {!(this.state.showAdd || this.state.showEdit || this.state.showPremise)? this.mainView() : null}
        {/* <PhuongOption areaId="1023"/> */}
      </div>
    );
  }
}

function AddView(props){
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [business, setBusiness] = useState('');
  const [certificate, setCertificate] = useState('');
  const [phone, setPhone] = useState('');
  const [adding, setAdding] = useState(false);
  const [note, setNote] = useState(undefined);
  const [phuong, setPhuong] = useState('');
  const [quan, setQuan] = useState('');

  const accept = () => {
    const premise = {
      name: name,
      address: address,
      phone_number: phone,
      id_area: parseInt(props.quan) * 100000 + parseInt(phuong),
      id_business_type: parseInt(business),
      id_certificate: parseInt(certificate),
    }
    console.log(premise);
    setAdding(true);
    PremisesService.createPremise(premise).then((res) => {
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
          <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Tên</div>
          <input type="text" className="form-control form-input" placeholder="Tên cơ sở" value={name} onChange={(e) => setName(e.target.value)}/>
          {note? <div className="tiny-alert" role="alert">{note.name}</div> : null}
        </div>
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className=" mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Khu vực</div>
          <PhuongOption areaId = {props.quan} choose={(phuongId) => {setPhuong(phuongId); console.log(phuongId);}}/>
          {note? <div className="tiny-alert" role="alert">{note.id_area}</div> : null}
        </div>
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Địa chỉ</div>
          <input type="text" className="form-control form-input" placeholder="Địa chỉ" value={address} onChange={(e) => setAddress(e.target.value)}/>
          {note? <div className="tiny-alert" role="alert">{note.address}</div> : null}
        </div>
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Kinh doanh</div>
          <BusinessOption choose={(businessTypeId) => {
            setBusiness(businessTypeId);
          }}/>
          {note? <div className="tiny-alert" role="alert">{note.id_business_type}</div> : null}
        </div>
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Chứng nhận</div>
          <input type="text" className="form-control form-input" placeholder="Chứng nhận" value={certificate} onChange={(e) => setCertificate(e.target.value)}/>
          {note? <div className="tiny-alert" role="alert">{note.certificate}</div> : null}
        </div>
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Điện thoại</div>
          <input type="text" className="form-control form-input" placeholder="Điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)}/>
          {note? <div className="tiny-alert" role="alert">{note.phone_number}</div> : null}
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
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [business, setBusiness] = useState('');
  const [certificate, setCertificate] = useState('');
  const [phone, setPhone] = useState('');
  const [editting, setEditting] = useState(false);
  const [note, setNote] = useState(undefined);
  const [phuong, setPhuong] = useState('');

  const save = () => {
    const premise = {
      id: props.old.id,
      name: name? name : props.old.name,
      id_area: phuong? (parseInt(props.old.id_area / 100000)*100000 + parseInt(phuong)) : props.old.id_area,
      address: address? address : props.old.address,
      id_business_type: business? parseInt(business) : parseInt(props.old.id_business_type),
      id_certificate: certificate? parseInt(certificate) : parseInt(props.old.id_certificate),
      phone_number: phone? phone : props.old.phone_number,
    }
    console.log(props.old.id_area + ", " + phuong);
    PremisesService.updatePremise(premise).then((res) => {
      setEditting(false);
      props.cancelEdit();
    }).catch((err) => {
      console.log(err);
    })
    // console.log(premise);
    // setEditting(true);
    // PremisesService.deletePremise(props.old.id).then((res) => {
    //   setEditting(false);
    //   if (!editting) {
    //     PremisesService.createPremise(premise).then((res) => {
    //       console.log(premise);
    //       console.log(res);
    //       props.cancelEdit();
    //     })
    //   }
    // }).catch((err) => {
    //   console.log(err);
    //   setNote(err.response.data);
    //   console.log(err.response.data);
    //   setEditting(false);
    // })
  }

  return (
    <div className="jumbotron" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <h3 style={{textAlign: 'center'}}>CẬP NHẬT CƠ SỞ</h3>
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
              <input type="text" className="form-control form-input" value={BusinessService.getBusiness(props.old.id_business_type)} disabled/>
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
                <PhuongOption areaId = {props.old.id_area / 100000} choose={(phuongId) => {setPhuong(phuongId); console.log(phuongId);}}/>
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
              <input type="text" className="form-control form-input" placeholder={props.old.id_certificate} value={certificate} onChange={(e) => setCertificate(e.target.value)}/>
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
      </div>
    </div>
  );
}

function InfoView(props) {
  const [showLich, setShowLich] = useState(false);
  const [inspection_date, setInpection_date] = useState(new Date());

  const createInspection = () => {
    console.log("???");
    const newInspection = {
      inspection_date: inspection_date,
      id_premise: props.old.id
    };
    InspectionService.createInspection(newInspection).then((res) => {
      console.log(res);
      props.back();
    })
  }

  return (
    <div className="jumbotron" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <h3 style={{textAlign: 'center'}}>Cơ sở <strong>{props.old.name}</strong></h3>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{flexDirection: 'row'}}>
          <strong>Địa chỉ: </strong>{props.old.address}, {AreaService.idToArea(props.old.id_area)}
        </div>
        <div style={{flexDirection: 'row'}}><strong>Số điện thoại: </strong>{props.old.phone_number}</div>
        <div style={{flexDirection: 'row'}}><strong>Loại hình kinh doanh: </strong>{BusinessService.getBusiness(props.old.id_business_type)}</div>
        <div style={{flexDirection: 'row'}}><strong>Chứng nhận: </strong> {props.old.id_certificate? props.old.id_certificate : "Không có"}</div>
        <div style={{flexDirection: 'row'}}><strong>Thanh tra lần cuối: </strong> </div>
        <div style={{flexDirection: 'row'}}><strong>Thanh tra: </strong> 
          {props.inspections.find((i) => i.id_premise == props.old.id)? 
          props.inspections.find((i) => i.id_premise == props.old.id).inspection_date + " <Đã có lịch> " : "Không có lịch thanh tra!"}
        </div>
        {!props.inspections.find((i) => i.id_premise == props.old.id) && !showLich && (
          <button className="btn btn-warning" onClick={() => setShowLich(true)}>Tạo lịch thanh tra</button>
        )}
        {showLich && (<div>
          <div style={{display: 'flex', marginTop: '10px', marginBottom: '10px'}}>
            <strong>Ngày thanh tra: </strong><MyDatePicker style={{width: '100px !important'}} onChange={(date) => setInpection_date((date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()))}/>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-around'}}>
            <button className = "btn btn-success" onClick={createInspection}>Tạo</button>
            <button className = "btn btn-danger" onClick={() => setShowLich(false)}>Hủy</button>
          </div>
          
        </div>)}
      </div>
      <div className="form-group my-form-group " style={{display: 'flex', justifyContent: 'space-around', marginTop: '30px'}}>
        <button className = "btn btn-primary" onClick={props.back}>Quay lại</button>
      </div>
    </div>
  )
}

