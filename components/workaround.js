import React, {useState} from 'react';

const [success, setSuccess] = useState({
    nonce: '',
    payerId: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

module.exports = { success, setSuccess };