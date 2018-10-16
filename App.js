import React, { Component } from 'react';
import './App.css';
import {Fabric} from 'office-ui-fabric-react/lib/Fabric'
import {Button, ButtonType} from 'office-ui-fabric-react/lib/Button';
import {Dialog, DialogType, DialogFooter} from 'office-ui-fabric-react/lib/Dialog';



class App extends Component {
  constructor(props){
    super(props)
    this.state = {
        events: [],
        isOpen: false,
        id:null,
        startDate:"",
        description:"",
        endDate:"",
        title:"",
        createdBy:"",
        sTDate:"",
        startam_pm:"",
        endam_pm:"",
        startDateCal:"",
        endDateCal:"",
        startDay:"",
        endDay:"",
    }
  }
  componentDidMount() {
    this.calEvents();
  }
  close = () => this.setState({isOpen: false})

  dailog = (id) => {
    const event = this.state.events.find((e) => {
      return e.id === id
    })
    let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    let startDate = new Date(event.startDate);
    let endDate = new Date(event.endDate)
    let sTDate = (event.startDate).split(",")[0];
    let startam_pm  = (startDate.getHours() < 12) ? "AM" : "PM";
    let endam_pm  = (endDate.getHours() < 12) ? "AM" : "PM";
    let startDateCal =  startDate.getFullYear().toString()+(startDate.getMonth()+1).toString()+startDate.getDate().toString()+"T"+(startDate.getHours()<10 ? "0"+startDate.getHours():startDate.getHours())+startDate.getMinutes()+"00";
    let endDateCal =  endDate.getFullYear().toString()+(endDate.getMonth()+1).toString()+endDate.getDate().toString()+"T"+(endDate.getHours()<10 ? "0"+endDate.getHours():endDate.getHours())+endDate.getMinutes()+"00";
    let startDay = days[startDate.getDay()];
    let endDay = days[endDate.getDay()];

    console.log(startDate);
    this.setState({
      id:event.id,
      sTDate:sTDate,
      description:event.description,
      title:event.title,
      createdBy:event.CreatedBy,
      startDate:event.startDate,
      endDate:event.endDate,
      startam_pm,
      endam_pm,
      startDateCal,
      endDateCal,
      startDay,
      endDay,
      isOpen:true,

    });
  }
  calICS = () =>{ 
    let location = "kochi"; 
    let icsMSG = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Our Company//NONSGML v1.0//EN\nBEGIN:VEVENT\nUID:me@google.com\nDTSTAMP:20120315T170000Z\nATTENDEE;CN=My Self ;RSVP=TRUE:MAILTO:me@gmail.com\nORGANIZER;CN=Me:MAILTO::me@gmail.com\nDTSTART:" + this.state.startDateCal +"\nDTEND:" + this.state.endDateCal +"\nLOCATION:" + location + "\nSUMMARY:"+this.state.title+"\nEND:VEVENT\nEND:VCALENDAR";

    window.open( "data:text/calendar;charset=utf8," + escape(icsMSG));
  }
  calEvents = () => {
    const calEvent=(response) => {
    console.log(response)
      if (response.status>=400) {
        throw new Error("Bad response");
      }
      return response.json();
    }
    const onSuccess = (events)=> {
      this.setState({events})
      console.log(events);  
    }
    const onFailure = () => this.setState({error: 'Error Occurred!'})
    fetch('http://localhost:3000/events').then(calEvent).then(onSuccess,onFailure);
    }
  render() {

    let rows = this.state.events.map((event,i)=>{
      return <tr className="eventD" key ={i} onClick={() => this.dailog(event.id)}>{event.title} - {event.startDate} </tr>
    })
    let popUp = <div> 
          <div className="onetwo">
            <div className="oneBox"><img src="https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt=""/>
            </div>
            <div className="twoBox">
              <div className="dateDetails">{this.state.sTDate}</div>
              <div className="titleDetails">{this.state.title}</div>
              <div className="authorDetails">by - {this.state.createdBy}
              </div>
            </div>
          </div>  
    <div className="three">
        <input type="button" value="Download ICS File" onClick={this.calICS} />
    </div>
    <div className="lastBox">
        
        <div className="description">
        <div className="desc">Description</div>
        {this.state.description}
        </div>
        <div className="event">
            <div className="eventDetails">
                <div className="dateTime">Date And Time</div>
                <div>{this.state.startDay}, {this.state.startDate} {this.state.am_pm} –</div>
                <div>{this.state.endDay}, {this.state.endDate}  {this.endam_pm} IST</div>
                <div><a onClick={this.calICS}>Add Calender Event</a></div>
            </div>
        </div>
    </div>
    </div>
    return (
      <div className="App">
       <table>
         <tbody>
           <tr className="upcomingevent">Up Coming Events</tr>
           {rows}
         </tbody>
       </table> 
       <Fabric className="App">
        <Dialog
          isOpen={this.state.isOpen}
          type={DialogType.close}
          onDismiss={this.close.bind(this)}
          subText={popUp}
          isBlocking={false}
          closeButtonAriaLabel='Close'
        >
        
         <DialogFooter>
            <Button buttonType={ButtonType.primary} onClick={this.close}>OK</Button>
          </DialogFooter>
        </Dialog>
      </Fabric> 
      </div> 
    );
  }
}

export default App;
