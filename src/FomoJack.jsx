

import React, { Component } from "react";
import { gsap } from "gsap";
import Sparkle from "react-sparkle";
import "./Background.scss";
import Board2 from "./img/intro-bg-phone.jpg";
import Board1 from "./img/intro-bg.PNG";
import { useEffect, useRef, useState } from "react";
import axios from 'axios';

class Background extends Component {
  constructor(props) {
    super(props);
    this.board1 = React.createRef();
    this.board2 = React.createRef();
    this.lamps = [React.createRef(), React.createRef()];
    this.state = {
      boardNumber: 0,
      winnerList: [],
    };
  }

  // const [winnerList, setWinerList] = useState();

  componentDidMount() {
    let tl = gsap.timeline({
      onComplete: () => {
        this.lamps.map((lamp) => {
          if (lamp.current) {
            return (lamp.current.className = "spotlight_swivel start");
          }
        });
      }
    });

    tl.set(this.board1.current, { y: 100, scale: 0 });
    tl.set(this.board2.current, { y: 100, scale: 0 });
    tl.to("#circle-1", { scale: 1, duration: 0.5 });
    tl.to("#circle-2", { scale: 1, duration: 0.5 }, "-=0.4");
    tl.to("#circle-3", { scale: 1, duration: 0.5 }, "-=0.4");
    tl.to("#circle-4", { scale: 1, duration: 0.5 }, "-=0.4");
    tl.to([this.board1.current, this.board2.current], {
      y: 0,
      scale: 1,
      duration: 0.5
    });

    let boardTimeline = gsap.timeline({
      repeat: -1
    });
    boardTimeline.to(this.board2.current, {
      opacity: 0
    });
    try {
      axios.get('https://spotbridge.orbitinu.store/getwinnerlist').then(res => {
        // const res = axios.get('http://95.217.102.121:443/getwinnerlist').then(res => {
        if (res.data && res.data.length > 1)
          // console.log(res.data);
          this.setState({winnerList: res.data})
        else
          this.setState(this.props.setGotoMainpage(true))
      });
    } catch (err) {
      this.setState(this.props.setGotoMainpage(true))
      console.log(err);
    }
  }

  shortLen (address) {
    return (address.substring(0, 5) + "..." + address.substring(address.length - 3)).toLocaleLowerCase();
  }

  render() {
    return (
      <div className="background-holder">
        <div id="lamp-1" ref={this.lamps[0]} className="spotlight_swivel">
          <div className="lamp"></div>
        </div>
        <div id="lamp-2" ref={this.lamps[1]} className="spotlight_swivel">
          <div className="lamp"></div>
        </div>
        <div className="boards">
          <div className="board-holder">
            {/* <img className="board" ref={this.board1} src={Board1} alt="" /> */}
            <div ref={this.board1} className="board">
              <h2>!Fomo Jackpot Winners!</h2>
              <table>
                <tr>
                  <td>No</td>
                  <td >Address</td>
                  <td >Deposit</td>
                  <td >Bonus</td>
                </tr>
                {this.state.winnerList.map((val, key) => {
                  return (
                    <tr key={key}>
                      <td style={{ width: "20px" }}>{key + 1 + "."}</td>
                      <td style={{ color: "white", textAlign: "center" }}>{this.shortLen(val.address)}</td>
                      <td style={{ textAlign: "center" }}>{val.amount + " BUSD"}</td>
                      <td style={{ textAlign: "center" }}>{(500 - key * 100) + " BUSD"}</td>
                    </tr>
                  )
                })}
              </table>
              <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
                <button className="go-button" onClick={e => this.props.setGotoMainpage(true)}>Go to Main Page</button>
              </div>
            </div>
            <Sparkle
              color={"#FFF"}
              count={50}
              minSize={10}
              maxSize={14}
              overflowPx={0}
              fadeOutSpeed={50}
              newSparkleOnFadeOut={true}
              flicker={true}
              flickerSpeed={"normal"}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Background;

