import React, { Component , useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/font-awesome/css/font-awesome.min.css'; 
import '../App.css';
import { Switch, Route } from "react-router-dom";
import SampleService from "../services/sample.service";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';



var tableHeader = ["ID", "Premise", "Area", "Address", "Business", "Certificate"];

export default class Sample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      showAdd: false,
      showEdit: false,
      edittingSample: undefined,
    };
  }

  componentWillMount() {
    if (!AuthService.getCurrentUser())  window.location.href = "/login";
    if (SampleService.auth().displayAction && !tableHeader.includes("Action")) tableHeader.push("Action");
  }

  componentDidMount() {
    SampleService.getSamples().then(
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
    SampleService.deleteSample(id).then((res) => {
      this.componentDidMount();
    });
  }

  remove = (sample) => {
    console.log(sample);
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Are you sure?</h1>
            <p>You want to delete this?</p>
            <div style={{display: 'flex', justifyContent: 'space-around'}}>
              <button className = "btn btn-primary" onClick={() => {this.handleClickDelete(sample.id); onClose();}}>Yes</button>
              <button className = "btn btn-danger" onClick={onClose}>No</button>
            </div>
            
          </div>
        );
      }
    });
  }

  actions(sample) {
    return SampleService.auth().displayAction? (
      <td>
        <button
              className="btn btn-warning" style={{padding: '5px', borderRadius: '3px'}}
              onClick={() => {
                this.setState({edittingSample: sample});
                this.setState({showEdit: true});
              }}
            >
              <span className="fa fa-pencil"></span> Edit
            </button>
            &nbsp;
            <button
              className="btn btn-danger" style={{padding: '5px', borderRadius: '3px'}}
              onClick={() => this.remove(sample)}
            >
              <span className="fa fa-trash"></span> Delete
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
                this.state.data.map((sample, index) => {
                  const {id, id_premise, accreditation_premise, accreditation_status, result_date, result_valid} = sample;
                  return <tr key = {id}>
                    <td>{id}</td>
                    <td>{id_premise}</td>
                    <td>{accreditation_premise}</td>
                    <td>{accreditation_status}</td>
                    <td>{result_date}</td>
                    <td>{result_valid}</td>
                    {this.actions(sample)}
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
          <div>Samples is empty!</div>
          <div>Network: {this.state.content} </div>
        </div>}
        <div className="add-field">
          <button className="btn btn-success" onClick={() => {this.setState({showAdd: true})}}><span className="fa fa-plus"/> New</button>
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
    console.log(this.state.edittingSample);
    return (
      <EditView old = {this.state.edittingSample} cancelEdit={() => {this.setState({showEdit: false}); this.componentDidMount();}} />
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
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [business, setBusiness] = useState('');
  const [certificate, setCertificate] = useState('');
  const [phone, setPhone] = useState('');
  const [adding, setAdding] = useState(false);
  const [note, setNote] = useState(undefined);

  const accept = () => {
    const sample = {
      name: name,
      address: address,
      phone_number: phone,
      id_area: parseInt(area),
      id_business_type: parseInt(business),
      id_certificate: parseInt(certificate),
    }
    console.log(sample);
    setAdding(true);
    SampleService.createSample(sample).then((res) => {
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
      <h3 style={{textAlign: 'center'}}>ADD SAMPLE</h3>
      <form className="form">
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Name</div>
          <input type="text" className="form-control form-input" placeholder="Premise name" value={name} onChange={(e) => setName(e.target.value)}/>
          {note? <div className="tiny-alert" role="alert">{note.name}</div> : null}
        </div>
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className=" mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Area</div>
          <input type="text" className="form-control form-input" placeholder="Area" value={area} onChange={(e) => setArea(e.target.value)}/>
          {note? <div className="tiny-alert" role="alert">{note.id_area}</div> : null}
        </div>
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Address</div>
          <input type="text" className="form-control form-input" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)}/>
          {note? <div className="tiny-alert" role="alert">{note.address}</div> : null}
        </div>
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Business</div>
          <input type="text" className="form-control form-input" placeholder="Business" value={business} onChange={(e) => setBusiness(e.target.value)}/>
          {note? <div className="tiny-alert" role="alert">{note.id_business_type}</div> : null}
        </div>
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Certificate</div>
          <input type="text" className="form-control form-input" placeholder="Certificate" value={certificate} onChange={(e) => setCertificate(e.target.value)}/>
          {note? <div className="tiny-alert" role="alert">{note.certificate}</div> : null}
        </div>
        <div className="form-group my-form-group form flex-row sp-between input-div div-center">
          <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Phone</div>
          <input type="text" className="form-control form-input" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)}/>
          {note? <div className="tiny-alert" role="alert">{note.phone_number}</div> : null}
        </div>
      </form>
      <div className="form-group my-form-group " style={{display: 'flex', justifyContent: 'space-around'}}>
        <button className = "btn btn-success" onClick={accept}>Accept</button>
        <button className = "btn btn-danger" onClick={props.cancelAdd}>Cancel</button>
      </div>
    </div>
  );
}

function EditView(props){
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [business, setBusiness] = useState('');
  const [certificate, setCertificate] = useState('');
  const [phone, setPhone] = useState('');
  const [editting, setEditting] = useState(false);
  const [note, setNote] = useState(undefined);

  const save = () => {
    const sample = {
      name: name,
      address: address,
      phone_number: phone,
      id_area: parseInt(area),
      id_business_type: parseInt(business),
      id_certificate: parseInt(certificate),
    }
    console.log(sample);
    setEditting(true);
    SampleService.updateSample(sample).then((res) => {
      console.log(res);
      setEditting(false);
    }).catch((err) => {
      console.log(err);
      setNote(err.response.data);
      console.log(err.response.data);
      setEditting(false);
    })
  }

  return (
    <div className="jumbotron" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <h3 style={{textAlign: 'center'}}>UPDATE PREMISE</h3>
      <div style={{display: 'flex'}}>
        <div>
          <form className="form">
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Name</div>
              <input type="text" className="form-control form-input" value={props.old.name} disabled/>
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <div className=" mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Area</div>
              <input type="text" className="form-control form-input" value={props.old.id_area} disabled/>
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Address</div>
              <input type="text" className="form-control form-input"  value={props.old.address} disabled/>
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Business</div>
              <input type="text" className="form-control form-input" value={props.old.id_business_type} disabled/>
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Certificate</div>
              <input type="text" className="form-control form-input" value={props.old.id_certificate? props.old.id_certificate : "None"} disabled/>
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <div className="mr-r-5 mn-w-80 pd-top-7" style={{height: '37px'}}>Phone</div>
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
              <input type="text" className="form-control form-input" placeholder="Premise name" value={name} onChange={(e) => setName(e.target.value)}/>
              {note? <div className="tiny-alert" role="alert">{note.name}</div> : null}
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <input type="text" className="form-control form-input" placeholder="Area" value={area} onChange={(e) => setArea(e.target.value)}/>
              {note? <div className="tiny-alert" role="alert">{note.id_area}</div> : null}
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <input type="text" className="form-control form-input" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)}/>
              {note? <div className="tiny-alert" role="alert">{note.address}</div> : null}
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <input type="text" className="form-control form-input" placeholder="Business" value={business} onChange={(e) => setBusiness(e.target.value)}/>
              {note? <div className="tiny-alert" role="alert">{note.id_business_type}</div> : null}
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <input type="text" className="form-control form-input" placeholder="Certificate" value={certificate} onChange={(e) => setCertificate(e.target.value)}/>
              {note? <div className="tiny-alert" role="alert">{note.certificate}</div> : null}
            </div>
            <div className="form-group my-form-group form flex-row sp-between input-div div-center">
              <input type="text" className="form-control form-input" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)}/>
              {note? <div className="tiny-alert" role="alert">{note.phone_number}</div> : null}
            </div>
          </form>
        </div>
      </div>
      <div className="form-group my-form-group " style={{display: 'flex', justifyContent: 'space-around'}}>
        <button className = "btn btn-success" onClick={save}>Save</button>
        <button className = "btn btn-danger" onClick={props.cancelEdit}>Cancel</button>
      </div>
    </div>
  );
}