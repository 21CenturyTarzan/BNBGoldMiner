import { useCallback, useEffect, useState } from "react";
import web3ModalSetup from "./../helpers/web3ModalSetup";
import Web3 from "web3";
import getAbi from "../Abi";
import getAbiBusd from "../Abi/busd";
import logo from "./../assets/logo.png";
import audit from "./../assets/audit.png";
import dapprader from "./../assets/dapprader.png";
import dapp from "./../assets/dapp.png";





/* eslint-disable no-unused-vars */
const web3Modal = web3ModalSetup();

const Interface = () => {
  const [Abi, setAbi] = useState();
  const [AbiBusd, setAbiBusd] = useState();
  const [web3, setWeb3] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const [injectedProvider, setInjectedProvider] = useState();
  const [refetch, setRefetch] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [current, setCurrent] = useState(null);
  const [connButtonText, setConnButtonText] = useState("CONNECT");
  const [refLink, setRefLink] = useState(
    "https://dinobusd.finance/?ref=0x0000000000000000000000000000000000000000"
  );
  const [contractBalance, setContractBalance] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [userInvestment, setUserInvestment] = useState(0);
  const [userDailyRoi, setUserDailyRoi] = useState(0);
  const [dailyReward, setDailyReward] = useState(0);
  const [startTime, setClaimStartTime] = useState(0);
  const [deadline, setClaimDeadline] = useState(0);
  const [approvedWithdraw, setApprovedWithdraw] = useState(0);
  const [lastWithdraw, setLastWithdraw] = useState(0);
  const [nextWithdraw, setNextWithdraw] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [refferalReward, setRefferalReward] = useState(0);
  const [refTotalWithdraw, setRefTotalWithdraw] = useState(0);
  const [value, setValue] = useState('');
  const [balance, setBalance] = useState(0);

  const [pendingMessage, setPendingMessage] = useState('');
  const [allowance, setAllowance] = useState();
  const [calculate, setCalculator] = useState('');



  const queryParams = new URLSearchParams(window.location.search);
  let DefaultLink = queryParams.get("ref");

  if (DefaultLink === null) {
    DefaultLink = "0xBc0F471287571ceBf89c3aa7d1008FCd0a9d9c07";

  }

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (
      injectedProvider &&
      injectedProvider.provider &&
      typeof injectedProvider.provider.disconnect == "function"
    ) {
      await injectedProvider.provider.disconnect();
    }
    setIsConnected(false);

    window.location.reload();
  };
  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new Web3(provider));
    const acc = provider.selectedAddress
      ? provider.selectedAddress
      : provider.accounts[0];


    const short = shortenAddr(acc);

    setWeb3(new Web3(provider));
    setAbi(await getAbi(new Web3(provider)));
    setAbiBusd(await getAbiBusd(new Web3(provider)));
    setAccounts([acc]);
    setCurrent(acc);
    //     setShorttened(short);
    setIsConnected(true);

    setConnButtonText(short);

    provider.on("chainChanged", (chainId) => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new Web3(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new Web3(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider]);

  useEffect(() => {
    setInterval(() => {
      setRefetch((prevRefetch) => {
        return !prevRefetch;
      });
    }, 10000);
  }, []);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
    // eslint-disable-next-line
  }, []);

  const shortenAddr = (addr) => {
    if (!addr) return "";
    const first = addr.substr(0, 3);
    const last = addr.substr(38, 41);
    return first + "..." + last;
  };

  useEffect(() => {
    const refData = async () => {
      if (isConnected && web3) {
        // now the referal link not showing
        const balance = await web3.eth.getBalance(current);

        const refLink = "https://dinobusd.finance/?ref=" + current;
        setRefLink(refLink);
        setBalance(web3.utils.fromWei(balance));
      }
    };

    refData();
  }, [isConnected, current, web3, refetch]);





  useEffect(() => {
    const AbiContract = async () => {
      if (!isConnected || !web3) return;
      const contractBalance = await Abi.methods.getBalance().call();


      setContractBalance(contractBalance / 10e17);


    };

    AbiContract();
  }, [isConnected, web3, Abi, refetch]);


  useEffect(() => {
    const Contract = async () => {
      if (isConnected && Abi) {
        console.log(current);

        let userBalance = await AbiBusd.methods.balanceOf(current).call();
        setUserBalance(userBalance);

        let userInvestment = await Abi.methods.investments(current).call();
        setUserInvestment(userInvestment.invested / 10e17);

        let dailyRoi = await Abi.methods.DailyRoi(userInvestment.invested).call();
        setUserDailyRoi(dailyRoi / 10e17);

        let dailyReward = await Abi.methods.userReward(current).call();
        setDailyReward(dailyReward / 10e17);





      }
    };

    Contract();
    // eslint-disable-next-line
  }, [refetch]);

  useEffect(() => {
    const Withdrawlconsole = async () => {
      if (isConnected && Abi) {
        let approvedWithdraw = await Abi.methods.approvedWithdrawal(current).call();
        setApprovedWithdraw(approvedWithdraw.amount / 10e17);

        let totalWithdraw = await Abi.methods.totalWithdraw(current).call();
        setTotalWithdraw(totalWithdraw.amount / 10e17);
      }
    }
    Withdrawlconsole();
    // eslint-disable-next-line
  }, [refetch]);

  useEffect(() => {
    const TimeLine = async () => {
      if (isConnected && Abi) {
        let claimTime = await Abi.methods.claimTime(current).call();
        if (claimTime.startTime > 0) {
          let _claimStart = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(claimTime.startTime + "000");
          let _claimEnd = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(claimTime.deadline + "000");
          setClaimStartTime(_claimStart);

          setClaimDeadline(_claimEnd);





          let weekly = await Abi.methods.weekly(current).call();
          let _start = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(weekly.startTime + "000");
          let _end = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(weekly.deadline + "000");

          setLastWithdraw(_start);
          setNextWithdraw(_end);
        }
      }
    }
    TimeLine();
    // eslint-disable-next-line
  }, [refetch]);


  useEffect(() => {
    const ContractReward = async () => {
      if (isConnected && Abi) {


        let refEarnedWithdraw = await Abi.methods.refferal(current).call();
        setRefferalReward(refEarnedWithdraw.reward / 10e17);

        let refTotalWithdraw = await Abi.methods.refTotalWithdraw(current).call();
        setRefTotalWithdraw(refTotalWithdraw.totalWithdraw / 10e17);


      }
    };

    ContractReward();
    // eslint-disable-next-line
  }, [refetch]);

  useEffect(() => {
    const approvalallowance = async () => {
      if (isConnected && AbiBusd) {

        let _contract = '0xb9150107F2820930D997a91f03Ba81A8d625F337';
        let _allowance = await AbiBusd.methods.allowance(current, _contract).call();
        setAllowance(_allowance);


      }
    };

    approvalallowance();
    // eslint-disable-next-line
  }, [refetch]);



  // buttons

  const ClaimNow = async (e) => {
    e.preventDefault();
    if (isConnected && Abi) {
      console.log("success")
      setPendingMessage("Claiming Funds")
      await Abi.methods.claimDailyRewards().send({
        from: current,
      });
      setPendingMessage("Claimed Successfully");

    } else {
      console.log("connect wallet");
    }
  };

  const withDraw = async (e) => {
    e.preventDefault();
    if (isConnected && Abi) {
      console.log("success")
      setPendingMessage("Withdrawing funds")
      await Abi.methods.withdrawal().send({
        from: current,
      });
      setPendingMessage("Successfully Withdraw");

    } else {
      console.log("connect wallet");
    }
  };

  const refWithdraw = async (e) => {
    e.preventDefault();
    if (isConnected && Abi) {
      console.log("success")
      setPendingMessage("Rewards withdrawing")
      await Abi.methods.Ref_Withdraw().send({
        from: current,
      });
      setPendingMessage("Successfully Withdraw");

    } else {
      console.log("connect wallet");
    }
  };

  const approval = async (e) => {
    e.preventDefault();
    if (isConnected && AbiBusd) {
      console.log("success")
      setPendingMessage("Approving Busd");
      let contract = '0xb9150107F2820930D997a91f03Ba81A8d625F337';
      let _amount = '99999999999999999999999999999999999';
      await AbiBusd.methods.approve(contract, _amount).send({
        from: current,
      });
      setPendingMessage("Approved Successfully");
    }
    else {
      console.log("connect wallet");
    }
  };

  const closeBar = async (e) => {
    e.preventDefault();
    setPendingMessage('');
  }

  const deposit = async (e) => {
    e.preventDefault();
    if (isConnected && Abi) {
      console.log("success")
      setPendingMessage("Deposit Pending...!")
      let _value = web3.utils.toWei(value);
      await Abi.methods.deposit(DefaultLink, _value).send({
        from: current,
      });
      setPendingMessage("Successfully Deposited")
    }
    else {
      console.log("connect wallet");
    }
  };

  const unStake = async (e) => {
    e.preventDefault();
    if (isConnected && Abi) {
      setPendingMessage("Unstaking");
      await Abi.methods.unStake().send({
        from: current,
      });
      setPendingMessage("UnStaked Successfully");
    }
    else {
      console.log("connect Wallet");
    }
  };


  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-dark" style={{ background: "black" }}>
        <div className="container-fluid">
          <a className="navbar-brand" href="https://dinobusd.finance"><img src={logo} alt="logo" className="img-fluid" style={{ width: "200px" }} /></a>
          {/* <ul className="navbar-nav me-auto">

            <li className="nav-item">
              <a className="nav-link" href="whitepaper.pdf">WHITEPAPER</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="audit.pdf">AUDIT</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://roulette.dinobusd.finance">ROULETTE</a>
            </li>
          </ul>

          <a href="https://lotto.dinobusd.finance" className="btn btn-primary btn-lg btnd" style={{ background: "black", color: "#f68f19", border: "1px solid #fff" }}>Lottery</a>
          <a href="https://roulette.dinobusd.finance" className="btn btn-primary btn-lg btnd" style={{ background: "black", color: "#f68f19", border: "1px solid #fff" }}>Roulette</a>
          <a href="https://poollotto.dinobusd.finance" className="btn btn-primary btn-lg btnd" style={{ background: "black", color: "#f68f19", border: "1px solid #fff" }}>PoolLotto</a> */}
          <button className="btn btn-primary btn-lg btnd" style={{ background: "#FFD167", color: "black", border: "1px solid #fff" }} onClick={loadWeb3Modal}><i className="fas fa-wallet"></i> {connButtonText}</button>
        </div>
      </nav>
      <br />
      <div className="container">

        {pendingMessage !== '' ?
          <>
            <center><div className="alert alert-warning alert-dismissible">
              <p onClick={closeBar} className="badge bg-dark" style={{ float: "right", cursor: "pointer" }}>X</p>
              {pendingMessage}</div></center>
          </> :

          <></>
        }

        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div className="card">
              <div className="dashboard card-body">
                <center>  <h3>Contract Balance</h3>
                  <h4> {Number(contractBalance).toFixed(2)} BUSD</h4>
                </center>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div className="card">
              <div className="dashboard card-body">
                <center>  <h3>Daily ROI</h3>

                  <h4>8%</h4>

                </center>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div className="card">
              <div className="dashboard card-body">
                <center>  <h3>Withdrawal Fee</h3>

                  <h4>2%</h4>

                </center>

              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12">
            <div className="card">
              <div className="dashboard card-body">
                <center>  <h3>Deposit Fee</h3>

                  <h4>6%</h4>

                </center>
              </div>
            </div>
          </div>

        </div>

      </div>
      <br />
      <div className="container">
        <div className="row">


          <div className="col-lg-4 col-md-12 col-sm-12">
            <div className="card cardDino">

              <div className="investment card-body">
                <h4><b>Investment Portal</b></h4>
                <hr />
                <table className="table">
                  <tbody>
                    <tr>
                      <td><h5><b>Wallet Balance</b></h5></td>
                      <td style={{ textAlign: "right" }}><h5>{Number(userBalance / 10e17).toFixed(2)} BUSD</h5></td>
                    </tr>

                    <tr>
                      <td><h5><b>User Invested</b></h5></td>
                      <td style={{ textAlign: "right" }}><h5>{Number(userInvestment).toFixed(2)} BUSD</h5></td>
                    </tr>

                    <tr>
                      <td><h5><b>5x Profit</b></h5></td>
                      <td style={{ textAlign: "right" }}><h5>{Number(userInvestment * 5).toFixed(2)} BUSD</h5></td>
                    </tr>

                    <tr>
                      <td><h5><b>5x Remaining</b></h5></td>
                      <td style={{ textAlign: "right" }}><h5>{Number(userInvestment * 5 - totalWithdraw).toFixed(2)} BUSD</h5></td>
                    </tr>

                    <tr>
                      <td><h5><b>Daily User ROI</b></h5></td>
                      <td style={{ textAlign: "right" }}><h5>{Number(userDailyRoi).toFixed(2)} BUSD</h5></td>
                    </tr>
                  </tbody>
                </table>

                <form onSubmit={deposit}>
                  <table className="table">
                    <tbody>
                      <tr><td>  <input
                        type="number"
                        placeholder="50 BUSD"
                        className="form-control"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                      />
                      </td>



                        <td style={{ textAlign: "right" }}>
                          {allowance > 0 ? <>
                            <button className="btn btn-primary btn-lg" style={{ background: "black", color: "#fff", border: "1px solid #fff" }}>DEPOSIT</button>

                          </>

                            :

                            <>
                              <button className="btn btn-primary btn-lg" style={{ background: "black", color: "#fff", border: "1px solid #fff" }} onClick={approval}>APPROVE</button>


                            </>

                          }
                        </td>

                      </tr>
                    </tbody>
                  </table>

                </form>



                <center>
                  <button className="btn btn-primary btn-lg" style={{ background: "black", color: "#fff", border: "1px solid #fff", marginTop: "-10px" }} onClick={unStake}>Emergency Withdraw</button>

                </center>
              </div>
            </div>

          </div>
          <div className="col-lg-4 col-md-12 col-sm-12">
            <div className="card cardDino">
              <div className="statistics card-body">
                <h4><b>Statistics</b></h4>
                <hr />
                <table className="table">
                  <tbody>
                    <tr>
                      <td>
                        <h6>
                          <b>Daily Rewards</b>
                          <br />
                          <span>{Number(dailyReward).toFixed(2)}/{userDailyRoi} BUSD</span>
                        </h6>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button className="btn btn-primary btn-lg claim-btn" onClick={ClaimNow}>Claim
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h6>
                          <b>Last Claim</b>
                          <br />
                          <span>{startTime}</span>
                        </h6>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <h6>
                          <b>Next Claim</b>
                          <br />
                          <span>{deadline}</span>
                        </h6>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h6>
                          <b>Available Withdrawal 50% Allowed</b>
                          <br />
                          <span>{Number(approvedWithdraw).toFixed(2)} BUSD</span>
                        </h6>
                      </td>
                      <td style={{ textAlign: "right" }}><button className="btn btn-primary btn-lg withdraw-btn" onClick={withDraw}>Withdraw</button></td>
                    </tr>
                    <tr>
                      <td>
                        <h6>
                          <b>Last Withdrawal</b>
                          <br />
                          <span>{lastWithdraw}</span>
                        </h6>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <h6>
                          <b>Next Withdrawal</b>
                          <br />
                          <span>{nextWithdraw}</span>
                        </h6>
                      </td>
                    </tr>
                    <tr style={{ border: "none" }}>
                      <td><h5>Total Withdrawn</h5></td>
                      <td style={{ textAlign: "right" }}><h5><span>{Number(totalWithdraw).toFixed(2)} BUSD</span></h5></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-12 col-sm-12">
            <div>
              <div className="card">
                <div className="referral-reward card-body">
                  <h4><b>Referral Rewards  10%</b></h4>
                  <hr />
                  <table className="table">
                    <tbody>
                      <tr>
                        <td><h5>BUSD Rewards</h5></td>
                        <td style={{ textAlign: "right" }}><h5>{refferalReward} BUSD</h5></td>
                      </tr>
                      <tr>
                        <td><h5>Total Withdrawn</h5></td>
                        <td style={{ textAlign: "right" }}><h5>{refTotalWithdraw} BUSD</h5></td>
                      </tr>
                    </tbody>
                  </table>
                  <center> <button className="btn btn-primary btn-lg" style={{ background: "black", color: "#fff", border: "1px solid #fff" }} onClick={refWithdraw}>Withdraw Rewards</button> </center>
                </div>
              </div>
              <br />
              <div className="card">
                <div className="referral-link card-body">
                  <h4><b>Referral Link</b></h4>
                  <hr />
                  <form>
                    Share your Referral Link To Earn 10% of BUSD
                    <input type="text" value={refLink} className="form-control" />

                  </form>
                </div>
              </div>
            </div>
          </div>

        </div>
        <br />
        <div className="row">
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="card">
              <div className="daily-jackpot card-body">
                <h4><b>20% DAILY JACKPOT</b></h4>
                <div className="row">
                  <div className="col-sm-6">
                    <h3>Current Winner</h3>
                    <h4>0x99...34B</h4>
                  </div>
                  <div className="col-sm-6" style={{ textAlign: "right" }}>
                    <h3>Previous Winner</h3>
                    <p>Daily Return: {calculate / 100 * 8} BUSD <br /> Weekly Return: {calculate / 100 * 8 * 7} BUSD  <br /> Monthly Return: {calculate / 100 * 8 * 30} BUSD </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="card">
              <div className="investment-calculator card-body">
                <h4><b>Investment Calculator</b></h4>
                <div className="row">
                  <div className="col-sm-6">
                    <h3>BUSD AMOUNT</h3>
                    <input
                      type="number"
                      placeholder="50"
                      className="form-control"
                      value={calculate}
                      onChange={(e) => setCalculator(e.target.value)}
                    />
                    <p>Amount of returns calculated on the basis of investment amount.
                      <br />
                      <b>Note:</b> Min investment is 50 BUSD & max amount of investment in 100k BUSD.</p>
                  </div>
                  <div className="col-sm-6" style={{ textAlign: "right" }}>
                    <h3>Return of Investment</h3>
                    <p>Daily Return: {calculate / 100 * 8} BUSD <br /> Weekly Return: {calculate / 100 * 8 * 7} BUSD  <br /> Monthly Return: {calculate / 100 * 8 * 30} BUSD </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="contact-container">
          <div className="span-wrapper">
            <span>DOCS</span>
            <span>TWITTER</span>
            <span>TELEGRAM</span>
            <span>CONTRACT</span>
            <span>AUDIT</span>
          </div>
        </div>

        {/* <center>
          <h5>
            <a href="https://twitter.com/dinobusd" style={{ color: "#f68f19", textDecoration: "none" }}>
              <i class="fa fa-twitter"></i> Twitter </a>
            ||
            <a href="https://t.me/DinoBusdOfficial" style={{ color: "#f68f19", textDecoration: "none" }}>
              <i class="fa fa-telegram"></i> Telegram
            </a>
            ||
            <a href="audit.pdf" style={{ color: "#f68f19", textDecoration: "none" }}>
              <i class="fa fa-file-code-o"></i> Audit </a>
            ||
            <a href="https://bscscan.com/address/0xb9150107F2820930D997a91f03Ba81A8d625F337#code" style={{ color: "#f68f19", textDecoration: "none" }}>
              <i class="fa fa-line-chart"></i> Bscscan </a>
          </h5>
        </center> */}
        <br />
      </div>
    </>

  );
}

export default Interface;
