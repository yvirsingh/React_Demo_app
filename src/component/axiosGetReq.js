import axios from 'axios'

const getData = (url , type) => {
    return axios({
        mthod: 'get',
        url: url,
        headers : {"Content-type" : "application/json" , "Access-Control-Allow-Origin": "*"}
    })
    .then((res) => {
        return res.data;
    })
    .catch(err => {
        alert("Cannot Process Your Request! Please Check Your Server")
    })
}

export default getData