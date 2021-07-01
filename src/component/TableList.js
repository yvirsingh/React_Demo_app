import React, { useEffect, useState } from 'react'
import getData from './axiosGetReq';
import baseUrl from '../url.config'

function TableList({ data }) {

    const [keysOfApi, setkeysOfApi] = useState({});
    const [latestversion, setlatestversion] = useState({});
    const [vulnr, setvulnr] = useState({});

    useEffect(async () => {
        let mounted = true;
        if (mounted) {
            const d = await Object.entries(data).map(([key, value]) => {
                return key
            })
            setkeysOfApi(d);
        }

        return (() => {
            mounted = false
        })
    }, [data])


    const getLateste = async () => {
        let latest = [];
        for (let i = 0; i < keysOfApi.length; i++) {
            if (keysOfApi[i].indexOf("/" > 0)) {
                let nameT = keysOfApi[i].substring(keysOfApi[i].indexOf("/") + 1);
                const d = await getData(`${baseUrl}/outdate/${nameT}`);
                latest.push(d);
            }
            else {
                const d = await getData(`${baseUrl}/outdate/${keysOfApi[i]}`);
                latest.push(d);
            }
        }
        setlatestversion(latest);
        getVulnerabilites();
    }

    const getVulnerabilites = async () => {
        let vulnr = [];
        for (let i = 0; i < keysOfApi.length; i++) {
            if (keysOfApi[i].indexOf("/" > 0)) {
                let nameT = keysOfApi[i].substring(keysOfApi[i].indexOf("/") + 1);
                const d = await getData(`${baseUrl}/audit/${nameT}`);
                if(d) {
                    if (d.v === 0) {
                        vulnr.push("No");
                    } else {
                        vulnr.push("Yes")
                    }
                }
             
            }
            else {
                const d = await getData(`${baseUrl}/audit/${keysOfApi[i]}`);
                if(d.v) {
                    if (d.v === 0) {
                        vulnr.push("No");
                    } else {
                        vulnr.push("Yes")
                    }
                }
            }
        }
        setvulnr(vulnr);
    }

    const isOutDated = (current, latest) => {

        let c = parseInt(current.replace(/[^a-zA-Z0-9.]/g, '')) ^ 0;
        let l = parseInt(latest);
        if (c < l || c === l) {
            return "No"
        }
        else {
            return "Yes"
        }
    }

    const hasAt = (val) => {
        let k = val.split('');
        if (k[0] === '@') {
            return true
        }
    }
    return (
        <div className="container mt-5 table-responsive">
            <button onClick={getLateste} className="btn butonCls mb-3">Click To Get Version Details</button>
            <table className="table bg-light table-hover">
                <thead>
                    <tr>
                        <th scope="col">Package Name</th>
                        <th scope="col">Current</th>
                        <th scope="col">Latest</th>
                        <th scope="col">Outdated</th>
                        <th scope="col">Vulnerability</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        Object.entries(data).map(([key, val], i) => {
                            return (
                                <tr key={i} className={hasAt(key) ? 'hideRows' : null}>
                                    <td>{key}</td>
                                    <td>{val}</td>
                                    <td>{latestversion[i]}</td>
                                    <td>{(latestversion.length > 0) ? isOutDated(val, latestversion[i]) : '-'}</td>
                                    <td>{(vulnr.length > 0) ? vulnr[i] : '-'}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TableList
