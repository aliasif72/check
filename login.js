    //SCRIPT
    const msg= document.getElementById('msg');

    //SIGNUP FORM
    document.getElementById("signup").onclick= async function()
 {
    window.location.href="/signup.html";
 }

    //LOGIN 
    document.getElementById("sbmt").onclick= async function(event)
      {
           event.preventDefault();

          const email= event.target.emailID.value;
          const password= event.target.pass.value;
          const userData={
                    email,
                    password
                  }
      try{
            let res=await axios.post("http:localhost:3000/user/login",userData);
            localStorage.setItem('token',res.data.token);
            localStorage.setItem('limit',1);
            window.location.href="/addexpense.html"
                    
              }
     catch(err)
        {
            console.log(err);
            msg.innerHTML=msg.innerHTML+`<div style="color:red;">${err.response.data}</div>`;
            setTimeout(()=>
            msg.innerHTML='',800)
                                     }
              }
