import React, { Component , useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/font-awesome/css/font-awesome.min.css'; 
import '../App.css';
import { Switch, Route } from "react-router-dom";

import PremisesService from "../services/premises.service";
import SampleService from "../services/sample.service";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";
import AreaService from "../services/area.service";
import BusinessService from "../services/business.service";
import InspectionService from "../services/inspection.service";

import {QuanOption, PhuongOption} from "./area-option.component";
import BusinessOption from "./business-type-option.component";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

var tableHeader = ["ID", "Cơ sở", "Trạng thái mẫu", "Ngày có kết quả", "Hợp lệ"];

export default class Sample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      premises: [],
    };
  }

  componentWillMount() {
    if (!AuthService.getCurrentUser())  window.location.href = "/login";
  }

  componentDidMount() {
    PremisesService.getPremises().then((res) => {
      this.setState({premises: res.data.filter((p) => 
        AuthService.getCurrentUser().is_manager? 
        parseInt(AuthService.getCurrentUser().id_area / 100000) == parseInt(p.id_area / 100000) :
        parseInt(AuthService.getCurrentUser().id_area % 100000) == parseInt(p.id_area % 100000)
      )});
      SampleService.getSamples().then(
        response => {
          this.setState({
            content: response.statusText
          });
          this.setState({
            data: response.data.filter((s) => this.state.premises.find((p) => p.id == s.id_premise))
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
    })
  }

  renderContent() {
      return (
        <div className="container">
          <h3 style={{textAlign: 'center'}}>Mẫu thanh tra</h3>
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
                  const premise = this.state.premises.find((p) => p.id == id_premise);
                  if (!premise) return null;
                  return <tr key = {id} className="my-tr">
                    <td>{id}</td>
                    <td>{premise? premise.name : "NULL"}</td>
                    <td>{InspectionService.idToName(accreditation_status)}</td>
                    <td>{result_date}</td>
                    <td onClick={() => {SampleService.deleteSample(id)}}>{SampleService.idToName(result_valid)}</td>
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
          <div>Không có mẫu thanh tra nào!</div>
          <div>Network: {this.state.content} </div>
        </div>}
      </>
    )
  }

  render() {
    return (
      <div className="container">
        {this.mainView()}
      </div>
    );
  }
}

