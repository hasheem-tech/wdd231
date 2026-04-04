const params=new URLSearchParams(window.location.search);
const date = new Date(params.get('timestamp'));
const clean = date.toString().split(' (')[0];
document.getElementById('output').innerHTML=
`<p>Name: ${params.get('fname')} ${params.get('lname')}</p>
<p>Email: ${params.get('email')}</p>
<p>Phone: ${params.get('phone')}</p>
<p>Organization: ${params.get('org')}</p>
<p>Submitted: ${clean}</p>`;