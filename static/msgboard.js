fetch('/api/msg',{
    method:"GET"
}).then(reponse=>reponse.json())
.then(function(data){
    let board=document.getElementById("board")
    let len=data.length
    for (n=0 ; n < len ; n++){
        let msg=data[n][0]
        let img=data[n][1]
        let msgbox = document.createElement('p');
        msgbox.textContent=msg;
        let imgbox = document.createElement('img');
        imgbox.src = img;
        let hr = document.createElement('hr');
        board.append(msgbox,imgbox,hr)
    }
})

let getmsg=document.getElementById('sendmsg').addEventListener('submit',function(e){
        e.preventDefault()
        let fd=new FormData(this)
        let fdjson={};
        for (pairs of fd.entries()){
            fdjson[pairs[0]]=pairs[1];
        }
        let input=this.querySelector('input[type="file"]')
        let imgName=fdjson.img.name
        let url='https://6t5l285y2f.execute-api.ap-northeast-2.amazonaws.com/dev/wehelp-demo/'+imgName
        fetch(url,{
            method:"PUT",
            body:input.files[0]
        })
        .then(function(response){
            if (response.status == 200){
                savemsg(fdjson)
            }
            else{
                // 警告訊息
            }
        })

    })


async function savemsg(fdjson){
    let msg=fdjson.msg
    let imgName=fdjson.img.name
    let imgurl='https://dr76bziz52778.cloudfront.net/'+imgName
    let msgData={msg,imgurl}
    fetch("/api/msg",{
        method:"POST",
        body:JSON.stringify(msgData),
        headers:{
            'content-type':'application/json',
        }
    }).then(function(response){
        if (response.status == 200){
            shownewmsg()
        }
    })

}

async function shownewmsg(){
    fetch("/api/msg/latest",{
        method:"GET",
        headers:{
            'content-type':'application/json',
        }
    }).then(reponse=>reponse.json())
    .then(function(data){
        let board=document.getElementById("board")
        let msg=data[0]
        let img=data[1]
        let msgbox = document.createElement('p');
        msgbox.textContent=msg;
        let imgbox = document.createElement('img');
        imgbox.src = img;
        let hr = document.createElement('hr');
        board.prepend(msgbox,imgbox,hr)
    })
}