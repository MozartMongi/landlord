// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract TuanTanah {
    address OwnerAdd;

        constructor(){
            OwnerAdd = msg.sender;
        }

        modifier onlyOwner {
            require(msg.sender == OwnerAdd, "Hanya owner yang bisa menjalankan!");
            _;
        }

        struct DataTanah {
            string pemilik;
            string lokasi;
            uint luas;
            uint blockTime;
            uint blockNumber;
        }

        mapping(string => DataTanah) public infoTanah;

        function registerTanah(string memory _sertifikat, string memory _pemilik, string memory _lokasi, uint _luas) public onlyOwner {
            infoTanah[_sertifikat].pemilik = _pemilik;
            infoTanah[_sertifikat].lokasi = _lokasi;
            infoTanah[_sertifikat].luas = _luas;
            infoTanah[_sertifikat].blockTime = block.timestamp;
            infoTanah[_sertifikat].blockNumber = block.number;
        }

        function getInfoTanah(string memory _sertifikat) public view returns (string memory sertifikat, string memory pemilik, string memory lokasi, uint luas) {
            sertifikat = _sertifikat;
            pemilik = infoTanah[_sertifikat].pemilik;
            lokasi = infoTanah[_sertifikat].lokasi;
            luas = infoTanah[_sertifikat].luas;
        }

        function gantiPemilik(string memory _sertifikat, string memory _pemilik) public onlyOwner {
            infoTanah[_sertifikat].pemilik = _pemilik;
        }
}
// 0xfaaEE67Ff1FBCdE5F6c1d436Ce3bC4F9905942ae