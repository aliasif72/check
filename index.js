

document.getElementById("razor").onclick= async function(e)
{ 
    const token=localStorage.getItem('token');
const res=await axios.get("http://54.173.174.245:3000/purchase/premium", {headers: {"authorization":token}})
var options={
 "key":res.data.key_id,
 "order_id":res.data.order.id,
 "handler": async function(res)
 {
  const res1= await axios.post("http://54.173.174.245:3000/purchase/updatestatus",{
     order_id:options.order_id,
     payment_id:res.razorpay_payment_id
  }, {headers: {"authorization": token}})
   alert('you are  a premium user now')
   document.getElementById('razor').style.visibility="hidden";
   document.getElementById('show').innerHTML= `<p style="color:green"> You are a Premium User <p>`;
   const change=document.getElementById('chn');
   change.innerHTML= `<input type="button" id="leader" style="margin-top:4.7%;float:left;" value="Show Leaderboard"
   class="submitBtn">`;
   localStorage.setItem('token', res1.data.token); 
}
};


const rzp1=new Razorpay(options);
rzp1.open();
e.preventDefault();
rzp1.on('payment.failed', function(res){
 console.log(res);
alert('something went wrong');
});
}
