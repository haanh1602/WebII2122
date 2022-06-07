import React, { Component , useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/font-awesome/css/font-awesome.min.css'; 
import '../App.css';
import { Switch, Route } from "react-router-dom";

import InspectionService from "../services/inspection.service";
import UserService from "../services/user.service";
import PremisesService from "../services/premises.service";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";
import AreaService from "../services/area.service";
import BusinessService from "../services/business.service";
import SampleService from "../services/sample.service";
import MyDatePicker from "./date-picker.component";
import CertificateService from "../services/certificate.service";

import {QuanOption, PhuongOption} from "./area-option.component";
import BusinessOption from "./business-type-option.component";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

var tableHeader = ["Cơ sở", "Ngày thanh tra", "Cần lấy mẫu", "ID mẫu", "Trạng thái mẫu", "Vi phạm", "Trạng thái"];

export default class Inspection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      showAdd: false,
      showEdit: false,
      edittingObj: undefined,
      premises: undefined,
      samples: undefined,
      inspection: undefined,
      edittingPremise: undefined,
      edittingSample: undefined,
      showAddCert: false,
      certificates: [],
    };
  }

  componentWillMount() {
    if (!AuthService.getCurrentUser())  window.location.href = "/login";
    if (InspectionService.auth().displayAction && !tableHeader.includes("Quyền")) tableHeader.push("Quyền");
  }

  componentDidMount() {
    CertificateService.getCertificates().then((res) => {
      console.log(res.data);
      this.setState({certificates: res.data});
    })
    PremisesService.getPremises().then((res) => {
      if (AuthService.getCurrentUser().is_manager) {this.setState({premises: res.data.filter((u) => parseInt(u.id_area / 100000) == parseInt(AuthService.getCurrentUser().id_area / 100000))});}
      else {this.setState({premises: res.data.filter((u) => parseInt(u.id_area % 100000) == parseInt(AuthService.getCurrentUser().id_area % 100000))})}
      InspectionService.getInspections().then((res) => {
        this.setState({content: res.statusText});
        this.setState({data: res.data.filter((u) => this.state.premises.find((p) => p.id == u.id_premise))});
        SampleService.getSamples().then((res) => {
          this.setState({samples: res.data.filter((s) => this.state.premises.find((p) => p.id == s.id_premise))});
        })
      })
    }).catch((err) => {
      if (err.response.status == 401) {
        AuthService.logout();
        window.location.href = "/login";
        return;
      }
    })
  }

  handleClickDelete = (id) => {
    console.log(id);
    InspectionService.deleteInspection(id).then((res) => {
      this.componentDidMount();
    });
  }

  remove = (obj) => {
    console.log(obj);
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Đồng ý xóa?</h1>
            <p>Bạn muốn xóa kế hoạch thanh tra này?</p>
            <div style={{display: 'flex', justifyContent: 'space-around'}}>
              <button className = "btn btn-primary" onClick={() => {this.handleClickDelete(obj.id); onClose();}}>Có</button>
              <button className = "btn btn-danger" onClick={onClose}>Không</button>
            </div>
          </div>
        );
      }
    });
  }

  actions(obj, premise, sample) {
    return InspectionService.auth().displayAction? (
      <td>
        {InspectionService.auth().edit && (
          <button
          className="btn btn-warning my-btn-action" style={{padding: '5px'}}
          onClick={() => {
            this.setState({edittingSample: sample});
            this.setState({edittingPremise: premise});
            this.setState({edittingObj: obj});
            this.setState({showEdit: true});
          }}
        >
          <span className="fa fa-pencil"></span> {/* Button edit */}
        </button>
        )}
        &nbsp;
        {InspectionService.auth().delete && (
        <button
          className="btn btn-danger my-btn-action" style={{padding: '5px'}}
          onClick={() => this.remove(obj)}
        >
          <span className="fa fa-trash"></span>
        </button>)}
      </td>
    ) : null;
  }

  thuhoi = (_cert,  _premise, _inspection) => {
    console.log(this.state.certificates);
    console.log(_cert);
    console.log(_premise);
    console.log(_inspection);
    var cert = _cert;
    cert.status = "thuhoi";
    CertificateService.updateCertificate(cert, cert.id).then((res) => {
      var inspection = _inspection;
      var premise = _premise;
      inspection.status = "khongdatchuan";
      premise.id_certificate = null;
      InspectionService.updateInspection(inspection, inspection.id).then((res) => {
        PremisesService.updatePremise(premise, premise.id).then((res) => {
          this.componentDidMount();
        })
      })
      //window.location.reload();
    }).catch((err) => {
      console.log(err);
      console.log(err.response.data);
    })
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
              this.state.data.map((obj, index) => {
                const {id, inspection_date, sample_needed, violate, id_premise, id_sample, status} = obj;
                console.log(obj);
                const premise = this.state.premises.find(p => p.id == id_premise);
                const sample = this.state.samples? this.state.samples.find(s => s.id == id_sample) : undefined;
                console.log(sample);
                const canEdit = !(status=="datchuan" || status=="khongdatchuan");
                return <tr key = {id} className={"my-tr" + (!canEdit? " disable" : "")}>
                  <td onClick={() => {
                    if (!canEdit) return;
            this.setState({edittingSample: sample});
            this.setState({edittingPremise: premise});
            this.setState({edittingObj: obj});
            this.setState({showEdit: true});
          }}>{premise.name}</td>
                  <td onClick={() => {
                    if (!canEdit) return;
            this.setState({edittingSample: sample});
            this.setState({edittingPremise: premise});
            this.setState({edittingObj: obj});
            this.setState({showEdit: true});
          }}>{inspection_date}</td>
                  <td onClick={() => {
                    if (!canEdit) return;
            this.setState({edittingSample: sample});
            this.setState({edittingPremise: premise});
            this.setState({edittingObj: obj});
            this.setState({showEdit: true});
          }}>{sample_needed? "Có" : "Không"}</td>
                  <td onClick={() => {
                    if (!canEdit) return;
            this.setState({edittingSample: sample});
            this.setState({edittingPremise: premise});
            this.setState({edittingObj: obj});
            this.setState({showEdit: true});
          }}>{id_sample}</td>
                  <td onClick={() => {
                    if (!canEdit) return;
            this.setState({edittingSample: sample});
            this.setState({edittingPremise: premise});
            this.setState({edittingObj: obj});
            this.setState({showEdit: true});
          }}>{sample? InspectionService.idToName(sample.accreditation_status) : null}</td>
                  <td onClick={() => {
                    if (!canEdit) return;
            this.setState({edittingSample: sample});
            this.setState({edittingPremise: premise});
            this.setState({edittingObj: obj});
            this.setState({showEdit: true});
          }}>{violate? "Có" : "Không"}</td>
                  {AuthService.getCurrentUser().is_manager && status=="capgiay" && (
                    <td><button className="btn btn-success" onClick={()=>{
                      this.setState({premise: premise});
                      this.setState({inspection: obj});
                      this.setState({showAddCert: true});
                    }}>{InspectionService.idToName(status)}</button></td>
                  )}
                  {AuthService.getCurrentUser().is_manager && status=="thuhoi" && (
                    <td><button className="btn btn-danger" onClick={() => this.thuhoi(this.state.certificates.find((c) => c.id == premise.id_certificate), premise, obj)}>{InspectionService.idToName(status)}</button></td>
                  )}
                  {(!AuthService.getCurrentUser().is_manager || (AuthService.getCurrentUser().is_manager && (status != "capgiay" && status != "thuhoi"))) && (
                    <td>{status? InspectionService.idToName(status) : "Đang xử lý"}</td>
                  )}
                  {this.actions(obj, premise, sample)}
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
      <h3 style={{textAlign: 'center'}}>KẾ HOẠCH THANH TRA</h3>
      {(this.state.data && this.state.data.length > 0)? this.renderContent() : 
        <div className="jumbotron">
          <div>Không có kế hoạch thanh tra nào!</div>
          <div>Network: {this.state.content} </div>
        </div>}
      </>
    )
  }

  addView = () => {
    return (
      <AddView quan={parseInt(AuthService.getCurrentUser().id_area / 100000)} cancelAdd={() => {this.setState({showAdd: false}); this.componentDidMount()}}/>
    )
  }

  editView = () => {
    console.log(this.state.edittingObj);
    return (
      <EditView quan={parseInt(AuthService.getCurrentUser().id_area / 100000)} premise = {this.state.edittingPremise} sample = {this.state.edittingSample} samples = {this.state.samples} old={this.state.edittingObj} cancelEdit={() => {this.setState({showEdit: false}); this.componentDidMount();}} />
    )
  }

  addCertView = () => {
    return (
      <AddCertView inspection={this.state.inspection} premise={this.state.premise} cancelAdd={() => {this.setState({showAddCert: false}); this.componentDidMount()}} />
    );
  }

  render() {
    return (
      <div className="container">
        {this.state.showAdd? this.addView() : null}
        {this.state.showEdit? this.editView() : null}
        {this.state.showAddCert? this.addCertView() : null}
        {!(this.state.showAdd || this.state.showEdit || this.state.showAddCert)? this.mainView() : null}
      </div>
    );
  }
}

function AddView(props){ }

function EditView(props){
  const [inspection_date, setInspection_date] = useState('');
  const [sample_needed, setSample_needed] = useState('');
  const [violate, setViolate] = useState('');
  const [id_premise, setId_premise] = useState('');
  const [id_sample, setId_sample] = useState('');
  const [status, setStatus] = useState('');
  const [editting, setEditting] = useState(false);
  const [note, setNote] = useState(undefined);
  const [create, setCreate] = useState(!props.samples && !props.sample && props.samples.find((s) => s.id == props.sample.id));
  const [sample_status, setSample_status] = useState('');
  const [result_date, setResult_date] = useState(new Date());
  const [valid_sample, setValid_sample] = useState(true);

  const save = () => {
    var inspection = {
      inspection_date: inspection_date? inspection_date : props.old.inspection_date,
      sample_needed: sample_needed? sample_needed : props.old.sample_needed,
      violate: violate? violate : props.old.violate,
      id_premise: id_premise? id_premise : props.old.id_premise,
      status: status? status : props.old.status,
      id_sample: id_sample? id_sample : props.old.id_sample,
    }
    if (create) {
      const newSample = {
        id_premise: props.premise.id,
        accreditation_premise: "khongdatchuan",
        accreditation_status: sample_status? sample_status : "xuly",
        result_date: result_date,
        result_valid: valid_sample? valid_sample : true
      }
      SampleService.createSample(newSample).then((res) => {
        console.log(res);
        inspection.id_sample = res.data.id;
        InspectionService.updateInspection(inspection, props.old.id).then((res) => {
          setEditting(false);
          props.cancelEdit();
        }).catch((err) => {
          console.log(err);
        })
      })
    }
    else if (props.sample) {
      console.log(inspection);
      setEditting(true);
      
      const updateSample = {
        id_premise: props.premise.id,
        accreditation_premise: props.sample.accreditation_premise,
        accreditation_status: sample_status? sample_status : props.sample.accreditation_status,
        result_date: result_date? result_date : props.sample.result_date,
        result_valid: valid_sample
      }
      console.log(props.sample);
      console.log(updateSample);
      SampleService.updateSample(updateSample, props.sample.id).then((res) => {
        InspectionService.updateInspection(inspection, props.old.id).then((res) => {
          setEditting(false);
          props.cancelEdit();
        }).catch((err) => {
          console.log(err);
        })
      })
    } else {
      InspectionService.updateInspection(inspection, props.old.id).then((res) => {
        setEditting(false);
        props.cancelEdit();
      }).catch((err) => {
        console.log(err);
      })
    }
  }

  return AuthService.getCurrentUser().is_manager? (
    <div className="jumbotron" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <h3 style={{textAlign: 'center'}}>CẬP NHẬT LỊCH THANH TRA</h3>
      <div style={{display: 'flex'}}>
        <form className="form">
          <div className="form-group my-form-group form flex-row sp-between input-div div-center">
            <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Tên cơ sở</div>
            <input type="text" className="form-control form-input" placeholder={props.premise.name} disabled/>
          </div>
          <div className="form-group my-form-group form flex-row sp-between input-div div-center">
            <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Ngày thanh tra</div>
            <input type="text" className="form-control form-input" placeholder={props.old.inspection_date} disabled/>
          </div>
          <div className="form-group my-form-group form flex-row sp-between input-div div-center">
            <div className=" mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Cần lấy mẫu</div>
            <input type="text" className="form-control form-input" placeholder={props.old.sample_needed? "Có" : "Không"} disabled/>
          </div>
          <div className="form-group my-form-group form flex-row sp-between input-div div-center">
            <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>ID Mẫu</div>
            <input type="text" className="form-control form-input" placeholder={props.old.id_sample} disabled/>
          </div>
          <div className="form-group my-form-group form flex-row sp-between input-div div-center">
            <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Trạng thái mẫu</div>
            <input type="text" className="form-control form-input" placeholder={props.sample? InspectionService.idToName(props.sample.accreditation_status) : null} disabled/>
          </div>
          <div className="form-group my-form-group form flex-row sp-between input-div div-center">
            <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Trạng thái</div>
            <input type="text" className="form-control form-input" placeholder={props.old.status} disabled/>
          </div>
        </form>
        <div className="into">
          <span className="fa fa-arrow-right"/>
        </div>
        <div>
          <form className="form">
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <input type="text" className="form-control form-input" placeholder={props.premise.name} disabled/>
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <div className="my-date-picker-form">
                <MyDatePicker onChange={(date) => setInspection_date((date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()))} />
              </div>
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <input type="text" className="form-control form-input" placeholder={props.old.sample_needed? "Có" : "Không"} disabled/>
              {note? <div className="tiny-alert" role="alert">{note.sample_needed}</div> : null}
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <input type="text" className="form-control form-input" placeholder={props.old.id_sample} value={id_sample} onChange={(e) => setId_sample(e.target.value)} disabled/>
              {note? <div className="tiny-alert" role="alert">{note.id_sample}</div> : null}
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <input type="text" className="form-control form-input" placeholder={props.sample? InspectionService.idToName(props.sample.accreditation_status) : null} disabled/>
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <input type="text" className="form-control form-input" placeholder={props.old.status} disabled/>
            </div>
          </form>
        </div>
      </div>
      <div className="form-group my-form-group " style={{display: 'flex', justifyContent: 'space-around'}}>
        <button className = "btn btn-success" onClick={save}>Lưu</button>
        <button className = "btn btn-danger" onClick={props.cancelEdit}>Hủy</button>
      </div>
    </div>
  ) : (
    <div className="jumbotron" style={{display: 'flex', flexDirection: 'column'}}>
      <h3 style={{textAlign: 'center'}}>CẬP NHẬT TÌNH TRẠNG THANH TRA</h3>
      <div style={{flexDirection: 'row'}}><strong>Tên cơ sở: </strong>{props.premise.name}</div>
      <div style={{flexDirection: 'row'}}><strong>Ngày thanh tra: </strong>{props.old.inspection_date}</div>
      <div style={{flexDirection: 'row'}}><strong>Cần lấy mẫu: </strong>{(props.old.sample_needed || sample_needed )? "Có" : 
          (<button className="" onClick={() => {setSample_needed(true); setCreate(true); console.log("??!!")}}>Tạo mẫu</button>)
        }
      </div>
      {(sample_needed || props.old.sample_needed) && (
        <>
        <div style={{flexDirection: 'row'}}><strong>Trạng thái mẫu: </strong>
          <select defaultValue={props.sample? props.sample.accreditation_status : "xuly"} onChange={(e) => setSample_status(e.target.value)}>
            <option value="xuly">{InspectionService.idToName("xuly")}</option>
            <option value="datchuan">{InspectionService.idToName("datchuan")}</option>
            <option value="khongdatchuan">{InspectionService.idToName("khongdatchuan")}</option>
          </select>
        </div>
        <div style={{flexDirection: 'row'}}><strong>Ngày có kết quả: </strong>
          <MyDatePicker onChange={(date) => setResult_date((date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()))} />
        </div>
        <div style={{flexDirection: 'row'}}><strong>Mẫu hợp lệ: </strong>
          <select defaultValud={props.sample? props.sample.result_valid : true} onChange={(e) => setValid_sample(e.target.value)}>
            <option value={true}>{SampleService.idToName(true)}</option>
            <option value={false}>{SampleService.idToName(false)}</option>
          </select>
        </div>
        </>
      )}
      <div style={{flexDirection: 'row'}}><strong>Vi phạm: </strong>
        <select defaultValue={props.old.violate} onChange={(e) => setViolate(e.target.value)}>
          <option value={true}>{"Vi phạm"}</option>
          <option value={false}>{"Không vi phạm"}</option>
        </select>
      </div>
      <div style={{flexDirection: 'row'}}><strong>Trạng thái: </strong>
        <select defaultValue={props.old.status} onChange={(e) => setStatus(e.target.value)}>
          <option value="xuly">{InspectionService.idToName("xuly")}</option>
          {violate? (
            <>
              {props.premise.id_certificate? (
                <option value={"thuhoi"}>{InspectionService.idToName("thuhoi")}</option>
              ) : (
                <option value={"khongdatchuan"}>{InspectionService.idToName("khongdatchuan")}</option>
              )}
            </>
          ) : (
            <>
              {props.premise.id_certificate? (
                <option value={"datchuan"}>{InspectionService.idToName("datchuan")}</option>
              ) : (
                <option value={"capgiay"}>{InspectionService.idToName("capgiay")}</option>
              )}
            </>
          )}
        </select>
      </div>
      <div className="form-group my-form-group " style={{display: 'flex', justifyContent: 'space-around'}}>
        <button className = "btn btn-success" onClick={save}>Lưu</button>
        <button className = "btn btn-danger" onClick={props.cancelEdit}>Hủy</button>
      </div>
    </div>
  );
}

function AddCertView(props){
  const [id_business_type, setId_business_type] = useState('');
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
      status: 'hieuluc',
      id_business_type: props.premise.id_business_type,
      issued_date: props.inspection.inspection_date,
      expired_date: expired_date,
      series: randomSeries(10)
    }
    console.log(obj);
    setAdding(true);
    CertificateService.createCertificate(obj).then((res) => {
      var inspection = props.inspection;
      var premise = props.premise;
      inspection.status = "datchuan";
      premise.id_certificate = res.data.id;
      InspectionService.updateInspection(inspection, inspection.id).then((res) => {
        PremisesService.updatePremise(premise, premise.id).then((res) => {
          console.log(res);
          setAdding(false);
          props.cancelAdd();
        })
      })
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
      <h3 style={{textAlign: 'center'}}>CẤP GIẤY</h3>
      <form className="form">
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className="mr-r-5 mn-w-180 pd-top-7" style={{height: '37px'}}>Cơ sở: </div>
          <input type="text" className="form-control form-input" placeholder={props.premise.name} disabled/>
        </div>
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className="mr-r-5 mn-w-180 pd-top-7" style={{height: '37px'}}>Loại hình kinh doanh: </div>
          <input type="text" className="form-control form-input" placeholder={BusinessService.getBusiness(props.premise.id_business_type)} disabled/>
        </div>
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className="mr-r-5 mn-w-180 pd-top-7" style={{height: '37px'}}>Ngày kiểm tra</div>
          <input type="text" className="form-control form-input" placeholder={props.inspection.inspection_date} disabled/>
        </div>
        {/* <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className=" mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Ngày kiểm tra</div>
          <MyDatePicker onChange={(date) => setIssued_date(date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate())}/>
          {note? <div className="tiny-alert" role="alert">{note.issued_date}</div> : null}
        </div> */}
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className="mr-r-5 mn-w-180 pd-top-7" style={{height: '37px'}}>Hiệu lực</div>
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

