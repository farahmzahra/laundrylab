import axios from "axios"

// const startUrl = "http://127.0.0.1:5000/"
const startUrl = "https://laundrylab.pocari.id/"

const ApiController = async info => {
    const AuthStr = info.token ? `Bearer ${info.token}` : '';

    console.log(info)
    let apiLink = startUrl + info['endpoint']
    if(info['method'] == 'GET'){
        try{
            // const resp = await axios.get(apiLink, { headers: { Authorization: "Bearer " + AuthStr } })
            const resp = await axios.get(apiLink, { headers: { Authorization: AuthStr } });
            return resp
        }catch(err){
            console.log(err)
        }
    } else if(info['method'] == 'POST'){
        if(info['sendForm'] != null ){
            let head = info['datas']
            try{
                const resp = await axios.post(apiLink, info['datas'], {
                    headers: {"Content-Type": "multipart/form-data"}
                })

                return resp
            }catch(err){
                console.log(err)
            }
        }else{
            console.log(info['datas'])
            try{
                const resp = await axios.post(apiLink, info['datas'])
                return resp
            }catch(err){
                console.log(err)
            }
        }
    } else if (info['method'] === 'PUT') {
        let headers = { Authorization: AuthStr };
        if(info['sendForm']) {
            headers["Content-Type"] = "multipart/form-data";
        }
        try {
            const resp = await axios({
                method: info['method'],
                url: apiLink,
                data: info['datas'],
                headers: headers
            });
            return resp;
        } catch(err) {
            console.log(err);
        }
    } else if (info['method'] === 'DELETE') {
        try {
            const resp = await axios.delete(apiLink, { headers: {Authorization: AuthStr} });
            return resp;
        } catch (err) {
            console.log(err);
        }
    }
}

export default ApiController;