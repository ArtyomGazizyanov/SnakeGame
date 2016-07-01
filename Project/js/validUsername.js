function ValidUsername() 
{
    var re = /^[a-z]$/i;
    var username = document.getElementById('playerName').value;
    var valid = re.test(myMail);
    if (valid) 
    {
        output = 'username эл. почты введен правильно!';
    }
    else
    {
        output = 'username электронной почты введен неправильно!';
    }
    document.getElementById('message').innerHTML = output;
    return valid;
}