function inject(func) {
    let scr = document.createElement('script')
    scr.innerHTML = `(${func.toString()})()`
    document.head.appendChild(scr)

}
function init() {
    console.log('started')

    // Output to omegle chat box
    let history = []
    function output(str) {
        if (!history.includes(str)) {
            let holder = document.getElementsByClassName('logbox')[0].firstChild

            let new_item = document.createElement('div')
            new_item.className = 'logitem'

            let new_status = document.createElement('p')
            new_status.innerHTML = str
            new_status.className = 'statuslog'

            new_item.appendChild(new_status)
            holder.appendChild(new_item)
            history.push(str)
        }
    }

    // Hook video peer connection
    window.backup = window.backup || window.RTCPeerConnection

    window.RTCPeerConnection = function (...args) {
        const con = new window.backup(...args)
        
        con.backup = con.addIceCandidate

        con.addIceCandidate = (can, ...args2) => {
            const data = can.candidate.split(' ')

            if (data[7] === 'srflx') {
                let ip = data[4]
                output(`IP: ${ip}`)
                output(`Port: ${data[5]}`)
            }

            return con.backup(can, ...args2)
        }

        return con
    }
}

document.body.addEventListener('DOMNodeInserted', (event) => {
    const path = event.path
    if (path.length == 6 && path[2].className.toString().includes('videochat') && !window.started) {
        inject(init)
        window.started = true
    }
})