import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [sertifikat, setSertifikat] = useState('')
  const [pemilik, setPemilik] = useState('')
  const [luas, setLuas] = useState(0)
  const [lokasi, setLokasi] = useState('')
  const [infosertifikat, setInfoSertifikat] = useState('')
  const [infoluas, setInfoLuas] = useState(0)
  const [infopemilik, setInfoPemilik] = useState('')
  const [infolokasi, setInfoLokasi] = useState('')
  const [isRegistSuc, setIsRegistSuc] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadInfo, setLoadInfo] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [isikontrak, setIsikontrak] = useState()
  const [acc, setAcc] = useState()
  const [change, setChange] = useState({
    sertifikat, pemilik
  })
  let web3;

  async function loadWeb3() {
            //---if MetaMask is available on your web browser---
            if (window.ethereum) {
                web3 = new Web3(window.ethereum);
                //---connect to MetaMask---
                const account = await window.ethereum.request(
                {method: 'eth_requestAccounts'});
                // console.log(account)
            } else {            
                //---set the provider you want from Web3.providers---            
                web3 = new Web3(
                new Web3.providers.HttpProvider(
                    "http://localhost:7545"));
            }
        }

  async function loadContract() {
        const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"string","name":"_sertifikat","type":"string"},{"internalType":"string","name":"_pemilik","type":"string"}],"name":"gantiPemilik","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_sertifikat","type":"string"}],"name":"getInfoTanah","outputs":[{"internalType":"string","name":"sertifikat","type":"string"},{"internalType":"string","name":"pemilik","type":"string"},{"internalType":"string","name":"lokasi","type":"string"},{"internalType":"uint256","name":"luas","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"infoTanah","outputs":[{"internalType":"string","name":"pemilik","type":"string"},{"internalType":"string","name":"lokasi","type":"string"},{"internalType":"uint256","name":"luas","type":"uint256"},{"internalType":"uint256","name":"blockTime","type":"uint256"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_sertifikat","type":"string"},{"internalType":"string","name":"_pemilik","type":"string"},{"internalType":"string","name":"_lokasi","type":"string"},{"internalType":"uint256","name":"_luas","type":"uint256"}],"name":"registerTanah","outputs":[],"stateMutability":"nonpayable","type":"function"}];
        const address = '0xeF261E1e411E30B5121c8e96435Cc9723E6959cD';
        return await new web3.eth.Contract(abi,address);               
      }

  async function getCurrentAccount() {
      const accounts = await web3.eth.getAccounts();
      // console.log('account',accounts)
      return accounts[0];
  }

  useEffect( () => {
    async function loadEverything() {
      await loadWeb3();
      setIsikontrak(await loadContract())
      setAcc(await getCurrentAccount())
    }
    loadEverything()
  }, [])

  const handleRegist = async () => {
    setIsLoading(true)
    await loadWeb3();
    // let isiKontrak = await loadContract();
    let account = await getCurrentAccount();
    isikontrak.methods.registerTanah(sertifikat, pemilik, lokasi, luas).send({from:account})
    .then(res => {
      // console.log('registe red', res);
      setIsLoading(false)
      setIsRegistSuc(true)
    })
    .catch(err => {
      if(err.code == -32603){
        toast.error('Tidak Memiliki Wewenang', {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
      setIsLoading(false)
      // console.log('error', err);
    })
  }

  const hanldeInfoTanah = async () => {
    setLoadInfo(true)
    await loadWeb3();
    isikontrak.methods.getInfoTanah(sertifikat).call({from:acc})
        .then(res => {
            // console.log('cek tanah',res)
            setInfoSertifikat(res.sertifikat)
            setInfoPemilik(res.pemilik)
            setInfoLokasi(res.lokasi)
            setInfoLuas(res.luas)
            setLoadInfo(false)
            setShowInfo(true)
        })
        .catch(err => {
            // console.log('error',err);
            toast.error('Ulangi beberapa saat lagi', {
              position: "top-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              });
            setLoadInfo(false)
      });
  }

  const handleChangeOwner = async () => {
    setIsLoading(true)
    await loadWeb3();
    isikontrak.methods.gantiPemilik(change.sertifikat, change.pemilik).send({from:acc})
    .then(res => {
      toast.success('Ganti Pemilik Berhasil', {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
      setIsLoading(false)
      // console.log('berhasil');
    })
    .catch(err => {
      if(err.code === -32603){
        toast.error('Tidak Memiliki Wewenang', {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
      
      setIsLoading(false)
    })
  } 
  return (
    <>
    <ToastContainer
      position="top-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      />
    <div className="App  shadow rounded m-5 py-2" style={{background: '#ebedeb'}}>
      <h1 className='mt-3'>Desentralisasi Pertanahan</h1>
      <div className="px-4 pt-5 pb-4">
        <div className='row'>
          <div className='col-6' >
          <input required className='form-control border-primary mb-3' placeholder='Sertifikat' type='text'
            onChange={(e) => setSertifikat(e.target.value)}
          />
          <input required className='form-control border-primary mb-3' placeholder='Pemilik' type='text'
            onChange={(e) => setPemilik(e.target.value)}
          />
          <input required className='form-control border-primary mb-3' placeholder='Lokasi' type='text'
            onChange={(e) => setLokasi(e.target.value)}
          />
          <div class="input-group mb-3">
            <input required type="text" className="form-control border-primary" placeholder="luas" aria-label="luas" aria-describedby="basic-addon2"
              onChange={(e) => setLuas(e.target.value)}
            />
            <span class="input-group-text border-primary" id="basic-addon2">meter &sup2;</span>
          </div>
          </div>
          <div className='col-6 px-4 border rounded border-primary' >
            {
              isLoading && (
                <div className="spinner-border mt-5" style={{width: '3rem', height:'3rem'}} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>

              )
            }
            {isRegistSuc && (
              <>
                <p className='fs-2 text-primary border-bottom border-primary'>Berhasil Didaftarkan</p>
                <div className='text-start'>
                  <p>{`No. Sertifikat : ${sertifikat}`}</p>
                  <p>{`Pemilik : ${pemilik}`}</p>
                  <p>{`Lokasi : ${lokasi}`}</p>
                  <p>{`Luas : ${luas} ` }M &sup2;</p>
                </div>
              </>
              
            )}
          </div>
        </div>
      </div>
      <div className='mb-5'>
      {
        isLoading ? (
          <button className="btn btn-lg btn-primary mb-5" type="button" disabled>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Loading...
          </button>
        ) : (
          <button onClick={handleRegist} type="button" className="btn btn-lg btn-primary w-25 mb-5">Daftarkan</button>
        )
      }
        <button type="button"className="btn btn-outline-dark w-25 mb-5 btn-lg ms-2" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">Ganti Pemilik</button>

      </div>
        <div className='mt-5 px-4 mb-5'>
        <h1 className='mt-3'>Telusuri informasi Tanah</h1>
          <input className='form-control border-secondary' placeholder='Masukan sertifikat yang akan dicek' type='text'
            onChange={(e) => setSertifikat(e.target.value)}
          />
          {
            showInfo && (
              <div className='bg-secondary px-3 py-3 mt-1'>
                <div className='text-start text-light'>
                  <p>{`No. Sertifikat :  `}<b>{infosertifikat}</b></p>
                  <p>{`Pemilik : `}<b>{infopemilik}</b></p>
                  <p>{`Lokasi : `}<b>{infolokasi}</b></p>
                  <p>{`Luas : `}<b>{infoluas}</b> M &sup2;</p>
                </div>
              </div>
            )
          }
          
          {
            !loadInfo ? (
              <button className='btn btn-lg btn-secondary w-25 mt-5' onClick={hanldeInfoTanah}>
                Lihat info Tanah
              </button>
            ) : (
              <button className="btn btn-lg btn-secondary mb-5" type="button" disabled>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Loading...
              </button>
            )
          }
          
        </div>
        <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Form ganti pemilik</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label for="recipient-name" className="col-form-label">Sertifikat:</label>
                    <input onChange={(e) => setChange({...change ,sertifikat: e.target.value}) } required type="text" className="form-control" id="recipient-name"/>
                  </div>
                  <div className="mb-3">
                    <label for="message-text" className="col-form-label">Pemilik baru:</label>
                    <input onChange={(e) => setChange({...change ,pemilik: e.target.value}) } required type="text" className="form-control"/>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                {
                  isLoading ? (
                    <button className="btn btn-primary" type="button" disabled>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Loading...
                    </button>
                  ) : (
                    <button onClick={handleChangeOwner} type="button" className="btn btn-primary">Ubah Kepemilikan</button>
                  )
                }
              </div>
            </div>
          </div>
        </div>
    </div>
    </>
  );
}

export default App;
